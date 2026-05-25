/* js/markdown.js — Enhanced Markdown renderer (no third-party)
   Extracted from sidepanel.js. Depends on: js/utils.js (escapeHtml) */

'use strict';

/* ================= Markdown Entry Points ================= */

function renderMarkdownBlocks(src = '') {
  if (!src) return '';

  // Un-escape thinking tags (support: <think>, <thinking>, <thought>)
  const original = String(src);
  src = original
    .replace(/&lt;think&gt;/gi, '<think>').replace(/&lt;\/think&gt;/gi, '</think>')
    .replace(/&lt;thinking&gt;/gi, '<thinking>').replace(/&lt;\/thinking&gt;/gi, '</thinking>')
    .replace(/&lt;thought&gt;/gi, '<thought>').replace(/&lt;\/thought&gt;/gi, '</thought>');

  const sections = [];
  const re = /<(think|thinking|thought)>([\s\S]*?)(?:<\/\1>|$)/gi;
  let lastIndex = 0;
  let match;
  while ((match = re.exec(src)) !== null) {
    const before = src.slice(lastIndex, match.index);
    if (before) sections.push({ type: 'markdown', text: before });
    sections.push({ type: 'think', text: match[2] ?? '' });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < src.length) {
    sections.push({ type: 'markdown', text: src.slice(lastIndex) });
  }

  return sections.map(seg => {
    if (seg.type === 'think') return renderReasoningBlock(seg.text);
    return renderMarkdownBlocksCore(seg.text);
  }).join('');
}

function renderMarkdownBlocksCore(src = '') {
  if (!src) return '';
  src = src.replace(/\r\n?/g, '\n').replace(/\uFF5C/g, '|');
  const tokens = tokenizeCodeFences(src);
  const htmlParts = [];
  for (const tk of tokens) {
    if (tk.type === 'code') {
      htmlParts.push(renderCodeFence(tk));
    } else {
      htmlParts.push(renderBlockText(tk.text));
    }
  }
  return htmlParts.join('');
}

/* ── Streaming-aware rendering ── */

