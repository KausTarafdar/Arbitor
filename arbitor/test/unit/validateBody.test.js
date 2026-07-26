import { test } from 'node:test';
import assert from 'node:assert/strict';

import validateBody from '../../src/utils/validateBody.js';
import { ValidationError } from '../../src/utils/errors.js';

test('returns true when a required key is present with a non-empty value', () => {
  assert.equal(validateBody({ api_name: 'x' }, ['api_name']), true);
});

test('throws ValidationError when none of the required keys are present', () => {
  assert.throws(() => validateBody({ other: 'x' }, ['api_name']), ValidationError);
});

test('throws ValidationError when any value is blank', () => {
  assert.throws(() => validateBody({ api_name: '   ' }, ['api_name']), ValidationError);
});

test('runs a passed extraValidate function and returns true when it passes', () => {
  const result = validateBody({ api_name: 'x' }, ['api_name'], (body) => body.api_name === 'x');
  assert.equal(result, true);
});

test('throws ValidationError when extraValidate returns false', () => {
  assert.throws(() => validateBody({ api_name: 'x' }, ['api_name'], () => false), ValidationError);
});
