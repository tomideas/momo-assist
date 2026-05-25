# Momo 說明文件（HTML）

本目錄是 **Hii~ Momo: AI Assist** 的使用者說明書，與擴充功能原始碼同屬 [hii-momo](https://github.com/tomideas/hii-momo) repo。

## 一般使用者怎麼讀？

在 GitHub 上**直接點開** `index.html` 只會看到原始碼，無法當完整網站瀏覽。

請使用 **GitHub Pages**（推送 `main` 後由 Actions 自動發佈）：

👉 **https://tomideas.github.io/hii-momo/**

首次啟用：GitHub repo → **Settings** → **Pages** → **Build and deployment** → Source 選 **GitHub Actions**。

## 本機預覽

```bash
# 在 repo 根目錄
open docs/index.html
# 或
python3 -m http.server 8765 --directory docs
# 瀏覽器開 http://127.0.0.1:8765/
```

## 舊網址 `tomideas.github.io`

根網址 **https://tomideas.github.io/** 來自將刪除的 `tomideas.github.io` repo（舊說明書副本）。

- **正式說明書網址**：**https://tomideas.github.io/hii-momo/**（由本 repo 的 `docs/` 發佈）
- 舊路徑 `/momo-bud/` 會由 GitHub 轉址至 `/hii-momo/`
- 舊 `tomideas.github.io` repo 僅暫留跳轉頁，之後會刪除，不再維護 Momo 文件
