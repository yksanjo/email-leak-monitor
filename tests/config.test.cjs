const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEmails } = require('../src/config');

test('validateEmails filters malformed addresses', () => {
  const out = validateEmails(['User@Example.com', 'no-at-symbol', 'a@b.io']);
  assert.deepEqual(out, ['user@example.com', 'a@b.io']);
});
