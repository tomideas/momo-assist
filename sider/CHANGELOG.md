# Changelog

All notable changes to this project will be documented in this file.

---

## [2.21.71] — 2026-06-06
### Changed — 工作區改為直接 git repo
- Workspace 根目錄直接 `git init`，連接 `github.com/tomideas/momo-assist`。
- 移除 rsync + `temp/momo-assist-repo/` 中間層，push 流程大幅簡化。
- 新增 `.gitignore`：排除 `temp/`、`keys/`、`dist/`、`icon/`、`dev-notes/` 等。
- 更新 `instructions.md` §2 目錄結構與 §13 發版流程，反映新 push 方式。

---

## [2.21.70] - 2026-06-06
### Fixed — 模型切換不再清空普通對話
- 修正普通 AI 模型之間切換時，側邊欄會誤開新對話、看起來像聊天記錄被清除的問題。
- Hermes 仍使用固定本地 session，OpenClaw 現在也使用獨立的 `momo-openclaw-main` session，避免 Agent history 覆蓋普通模型對話。
- 從 Hermes / OpenClaw 切回普通模型時，會優先恢復原本的普通 Momo 對話。

---

## [2.21.69] - 2026-06-06
### Changed — AI 協作說明擴充
- 擴充 `instruction.md`，補充 AI 啟動流程、隱性依賴、核心資料結構、常見修改流程、驗證矩陣、發版細節與風險清單。
- 新增 `instructions.md` 作為相容入口，方便習慣讀取複數檔名的 AI 工具找到主說明。

---

## [2.21.68] - 2026-05-25
### Added — AI 協作說明
- 新增根目錄 `instruction.md`，供其他 AI 模型快速理解專案結構、架構、修改慣例與發版流程。

---

## [2.21.67] - 2026-05-25
### Changed — GitHub repo 與說明書網址
- GitHub repository 由 `hii-momo` 更名為 **`momo-assist`**。
- 正式說明書網址改為 **https://tomideas.github.io/momo-assist/**。

---

## [2.21.66] - 2026-05-25
### Changed — GitHub repo 與說明書網址
- GitHub repository 由 `momo-bud` 更名為 **`hii-momo`**。
- 正式說明書網址改為 **https://tomideas.github.io/hii-momo/**（舊 `/momo-bud/` 由 GitHub 轉址）。

---

## [2.21.65] - 2026-05-25
### Changed — OpenClaw Setup Guide 設定範例
- Server setup 改為完整 `openclaw.json` 範例（`allowedOrigins`、`allowInsecureAuth`、`dangerouslyDisableDeviceAuth`、`auth.mode: token`），以 `YOUR_HOST:PORT` 與 `<your-gateway-token>` 佔位，不含真實 IP 或密鑰。

---

## [2.21.64] - 2026-05-25
### Changed — OpenClaw Setup Guide
- 將 **Token Only**（`allowInsecureAuth`、Connect 步驟、安全提示）併入 Server setup 區塊，與 WebSocket Origin 設定同一頁說明。
- 移除重複的獨立「連線步驟」區塊。

---

## [2.21.63] - 2026-05-25
### Fixed — Setup Guide 顯示原始 HTML 標籤
- i18n 新增 `data-i18n-html`，讓教學文案中的 `<code>`、`<strong>`、`<em>` 正確渲染為格式，不再顯示成字面 `<strong>` 文字。

---

## [2.21.62] - 2026-05-25
### Fixed — OpenClaw Setup Guide 文案
- 移除從 Copilot / ClawClip 複製的 Device Auth、Ed25519、Save & Connect 等不適用說明。
- 改為符合 Momo 實作：Gateway Token + Connect、Session 選擇與遠端 Gateway 注意事項。

---

## [2.21.61] - 2026-05-25
### Fixed — OpenClaw 連線與 Gateway URL
- 將 OpenClaw WebSocket 握手協定由僅支援 v3（`min=3, max=3`）升級為 v3–v4（`min=3, max=4`），修正新版 Gateway 回報 `protocol mismatch`（`expected=4`）而無法 Connect / 載入 Session 的問題。
- Gateway URL 現可接受 `http(s)://` 與 `ws(s)://`；`http(s)` 會自動轉為 `ws(s)` 再連線，並在格式不正確時顯示明確錯誤提示。

---

## [2.21.60] - 2026-05-25
### Changed — 產品名稱更新
- Extension 顯示名稱由 **Momo AI Bud** 更新為 **Hii~ Momo: AI Assist**。
- 同步更新 `manifest.json`、側邊欄 / 設定頁 `<title>`、多語系文件標題、浮球 tooltip、web search 標記與 README 內的產品名稱。

---

## [2.21.59] - 2026-05-25
### Fixed — 後續 AI 回覆不再顯示舊引用頁面圖示
- 修正 assistant action bar 的引用頁面圖示用整個 session 是否曾有 `_pageContext` 判斷，導致第二輪、第三輪未重新引用頁面的 AI 回覆仍顯示 reference page icon。
- 圖示現在只會顯示在「該 assistant 回覆前一條 user message」本身帶有 Page Referenced 的情況，並只打開該輪綁定的 page context。

---

## [2.21.58] - 2026-05-25
### Fixed — 引用頁面不再於後續回合重複注入
- 修正引用頁面內容綁定到 user message 後，後續多輪對話仍可能因歷史訊息一起送出而重複注入整頁內容、增加 token 成本的問題。
- 現在只有「最新一條 user message 本身帶有 Page Referenced」時，才會把頁面內容注入 API payload；後續追問會只送可見對話歷史，不再重送整份頁面。

---

## [2.21.57] - 2026-05-25
### Added — Smart Capture 與可見文字擷取
- 引用頁面擷取模式新增 `Smart Capture (Recommended)` 與 `Visible Text`；新安裝或未設定模式時預設使用 Smart Capture。
- Smart Capture 會先偵測頁型：文章 / 文件頁走 `Markdown Smart Extraction`，產品頁、定價頁、dashboard、settings、表格 / 卡片 / 按鈕密集頁走 `Visible Text`，以降低多餘 DOM / hidden template 對 token 的浪費。
- Visible Text 只收集實際可見的標題、段落、列表、表格、按鈕、價格 / plan / feature 類區塊並去重；若精簡結果太短，才回退到 `document.body.innerText`。

---

## [2.21.56] - 2026-05-25
### Fixed — Markdown 智能提取誤抓隱藏內容
- 修正 `Markdown Smart Extraction` 在產品頁 / SPA 頁面可能被 Mozilla Readability 誤判，導致引用 URL 正確但內容抓到頁面內隱藏模板或其他文章片段的問題。
- Readability 擷取結果現在會與目前頁面的 title / H1 關鍵字比對；若不一致，會丟棄 Readability 結果並改用未被 Readability 改動的 fallback DOM。
- fallback 另加入實際頁面的 `document.body.innerText` 可見文字保底，避免 hidden DOM / template content 混入引用內容。

---

## [2.21.55] - 2026-05-25
### Fixed — 引用頁面內容送出穩定性
- 修正「Page Referenced / 已引用頁面」已顯示，但部分 OpenAI-compatible provider（例如 Qwen 類模型）回覆仍像沒有看到頁面內容的問題。
- 引用頁面內容現在會綁定到當次 user message 的 API payload，而不是依賴對話中途插入的 system message；送出 API 時會過濾本地 `_pageContext` system 訊息，避免 provider 對中途 system role 支援不一致。
- 聯網搜尋判斷改用原始使用者輸入，不會把整份引用頁面內容誤當成搜尋 query。

---

## [2.21.54] - 2026-05-24
### Fixed — Hermes / OpenClaw 設定頁刷新後保持連線狀態
- 修正設定頁載入 Hermes / OpenClaw provider config 時會把 agent model toggle 強制關閉、並把 Connect button 重設為 disconnected 的問題；切換 Appearance Theme 或刷新 settings 後不再要求重新 Connect。
- Hermes / OpenClaw 上次成功 Connect 的狀態會按 provider 存入 local storage，並用 Base URL / API key 是否存在 / OpenClaw session key 作為匹配條件；舊版本未記錄狀態時會沿用已啟用的 agent model 作為首次恢復依據，手動 Disconnect 仍會清除該 provider 的連線狀態並關閉模型。
- sidepanel 補上 sync `model` 變更監聽，避免 settings 頁更新模型選擇後，聊天面板模型下拉與實際選擇不同步。

---

