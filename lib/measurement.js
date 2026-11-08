// No free text, form values, search terms or full URLs are accepted by this API.
export const eventNames = ['riza_guidance_enabled','riza_guidance_shown','riza_guidance_followed','riza_guidance_dismissed','economics_exported','economics_enquiry_reviewed','contact_intent','enquiry_email_composed','enquiry_whatsapp_composed','planner_result_view','planner_brief_download','riza_enquiry_accepted','buyer_planner_started','buyer_planner_completed','buyer_demo_started','buyer_demo_completed','buyer_demo_failure_explored','buyer_brief_exported','buyer_enquiry_reviewed','calendar_booking_opened','site_check_run','site_check_completed','site_check_report_exported','site_check_help_requested'];
export function recordEvent(name, properties = {}) {
  if (typeof window === 'undefined' || !eventNames.includes(name)) return;
  try { if (localStorage.getItem('scriza_analytics_consent') !== 'granted') return; } catch { return; }
  if (typeof window.gtag !== 'function') return;
  const safe = {};
  if (/^[A-Z]{2}$/.test(properties.market || '')) safe.market = properties.market;
  if (['email','phone','whatsapp','contact_page'].includes(properties.channel)) safe.channel = properties.channel;
  if (['fintech','ai','software','economics','scope'].includes(properties.topic)) safe.topic = properties.topic;
  window.gtag('event', name, safe);
}
