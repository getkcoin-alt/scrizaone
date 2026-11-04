import Shell from '@/components/Shell';
import MeetingPrep from '@/components/buyer/MeetingPrep';
export const metadata={title:'Your Local Meeting Preparation',description:'Review a browser-local project brief and plan a useful discovery conversation.',robots:{index:false,follow:false},alternates:{canonical:'/meeting-prep'}};
export default function Prep(){return <Shell><section className="hero hero-sm"><div className="wrap"><p className="eyebrow">Private to this browser · no public share link</p><h1>A better brief.<br/>A more useful conversation.</h1><p className="lede">Review what you want to solve, the sample you want to discuss and the questions that need an honest answer.</p></div></section><section className="section"><div className="wrap"><MeetingPrep/></div></section></Shell>}