## [2.21.53] - 2026-05-24
### Fixed — Hermes / OpenClaw 編輯後滾動位置
- Hermes / OpenClaw 編輯舊 user message 後會作為新訊息重新發送，因此儲存編輯後會穩定跳到最底部的新 user / assistant 訊息位置。
- 修正 agent provider 編輯時重畫整個訊息列表造成「先跳到底、再跳回舊位置」的回彈問題；現在只局部恢復舊訊息 DOM，再追加新訊息。
- 一般 OpenAI-compatible provider 的編輯重跑位置不變。

---

## [2.21.52] - 2026-05-24
### Changed — Hermes / OpenClaw 編輯舊訊息改為重新發送
- 編輯 user message 時，若目前模型是 Hermes 或 OpenClaw，Momo 不再替換舊訊息並截斷本地對話歷史；儲存編輯後會把編輯後內容作為一條新的 user message 追加，然後重新送給 agent provider。
- 一般 OpenAI-compatible provider 保留原本行為：編輯舊 user message 會截斷該訊息之後的本地訊息並重新生成。
- 這符合 Hermes API Server 與 OpenClaw Gateway 的 session/gateway 型行為：遠端 agent session 已接收的歷史不能由 Momo 假裝回退。

---

## [2.21.51] - 2026-05-24
### Fixed — AI 生成圖片接收去重
- 修正 Hermes / ComfyUI 回傳 `MEDIA:http://.../view?filename=xxx.png&type=output` 時，Momo 會同時把完整 `MEDIA:` URL 與 query 裡截出的裸 `.png` URL 當成兩張圖下載，造成同圖重複顯示的問題。
- 圖片 URL 偵測改為逐行處理：`MEDIA:` 行只取完整 media URL，不再額外套用裸 URL 偵測；ComfyUI `/view` URL 會以 `origin + path + filename + type + subfolder` 正規化去重。

---

## [2.21.50] - 2026-05-24
### Added — Hermes / OpenClaw 生成圖片接收暫行方案
- AI 回覆中若包含 `MEDIA:<https-url>`、Markdown 圖片或裸圖片 URL，sidepanel 會嘗試經 background `proxy_fetch` 下載圖片，轉成 data URL 後存入 `AttachmentStore`，並在 AI 訊息中以本地 IndexedDB 附件渲染，不只保留外部連結。
- background `proxy_fetch` 新增 `responseType: "dataUrl"` 分支，供 sidepanel 下載 Hermes / OpenClaw 回傳的遠端圖片資源。
- OpenClaw Gateway 回覆若以 `image` / `image_url` content part 帶出 HTTP 圖片，也會轉成 `MEDIA:<url>` 進入同一條下載與本地保存流程。
- 後續若改成 Hermes / OpenClaw media endpoint 直連方案，可優先移除 `extractAssistantImageUrls()`、`cacheAssistantGeneratedImages()`、`downloadAssistantImageRef()` 與 `proxy_fetch` 的 `dataUrl` 分支，再改由 endpoint 回傳穩定媒體 URL 或二進位內容。

---

## [2.21.49] - 2026-05-23
### Fixed — 設定頁三語系走查補漏
- 補齊 `promptVisibleToggle`、`connectToLoadSessions`、`gatewayTokenLabel`、`apiServerKeyLabel`、TTS 語系分組等 i18n key。
- 修正 OpenClaw 教學關閉鈕、Session 下拉 placeholder、Provider API Key 標籤等硬編碼字串。
- 切換語言時同步更新 TTS 語音分組標籤與 OpenClaw Session placeholder。

---

## [2.21.48] - 2026-05-23
### Fixed — 設定頁模型列 tooltip 語系
- 啟用模型列表的 Custom / Prefix 輸入框 tooltip 改走 i18n，英文介面不再顯示硬編碼繁中提示。

### Fixed — Hermes / OpenClaw 連線狀態
- Hermes `New Session` 在 Connect 成功前會保持 disabled，避免未連線時建立無效的新 session。
- Hermes / OpenClaw 連線成功後按鈕顯示 `Connected`，hover 或 focus 時才顯示 `Disconnect`，點擊後才會斷線。

---

## [2.21.47] - 2026-05-23
### Fixed — Hermes session reset 與污染 history
- Hermes request 現在只送最新一條 user message，避免把 Momo 本地舊對話或其他 provider 的非標準欄位帶入 Hermes API Server。
- 設定頁 Hermes 區塊新增 `New Session`，可建立新的 Hermes server session id，並清空 Momo 本地 Hermes 對話記錄，用於處理 server session 內混入不相容 provider history 的情況。
- sidepanel 會監聽 Hermes session reset，若 Hermes 畫面已開啟會即時清空本地 Hermes 對話。

---

## [2.21.46] - 2026-05-22
### Fixed — Hermes 單一 session 與歷史延續
- Hermes (beta) 現在會固定使用 Momo 的 `momo-hermes-main` 本地對話，重新打開 sidepanel 或切回 Hermes 時會回到同一份 Momo 聊天記錄，不再被「重新打開時開新對話」切出多個 Hermes 對話。
- 除 Hermes / OpenClaw 外，切換到任何一般模型時都會建立新的 `New Chat`；重新打開 sidepanel 時若目前選的是一般模型，也會避免沿用 Hermes / OpenClaw 或上一輪一般模型的對話。
- Hermes chat request 會帶上 `X-Hermes-Session-Id`、`X-Hermes-Session-Key` 與 `Idempotency-Key`，讓 Hermes API Server 端維持同一條 session / memory scope，並保存 Hermes 回傳的 session id 供下次沿用。
- background `proxy_fetch` 現在會回傳 response headers，支援讀取 Hermes 的 `X-Hermes-Session-Id`。

---

## [2.21.45] - 2026-05-18
### Fixed — Markdown 表格解析放寬
- 放寬 AI 回覆表格的 Markdown 解析：接受 `-` / `--` 分隔、標題與分隔行之間空行、缺少完整分隔列，以及分隔列尾端僅有 `:` 的對齊標記。
- 無標準分隔列時，若下一行起為連續 pipe 列，會自動視為表頭＋資料列並渲染成 HTML 表格，減少回覆顯示成一排 `|` 的情況。

---

## [2.21.44] - 2026-05-18
### Docs — 同步最新說明書與 UI 規格
- 更新 docs 的設定總覽、側邊欄聊天、聊天記錄、圖片上傳與更新日誌，補充重新打開時開新對話、附件分離儲存、圖片壓縮與啟用模型窄版排版。
- 更新 `dev-notes/UI-SPEC.md` 至 v1.2，加入設定頁 toggle section 與 Enabled Models 在窄版下的排版規範。

---

## [2.21.43] - 2026-05-18
### Fixed — 啟用模型窄版排版
- 修正設定頁縮窄時「啟用模型」列擠出右側或控制項重疊的問題。
- 窄版下模型名稱、Custom JSON、Prefix、啟用開關與刪除按鈕會自動換行並維持在卡片內，與其他設定區塊排版規範一致。

---

## [2.21.42] - 2026-05-18
### Fixed — 設定頁窄版開關排版
- 修正 Chrome 視窗縮窄時「懸浮球」與「側邊欄行為」區塊被置中顯示的問題。
- 這兩個開關區塊在窄版仍維持標題與說明靠左、開關靠右，避免版面跳動。

---

## [2.21.41] - 2026-05-18
### Added — 側邊欄自動新對話開關
- 在設定頁「側邊欄」區塊新增「重新打開時開新對話」開關，預設開啟。
- 關閉後，重新打開 sidepanel 會延續上次對話；開啟時則維持重新打開後自動建立新對話。
- 補齊繁中、簡中、英文 i18n 文案，並讓 sidepanel 即時讀取 `freshChatOnPanelOpen` 設定。

---

## [2.21.40] - 2026-05-18
### Changed — 重新打開側邊欄時開新對話
- 恢復 sidepanel 重新開啟時自動建立全新對話；只有目前 session 已有使用者或 AI 對話內容時才新建，避免空白 session 重複堆疊。
- sidepanel 從 hidden 回到 visible 時也會套用同樣邏輯，符合按工具列 icon 關閉後再打開應看到新對話的預期。
- 保留離開當前 session 時的附件歷史壓縮流程，避免重新開啟造成圖片附件膨脹。

---

