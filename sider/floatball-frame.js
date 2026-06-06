(() => {
  const btn = document.getElementById('btn');
  // 點擊在 extension iframe 內，屬於真實 user gesture，可直接請求開啟官方側欄
  btn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'open_sidepanel' }, () => {
      // 忽略回覆即可
    });
  });
})();


