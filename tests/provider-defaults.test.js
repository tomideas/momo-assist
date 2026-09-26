const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const utilsPath = path.join(root, 'sider', 'js', 'utils.js');
const source = `${fs.readFileSync(utilsPath, 'utf8')}
;globalThis.PROVIDER_DEFAULTS = PROVIDER_DEFAULTS;
globalThis.PROVIDER_ICONS = PROVIDER_ICONS;`;
const context = vm.createContext({});
vm.runInContext(source, context);
const defaults = context.PROVIDER_DEFAULTS;
const icons = context.PROVIDER_ICONS;

test('every provider default has a matching dropdown entry and icon', () => {
  const html = fs.readFileSync(path.join(root, 'sider', 'options.html'), 'utf8');
  const dropdownIds = new Set([...html.matchAll(/data-provider="([^"]+)"/g)].map(match => match[1]));

  assert.deepEqual([...dropdownIds].sort(), Object.keys(defaults).sort());
  for (const providerId of Object.keys(defaults)) {
    assert.ok(icons[providerId], `${providerId} has no icon mapping`);
    assert.ok(fs.existsSync(path.join(root, 'sider', icons[providerId])), `${providerId} icon is missing`);
  }
});

test('remote providers have valid, internally consistent presets', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'sider', 'manifest.json'), 'utf8'));
  const allowedHosts = new Set(manifest.host_permissions);
  for (const [providerId, provider] of Object.entries(defaults)) {
    assert.equal(provider.id, providerId);
    assert.equal(new Set(provider.models).size, provider.models.length, `${providerId} has duplicate models`);
    assert.ok(provider.models.every(model => typeof model === 'string' && model.trim()), `${providerId} has an empty model`);
    if (provider.testModel) {
      assert.ok(provider.models.includes(provider.testModel), `${providerId} testModel is not a preset`);
    }
    if (provider.baseUrl.startsWith('https://')) {
      assert.ok(provider.models.length > 0, `${providerId} remote provider has no preset`);
      assert.ok(provider.testModel, `${providerId} remote provider has no testModel`);
      assert.ok(allowedHosts.has(`${new URL(provider.baseUrl).origin}/*`), `${providerId} host permission is missing`);
    }
  }
});

test('known retired bundled presets are no longer defaults', () => {
  const retired = new Set([
    'claude-opus-4-1',
    'deepseek-chat',
    'deepseek-reasoner',
    'gemini-3.1-flash-lite-preview',
    'meta-llama/llama-4-scout-17b-16e-instruct',
    'MiniMax-Text-01',
    'abab6.5s-chat',
    'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
    'Qwen/Qwen3-235B-A22B-fp8-tput'
  ]);

  for (const provider of Object.values(defaults)) {
    for (const model of provider.models) assert.ok(!retired.has(model), `${model} is retired`);
  }
});
