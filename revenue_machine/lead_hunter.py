"""
Scriza Autonomous Revenue Machine (S-ARM)
Autonomous Lead Hunter & Outbound Closer
Scans prospects headlessly, compiles audits, and crafts hyper-personalized, high-converting value teardowns.
"""

import os
import uuid
from typing import List, Dict, Any
import auditor
import proposal_engine
import report_renderer
import database as db

REPORTS_DIR = os.path.join(os.path.dirname(__file__), "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

def generate_cold_outreach_pitch(audit: Dict[str, Any], audit_token: str) -> Dict[str, str]:
    domain = audit.get("domain", "your company")
    score = audit.get("overall_score", 0)
    leak_inr = audit.get("revenue_leak_monthly_inr", 0)
    ttfb = audit.get("ttfb_ms", 0)
    flaws = audit.get("flaws", [])
    
    top_flaw_text = ""
    if flaws:
        top_flaw = flaws[0]
        top_flaw_text = f"specifically, {top_flaw['title'].lower()} which {top_flaw['impact'].lower()}"
    else:
        top_flaw_text = "specifically missing generative search (/llms.txt) grounding for AI search engines like Perplexity and SearchGPT"

    email_subject = f"3 silent engineering bottlenecks on {domain} (and your audit report)"
    
    email_body = f"""Hi Team,

I ran an autonomous technical & commercial diagnostic on {domain}.

Your infrastructure currently scores {score}/100 on our 2026 engineering benchmark. We detected an estimated ₹{leak_inr:,}/month in silent revenue leakage—{top_flaw_text}.

Additionally, your server response time (TTFB) is currently clocked at {ttfb}ms, which directly impacts Google mobile rankings and ad conversion.

We compiled a comprehensive 5-page Boardroom Diagnostic & Remediation Blueprint for your engineering and leadership team. You can view the live interactive scorecard and download the official PDF here:

👉 https://scriza.in/report/{audit_token}

Scriza provides a 7-day turnkey sprint to resolve 100% of these bottlenecks with zero downtime. 

Best regards,

Autonomous Systems Engineering Team
Scriza Private Limited (CIN: U72900RJ2021PTC076840)
ISO 9001:2015 & ISO/IEC 27001:2022 Certified
https://www.scriza.in | +91 80058 84894
"""

    whatsapp_pitch = f"""Hi! We noticed 3 high-impact technical bottlenecks on *{domain}* (including a {ttfb}ms server response and missing AI Search /llms.txt manifest) costing an estimated *₹{leak_inr:,}/month* in dropped visitors.

We generated a full 100-point audit for you:
👉 https://scriza.in/report/{audit_token}

Scriza resolves 100% of these within a guaranteed 7-day engineering sprint. Let me know if you’d like us to take care of it."""

    return {
        "email_subject": email_subject,
        "email_body": email_body,
        "whatsapp_pitch": whatsapp_pitch
    }

async def hunt_and_generate(domains: List[str]) -> List[Dict[str, Any]]:
    campaigns = []
    
    for raw_domain in domains:
        d = raw_domain.strip()
        if not d:
            continue
            
        print(f"[HUNTER] Auditing {d} ...")
        try:
            audit_res = await auditor.audit_website(d)
            lead_token = f"lead_{uuid.uuid4().hex[:12]}"
            audit_token = f"aud_{uuid.uuid4().hex[:12]}"
            
            lead_id = db.save_lead({
                "lead_token": lead_token,
                "domain": audit_res["domain"],
                "target_url": audit_res["target_url"],
                "company_name": audit_res["domain"],
                "contact_email": "",
                "contact_phone": "",
                "country": "India",
                "source": "outbound_hunter",
                "status": "AUDITED"
            })
            
            proposal = proposal_engine.build_proposal_data(audit_res, lead_id=lead_id, selected_tier="DEPOSIT")
            
            db.create_order({
                "order_id": proposal["order_id"],
                "lead_id": lead_id,
                "audit_id": 0,
                "package_tier": proposal["package_tier"],
                "amount_inr": proposal["amount_inr"],
                "amount_usd": proposal["amount_usd"],
                "currency": "INR",
                "payment_method": "UPI_DIRECT",
                "payment_status": "PENDING",
                "upi_uri": proposal["upi_uri"],
                "upi_qr_base64": proposal["upi_qr_base64"]
            })
            
            html_content = report_renderer.render_audit_html(audit_res, proposal)
            html_path = os.path.join(REPORTS_DIR, f"{audit_token}.html")
            pdf_path = os.path.join(REPORTS_DIR, f"{audit_token}.pdf")
            
            report_renderer.generate_pdf_report(html_content, pdf_path, html_path)
            
            audit_data = {
                **audit_res,
                "lead_id": lead_id,
                "audit_token": audit_token,
                "report_html_path": html_path,
                "report_pdf_path": pdf_path
            }
            audit_id = db.save_audit(audit_data)
            
            conn = db.get_connection()
            conn.execute("UPDATE orders SET audit_id = ? WHERE order_id = ?", (audit_id, proposal["order_id"]))
            conn.commit()
            conn.close()

            pitches = generate_cold_outreach_pitch(audit_res, audit_token)
            
            campaigns.append({
                "domain": audit_res["domain"],
                "score": audit_res["overall_score"],
                "grade": audit_res["grade"],
                "revenue_leak_monthly_inr": audit_res["revenue_leak_monthly_inr"],
                "order_id": proposal["order_id"],
                "audit_token": audit_token,
                "report_url": f"/report/{audit_token}",
                "pdf_path": pdf_path,
                "pitches": pitches
            })
            print(f"[HUNTER] Successfully processed {d} -> Score: {audit_res['overall_score']}")
        except Exception as e:
            print(f"[HUNTER] Failed auditing {d}: {str(e)}")

    return campaigns

if __name__ == "__main__":
    import asyncio
    async def run():
        results = await hunt_and_generate(["example.com"])
        for r in results:
            print("Domain:", r["domain"])
            print("Score:", r["score"])
            print("Report URL:", r["report_url"])
            print("WhatsApp Pitch:\n", r["pitches"]["whatsapp_pitch"])
    asyncio.run(run())
