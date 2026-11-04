import CalendarBooking from "@/components/buyer/CalendarBooking";
import Shell from "@/components/Shell";
import ContactForm from "@/components/ContactForm";
import { company } from "@/lib/site";
import { localeList } from "@/lib/locales";

export const metadata = {
  title: "Contact the Team",
  description: `Talk to ScrizaOne about fintech, AI or custom software. Team hours ${company.hours.india} and ${company.hours.pacific}. ${company.replyRule}`,
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <Shell locale="global">
      <section className="hero hero-sm">
        <div className="wrap">
          <h1>Contact the team</h1>
          <p className="lede">Tell us about your product or project. The first discovery call and written estimate are free.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid-2">
          <div>
            <h2>Send an enquiry</h2>
            <ContactForm currencies={[...new Set(localeList.map((l) => l.currency.code))]} />
          </div>
          <div>
            <CalendarBooking/><h2>Direct contact</h2>
            <ul className="plain contact-list">
              <li><strong>Email:</strong> <a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><strong>Phone:</strong> <a href={company.phoneHref}>{company.phone}</a></li>
              <li><strong>WhatsApp:</strong> <a href={company.whatsapp} rel="noopener">{company.phone}</a></li>
            </ul>
            <div className="card flat mt-s">
              <h3>Team hours</h3>
              <ul className="ticks">
                <li>{company.hours.india}</li>
                <li>{company.hours.pacific}</li>
              </ul>
              <p className="small">{company.replyRule}</p>
            </div>
            <div className="card flat mt-s">
              <h3>Company</h3>
              <p className="small">
                {company.legalName}<br />
                {company.hq.street}, {company.hq.city}, {company.hq.region} {company.hq.postal}, {company.hq.countryName}<br />
                Registered office: {company.registered}<br />
                CIN {company.cin} · DGFT IEC {company.iec}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
