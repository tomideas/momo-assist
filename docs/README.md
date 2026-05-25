# Momo 說明文件（HTML）

本目錄是 **Hii~ Momo: AI Assist** 的使用者說明書，與擴充功能原始碼同屬 [momo-bud](https://github.com/tomideas/momo-bud) repo。

## 一般使用者怎麼讀？

在 GitHub 上**直接點開** `index.html` 只會看到原始碼，無法當完整網站瀏覽。

請使用 **GitHub Pages**（推送 `main` 後由 Actions 自動發佈）：

👉 **https://tomideas.github.io/momo-bud/**

首次啟用：GitHub repo → **Settings** → **Pages** → **Build and deployment** → Source 選 **GitHub Actions**。

## 本機預覽

```bash
# 在 repo 根目錄
open docs/index.html
# 或
python3 -m http.server 8765 --directory docs
# 瀏覽器開 http://127.0.0.1:8765/
```

## 與 tomideas.github.io 的關係

`tomideas.github.io` 預留作日後**全專案介紹站**；Momo 說明書**只維護此 `docs/` 目錄**，不再同步到該 repo。
