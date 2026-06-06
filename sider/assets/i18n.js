/* i18n.js - Internationalization translations */
/* 支援語言：繁體中文 (hant)、簡體中文 (hans)、英文 (en) */

(function(){
  const translations = {
    'hant': {
      // options.html
      'pageTitle': '設定',
      'pageSubtitle': '配置你的 AI 助手參數與外觀',
      'aiProvider': 'AI 服務提供商',
      'providerConfig': 'Provider 配置',
      'apiBaseUrl': 'API Base URL（可選）',
      'apiKey': 'API Key',
      'thinkingMode': '思考模式',
      'thinkingModeHint': '開啟後請求會加入 enable_thinking 參數。',
      'testConnection': '測試連線',
      'testConnectionHint': '檢查 API Key / Proxy 是否有效（會自動授權 host）。',
      'startTest': '開始測試',
      'showKey': '顯示',
      'hideKey': '隱藏',
      'enabledModels': '啟用模型',
      'addModel': '新增模型',
      'modelsHint': '僅「啟用」的模型會顯示在側邊欄下拉選單。',
      'globalPermission': '全域授權',
      'globalPermissionHint': '一次授權存取所有 HTTP / HTTPS 網站，避免每個新網站都跳出權限彈窗。',
      'grantAllSites': '授權所有網站',
      'revokeAllSites': '取消授權',
      'pageCapture': '引用頁面內容設定',
      'pageCaptureHint': '選擇想擷取的頁面內容區塊。\n\n• **整個頁面**：擷取完整的 HTML 結構，包含所有元素（適合需要完整頁面資訊的情況）\n• **Markdown 智能提取**：使用 Mozilla Readability 技術智能識別主要內容，自動過濾導航、廣告、側邊欄等無關元素，並轉換為清晰的 Markdown 格式，讓 AI 更容易理解頁面重點，同時節省 token 使用量（推薦用於文章、新聞、博客等內容型網站）\n• **自訂 CSS 選擇器**：手動指定要包含或排除的頁面元素，提供最精確的控制',
      'captureMode': '擷取模式',
      'captureFull': '整個頁面',
      'captureReader': 'Markdown 智能提取',
      'captureCustom': '自訂 CSS 選擇器',
      'mainContent': '主要內容 (可選)',
      'excludeBlocks': '排除區塊 (一行一個，可選)',
      'pageContextLimit': '頁面內容字符數上限',
      'pageContextLimitHint': '設定每次引用頁面時發送給 AI 的最大字符數（建議：20000-100000），包含頁面標題、URL、正文等全部內容。數值越大，可捕獲的內容越多，但也會消耗更多 token。Amazon 等複雜頁面建議設置 100000 以上。',
      'pageContextLimitHint2': '✨ 智能捕獲：插件會自動檢測虛擬滾動網站（如 Amazon、Twitter、Reddit 等），並使用智能滾動模式自動捕獲完整內容。點擊「引用頁面」按鈕後，頁面會自動滾動並累積所有內容（需時 10-30 秒），捕獲完成後內容會自動添加到對話中。可多次點擊重新捕獲最新內容。',
      'theme': '外觀主題',
      'themeAuto': '自動',
      'themeLight': '淺色',
      'themeDark': '深色',
      'floatBall': '懸浮球',
      'floatBallHint': '顯示在側欄右下角，點擊可快速開啟設定。',
      'messageText': '對話文字',
      'fontSize': '字號',
      'fontSizeSmall': '小',
      'fontSizeLarge': '大',
      'fontSizeDefault': '默認',
      'fontWeight': '字體粗細',
      'fontWeight200': '極細 (200)',
      'fontWeight300': '細體 (300)',
      'fontWeight400': '正常 (400)',
      'fontWeight500': '中等 (500)',
      'fontWeight600': '偏粗 (600)',
      'fontWeight700': '粗體 (700)',
      'language': '語言設定',
      'languageHint': '選擇介面顯示語言。',
      'systemPrompts': '系統提示詞（System Prompts）',
      'systemPromptsHint': '管理並快速切換不同的 AI 角色行為。',
      'promptVariableHint': '💡 系統提示詞用來定義 AI 的角色與規則。你的訊息和引用的頁面內容會自動分開發送，無需使用變數。',
      'addPrompt': '新增提示詞',
      'resetPrompts': '重置為預設',
      'editPrompt': '編輯提示詞',
      'promptName': '標題',
      'promptContent': '提示詞內容',
      'promptNamePlaceholder': '名稱',
      'promptContentPlaceholder': '輸入系統提示詞內容...',
      'promptVariables': '定義 AI 的角色、性格和規則。用戶輸入與頁面內容會自動處理。',
      'promptFootNote': '定義 AI 的角色、性格和規則。用戶輸入與頁面內容會自動處理。',
      'updatePrompt': '儲存',
      'close': '關閉',
      'delete': '刪除',
      'edit': '編輯',
      'enable': '啟用',
      'disable': '停用',
      'required': '*',
      'modelName': '模型名稱',
      'useDefaultUrl': '使用默認 URL',
      'enterApiKey': '請輸入 API Key',
      'example': '例如：main.article-body',
      // sidepanel.html
      'settings': '設定',
      'hiBoss': 'Hi,老闆',
      'whatPlan': '請問今日☀️有何大計❓',
      'scrollToBottom': '跳到底部',
      'uploadImage': '上傳圖片',
      'referencePage': '引用頁面',
      'chatHistory': '聊天記錄',
      'newChat': '新對話',
      'send': '發送',
      'enterMessage': '輸入訊息',
      'shiftEnterNewline': 'Shift+Enter 換行',
      // 狀態訊息
      'saved': '已保存',
      'testSuccess': '成功',
      'testFailed': '失敗',
      'testing': '測試中...',
      'granted': '已授權',
      'grantFailed': '授權失敗',
      'waitingGrant': '請在彈出視窗中選擇「允許」',
      'thinking': '思考中...',
      'hideReasoning': '隱藏思路',
      'connecting': '連線中...',
      'connected': '已連線 ✓',
      'processing': '處理中...',
      'loadingReply': '載入回覆...',
      'sending': '發送中...',
      'waitingReply': '等待回覆...',
      'waitingReplyPoll': '等待回覆... (備用輪詢:{{n}})'
    },
    'hans': {
      // 簡體中文版本（大部分與繁體相同，這裡只列出需要轉換的）
      'pageTitle': '设置',
      'pageSubtitle': '配置你的 AI 助手参数与外观',
      'aiProvider': 'AI 服务提供商',
      'providerConfig': 'Provider 配置',
      'apiBaseUrl': 'API Base URL（可选）',
      'apiKey': 'API Key',
      'thinkingMode': '思考模式',
      'thinkingModeHint': '开启后请求会加入 enable_thinking 参数。',
      'testConnection': '测试连线',
      'testConnectionHint': '检查 API Key / Proxy 是否有效（会自动授权 host）。',
      'startTest': '开始测试',
      'showKey': '显示',
      'hideKey': '隐藏',
      'enabledModels': '启用模型',
      'addModel': '新增模型',
      'modelsHint': '仅「启用」的模型会显示在侧边栏下拉选单。',
      'globalPermission': '全局授权',
      'globalPermissionHint': '一次授权存取所有 HTTP / HTTPS 网站，避免每个新网站都跳出权限弹窗。',
      'grantAllSites': '授权所有网站',
      'revokeAllSites': '取消授权',
      'pageCapture': '引用页面内容设置',
      'pageCaptureHint': '选择想擷取的页面内容区块。\n\n• **整个页面**：擷取完整的 HTML 结构，包含所有元素（适合需要完整页面信息的情况）\n• **Markdown 智能提取**：使用 Mozilla Readability 技术智能识别主要内容，自动过滤导航、广告、侧边栏等无关元素，并转换为清晰的 Markdown 格式，让 AI 更容易理解页面重点，同时节省 token 使用量（推荐用于文章、新闻、博客等内容型网站）\n• **自定义 CSS 选择器**：手动指定要包含或排除的页面元素，提供最精确的控制',
      'captureMode': '擷取模式',
      'captureFull': '整个页面',
      'captureReader': 'Markdown 智能提取',
      'captureCustom': '自定义 CSS 选择器',
      'mainContent': '主要内容 (可选)',
      'excludeBlocks': '排除区块 (一行一个，可选)',
      'pageContextLimit': '页面内容字符数上限',
      'pageContextLimitHint': '设定每次引用页面时发送给 AI 的最大字符数（建议：20000-100000），包含页面标题、URL、正文等全部内容。数值越大，可捕获的内容越多，但也会消耗更多 token。Amazon 等复杂页面建议设置 100000 以上。',
      'pageContextLimitHint2': '✨ 智能捕获：插件会自动检测虚拟滚动网站（如 Amazon、Twitter、Reddit 等），并使用智能滚动模式自动捕获完整内容。点击「引用页面」按钮后，页面会自动滚动并累积所有内容（需时 10-30 秒），捕获完成后内容会自动添加到对话中。可多次点击重新捕获最新内容。',
      'theme': '外观主题',
      'themeAuto': '自动',
      'themeLight': '浅色',
      'themeDark': '深色',
      'floatBall': '悬浮球',
      'floatBallHint': '显示在侧栏右下角，点击可快速开启设置。',
      'messageText': '对话文字',
      'fontSize': '字号',
      'fontSizeSmall': '小',
      'fontSizeLarge': '大',
      'fontSizeDefault': '默认',
      'fontWeight': '字体粗细',
      'fontWeight200': '极细 (200)',
      'fontWeight300': '细体 (300)',
      'fontWeight400': '正常 (400)',
      'fontWeight500': '中等 (500)',
      'fontWeight600': '偏粗 (600)',
      'fontWeight700': '粗体 (700)',
      'language': '语言设置',
      'languageHint': '选择界面显示语言。',
      'systemPrompts': '系统提示词（System Prompts）',
      'systemPromptsHint': '管理并快速切换不同的 AI 角色行为。',
      'promptVariableHint': '💡 系统提示词用来定义 AI 的角色与规则。你的消息和引用的页面内容会自动分开发送，无需使用变量。',
      'addPrompt': '新增提示词',
      'resetPrompts': '重置为预设',
      'editPrompt': '编辑提示词',
      'promptName': '标题',
      'promptContent': '提示词内容',
      'promptNamePlaceholder': '名称',
      'promptContentPlaceholder': '输入系统提示词内容...',
      'promptVariables': '定义 AI 的角色、性格和规则。用户输入与页面内容会自动处理。',
      'promptFootNote': '定义 AI 的角色、性格和规则。用户输入与页面内容会自动处理。',
      'updatePrompt': '保存',
      'close': '关闭',
      'delete': '删除',
      'edit': '编辑',
      'enable': '启用',
      'disable': '停用',
      'required': '*',
      'modelName': '模型名称',
      'useDefaultUrl': '使用默认 URL',
      'enterApiKey': '请输入 API Key',
      'example': '例如：',
      'settings': '设置',
      'hiBoss': 'Hi,老板',
      'whatPlan': '请问今日☀️有何大计❓',
      'scrollToBottom': '跳到底部',
      'uploadImage': '上传图片',
      'referencePage': '引用页面',
      'chatHistory': '聊天记录',
      'newChat': '新对话',
      'send': '发送',
      'enterMessage': '输入消息',
      'shiftEnterNewline': 'Shift+Enter 换行',
      'saved': '已保存',
      'testSuccess': '成功',
      'testFailed': '失败',
      'testing': '测试中...',
      'granted': '已授权',
      'grantFailed': '授权失败',
      'waitingGrant': '请在弹出窗口中选择「允许」',
      'thinking': '思考中...',
      'hideReasoning': '隐藏思路',
      'connecting': '连线中...',
      'connected': '已连线 ✓',
      'processing': '处理中...',
      'loadingReply': '载入回复...',
      'sending': '发送中...',
      'waitingReply': '等待回复...',
      'waitingReplyPoll': '等待回复... (备用轮询:{{n}})'
    },
    'en': {
      'pageTitle': 'Settings',
      'pageSubtitle': 'Configure your AI assistant parameters and appearance',
      'aiProvider': 'AI Service Provider',
      'providerConfig': 'Provider Configuration',
      'apiBaseUrl': 'API Base URL (Optional)',
      'apiKey': 'API Key',
      'thinkingMode': 'Thinking Mode',
      'thinkingModeHint': 'When enabled, requests will include the enable_thinking parameter.',
      'testConnection': 'Test Connection',
      'testConnectionHint': 'Check if API Key / Proxy is valid (will automatically authorize host).',
      'startTest': 'Start Test',
      'showKey': 'Show',
      'hideKey': 'Hide',
      'enabledModels': 'Enabled Models',
      'addModel': 'Add Model',
      'modelsHint': 'Only "enabled" models will appear in the sidebar dropdown menu.',
      'globalPermission': 'Global Permission',
      'globalPermissionHint': 'Authorize access to all HTTP / HTTPS websites at once to avoid permission popups for each new website.',
      'grantAllSites': 'Grant All Sites',
      'revokeAllSites': 'Revoke Permission',
      'pageCapture': 'Page Content Capture Settings',
      'pageCaptureHint': 'Choose which content to capture from the page.\n\n• **Full Page**: Captures the complete HTML structure, including all elements (suitable when you need complete page information)\n• **Markdown Smart Extraction**: Uses Mozilla Readability technology to intelligently identify main content, automatically filter out navigation, ads, sidebars, and other irrelevant elements, and convert to clean Markdown format, making it easier for AI to understand page highlights while saving token usage (recommended for articles, news, blogs, and other content-based websites)\n• **Custom CSS Selector**: Manually specify which page elements to include or exclude, providing the most precise control',
      'captureMode': 'Capture Mode',
      'captureFull': 'Full Page',
      'captureReader': 'Markdown Smart Extraction',
      'captureCustom': 'Custom CSS Selector',
      'mainContent': 'Main Content (Optional)',
      'excludeBlocks': 'Exclude Blocks (One per line, optional)',
      'pageContextLimit': 'Page Content Character Limit',
      'pageContextLimitHint': 'Set the maximum number of characters sent to AI when referencing a page (recommended: 20000-100000), including page title, URL, body content, etc. Larger values capture more content but consume more tokens. Complex pages like Amazon recommend 100000 or higher.',
      'pageContextLimitHint2': '✨ Smart Capture: The extension automatically detects virtual scrolling websites (such as Amazon, Twitter, Reddit, etc.) and uses intelligent scrolling mode to automatically capture complete content. After clicking the "Reference Page" button, the page will automatically scroll and accumulate all content (takes 10-30 seconds), and the captured content will be automatically added to the conversation when complete. You can click multiple times to recapture the latest content.',
      'theme': 'Appearance Theme',
      'themeAuto': 'Auto',
      'themeLight': 'Light',
      'themeDark': 'Dark',
      'floatBall': 'Float Ball',
      'floatBallHint': 'Display in the bottom-right corner of the sidebar. Click to quickly open settings.',
      'messageText': 'Message Text',
      'fontSize': 'Font Size',
      'fontSizeSmall': 'Small',
      'fontSizeLarge': 'Large',
      'fontSizeDefault': 'Default',
      'fontWeight': 'Font Weight',
      'fontWeight200': 'Extra Light (200)',
      'fontWeight300': 'Light (300)',
      'fontWeight400': 'Normal (400)',
      'fontWeight500': 'Medium (500)',
      'fontWeight600': 'Semi Bold (600)',
      'fontWeight700': 'Bold (700)',
      'language': 'Language',
      'languageHint': 'Select the interface display language.',
      'systemPrompts': 'System Prompts',
      'systemPromptsHint': 'Manage and quickly switch between different AI role behaviors.',
      'promptVariableHint': '💡 System prompt defines the AI\\'s role and rules. Your messages and referenced page content are sent separately — no variables needed.',
      'addPrompt': 'Add Prompt',
      'resetPrompts': 'Reset to Default',
      'editPrompt': 'Edit Prompt',
      'promptName': 'Title',
      'promptContent': 'Prompt Content',
      'promptNamePlaceholder': 'Name',
      'promptContentPlaceholder': 'Enter system prompt content...',
      'promptVariables': 'Define the AI\\'s role, personality, and rules. User input and page content are handled automatically.',
      'promptFootNote': 'Define the AI\\'s role, personality, and rules. User input and page content are handled automatically.',
      'updatePrompt': 'Save',
      'close': 'Close',
      'delete': 'Delete',
      'edit': 'Edit',
      'enable': 'Enable',
      'disable': 'Disable',
      'required': '*',
      'modelName': 'Model Name',
      'useDefaultUrl': 'Use default URL',
      'enterApiKey': 'Please enter API Key',
      'example': 'For example:',
      'settings': 'Settings',
      'hiBoss': 'Hi, Boss',
      'whatPlan': 'What\'s your plan for today ☀️❓',
      'scrollToBottom': 'Scroll to Bottom',
      'uploadImage': 'Upload Image',
      'referencePage': 'Reference Page',
      'chatHistory': 'Chat History',
      'newChat': 'New Chat',
      'send': 'Send',
      'enterMessage': 'Enter message',
      'shiftEnterNewline': 'Shift+Enter for new line',
      'saved': 'Saved',
      'testSuccess': 'Success',
      'testFailed': 'Failed',
      'testing': 'Testing...',
      'granted': 'Granted',
      'grantFailed': 'Grant Failed',
      'waitingGrant': 'Please select "Allow" in the popup window',
      'thinking': 'Thinking...',
      'hideReasoning': 'Hide reasoning',
      'connecting': 'Connecting...',
      'connected': 'Connected ✓',
      'processing': 'Processing...',
      'loadingReply': 'Loading reply...',
      'sending': 'Sending...',
      'waitingReply': 'Waiting for reply...',
      'waitingReplyPoll': 'Waiting for reply... (fallback poll: {{n}})'
    }
  };

  // 取得翻譯
  window.__t = function(key, lang) {
    lang = lang || 'hant';
    return translations[lang]?.[key] || key;
  };

  // 批量翻譯（用於替換整個 DOM 樹的文字）
  window.__applyTranslations = function(lang) {
    lang = lang || 'hant';
    const t = translations[lang] || translations['hant'];
    
    // 遍歷所有帶有 data-i18n 屬性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
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
      const key = el.getAttribute('data-i18n-title');
      if (t[key]) el.title = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) el.placeholder = t[key];
    });

    // 更新 tooltip (data-tooltip)
    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
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
      const key = el.getAttribute('data-i18n-aria-label');
      if (t[key]) el.setAttribute('aria-label', t[key]);
    });
  };

  console.log('[i18n] Translation system loaded');
})();

