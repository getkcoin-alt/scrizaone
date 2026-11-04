// Public Google appointment page only. Never pass brief/contact fields in its URL.
export function bookingUrl(value){
 if(typeof value!=='string'||!value)return null;
 try{const u=new URL(value);if(u.protocol!=='https:'||u.hostname!=='calendar.google.com'||u.port||u.username||u.password||u.search||u.hash)return null;
 if(!/^\/calendar\/(?:u\/\d+\/)?appointments\/schedules\/[A-Za-z0-9_-]+\/?$/.test(u.pathname))return null;
 return u.href;}catch{return null;}
}