## [2.21.39] - 2026-05-18
### Changed — 關閉預設效能診斷輸出
- 停用預設 `[SP][perf]` 啟動量測與 `chatSessions stats` console 輸出，避免正式使用時 console 過度吵雜，也避免不必要的歷史統計計算。
- 附件歷史壓縮完成 log 改為只在 debug 模式顯示。
- 若需重新診斷，可在 sidepanel DevTools Console 執行 `localStorage.setItem('momoDebugPerf','1')` 後 reload；關閉則執行 `localStorage.removeItem('momoDebugPerf')` 後 reload。

---

## [2.21.38] - 2026-05-18
### Performance — 歷史附件二次壓縮
- 新增歷史附件降級流程：新增對話、切換對話、sidepanel 隱藏或關閉時，會嘗試將該 session 的圖片附件壓縮成最長邊 640px、JPEG quality 0.7 的歷史版本。
- 當前對話仍先保留較清楚的 1600px 版本供 AI 分析；對話離開當前狀態後再縮小，降低 IndexedDB 附件庫長期成長速度。
- `AttachmentStore` 新增依 session 查詢附件能力，供歷史壓縮流程只處理指定對話。

---

## [2.21.37] - 2026-05-18
### Performance — 新圖片與截圖自動壓縮
- 新增圖片壓縮流程：新上傳、貼上與截圖附件在儲存前會以最長邊 1600px、JPEG quality 0.82 產生較小版本，若原圖更小則保留原圖。
- 截圖仍可送給視覺模型分析，但不再預設保存未壓縮 PNG，降低 IndexedDB 附件庫後續成長速度。
- 編輯訊息時新增圖片也會套用相同壓縮流程，避免重新編輯造成大型 base64 回流。

---

## [2.21.36] - 2026-05-18
### Performance — 圖片與截圖附件分離儲存
- 新增 IndexedDB 附件儲存層，新的圖片上傳與截圖會存入 `momo-bud-attachments`，`chatSessions` 只保留附件引用，避免把 base64 原圖塞進主對話歷史。
- 送 API、OpenClaw、訊息渲染與編輯流程會在需要時依附件引用讀回圖片資料；舊版已存在於 `chatSessions` 的 base64 圖片仍維持相容。
- 側邊欄開啟時不再自動建立新對話並立即寫回整包 `chatSessions`，降低冷啟動時的大型 storage 寫入成本。
- `chatSessions stats` 補充 legacy 圖片、inline data URL、附件引用數與最大 session 列表，方便定位既有歷史資料膨脹來源。

---

## [2.21.35] - 2026-05-18
### Performance — 啟動與對話儲存量測
- 新增側邊欄啟動分段 console 量測，記錄 input-ready、theme/model 載入、資料狀態載入、sidepanel open handling、`renderAllMessages()` 同步段與 init 完成耗時。
- 新增 idle 階段的 `chatSessions` 統計輸出，包含 session 數、總訊息數、總文字長度、近似 storage JSON 大小與最大單則訊息長度，用來判斷冷啟動卡感是否來自歷史資料過大。

---

## [2.21.34] - 2026-05-18
### Performance — 降低語言切換與超長 Markdown 卡頓
- 側邊欄 `zhVariant` storage 變更改為 80ms debounce，合併 local + sync 連續事件，避免同一次語言切換重複刷新靜態 UI。
- 非串流超長 Markdown（超過 30,000 字）初次渲染時先顯示純文字，再透過 `requestIdleCallback` 回填 Markdown DOM，降低冷啟動或切換長對話時的同步卡頓。

---

## [2.21.33] - 2026-05-18
### Fixed — 對話文字渲染不受 UI 語系影響
- 對每個 `.message-content` 加上 `translate="no"` 與依內容偵測出的固定 `lang`（`zh-Hant` / `zh-Hans` / `und`），避免 UI 切換 `html lang` 時讓對話泡泡跟著使用不同語系的字型 fallback。
- 在 `sidepanel.css` 為 `.message-content` 指定穩定中文字型序列，讓標點與中文字形在繁中／簡中／英文 UI 間保持一致。
- 串流更新與最終回填 (`updateStreamingMessage()` / `replaceMessageContent()`) 也會同步更新對話內容自己的 `lang`，但不做文字轉換。

---

## [2.21.32] - 2026-05-18
### Fixed — UI 翻譯不觸碰對話內容
- 在 `i18n-loader.js` 的 `__applyTranslations()` 加入硬性保護：所有位於 `.message-content` 內的節點一律跳過，不更新 `data-i18n`、`title`、`placeholder`、`data-tooltip` 或 `aria-label`。
- 目的：繁中／簡中／英文切換只影響 UI，不會改寫已顯示的使用者或 AI 對話內容；即使對話文字中意外出現 `data-i18n` 類似標記，也不會被翻譯器處理。
- 延續 v2.21.30 的效能策略：語言切換不重繪對話泡泡、不跑繁簡轉換、不重建 Markdown DOM。

---

## [2.21.31] - 2026-05-18
### Docs — 卡頓修復總結
- 補充本輪效能調整的最終結論：語言選擇（繁中／簡中／英文）只影響 UI 文案，不再處理 AI 或使用者對話內容。
- 明確記錄已降低負載的關鍵點：語言切換不重跑 `renderAllMessages()`、設定頁不再載入 `zh-conv.js`、頁面擷取函式庫維持按需載入、外部腳本維持 `defer`、長對話渲染維持分批補填。
- 保留後續觀察重點：若仍有卡感，優先檢查 `sidepanel.js` 體積、`chatSessions` 儲存量、以及超長 Markdown 訊息的首批渲染成本。

---

## [2.21.30] - 2026-05-15
### Performance — UI 語系切換不碰對話內容
- **側邊欄**：切換 `zhVariant`（繁中／簡中／英）時只執行 `__applyTranslations` 更新具 `data-i18n` 的介面元件；**不再呼叫 `renderAllMessages()`**，避免對所有對話泡泡重跑 Markdown／重建 DOM（先前主要卡頓來源）；僅在歷史面板已開啟時輕量重繪 `renderSessionList()`。
- **設定頁**：`applyLanguageConversion()` 僅載入對應 `hant`/`hans`/`en` 的 JSON 翻譯，**移除整頁 DOM  walks + `zh-conv.js`**，降低切換語言時的 CPU 與 script 載入。
- **語意**：繁／簡切換僅影響使用者介面文案；**對話區顯示的 AI／使用者訊息保持原文字**，不因語系選項而再處理。

---

## [2.21.29] - 2026-05-15
### Changed — 還原介面語言選擇
- 設定頁再次提供 **繁體中文 / 简体中文 / English** 三選一切換（`#sec-language`），選擇寫入 `chrome.storage.sync` / `local` 的 `zhVariant`。
- 側邊欄：`loadTheme` 會讀取 `zhVariant` 並套用 `__applyTranslations`；`chrome.storage.onChanged` 監聽 `zhVariant`，即時重繪對話區、建議問題與歡迎區；`sp_t`／頁面工具提示／TTS `utterance.lang` 皆以使用者選定的語言為準。
- 選項頁透過 `applyLanguageConversion()` 套用翻譯（v2.21.30 起改為僅 `__applyTranslations`，不再載入 `zh-conv.js`）。
- `background.js`：首次安裝仍會依瀏覽器語言寫入預設 `zhVariant`（若尚未設定）。

---

## [2.21.28] - 2026-05-15
### Performance — 啟動卡頓修復（介面語言選擇已於 v2.21.29 還原）
- **按需載入頁面擷取函式庫**：`Readability.js`（82KB）、`turndown.js`（26KB）改為點擊「引用頁面」時才動態載入，減少啟動同步解析約 110KB，冷啟動凍結改善 100–200ms。
- **腳本背景執行緒解析**：所有外部腳本加上 `defer`，V8 改於背景執行緒編譯，不阻塞主執行緒，預估主執行緒凍結時間再減少 30–60%。
- **輸入欄立即解鎖**：`init()` 重構，`autoGrow`、`bindEvents` 移至第一行同步執行，storage 讀取分兩批並行（Phase 1 主題＋模型 → Phase 2 對話資料），`setupPageChangeWatcher` 延後至 `setTimeout(0)` 執行，使用者不再需要等到所有資料載入完畢才能輸入。
- **長對話非阻塞渲染**：`renderAllMessages()` 改用 `DocumentFragment` 批次插入；超過 15 條訊息時先同步渲染最新 15 條，其餘舊訊息透過 `requestIdleCallback` 非同步向前補填，自動維持滾動位置。
- **URL 輪詢間隔**：頁面變化偵測從 500ms 調整為 1500ms，降低持續 CPU 佔用。

