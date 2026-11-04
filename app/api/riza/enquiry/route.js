import { verifyRequest, readJson, limitRequest, apiError } from '@/lib/riza/security.mjs';
import { validateEnquiry, RizaError } from '@/lib/riza/shared.mjs';
import { sendEnquiry } from '@/lib/riza/mail.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=20;
export async function POST(request){try{const session=verifyRequest(request);limitRequest(request,'enquiry',session);if(Date.now()-session.issued<8000)throw new RizaError('Please review your details before sending.');const lead=validateEnquiry(await readJson(request));const receipt=await sendEnquiry(lead,session);return Response.json(receipt,{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}})}catch(e){return apiError(e)}}
