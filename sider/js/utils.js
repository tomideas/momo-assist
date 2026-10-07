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
  azure:     'assets/icons/azure.svg',
  bigmodel:  'assets/icons/zhipu-color.svg',
  cerebras:  'assets/icons/cerebras.svg',
  chutes:    'assets/icons/chutes.png',
  custom:    'assets/icons/custom.svg',
  qwen:     'assets/icons/qwen.svg',
  openai:   'assets/icons/openai.svg',
  deepseek: 'assets/icons/deepseek.svg',
  fireworks: 'assets/icons/fireworks.svg',
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
  perplexity: 'assets/icons/perplexity.svg',
  siliconflow: 'assets/icons/siliconflow.svg',
  together:   'assets/icons/together-color.svg',
  vercel:     'assets/icons/vercel.svg',
  xai:        'assets/icons/xai.svg'
};

function getProviderIconUrl(providerId) {
  const path = PROVIDER_ICONS[providerId];
  if (path) return chrome.runtime.getURL(path);
  return '';
}

/* ── Provider defaults (single source of truth) ── */
const PROVIDER_DEFAULTS = {
  anthropic: {
    id: 'anthropic', name: 'Anthropic (Claude)',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-opus-5', 'claude-sonnet-5', 'claude-fable-5-1'],
    testModel: 'claude-sonnet-5'
  },
  azure: {
    id: 'azure', name: 'Azure OpenAI',
    baseUrl: '',
    models: []
  },
  bigmodel: {
    id: 'bigmodel', name: 'BigModel (Zhipu)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-5.2', 'glm-5v-turbo'],
    testModel: 'glm-5.2'
  },
  cerebras: {
    id: 'cerebras', name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1',
    models: ['gpt-oss-120b', 'zai-glm-4.7'],
    testModel: 'gpt-oss-120b'
  },
  chutes: {
    id: 'chutes', name: 'Chutes',
    baseUrl: 'https://llm.chutes.ai/v1',
    models: ['moonshotai/Kimi-K3-TEE', 'Qwen/Qwen3.8-27B-TEE', 'deepseek-ai/DeepSeek-V4-Flash-0731-TEE'],
    testModel: 'Qwen/Qwen3.8-27B-TEE'
  },
  custom: {
    id: 'custom', name: 'Custom',
    baseUrl: '',
    models: []
  },
  deepseek: {
    id: 'deepseek', name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-flash'],
    testModel: 'deepseek-flash'
  },
  fireworks: {
    id: 'fireworks', name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    models: ['accounts/fireworks/models/glm-5p2', 'accounts/fireworks/models/kimi-k2p7-code', 'accounts/fireworks/models/kimi-k2p6'],
    testModel: 'accounts/fireworks/models/kimi-k2p6'
  },
  google: {
    id: 'google', name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-pro-preview'],
    testModel: 'gemini-3.5-flash-lite'
  },
  groq: {
    id: 'groq', name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'llama-3.3-70b-versatile'],
    testModel: 'openai/gpt-oss-20b'
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
    models: ['zai-org/GLM-5.3-Flash', 'deepseek-ai/DeepSeek-V4.1-Flash', 'Qwen/Qwen3.8-27B'],
    testModel: 'zai-org/GLM-5.3-Flash'
  },
  minimax: {
    id: 'minimax', name: 'MiniMax',
    baseUrl: 'https://api.minimax.io/v1',
    models: ['MiniMax-M3', 'MiniMax-M2.7', 'MiniMax-M2.7-highspeed'],
    testModel: 'MiniMax-M2.7'
  },
  mistral: {
    id: 'mistral', name: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-medium-3-5', 'mistral-small-2603'],
    testModel: 'mistral-small-2603'
  },
  moonshot: {
    id: 'moonshot', name: 'Moonshot',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: ['kimi-k2.5'],
    testModel: 'kimi-k2.5'
  },
  novita: {
    id: 'novita', name: 'Novita AI',
    baseUrl: 'https://api.novita.ai/openai',
    models: ['zai-org/glm-5.3-flash', 'deepseek/deepseek-v4.1-flash', 'moonshotai/kimi-k3'],
    testModel: 'zai-org/glm-5.3-flash'
  },
  nvidia: {
    id: 'nvidia', name: 'NVIDIA',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    models: ['nvidia/nemotron-3.5-lightning-30b-a3b', 'nvidia/nemotron-3-ultra-550b-a55b', 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning'],
    testModel: 'nvidia/nemotron-3.5-lightning-30b-a3b'
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
    models: ['gpt-6-astra', 'gpt-5.6-terra', 'gpt-5.6-luna'],
    testModel: 'gpt-5.6-luna'
  },
  openrouter: {
    id: 'openrouter', name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['openai/gpt-6-astra', 'anthropic/claude-sonnet-5', 'google/gemini-3.8-flash'],
    testModel: 'google/gemini-3.8-flash'
  },
  perplexity: {
    id: 'perplexity', name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    models: ['sonar', 'sonar-pro', 'sonar-reasoning-pro', 'sonar-deep-research'],
    testModel: 'sonar'
  },
  qwen: {
    id: 'qwen', name: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen3.8-max', 'qwen3.8-flash'],
    testModel: 'qwen3.8-flash',
    supportsThinking: true,
    defaultEnableThinking: false
  },
  siliconflow: {
    id: 'siliconflow', name: 'SiliconFlow',
    baseUrl: 'https://api.siliconflow.com/v1',
    models: ['zai-org/GLM-5.3-Flash', 'deepseek-ai/DeepSeek-V4-Flash-0731', 'Qwen/Qwen3.8-2.4T-A95B'],
    testModel: 'zai-org/GLM-5.3-Flash'
  },
  together: {
    id: 'together', name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    models: ['MiniMaxAI/MiniMax-M2.7', 'moonshotai/Kimi-K2.6', 'deepseek-ai/DeepSeek-V4-Pro'],
    testModel: 'MiniMaxAI/MiniMax-M2.7'
  },
  vercel: {
    id: 'vercel', name: 'Vercel AI Gateway',
    baseUrl: 'https://ai-gateway.vercel.sh/v1',
    models: ['openai/gpt-6-astra', 'anthropic/claude-sonnet-5', 'google/gemini-3.8-flash'],
    testModel: 'google/gemini-3.8-flash'
  },
  xai: {
    id: 'xai', name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    models: ['grok-4.6', 'grok-4.5', 'grok-4.3'],
    testModel: 'grok-4.6'
  }
};