---

## [2.21.25] - 2026-05-08
### Fixed — Fetch Timeout for Stalled Connections
- Added a 120-second fetch timeout (`setTimeout` + `AbortController.abort()`) to `streamChatCompletion()` in `sidepanel.js`.
- Prevents the vague `(Error) Connection failed: signal is aborted without reason` when the browser `fetch` hangs indefinitely due to network stalls, proxy issues, or CORS preflight failures.
- The timeout now produces a clear `Request timed out after 120s` error message instead of the cryptic default abort reason.

---

## [2.21.23] - 2026-05-05
### Fixed — Hermes Setup Guide i18n
- Hermes Setup Guide modal 改用 i18n key，補齊繁中、簡中、英文三套文案。
- Hermes `.env` 範例改為真正多行 code block，避免在 modal 內被壓成單行難以閱讀。
- README（中英文）新增 Hermes Agent 介紹區塊，文件頁 `docs/ai-providers.html` 與 `docs/en/ai-providers.html` 補充 Hermes 使用建議。

---

## [2.21.22] - 2026-05-05
### Added — Hermes Setup Guide
- Hermes (beta) 現在和 OpenClaw (beta) 一樣，在 Connect row 右側顯示 `Setup Guide` 按鈕。
- Setup Guide modal 會依照目前 provider 切換內容；Hermes 會顯示 `.env` 範例與重啟 Hermes gateway 的步驟，包含 `API_SERVER_CORS_ORIGINS=*` 說明與 `API_SERVER_KEY=<your-secret-key>` 佔位。

---

## [2.21.21] - 2026-05-05
### Docs — Hermes `.env` 設定說明
- 設定頁與中英文 AI Providers 文件補充 Hermes Agent `.env` 範例，說明需像 OpenClaw gateway 一樣修改 `API_SERVER_ENABLED`、`API_SERVER_HOST`、`API_SERVER_PORT`、`API_SERVER_KEY` 與 `API_SERVER_CORS_ORIGINS`。
- 文件範例使用 `API_SERVER_KEY=<your-secret-key>` 佔位，不再使用實際密碼；並標明 `API_SERVER_CORS_ORIGINS=*` 是 Chrome extension / 遠端連線最簡單可用設定。

---

## [2.21.20] - 2026-05-05
### Fixed — Hermes Chat 403
- Hermes chat request 改由 background `proxy_fetch` 代發，避免 sidepanel 直接 `fetch` 時與 curl 不一致的 browser Origin / CORS / preflight 差異造成 `HTTP 403`。
- Hermes `/v1/chat/completions` 改用官方 curl 對齊的最小 OpenAI-compatible payload：`model: "hermes-agent"`、`messages`、`stream: false`，不再帶通用 provider 的 `temperature` / thinking 參數。

---

## [2.21.19] - 2026-05-05
### Fixed — Hermes 連線與切換行為
- Hermes 發生 `HTTP 401/403` 或 browser fetch 失敗時，錯誤訊息會直接提示檢查 `API_SERVER_KEY`，並顯示目前 Chrome extension origin，方便在 Hermes host 設定 `API_SERVER_CORS_ORIGINS=chrome-extension://<extension-id>` 後重啟 gateway。
- 從其他模型切換到 Hermes agent provider 時會自動開新對話、清掉目前畫面的舊對話與圖片／頁面引用狀態，避免把其他模型的上下文送入 Hermes。
- Hermes / agent provider 送出 API 前會過濾本地 system message，確保自訂 system prompt 真正不會送到 agent provider。

---

## [2.21.18] - 2026-05-05
### Fixed — OpenClaw 重覆上一輪回覆
- 對齊 OpenClaw Gateway 最新協議與官方 Copilot 行為，`chat.send` 改回 `deliver: true`，避免訊息只被記錄但未正常派送給 agent。
- OpenClaw 串流事件改用 `runId` 關聯本次發送；後備 `chat.history` 輪詢會先建立發送前 history snapshot，只接受本次新增 user 之後的新 assistant 回覆，避免誤抓上一輪回覆並在畫面重覆顯示。

---

## [2.21.17] - 2026-05-05
### Added — Hermes Provider
- 新增 **Hermes (beta)** AI Service Provider，預設 Base URL 為 `http://127.0.0.1:8642/v1`，預設模型為 `hermes-agent`。
- Hermes 採用官方 OpenAI-compatible HTTP API Server 接入，沿用現有 Chat Completions 串流路徑，不使用 OpenClaw 的 WebSocket RPC。
- 設定頁新增 Hermes (beta) provider 選項、官方 favicon 風格 icon、API Server 設定提示與官方文件連結；Hermes 改為跟 OpenClaw 一樣需要先 Connect，成功後才自動啟用 `hermes-agent` 模型，避免未連線或 key/CORS 錯誤時側欄直接送出造成 HTTP 403。
- Hermes Connect 會優先檢查 `/v1/models` 以驗證 `API_SERVER_KEY`，再 fallback 到 `/health` / chat completion，錯誤訊息會提示檢查 `API_SERVER_KEY` 與 `API_SERVER_CORS_ORIGINS`。
- 選取 Hermes (beta) 時，側邊欄會像 OpenClaw 一樣禁用自訂 system prompt、聊天歷史/新對話、聯網搜尋與引用頁面；即使切換前已有 pending page reference，送出時也不會附加到 Hermes。
- README 與中英文 AI Providers 文件同步更新為 12+ providers，並補充 Hermes Agent 啟用 `API_SERVER_ENABLED` / `API_SERVER_KEY` 的設定說明。

---

## [2.21.16] - 2026-05-05
### Fixed — 串流回覆中 Enter 不再停止生成
- 修正 AI 回覆尚未完成時，在輸入框按 `Enter` 或 `Cmd/Ctrl+Enter` 會誤觸發停止生成，造成 `BodyStreamBuffer was aborted` 的問題。
- 現在串流中輸入框的送出快捷鍵會被忽略；使用者可先輸入下一句，待上一輪回覆完成後再按 `Enter` 送出。
- 停止生成仍保留在送出按鈕切換出的停止按鈕上。

---

## [2.21.15] - 2026-05-05
### Changed — 截圖框選交互優化
- 截圖框選遮罩新增操作提示，說明可拖曳選區、雙擊截取整個可見頁面、按 `Esc` 取消。
- 雙擊遮罩會直接選取整個目前可見頁面並自動送出，方便快速模擬全屏截圖翻譯。
- 單擊或過小拖曳不再直接取消遮罩，避免誤觸；仍可用 `Esc` 或右鍵取消。

---

## [2.21.14] - 2026-05-05
### Changed — 截圖上傳支援框選區域
- 「截圖上傳」按鈕改為先在目前網頁顯示框選遮罩，拖選區域後只裁剪該區域並自動送出，避免每次都上傳整個可見分頁。
- 支援按 `Esc` 或右鍵取消框選；過小選區會視為取消。
- 裁剪時依照實際截圖尺寸與 viewport 比例換算座標，保留高 DPI 螢幕下的清晰度。

---

## [2.21.13] - 2026-05-05
### Added — 截圖上傳自動送出
- 在輸入區工具列新增「截圖上傳」按鈕，可截取目前 Chrome 活動分頁的可見畫面，加入圖片訊息並自動送出，方便用視覺模型快速 OCR／翻譯畫面內容。
- 截圖功能會在首次使用時請求 `<all_urls>` 可選權限，以符合 `chrome.tabs.captureVisibleTab` 對截圖權限的要求；PNG 過大時會自動改用 JPEG，仍超過 5MB 則提示縮小視窗後重試。
- 新增繁中、簡中、英文的截圖按鈕與錯誤提示文案。

### Changed — Qwen 預設模型
- Qwen 預設模型改為 `qwen3.5-plus` 與 `qwen3.5-flash`，對齊目前 Qwen API 平台顯示的旗艦模型名稱。

---

## [2.21.12] - 2026-05-05
### Fixed — 引用頁面不再改動原網站 DOM
- 修正 Readability 引用頁面抓取流程會在原頁插入 `<base>` 並移除 hidden 元素，可能導致部分網站（例如 `linux.do` / Discourse 類站點）抓取後排版變成未套樣式狀態的問題。
- 內容提取改為先 clone `document.documentElement`，只在 clone 內加入 `<base>`、清理 script/style/hidden 元素並回傳 HTML；不再修改 live page DOM。

---

