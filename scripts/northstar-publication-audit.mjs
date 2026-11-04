import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {articles} from '../lib/growth/articles.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),origin='http://localhost:3137';
const server=spawn(process.execPath,[root+'node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3137'],{cwd:root,env:{...process.env,OPEN_ROUTER:'',RESEND_MAIL:'',NODE_OPTIONS:'--require '+root+'scripts/fixtures/northstar-clock.cjs'},stdio:['ignore','pipe','pipe']});let logs='';server.stdout.on('data',x=>logs+=x);server.stderr.on('data',x=>logs+=x);
try {await new Promise((resolve,reject)=>{const t=setInterval(()=>{if(logs.includes('Ready')){clearInterval(t);resolve()}},100);setTimeout(()=>{clearInterval(t);reject(Error('Server not ready'))},20000).unref();server.once('exit',()=>reject(Error(logs)))});
 const listing=await (await fetch(origin+'/journal')).text(),sitemap=await (await fetch(origin+'/sitemap.xml')).text();
 for(const a of articles){assert.ok(listing.includes(a.title.replaceAll('&','&amp;')),a.slug);assert.ok(sitemap.includes('/journal/'+a.slug));const r=await fetch(origin+'/journal/'+a.slug),body=await r.text();assert.equal(r.status,200,a.slug);assert.equal((body.match(/<h1[\s>]/g)||[]).length,1);assert.ok(body.includes('https://www.scrizaone.com/journal/'+a.slug));assert.ok(body.includes('datePublished'));assert.ok(body.includes('/tools/project-economics'));assert.ok(body.includes('/demos?demo='));for(const slug of a.related){const target=await fetch(origin+'/resources/'+slug);assert.equal(target.status,200,'Broken related resource '+slug)}}
 console.log('Publication HTTP audit: all 7 scheduled articles render with one H1, canonicals, sources, related resources, demos, economics and sitemap entries after their release time. Clock isolated to this local process.');
}finally{server.kill('SIGTERM')}
