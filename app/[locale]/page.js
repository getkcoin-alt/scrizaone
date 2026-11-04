import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { HomeView } from "@/components/Views";
import { alternatesFor, getLocale, regionalLocales } from "@/lib/locales";

export const dynamicParams = false;

export function generateStaticParams() {
  return regionalLocales.map((l) => ({ locale: l.code }));
}

export function generateMetadata({ params }) {
  const l = getLocale(params.locale);
  if (!l || l.code === "global") return {};
  return {
    title: `Fintech, AI & Software Engineering for ${l.region}`,
    description: `Fintech and payment integrations, AI automation and custom software for companies in ${l.region}. ${l.currency.code} quotes; ${l.overlap}`,
    alternates: {
      canonical: l.path,
      languages: l.code === "eu" ? undefined : alternatesFor(""),
    },
    openGraph: { locale: l.hreflang.replace("-", "_") },
  };
}

export default function Page({ params }) {
  const l = getLocale(params.locale);
  if (!l || l.code === "global") notFound();
  return (
    <Shell locale={l.code}>
      <HomeView locale={l.code} />
    </Shell>
  );
}
