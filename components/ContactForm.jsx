"use client";

// Opens the visitor's email client with a pre-filled enquiry to the sales inbox.
// No data is sent to a server from this page. (A server-side form handler can
// replace this once a mail/CRM API key is configured on Vercel.)
import { useState } from "react";
import { recordEvent } from "@/lib/measurement";
import { company, services } from "@/lib/site";

export default function ContactForm({ currencies }) {
  const [f, setF] = useState({ name: "", email: "", company: "", country: "", service: services[0].name, currency: "USD", message: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    recordEvent("enquiry_email_composed");
    const subject = `Enquiry from ${f.name || "website visitor"}${f.company ? ` (${f.company})` : ""}: ${f.service}`;
    const body = [
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      `Company: ${f.company}`,
      `Country: ${f.country}`,
      `Service: ${f.service}`,
      `Preferred quote currency: ${f.currency}`,
      "",
      f.message,
      "",
      "Sent from scrizaone.com",
    ].join("\n");
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>Name<input required value={f.name} onChange={set("name")} autoComplete="name" /></label>
      <label>Work email<input required type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
      <label>Company<input value={f.company} onChange={set("company")} autoComplete="organization" /></label>
      <label>Country<input required value={f.country} onChange={set("country")} autoComplete="country-name" /></label>
      <label>Service
        <select value={f.service} onChange={set("service")}>
          {services.map((s) => <option key={s.slug}>{s.name}</option>)}
          <option>Something else</option>
        </select>
      </label>
      <label>Quote currency
        <select value={f.currency} onChange={set("currency")}>
          {currencies.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="full">What are you building?<textarea required rows={5} value={f.message} onChange={set("message")} /></label>
      <button className="btn" type="submit">Compose email</button>
      <p className="small muted full">This opens your email app with your enquiry filled in. {company.replyRule}</p>
    </form>
  );
}