## [2.21.11] - 2026-05-05
### Fixed — 聊天畫面抖動與聯網搜尋穩定性
- 修正輸入框 auto-grow、聊天區 scrollbar 與串流自動跟隨互相影響時，造成打字或 AI 串流輸出期間介面抖動的問題；聊天區改為保留穩定 scrollbar gutter，並限制串流自動捲動每個 animation frame 最多執行一次。
- 側邊欄「聯網搜尋」維持智慧觸發：開啟時僅在訊息看起來需要即時網路資訊時搜尋；未開啟時仍保留明確搜尋語的自動觸發。
- 搜尋結果同時注入 system prompt 與最後一則 user message，降低模型忽略搜尋上下文後回答「我沒有連網」的機率。
- Brave / Tavily 搜尋失敗、未設定 API key 或回傳 0 筆時，會自動 fallback 到 DuckDuckGo；OpenRouter `:online` 只作為 client-side 搜尋失敗時的後備。
- 設定頁與繁中／簡中／英文 i18n 說明同步更新為新的聯網搜尋行為。

---

## [2.21.10] - 2026-05-04
### Changed — 引用頁面預設查詢不顯示在對話
- 調整 2.21.9 的 LM Studio 相容修正：空白引用頁面送出時，預設 user query 只在組 API payload 時補入，不再寫進 session，也不會顯示在聊天畫面。
- UI 仍只顯示「Page Referenced / 引用頁面」標籤；LM Studio / Qwen 仍能收到非空 user query 以避免 Jinja template 報錯。

---

## [2.21.9] - 2026-05-04
### Fixed — LM Studio 引用頁面空訊息
- 修正只附加「引用頁面」但輸入框空白時，仍送出空白 `user` 訊息，導致 LM Studio / Qwen Jinja prompt template 報錯 `No user query found in messages` 的問題。
- 現在空白引用送出會自動補上一句「請根據引用頁面內容回答。」作為 user query，引用頁面內容仍保留為獨立 system context。
- 送出按鈕只會依照等待送出的 `_pendingPageContext` 啟用，避免已使用過的舊頁面引用誤判為可送出。

---

## [2.21.8] - 2026-04-12
### Changed — 聯網搜尋觸發邏輯
- 側邊欄「聯網搜尋」開啟時改為**智慧觸發**：仍須通過 `shouldSearch`（明確搜尋語、價格／新聞／天氣等訊號、訊息內 URL 等）才會執行搜尋，**不再每則使用者訊息都搜**，以減少延遲、token 與搜尋 API 用量。
- `year-ref`（今年／去年）判斷移至「創作／翻譯」等略過規則之後，避免「幫我寫一篇 2026 年的故事」誤觸發搜尋；「總結 2025 年…」等仍以年份觸發搜尋。
- 設定頁與 i18n 說明已同步為上述行為。

---

## [2.21.7] - 2026-04-12
### Fixed — 聯網搜尋與簡短追問
- 開啟聯網搜尋時，若使用者只輸入承接上一輪的短句（例如先前談 iPhone、接著問「中國的價錢」），先前僅用**當則訊息**組搜尋關鍵字，容易變成籠統的「中國／價錢」而脫離主題。
- **修正**：從**目前訊息之前**的對話文字擷取主題關鍵字（常見產品／型號等，如 `iPhone`），在判斷為「價格／地點類簡短追問」且字面上尚未帶出商品時，將關鍵字**併入實際搜尋字串**。
- **送 API**：在上述條件下於最後一則純文字 user 訊息前加上一行英文脈絡（`Related topic from earlier in the conversation: …`），讓 OpenRouter `:online` 等由伺服器決定搜尋詞時也能對齊上一輪主題。
- 實作位置：`sider/sidepanel.js`（`buildContextualSearchQuery`、`extractTopicHintsFromText`、`shouldAugmentSearchQuery` 等）。

---

## [2.21.6] - 2026-04-08
### Changed
- 將設計系統預覽文件由 `dev-notes/ui-preview.html` 重新命名為 `dev-notes/design-system-preview.html`，名稱更貼近用途
- 同步更新 Design System Preview 文件內版本字樣至 `v2.21.6`

---

## [2.21.5] - 2026-04-08
### Changed
- `dev-notes/design-system-preview.html` 補齊按鍵交互說明：新增 Primary / Outline / Danger / Disabled 的行為規範，以及分段按鈕（single-select、active 狀態、Auto/Light/Dark 映射）說明
- Design System Preview 文件版本字樣同步更新至 `v2.21.5`

---

## [2.21.4] - 2026-04-06
### Changed
- 產品名稱統一為 **Momo AI Bud**：`manifest.json` 的 `name`、工具列／快捷鍵提示、懸浮球與 iframe `title`、側邊欄與設定頁預設 `<title>`
### Fixed
- 設定頁瀏覽器分頁標題改為依介面語系更新（先前 `options.html` 的 `<title>` 寫死為「設定 - AI Sidebar」，選英文時仍顯示中文）；於 i18n 套用時設定 `document.title`（如英文 `Settings - Momo AI Bud`、繁中 `設定 - Momo AI Bud`）

---

## [2.21.3] - 2026-04-06
### Changed
- README / README.zh-TW：開頭賣點與功能列表對齊（含 Groq、OpenClaw、系統 TTS、字體大小／字粗、多語言、浮球等）；移除已不主打之「深度思考／think deeper」描述

---

## [2.21.2] - 2026-04-06
### Changed
- 同名模型下拉選單不再加 Provider 文字標籤（如 `(Ollama)`），僅靠 Provider icon 區分

---

## [2.21.1] - 2026-04-06
### Fixed — 本地 Provider 同名模型被誤刪
- Ollama / LM Studio 等本地 Provider 手動新增的模型若與其他雲端 Provider 預設模型同名（如在 Ollama 加 `kimi-k2.5`），會被 `sanitizeModels` 和載入時的跨 provider 過濾邏輯誤刪
- 修正：本地 Provider（ollama、lmstudio、無預設模型的 provider）跳過跨 provider 模型歸屬檢查，允許任意模型名稱

---

## [2.21.0] - 2026-04-06
### Added — Groq Provider
- 新增 Groq AI 供應商，預設模型 `openai/gpt-oss-120b` 和 `meta-llama/llama-4-scout-17b-16e-instruct`
- API Key 申請連結指向 https://console.groq.com/keys
- 設定頁顯示 Groq 免費方案說明：無須綁卡、每分鐘約 30 次請求、每日最高 14,400 次、全球頂尖推理速度
- `host_permissions` 加入 `api.groq.com`

---

## [2.20.1] - 2026-04-06
### Changed
- Google AI 預設模型更新為 `gemini-3.1-flash-lite-preview` 和 `gemini-3-flash-preview`

---

## [2.20.0] - 2026-04-06
### Fixed — 同名模型跨 Provider 共存
- 模型唯一識別改用 `provider::name` 組合 uid，不同 Provider 下的同名模型可同時啟用並出現在 sidebar 下拉選單
- 同名模型在下拉選單中自動加上 Provider 名稱標籤（如 `gemini-3.1-flash (Google AI)` / `gemini-3.1-flash (OpenRouter)`）
- 向下相容：舊格式的 model 選擇會自動遷移為新 uid 格式

---

## [2.19.5] - 2026-04-06
### Fixed — 測試連線不再彈出權限請求
- 將所有內建 AI Provider 的 API 域名加入 `manifest.json` 的 `host_permissions`，包括 DeepSeek、Google AI、MiniMax、Moonshot、NVIDIA、OpenRouter、Qwen
- 使用者按 Start Test 時不再觸發 Chrome「has requested additional permissions」彈窗
- 自訂 URL 或 localhost（Ollama / LM Studio）仍會透過 `optional_host_permissions` 動態請求

---

## [2.19.4] - 2026-04-05
### Changed — OpenClaw 設定頁 UX 重構
- **Start Test → Connect / Disconnect**：按鈕改為 Connect，連線成功後變為 Disconnect（hover 變紅），點擊可斷開連線
- **Connected 後自動載入 Session**：Connect 成功後自動呼叫 Load Sessions，不需手動操作
- **Session 切換自動載入對話記錄**：選擇不同 Session 後，側邊欄自動偵測 `providerConfigs.sessionKey` 變更並載入 `chat.history`
- **Enabled Models 預設 off**：未 Connected 前 toggle 為 off + disabled，Connected 後自動開啟
- **Load 按鈕改為 Refresh icon**：Session 旁的 Load 按鈕改為 🔄 refresh icon（`btn btn-outline small`），loading 時旋轉動畫
- **Setup Guide 移到右側**：與 Connect 按鈕同行，左邊 Connect，右邊 Setup Guide
- **Enabled Models 標題改為二級標題**：與 Session 一致的 `field-label` 樣式，左對齊
- **Session 切換提示**：切換 Session 時顯示「切換中…」→「✓ 已切換」狀態提示
- **Model name 簡化**：`openclaw:main` → `openclaw`（HTML、JS、utils.js）

