import Link from "next/link";
import Shell from "@/components/Shell";
import { caseStudies } from "@/lib/case-studies";
import { SITE_URL } from "@/lib/site";

const title = "Software Engineering Case Studies";
const description =
  "See how bill payment APIs, AI enquiry intake, travel booking enquiries, HR payroll, hostel admissions and fleet billing were built, with original project sources.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/case-studies" },
  openGraph: { title, description, url: "/case-studies", type: "website" },
};

export default function CaseStudiesPage() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: `${SITE_URL}/case-studies`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: caseStudies.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: study.title,
        url: `${SITE_URL}/case-studies/${study.slug}`,
      })),
    },
  };

  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <header className="hero hero-sm">
        <div className="wrap">
          <nav className="crumbs small" aria-label="Breadcrumb"><Link href="/">Home</Link> / Case studies</nav>
          <h1>{title}</h1>
          <p className="lede">
            Compare real workflows before choosing what to build. Explore projects from Scriza and
            independent work by Karnveer Singh, with original sources and questions to use in your own brief.
          </p>
        </div>
      </header>
      <section className="section" aria-labelledby="case-study-projects">
        <div className="wrap">
          <h2 id="case-study-projects">Find a project like yours</h2>
          <div className="grid-3 resource-grid">
            {caseStudies.map((study) => (
              <Link key={study.slug} className="card link-card" href={`/case-studies/${study.slug}`}>
                <p className="eyebrow">{study.category}</p>
                <h3>{study.title}</h3>
                <p>{study.summary}</p>
                <p className="small muted">{study.credit}</p>
                <span className="more">Read the case study →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
