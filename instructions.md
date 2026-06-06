# Hii~ Momo: AI Assist — AI 協作說明書

> 給 **Cursor / Claude / GPT / 其他 AI 模型** 閱讀，用於在本 repo 安全、正確地修改程式碼。  
> 產品名稱：**Hii~ Momo: AI Assist** · 版本見 `sider/manifest.json` · GitHub：**tomideas/momo-assist**

---

## 1. 專案是什麼

Chrome **Manifest V3** 擴充功能：側邊欄 AI 聊天、多供應商 API、網頁擷取、聯網搜尋、圖片上傳、浮球快捷、OpenClaw WebSocket、Hermes Agent（HTTP）等。

| 面向 | 說明 |
|------|------|
| 執行環境 | Chrome 擴充（非 Node 後端、非 React/Vue SPA） |
| 語言 | 純 **Vanilla JS** + HTML + CSS，無 bundler |
| 打包單位 | 只打包 **`sider/` 目錄內容**（非整個 workspace） |
| 使用者文件 | `docs/` HTML → GitHub Pages `https://tomideas.github.io/momo-assist/` |
| 對外 repo | `https://github.com/tomideas/momo-assist` |

---

## 2. 目錄結構（修改前先確認路徑）

```
<workspace>/
├── sider/                 ★ 擴充功能原始碼（上線唯一來源）
│   ├── manifest.json      版本號、權限、MV3 設定
│   ├── background.js      Service Worker（sidePanel、proxy fetch、OpenClaw Origin）
│   ├── sidepanel.*        側邊欄聊天 UI（最大檔案，~8000 行）
│   ├── options.*          設定頁 UI
│   ├── content-floatball.js / floatball-frame.*   浮球
│   ├── prompt-defaults.js 預設系統提示詞（單一真相來源）
│   ├── js/
│   │   ├── utils.js       共用工具、PROVIDER_DEFAULTS、OpenClaw URL 常數
│   │   ├── storage.js     chrome.storage + IndexedDB 附件
│   │   ├── openclaw.js    OpenClaw WebSocket 客戶端
│   │   ├── markdown.js    Markdown 渲染
│   │   └── web-search.js  聯網搜尋
│   ├── assets/i18n/       多語系 JSON + i18n-loader.js
│   └── libs/              第三方（Readability、Turndown 等）
├── docs/                  使用者說明書 HTML（對外，唯一來源）
├── dev-notes/             內部筆記（UI-SPEC、workspace-map）
├── temp/                  ⚠️ 個人暫存（不含重要檔案，已排除於 git）
│   ├── research/          競品研究，不要複製進正式功能
│   └── animation/backup/  設計素材備份
├── instructions.md        本檔（給 AI 協作）
├── README.md / README.zh-TW.md
└── .github/workflows/deploy-docs.yml
```

**不要改動或依賴：** `temp/research/`（競品研究）、`keys/`（敏感，已排除於 git）。

---

## 3. 架構與資料流

```
使用者頁面
  └─ content-floatball.js ──message──► background.js
                                              │
  sidepanel.html/js ◄── sidePanel API ────────┤
  options.html/js   ◄── chrome.storage ───────┘
        │
        ├─ OpenAI-compatible HTTP → 各 AI provider
        ├─ OpenClaw WebSocket → js/openclaw.js
        ├─ 頁面擷取 → content script + Readability/Turndown
        └─ 聯網搜尋 → js/web-search.js → background proxy_fetch
```

### background.js 職責

- 註冊 `sidePanel`、快捷鍵 `toggle-sidebar`
- `chrome.runtime.onMessage`：`proxy_fetch`、`openclaw_update_origin`、`open_sidepanel`、`toggleSidePanel`、`getSidePanelState`
- OpenClaw：`declarativeNetRequest` 改 WebSocket `Origin` header（靜態 localhost + 動態使用者 Gateway URL）

### sidepanel.js 職責

- 聊天 session、串流渲染、模型選擇、頁面引用、圖片上傳
- 呼叫 API（含 OpenClaw 專用 `streamOpenClawChat`）
- **檔案很大**：改功能前先 `grep` 定位，避免整檔重寫

### options.js 職責

- Provider 設定、連線測試、擷取模式、TTS、OpenClaw Setup Guide
- 自訂 `<select>`（`.csel-*`）取代原生 select（深色模式）

---

## 4. 單一真相來源（改一處、勿複製）

