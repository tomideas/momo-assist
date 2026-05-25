# 🐹 Hii~ Momo: AI Assist

[繁體中文](README.zh-TW.md) | English

🐹 **Hey bud! Meet Momo** — your friendly AI companion, right in your browser. Hii~ Momo: AI Assist is a Chrome sidebar crafted by a designer who believes AI tools should feel warm, personal, and delightful ✨ — not just functional. Pick from **12+ AI providers** 🤖 (including Groq, Hermes Beta, OpenClaw Beta, and more), **search the web** 🔍, **capture pages** 📄, **upload images** 🖼️, **hear replies with system TTS** 🔊, and **tune font size & weight for comfortable reading** 👁️ — with **Traditional Chinese / Simplified Chinese / English** UI 🌐, a **float ball** for quick access 🎈, **custom prompts**, **chat history**, and **shortcuts** — all from a cozy little sidebar that feels like talking to a friend 💬

![Momo AI Screenshot](docs/momo-preview.png)

## ✨ Features

- 🤖 12+ AI providers (OpenAI, Google Gemini, DeepSeek, Qwen, Ollama, LM Studio, OpenRouter, NVIDIA, Groq, MiniMax, Moonshot, Hermes Beta, Custom)
- 🧪 OpenClaw (Beta) — WebSocket AI gateway for local device-to-device communication
- 💬 Sidebar chat interface
- 🎈 Floating ball for quick access
- 📄 Web page capture & reference
- 🔍 Web search (DuckDuckGo, Brave, Tavily)
- 🖼️ Image upload & vision
- 🔊 Text-to-Speech (System TTS)
- 📝 Custom system prompts
- 🗂️ Chat history management
- 🌐 Multi-language UI (繁中 / 簡中 / English)
- ⌨️ Keyboard shortcuts
- 👁️ Adjustable font size & weight for comfortable reading

## 🧪 Hermes Agent (Beta) Overview

Hermes Agent is a local-first AI agent server.  
With Hii~ Momo: AI Assist, it works as your private in-browser assistant: lower latency, self-managed gateway, and easier control over local data flow.

- Default Base URL: `http://127.0.0.1:8642/v1`
- Default model: `hermes-agent`
- Connection mode: OpenAI-compatible HTTP API (not OpenClaw WebSocket)

### Hermes Quick Start

1. Enable the API server in your Hermes `.env`:

```env
API_SERVER_ENABLED=true
API_SERVER_HOST=0.0.0.0
API_SERVER_PORT=8642
API_SERVER_KEY=<your-secret-key>
API_SERVER_CORS_ORIGINS=*
```

2. Restart the Hermes gateway.  
3. Open Momo settings and choose **Hermes (beta)**.  
4. Click **Connect**, then enable `hermes-agent` after the check passes.  
5. If you see 401/403, verify `API_SERVER_KEY` and CORS settings first.

## 🆓 Free API Providers

No credit card needed. Get started in minutes:

| Provider | Free Models | Rate Limit | Get API Key | Models |
|----------|------------|------------|-------------|--------|
| **Ollama Cloud** | minimax-m2.7, kimi-k2.5 and more | 1 concurrent task, GPU quota resets every 5h / 7d | [ollama.com/settings/keys](https://ollama.com/settings/keys) | [List](https://ollama.com/v1/models) |
| **Google AI Studio** | gemini-3-flash-preview, gemini-3.1-flash-lite-preview | 1,500 RPD / 15 RPM, up to 1M token context | [aistudio.google.com/api-keys](https://aistudio.google.com/api-keys) | [List](https://ai.google.dev/gemini-api/docs/models) |
| **Groq** | Llama 3.3, DeepSeek-R1 | ~30 RPM / 14,400 RPD, blazing fast inference | [console.groq.com/keys](https://console.groq.com/keys) | [List](https://console.groq.com/docs/rate-limits) |
| **NVIDIA NIM** | Models marked "Free Endpoint" | ~40 RPM, no total limit | [build.nvidia.com/settings/api-keys](https://build.nvidia.com/settings/api-keys) | [List](https://build.nvidia.com/models) |

> **Base URLs**: Ollama Cloud `https://ollama.com/v1` · Google AI `https://generativelanguage.googleapis.com/v1beta` · Groq `https://api.groq.com/openai/v1` · NVIDIA `https://integrate.api.nvidia.com/v1`

## 📦 Installation

### From Release

1. 📥 Download the latest `momo-ai-*-chrome.zip` from [Releases](https://github.com/tomideas/hii-momo/releases)
2. 📂 Unzip the file
3. 🌐 Open Chrome, go to `chrome://extensions/`
4. 🔧 Enable "Developer mode"
5. 📁 Click "Load unpacked" and select the unzipped folder
6. 🐹 Click the Momo icon in the toolbar to start

### From Source

1. 🔗 Clone this repo
2. 🌐 Open Chrome, go to `chrome://extensions/`
3. 🔧 Enable "Developer mode"
4. 📁 Click "Load unpacked" and select the `sider/` folder

## 📖 Documentation

User guide (HTML, hosted via GitHub Pages):

👉 [tomideas.github.io/hii-momo](https://tomideas.github.io/hii-momo/)

Source files live in [`docs/`](docs/). See [`docs/README.md`](docs/README.md) for local preview.

## 🗂️ Project Structure

```
sider/              # 🧩 Chrome extension source
├── manifest.json   # 📋 MV3 manifest
├── background.js   # ⚙️ Service worker
├── sidepanel.*     # 💬 Sidebar UI
├── options.*       # 🔧 Settings page
├── assets/         # 🎨 Icons, i18n translations
├── js/             # 🧠 Core modules
└── libs/           # 📚 Third-party libraries
docs/               # 📖 Documentation site
```

## 📄 License

MIT License
