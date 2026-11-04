// Read-only production smoke audit. A passing check does not establish indexing.
import { writeFile } from 'node:fs/promises';
const origin=process.argv.find(a=>a.startsWith('--origin='))?.slice(9)||'https://www.scrizaone.com';
const output=process.argv.find(a=>a.startsWith('--output='))?.slice(9);
const checks=[];
for(const path of ['/','/research','/resources','/tools/payment-readiness','/company','/privacy','/robots.txt','/sitemap.xml','/llms.txt','/research/markets.json','/opengraph-image']){
 try {
  const start=Date.now(), response=await fetch(origin+path,{signal:AbortSignal.timeout(15000)}),type=response.headers.get('content-type')||'';
  const text=type.includes('image')?'':await response.text();
  const canonical=text.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  const check={path,status:response.status,finalUrl:response.url,elapsedMs:Date.now()-start,noindexHeader:response.headers.get('x-robots-tag'),canonical,ok:response.status===200};
  if(type.includes('text/html')){check.ok=check.ok&&canonical===origin+(path==='/'?'':path)&&!check.noindexHeader?.includes('noindex');check.h1Count=(text.match(/<h1[\s>]/g)||[]).length;check.ok=check.ok&&check.h1Count===1}
  if(path==='/sitemap.xml'){check.urlCount=(text.match(/<loc>/g)||[]).length;check.ok=check.ok&&check.urlCount>=45&&!text.includes('https://scrizaone.com')}
  if(path==='/robots.txt'){check.ok=check.ok&&text.includes('OAI-SearchBot')&&text.includes(origin+'/sitemap.xml')}
  if(path==='/research/markets.json'){check.countryCount=JSON.parse(text).countries?.length;check.ok=check.ok&&check.countryCount===20}
  checks.push(check);
 }catch(e){checks.push({path,ok:false,error:e.message})}
}
const report={observedAt:new Date().toISOString(),origin,checks,passed:checks.every(c=>c.ok),indexing:'Not established by HTTP/canonical checks',metrics:'Search/traffic/leads/revenue require authorized data, not this smoke audit'};
if(output)await writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
