import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { RizaError } from './shared.mjs';
export const COOKIE_NAME='riza_session';
const limits=new Map();
function secret(){const s=process.env.RIZA_SESSION_SECRET||process.env.OPEN_ROUTER||process.env.RESEND_MAIL;if(!s)throw new RizaError('Riza is being configured. Please email sales@scriza.in.',503,'NOT_CONFIGURED');return s;}
const mac=s=>createHmac('sha256',secret()).update('scrizaone/riza/v1/'+s).digest('base64url');
export function createSession(now=Date.now()){return {id:randomUUID(),issued:now,expires:now+3600000};}
export function sealSession(session){const payload=Buffer.from(JSON.stringify(session)).toString('base64url');return payload+'.'+mac(payload);}
export function readSession(value,now=Date.now()){
 try{const [payload,sig]=String(value||'').split('.');if(!payload||!sig)return null;const a=Buffer.from(sig),b=Buffer.from(mac(payload));if(a.length!==b.length||!timingSafeEqual(a,b))return null;const s=JSON.parse(Buffer.from(payload,'base64url').toString());if(!/^[a-f0-9-]{36}$/i.test(s.id)||!Number.isFinite(s.issued)||s.issued>now||s.expires!==s.issued+3600000||s.expires<=now)return null;return s;}catch{return null;}
}
export const csrfFor=session=>mac('csrf/'+session.id);
export function sessionFromRequest(request){const raw=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE_NAME+'='))?.slice(COOKIE_NAME.length+1);return readSession(raw);}
export function verifyRequest(request,{sessionRequired=true}={}){
 const origin=request.headers.get('origin');const allowed=new Set(['https://www.scrizaone.com','https://scrizaone.com']);
 if(process.env.VERCEL_URL)allowed.add('https://'+process.env.VERCEL_URL);
 if(!process.env.VERCEL)allowed.add(new URL(request.url).origin);
 if(!origin||!allowed.has(origin)||request.headers.get('sec-fetch-site')==='cross-site')throw new RizaError('Please open Riza directly on ScrizaOne.',403,'ORIGIN_REJECTED');
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new RizaError('JSON is required.',415);
 if(sessionRequired){const session=sessionFromRequest(request);if(!session||request.headers.get('x-riza-csrf')!==csrfFor(session))throw new RizaError('Your chat session expired. Please reopen Riza.',403,'SESSION_EXPIRED');return session;}
}
export async function readJson(request,max=90000){const reader=request.body?.getReader();if(!reader)throw new RizaError('Request body required.');const decoder=new TextDecoder();let size=0,text='';while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new RizaError('Please shorten the request.',413)}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();try{return JSON.parse(text)}catch{throw new RizaError('Invalid request.')}}
export function limitRequest(request,kind,session){
 // Best-effort per-instance guard, not a durable/global quota. Pair with platform WAF at scale.
 const ip=request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-forwarded-for')||'local';const identity=mac('rate/'+ip.split(',')[0].trim());const now=Date.now();
 const configs=kind==='chat'?[[identity+'/chat',30,3600000],[session.id+'/chat',12,3600000]]:kind==='enquiry'?[[identity+'/lead',4,3600000],[session.id+'/lead',5,3600000]]:[[identity+'/session',12,3600000]];
 for(const [key,max,windowMs]of configs){let bucket=limits.get(key);if(!bucket||bucket.until<=now){bucket={count:0,until:now+windowMs};limits.set(key,bucket)}if(bucket.count>=max)throw new RizaError('Too many requests. Please try later or email sales@scriza.in.',429,'RATE_LIMITED');bucket.count++;}
 if(limits.size>5000)for(const [k,v]of limits){if(v.until<=now||limits.size>6000)limits.delete(k)}
}
export function apiError(error){const known=error instanceof RizaError;if(!known)console.error('riza_request_failed',{code:'INTERNAL_ERROR'});return Response.json({error:known?error.message:'Riza could not complete that request. Please try again or email sales@scriza.in.',code:known?error.code:'INTERNAL_ERROR'},{status:known?error.status:500,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});}
