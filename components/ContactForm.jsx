"use client";

// Opens WhatsApp with the visitor's complete enquiry for review and manual sending.
import { useState } from "react";
import { recordEvent } from "@/lib/measurement";
import { company, services } from "@/lib/site";

export default function ContactForm({ currencies }) {
  const [f, setF] = useState({ name: "", email: "", company: "", country: "", service: services[0].name, currency: "USD", message: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    recordEvent("enquiry_whatsapp_composed");
    const subject = `Enquiry from ${f.name || "website visitor"}${f.company ? ` (${f.company})` : ""}: ${f.service}`;
    const message = [
      "Hello ScrizaOne, I would like to discuss a project.",
      subject,
      "",
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      `Company: ${f.company || "Not provided"}`,
      `Country: ${f.country}`,
      `Service: ${f.service}`,
      `Preferred quote currency: ${f.currency}`,
      "",
      "Project details:",
      f.message,
      "",
      "Sent from scrizaone.com",
    ].join("\n");
    const whatsapp = new URL(company.whatsapp);
    whatsapp.searchParams.set("text", message);
    window.location.assign(whatsapp.toString());
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
      <button className="btn" type="submit">Continue on WhatsApp</button>
      <p className="small muted full">This opens WhatsApp with all your details filled in. Review the message and press Send to submit your enquiry. {company.replyRule}</p>
    </form>
  );
}
