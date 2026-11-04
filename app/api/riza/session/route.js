import { COOKIE_NAME, createSession, sealSession, sessionFromRequest, csrfFor, verifyRequest, limitRequest, apiError } from '@/lib/riza/security.mjs';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request){try{verifyRequest(request,{sessionRequired:false});limitRequest(request,'session');const session=sessionFromRequest(request)||createSession();const response=Response.json({csrf:csrfFor(session),expires:session.expires},{headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});response.headers.append('Set-Cookie',`${COOKIE_NAME}=${sealSession(session)}; Path=/api/riza; HttpOnly; SameSite=Strict; Max-Age=3600${process.env.NODE_ENV==='production'?'; Secure':''}`);return response;}catch(e){return apiError(e)}}
