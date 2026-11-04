import Shell from '@/components/Shell';
import PaymentPlanner from '@/components/PaymentPlanner';
import { markets } from '@/lib/market-data';
export const metadata={title:'Free Payment Integration Planning Tool',description:'Create a country-aware payment integration brief covering provider access, permissions, event handling, reconciliation and operations. No signup required.',alternates:{canonical:'/tools/payment-readiness'}};
export default function Page(){return <Shell><section className="hero hero-sm"><div className="wrap"><p className="eyebrow">Free engineering tool</p><h1>Know what to resolve<br/>before integrating payments.</h1><p className="lede">Choose a market, identify unanswered planning questions, and download a brief for your engineering team and payment provider. No invented price range, compliance score or network-access promise.</p></div></section><section className="section"><div className="wrap"><PaymentPlanner markets={markets}/></div></section></Shell>}