---

## [2.18.1] - 2026-04-05
### Changed
- **OpenClaw 設定頁簡化**：OpenClaw provider 不再顯示完整的 "Enabled Models" 列表和 "Add Model" 按鈕，改為單一 `openclaw:main` 開關；切換回其他 provider 時恢復完整模型列表

---

## [2.17.9] - 2026-04-05
### Fixed — Provider Hint i18n 完整修復（2.17.5 ~ 2.17.9）

此問題經歷多次迭代才完全修復，記錄根因和陷阱以防再犯：

**問題**：設定頁 Provider Configuration 的 hint（"Leave empty to use default: ..." + "Apply for API Key here: ..."）在初始載入或切換語言時顯示不正確。

**根因分析（共 4 層）**：

1. **`data-i18n` 覆蓋動態內容（2.17.6）**
   - `providerBaseUrlHint` 有 `data-i18n="useDefaultUrl"`，i18n-loader 的 `__applyTranslations()` 會把 JS 動態生成的 innerHTML（含 URL + `<a>` 連結）覆蓋回簡單的翻譯字串
   - ✅ 修復：移除 HTML 中的 `data-i18n`，讓 JS 完全控制 hint 內容

2. **`currentLang` 設定時序（2.17.7）**
   - `loadProviderConfig` 的 i18n 重新呼叫在 `currentLang` 設定之前執行，`t()` 使用 fallback `'en'`
   - ✅ 修復：把重新呼叫移到 `await __applyTranslations(lang)` 完成且 `currentLang` 已設定之後

3. **語言切換未觸發 hint 更新（2.17.8）**
   - 切換語言時只呼叫了 `applyLanguageConversion()`，沒有重新呼叫 `loadProviderConfig`
   - ✅ 修復：語言切換 callback 中加入 `await applyLanguageConversion()` + `loadProviderConfig()`

4. **`applyLanguageConversion` 的 async 陷阱（2.17.9）**
   - 函數標記為 `async` 但內部用 `chrome.storage.local.get(key, callback)` — callback 模式不會被 `await` 等待，Promise 立即 resolve
   - ✅ 修復：改用 `await chrome.storage.local.get(key)`（MV3 Promise API），讓 `await` 真正等待完成

**設計原則（避免再犯）**：
- 動態生成的 UI 內容不要加 `data-i18n`，否則 i18n-loader 會覆蓋
- 依賴 i18n 翻譯的 UI 更新必須在 `__applyTranslations()` 完成後執行
- MV3 中 `chrome.storage` API 優先用 Promise 版本，避免 callback + async 的陷阱
- 語言切換時，所有 JS 動態生成的 i18n 內容都需要手動重新渲染

---

## [2.17.3] - 2026-04-05
### Added
- **所有雲端 Provider 加入 API Key 申請連結**：新增 Moonshot、NVIDIA、MiniMax、OpenRouter 的 API Key 申請頁面連結（LM Studio、Ollama、OpenClaw 為本地服務，不需要）

---

## [2.17.2] - 2026-04-05
### Changed
- **所有 AI Provider 預設模型精簡為兩個主流模型**（全部預設關閉）：
  - DeepSeek: `deepseek-chat`, `deepseek-reasoner`
  - Google AI: `gemini-2.5-flash`, `gemini-2.5-pro`
  - MiniMax: `MiniMax-Text-01`, `abab6.5s-chat`
  - Moonshot: `kimi-k2.5`, `kimi-k2`
  - NVIDIA: `nemotron-3-super-120b-a12b`, `nemotron-3-nano-30b-a3b`
  - OpenAI: `gpt-5.4-mini`, `gpt-5.4`
  - OpenRouter: `anthropic/claude-sonnet-4.6`, `deepseek/deepseek-chat`
  - Qwen: `qwen3-max`, `qwen-plus`
  - Ollama: 清空預設（本地模型由使用者自行新增）
  - LM Studio / OpenClaw: 不變

---

## [2.17.1] - 2026-04-05
### Fixed
- **「載入」按鈕中文未 i18n**：`options.html` 中 OpenClaw Session 的「載入」按鈕和 placeholder 文字改為英文預設並加上 `data-i18n="loadSessions"`，中文系統由 i18n-loader 自動替換

---

## [2.17.0] - 2026-04-05
### Changed
- **全面 i18n 國際化**：移除所有 JS 檔案中的 hardcoded 中文字串（約 50+ 處），改用 i18n key 或英文 fallback
  - `js/openclaw.js`：5 處錯誤訊息改為英文
  - `sidepanel.js`：OpenClaw 錯誤、頁面引用 UI、session 標題、圖片 alt、搜尋結果、格式化錯誤訊息等
  - `options.js`：按鈕文字、WebSocket 錯誤、TTS 預覽 fallback 等
  - `content-floatball.js`：3 個 tooltip 改為英文
- **i18n JSON 新增 25 個 key**（`en.json`、`hant.json`、`hans.json` 三語同步）

### Fixed
- **英文系統不再顯示中文錯誤訊息**：如「載入失敗」「連線逾時」「無可用 Session」等

---

## [2.16.5] - 2026-04-05
### Fixed
- **OpenClaw 回覆太慢導致「未回應」問題**：
  - `chat.send` RPC 超時從 30 秒增加到 60 秒
  - `chat.send` 超時時若事件流已有回應，不再直接結束，繼續等待回覆
  - 新增輪詢穩定檢查：備用輪詢取得回覆後若 15 秒內無新內容變化，自動視為完成

---

## [2.16.4] - 2026-04-05
### Changed
- **移除 hardcoded API Key**：NVIDIA、Ollama、Qwen 的 `defaultApiKey` 和 `enforceDefaultEnabled` 已移除，所有模型預設為關閉

---

## [2.16.3] - 2026-04-05
### Changed
- **模型選擇器固定寬度**：`#modelSelector` 寬度固定為 160px，不再隨模型名稱長度變動

---

## [2.16.2] - 2026-04-05
### Changed
- **按鈕順序調整**：Upload Image 和 Reference Page 按鈕位置互換（圖片上傳在前）

---

## [2.16.1] - 2026-04-05
### Fixed
- **OpenClaw 模式禁用聯網搜尋與引用頁面按鈕**：選擇 OpenClaw 模型時，Web Search 和 Reference Page 按鈕現在會被灰掉並禁用（opacity 0.35、pointer-events none），避免使用者誤觸無效功能；切換回其他模型時自動恢復

---

## [2.16.0] - 2026-04-05
### Added
- **UI Design System Specification** (`sider/UI-SPEC.md`): formal document covering all design tokens (light/dark), typography, spacing, border radius, component interaction states (4-state: default/hover/focus/disabled), dark mode rules, animation standards, responsive breakpoints, iconography, and accessibility guidelines
- **Cursor Rule** (`.cursor/rules/ui-design-system.mdc`): AI-readable condensed spec — auto-applies when editing CSS/HTML/JS under `sider/`
- **Design System Preview Page** (`dev-notes/design-system-preview.html`): standalone visual reference with live light/dark toggle, color swatches, type scale, spacing bars, radius grid, and interactive component demos
- **Cross-file token aliases**: `options.css` now defines `--accent`/`--accent-hover`; `sidepanel.css` now defines `--bg-page`/`--bg-card`/`--bg-subtle`/`--bg-active`/`--bg-active-hover`/`--focus` — both naming conventions work in both files

### Changed
- **iframe-sidebar.css dark mode**: migrated from `@media (prefers-color-scheme: dark)` to `[data-theme="dark"]` attribute on sidebar container, driven by `chrome.storage` theme setting via `content-floatball.js`; dark background unified to `#202223` (was `#1a1a1a`)
- **Form element width alignment**: removed `max-width: 600px` from `.provider-select-wrapper`; added `box-sizing: border-box` to `.input` and `.provider-select-button`; `.inline-row > .input` now uses `flex:1` — all form elements align to card padding edges consistently

---

