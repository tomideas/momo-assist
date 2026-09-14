# Repo 架構參考（Momo Assist 範本）

> 給其他專案與 AI 工具參考：**本機工作區** vs **推上 GitHub 的內容** vs **發 Release 的 zip** 三者分開想。

**本專案**：`tomideas/momo-assist`  
**Pages**：https://tomideas.github.io/momo-assist/

---

## 1. 三層概念（最重要）

| 層 | 是什麼 | 本專案路徑 |
|----|--------|------------|
| **A. 本機工作區** | 你實際開發的資料夾，可含暫存、研究、IDE 設定 | 整個 `<workspace>/` |
| **B. GitHub repo** | `git push` 上去的內容（`.gitignore` 過濾後） | = A 減去不追蹤項目 |
| **C. Release 資產** | 給終端使用者下載的 zip | 只壓 **`sider/`** 內容 |

```
本機工作區 (A)
    │
    ├─ git push ──────────► GitHub repo (B)
    │                         ├─ 原始碼 sider/
    │                         ├─ 說明書 site/ ──Actions──► GitHub Pages
    │                         └─ README / CHANGELOG / workflows
    │
    └─ github-release.sh ──► Release zip (C) = sider/ 單獨打包
```

**原則**：repo 根目錄 = git root，**不要**再用 rsync 中間層複製一份才 push。

---

## 2. 本機工作區目錄

```
<workspace>/
├── sider/              ★ 產品原始碼（Chrome 擴充，上線唯一來源）
├── site/               ★ 使用者說明書 HTML（GitHub Pages 來源）
├── .github/workflows/  ★ CI（Pages 部署等）
├── README.md           ★ GitHub 首頁（英文）
├── README.zh-TW.md     ★ GitHub 首頁（繁中）
├── CHANGELOG.md        ★ 版本歷史（根目錄，與 manifest 版本對齊）
├── instructions.md     ★ 給 AI 協作的主說明（細節多，人類可略讀）
├── REPO-LAYOUT.md      ← 本檔（架構速查，可複製到其他專案）
├── CLAUDE.md           給 LLM 的行為準則
│
├── docs/               內部筆記（多數不 push，見 §3）
├── temp/               個人暫存（不 push）
├── icon/ animation/    設計素材源檔（不 push）
├── keys/ *.pem         簽章金鑰（不 push）
└── .cursor/ .vscode/   IDE 設定（不 push）
```

### `sider/` 內（產品）

| 路徑 | 用途 |
|------|------|
| `manifest.json` | **版本號**、MV3 權限 |
| `background.js` | Service Worker |
| `sidepanel.*` | 側邊欄聊天 UI |
| `options.*` | 設定頁 |
| `prompt-defaults.js` | 預設 prompts / suggestions |
| `js/` | utils、storage、openclaw、markdown、web-search |
| `assets/i18n/` | 多語系 JSON |
| `libs/` | 第三方腳本 |

### `site/` 內（說明書）

靜態 HTML + `docs.css` / `docs.js`，繁中根目錄、英文在 `site/en/`。  
**不是** `docs/`——`docs/` 在本專案指內部筆記。

---

## 3. 什麼會 push 到 GitHub

由 `.gitignore` 決定。本專案規則摘要：

| 會 push | 不 push |
|---------|---------|
| `sider/` 全部 | `temp/` |
| `site/` 全部 | `.cursor/`、`.vscode/` |
| `.github/workflows/` | `keys/`、`*.pem`、`*.zip`、`*.crx` |
| `README*`、`CHANGELOG.md`、`instructions.md` | `icon/`、`animation/`、`research/`、`backup/` |
| `docs/UI-SPEC.md`（白名單） | `docs/` 其餘檔案 |
| `.gitignore` | `.DS_Store`、`._*` |

推送前 AI / 人類應確認：無 `.env`、API key、真實 token。

---

## 4. GitHub 上長什麼樣

```
github.com/tomideas/momo-assist
├── sider/                 ← 擴充原始碼
├── site/                  ← 說明書原始檔
├── .github/workflows/
│   └── deploy-docs.yml    ← push site/ 時部署 Pages
├── CHANGELOG.md
├── README.md
├── README.zh-TW.md
├── instructions.md
└── docs/UI-SPEC.md
```

**Pages 站點**（給使用者看）：`https://tomideas.github.io/momo-assist/`  
**Repo 頁**（給開發者看）：`https://github.com/tomideas/momo-assist`

---

## 5. Release zip（給使用者安裝）

與 repo 不同：只打包 **可安裝的產品目錄**。

```bash
# 從 repo 根目錄
~/.cursor/skills/github-release-sync/scripts/github-release.sh .
```

| 項目 | 值 |
|------|-----|
| 壓縮目錄 | `sider/` |
| 資產名 | `momo-ai-<version>-chrome.zip` |
| 版本來源 | `sider/manifest.json` → `version` |
| Release notes | `CHANGELOG.md` 對應版本區塊 |

使用者：Chrome → 載入未封裝項目 → 選解壓後的 `sider/` 資料夾。

---

## 6. 標準 push 流程

```bash
cd "<workspace>"          # git 根目錄

git status                # 確認無 secrets
git add <檔案>
git commit -m "release: vX.Y.Z — 說明"
git push origin main

# 可選：驗證 Pages
~/.cursor/skills/github-release-sync/scripts/verify-pages.sh \
  --repo tomideas/momo-assist \
  --workflow "Deploy docs" \
  --url "https://tomideas.github.io/momo-assist/"

# 可選：建 Release
GH_REPO=tomideas/momo-assist \
  ~/.cursor/skills/github-release-sync/scripts/github-release.sh .
```

全域 skill：`~/.cursor/skills/github-release-sync/`（其他專案可複用流程，在 `profiles.md` 加一節即可）。

---

## 7. 給其他專案複製的模板

把下面表格改成你的專案即可：

| 項目 | Momo Assist 範例 | 你的專案 |
|------|------------------|----------|
| GitHub repo | `tomideas/momo-assist` | |
| Git 根目錄 | = workspace 根 | |
| 產品原始碼目錄 | `sider/` | 例如 `src/`、`app/` |
| 版本檔 | `sider/manifest.json` | 例如 `package.json` |
| Release zip 根目錄 | `sider/` | 產品可安裝/可執行目錄 |
| 使用者文件 | `site/` → Pages | 例如 `docs/`、`website/` |
| Pages workflow | `Deploy docs` | |
| Pages URL | `https://tomideas.github.io/momo-assist/` | |
| 內部筆記（不 push） | `docs/`（除白名單） | |
| 本機暫存（不 push） | `temp/` | |

**建議每個專案都有**：

1. 根目錄 `README` + `CHANGELOG`
2. `instructions.md` 或 `AGENTS.md` 給 AI
3. 本檔 `REPO-LAYOUT.md` 或等效一頁架構說明
4. `.gitignore` 明確區分「產品 / 文件 / 內部 / 暫存」
5. 一個 Cursor 全域 skill profile（可選）

---

## 8. 常見錯誤

| 錯誤 | 正確 |
|------|------|
| 把整個 workspace 打成 Chrome zip | 只 zip `sider/` |
| 用 `docs/` 發 Pages | 本專案用 `site/` |
| rsync 到第二份 repo 再 push | 直接在 git 根目錄 push |
| commit `.env` / API key | 只 commit 佔位符範例 |
| 改程式卻不更新 `manifest.json` + `CHANGELOG.md` | 發版時兩者版本一致 |

---

*最後更新：對應 `sider/manifest.json` 版本 · 詳細開發說明見 `instructions.md`*
