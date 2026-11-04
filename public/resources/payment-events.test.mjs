import test from 'node:test';
import assert from 'node:assert/strict';
import { initialPayment, applyPaymentEvent } from './payment-events.mjs';
const e = (eventId, outcome, paymentId = 'p1') => ({ paymentId, eventId, outcome });
test('duplicate event is a no-op and does not mutate the input', () => {
  const original = initialPayment('p1');
  const next = applyPaymentEvent(original, e('e1', 'succeeded'));
  assert.equal(original.status, 'pending'); assert.deepEqual(original.seen, []);
  assert.equal(applyPaymentEvent(next, e('e1', 'succeeded')), next);
});
test('late pending observation does not regress terminal success', () => {
  const state = applyPaymentEvent(initialPayment('p1'), e('e1', 'succeeded'));
  assert.equal(applyPaymentEvent(state, e('e2', 'pending')).status, 'succeeded');
});
test('contradictory terminal outcomes require reconciliation in either order', () => {
  for (const order of [['succeeded', 'failed'], ['failed', 'succeeded']]) {
    let state = initialPayment('p1');
    order.forEach((outcome, i) => { state = applyPaymentEvent(state, e('e'+i, outcome)); });
    assert.equal(state.status, 'reconciliation_required');
    assert.equal(applyPaymentEvent(state, e('e3', 'pending')).status, 'reconciliation_required');
  }
});
test('invalid event identity, wrong payment and unsupported statuses are rejected', () => {
  const state = initialPayment('p1');
  assert.throws(() => applyPaymentEvent(state, e('e1','succeeded','p2')));
  assert.throws(() => applyPaymentEvent(state, e('','succeeded')));
  assert.throws(() => applyPaymentEvent(state, e('e1','refunded')));
});
