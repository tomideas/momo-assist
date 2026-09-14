# Product Strategy PRD — Momo: AI Assist

> 產品策略全局文件 · Product Strategy Document  
> 版本 v2.1 · 2026-06-26（路線圖對齊 v2.22.13–14 已完成項目）  
> 基於 Product Strategy Canvas · SWOT · Competitive Analysis · Value Proposition · North Star · Growth Loops

---

## 目錄 / Table of Contents

1. [Vision & Mission · 願景與使命](#1-vision--mission)
2. [SWOT Analysis · 戰略態勢分析](#2-swot-analysis)
3. [Competitive Landscape · 競爭格局](#3-competitive-landscape)
4. [Market Segments · 市場區隔](#4-market-segments)
5. [Value Propositions · 價值主張](#5-value-propositions)
6. [Trade-offs · 策略取捨](#6-trade-offs)
7. [North Star & Metrics · 北極星指標](#7-north-star--metrics)
8. [Growth Loops · 成長飛輪](#8-growth-loops)
9. [Capabilities & Defensibility · 能力與護城河](#9-capabilities--defensibility)
10. [Release Roadmap · 發布路線圖](#10-release-roadmap)

---

## 1. Vision & Mission

### 願景 / Vision

**讓每個人瀏覽網頁時，都能被一個有溫度、懂你、隨手可及的 AI 夥伴陪伴。**

Momo 不只是一款工具。我們相信 AI 應該像朋友：溫暖、有個性、24/7 在你身邊，而不是冷冰冰的指令列。  

### 使命 / Mission

在瀏覽器裡打造最有人情味的 AI 助手，讓使用者：
- 自由選擇全球 20+ AI 模型，不受單一服務商鎖定
- 一鍵引用網頁內容，讓 AI 真正理解當下情境
- 保有完全的隱私控制權——對話存於本地，支援本地模型，數據不離開機器

### 品牌人格 / Brand Personality

| 特質 | 描述 |
|---|---|
| 溫暖 / Warm | 像朋友，不像客服機器人 |
| 簡潔 / Concise | 不廢話，一句到位 |
| 可靠 / Reliable | 多模型備援，一個掛了還有另一個 |
| 自由 / Free | 完全免費，不鎖定，不強制註冊 |

---

## 2. SWOT Analysis

### Strengths · 優勢（內部、正面）

| # | 優勢 | 說明 |
|---|---|---|
| S1 | **20+ AI 服務商支援** | 業界最廣泛的多模型整合，含 OpenAI、Gemini、Claude、DeepSeek、Ollama 等 |
| S2 | **溫暖品牌人格** | 競品多為工具型定位；Momo 有獨特的「陪伴感」品牌識別 |
| S3 | **完全免費** | 無付費牆、無用量限制（需自備 API Key），競品多為 freemium |
| S4 | **原生中文體驗** | 繁中/簡中/英文三語原生，非事後翻譯；內建離線繁簡轉換器 |
| S5 | **隱私至上** | 對話存本地、支援 Ollama/LM Studio/OpenClaw 本地模型 |
| S6 | **5 種網頁擷取模式** | 智慧/全文/Markdown/可見文字/CSS 選擇器，超越競品 |
| S7 | **純原生技術棧** | 無框架依賴，體積極小，效能好 |

### Weaknesses · 劣勢（內部、負面）

| # | 劣勢 | 說明 |
|---|---|---|
| W1 | **無專職團隊** | 目前為個人專案，開發/設計/測試資源有限 |
| W2 | **無內建模型額度** | 使用者需自備 API Key（除少數預設服務），入門門檻較競品高 |
| W3 | **品牌知名度低** | 相較 Monica（百萬用戶）、Sider 無品牌認知度 |
| W4 | **僅限 Chrome** | 無 Firefox/Safari 版本，限制作業系統覆蓋 |
| W5 | **無雲端同步** | 對話無法跨裝置同步（隱私取捨） |
| W6 | **無內建 Prompt 模板庫** | 競品 Monica 有 80+ 模板；Momo 僅 5 個 Prompt Suggestions |
| W7 | **無數據分析** | 無使用量統計儀表板，使用者無法追蹤 Token 用量 |

### Opportunities · 機會（外部、正面）

| # | 機會 | 說明 |
|---|---|---|
| O1 | **AI 模型爆炸增長** | 每季都有新模型發布，多模型切換需求將持續增長 |
| O2 | **Chrome 內建 Gemini 側邊欄** | Google 正在教育市場「瀏覽器內建 AI 助手」，降低使用門檻 |
| O3 | **隱私意識抬頭** | GDPR、AI 數據外洩新聞頻傳，本地模型需求上升 |
| O4 | **華語市場未被深耕** | Monica/Sider 以英文為主，繁中介入幾乎空白 |
| O5 | **OpenAI Atlas 瀏覽器** | AI 瀏覽器大戰開打，側邊欄助手將成標配 |
| O6 | **競品漲價** | Monica 等競品逐步限縮免費額度、推出高價訂閱，免費替代品需求增加 |
| O7 | **開源社群生態** | Hugging Face、Ollama 社群快速成長，可整合更多開源模型 |

### Threats · 威脅（外部、負面）

| # | 威脅 | 說明 |
|---|---|---|
| T1 | **Chrome 內建 Gemini 側邊欄** | Google 原生整合，零安裝 friction，可能吃掉輕度用戶 |
| T2 | **Microsoft Copilot for Chrome** | 微軟預計 2026 年推出 Chrome 版 Copilot 擴充，企業生態優勢強 |
| T3 | **競品網路效應** | Monica 已有百萬用戶 + 團隊協作功能，網路效應難以追趕 |
| T4 | **AI 模型 API 價格戰** | 模型 API 價格持續下跌，競品可提供更多免費額度 |
| T5 | **Chrome Web Store 政策風險** | Manifest V3 限制持續收緊，側邊欄 API 可能變更 |
| T6 | **OpenAI Atlas 瀏覽器** | 原生 AI 瀏覽器可能讓擴充功能變得多餘 |

### 交叉策略 / Cross-Reference

| 策略動作 | 運用 | 應對 |
|---|---|---|
| **Build** | S1(多模型) × O1(模型爆炸) → 持續擴展 AI 服務商 | — |
| **Build** | S4(中文) × O4(華語市場) → 繁中行銷 + 中文社群經營 | — |
| **Build** | S5(隱私) × O3(隱私意識) → 以「最隱私的 AI 助手」為定位 | — |
| **Defend** | S2(品牌) × T3(競品網路效應) → 以品牌溫度建立情感忠誠 | W3(知名度低) → 靠差異化而非規模競爭 |
| **Defend** | — | T1(Chrome Gemini) → 強調多模型 vs 單一模型的劣勢 |
| **Pivot** | — | W6(無模板) → O7(開源社群) → 開放社群貢獻 Prompt |

---

## 3. Competitive Landscape

### 3.1 市場概覽 / Market Overview

**市場**：瀏覽器 AI 助手擴充功能（Chrome AI Sidebar Extension）  
**市場階段**：成長期——Google、Microsoft 正在教育市場，AI 瀏覽器大戰升溫  
**關鍵成功因素**：模型多樣性、使用體驗、價格策略、隱私信任、品牌認同

### 3.2 競品矩陣 / Competitive Matrix

| 維度 | **Momo** | **Monica** | **Sider** | **Merlin AI** | **ChatGPT Sidebar** | **Chrome Gemini (內建)** |
|---|---|---|---|---|---|---|
| **定位** | 溫暖 AI 夥伴 | AI 全能助理 | 多模型群聊 | AI 生產力工具 | GPT 側邊欄 | 瀏覽器原生 AI |
| **商業模式** | 完全免費 | Freemium (付費 $9.9/mo) | Freemium | Freemium | 需 ChatGPT 帳號 | 需 Google 帳號 |
| **AI 模型數** | ★★★★★ 20+ | ★★★★ 5+ | ★★★★★ 10+ | ★★★ 3+ | ★★ 僅 OpenAI | ★★ 僅 Gemini |
| **多模型切換** | ✅ 任意切換 | ✅ | ✅ 群聊比較 | ❌ | ❌ | ❌ |
| **本地模型** | ✅ Ollama/LM Studio/OpenClaw | ❌ | ❌ | ❌ | ❌ | ❌ |
| **網頁擷取** | ★★★★★ 5 模式 | ★★★ 劃詞 | ★★★ | ★★★ | ★★ | — |
| **Prompt 模板** | 5 個 | 80+ | 中等 | 中等 | 無 | 無 |
| **中文體驗** | ★★★★★ 原生繁簡 | ★★★ 簡中 | ★★★ 簡中 | ★★ | ★ | ★★★ |
| **隱私** | ★★★★★ 本地存儲 | ★★ 雲端處理 | ★★ 雲端處理 | ★★ | ★ | ★ |
| **品牌溫度** | ★★★★★ 有陪伴感 | ★★★ 工具感 | ★★★ 工具感 | ★★ | ★ | ★ |
| **團隊協作** | ❌ | ✅ | 部分 | ❌ | ❌ | ❌ |
| **跨平台** | 僅 Chrome | Chrome/Edge | Chrome/Edge | Chrome | Chrome | Chrome 內建 |
| **用戶數** | 利基 | 百萬級 | 百萬級 | 數十萬 | 數百萬(間接) | 十億級(Chrome) |

### 3.3 競品深度分析 / Deep Dive

#### Monica — 市場領導者

- **優勢**：百萬用戶、80+ Prompt 模板、劃詞互動、搜尋引擎整合、AI 繪圖、語音輸入、團隊協作
- **劣勢**：Freemium 限制用量（免費用戶 30 次/天）、隱私疑慮（雲端處理）、品牌缺乏溫度
- **威脅等級**：★★★★★ 直接競品，但付費牆是 Momo 的機會

#### Sider — 多模型群聊先驅

- **優勢**：群聊模式（多模型同時回答並比較）、GPT-5/Claude/Gemini/DeepSeek 全支援、VS Code 整合
- **劣勢**：同樣 Freemium、介面較功能密集、中文體驗不如 Momo 原生
- **威脅等級**：★★★★ 功能重疊高，但商業模式與定位不同

#### Merlin AI — AI 生產力工具

- **優勢**：Google 搜尋增強、YouTube 摘要
- **劣勢**：模型選擇少、免費額度嚴格、隱私政策較弱
- **威脅等級**：★★★ 使用場景與 Momo 有差異

#### ChatGPT Sidebar — 開源簡易方案

- **優勢**：GitHub 開源、輕量
- **劣勢**：僅支援 OpenAI、功能極簡、無維護保證
- **威脅等級**：★★ 功能差距大

#### Chrome Gemini 內建 — 平台級威脅

- **優勢**：零安裝、原生整合、Google 生態、免費
- **劣勢**：僅 Gemini 單一模型、無法自訂、無隱私選項
- **威脅等級**：★★★★★ 長期最大威脅，但單一模型是致命傷

### 3.4 差異化定位 / Differentiation Positioning

> **「Momo 不是最強大的 AI 工具，但它是最有溫度、最自由、最尊重你隱私的那一個。」**

| 差異化維度 | Momo 的獨特位子 |
|---|---|
| **情感層面** | 唯一有「人格」的 AI 助手──溫暖、有陪伴感，不是工具，是夥伴 / Companion over tool |
| **自由度** | 唯一同時支援 20+ 雲端模型 + 本地模型的免費方案 / Multi-model + local, free |
| **隱私** | 唯一對話全本地、支援離線模型的 AI 側邊欄 / Privacy-first |
| **中文** | 唯一原生繁中/簡中/英文三語的 AI 瀏覽器助手 / Native zh-TW/zh-CN/EN |

---

## 4. Market Segments

> 市場由人們的「待辦任務 / JTBD」定義，非人口統計。

### Segment 1: AI 進階玩家 / AI Power Users

| 維度 | 描述 |
|---|---|
| **JTBD** | 「我要在同一個介面比較不同 AI 模型的輸出，找出哪個最適合我的任務。」 |
| **現狀** | 開多個分頁（ChatGPT、Claude、Gemini 各一個），來回切換、複製貼上 |
| **痛點** | 切換成本高、無法並列比較、每個平台 UI 不同 |
| **約束** | 已有多個 API Key，不介意自己設定；對延遲敏感、對模型版本敏感 |
| **規模** | 全球約 500 萬–1000 萬 AI 重度使用者（含開發者、研究者、內容創作者） |
| **優先級** | ★★★★★ **第一灘頭 segment**——需求最強、付費意願低（Momo 免費優勢）、早期採用者帶動口碑 |

### Segment 2: 知識工作者 / Knowledge Workers

| 維度 | 描述 |
|---|---|
| **JTBD** | 「我在瀏覽網頁時，需要快速摘要、翻譯、改寫內容，不要離開當前頁面。」 |
| **現狀** | 複製文字 → 貼到 ChatGPT → 切回網頁 → 重複 |
| **痛點** | 上下文切換成本高、無法讓 AI 直接看到整頁內容 |
| **約束** | 不一定有 API Key；偏好一鍵操作、不需設定 |
| **規模** | 全球數億知識工作者（學生、研究者、作家、上班族） |
| **優先級** | ★★★★ 第二大 segment——需降低入門門檻（預設免費模型） |

### Segment 3: 隱私優先使用者 / Privacy-Conscious Users

| 維度 | 描述 |
|---|---|
| **JTBD** | 「我要使用 AI，但我的數據不能離開我的機器。」 |
| **現狀** | 要嘛不使用 AI、要嘛自己架設 Open WebUI + Ollama |
| **痛點** | 自架方案複雜、沒有瀏覽器整合 |
| **約束** | 有技術能力架設本地模型；對任何雲端方案不信任 |
| **規模** | 快速成長的利基市場（Ollama GitHub 100k+ stars） |
| **優先級** | ★★★ 利基但忠誠度高——Ollama/OpenClaw 整合是獨特護城河 |

---

## 5. Value Propositions

### 5.1 Segment 1: AI 進階玩家

**Value Proposition Statement：**  
> 用一個側邊欄隨時切換 20+ AI 模型，即時比較輸出，不再被單一服務商鎖定──完全免費。

| 6-Part JTBD | 內容 |
|---|---|
| **1. Who** | AI 進階玩家：開發者、AI 研究者、內容創作者，已擁有多個 AI 服務的 API Key |
| **2. Why (Problem)** | 需要比較不同 AI 模型的輸出品質、速度、風格，但每個平台都有自己的介面，來回切換浪費時間 |
| **3. What Before** | 開 5 個瀏覽器分頁（ChatGPT、Claude、Gemini、DeepSeek、Grok），各自貼上相同 prompt，人工比較 |
| **4. How (Solution)** | 一個側邊欄內建 20+ 模型、統一介面、一鍵切換、串流回覆、支援 Thinking Mode 可折疊推理過程 |
| **5. What After** | 在同一視窗內 3 秒完成模型切換與比較；發現最適合當前任務的模型；工作流不中斷 |
| **6. Alternatives** | Monica（付費、模型少）、Sider（群聊但付費）、開多分頁（免費但痛苦） |

### 5.2 Segment 2: 知識工作者

**Value Proposition Statement：**  
> 瀏覽任何網頁時，一鍵讓 AI 幫你摘要、翻譯、改寫──不需要離開當前頁面，不需要複製貼上。

| 6-Part JTBD | 內容 |
|---|---|
| **1. Who** | 知識工作者：學生、研究者、作家、上班族，每天閱讀大量網頁內容 |
| **2. Why (Problem)** | 閱讀網頁時需要 AI 輔助（摘要、翻譯、解釋），但來回切換到 ChatGPT 中斷閱讀流 |
| **3. What Before** | 選取文字 → 複製 → 打開 ChatGPT 分頁 → 貼上 → 等回覆 → 切回網頁；或根本不用 AI |
| **4. How (Solution)** | 點擊浮動球打開側邊欄 → AI 自動擷取當前網頁內容（5 種模式）→ 直接提問；Prompt 建議一鍵摘要/翻譯 |
| **5. What After** | 閱讀流不中斷；看到不懂的段落立刻問 AI；省去每天數十次複製貼上的摩擦 |
| **6. Alternatives** | Monica（劃詞功能但限制用量）、ChatGPT 分頁（免費但摩擦大）、Chrome Gemini 內建（單一模型限制） |

### 5.3 Segment 3: 隱私優先使用者

**Value Proposition Statement：**  
> 用本地 AI 模型聊天，所有對話存於你的機器──不經過任何雲端伺服器，完全免費。

| 6-Part JTBD | 內容 |
|---|---|
| **1. Who** | 隱私優先使用者：開發者、資安人員、企業用戶，不信任雲端 AI 服務 |
| **2. Why (Problem)** | 想用 AI 但不想把敏感數據（程式碼、商業文件、個人對話）送到 OpenAI/Google 的伺服器 |
| **3. What Before** | 自架 Open WebUI + Ollama（技術門檻高）、或乾脆不用 AI |
| **4. How (Solution)** | Momo 直接連接本地 Ollama/LM Studio/OpenClaw，瀏覽器內原生側邊欄體驗，對話存於 chrome.storage.local |
| **5. What After** | 享受與 ChatGPT 同等的側邊欄 AI 體驗，但數據 100% 留在本機；不需離開瀏覽器 |
| **6. Alternatives** | Open WebUI（需 docker、無瀏覽器整合）、GPT4All（獨立 app、非瀏覽器）、不用 AI |

---

## 6. Trade-offs

> 策略 = 選擇不做什麼。以下每一項「不做」都在強化 Momo 的價值主張。

| # | 不做什麼 / Won't Do | 原因 / Rationale |
|---|---|---|
| T1 | **不做付費方案** | 免費是 Momo 對抗 Monica/Sider 的核心武器。靠使用者自備 API Key 維持零邊際成本 |
| T2 | **不做雲端同步** | 對話存於本地是隱私承諾的基石；雲端同步破壞信任、增加營運成本與安全風險 |
| T3 | **不做 AI 繪圖** | 偏離核心（文字對話）；競品已有成熟方案；保持產品聚焦 |
| T4 | **不做團隊協作** | 需後端基礎設施、使用者系統、權限管理——超出個人專案範疇 |
| T5 | **不做 Firefox/Safari** | 短期資源不足以維護多平台；先深耕 Chrome，成為 Chrome 上最好的 AI 助手 |
| T6 | **不做內建模型額度** | 提供免費模型額度需要燒錢或賣數據——兩者都違反 Momo 的核心價值 |
| T7 | **不做廣告 / 不賣數據** | 隱私是品牌承諾；任何變現都必須與此一致 |
| T8 | **不做 Prompt 模板市場** | Monica 的 80+ 模板是功能氾濫——Momo 只提供 5 個精心挑選的通用 Prompt Suggestions |

---

## 7. North Star & Metrics

### 7.1 商業遊戲分類 / Business Game

Momo 玩的是 **Productivity Game**（生產力遊戲）：使用者在瀏覽網頁時，透過 Momo 更有效率地完成閱讀、寫作、研究、翻譯等任務。

### 7.2 北極星指標 / North Star Metric (NSM)

> **「每週成功對話次數 / Weekly Successful Conversations」**

**定義**：一週內，使用者發送訊息且收到 AI 完整回覆（非錯誤）的對話回合數。

**為什麼選這個？**

| NSM 檢驗標準 | 符合度 |
|---|---|
| 容易理解 / Easy to Understand | ✅ 「成功的對話次數」任何人一聽就懂 |
| 顧客導向 / Customer-Centric | ✅ 反映使用者實際獲得 AI 幫助的次數 |
| 可持續價值 / Sustainable Value | ✅ 持續對話代表持續使用習慣 |
| 願景一致 / Vision Alignment | ✅ 「讓 AI 陪伴你的瀏覽旅程」→ 對話次數是陪伴的量化 |
| 可量化 / Quantitative | ✅ 可從本地存儲推算（或未來輕量埋點） |
| 可行動 / Actionable | ✅ 改善模型延遲、增加服務商、優化 UI 都能提升此指標 |
| 領先指標 / Leading Indicator | ✅ 對話越多 → 留存越高 → 口碑傳播越多 |

### 7.3 輸入指標星座 / Input Metrics Constellation

```
                    ┌──────────────────────┐
                    │  NSM: 每週成功對話次數  │
                    └──────────┬───────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  週活躍安裝數   │    │  平均對話長度   │    │  模型切換次數   │
│  (WAU)        │    │ (回合數/對話)   │    │ (per user/wk) │
└───────────────┘    └───────────────┘    └───────────────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ 商店評分       │    │ 錯誤率         │    │ 回覆延遲(ms)    │
│ (CWS Rating)  │    │ (Error Rate)  │    │ (P50/P95)     │
└───────────────┘    └───────────────┘    └───────────────┘
```

| 輸入指標 / Input Metric | 定義 | 影響的 NSM 維度 |
|---|---|---|
| **IM1: 週活躍安裝數 (WAU)** | 一週內至少開啟一次側邊欄的安裝數 | 使用基數 |
| **IM2: 平均對話長度** | 每個對話的平均訊息回合數 | 深度互動 |
| **IM3: 模型切換次數** | 每位使用者每週切換模型的次數 | 多模型價值感知 |
| **IM4: Chrome Web Store 評分** | 商店平均星等與評分數 | 新使用者取得 |
| **IM5: 回覆錯誤率** | AI 回覆失敗（API Error / Timeout）比例 | 體驗品質 |
| **IM6: 回覆延遲 P50/P95** | 從發送訊息到第一個 token 出現的時間 | 體驗流暢度 |

### 7.4 當季重點指標 / OMTM (One Metric That Matters)

> **本季 OMTM：模型切換次數 per WAU**

**原因**：模型切換是 Momo 相較單一模型競品的核心差異化。提升此指標代表使用者正在體驗 Momo 的獨特價值，而非只當作「又一個 ChatGPT 側邊欄」。

---

## 8. Growth Loops

### 8.1 主要成長飛輪 / Primary Loop: Usage Loop（使用即傳播）

```
使用者用 Momo 生成優質內容（摘要、翻譯、文案）
        │
        ▼
使用者自然將 AI 輔助的成果分享到外部（社群貼文、報告、訊息）
        │
        ▼
接收者看到價值 → 詢問「你怎麼做到的？」 → 推薦 Momo
        │
        ▼
新使用者安裝 → 開始使用 → 生成更多內容 ──↺ 循環
```

**關鍵指標**：
- 分享率：多少對話結果被複製/匯出（可從匯出功能推估）
- 轉換率：被推薦者 → 安裝
- 循環週期：約 1–2 週

**加速策略**：
- 對話匯出為精美 Markdown，讓人願意分享
- 在對話底部加入「由 Momo 生成」的可選署名

### 8.2 次要飛輪 / Secondary Loop: Viral Loop（開源社群傳播）

```
開源社群（Ollama / Hugging Face）使用者發現 Momo 支援本地模型
        │
        ▼
在 GitHub / Reddit / Twitter 分享設定教學
        │
        ▼
技術社群看到「唯一支援本地模型的免費 AI 側邊欄」→ 安裝
        │
        ▼
更多技術使用者 → 貢獻 feedback → Momo 改進 → 更多人分享 ──↺ 循環
```

**關鍵指標**：
- GitHub stars / forks
- 社群提及次數（Reddit、Twitter、Hacker News）
- 從技術文章引導的安裝數

### 8.3 第三飛輪 / Tertiary Loop: Referral Loop（Chrome Web Store 口碑）

```
現有使用者在 Chrome Web Store 留下好評
        │
        ▼
評分提升 → 商店排名提升 → 自然流量增加
        │
        ▼
新使用者安裝 → 滿意 → 留下好評 ──↺ 循環
```

**加速策略**：
- 在側邊欄適當時機（使用 7 天後）引導評分
- 僅在正面體驗後觸發（避免打斷）

### 8.4 成長路線圖 / Growth Roadmap

| 時間 | 行動 |
|---|---|
| **0–30 天** | 優化 CWS 商店頁面（關鍵字、截圖、描述）；啟動 Referral Loop |
| **30–60 天** | 在 Ollama / Hugging Face 社群發布整合教學；啟動 Viral Loop |
| **60–90 天** | 加入對話匯出 Markdown 功能；啟動 Usage Loop；考慮 Product Hunt 發布 |

---

## 9. Capabilities & Defensibility

### 9.1 所需能力 / Required Capabilities

| 能力 | 自建 / 合作 | 現狀 |
|---|---|---|
| AI 模型整合層（20+ 服務商） | 自建 | ✅ 已完成 |
| 網頁內容擷取（Readability + Turndown） | 整合開源 | ✅ 已完成 |
| Markdown 渲染引擎 | 自建 | ✅ 已完成 |
| WebSocket 通訊（OpenClaw） | 自建 | ✅ Beta |
| 多語言 i18n 系統 | 自建 | ✅ 已完成 |
| UI/UX 設計 | 自建（設計師主導） | ✅ 已完成 |
| 行銷與社群經營 | 待發展 | ❌ 缺乏 |
| 數據分析（隱私合規） | 待發展 | ❌ 缺乏 |
| 客服與使用者支援 | 待發展 | ❌ 缺乏 |

### 9.2 競爭護城河 / Defensibility (Can't/Won't Copy)

| 護城河類型 | Momo 的防禦 | 強度 |
|---|---|---|
| **品牌情感** / Brand Emotion | 溫暖、有陪伴感的品牌人格——競品難以複製，因為需要從 Day 1 就建立；競品已定型為「工具」 | ★★★★ |
| **多模型整合深度** / Integration Depth | 20+ 服務商的協定差異、錯誤處理、串流適配——工程複雜度高，競品需大量重構才能追上 | ★★★★ |
| **本地模型生態** / Local Model Ecosystem | Ollama + LM Studio + OpenClaw + Hermes——這是獨特的技術組合，競品未觸及 | ★★★★★ |
| **隱私架構** / Privacy Architecture | 全本地儲存、零雲端處理——這是架構決策，不是功能開關，競品難以「加上」隱私 | ★★★★★ |
| **中文原生體驗** / Native Chinese UX | 繁簡轉換、中文 TTS 標點處理、中文 Prompt 最佳化——非中文團隊難以做到同等品質 | ★★★★ |
| **轉換成本** / Switching Costs | 使用者自訂的 System Prompt、對話歷史、API Key 設定——積累越多轉換成本越高 | ★★★ |

### 9.3 為什麼競品難以複製 / Why Competitors Can't/Won't Copy

1. **Monica/Sider**：商業模式鎖定 freemium，無法「變免費」——改變商業模式比開發新功能更難
2. **Chrome Gemini**：Google 的策略是推廣 Gemini，不會做多模型整合——這違反其商業利益
3. **任何新進者**：20+ API 整合 + 5 種擷取模式 + 本地模型支援 + 三語系統 —— 這些累積的工程深度不是一個 hackathon 專案能複製的

---

## 10. Release Roadmap

### 路線圖總覽 / Roadmap Overview

```
現在 v2.22.x ──── 短期(0-3mo) ──── 中期(3-6mo) ──── 長期(6-12mo)
    │                  │                   │                  │
    │ 維護 + 優化       │ 降低入門門檻       │ 增強留存與網絡效應  │ 擴張平台
    │                  │                   │                  │
    ▼                  ▼                   ▼                  ▼
  Bug fixes        免費預設模型        對話匯出 Markdown     Firefox 支援
  效能優化          新手引導            Token 用量儀表板      雲端備份(可選)
                   Prompt Suggestions  社群 Prompt 庫       Plugin 架構
                   擴充                對話分支/Fork         行動裝置適配
                   更多 AI 服務商       對話搜尋
                                      自訂快捷鍵
```

### 短期 / Short-term（0–3 months）

| 優先級 | 項目 | 類型 | 目標 | 狀態 |
|---|---|---|---|---|
| ~~P0~~ | ~~Bug 修復與效能優化（串流節流、記憶體）~~ | 維護 | 降低錯誤率至 <1% | ✅ **已完成 v2.22.13**：長對話 + 多圖記憶體暴漲導致側邊欄崩潰、超長回覆串流重複全量解析 Markdown 兩項已修復 |
| P0 | 聯網搜尋可靠度回歸測試 | 維護 | 確保「開關 = 必定搜尋」行為長期穩定 | ✅ **已完成 v2.22.14**：修正手動開啟聯網搜尋仍被啟發式否決、未整合搜尋結果的問題；簡易搜尋模式預設改為關閉（預設抓取網頁正文） |
| P1 | 預設免費模型方案（無需 API Key 即可開始） | 功能 | 降低入門門檻，提升轉換率 | 待辦 |
| P1 | 新手引導流程（首次安裝歡迎頁 → 選模型 → 第一次對話） | 體驗 | 提升 Day-1 留存 | 待辦 |
| P1 | 擴充 AI 服務商（追蹤新發布的熱門模型） | 功能 | 維持「業界最廣」定位 | 待辦 |
| P2 | 擴充 Prompt Suggestions（從 5 → 10 個） | 功能 | 縮小與競品的模板差距 | 待辦 |
| P2 | 側邊欄內引導 CWS 評分（使用 7 天後） | 成長 | 啟動 Referral Loop | 待辦 |

### 中期 / Mid-term（3–6 months）

| 優先級 | 項目 | 類型 | 目標 |
|---|---|---|---|
| P1 | 對話匯出為 Markdown 檔案 | 功能 | 啟動 Usage Loop |
| P1 | Token 用量儀表板（隱私相容：本地計算） | 功能 | 滿足 AI Power Users 需求 |
| P2 | 對話內全文搜尋 | 功能 | 改善大量對話的管理體驗 |
| P2 | 對話分支 / Fork 功能 | 功能 | 讓使用者從任一回覆點分支探索 |
| P2 | 自訂快捷鍵 | 改善 | 個人化 |
| P3 | 社群 Prompt 分享（從檔案匯入/匯出 Prompt） | 社群 | 啟動 Viral Loop |

### 長期 / Long-term（6–12 months）

| 優先級 | 項目 | 類型 | 目標 |
|---|---|---|---|
| P1 | Firefox 瀏覽器支援 | 擴展 | 擴大 TAM |
| P2 | 可選雲端備份（E2E 加密） | 功能 | 解決跨裝置需求但不犧牲隱私 |
| P2 | 自訂 Plugin 架構 | 平台 | 讓社群開發擴充（如：自動儲存到 Notion） |
| P3 | 行動裝置適配（Android Chrome） | 擴展 | 覆蓋行動場景 |
| P3 | Edge 瀏覽器正式支援 | 擴展 | 擴大 TAM |

---

## Appendix: 策略一致性檢查 / Strategy Coherence Check

| 檢查項 | 狀態 |
|---|---|
| Vision ↔ NSM | ✅ 「陪伴感」對應「每週對話次數」——越多對話 = 越多陪伴 |
| Trade-offs ↔ Value Props | ✅ 不做雲端同步 → 強化隱私價值主張；不做付費 → 強化免費價值 |
| Growth Loops ↔ Capabilities | ✅ Usage Loop 需要 Markdown 匯出（已規劃）；Viral Loop 需要本地模型支援（已就緒） |
| Defensibility ↔ Threats | ✅ 多模型 + 本地模型是 Chrome Gemini 內建無法複製的護城河 |
| Segments ↔ Priorities | ✅ 以 AI Power Users 為第一 segment → 帶動口碑 → 擴散到 Knowledge Workers |

---

*本文件為 Momo 產品的策略權威文件，每季檢視更新。最後更新：2026-06-26（對齊 CHANGELOG v2.22.13–14）*
