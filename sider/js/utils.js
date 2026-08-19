/* js/utils.js — Shared utilities (single source of truth)
   Used by: sidepanel.js, options.js, background.js */

'use strict';

/* ── HTML Escaping ── */
function escapeHtml(str = '') {
  return str.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* ── Debounce ── */
function debounce(fn, wait) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
}

/* ── UUID ── */
function generateUUID() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  let s = '';
  for (let i = 0; i < 16; i++) s += b[i].toString(16).padStart(2, '0');
  return s.slice(0, 8) + '-' + s.slice(8, 12) + '-' + s.slice(12, 16) + '-' + s.slice(16, 20) + '-' + s.slice(20);
}

/* ── Short ID (for prompts etc.) ── */
function shortId() {
  return 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ── Build OpenAI-compatible chat completions URL ── */
function buildChatCompletionsUrl(base) {
  if (!base) base = 'https://api.openai.com/v1';
  base = String(base).trim().replace(/\/+$/, '');
  if (base.endsWith('/chat/completions')) return base;
  base = base.replace(/\/models\/?$/, ''); // LM Studio compat
  if (!/\/v1$/.test(base)) base = base + '/v1';
  return base + '/chat/completions';
}

/* ── Normalize endpoint URL ── */
function normalizeEndpoint(ep) {
  if (!ep) return '';
  return ep.replace(/\s+/g, '').replace(/\/+$/, '');
}

/* ── OpenClaw Gateway URL & protocol (single source of truth) ── */
const OPENCLAW_PROTOCOL_MIN = 3;
const OPENCLAW_PROTOCOL_MAX = 4;

function isValidOpenClawGatewayUrl(url) {
  if (!url) return false;
  return /^(https?|wss?):\/\/.+/i.test(String(url).trim());
}

/** Accept http(s):// or ws(s)://; convert http(s) to ws(s) for WebSocket. */
function normalizeOpenClawGatewayUrl(url) {
  if (!url) return '';
  let u = String(url).trim().replace(/\s+/g, '').replace(/\/+$/, '');
  if (!u) return '';
  if (!isValidOpenClawGatewayUrl(u)) return '';
  return u.replace(/^https:\/\//i, 'wss://').replace(/^http:\/\//i, 'ws://');
}

/* ── Provider icon mapping ── */
const PROVIDER_ICONS = {
  anthropic: 'assets/icons/anthropic.svg',
  bigmodel:  'assets/icons/zhipu-color.svg',
  chutes:    'assets/icons/chutes.png',
  custom:    'assets/icons/custom.svg',
  qwen:     'assets/icons/qwen.svg',
  openai:   'assets/icons/openai.svg',
  deepseek: 'assets/icons/deepseek.svg',
  huggingface: 'assets/icons/huggingface-color.svg',
  google:   'assets/icons/google.svg',
  mistral:   'assets/icons/mistral-color.svg',
  novita:    'assets/icons/novita-color.svg',
  ollama:   'assets/icons/ollama.svg',
  groq:       'assets/icons/groq.svg',
  hermes:     'assets/icons/hermes.svg',
  lmstudio: 'assets/icons/lmstudio.svg',
  openclaw: 'assets/icons/openclaw.svg',
  nvidia:     'assets/icons/nvidia.svg',
  minimax:    'assets/icons/minimax.svg',
  moonshot:   'assets/icons/moonshot.svg',
  openrouter: 'assets/icons/openrouter.svg',
  together:   'assets/icons/together-color.svg',
  vercel:     'assets/icons/vercel.svg',
  xai:        'assets/icons/xai.svg'
};

function getProviderIconUrl(providerId) {
  const path = PROVIDER_ICONS[providerId];
  if (path) return chrome.runtime.getURL(path);
  return '';
}

/* ── Provider defaults (single source of truth, alphabetical by name) ── */
const PROVIDER_DEFAULTS = {
  anthropic: {
    id: 'anthropic', name: 'Anthropic (Claude)',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-sonnet-4-5', 'claude-opus-4-1'],
    testModel: 'claude-sonnet-4-5'
  },
  bigmodel: {
    id: 'bigmodel', name: 'BigModel (Zhipu)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-4.5', 'glm-4.5-air'],
    testModel: 'glm-4.5-air'
  },
  chutes: {
    id: 'chutes', name: 'Chutes',
    baseUrl: 'https://llm.chutes.ai/v1',
    models: ['deepseek-ai/DeepSeek-V3.1', 'Qwen/Qwen3-235B-A22B-Instruct-2507'],
    testModel: 'deepseek-ai/DeepSeek-V3.1'
  },
  custom: {
    id: 'custom', name: 'Custom',
    baseUrl: '',
    models: []
  },
  deepseek: {
    id: 'deepseek', name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    testModel: 'deepseek-chat'
  },
  google: {
    id: 'google', name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: ['gemini-3.1-flash-lite-preview', 'gemini-3-flash-preview'],
    testModel: 'gemini-3.1-flash-lite-preview'
  },
  groq: {
    id: 'groq', name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['openai/gpt-oss-120b', 'meta-llama/llama-4-scout-17b-16e-instruct'],
    testModel: 'openai/gpt-oss-120b'
  },
  hermes: {
    id: 'hermes', name: 'Hermes',
    baseUrl: 'http://127.0.0.1:8642/v1',
    models: ['hermes-agent'],
    testModel: 'hermes-agent',
    isAgentProvider: true,
    isBeta: true
  },
  lmstudio: {
    id: 'lmstudio', name: 'LM Studio',
    baseUrl: 'http://localhost:1234/v1',
    models: []
  },
  huggingface: {
    id: 'huggingface', name: 'Hugging Face',
    baseUrl: 'https://router.huggingface.co/v1',
    models: ['openai/gpt-oss-120b', 'Qwen/Qwen3-Coder-480B-A35B-Instruct'],
    testModel: 'openai/gpt-oss-120b'
  },
  minimax: {
    id: 'minimax', name: 'MiniMax',
    baseUrl: 'https://api.minimaxi.chat/v1',
    models: ['MiniMax-Text-01', 'abab6.5s-chat'],
    testModel: 'MiniMax-Text-01'
  },
  mistral: {
    id: 'mistral', name: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-latest', 'mistral-small-latest'],
    testModel: 'mistral-small-latest'
  },
  moonshot: {
    id: 'moonshot', name: 'Moonshot',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: ['kimi-k2.5', 'kimi-k2'],
    testModel: 'kimi-k2'
  },
  novita: {
    id: 'novita', name: 'Novita AI',
    baseUrl: 'https://api.novita.ai/v3/openai',
    models: ['deepseek/deepseek-v3.1', 'qwen/qwen3-235b-a22b-instruct-2507'],
    testModel: 'deepseek/deepseek-v3.1'
  },
  nvidia: {
    id: 'nvidia', name: 'NVIDIA',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    models: ['nvidia/nemotron-3-super-120b-a12b', 'nvidia/nemotron-3-nano-30b-a3b'],
    testModel: 'nvidia/nemotron-3-nano-30b-a3b'
  },
  ollama: {
    id: 'ollama', name: 'Ollama',
    baseUrl: 'http://localhost:11434/v1',
    models: []
  },
  openclaw: {
    id: 'openclaw', name: 'OpenClaw',
    baseUrl: 'ws://127.0.0.1:18789',
    models: ['openclaw'],
    enabledModels: [],
    isOpenClaw: true
  },
  openai: {
    id: 'openai', name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-5.4-mini', 'gpt-5.4'],
    testModel: 'gpt-5.4-mini'
  },
  openrouter: {
    id: 'openrouter', name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['anthropic/claude-sonnet-4.6', 'deepseek/deepseek-chat'],
    testModel: 'deepseek/deepseek-chat'
  },
  qwen: {
    id: 'qwen', name: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen3.5-plus', 'qwen3.5-flash'],
    testModel: 'qwen3.5-flash',
    supportsThinking: true,
    defaultEnableThinking: false
  },
  together: {
    id: 'together', name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    models: ['meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8', 'Qwen/Qwen3-235B-A22B-fp8-tput'],
    testModel: 'Qwen/Qwen3-235B-A22B-fp8-tput'
  },
  vercel: {
    id: 'vercel', name: 'Vercel AI Gateway',
    baseUrl: 'https://ai-gateway.vercel.sh/v1',
    models: ['openai/gpt-5.4-mini', 'anthropic/claude-sonnet-4-5'],
    testModel: 'openai/gpt-5.4-mini'
  },
  xai: {
    id: 'xai', name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    models: ['grok-4', 'grok-4-fast'],
    testModel: 'grok-4-fast'
  }
};

/* ── Capture presets ── */
const CAPTURE_PRESETS = {
  smart:  { include: '', exclude: 'header\nfooter\nnav\naside' },
  limited:{ include: '', exclude: 'header\nfooter\nnav\naside' },
  visible:{ include: '', exclude: 'header\nfooter\nnav\naside' },
  full:   { include: '', exclude: '' },
  reader: { include: '', exclude: 'header\nfooter\nnav\naside' }
};

/* ── Normalize exclude selectors ── */
function normalizeExcludeSelectors(raw) {
  if (!raw) return '';
  return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean).join('\n');
}
