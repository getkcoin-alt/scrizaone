import { verifyRequest, readJson, limitRequest, apiError } from '@/lib/riza/security.mjs';
import { validateMessages } from '@/lib/riza/shared.mjs';
import { getRizaAnswer } from '@/lib/riza/chat.mjs';
import { rizaKnowledge } from '@/lib/riza/knowledge';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=45;
export async function POST(request){try{const session=verifyRequest(request);limitRequest(request,'chat',session);const input=await readJson(request);const messages=validateMessages(input.messages);const result=await getRizaAnswer(messages,rizaKnowledge);return Response.json(result,{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}})}catch(e){return apiError(e)}}
