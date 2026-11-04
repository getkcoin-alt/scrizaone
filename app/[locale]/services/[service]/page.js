import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { ServiceView, faqSchema } from "@/components/Views";
import { alternatesFor, getLocale, regionalLocales } from "@/lib/locales";
import { serviceContent } from "@/lib/service-content";

export const dynamicParams = false;

export function generateStaticParams() {
  const out = [];
  for (const l of regionalLocales) for (const service of Object.keys(serviceContent)) out.push({ locale: l.code, service });
  return out;
}

export function generateMetadata({ params }) {
  const l = getLocale(params.locale);
  const s = serviceContent[params.service];
  if (!l || !s) return {};
  const sub = `/services/${params.service}`;
  return {
    title: `${s.metaTitle} for ${l.region}`,
    description: `${s.description} For clients in ${l.region}: ${l.currency.code} quotes and regional requirements covered.`,
    alternates: {
      canonical: `${l.path}${sub}`,
      languages: l.code === "eu" ? undefined : alternatesFor(sub),
    },
  };
}

export default function Page({ params }) {
  const l = getLocale(params.locale);
  if (!l || l.code === "global" || !serviceContent[params.service]) notFound();
  return (
    <Shell locale={l.code}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(params.service)) }} />
      <ServiceView locale={l.code} slug={params.service} />
    </Shell>
  );
}
