'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'sider/manifest.json'), 'utf8'));
const optionsHtml = fs.readFileSync(path.join(root, 'sider/options.html'), 'utf8');
const optionsJs = fs.readFileSync(path.join(root, 'sider/options.js'), 'utf8');

test('settings footer renders the extension version from the manifest', () => {
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.match(optionsHtml, /id="extensionVersion"/);
  assert.match(optionsJs, /chrome\.runtime\.getManifest\(\)\.version/);
});
