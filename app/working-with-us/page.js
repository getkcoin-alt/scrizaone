import Link from "next/link";
import Shell from "@/components/Shell";
import { CtaBand } from "@/components/Views";
import { company } from "@/lib/site";
import { localeList } from "@/lib/locales";

export const metadata = {
  title: "Working with Scriza from Anywhere",
  description:
    "How international clients work with Scriza: who you contract with, team hours and time-zone overlap by region, quote currencies, IP and confidentiality, and how projects run.",
  alternates: { canonical: "/working-with-us" },
};

export default function Page() {
  return (
    <Shell locale="global">
      <section className="hero hero-sm">
        <div className="wrap">
          <h1>Working with Scriza from anywhere</h1>
          <p className="lede">
            Everything an international buyer needs to know before engaging us: who you contract with, when we are available, how
            quotes work, and how projects run.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Who you contract with</h2>
            <p>
              Your contract is with <strong>{company.legalName}</strong>, a private limited company incorporated in India (CIN{" "}
              {company.cin}). We export software services under DGFT Importer Exporter Code {company.iec}. Engineering is delivered
              remotely by our team in India. Both company addresses are in India; we do not claim offices elsewhere.
            </p>
            <h2>IP and confidentiality</h2>
            <p>
              Intellectual property in the work we build for you is assigned to you under the contract. We sign an NDA before detailed
              discussions if you prefer.
            </p>
            <h2>Security and quality</h2>
            <p>
              {company.iso.map((i) => `${i.standard} (${i.system}, ${i.number})`).join("; ")}, valid {company.isoValidity}. The certified
              scope is <em>{company.isoScope}</em>. The certificates do not cover every product or service, and we say so in proposals.
            </p>
          </div>
          <div>
            <h2>Team hours</h2>
            <ul className="ticks">
              <li>{company.hours.india}</li>
              <li>{company.hours.pacific}</li>
            </ul>
            <p>{company.replyRule}</p>
            <h3>Overlap by region</h3>
            <table className="table">
              <thead><tr><th>Region</th><th>Overlap with your working day</th><th>Quotes in</th></tr></thead>
              <tbody>
                {localeList.filter((l) => l.code !== "global").map((l) => (
                  <tr key={l.code}>
                    <td><Link href={l.path}>{l.name}</Link></td>
                    <td>{l.overlap}</td>
                    <td>{l.currency.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <h2>How a project runs</h2>
          <ol className="steps">
            <li>Free discovery call and a written estimate, by milestone, in your currency.</li>
            <li>Contract, NDA and kickoff: a project lead, a shared backlog and agreed communication channels.</li>
            <li>Sprints with regular demos inside our overlap with your hours, plus written updates.</li>
            <li>QA, deployment, handover documentation and an agreed support period.</li>
          </ol>
          <p className="small muted">Clients in India: please visit <a href={company.indiaSite} hrefLang="en-IN">scriza.in</a>.</p>
        </div>
      </section>
      <CtaBand />
    </Shell>
  );
}
