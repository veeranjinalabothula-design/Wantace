const test = require('node:test');
const assert = require('node:assert/strict');
const { validateOrderInput } = require('../backend/lib/validateOrder');

test('accepts a complete order and preserves its values', () => {
  const input = {
    party: 'Northwind Traders',
    item: 'Stainless steel tumbler',
    qty: 24,
    unit: 'pcs',
    rate: 125.5
  };

  assert.deepEqual(validateOrderInput(input), { value: input });
});

test('requires all core fields for a new order', () => {
  assert.deepEqual(validateOrderInput({ party: 'Northwind Traders' }), {
    error: 'item is required.'
  });
});

test('rejects invalid quantities and rates', () => {
  assert.equal(validateOrderInput({ qty: 0 }, { partial: true }).error, 'qty must be a number greater than zero.');
  assert.equal(validateOrderInput({ rate: -1 }, { partial: true }).error, 'rate must be a non-negative number.');
});

test('rejects unsupported fields to prevent mass assignment', () => {
  assert.deepEqual(validateOrderInput({ status: 'pending', _id: 'untrusted' }, { partial: true }), {
    error: 'Unsupported field: _id.'
  });
});

test('accepts only known order statuses', () => {
  assert.equal(validateOrderInput({ status: 'in-transit' }, { partial: true }).error,
    'status must be one of: pending, dispatched, hold, return.');
});
