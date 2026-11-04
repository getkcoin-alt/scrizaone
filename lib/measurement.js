// No free text, form values, search terms or full URLs are accepted by this API.
export const eventNames = ['contact_intent','enquiry_email_composed','enquiry_whatsapp_composed','planner_result_view','planner_brief_download','riza_enquiry_accepted'];
export function recordEvent(name, properties = {}) {
  if (typeof window === 'undefined' || !eventNames.includes(name)) return;
  try { if (localStorage.getItem('scriza_analytics_consent') !== 'granted') return; } catch { return; }
  if (typeof window.gtag !== 'function') return;
  const safe = {};
  if (/^[A-Z]{2}$/.test(properties.market || '')) safe.market = properties.market;
  if (['email','phone','whatsapp','contact_page'].includes(properties.channel)) safe.channel = properties.channel;
  window.gtag('event', name, safe);
}