| 資料 | 檔案 |
|------|------|
| 預設系統提示詞 | `sider/prompt-defaults.js`（改內容時遞增 `PROMPTS_VERSION`） |
| AI 供應商預設 URL/模型 | `sider/js/utils.js` → `PROVIDER_DEFAULTS` |
| 擷取模式預設 | `sider/js/utils.js` → `CAPTURE_PRESETS` |
| OpenClaw 協定版本 | `sider/js/utils.js` → `OPENCLAW_PROTOCOL_MIN/MAX`（目前 3–4） |
| OpenClaw Gateway URL 驗證/正規化 | `sider/js/utils.js` → `isValidOpenClawGatewayUrl`、`normalizeOpenClawGatewayUrl` |
| 版本號 | `sider/manifest.json` → `version` |
| 發版紀錄 | `sider/CHANGELOG.md`（頂部最新版本區塊） |
| UI 設計 token | `dev-notes/UI-SPEC.md` |

---

## 5. AI 供應商一覽

定義於 `PROVIDER_DEFAULTS`（`js/utils.js`）：

`openai`, `google`, `deepseek`, `qwen`, `ollama`, `lmstudio`, `openrouter`, `nvidia`, `groq`, `minimax`, `moonshot`, `hermes`（HTTP Agent, beta）, `openclaw`（WebSocket, `isOpenClaw: true`）

**新增供應商時通常要改：**

1. `js/utils.js` — `PROVIDER_DEFAULTS`、`PROVIDER_ICONS`
2. `options.html` / `options.js` — UI 與連線測試
3. `sidepanel.js` — 串流/API 路徑（若特殊）
4. `manifest.json` — `host_permissions`（若新網域）
5. `assets/i18n/{hant,hans,en}.json` — 文案 key
6. `docs/` — 使用者說明（若對外功能）

---

## 6. OpenClaw 注意事項

- 連線實作：`sider/js/openclaw.js`（class `OpenClawGateway`）
- 協定：`minProtocol: 3`, `maxProtocol: 4`（與 Gateway v4 相容）
- URL：`http(s)://` 與 `ws(s)://` 皆可；連線前會 `normalizeOpenClawGatewayUrl`
- Origin：擴充功能 WebSocket 預設 `chrome-extension://` origin → background 用 DNR 改成 `http://<host>:<port>`
- Setup Guide 在 `options.html`，文案用 **`data-i18n-html`**（可含 `<code>`、`<strong>`），勿用純 `data-i18n` 塞 HTML
- **勿**寫入 Copilot/ClawClip 的 Device Auth、Ed25519、Save & Connect 等不適用流程；Momo 是 **Gateway Token + Connect**

---

## 7. 儲存層

| 層級 | 用途 | 檔案 |
|------|------|------|
| `chrome.storage.local` | 聊天 sessions、設定 | `js/storage.js` → `StorageHelper` |
| `chrome.storage.sync` | 提示詞等可同步資料 | 同上 |
| IndexedDB `momo-bud-attachments` | 圖片附件（勿隨意改名，會遺失使用者資料） | `js/storage.js` |

Session 結構含 `messages`；頁面引用綁在 **user message** 的 `_pageContext`，僅最新一則 user 訊息會注入 API（見 sidepanel 內 `getApiMessageContent` 相關邏輯）。

---

## 8. 多語系（i18n）

- 語言檔：`sider/assets/i18n/hant.json`、`hans.json`、`en.json`
- 載入器：`sider/assets/i18n/i18n-loader.js`
- HTML 屬性：
  - `data-i18n` → 純文字（`textContent`）
  - `data-i18n-html` → 允許有限 HTML
  - `data-i18n-placeholder` / `data-i18n-title` / `data-i18n-aria-label` 等
- 新增 key：**三個 JSON 都要加**（至少 hant + en）
- 詳細步驟：`sider/assets/i18n/README.md`

---

## 9. UI / CSS 慣例

- 三個主要樣式檔：`options.css`、`sidepanel.css`、`iframe-sidebar.css`
- 設計 token 對照：`dev-notes/UI-SPEC.md`
- 新程式碼優先用 canonical token：`--bg-page`、`--bg-card`、`--accent`、`--focus` 等
- 設定頁用自訂 dropdown（`initCustomSelect`），不要假設原生 `<select>` 樣式一致
- 產品顯示名：**Hii~ Momo: AI Assist**（非舊名 Momo AI Bud）

---

## 10. 修改時必守規則

