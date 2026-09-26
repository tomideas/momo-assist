const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const utilsPath = path.join(__dirname, '..', 'sider', 'js', 'utils.js');
const source = `${fs.readFileSync(utilsPath, 'utf8')}
;globalThis.PROVIDER_DEFAULTS = PROVIDER_DEFAULTS;
globalThis.PROVIDER_ICONS = PROVIDER_ICONS;
globalThis.resolveProviderTestModel = resolveProviderTestModel;
globalThis.adaptChatCompletionRequest = adaptChatCompletionRequest;
globalThis.sanitizeProviderModels = sanitizeProviderModels;`;
const context = vm.createContext({});
vm.runInContext(source, context);
const resolveProviderTestModel = context.resolveProviderTestModel;
const adaptChatCompletionRequest = context.adaptChatCompletionRequest;
const sanitizeProviderModels = context.sanitizeProviderModels;

test('custom provider uses its selected configured model', () => {
  const models = [
    { name: 'glm-5.3-flash', enabled: true },
    { name: 'deepseek-v4-flash-0731', enabled: true }
  ];

  assert.equal(
    resolveProviderTestModel('custom', models, 'custom::deepseek-v4-flash-0731'),
    'deepseek-v4-flash-0731'
  );
});

test('dynamic provider falls back to its first enabled configured model', () => {
  const models = [
    { name: 'disabled-model', enabled: false },
    { name: 'glm-5.3-flash', enabled: true }
  ];

  assert.equal(resolveProviderTestModel('custom', models, 'openai::gpt-5.4-mini'), 'glm-5.3-flash');
});

test('dynamic provider ignores a stale disabled selection', () => {
  const models = [
    { name: 'disabled-model', enabled: false },
    { name: 'enabled-model', enabled: true }
  ];

  assert.equal(resolveProviderTestModel('custom', models, 'custom::disabled-model'), 'enabled-model');
});

test('dynamic provider accepts a legacy plain-name selection', () => {
  const models = [{ name: 'glm-5.3-flash', enabled: true }];

  assert.equal(resolveProviderTestModel('custom', models, 'glm-5.3-flash'), 'glm-5.3-flash');
});

test('provider defaults still take precedence for built-in providers', () => {
  assert.equal(
    resolveProviderTestModel('openai', [{ name: 'user-added-model', enabled: true }], 'openai::user-added-model'),
    'gpt-5.6-luna'
  );
});

test('dynamic provider with no configured models returns no model', () => {
  assert.equal(resolveProviderTestModel('custom', [], ''), '');
  assert.notEqual(resolveProviderTestModel('custom', [], ''), 'custom');
});

test('current OpenAI chat requests omit unsupported sampling parameters', () => {
  const body = adaptChatCompletionRequest('openai', 'gpt-6-astra', {
    model: 'gpt-6-astra',
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 32
  });

  assert.equal(body.temperature, undefined);
  assert.equal(body.top_p, undefined);
  assert.equal(body.max_tokens, undefined);
  assert.equal(body.max_completion_tokens, 32);
});

test('request adaptation does not rewrite other providers', () => {
  const body = adaptChatCompletionRequest('openrouter', 'openai/gpt-6-astra', {
    temperature: 0.7,
    max_tokens: 32
  });

  assert.equal(body.temperature, 0.7);
  assert.equal(body.max_tokens, 32);
});

test('the same upstream model name can exist under several gateways', () => {
  const model = { name: 'openai/gpt-6-astra', enabled: true };

  assert.equal(sanitizeProviderModels([model], 'openrouter')[0].provider, 'openrouter');
  assert.equal(sanitizeProviderModels([model], 'vercel')[0].provider, 'vercel');
});
