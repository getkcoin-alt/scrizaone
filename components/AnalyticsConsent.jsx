'use client';
import { useEffect, useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { recordEvent } from '@/lib/measurement';
function AnalyticsRuntime({id}) {
 const pathname=usePathname();const [consent,setConsent]=useState(null);
 useEffect(()=>{const read=()=>{try{setConsent(localStorage.getItem('scriza_analytics_consent'))}catch{setConsent('denied')}};read();window.addEventListener('scriza-consent',read);return()=>window.removeEventListener('scriza-consent',read)},[]);
 const choose=value=>{try{localStorage.setItem('scriza_analytics_consent',value)}catch{}setConsent(value)};
 useEffect(()=>{
  if(consent!=='granted')return;
  window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
  let referrer='';try{referrer=new URL(document.referrer).origin}catch{}
  const location=window.location.origin+pathname;
  window.gtag('js',new Date());
  window.gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location,page_referrer:referrer});
  let source='direct_or_unattributed';try{const h=new URL(document.referrer).hostname;if(/(^|\.)(chatgpt\.com|claude\.ai|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com)$/.test(h))source='observed_ai_referral';else if(/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com)$/.test(h))source='search_referral';else if(h!==window.location.hostname)source='other_referral';else source='internal'}catch{}
  window.gtag('event','page_view',{page_location:location,page_path:pathname,page_referrer:referrer,source_group:source});
 },[consent,id,pathname]);
 useEffect(()=>{const track=e=>{const a=e.target.closest?.('a');if(!a)return;const href=a.getAttribute('href')||'';let channel=href.startsWith('mailto:')?'email':href.startsWith('tel:')?'phone':href.startsWith('https://wa.me/')?'whatsapp':href==='/contact'?'contact_page':null;if(channel)recordEvent('contact_intent',{channel})};document.addEventListener('click',track);return()=>document.removeEventListener('click',track)},[]);
 return <>{consent==='granted'&&<Script id="scriza-ga4" strategy="afterInteractive" src={'https://www.googletagmanager.com/gtag/js?id='+id}/>} {consent===null&&<div className="consent-bar" role="region" aria-label="Optional analytics"><p>Allow optional analytics to help us understand which engineering resources are useful? No advertising features. <Link href="/privacy">Details</Link></p><button className="btn btn-sm" onClick={()=>choose('granted')}>Allow analytics</button><button className="btn btn-ghost btn-sm" onClick={()=>choose('denied')}>Decline</button></div>}</>;
}
export default function AnalyticsConsent(){const id=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;if(!/^G-[A-Z0-9]+$/.test(id||''))return null;return <Suspense fallback={null}><AnalyticsRuntime id={id}/></Suspense>}
export function AnalyticsPreferences(){const [message,setMessage]=useState('');return <div><button className="btn btn-ghost" onClick={()=>{try{localStorage.setItem('scriza_analytics_consent','denied');for(const part of document.cookie.split(';')){const name=part.trim().split('=')[0];if(/^_ga($|_)/.test(name)){for(const domain of ['',window.location.hostname,'.scrizaone.com'])document.cookie=name+'=; Max-Age=0; Path=/'+(domain?'; Domain='+domain:'')}}window.dispatchEvent(new Event('scriza-consent'));setMessage('Analytics consent withdrawn. Reloading to unload optional analytics.');window.location.reload()}catch{setMessage('Browser storage is unavailable. Optional analytics remains off unless you previously allowed it.')}}}>Withdraw analytics consent</button><p role="status">{message}</p></div>}