1. **最小 diff**：只改與任務直接相關的檔案；不要順手重構 `sidepanel.js` 全檔。
2. **無 bundler**：腳本以 `<script src>` 順序載入，注意依賴順序（如 `utils.js` 在 `openclaw.js` 前）。
3. **每次對外變更**：更新 `sider/manifest.json` 版本 + `sider/CHANGELOG.md` 頂部區塊。
4. **macOS**：勿 commit `._*`、`.DS_Store`。
5. **勿 commit**：`keys/`、`dist/*.crx`、`*.zip`、API 金鑰、真實 Gateway token/IP。
6. **IndexedDB 名稱** `momo-bud-attachments` 除非有遷移計畫，否則不要改。
7. **使用者文件** 變更時同步 `docs/`（HTML），連結指向 `https://tomideas.github.io/momo-assist/`。
8. **不要**在沒有要求時新增測試框架、TypeScript、或大型抽象層。

---

## 11. 常見任務 → 該改哪裡

| 任務 | 主要檔案 |
|------|----------|
| 修聊天/串流 bug | `sidepanel.js` |
| 新快捷鍵 / sidePanel 行為 | `background.js`、`manifest.json` commands |
| 設定頁新選項 | `options.html`、`options.js`、`options.css` |
| 新 AI 供應商 | `js/utils.js`、`options.*`、`manifest host_permissions` |
| OpenClaw 連線 | `js/openclaw.js`、`js/utils.js`、`background.js`、`options.js` |
| 頁面擷取邏輯 | `sidepanel.js`（capture）、`js/utils.js`（presets） |
| 聯網搜尋 | `js/web-search.js` |
| 翻譯文案 | `assets/i18n/*.json` |
| 預設人格提示詞 | `prompt-defaults.js` |
| 浮球 | `content-floatball.js`、`floatball-frame.*` |

---

## 12. 本機開發與驗證

```bash
# 載入擴充
# Chrome → chrome://extensions → 開發人員模式 → 「載入未封裝項目」→ 選 sider/

# 預覽 docs
python3 -m http.server 8765 --directory docs
# 開 http://127.0.0.1:8765/

# 改完後在 sidepanel / options 手動測：連線、送訊息、換語言、深色模式
```

無自動化測試套件；以手動驗證為主。

---

## 13. 發版與 GitHub（給 AI 執行 push 時）

**workspace 根目錄本身就是 git repo**，直接 commit + push，無需 rsync 中間層。

```bash
cd "<workspace>"   # 即 /Volumes/ssd/temp/@coding/chrome extension

# Step 1: commit 變更
git add -A
git commit -m "release: vX.Y.Z — 簡短說明"
git push origin main

# Step 2: 建 Release zip（從 workspace 根目錄執行）
~/.cursor/skills/github-release-sync/scripts/github-release.sh .
```

- Zip 規則：壓縮 **`sider/` 內容**，資產名 `momo-ai-<version>-chrome.zip`
- Pages 確認：`curl -sI "https://tomideas.github.io/momo-assist/?v=$(date +%s)"`
- 全域 skill：`~/.cursor/skills/github-release-sync/SKILL.md`
- `.gitignore` 已排除：`temp/`、`keys/`、`dist/`、`icon/`、`dev-notes/`、`*.pem`、`*.psd`、`*.zip`

---

## 14. 相關文件索引

| 檔案 | 用途 |
|------|------|
| `README.md` / `README.zh-TW.md` | 對外專案介紹（GitHub 首頁） |
| `docs/README.md` | 說明書發佈方式 |
| `dev-notes/workspace-map.zh-TW.md` | 工作區導覽（內部） |
| `dev-notes/UI-SPEC.md` | UI 設計系統 token |
| `sider/assets/i18n/README.md` | 新增語言步驟 |
| `CLAUDE.md` | LLM 行為準則（簡潔、手術式修改） |
| `sider/CHANGELOG.md` | 版本歷史 |

---

## 15. AI 修改前快速檢查清單

- [ ] 我改的是 `sider/` 還是僅 `docs/`？
- [ ] 是否需要三語 i18n？
- [ ] 是否動到 `manifest.json` 權限？
- [ ] 版本號與 CHANGELOG 是否已更新？
- [ ] OpenClaw / Provider 預設是否只改 `utils.js` 一處？
- [ ] 是否避免提交金鑰與 `._*` 檔案？

---

## 16. 建議 AI 啟動流程（每次接手先做）

1. 讀本檔 `instructions.md`。
2. 讀 `sider/manifest.json` 確認目前版本與權限。
3. 讀 `sider/CHANGELOG.md` 頂部 1–2 個版本，了解最近變更。
4. 若任務涉及 UI，讀 `dev-notes/UI-SPEC.md` 的相關 token 區塊。
5. 若任務涉及 i18n，讀 `sider/assets/i18n/README.md`，再同步三個 JSON。
6. 若任務涉及發版，讀全域 skill：`~/.cursor/skills/github-release-sync/SKILL.md`。
7. 先用搜尋定位最小修改區域，不要直接重寫大檔。

---

