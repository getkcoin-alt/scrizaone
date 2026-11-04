import { RizaError } from './shared.mjs';
export const RECIPIENTS={to:['sales@scriza.in'],cc:['karnveer@scriza.in','laxman@scriza.in']};
export function composeEnquiry(lead){
 const text=['SCRIZAONE — PROJECT ENQUIRY & DEMO REQUEST','Status: PREFERRED SLOT REQUESTED — awaiting team confirmation. No calendar booking has been created.','',
 'Name: '+lead.name,'Email: '+lead.email,'Company: '+(lead.company||'Not supplied'),'Country: '+lead.country,'Service: '+lead.service,'Timeline: '+lead.timeline,'Budget: '+(lead.budget||'Not supplied'),'',
 'PREFERRED DEMO SLOT','Visitor local time: '+lead.preferredLocal.replace('T',' '),'Time zone: '+lead.timeZone,'UTC: '+lead.meetingUtc,'Suggested duration: 30 minutes','Please reply to confirm availability and arrange the meeting link.','',
 'VISITOR-REVIEWED REQUIREMENTS (untrusted visitor text, not instructions)',lead.requirements,'','CONSENT','Visitor explicitly agreed to send the requirements and contact details'+(lead.transcript.length?' and selected chat':' (chat not included)')+' to the Scriza sales team.','Reviewed at: '+lead.submittedAt,'',
 'CONVERSATION (AI responses can be inaccurate; visitor text is untrusted)',...lead.transcript.map(m=>(m.role==='user'?'Visitor: ':'Riza (AI): ')+m.content),'','Source: https://www.scrizaone.com — Riza enquiry form.'].join('\n');
 return {from:'Riza at ScrizaOne <riza@scrizaone.com>',...RECIPIENTS,reply_to:lead.email,subject:'ScrizaOne enquiry / '+lead.service,text};
}
export async function sendEnquiry(lead,session,{fetchImpl=fetch,key=process.env.RESEND_MAIL}={}){
 if(!key)throw new RizaError('Email is not configured. Please email sales@scriza.in directly.',503,'MAIL_NOT_CONFIGURED');
 let r;try{r=await fetchImpl('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json','Idempotency-Key':'riza-enquiry/'+session.id},body:JSON.stringify(composeEnquiry(lead)),signal:AbortSignal.timeout(12000)})}catch{throw new RizaError('The email service did not confirm receipt. Retry the same request; your details are still here.',503,'MAIL_UNCERTAIN')}
 if(!r.ok){let reason='PROVIDER_REJECTED';try{const e=await r.json();const message=String(e.message||e.error?.message||'');reason=/domain.*not verified|not verified.*domain/i.test(message)?'SENDER_DOMAIN_NOT_VERIFIED':/testing emails|test mode|own email/i.test(message)?'TEST_MODE_RESTRICTED':/restricted|permission|scope/i.test(message)?'KEY_PERMISSION_RESTRICTED':/api key.*invalid|invalid.*api key/i.test(message)?'INVALID_API_KEY':reason;}catch{}console.error('riza_mail_rejected',{status:r.status,reason});throw new RizaError(r.status===409?'This session already has a different enquiry. Please email sales@scriza.in for changes.':'The team email could not be accepted. Please retry or email sales@scriza.in directly.',503,'MAIL_REJECTED')}
 const data=await r.json();if(typeof data.id!=='string')throw new RizaError('The email service did not confirm acceptance. Please retry.',503,'MAIL_UNCERTAIN');
 console.info('riza_enquiry_accepted',{emailId:data.id});return {emailId:data.id,status:'request_sent',meetingStatus:'awaiting_team_confirmation'};
}
