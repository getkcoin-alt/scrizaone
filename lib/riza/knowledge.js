import {bookingUrl} from '../buyer/booking.mjs';
import { guides } from '../guides';
import { company, services } from '../site';
import { serviceContent } from '../service-content';
export const rizaKnowledge={
 brand:company.brand,legalName:company.legalName,headquarters:company.hq.city+', India',indiaWebsite:company.indiaSite,contact:company.email,
 hours:company.hours,replyRule:company.replyRule,
 services:services.map(s=>({name:s.name,description:s.short,capabilities:serviceContent[s.slug].capabilities.map(c=>c.h),path:'/services/'+s.slug})),
 commercialTerms:'Free discovery and written estimate. Projects scoped by milestones; no fixed public prices. IP assignment and NDA terms are discussed in the contract.',
 evidence:'ScrizaPay is a company-reported India-market bill-payment platform. Do not claim delivered FedNow, PayTo, Aani, M-PESA or other foreign integrations without project evidence.',
 certifications:company.iso.map(c=>c.standard),certificationScope:company.isoScope,
 resources:guides.map(g=>({title:g.title,answer:g.intro,path:'/resources/'+g.slug})),
 tools:[{path:'/tools/payment-readiness',use:'Browser-local editable brief with transparent buy/build/improve/postpone rules'},{path:'/demos',use:'Synthetic payment, service-request and editorial workflows with failure cases'},{path:'/meeting-prep',use:'Local brief and agenda, not a public shared workspace'}],
 growthScope:'Company-published SEO/content marketing supports a scoped organic-growth planning discussion. No paid promotion, guaranteed rankings or claims of international marketing results. See /services/organic-growth.',
 booking:bookingUrl(process.env.NEXT_PUBLIC_BOOKING_URL)?'The website links to the approved Google booking page. The visitor completes booking there and Google confirms it. An enquiry preferred slot does not reserve a time. Never claim a booking yourself.':'Demo requests are sent to the sales team after visitor review. No live calendar, availability guarantee or automatic booking is connected.'
};
