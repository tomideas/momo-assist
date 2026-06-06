# 多語言翻譯系統

## 📁 檔案結構

```
assets/i18n/
├── i18n-loader.js    # 動態載入系統
├── hant.json         # 繁體中文
├── hans.json         # 簡體中文
├── en.json           # 英文
└── README.md         # 本檔案
```

## 🌍 如何新增語言

### 步驟 1: 建立新的語言檔案

複製現有語言檔案（建議從 `en.json` 複製），然後重新命名：

```bash
cp assets/i18n/en.json assets/i18n/ja.json  # 例如：日文
```

### 步驟 2: 翻譯內容

編輯新建立的 JSON 檔案，翻譯所有字串值。**請保持所有 key 不變**，只修改值。

例如 `ja.json`：
```json
{
  "pageTitle": "設定",
  "pageSubtitle": "あなたの AI アシスタントのパラメータと外観を設定",
  ...
}
```

### 步驟 3: 更新語言列表

編輯 `assets/i18n/i18n-loader.js`，在 `SUPPORTED_LANGUAGES` 陣列中加入新語言：

```javascript
const SUPPORTED_LANGUAGES = ['hant', 'hans', 'en', 'ja']; // 加入 'ja'
```

### 步驟 4: 更新語言選擇 UI

編輯 `options.html`，在語言選擇區段加入新選項：

```html
<div id="languageSegment" class="seg-group">
  <button class="seg-btn" data-lang="hant">繁體中文</button>
  <button class="seg-btn" data-lang="hans">简体中文</button>
  <button class="seg-btn" data-lang="en">English</button>
  <button class="seg-btn" data-lang="ja">日本語</button> <!-- 新增 -->
</div>
```

### 步驟 5: 更新自動檢測邏輯（選填）

如果希望根據瀏覽器語言自動選擇新語言，編輯 `background.js` 的 `detectBrowserLanguage()` 函數：

```javascript
// 檢查是否為日文
if (browserLang.startsWith('ja')) {
  return 'ja';
}
```

## 📝 翻譯 Key 命名規則

- 使用 camelCase：`pageTitle`, `testConnection`
- 語義明確：`apiBaseUrl` 比 `url` 更好
- 分組註釋：可在 JSON 中保留註釋（需要特別處理），或使用命名前綴：
  - `page*` - 頁面相關
  - `prompt*` - 提示詞相關
  - `model*` - 模型相關

## ✅ 檢查清單

新增語言時請確認：

- [ ] JSON 檔案已建立並放置在 `assets/i18n/` 目錄
- [ ] 所有 key 都已翻譯（或至少提供英文回退）
- [ ] `i18n-loader.js` 中的 `SUPPORTED_LANGUAGES` 已更新
- [ ] `options.html` 的語言選擇 UI 已更新
- [ ] `manifest.json` 的 `web_accessible_resources` 包含 `assets/i18n/*`
- [ ] 測試新語言是否正常載入和顯示

## 🔧 開發提示

### 測試翻譯

在瀏覽器 Console 中：

```javascript
// 載入特定語言
await window.__applyTranslations('ja');

// 取得翻譯（異步）
const text = await window.__tAsync('pageTitle', 'ja');

// 取得支援的語言列表
window.__getSupportedLanguages();
```

### 驗證 JSON 格式

確保 JSON 檔案格式正確，可以使用：

```bash
# 檢查 JSON 格式
python -m json.tool assets/i18n/ja.json
```

## 📚 範例：新增日文支援

1. **建立檔案**：`assets/i18n/ja.json`
2. **翻譯內容**：將所有英文翻譯為日文
3. **更新載入器**：在 `i18n-loader.js` 加入 `'ja'`
4. **更新 UI**：在 `options.html` 加入 `<button data-lang="ja">日本語</button>`
5. **測試**：切換語言確認顯示正確

## 🎯 未來擴展

可考慮：
- 使用 TypeScript 類型定義確保翻譯完整性
- 建立翻譯檢查工具驗證缺失的 key
- 支援翻譯檔案的外部載入（從 CDN 或遠端伺服器）
- 實作翻譯版本管理（當翻譯更新時通知使用者）