## [2.15.0] - 2026-04-04
### Added
- **OpenRouter server-side web search**: when web search is enabled and provider is OpenRouter, automatically appends `:online` suffix to model name — search is handled server-side via Exa/native engine, giving much better results than client-side DDG scraping
- **OpenRouter annotations**: parses `url_citation` annotations from OpenRouter responses and displays them in the search sources modal
- **Auto-trigger search on explicit intent**: messages starting with "查一下", "搜尋", "search for" etc. now auto-trigger web search even when the toggle is OFF
- **DuckDuckGo proxy fallback**: when direct HTML fetch fails, retries through the background service worker `proxy_fetch` to bypass CORS/anti-scraping blocks

### Changed
- **Search always fires when toggle is ON**: previously, `shouldSearch()` could still skip queries even when the user explicitly enabled search — now the toggle means "always search"
- **PROMPT_BUDGET tripled** from 2000 → 6000 characters — search results no longer get aggressively truncated
- **Per-result snippet limit** increased (≤3 results: 1200 chars each; >3 results: 600 chars each)
- **Improved search injection prompt**: follows OpenRouter-style format — simpler, more natural, explicitly tells model not to claim it lacks internet access
- **Removed OpenClaw web search injection**: OpenClaw has native search capability, no longer needs client-side injection

---

## [2.14.3] - 2026-04-04
### Added
- **Prompt visibility toggle**: each system prompt card now has an on/off switch — hidden prompts won't appear in the sidebar's prompt dropdown (data stored as `visible` property, defaults to `true`)

### Changed
- **Smaller toggle switches** across the entire options page: 46×26px → 36×20px (knob 18px → 14px) for a cleaner, more modern look
- **Field labels** enlarged from 12px/secondary color to 14px/primary color — second-level headings now clearly stand out from body text
- **Web search toggle layout**: "Simple Search Mode", "Visit Website in Message", and "Internet Search ON by Default" toggles moved from left-of-hint to right-aligned (new `.toggle-row` layout matching Float Ball style)

---

## [2.14.2] - 2026-04-04
### Fixed
- **Options anchor scroll**: added `scroll-margin-top: 100px` to all sections so nav anchor jumps don't hide content behind the viewport top
- **Streaming auto-scroll**: reworked auto-follow logic using `requestAnimationFrame` and `_programmaticScroll` flag — user scroll-up now properly pauses auto-follow; removed `scroll-behavior: smooth` from chat scroller where it caused jank

---

## [2.14.1] - 2026-04-04
### Added
- **First-install language detection**: `background.js` now writes `zhVariant` to both local and sync storage on install, based on Chrome UI language (`chrome.i18n.getUILanguage()`)
- **`__detectBrowserLanguage()`** function in i18n-loader.js — all fallback defaults now use detected browser language instead of hardcoded `'hant'`

### Changed
- **Dark mode provider icons**: black SVG icons get `filter: brightness(0) invert(1)` in dark theme; colored brand SVGs (DeepSeek, Google, OpenRouter, Qwen, OpenClaw) excluded from inversion

---

## [2.14.0] - 2026-04-04
### Changed
- **Options sidebar redesign**: 7 nav items with SVG icons (General, Sidebar, AI Models, Web Search, Capture, TTS, Prompts); merged related sections per nav item via `data-sections`
- **TTS section** moved after Page Capture for better flow
- **Scroll spy** updated to use `data-sections` attribute for multi-section nav highlighting
- New i18n keys: `navGeneral`, `navSidebar`, `navAiModels`, `navWebSearch`, `navCapture`, `navTts`, `navPrompts`

---

## [2.13.3] - 2026-04-04
### Fixed
- **`shouldSearch` heuristics**: fixed `\b` word boundary failing with CJK characters; improved entity / alphanumeric query detection; added explicit triggers like `你查一下`

---

## [2.13.2] - 2026-04-04
### Added
- **Conservative `shouldSearch`**: default behavior is now no-search unless explicit signals detected (search keywords, question patterns, entity queries)

### Changed
- **Chat history panel**: width set to `min(240px, 72%)` with responsive tweaks
- **Custom dialog** dark mode styles improved; slightly narrower `max-width`

---

## [2.13.1] - 2026-04-04
### Fixed
- **Theme `auto` mode**: `applyTheme('auto')` now resolves to `dark`/`light` using `prefers-color-scheme` media query + live listener for system theme changes (both `options.js` and `sidepanel.js`)

---

## [2.13.0] - 2026-04-04
### Added (inspired by [page-assist](https://github.com/n4ze3m/page-assist))
- **Google HTML scraping**: New default search engine — scrapes Google search pages directly from Chrome (most stable, free, no API key needed)
- **DuckDuckGo HTML scraping**: Re-added as option via html.duckduckgo.com
- **Simple Internet Search toggle**: ON = use search snippets only (fast); OFF = visit result pages for full content (slower but more accurate RAG-like experience)
- **Total Search Results**: Configurable number of results (1-20, default 5)
- **Visit Website in Message**: Automatically detects URLs in user messages and fetches page content for the AI
- **Internet Search ON by Default**: Option to auto-enable web search for every new chat
- **SearXNG**: Open-source meta-search with 10 fallback instances (JSON + HTML fallback)

### Changed
- Default search provider changed from Tavily to Google (no API key needed)
- Redesigned web search settings page with all new options
- `performWebSearch` now combines URL-visited content with search results

---

## [2.10.7] - 2026-04-04
### Added
- **Search sources viewer**: 🔍 button appears in AI response action bar when web search was used; clicking it opens a modal showing all search result sources with titles, URLs, and snippets (similar to page reference viewer)
- **Search query optimization**: `extractSearchQuery()` strips instruction prefixes like "幫我查", "上網搜索", "請告訴我" etc. to get cleaner search keywords

### Changed
- **Search result injection**: Now uses a dedicated system message with strong Chinese instructions telling the AI to prioritize and cite search results (previously appended to user message, which models often ignored)

---

## [2.10.6] - 2026-04-04
### Fixed
- **Search query optimization**: Extracts keywords from user message instead of searching the entire sentence (strips "幫我查", "搜索", "上網找" etc.)
- **Search result injection**: Changed from appending to user message to a dedicated system message with strong Chinese instructions telling the AI to prioritize and cite search results
- OpenClaw path also uses improved injection format

---

## [2.10.5] - 2026-04-04
### Fixed
- **Provider switching**: Settings changes in options page now take effect immediately in side panel (added `storage.onChanged` listener)
- **DuckDuckGo**: Routes requests through background service worker (proxy_fetch) to bypass anti-bot detection; falls back to direct fetch if proxy fails
- **Default provider**: Changed from DuckDuckGo to Tavily (more reliable); DDG marked as "unstable" in UI
- **Toggle feedback**: Web search toggle now shows ON/OFF toast notification

---

## [2.10.4] - 2026-04-04
### Fixed
- **Tavily API**: Updated authentication from deprecated `api_key` in request body to `Authorization: Bearer` header (Tavily API 2026 format change)
- **DuckDuckGo**: Added 3 retry strategies (HTML POST, Lite POST, HTML GET), regex fallback parser, and User-Agent header for better compatibility
- **Test button**: Now shows detailed DDG debug info (raw HTML snippet, attempt log) when search returns no results, making diagnosis much easier

---

## [2.10.0] - 2026-04-04
### Added
- **Web Search**: new toggle button (globe icon) in the composer area enables live web search
  - When enabled, each message automatically searches the web and injects results as context before sending to the AI model
  - Default provider: **DuckDuckGo** (free, no API key required)
  - Optional provider: **Tavily** (higher quality results, requires free API key from tavily.com)
  - Works with both standard OpenAI-compatible API and OpenClaw WebSocket paths
  - Search state persists across sessions
  - New settings section in Options page for search provider configuration
  - Full i18n support (繁中 / 简中 / English)

---

## [2.9.33] - 2026-03-31
### Changed
- Settings page: all hardcoded Chinese strings replaced with English equivalents
  - `模型名稱` label → `Model Name`
  - `顯示思路` (CSS content) → `Show Thinking`
- Provider thinking hints (`THINKING_HINTS`) and Prefix hint now fully localised — hant / hans / en versions; hint re-renders after `currentLang` is resolved from storage (was always defaulting to `hant`)
- UI hover effects toned down across settings page — `.model-row`, `.icon-btn`, `.sp-card` hover now uses `var(--bg-card)` instead of hardcoded `#fff`; border no longer strengthens on hover
- System Prompt cards: active/selected state no longer shows coloured border or box-shadow — selection indicated by radio dot only; background stays `var(--bg-subtle)` in both light and dark mode (consistent interaction)
- Translator default prompt: Terminology Notes section updated to specify explanation language direction (Chinese explanation for English source, and vice-versa)

