/* js/web-search.js
   Web Search module for Hii~ Momo: AI Assist
   Providers:
     - DuckDuckGo (free, no key — scrapes html.duckduckgo.com)
     - Brave Search API (free tier 2000/month, needs key)
     - Tavily API (free tier 1000/month, needs key)
*/

'use strict';

const WebSearch = (() => {
  const TIMEOUT_MS = 12000;
  const PROMPT_BUDGET = 6000;

  async function getConfig() {
    const defaults = {
      webSearchProvider: 'duckduckgo',
      braveSearchApiKey: '',
      tavilyApiKey: '',
      totalSearchResults: 5,
      simpleInternetSearch: true,
      visitWebsiteInMessage: true
    };
    try {
      const data = await chrome.storage.local.get(Object.keys(defaults));
      return { ...defaults, ...data };
    } catch { return defaults; }
  }

  function fetchWithTimeout(url, opts = {}, ms = TIMEOUT_MS) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...opts, signal: ctrl.signal })
      .finally(() => clearTimeout(timer));
  }

  let _lastDebugLog = [];

  /* ═══════════ DuckDuckGo (free, HTML scraping) ═══════════ */

  function parseDdgHtml(html, maxResults) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const results = [];
    const items = doc.querySelectorAll('.result__body, .results_links_deep');
    for (const el of items) {
      if (results.length >= maxResults) break;
      const titleEl = el.querySelector('.result__a, a.result__a');
      const snippetEl = el.querySelector('.result__snippet, a.result__snippet');
      const linkEl = el.querySelector('a.result__snippet, a.result__url');
      let href = linkEl?.getAttribute('href') || titleEl?.getAttribute('href') || '';
      if (href.includes('//duckduckgo.com/l/?uddg=')) {
        href = href.replace(/.*\/\/duckduckgo\.com\/l\/\?uddg=/, '').replace(/&rut=.*/, '');
        href = decodeURIComponent(href);
      }
      const title = titleEl?.textContent?.trim() || '';
      const snippet = snippetEl?.textContent?.trim() || '';
      if (href && title) results.push({ title, url: href, snippet });
    }
    return results;
  }

  async function fetchViaProxy(url, options) {
    return new Promise((resolve, reject) => {
      if (!chrome?.runtime?.sendMessage) return reject(new Error('no runtime'));
      chrome.runtime.sendMessage(
        { type: 'proxy_fetch', url, options },
        resp => {
          if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
          if (!resp) return reject(new Error('empty proxy response'));
          resolve(resp);
        }
      );
    });
  }

  async function searchDuckDuckGo(query, maxResults) {
    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
    const headers = { 'Accept': 'text/html', 'User-Agent': navigator.userAgent };

    // Attempt 1: direct fetch
    try {
      const resp = await fetchWithTimeout(url, { headers }, 10000);
      if (resp.ok) {
        const html = await resp.text();
        const results = parseDdgHtml(html, maxResults);
        if (results.length > 0) {
          _lastDebugLog.push(`DDG(direct): ${results.length} results`);
          return results;
        }
        _lastDebugLog.push('DDG(direct): 0 results, trying proxy');
      } else {
        _lastDebugLog.push(`DDG(direct): HTTP ${resp.status}, trying proxy`);
      }
    } catch (e) {
      _lastDebugLog.push(`DDG(direct): ${e.message}, trying proxy`);
    }

    // Attempt 2: background proxy
    try {
      const proxyResp = await fetchViaProxy(url, { headers });
      if (proxyResp.ok && proxyResp.text) {
        const results = parseDdgHtml(proxyResp.text, maxResults);
        _lastDebugLog.push(`DDG(proxy): ${results.length} results`);
        return results;
      }
      _lastDebugLog.push(`DDG(proxy): HTTP ${proxyResp.status}`);
    } catch (e) {
      _lastDebugLog.push(`DDG(proxy): ${e.message}`);
    }

    return [];
  }

  /* ═══════════ Brave Search API ═══════════ */

  async function searchBrave(query, apiKey, maxResults) {
    if (!apiKey) throw new Error('Brave Search API Key not configured');
    const url = 'https://api.search.brave.com/res/v1/web/search?' +
      new URLSearchParams({ q: query, count: String(maxResults) });
    const resp = await fetchWithTimeout(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey
      }
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      throw new Error(`Brave HTTP ${resp.status}: ${errText.slice(0, 200)}`);
    }
    const data = await resp.json();
    return (data.web?.results || []).slice(0, maxResults).map(r => ({
      title: r.title || '', url: r.url || '', snippet: r.description || ''
    }));
  }

  /* ═══════════ Tavily API ═══════════ */

  async function searchTavily(query, apiKey, maxResults) {
    if (!apiKey) throw new Error('Tavily API Key not configured');
    const resp = await fetchWithTimeout('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query,
        max_results: maxResults,
        include_answer: false,
        include_raw_content: false,
        search_depth: 'basic'
      })
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => '');
      throw new Error(`Tavily HTTP ${resp.status}: ${errText.slice(0, 200)}`);
    }
    const data = await resp.json();
    return (data.results || []).slice(0, maxResults).map(r => ({
      title: r.title || '', url: r.url || '', snippet: r.content || ''
    }));
  }

  /* ═══════════ Visit Website (fetch page content) ═══════════ */

  function extractUrlsFromText(text) {
    const re = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
    return (text.match(re) || []).map(u => u.replace(/[.,;:!?)]+$/, ''));
  }

  async function fetchPageContent(url) {
    try {
      const resp = await fetchWithTimeout(url, {
        headers: {
          'Accept': 'text/html',
          'User-Agent': navigator.userAgent
        }
      }, 10000);
      if (!resp.ok) return null;
      const ct = resp.headers.get('content-type') || '';
      if (!ct.includes('text/html') && !ct.includes('text/plain')) return null;
      const html = await resp.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      for (const sel of ['script', 'style', 'nav', 'header', 'footer', 'iframe', 'noscript', 'svg', '.sidebar', '.menu', '.ad', '.advertisement']) {
        doc.querySelectorAll(sel).forEach(el => el.remove());
      }

      const article = doc.querySelector('article, main, [role="main"], .post-content, .article-body, .entry-content');
      const body = article || doc.body;
      let text = (body?.innerText || body?.textContent || '').trim();
      text = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
      return text;
    } catch (e) {
      console.warn('[WebSearch] fetchPageContent failed:', url, e.message);
      return null;
    }
  }

  async function visitWebsitesInMessage(userMessage, maxChars = 3000) {
    const urls = extractUrlsFromText(userMessage);
    if (!urls.length) return { hasUrls: false, urls: [], contents: [] };

    const contents = [];
    for (const url of urls.slice(0, 3)) {
      const text = await fetchPageContent(url);
      if (text) {
        const truncated = text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
        contents.push({ url, content: truncated });
      }
    }
    return { hasUrls: true, urls, contents };
  }

  /* ═══════════ Simple vs Full search mode ═══════════ */

  async function fetchFullPageContents(results, query, maxChars = 2000) {
    const enhanced = [];
    for (const r of results.slice(0, 3)) {
      try {
        const pageText = await fetchPageContent(r.url);
        if (pageText) {
          const truncated = pageText.length > maxChars ? pageText.slice(0, maxChars) + '...' : pageText;
          enhanced.push({ ...r, fullContent: truncated });
        } else {
          enhanced.push(r);
        }
      } catch {
        enhanced.push(r);
      }
    }
    for (let i = 3; i < results.length; i++) {
      enhanced.push(results[i]);
    }
    return enhanced;
  }

  /* ═══════════ Public API ═══════════ */

  async function search(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim();
    const cfg = await getConfig();
    let provider = cfg.webSearchProvider || 'duckduckgo';
    const maxResults = Math.max(1, Math.min(20, cfg.totalSearchResults || 5));
    const simpleMode = cfg.simpleInternetSearch !== false;
    _lastDebugLog = [];

    console.log('[WebSearch] provider:', provider, '| query:', q, '| max:', maxResults, '| simple:', simpleMode);

    async function runProvider(name) {
      switch (name) {
        case 'brave':
          return searchBrave(q, cfg.braveSearchApiKey, maxResults);
        case 'tavily':
          return searchTavily(q, cfg.tavilyApiKey, maxResults);
        case 'duckduckgo':
        default:
          return searchDuckDuckGo(q, maxResults);
      }
    }

    let results = [];
    try {
      results = await runProvider(provider);
      if(!results.length && provider !== 'duckduckgo') {
        _lastDebugLog.push(`${provider}: 0 results, falling back to DuckDuckGo`);
        results = await runProvider('duckduckgo');
      }
    } catch (e) {
      _lastDebugLog.push(`${provider}: ${e.message}`);
      if(provider !== 'duckduckgo') {
        _lastDebugLog.push('Fallback: DuckDuckGo');
        results = await runProvider('duckduckgo');
      } else {
        throw e;
      }
    }

    if (!simpleMode && results.length > 0) {
      console.log('[WebSearch] Fetching full page contents for top results...');
      results = await fetchFullPageContents(results, q);
    }

    return results;
  }

  function formatResultsAsContext(results, query) {
    if (!results || !results.length) return '';
    let out = '';
    let budget = PROMPT_BUDGET;
    const perResultMax = results.length <= 3 ? 1200 : 600;
    for (let i = 0; i < results.length && budget > 0; i++) {
      const r = results[i];
      let entry = `[${i + 1}] ${r.title}\n`;
      if (r.url) entry += `    URL: ${r.url}\n`;
      const content = r.fullContent || r.snippet || '';
      if (content) {
        const snip = content.length > perResultMax ? content.slice(0, perResultMax) + '…' : content;
        entry += `    ${snip}\n`;
      }
      if (budget - entry.length < 0 && i > 0) break;
      out += entry + '\n';
      budget -= entry.length;
    }
    return out.trim();
  }

  return {
    search,
    formatResultsAsContext,
    getConfig,
    visitWebsitesInMessage,
    extractUrlsFromText,
    get _lastDebugLog() { return _lastDebugLog.join('\n'); }
  };
})();
