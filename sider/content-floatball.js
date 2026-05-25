'use strict';

let hasInitialized = false;

(async function main(){
  console.log('[floatball] script loaded');
  try{
    const [syncState, localState] = await Promise.all([
      chrome.storage.sync.get(['showFloatBall']),
      chrome.storage.local.get(['floatballPosition'])
    ]);
    const state = { ...localState, showFloatBall: syncState.showFloatBall };
    console.log('[floatball] showFloatBall state:', state);
    const enabled = !!state.showFloatBall;

    if(!enabled){
      console.log('[floatball] disabled via settings, waiting for enable toggle');
      const waitForEnable = (changes, area)=>{
        if(area!=='sync' || !changes.showFloatBall) return;
        const next = !!changes.showFloatBall.newValue;
        if(!next) return;
        chrome.storage.onChanged.removeListener(waitForEnable);
        initFloatball({
          showFloatBall: true,
          floatballPosition: changes.floatballPosition?.newValue ?? null
        });
      };
      chrome.storage.onChanged.addListener(waitForEnable);
      return;
    }

    initFloatball(state);
  } catch(e) { 
    console.warn('[content-floatball] init failed', e); 
  }
})();

function initFloatball(state){
  if(hasInitialized){
    console.log('[floatball] init already completed, skipping');
    return;
  }
  if(document.documentElement.classList.contains('momo-floatball-mounted')) {
    console.log('[floatball] already mounted, exiting');
    hasInitialized = true;
    return;
  }
  hasInitialized = true;
  document.documentElement.classList.add('momo-floatball-mounted');
  console.log('[floatball] mounting float ball');
  const enabled = !!state?.showFloatBall;

  // 注入 iframe 側邊欄樣式
  const sidebarStyle = document.createElement('link');
  sidebarStyle.rel = 'stylesheet';
  sidebarStyle.href = chrome.runtime.getURL('iframe-sidebar.css');
  document.head.appendChild(sidebarStyle);

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
      .momo-float-ball-container {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2147483646;
      }
      
      .momo-float-ball-container.left-side {
        right: auto;
        left: 0;
      }
      
      .momo-float-ball {
        width: 38px;
        height: 34px;
        background: #ffffff;
        color: #111;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: grab;
        box-shadow: -2px 0 8px rgba(0,0,0,.1), -1px 0 3px rgba(0,0,0,.06);
        border: none;
        border-radius: 8px 0 0 8px;
        padding: 0;
        transition: width .2s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow .2s ease;
        user-select: none;
        -webkit-user-select: none;
        position: relative; /* 讓時間圖標可以絕對定位在內部 */
      }
      
      .momo-float-ball-container.left-side .momo-float-ball {
        border-radius: 0 8px 8px 0;
        box-shadow: 2px 0 8px rgba(0,0,0,.1), 1px 0 3px rgba(0,0,0,.06);
      }
      
      .momo-float-ball:hover {
        width: 52px;
        box-shadow: -3px 0 12px rgba(0,0,0,.15), -1px 0 4px rgba(0,0,0,.08);
      }
      
      .momo-float-ball-container.left-side .momo-float-ball:hover {
        box-shadow: 3px 0 12px rgba(0,0,0,.15), 1px 0 4px rgba(0,0,0,.08);
      }
      
      .momo-float-ball:active,
      .momo-float-ball.dragging {
        cursor: grabbing;
      }
      
      .momo-float-ball.busy {
        opacity: 0.7;
      }
      
      .momo-float-ball.opened {
        opacity: 0.8;
      }
      
      .momo-float-ball-icon {
        width: 23px;
        height: 23px;
        pointer-events: none;
        position: relative;
        z-index: 2; /* 卡通圖標優先顯示在上層 */
      }

      /* 懸浮球內的時間圖標（無動效） */
      .momo-float-ball-time {
        position: absolute;
        left: 2px;
        top: 2px;
        width: 12px;
        height: 12px;
        pointer-events: none;
        z-index: 1; /* 時間圖標在卡通圖標之下 */
      }
      .momo-float-ball-time svg {
        width: 12px;
        height: 12px;
        display: block;
        color: #000; /* 淺色模式：黑色 */
      }
      @media (prefers-color-scheme: dark) {
        .momo-float-ball-time svg { color: #F3E68A; /* 深色模式：淡黃 */ }
      }
      
      .momo-float-ball.dragging {
        border-radius: 8px;
        width: 38px !important;
      }
      
      /* 關閉按鈕 - 左下角小圓形 */
      .momo-float-ball-close {
        position: absolute;
        left: -12px;
        bottom: -12px;
        width: 20px;
        height: 20px;
        background: #E1E2E5;
        border: 2px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 1;
        color: #ffffff;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease, background 0.2s ease;
        padding: 0;
        z-index: 1;
      }
      
      .momo-float-ball-container:hover .momo-float-ball-close {
        opacity: 1;
      }
      
      .momo-float-ball-close:hover {
        background: #C2C3CB;
      }
      
      .momo-float-ball-container.left-side .momo-float-ball-close {
        left: auto;
        right: -12px;
      }
      
      .momo-float-ball-container.dragging .momo-float-ball-close {
        opacity: 0;
        pointer-events: none;
      }
      
      /* 動畫 */
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
  document.documentElement.appendChild(style);

    // 創建容器包裹懸浮球和關閉按鈕
    const container = document.createElement('div');
    container.className = 'momo-float-ball-container';
    
    const btn = document.createElement('button');
    btn.className = 'momo-float-ball';
    btn.type = 'button';
    btn.title = 'Open Hii~ Momo: AI Assist';
    
    const iconUrl = chrome.runtime?.getURL ? chrome.runtime.getURL('assets/icons/momo.png') : null;
    if(iconUrl){
      const img = document.createElement('img');
      img.src = iconUrl;
      img.alt = '';
      img.className = 'momo-float-ball-icon';
      btn.appendChild(img);
    }

    // 依時間顯示圖標（白天太陽 / 夜間月亮）— 無動效
    const createTimeIconSVG = () => {
      const hour = new Date().getHours();
      const isDay = hour >= 6 && hour < 18;
      if(isDay){
        // 太陽（實心）+ 簡單光線
        return `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
  <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none">
    <line x1="12" y1="1.5" x2="12" y2="4"></line>
    <line x1="12" y1="20" x2="12" y2="22.5"></line>
    <line x1="1.5" y1="12" x2="4" y2="12"></line>
    <line x1="20" y1="12" x2="22.5" y2="12"></line>
    <line x1="4.6" y1="4.6" x2="6.3" y2="6.3"></line>
    <line x1="17.7" y1="17.7" x2="19.4" y2="19.4"></line>
    <line x1="4.6" y1="19.4" x2="6.3" y2="17.7"></line>
    <line x1="17.7" y1="6.3" x2="19.4" y2="4.6"></line>
  </g>
  <title>day</title>
  </svg>`;
      }
      // 月亮（弦月）
      return `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M15.5 22c-5.2 0-9.5-4.2-9.5-9.5 0-3.8 2.3-7.1 5.6-8.6-.8 1.6-1.2 3.3-1.2 5.1 0 6 4.8 10.8 10.8 10.8.9 0 1.8-.1 2.6-.3-1.9 1.6-4.3 2.5-6.9 2.5z" fill="currentColor"></path>
  <title>night</title>
</svg>`;
    };
    const timeIcon = document.createElement('div');
    timeIcon.className = 'momo-float-ball-time';
    timeIcon.innerHTML = createTimeIconSVG();
    btn.appendChild(timeIcon);
    
    // 創建獨立的關閉按鈕（小圓形）
    const closeBtn = document.createElement('button');
    closeBtn.className = 'momo-float-ball-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '✕';
    closeBtn.title = 'Hide float ball';
    
    container.appendChild(btn);
    container.appendChild(closeBtn);

    let isOpened = false;

    const resetOpenedState = () => {
      if (!isOpened) return;
      isOpened = false;
      btn.classList.remove('opened');
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        resetOpenedState();
      }
    });
    
    // 拖動相關變數 - 簡化狀態管理
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isLeftSide = false;
    let animationFrameId = null;
    const DRAG_THRESHOLD = 5; // 移動超過 5px 才算拖動

    // 讀取全域位置（跨分頁一致）優先，否則使用本地 localStorage
    try{
      const gpos = state.floatballPosition;
      let pos = gpos || null;
      if(!pos){
        const savedPos = localStorage.getItem('momo-floatball-position');
        if(savedPos){
          pos = JSON.parse(savedPos);
        }
      }
      if(pos){
        isLeftSide = pos.side === 'left';
        if(isLeftSide){
          container.classList.add('left-side');
          container.style.left = '0';
          container.style.right = 'auto';
        }
        const topPercent = pos.topPercent || 50;
        container.style.top = topPercent + '%';
        container.style.transform = 'translateY(-50%)';
      }
    }catch(e){ console.warn('[floatball] failed to read saved position', e); }

    // 吸附到邊緣的函數
    const snapToEdge = (currentX) => {
      const windowWidth = window.innerWidth;
      const threshold = windowWidth / 2;
      
      if(currentX < threshold) {
        // 吸附到左邊
        isLeftSide = true;
        container.classList.add('left-side');
        container.style.left = '0';
        container.style.right = 'auto';
      } else {
        // 吸附到右邊
        isLeftSide = false;
        container.classList.remove('left-side');
        container.style.right = '0';
        container.style.left = 'auto';
      }
    };

    // 關閉按鈕點擊事件
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      // 隱藏懸浮球並保存狀態
      chrome.storage.sync.set({ showFloatBall: false }, () => {
        container.remove();
        console.log('[floatball] hidden by user');
      });
    });
    
    closeBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });
    
    // 使用 pointer events 統一處理鼠標和觸摸
    btn.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return; // 只響應左鍵
      
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      
      const rect = container.getBoundingClientRect();
      currentX = rect.left;
      currentY = rect.top;
      
      btn.setPointerCapture(e.pointerId);
      btn.addEventListener('pointermove', onPointerMove);
      btn.addEventListener('pointerup', onPointerUp);
      btn.addEventListener('pointercancel', onPointerUp);
      
      e.preventDefault();
    });

    const onPointerMove = (e) => {
      if (animationFrameId) return;

      animationFrameId = requestAnimationFrame(() => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (!isDragging && distance > DRAG_THRESHOLD) {
          isDragging = true;
          container.classList.add('dragging');
        }

        if (isDragging) {
          const newX = currentX + deltaX;
          const newY = currentY + deltaY;
          const maxY = window.innerHeight - container.offsetHeight;
          const clampedY = Math.max(0, Math.min(newY, maxY));
          
          container.style.left = newX + 'px';
          container.style.right = 'auto';
          container.style.top = clampedY + 'px';
          container.style.transform = 'none';
        }

        animationFrameId = null;
      });
    };

    const onPointerUp = (e) => {
      btn.releasePointerCapture(e.pointerId);
      btn.removeEventListener('pointermove', onPointerMove);
      btn.removeEventListener('pointerup', onPointerUp);
      btn.removeEventListener('pointercancel', onPointerUp);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      if (isDragging) {
        isDragging = false;
        container.classList.remove('dragging');
        
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        snapToEdge(centerX);
        
        const topPercent = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
        container.style.top = topPercent + '%';
        container.style.transform = 'translateY(-50%)';
        
        const saved = { side: isLeftSide ? 'left' : 'right', topPercent };
        localStorage.setItem('momo-floatball-position', JSON.stringify(saved));
        chrome.storage.local.set({ floatballPosition: saved });
      } else {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < DRAG_THRESHOLD) {
          handleClick();
        }
      }
    };

    const applySidebarTheme = () => {
      if (!sidebarContainer) return;
      chrome.storage.sync.get('theme', (s) => {
        let t = s.theme || 'auto';
        if (t === 'auto') {
          t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        sidebarContainer.setAttribute('data-theme', t);
      });
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      applySidebarTheme();
    });

    // 創建 iframe 側邊欄 - 參考 Immersive Translate
    let sidebarContainer = null;
    let sidebarOverlay = null;
    let sidebarIframe = null;
    let isSidebarOpen = false;
    
    const createSidebar = () => {
      if (sidebarContainer) return;
      
      // 創建側邊欄容器
      sidebarContainer = document.createElement('div');
      sidebarContainer.className = 'momo-iframe-sidebar';
      
      // 恢復寬度
      const savedWidth = localStorage.getItem('momoSidebarWidth');
      if (savedWidth) {
        const widthNum = parseInt(savedWidth, 10);
        if (!Number.isNaN(widthNum) && widthNum >= 320 && widthNum <= Math.min(window.innerWidth - 80, 900)) {
          sidebarContainer.style.width = widthNum + 'px';
        }
      }
      
      // 創建 iframe
      sidebarIframe = document.createElement('iframe');
      sidebarIframe.src = chrome.runtime.getURL('sidepanel.html');
      sidebarIframe.allow = 'clipboard-read; clipboard-write';
      sidebarIframe.title = 'Hii~ Momo: AI Assist';
      
      // 右上關閉
      const closeBtn = document.createElement('div');
      closeBtn.className = 'momo-sidebar-close';
      closeBtn.title = 'Close';
      closeBtn.textContent = '✕';
      closeBtn.addEventListener('click', closeSidebar);
      
      // 左側拖拽把手
      const resizer = document.createElement('div');
      resizer.className = 'momo-sidebar-resizer';
      let resizing = false;
      let startX = 0;
      let startWidth = 0;
      const minWidth = 320;
      const maxWidth = Math.min(window.innerWidth - 80, 900);
      
      const onResizeMove = (clientX) => {
        const delta = startX - clientX; // 向右拖動縮小
        let newWidth = Math.min(Math.max(startWidth + delta, minWidth), maxWidth);
        sidebarContainer.style.width = newWidth + 'px';
      };
      
      const onMouseMove = (e) => { if (!resizing) return; onResizeMove(e.clientX); e.preventDefault(); };
      const onTouchMove = (e) => { if (!resizing) return; const t=e.touches[0]; onResizeMove(t.clientX); e.preventDefault(); };
      const endResize = () => {
        if(!resizing) return;
        resizing = false;
        document.body.style.cursor = '';
        // 保存寬度
        const w = parseInt(getComputedStyle(sidebarContainer).width, 10);
        if(!Number.isNaN(w)) localStorage.setItem('momoSidebarWidth', String(w));
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', endResize);
        document.removeEventListener('touchmove', onTouchMove, { passive:false });
        document.removeEventListener('touchend', endResize);
      };
      const startResize = (clientX) => {
        resizing = true;
        startX = clientX;
        startWidth = parseInt(getComputedStyle(sidebarContainer).width, 10);
        document.body.style.cursor = 'ew-resize';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', endResize);
        document.addEventListener('touchmove', onTouchMove, { passive:false });
        document.addEventListener('touchend', endResize);
      };
      resizer.addEventListener('mousedown', (e)=>{ startResize(e.clientX); e.preventDefault(); });
      resizer.addEventListener('touchstart', (e)=>{ const t=e.touches[0]; startResize(t.clientX); e.preventDefault(); }, { passive:false });
      
      sidebarContainer.appendChild(sidebarIframe);
      sidebarContainer.appendChild(resizer);
      sidebarContainer.appendChild(closeBtn);
      document.body.appendChild(sidebarContainer);

      applySidebarTheme();
      chrome.storage.onChanged.addListener((changes, area) => {
        if (changes.theme) applySidebarTheme();
      });
      
      console.log('[floatball] sidebar created');
    };
    

    const openSidebar = () => {
      if (!sidebarContainer) {
        createSidebar();
      }
      
      if (isSidebarOpen) return;
      
      // 使用 requestAnimationFrame 確保動畫流暢
      requestAnimationFrame(() => {
        sidebarContainer.classList.add('open');
        btn.classList.add('opened');
        isSidebarOpen = true;
        isOpened = true;
        console.log('[floatball] sidebar opened');
      });
    };
    
    const closeSidebar = () => {
      if (!isSidebarOpen) return;
      
      sidebarContainer.classList.remove('open');
      btn.classList.remove('opened');
      isSidebarOpen = false;
      isOpened = false;
      console.log('[floatball] sidebar closed');
    };
    
    const toggleSidebar = () => {
      if (isSidebarOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    };
    
    // 點擊處理 - 參考 Gemini 建議：直接發訊息給 background
    const handleClick = () => {
      console.log('[floatball] button clicked');
      btn.classList.add('busy');
      
      // 設置超時保護，確保按鈕狀態恢復
      const timeoutId = setTimeout(() => {
        btn.classList.remove('busy');
        console.log('[floatball] timeout, removing busy state');
      }, 3000);

      const sendToggle = (currentState) => {
        const desiredAction = currentState ? 'close' : 'open';
        chrome.runtime.sendMessage({ action: 'toggleSidePanel', desiredAction }, (response) => {
          clearTimeout(timeoutId);
          setTimeout(() => btn.classList.remove('busy'), 250);
          
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            console.warn('[floatball] toggle message failed:', lastError);
            if (desiredAction === 'open') resetOpenedState();
            return;
          }
  
          if (response?.ok) {
            if (response.action === 'opened') {
              isOpened = true;
              btn.classList.add('opened');
            } else if (response.action === 'closed') {
              resetOpenedState();
            }
            console.log('[floatball] sidepanel toggled successfully:', response.action);
          } else {
            console.warn('[floatball] toggle failed:', response);
            if (desiredAction === 'open') resetOpenedState();
          }
        });
      };

      chrome.runtime.sendMessage({ action: 'getSidePanelState' }, (response) => {
        const err = chrome.runtime.lastError;
        if (!err && response?.ok) {
          const remoteOpened = !!response.enabled;
          if(remoteOpened !== isOpened){
            isOpened = remoteOpened;
            btn.classList.toggle('opened', remoteOpened);
          }
          sendToggle(remoteOpened);
        } else {
          if (err) {
            console.warn('[floatball] failed to sync before toggle:', err);
          }
          sendToggle(isOpened);
        }
      });
    };

    // 根據當前開關決定是否掛載到頁面
    if(enabled){
      document.documentElement.appendChild(container);
      console.log('[floatball] float ball mounted successfully');
    }else{
      console.log('[floatball] skip mounting (disabled via settings)');
    }

    const syncSidepanelState = () => {
      chrome.runtime.sendMessage({ action: 'getSidePanelState' }, (response) => {
        const err = chrome.runtime.lastError;
        if (err) {
          console.warn('[floatball] failed to sync sidepanel state:', err);
          return;
        }
        if (response?.ok) {
          if (response.enabled) {
            isOpened = true;
            btn.classList.add('opened');
            console.log('[floatball] synced sidepanel state: opened', response.cached ? '(cached)' : '');
          } else {
            resetOpenedState();
            console.log('[floatball] synced sidepanel state: closed', response.cached ? '(cached)' : '');
          }
        } else {
          console.warn('[floatball] sync state response not ok:', response);
        }
      });
    };

    syncSidepanelState();

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncSidepanelState();
      }
    });

  // 監聽設定改變（立即顯示/隱藏，無需刷新），以及跨分頁位置同步
  chrome.storage.onChanged.addListener((changes, area) => {
    if(area === 'sync'){
      if(changes.showFloatBall){
        const on = !!changes.showFloatBall.newValue;
        if(on){
          if(!container.isConnected) document.documentElement.appendChild(container);
          container.style.display = '';
        } else {
          if(container.isConnected){
            container.remove();
          }
        }
      }
      if(changes.floatballPosition){
        const pos = changes.floatballPosition.newValue;
        if(pos && container.isConnected){
          isLeftSide = pos.side === 'left';
          if(isLeftSide){
            container.classList.add('left-side');
            container.style.left = '0';
            container.style.right = 'auto';
          }else{
            container.classList.remove('left-side');
            container.style.right = '0';
            container.style.left = 'auto';
          }
          const tp = pos.topPercent || 50;
          container.style.top = tp + '%';
          container.style.transform = 'translateY(-50%)';
        }
      }
    }
  });
}