---

## [2.9.16] - 2026-03-30
### Changed
- Thinking toggle now aware of each model's actual capability (3 states):
  - **toggleable** — Qwen, Gemini 2.5, Claude, Kimi, MiniMax: button works normally
  - **always_on** — DeepSeek Reasoner, o1, o3: button locked + accent colour, tooltip explains
  - **unsupported** — GPT-4o, Ollama generic, LM Studio etc: button greyed out, tooltip explains
- Button auto-updates when user switches models
- Correct API params per provider when thinking is on:
  - Qwen / Kimi / MiniMax / Moonshot → `enable_thinking: true`
  - Gemini 2.5 → `thinkingConfig: { thinkingBudget: 8000 }`
  - Claude → `thinking: { type: "enabled", budget_tokens: 10000 }` + `temperature: 1`
  - DeepSeek Reasoner → `response_format: { type: "text" }` only (always on)
- Added i18n keys: `thinkingAlwaysOn`, `thinkingUnsupported`

---

## [2.9.15] - 2026-03-30
### Added
- Global thinking mode toggle button in the composer toolbar (lightbulb icon, next to page-context button)
- One click turns thinking on/off for **all** providers and models universally
- State persists via `chrome.storage.sync` (`globalThinking` key)
- When enabled: `enable_thinking: true` is sent in every API request, and `<think>` blocks are rendered regardless of model name or per-provider setting
- Per-provider thinking setting in options still works as before; global toggle is an OR override

---

## [2.9.14] - 2026-03-30
### Fixed
- Language switching broken after sync migration — `zhVariant` was removed from the local read, so first load after update always defaulted to `hant`
- Language/theme/font switches now write to **both** local (for instant reload) and sync (for cross-device)
- `sidepanel.js` `loadTheme()` and `awaitGetZhVariant()` now fall back to local if sync value is absent
- Added all UI settings back to local read as migration fallback (`zhVariant`, `theme`, `messageSize`, `messageWeight`, `showFloatBall`, capture settings)

---

## [2.9.13] - 2026-03-30
### Changed
- NVIDIA icon replaced with official LobeHub SVG (sourced from `@lobehub/icons-static-svg`) — uses `currentColor`, single-path design matching the real NVIDIA wordmark/eye logo

---

## [2.9.12] - 2026-03-30
### Changed
- All settings now sync across Google accounts via `chrome.storage.sync`
- Synced keys: provider configs (API keys, base URLs, models), `activeProvider`, `model`, `theme`, `zhVariant`, `messageSize`, `messageWeight`, `showFloatBall`, all page capture settings, `pageContextLimit`
- Chat sessions and computed aggregates (`customModels`, `providerConfigs`) remain in local storage
- `content-floatball.js` and `background.js` updated to read/write floatball state from sync
- `loadAll()` reads sync first with local fallback for seamless migration of existing users

---

## [2.9.11] - 2026-03-30
### Changed
- All provider models are now fully editable — users can delete or rename any default model
- Removed readonly lock and hidden delete button on default models in the model list
- Removed `ensureDefaultModels` enforcement from save, load, and persist flows (defaults only apply on first-time init)

---

## [2.9.10] - 2026-03-30
### Fixed
- Provider select button showed wrong icon (momo) for newly added providers — replaced hardcoded icon map with `PROVIDER_ICONS` from utils.js so all providers resolve correctly

---

## [2.9.9] - 2026-03-30
### Changed
- Provider list sorted alphabetically: DeepSeek → Google AI → LM Studio → MiniMax → Moonshot → NVIDIA → Ollama → OpenClaw → OpenAI → OpenRouter → Qwen

---

## [2.9.8] - 2026-03-30
### Added
- MiniMax provider (`api.minimaxi.chat/v1`), models: MiniMax-Text-01, abab6.5s-chat, abab6.5-chat
- Moonshot provider (`api.moonshot.cn/v1`), models: moonshot-v1-8k/32k/128k, kimi-k2
- OpenRouter provider (`openrouter.ai/api/v1`), preset models: GPT-4o, Claude 3.5 Sonnet, Gemini 2.5 Pro, DeepSeek
- Icons for all three providers sourced from LobeHub icons CDN

---

## [2.9.7] - 2026-03-30
### Changed
- NVIDIA icon replaced with proper eye/swirl logo SVG (traced from official PNG)

---

## [2.9.6] - 2026-03-30
### Changed
- Replaced all native browser `confirm()` / `alert()` dialogs with custom-styled modals matching the extension UI (teal accent, rounded corners, dark mode support)
- Affects: delete session, delete all/selected sessions, export, import, reset prompts, image upload warnings, streaming warnings, TTS, paste errors (17 call sites total)

---

## [2.9.5] - 2026-03-29
### Fixed
- Empty sessions (no messages sent) no longer appear in chat history
- Clicking "New Chat" while already on an empty session no longer creates a duplicate empty entry
- Empty sessions are cleaned up from storage on every save

---

## [2.9.4] - 2026-03-29
### Changed
- Welcome screen suggestions updated (方案 D):
  - 隨機給我一個沒用但有趣的冷知識 🎲
  - 幫我想一個今天說出去能唬人的話 🎭
  - 給我一句讓人覺得我很有深度的話 ✨

---

## [2.9.2] - 2026-03-29
### Added
- NVIDIA provider: OpenAI-compatible endpoint (`integrate.api.nvidia.com/v1`), model `moonshotai/kimi-k2.5`

---

## [2.9.1] - 2026-03-29
### Added
- Settings page: left sidebar navigation with anchor links for quick section jumping
- Scroll spy — current section is highlighted as you scroll
- Sidebar auto-hides on screens ≤ 820px (responsive)

---

## [2.9.0] - 2026-03-29
### Added
- **OpenClaw provider (beta)**: WebSocket-based AI gateway integration
  - Session selector: load and switch between OpenClaw gateway sessions
  - Auto-reconnect with backoff strategy
  - RPC protocol aligned with Copilot architecture
  - Tutorial modal with step-by-step setup instructions (Server setup + Device Auth)
- **Google AI provider**: Gemini 2.5 Flash / Pro / Pro MaxThinking models
- **Thinking mode toggle**: enable `enable_thinking` parameter for supported providers (Qwen, etc.)
- **Image upload**: attach multiple images to messages (base64 encoded, inline preview)
- **Page content capture**:
  - Expand/collapse preview card in the composer area
  - Cancel capture mid-flight
  - Tracks last captured URL to avoid redundant re-fetches
- **Adaptive streaming renderer**: throttles DOM updates by content length (80ms / 300ms / 800ms intervals) to prevent jank on long responses
- **Character counter** in the message input
- **Scroll-to-bottom button** with intelligent auto-follow (pauses when user scrolls up)
- **i18n system**: full Traditional Chinese / Simplified Chinese / English UI localization

### Changed
- Shared code extracted into dedicated modules: `js/utils.js`, `js/storage.js`, `js/openclaw.js`, `js/markdown.js`
- Provider defaults (models, base URLs, icons) now centralized in `js/utils.js`
- Default prompts moved to `prompt-defaults.js` (shared by sidepanel + background)
- Background service worker uses `declarativeNetRequest` to rewrite WebSocket `Origin` header for OpenClaw (static rules for 127.0.0.1 + dynamic rule for custom gateway URLs)
- Qwen models updated: added `qwen3-max`; default model is `qwen-flash`
- Ollama models updated: `qwen3-vl:235b` added

### Fixed
- Side panel now uses global configuration (not per-tab), ensuring consistent state across all tabs
- Provider icon path resolution uses `chrome.runtime.getURL` to avoid CSP issues

---

## [2.8.0] - 2026-03-28
### Added
- `floatball-frame.html` for the floating ball iframe

### Changed
- Background service worker refactored: auto-injects floatball content script on install/update to all tabs
- Browser language auto-detected on first install (English / Traditional Chinese / Simplified Chinese)

---

## [pre-2.8.0] - (no git history before this point)
### Notes
- Baseline feature set: streaming chat, multi-provider support (Qwen, OpenAI, DeepSeek), Markdown rendering, chat session history, page content capture (Readability + Turndown), system prompt management, dark/light theme