## 17. 重要檔案載入順序與隱性依賴

此專案沒有 bundler，HTML 中的 `<script>` 順序就是執行順序。

| 場景 | 依賴重點 |
|------|----------|
| `sidepanel.html` | `utils.js`、`storage.js`、`openclaw.js`、`markdown.js` 等需在 `sidepanel.js` 前 |
| `options.html` | `utils.js`、`prompt-defaults.js`、`i18n-loader.js` 需在 `options.js` 前 |
| OpenClaw | `generateUUID`、`OPENCLAW_PROTOCOL_MIN/MAX` 來自 `utils.js` |
| i18n | `window.__t`、`window.__applyTranslations` 由 `i18n-loader.js` 掛到 `window` |
| 預設 prompt | `DEFAULT_PROMPTS`、`PROMPTS_VERSION` 由 `prompt-defaults.js` 提供 |

---

## 18. 核心資料結構速查

### Provider 設定

| 欄位 | 說明 |
|------|------|
| `id` | provider id，例如 `openai`、`qwen`、`openclaw` |
| `name` | UI 顯示名 |
| `baseUrl` | API base URL 或 OpenClaw Gateway URL |
| `models` | 預設模型清單 |
| `isOpenClaw` | OpenClaw 專用分支 |
| `isAgentProvider` | Hermes 等 agent provider |
| `supportsThinking` | Qwen 等推理參數 UI |

### Chat session / Message

| 欄位 | 說明 |
|------|------|
| `role` | `system` / `user` / `assistant` |
| `ts` | timestamp，用於 DOM 與 streaming 更新 |
| `_pageContext` | user message 的引用頁面資料（只在最新 user 訊息注入 API） |
| `_attachments` | 圖片附件引用，實體存在 IndexedDB `momo-bud-attachments` |

---

## 19. 常見修改流程

### A. 修聊天 / 串流 / Markdown 問題
1. `sidepanel.js` 搜尋錯誤函式或 UI id
2. 判斷是「組 payload」、「送 API」、「stream parse」、「render」哪一層
3. 最小修改，手動測：新對話、中斷 streaming、Markdown block、長回覆捲動

### B. 修設定頁 / Provider
1. 先確認 `PROVIDER_DEFAULTS`（`utils.js`）
2. 改 `options.html` + `options.js` + i18n
3. 手動測：開設定頁、切語言、深色 dropdown、Connect

### C. 新增 AI provider
`utils.js` → `assets/icons/` → `manifest.json` → `options.*` → `sidepanel.js`（若特殊）→ i18n → docs → 版本

### D. 修改 OpenClaw
URL/協定 → `utils.js`；WebSocket → `openclaw.js`；Origin/DNR → `background.js`；UI → `options.*`

### E. 修改 docs
改 `docs/` HTML → 同步 README 連結 → push → 確認 Pages workflow

---

## 20. 驗證矩陣

| 修改類型 | 最低驗證 |
|----------|----------|
| `manifest.json` | Chrome 重新載入 extension 無錯誤 |
| `background.js` | toolbar icon、快捷鍵、浮球開關 side panel |
| `sidepanel.js` | 新對話、送訊息、streaming、中斷、歷史 |
| Provider | Test connection、模型選擇、實際送出 |
| OpenClaw | URL normalize、Connect、Load sessions、送出 |
| i18n | hant/hans/en 切換，HTML 不顯示原始標籤 |
| CSS/UI | light/dark/auto、窄寬度、scrollbar、dropdown |
| docs | 本機預覽，連結可點 |

---

## 21. 版本規則與 CHANGELOG 格式

```md
## [2.21.70] - YYYY-MM-DD
### Changed — 簡短分類
- 具體變更。

---
```

`sider/manifest.json` 版本號與 CHANGELOG 頂部版本必須一致。

---

## 22. 風險與不要做的事

- 不要把 `temp/research/` 競品程式碼複製進正式功能
- 不要 commit `keys/`、zip、CRX、`.pem`、API key、真實 Gateway token/IP
- 不要大規模格式化 `sidepanel.js`（diff 無法 review）
- 不要改 IndexedDB 名稱，除非同時寫資料遷移
- 不要在沒有設計需求時新增 framework、build step、TypeScript

---

## 23. 給其他 AI 的回覆風格

- 預設用繁體中文回覆使用者
- 先說假設與修改範圍，再動手
- 多檔修改時先列 3–5 步計畫
- 找不到確定依據時明說，不要編造
- 完成後簡短摘要：改了什麼、版本、驗證、未做事項

---

*最後更新：隨 `sider/manifest.json` 版本維護 · 正式說明書：`https://tomideas.github.io/momo-assist/`*
