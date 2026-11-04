import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { ServiceView, faqSchema } from "@/components/Views";
import { alternatesFor } from "@/lib/locales";
import { serviceContent } from "@/lib/service-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(serviceContent).map((service) => ({ service }));
}

export function generateMetadata({ params }) {
  const s = serviceContent[params.service];
  if (!s) return {};
  const sub = `/services/${params.service}`;
  return {
    title: s.metaTitle,
    description: s.description,
    alternates: { canonical: sub, languages: alternatesFor(sub) },
  };
}

export default function Page({ params }) {
  if (!serviceContent[params.service]) notFound();
  return (
    <Shell locale="global">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(params.service)) }} />
      <ServiceView locale="global" slug={params.service} />
    </Shell>
  );
}
