// Copyright 2026 Scriza Private Limited. MIT license: REFERENCE-LICENSE.txt.
// Educational, in-memory reducer for synthetic normalized payment events.
// NOT a payment connector, durable idempotency store, ledger, or settlement engine.
export function initialPayment(paymentId) {
  if (typeof paymentId !== 'string' || !paymentId.trim()) throw new TypeError('paymentId required');
  return { paymentId, status: 'pending', seen: [], outcomes: [] };
}
export function applyPaymentEvent(state, event) {
  if (!state || !event || event.paymentId !== state.paymentId) throw new TypeError('Payment mismatch');
  if (typeof event.eventId !== 'string' || !event.eventId.trim()) throw new TypeError('eventId required');
  if (!['pending', 'succeeded', 'failed'].includes(event.outcome)) throw new TypeError('Unsupported outcome');
  if (state.seen.includes(event.eventId)) return state;
  const outcomes = [...new Set([...state.outcomes, event.outcome])];
  const conflicting = outcomes.includes('succeeded') && outcomes.includes('failed');
  const status = conflicting ? 'reconciliation_required' : outcomes.includes('succeeded') ? 'succeeded' : outcomes.includes('failed') ? 'failed' : 'pending';
  return { ...state, status, seen: [...state.seen, event.eventId], outcomes };
}
