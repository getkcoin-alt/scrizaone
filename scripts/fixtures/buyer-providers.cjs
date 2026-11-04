// Isolated QA preload; never imported by application code or enabled in deployment.
const receipts=new Map();
global.fetch=async(input,options={})=>{
 const url=String(input);
 if(url==='https://openrouter.ai/api/v1/models')return Response.json({data:[{id:'nvidia/nemotron-3-ultra-550b-a55b:free',pricing:{prompt:'0',completion:'0'}}]});
 if(url==='https://openrouter.ai/api/v1/chat/completions'){const b=JSON.parse(options.body);if(b.provider.max_price.prompt!==0||b.provider.max_price.completion!==0)throw Error('Nonfree request');return Response.json({model:b.model,choices:[{message:{content:'Which operational decision needs human approval? You can try the sample at /demos?demo=software.'}}]})}
 if(url==='https://api.resend.com/emails'){
  const b=JSON.parse(options.body),key=options.headers['Idempotency-Key'];
  if(JSON.stringify(b.to)!=='["sales@scriza.in"]'||JSON.stringify(b.cc)!=='["karnveer@scriza.in","laxman@scriza.in"]')throw Error('Recipient regression');
  if(b.text.includes('[FAIL_MAIL]'))return Response.json({message:'The sender domain is not verified'},{status:403});
  if(receipts.has(key)&&receipts.get(key)!==options.body)return Response.json({message:'Payload mismatch'},{status:409});receipts.set(key,options.body);return Response.json({id:'qa-accepted-not-delivered'});
 }
 throw Error('QA outbound request blocked');
};
