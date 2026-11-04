export const RIZA_GREETING = "Hi, I’m Riza, ScrizaOne’s AI assistant. What are you looking to build or improve—fintech integrations, AI automation, or custom software?";
export const SERVICES = ['Fintech engineering', 'AI & automation', 'Custom software & SaaS', 'Organic growth planning', 'Not sure yet'];
export const MAX_MESSAGES = 18;
export const MAX_MESSAGE_LENGTH = 1600;
export class RizaError extends Error { constructor(message, status = 400, code = 'INVALID_REQUEST') { super(message); this.status = status; this.code = code; } }
export function cleanText(value, max, name, required = true) {
  if (typeof value !== 'string') throw new RizaError(`${name} must be text.`);
  const text = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim();
  if ((required && !text) || text.length > max) throw new RizaError(`${name} must be ${required?'1':'0'}–${max} characters.`);
  return text;
}
export function validTimezone(zone) { try { new Intl.DateTimeFormat('en',{timeZone:zone}).format(); return typeof zone === 'string' && zone.length <= 80; } catch { return false; } }
function localParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date);
  const o=Object.fromEntries(parts.map(p=>[p.type,p.value])); return `${o.year}-${o.month}-${o.day}T${o.hour}:${o.minute}`;
}
export function meetingInstant(local, timeZone, now = Date.now()) {
  if (!validTimezone(timeZone) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local || '')) throw new RizaError('Choose a valid date, time and time zone.');
  const [year,month,day,hour,minute]=local.match(/\d+/g).map(Number);
  const wall=Date.UTC(year,month-1,day,hour,minute);
  if (new Date(wall).toISOString().slice(0,16)!==local) throw new RizaError('Choose a valid calendar date and time.');
  // Collect offsets on both sides of a clock change, then round-trip candidates.
  const offsets=new Set();
  for(const delta of [-172800000,-86400000,0,86400000,172800000]) {
    const t=wall+delta, rendered=localParts(new Date(t),timeZone);
    offsets.add(Date.parse(rendered+':00Z')-t);
  }
  const candidates=[...offsets].map(o=>wall-o).filter(t=>localParts(new Date(t),timeZone)===local);
  if(candidates.length!==1) throw new RizaError('That local time is skipped or repeated by a clock change. Please choose another time.');
  const utc=candidates[0];
  if(utc<now+60*60*1000 || utc>now+90*86400000) throw new RizaError('Choose a slot at least one hour ahead and within the next 90 days.');
  return new Date(utc).toISOString();
}
export function validateMessages(input) {
  if(!Array.isArray(input)||input.length<1||input.length>MAX_MESSAGES) throw new RizaError('Please start a new chat or use the enquiry form.');
  const messages=input.map((m,i)=>{
    if(!m||m.role!==(i%2===0?'user':'assistant'))throw new RizaError('Invalid conversation order.');
    return {role:m.role,content:cleanText(m.content,MAX_MESSAGE_LENGTH,'Message')};
  });
  if(messages.at(-1).role!=='user')throw new RizaError('A new user message is required.');
  if(messages.reduce((n,m)=>n+m.content.length,0)>14000)throw new RizaError('Chat is too long. Please send the enquiry form.');
  return messages;
}
export function validateEnquiry(input, now = Date.now()) {
  if(!input||typeof input!=='object'||input.consent!==true||input.website)throw new RizaError('Please review your enquiry and agree to send it.');
  const fields={name:100,email:254,company:150,country:100,requirements:4000,timeline:200,budget:150,preferredLocal:16,timeZone:80,submittedAt:40};
  const lead={};for(const [key,max]of Object.entries(fields))lead[key]=cleanText(input[key]??'',max,key,!['company','budget','preferredLocal','timeZone'].includes(key));
  if(!/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(lead.email))throw new RizaError('Please enter a valid work email.');
  if(lead.requirements.length<20)throw new RizaError('Please describe your project in at least 20 characters.');
  if(!SERVICES.includes(input.service))throw new RizaError('Choose a service.');lead.service=input.service;
  if(input.demo&&!['fintech','software','growth'].includes(input.demo))throw new RizaError('Choose an available demonstration.');lead.demo=input.demo||'';
  const submitted=Date.parse(lead.submittedAt);if(!Number.isFinite(submitted)||submitted<now-3600000||submitted>now+300000)throw new RizaError('Please reopen the review and try again.');
  if(lead.preferredLocal){lead.meetingUtc=meetingInstant(lead.preferredLocal,lead.timeZone,now)}else{lead.timeZone='';lead.meetingUtc=null}
  lead.transcript=Array.isArray(input.transcript)?input.transcript.slice(-MAX_MESSAGES).map(m=>{
    if(!m||!['user','assistant'].includes(m.role))throw new RizaError('Invalid conversation.');return {role:m.role,content:cleanText(m.content,MAX_MESSAGE_LENGTH,'Chat message')};
  }):[];
  if(lead.transcript.reduce((n,m)=>n+m.content.length,0)>14000)throw new RizaError('Chat is too long to send.');
  return lead;
}
