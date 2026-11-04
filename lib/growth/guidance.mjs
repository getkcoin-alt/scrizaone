export const TOPICS = {
 fintech: { text: 'Let’s make the payment flow concrete. Try a delayed confirmation and see what finance needs next.', href: '/demos?demo=fintech', label: 'Try payment operations', question: 'Help me scope a payment integration, including provider access and reconciliation.' },
 ai: { text: 'Could this save your team time? Test a workflow with human review, then calculate the assumptions.', href: '/demos?demo=ai', label: 'Try the AI workflow', question: 'Help me choose one AI automation workflow and define what a person must approve.' },
 software: { text: 'Let’s turn the idea into one useful workflow. Try the customer and operator journey first.', href: '/demos?demo=software', label: 'Try a software workflow', question: 'Help me turn my idea into a small, testable software scope.' },
 economics: { text: 'Let’s put numbers behind the decision. Change the assumptions and see the running costs as well as the build.', href: '/tools/project-economics', label: 'Explore project economics', question: 'Which assumptions should I validate before budgeting for this project?' },
 scope: { text: 'I can help turn this research into a short brief: your market, current process, integrations and first useful milestone.', href: '/tools/payment-readiness', label: 'Make my project brief', question: 'Help me use this market research to prepare a project brief.' },
};
export function pageTopic(path='') { return /fintech|payment|mpesa|pix|banking/.test(path)?'fintech':/ai-automation|document-automation|ai-workflow/.test(path)?'ai':/cost|economics|buy-or-build/.test(path)?'economics':/research/.test(path)?'scope':'software'; }
export function referralGroup(referrer='', origin='') { try { const u=new URL(referrer); if(u.origin===origin)return 'internal'; const h=u.hostname; if(/(^|\.)(google\.(?:com|co\.uk|co\.in|com\.br|com\.au|co\.ke|com\.ng|ae|com\.sa|de|fr|ca)|bing\.com|duckduckgo\.com)$/.test(h))return 'search'; if(/(^|\.)(chatgpt\.com|claude\.ai|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com)$/.test(h))return 'ai_referral'; return 'other_referral'; }catch{return 'unknown';} }
export function mayNudge({enabled,visible,editing,open,pageCount,sessionCount,lastAt,now}) { return enabled && visible && !editing && !open && pageCount<2 && sessionCount<5 && now-lastAt>=60000; }
export function flightFrames(dx,dy) { // A damped approach: a small overshoot, then settle. Only on an explicit tour action.
 return [{transform:'translate(0,0)'},{transform:`translate(${dx*.72}px,${dy*1.04}px)`,offset:.65},{transform:`translate(${dx}px,${dy}px)`}];
}
