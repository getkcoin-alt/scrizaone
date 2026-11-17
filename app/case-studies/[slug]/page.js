import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { caseStudies, caseStudiesPublishedDate } from "@/lib/case-studies";
import { serviceContent } from "@/lib/service-content";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }) {
  const study = caseStudies.find(({ slug }) => slug === params.slug);
  if (!study) return {};

  const path = `/case-studies/${study.slug}`;
  return {
    title: `${study.title} Case Study`,
    description: study.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: study.title,
      description: study.summary,
      url: path,
      publishedTime: caseStudiesPublishedDate,
    },
  };
}

export default function CaseStudyPage({ params }) {
  const study = caseStudies.find(({ slug }) => slug === params.slug);
  if (!study) notFound();

  const url = `${SITE_URL}/case-studies/${study.slug}`;
  const breadcrumbs = [
    { name: "Home", item: SITE_URL },
    { name: "Case studies", item: `${SITE_URL}/case-studies` },
    { name: study.title, item: url },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: study.title,
        description: study.summary,
        articleSection: study.category,
        mainEntityOfPage: url,
        datePublished: caseStudiesPublishedDate,
        inLanguage: "en",
        publisher: { "@id": "https://www.scriza.in/#organization" },
        citation: study.sources.map(({ url }) => url),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          ...item,
        })),
      },
    ],
  };

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article>
        <header className="hero hero-sm">
          <div className="wrap">
            <nav className="crumbs small" aria-label="Breadcrumb">
              <Link href="/">Home</Link> / <Link href="/case-studies">Case studies</Link> / {study.category}
            </nav>
            <h1>{study.title}</h1>
            <p className="lede">{study.summary}</p>
            <p className="small muted">{study.credit} · Published <time dateTime={caseStudiesPublishedDate}>17 November 2026</time></p>
          </div>
        </header>
        <div className="section">
          <div className="wrap article-layout">
            <aside className="article-toc">
              <nav aria-label="Case study sections">
                <a href="#delivery">What was built</a>
                <a href="#evidence">Project evidence</a>
                <a href="#buyer-questions">Buyer questions</a>
              </nav>
              <Link className="more" href="/case-studies">All case studies →</Link>
            </aside>
            <div className="article-body">
              <section id="delivery">
                <h2>What was built</h2>
                <p>{study.context}</p>
                <ul>{study.delivered.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <section id="evidence">
                <h2>Project evidence</h2>
                <p>{study.evidence}</p>
                <ul className="source-list">
                  {study.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url}>{source.label} ↗</a>
                      <span>{source.supports}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section id="buyer-questions">
                <h2>Questions to ask about your project</h2>
                {study.questions.map(({ question, answer }) => (
                  <div key={question}>
                    <h3>{question}</h3>
                    <p>{answer}</p>
                  </div>
                ))}
              </section>
              <section>
                <h2>Plan a similar workflow</h2>
                <ul>
                  <li><Link href={study.next.href}>{study.next.label}</Link></li>
                  {study.services.map((slug) => (
                    <li key={slug}><Link href={`/services/${slug}`}>{serviceContent[slug]?.title ?? "Organic growth planning"}</Link></li>
                  ))}
                </ul>
                <Link className="btn" href="/contact">Discuss your project</Link>
              </section>
            </div>
          </div>
        </div>
      </article>
    </Shell>
  );
}
