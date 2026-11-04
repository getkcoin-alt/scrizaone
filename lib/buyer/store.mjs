// Browser-memory handoff only. Explicit tab saving uses sessionStorage, never URLs or analytics.
let memory=null;let saved=false;const KEY='scriza_buyer_brief_v1';
export function loadBuyer(){if(memory)return memory;if(typeof window==='undefined')return null;try{const raw=sessionStorage.getItem(KEY);if(raw){const x=JSON.parse(raw);if(x&&x.version===1&&typeof x.text==='string'&&x.text.length<=16000){memory=x;saved=true;return x}}}catch{}return null;}
export function saveBuyer(value,persist=false){memory={...value,version:1};saved=persist;if(typeof window!=='undefined'){try{if(persist)sessionStorage.setItem(KEY,JSON.stringify(memory));else sessionStorage.removeItem(KEY)}catch{}window.dispatchEvent(new Event('scriza-buyer-change'));}return memory;}
export function deleteBuyer(){memory=null;saved=false;if(typeof window!=='undefined'){try{sessionStorage.removeItem(KEY)}catch{}window.dispatchEvent(new Event('scriza-buyer-change'));}}
export const buyerSaved=()=>saved;
export function openBuyerEnquiry(){if(typeof window!=='undefined')window.dispatchEvent(new Event('scriza-open-enquiry'));}
export function downloadBrief(text){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='scrizaone-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
