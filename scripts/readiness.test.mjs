import test from 'node:test';
import assert from 'node:assert/strict';
import { readinessQuestions, readinessResult, readinessBrief } from '../lib/readiness.js';
test('unknown, false and missing answers never count as confirmed',()=>{assert.equal(readinessResult({}).confirmed,0);assert.equal(readinessResult(Object.fromEntries(readinessQuestions.map(q=>[q.id,'no']))).unresolved.length,8)});
test('all confirmed answers still require provider validation, not certification',()=>{const a=Object.fromEntries(readinessQuestions.map(q=>[q.id,'yes']));assert.match(readinessResult(a).summary,/validation still required/);assert.equal(readinessResult(a).unresolved.length,0)});
test('download has selected market, explicit unknowns and primary sources',()=>{const brief=readinessBrief({country:'Kenya',infrastructure:['M-PESA'],sources:[{title:'Safaricom',url:'https://daraja.safaricom.co.ke/apis'}]},{});assert.match(brief,/Country: Kenya/);assert.match(brief,/\[UNKNOWN\]/);assert.match(brief,/not certification/);assert.match(brief,/https:\/\/daraja/)});
