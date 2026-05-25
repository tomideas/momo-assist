/* i18n-loader.js - 動態載入語言檔案系統 */
/* 支援語言檔案：assets/i18n/{lang}.json */

(function(){
  const loadedTranslations = {};
  const loadingPromises = {};
  
  // 支援的語言列表（自動從檔案系統偵測）
  const SUPPORTED_LANGUAGES = ['hant', 'hans', 'en'];
  
  // 根據 Chrome UI 語言偵測應使用的語言（hant/hans/en）
  function detectBrowserLanguage() {
    try {
      const browserLang = chrome.i18n?.getUILanguage?.() || navigator.language || 'en';
      if (browserLang.startsWith('en')) return 'en';
      if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK') || browserLang.startsWith('zh-MO')) return 'hant';
      if (browserLang.startsWith('zh-CN') || browserLang.startsWith('zh-SG')) return 'hans';
      if (browserLang.startsWith('zh')) return 'hant';
    } catch (e) {}
    return 'en';
  }
  window.__detectBrowserLanguage = detectBrowserLanguage;
  
  // 載入特定語言的翻譯檔案
  async function loadLanguage(lang) {
    if (!lang || !SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn('[i18n] Unsupported language:', lang);
      lang = detectBrowserLanguage();
    }
    
    // 如果已經載入，直接返回
    if (loadedTranslations[lang]) {
      return loadedTranslations[lang];
    }
    
    // 如果正在載入中，返回 Promise
    if (loadingPromises[lang]) {
      return loadingPromises[lang];
    }
    
    // 開始載入（使用 chrome.runtime.getURL 取得正確路徑）
    const jsonUrl = chrome?.runtime?.getURL 
      ? chrome.runtime.getURL(`assets/i18n/${lang}.json`)
      : `assets/i18n/${lang}.json`;
    
    loadingPromises[lang] = fetch(jsonUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${lang}.json: ${response.status}`);
        }
        return response.json();
      })
      .then(translations => {
        loadedTranslations[lang] = translations;
        console.log(`[i18n] Loaded language: ${lang}`);
        return translations;
      })
      .catch(error => {
        console.error(`[i18n] Error loading ${lang}.json:`, error);
        const fallback = detectBrowserLanguage();
        if (lang !== fallback) {
          return loadLanguage(fallback);
        }
        return {};
      })
      .finally(() => {
        delete loadingPromises[lang];
      });
    
    return loadingPromises[lang];
  }
  
  // 預載入常用語言（可選，提升性能）
  async function preloadLanguages() {
    await loadLanguage(detectBrowserLanguage());
  }
  
  // 取得翻譯（同步版本，需要先載入）
  window.__t = function(key, lang) {
    lang = lang || detectBrowserLanguage();
    const translations = loadedTranslations[lang] || loadedTranslations[detectBrowserLanguage()] || {};
    return translations[key] || key;
  };
  
  // 取得翻譯（異步版本，自動載入）
  window.__tAsync = async function(key, lang) {
    lang = lang || detectBrowserLanguage();
    const translations = await loadLanguage(lang);
    return translations[key] || key;
  };
  
  // 批量應用翻譯（異步版本）
  window.__applyTranslations = async function(lang) {
    lang = lang || detectBrowserLanguage();
    const t = await loadLanguage(lang);
    
    if (!t || Object.keys(t).length === 0) {
      console.warn('[i18n] No translations available for:', lang);
      return;
    }

    // UI 語系切換只更新介面文案，絕不碰使用者/AI 對話內容。
    const isConversationContent = el => !!el.closest?.('.message-content');
    
    // 含簡單 HTML（<code>、<strong> 等）的翻譯 — 僅用於自家 i18n JSON，勿用於使用者輸入
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      if (isConversationContent(el)) return;
      const key = el.getAttribute('data-i18n-html');
      if (t[key]) el.innerHTML = t[key];
    });

    // 遍歷所有帶有 data-i18n 屬性的元素（純文字）
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (isConversationContent(el)) return;
      if (el.hasAttribute('data-i18n-html')) return;
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else if (el.tagName === 'OPTION') {
          el.textContent = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // 更新 title 和 placeholder 屬性
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      if (isConversationContent(el)) return;
      const key = el.getAttribute('data-i18n-title');
      if (t[key]) el.title = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      if (isConversationContent(el)) return;
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) el.placeholder = t[key];
    });

    // 更新 tooltip (data-tooltip)
    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
      if (isConversationContent(el)) return;
      const key = el.getAttribute('data-i18n-tooltip');
      if (t[key]) {
        el.setAttribute('data-tooltip', t[key]);
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', t[key]);
        }
      }
    });

    // 更新 aria-label
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      if (isConversationContent(el)) return;
      const key = el.getAttribute('data-i18n-aria-label');
      if (t[key]) el.setAttribute('aria-label', t[key]);
    });

    // 瀏覽器分頁標題（options / sidepanel 的 <title> 僅為載入前後備，實際以語系為準）
    const pageFile = (location.pathname || '').split('/').pop() || '';
    if (pageFile === 'options.html' && t.optionsDocumentTitle) {
      document.title = t.optionsDocumentTitle;
    } else if (pageFile === 'sidepanel.html' && t.sidepanelDocumentTitle) {
      document.title = t.sidepanelDocumentTitle;
    }
    
    console.log(`[i18n] Applied translations for: ${lang}`);
  };
  
  // 取得支援的語言列表
  window.__getSupportedLanguages = function() {
    return [...SUPPORTED_LANGUAGES];
  };
  
  // 檢查語言是否支援
  window.__isLanguageSupported = function(lang) {
    return SUPPORTED_LANGUAGES.includes(lang);
  };
  
  // 預載入（可選，在頁面載入時調用）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadLanguages);
  } else {
    preloadLanguages();
  }
  
  console.log('[i18n] Translation loader system initialized');
})();