function renderStreamingMarkdown(src = '') {
  if (!src) return '';
  try {
    // Un-escape thinking tags
    let adjusted = String(src);
    adjusted = adjusted
      .replace(/&lt;think&gt;/gi, '<think>').replace(/&lt;\/think&gt;/gi, '</think>')
      .replace(/&lt;thinking&gt;/gi, '<thinking>').replace(/&lt;\/thinking&gt;/gi, '</thinking>')
      .replace(/&lt;thought&gt;/gi, '<thought>').replace(/&lt;\/thought&gt;/gi, '</thought>');

    // Auto-close unclosed code fences
    const fenceCount = (src.match(/```/g) || []).length;
    if (fenceCount % 2 === 1) adjusted += '\n```';

    // Handle open thinking tags (streaming)
    const hasOpenThink = /<(think|thinking|thought)>[\s\S]*$/i.test(adjusted);
    const hasCloseThink = /<\/(think|thinking|thought)>/i.test(adjusted);

    if (hasOpenThink && !hasCloseThink) {
      const thinkMatch = adjusted.match(/<(think|thinking|thought)>([\s\S]*)$/i);
      if (thinkMatch) {
        const beforeThink = adjusted.slice(0, thinkMatch.index);
        const beforeHtml = beforeThink ? renderMarkdownBlocksCore(beforeThink) : '';
        const thinkHtml = renderStreamingReasoningBlock(thinkMatch[2]);
        return beforeHtml + thinkHtml;
      }
    }

    return renderMarkdownBlocks(adjusted);
  } catch (e) {
    console.warn('[markdown] render failed', e);
    return escapeHtml(src).replace(/\n/g, '<br>');
  }
}

/* ================= Reasoning Blocks ================= */

function renderReasoningBlock(raw = '') {
  const text = (raw || '').trim();
  if (!text) return '';
  const inner = renderMarkdownBlocksCore(text);
  return `
<details class="reasoning-block">
  <summary class="reasoning-summary"></summary>
  <div class="reasoning-body">${inner}</div>
</details>`;
}

function renderStreamingReasoningBlock(raw = '') {
  const text = (raw || '').trim();
  if (!text) return '';
  const inner = renderMarkdownBlocksCore(text);
  return `
<details class="reasoning-block streaming">
  <summary class="reasoning-summary"></summary>
  <div class="reasoning-body">${inner}</div>
</details>`;
}

/* ================= Code Fences ================= */

function tokenizeCodeFences(src) {
  const re = /```(\w+)?\n([\s\S]*?)```/g;
  let last = 0, m;
  const out = [];
  while ((m = re.exec(src)) !== null) {
    const [full, lang, body] = m;
    if (m.index > last) {
      out.push({ type: 'text', text: src.slice(last, m.index) });
    }
    out.push({ type: 'code', lang: (lang || '').trim(), body });
    last = m.index + full.length;
  }
  if (last < src.length) {
    out.push({ type: 'text', text: src.slice(last) });
  }
  return out;
}

function renderCodeFence(tk) {
  return `<pre><code class="lang-${escapeHtml(tk.lang)}">${escapeHtml(tk.body)}</code></pre>`;
}

/* ================= Block-level Parsing ================= */

function renderBlockText(text) {
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (/^\s*$/.test(lines[i])) { i++; continue; }

    // Headings
    const hMatch = /^(#{1,6})\s+(.+)$/.exec(lines[i]);
    if (hMatch) {
      const level = hMatch[1].length;
      out.push(`<h${level}>${renderInline(hMatch[2].trim())}</h${level}>`);
      i++; continue;
    }
    // Blockquote
    if (/^>\s?/.test(lines[i])) {
      const bq = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        bq.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${renderBlockText(bq.join('\n'))}</blockquote>`);
      continue;
    }
    // Indented code
    if (/^( {4}|\t)/.test(lines[i])) {
      const codeBuf = [];
      while (i < lines.length && /^( {4}|\t)/.test(lines[i])) {
        codeBuf.push(lines[i].replace(/^( {4}|\t)/, ''));
        i++;
      }
      out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
      continue;
    }
    // Table
    if (isTableHeader(lines, i)) {
      const { html, nextIndex } = parseTable(lines, i);
      out.push(html);
      i = nextIndex;
      continue;
    }
    // List
    if (isListLine(lines[i])) {
      const { html, nextIndex } = parseList(lines, i);
      out.push(html);
      i = nextIndex;
      continue;
    }
    // Paragraph
    const pBuf = [];
    while (i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !isTableHeader(lines, i) &&
      !isListLine(lines[i])) {
      pBuf.push(lines[i]);
      i++;
    }
    out.push(`<p>${renderInline(pBuf.join('\n'))}</p>`);
  }
  return out.join('');
}

/* ================= Table Parsing ================= */

function isSeparatorRow(line) {
  if (!line || !line.trim()) return false;
  const trimmed = line.trim();
  if (!/\|/.test(trimmed) && /^[\s:\-|—–﹣－]+$/.test(trimmed)) {
    const chunks = trimmed.split(/[\|｜]/).map(s => s.trim());
    return chunks.length >= 2 && chunks.every(isSeparatorCell);
  }
  let cleaned = trimmed;
  if (cleaned.startsWith('|') || cleaned.startsWith('｜')) cleaned = cleaned.slice(1);
  if (cleaned.endsWith('|') || cleaned.endsWith('｜')) cleaned = cleaned.slice(0, -1);
  const cells = cleaned.split(/[|｜]/).map(s => s.trim());
  if (cells.length < 2) return false;
  return cells.every(isSeparatorCell);
}

function normalizeTableDash(text = '') {
  return String(text).trim().replace(/[—–﹣－]/g, '-');
}

function isSeparatorCell(cell) {
  const c = normalizeTableDash(cell);
  if (!c) return true;
  if (/^:?-{1,}:?$/.test(c)) return true;
  if (/^:+$/.test(c)) return true;
  return false;
}

function splitTableRow(line) {
  let raw = line;
  if (raw.trim().startsWith('|') || raw.trim().startsWith('｜')) raw = raw.replace(/^\s*[|｜]/, '');
  if (raw.trim().endsWith('|') || raw.trim().endsWith('｜')) raw = raw.replace(/[|｜]\s*$/, '');
  return raw.split(/(?<!\\)[|｜]/).map(c => c.trim().replace(/\\\|/g, '|'));
}

function looksLikeTableRow(line) {
  if (!line || !/\|/.test(line)) return false;
  return splitTableRow(line).length >= 2;
}

function alignmentFromSeparatorCell(cell = '') {
  const c = normalizeTableDash(cell);
  if (c.startsWith(':') && c.endsWith(':')) return 'center';
  if (c.startsWith(':')) return 'left';
  if (c.endsWith(':')) return 'right';
  return 'left';
}

function findTableBlock(lines, idx) {
  if (!looksLikeTableRow(lines[idx])) return null;
  const headerCells = splitTableRow(lines[idx]);
  if (headerCells.length < 2) return null;

  let sepIdx = idx + 1;
  while (sepIdx < lines.length && /^\s*$/.test(lines[sepIdx])) sepIdx++;
  if (sepIdx >= lines.length) return null;

  if (isSeparatorRow(lines[sepIdx])) {
    return { headerIdx: idx, sepIdx, implicitSeparator: false };
  }

  if (looksLikeTableRow(lines[sepIdx]) && !isSeparatorRow(lines[sepIdx])) {
    return { headerIdx: idx, sepIdx: null, implicitSeparator: true, bodyStart: sepIdx };
  }

  return null;
}

function isTableHeader(lines, idx) {
  return findTableBlock(lines, idx) !== null;
}

function parseTable(lines, idx) {
  const block = findTableBlock(lines, idx);
  if (!block) return { html: '', nextIndex: idx + 1 };

  const headerCells = splitTableRow(lines[block.headerIdx]);
  let align;
  let bodyIndex;

  if (block.implicitSeparator) {
    align = headerCells.map(() => 'left');
    bodyIndex = block.bodyStart;
  } else {
    const sepCells = splitTableRow(lines[block.sepIdx]);
    align = sepCells.map(alignmentFromSeparatorCell);
    while (align.length < headerCells.length) align.push('left');
    bodyIndex = block.sepIdx + 1;
  }

  const bodyRows = [];
  while (bodyIndex < lines.length && looksLikeTableRow(lines[bodyIndex])) {
    if (isSeparatorRow(lines[bodyIndex])) break;
    bodyRows.push(splitTableRow(lines[bodyIndex]));
    bodyIndex++;
  }
  const thHtml = headerCells.map((c, i) =>
    `<th style="text-align:${align[i] || 'left'}">${renderInline(c)}</th>`).join('');
  const trHtml = bodyRows.map(row =>
    `<tr>${row.map((c, i) => `<td style="text-align:${align[i] || 'left'}">${renderInline(c)}</td>`).join('')}</tr>`).join('');
  const html = `<div class="md-table-wrapper"><table class="md-table"><thead><tr>${thHtml}</tr></thead><tbody>${trHtml}</tbody></table></div>`;
  return { html, nextIndex: bodyIndex };
}

/* ================= List Parsing ================= */

function isListLine(line) {
  return /^(\s*)([-*+])\s+/.test(line) || /^(\s*)\d+\.\s+/.test(line);
}

function parseList(lines, idx) {
  const ordered = /^\s*\d+\.\s+/.test(lines[idx]);
  const baseIndent = (lines[idx].match(/^(\s*)/)?.[1] || '').length;
  const items = [];
  while (idx < lines.length) {
    const line = lines[idx];
    if (/^\s*$/.test(line)) { idx++; continue; }
    if (!isListLine(line)) {
      const indent = (line.match(/^(\s*)/)?.[1] || '').length;
      if (indent > baseIndent && items.length) {
        items[items.length - 1] += `\n${line.trim()}`;
        idx++;
        continue;
      }
      break;
    }
    const content = line.replace(/^(\s*)([-*+]|\d+\.)\s+/, '');
    items.push(content);
    idx++;
  }
  const html = ordered
    ? `<ol>${items.map(i => `<li>${renderInline(i)}</li>`).join('')}</ol>`
    : `<ul>${items.map(i => `<li>${renderInline(i)}</li>`).join('')}</ul>`;
  return { html, nextIndex: idx };
}

/* ================= Inline Rendering (with XSS protection) ================= */

function renderInline(text) {
  if (!text) return '';
  // SECURITY: escapeHtml first to prevent XSS from AI-generated content
  let t = escapeHtml(text);

  // Protect code spans from further processing
  const codeSpans = [];
  t = t.replace(/`([^`]+?)`/g, (m, code) => {
    const token = `__CODE_SPAN_${codeSpans.length}__`;
    codeSpans.push(`<code>${code}</code>`); // already escaped by outer escapeHtml
    return token;
  });

  // Bold
  t = t.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  t = t.replace(/(^|[^\*])\*([^*\n]+?)\*(?!\*)/g, (m, p1, p2) => `${p1}<em>${p2}</em>`);
  // Links — only allow http(s) URLs (prevent javascript: etc.)
  t = t.replace(/\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g,
    (m, label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
  // Images — only allow http(s) URLs
  t = t.replace(/!\[([^\]]*?)\]\((https?:\/\/[^\s)]+)\)/g,
    (m, alt, url) => `<img src="${url}" alt="${alt}" class="md-img">`);
  // Line breaks
  t = t.replace(/\r?\n/g, '<br>');
  // Restore code spans
  t = t.replace(/__CODE_SPAN_(\d+)__/g, (m, i) => codeSpans[i]);
  return t;
}
