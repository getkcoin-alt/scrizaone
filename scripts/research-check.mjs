import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const data=JSON.parse(await readFile(new URL('../public/research/markets.json',import.meta.url),'utf8'));
assert.equal(data.countries.length,20);assert.equal(new Set(data.countries.map(c=>c.code)).size,20);
for(const c of data.countries){assert.ok(c.sources.length>=1,c.code);assert.equal(c.searchVolume,null);assert.equal(c.competitionLevel,null);assert.equal(c.marketSize,null);assert.ok(c.aiOpportunityHypothesis&&c.customSoftwareHypothesis&&c.searchEvidence);for(const s of c.sources){assert.equal(new URL(s.url).protocol,'https:');assert.equal(s.accessed,'2026-11-04')}}
assert.ok(data.methodology.includes('provisional'));console.log('Research checks: 20 unique markets; sources, dates and explicit unknown demand fields present.');