/* Resolve the model used by connection tests without inventing a provider-id model. */
function resolveProviderTestModel(providerId, models, selectedModelUid = '') {
  const defaults = PROVIDER_DEFAULTS[providerId];
  if (defaults?.testModel) return defaults.testModel;

  const configured = (Array.isArray(models) ? models : [])
    .map(model => ({ ...model, name: String(model?.name || '').trim() }))
    .filter(model => model.name);
  const selectedValue = String(selectedModelUid || '');
  const selectedPrefix = `${providerId}::`;
  const selectedName = selectedValue.startsWith(selectedPrefix)
    ? selectedValue.slice(selectedPrefix.length).trim()
    : selectedValue.includes('::') ? '' : selectedValue.trim();
  if (selectedName && configured.some(model => model.enabled && model.name === selectedName)) return selectedName;

  return configured.find(model => model.enabled)?.name
    || configured[0]?.name
    || defaults?.models?.[0]
    || '';
}

/* Keep current OpenAI reasoning models (incl. Azure deployments named after them) compatible with the Chat Completions API. */
function adaptChatCompletionRequest(providerId, modelName, body) {
  const request = { ...(body || {}) };
  const isCurrentOpenAIModel = (providerId === 'openai' || providerId === 'azure') && /^gpt-(?:5(?:\.|-)|6(?:\.|-))/i.test(String(modelName || ''));
  if (!isCurrentOpenAIModel) return request;

  delete request.temperature;
  delete request.top_p;
  delete request.top_logprobs;
  delete request.logprobs;
  if (request.max_tokens !== undefined && request.max_completion_tokens === undefined) {
    request.max_completion_tokens = request.max_tokens;
    delete request.max_tokens;
  }
  return request;
}

/* Model IDs are scoped by provider; gateways may legitimately expose the same name. */
function sanitizeProviderModels(models, providerId) {
  const seen = new Set();
  const out = [];
  (Array.isArray(models) ? models : []).forEach(model => {
    const name = String(model?.name || '').trim();
    if (!name || seen.has(name)) return;
    if (model?.provider && model.provider !== providerId) return;
    seen.add(name);
    out.push({
      name,
      enabled: !!model.enabled,
      provider: providerId,
      ...(model.thinkingParams ? { thinkingParams: model.thinkingParams } : {}),
      ...(model.prefixPrompt ? { prefixPrompt: model.prefixPrompt } : {})
    });
  });
  return out;
}

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
