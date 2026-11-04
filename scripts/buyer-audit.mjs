// Local built-site audit with isolated provider mocks: no real email/model requests.
import {spawn} from 'node:child_process';import {readFile,writeFile} from 'node:fs/promises';import {fileURLToPath} from 'node:url';import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url)),origin='http://localhost:3136';
const server=spawn(process.execPath,[root+'node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3136'],{cwd:root,env:{...process.env,VERCEL:'',OPEN_ROUTER:'qa-only-not-a-real-key',RESEND_MAIL:'qa-only-not-a-real-key',RIZA_SESSION_SECRET:'qa-only-local-session-secret',NODE_OPTIONS:'--require '+root+'scripts/fixtures/buyer-providers.cjs'},stdio:['ignore','pipe','pipe']});let output='';server.stdout.on('data',x=>output+=x);server.stderr.on('data',x=>output+=x);const checks=[];
try{
 await new Promise((resolve,reject)=>{const start=Date.now();const t=setInterval(()=>{if(output.includes('Ready')){clearInterval(t);resolve()}else if(Date.now()-start>20000){clearInterval(t);reject(Error('Local server failed to become ready'))}},100);server.on('exit',code=>{clearInterval(t);reject(Error('Server exited '+code))})});
 const before=JSON.parse(await readFile(root+'docs/buyer/BASELINE.json','utf8')).routes;
 const now=JSON.parse(await readFile(root+'.next/prerender-manifest.json','utf8')).routes;
 for(const path of before)assert.ok(path in now||path==='/sitemap.xml','Existing route removed: '+path);
 const htmlPaths=[...Object.keys(now).filter(p=>!p.includes('.')&&!p.includes('/opengraph-image')), '/journal'];
 for(const path of htmlPaths){const r=await fetch(origin+path),body=await r.text();assert.equal(r.status,200,path);assert.equal((body.match(/<h1[\s>]/g)||[]).length,1,path);const canonical=body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];assert.equal(canonical,'https://www.scrizaone.com'+(path==='/'?'':path),path);assert.ok(!body.includes('Edu2All'),path);checks.push({path,status:r.status,canonical});if(path==='/meeting-prep'){assert.match(r.headers.get('x-robots-tag')||'',/noindex/);assert.ok(!body.includes('INTERNAL_QA_REQUIREMENTS'));} }
 const {articles,publishedArticles}=await import('../lib/growth/articles.mjs');const due=publishedArticles();for(const a of articles.filter(a=>!due.includes(a))){const r=await fetch(origin+'/journal/'+a.slug);assert.equal(r.status,404,'Future article exposed: '+a.slug);assert.ok(!(await r.text()).includes(a.intro));}
 const sm=await (await fetch(origin+'/sitemap.xml')).text();assert.ok(!sm.includes('/meeting-prep'));assert.ok(sm.includes('/demos'));assert.ok(sm.includes('/services/organic-growth'));
 for(const a of articles)assert.equal(sm.includes('/journal/'+a.slug),due.includes(a),'Publication/sitemap mismatch');
 const robots=await (await fetch(origin+'/robots.txt')).text();assert.ok(robots.includes('Disallow: /meeting-prep'));for(const agent of ['GPTBot','OAI-SearchBot','ClaudeBot','Claude-SearchBot'])assert.ok(robots.includes(agent));
 const base={'Origin':origin,'Content-Type':'application/json'};
 async function session(){const r=await fetch(origin+'/api/riza/session',{method:'POST',headers:base,body:'{}'});if(!r.ok)throw Error('Session rejected '+r.status+' '+await r.text());const d=await r.json();return {...base,Cookie:r.headers.getSetCookie().map(x=>x.split(';')[0]).join('; '),'X-Riza-CSRF':d.csrf}}
 const h=await session(),bad=await fetch(origin+'/api/riza/chat',{method:'POST',headers:{...h,Origin:'https://evil.example'},body:'{}'});assert.equal(bad.status,403);
 const noCsrf=await fetch(origin+'/api/riza/chat',{method:'POST',headers:base,body:'{}'});assert.equal(noCsrf.status,403);
 const chat=await fetch(origin+'/api/riza/chat',{method:'POST',headers:h,body:JSON.stringify({messages:[{role:'user',content:'I need a service request workflow'}]})});assert.equal(chat.status,200);assert.match((await chat.json()).reply,/demos\?demo=software/);
 const h2=await session();await new Promise(r=>setTimeout(r,8500));
 const lead={name:'Internal QA',email:'qa@example.com',country:'UAE',service:'Custom software & SaaS',requirements:'INTERNAL_QA_REQUIREMENTS — reviewed local brief with operator approval.',timeline:'Validate the workflow first',consent:true,submittedAt:new Date().toISOString(),demo:'software'};
 const send=async(headers,data)=>fetch(origin+'/api/riza/enquiry',{method:'POST',headers,body:JSON.stringify(data)});
 const invalid=await send(h,{...lead,consent:false});assert.equal(invalid.status,400);
 const accepted=await send(h,lead);assert.equal(accepted.status,200);const receipt=await accepted.json();assert.equal(receipt.meetingStatus,'not_requested');assert.equal(receipt.emailId,'qa-accepted-not-delivered');
 const retry=await send(h,lead);assert.equal(retry.status,200);
 const failed=await send(h2,{...lead,requirements:lead.requirements+' [FAIL_MAIL]'});assert.equal(failed.status,503);const error=await failed.json();assert.equal(error.code,'MAIL_REJECTED');assert.ok(!('emailId' in error));
 // Re-read public HTML after submitting a brief: no server-side buyer store or output.
 assert.ok(!(await (await fetch(origin+'/meeting-prep')).text()).includes('INTERNAL_QA_REQUIREMENTS'));
 const report={passed:true,htmlRoutes:checks.length,retainedPrerenderedRoutes:before.length,checks,api:['origin/CSRF rejection','grounded-link model mock','explicit consent','optional-slot accepted email','idempotent retry','rejected email never returns success','no brief in public HTML'],limitations:['Provider transports mocked; no real message sent','Browser visual/focus/navigation checks are separate','Local HTTP checks do not prove search indexing or provider delivery']};
 await writeFile(root+'../qa/buyer-local-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,htmlRoutes:checks.length,retainedPrerenderedRoutes:before.length,apiChecks:report.api.length}));
}finally{server.kill('SIGTERM')}
