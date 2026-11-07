"""
Scriza Autonomous Revenue Machine (S-ARM)
Report Renderer - Compiles boardroom-grade interactive HTML dashboards and vector PDF proposals using Google Chrome headless.
"""

import os
import subprocess
from datetime import datetime
from typing import Dict, Any

CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

def render_audit_html(audit: Dict[str, Any], proposal: Dict[str, Any]) -> str:
    domain = audit.get("domain", "Domain")
    score = audit.get("overall_score", 0)
    grade = audit.get("grade", "C")
    perf = audit.get("perf_score", 0)
    seo = audit.get("seo_score", 0)
    aeo = audit.get("aeo_score", 0)
    sec = audit.get("sec_score", 0)
    ux = audit.get("ux_score", 0)
    ttfb = audit.get("ttfb_ms", 0)
    size_kb = audit.get("page_size_kb", 0)
    leak_inr = audit.get("revenue_leak_monthly_inr", 0)
    flaws = audit.get("flaws", [])
    opportunities = audit.get("opportunities", [])
    upi_qr = proposal.get("upi_qr_base64", "")
    order_id = proposal.get("order_id", "SCZ-001")
    date_str = datetime.now().strftime("%B %d, %Y")

    # Flaws HTML rows
    flaws_html = ""
    for idx, f in enumerate(flaws[:6], 1):
        sev_color = "#ef4444" if f["severity"] == "CRITICAL" else ("#f59e0b" if f["severity"] == "HIGH" else "#3b82f6")
        flaws_html += f"""
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid {sev_color}; padding: 10px 14px; margin-bottom: 10px; border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <strong style="color: #0f172a; font-size: 13px;">#{idx}. {f['title']}</strong>
                <span style="background: {sev_color}18; color: {sev_color}; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">{f['severity']}</span>
            </div>
            <p style="margin: 0 0 4px 0; color: #475569; font-size: 11px;"><strong>Business Impact:</strong> {f['impact']}</p>
            <p style="margin: 0; color: #0284c7; font-size: 11px;"><strong>Remediation:</strong> {f['fix']}</p>
        </div>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{domain} - Technical Audit & Commercial Proposal | Scriza</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 0;
  }}
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #0f172a;
    line-height: 1.45;
    font-size: 11px;
  }}
  .page {{
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    overflow: hidden;
    position: relative;
    background: #ffffff;
    page-break-after: always;
    padding: 14mm 16mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}
  .page-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 12px;
  }}
  .brand-tag {{
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .brand-badge {{
    background: #2563eb;
    color: #ffffff;
    font-size: 9px;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 4px;
    text-transform: uppercase;
  }}
  .report-meta {{
    text-align: right;
    font-size: 10px;
    color: #64748b;
  }}
  .page-footer {{
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    color: #94a3b8;
  }}
  h1 {{ font-size: 26px; color: #0f172a; line-height: 1.15; margin-bottom: 6px; font-weight: 800; }}
  h2 {{ font-size: 16px; color: #0f172a; margin-bottom: 10px; font-weight: 700; border-bottom: 1.5px solid #0f172a; padding-bottom: 4px; }}
  h3 {{ font-size: 13px; color: #1e293b; margin-bottom: 6px; font-weight: 700; }}
  
  .metric-card {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
  }}
  .metric-val {{
    font-size: 24px;
    font-weight: 800;
    color: #0f172a;
  }}
  .metric-label {{
    font-size: 10px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    margin-top: 2px;
  }}
  
  .tier-box {{
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px;
    background: #ffffff;
  }}
  .tier-box.highlight {{
    border: 2px solid #2563eb;
    background: #eff6ff;
  }}
</style>
</head>
<body>

  <!-- ================= PAGE 1: COVER PAGE ================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-tag">
        <span>SCRIZA PRIVATE LIMITED</span>
        <span class="brand-badge">CONFIDENTIAL AUDIT</span>
      </div>
      <div class="report-meta">
        Ref: <strong>{order_id}</strong> | {date_str}
      </div>
    </div>

    <div style="margin: auto 0; text-align: left; padding: 20px 0;">
      <div style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 11px; margin-bottom: 12px;">
        100-POINT TECHNICAL &amp; REVENUE AUDIT REPORT 2026
      </div>
      <h1>Autonomous Architectural &amp; Growth Audit</h1>
      <div style="font-size: 20px; color: #2563eb; font-weight: 700; margin-bottom: 20px;">
        Target System: <span style="text-decoration: underline;">{domain}</span>
      </div>
      <p style="font-size: 13px; color: #475569; max-width: 580px; line-height: 1.6; margin-bottom: 24px;">
        Comprehensive examination of technical infrastructure, TTFB latency budgets, canonical indexing integrity, Generative Engine Optimization (AEO/GEO), security hardening, and direct inbound revenue mechanics.
      </p>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px;">
        <div class="metric-card">
          <div class="metric-val" style="color: {'#16a34a' if score >= 80 else ('#d97706' if score >= 65 else '#dc2626')};">{score}/100</div>
          <div class="metric-label">Overall Health Grade: {grade}</div>
        </div>
        <div class="metric-card">
          <div class="metric-val" style="color: #dc2626;">₹{leak_inr:,}</div>
          <div class="metric-label">Est. Monthly Revenue Leak</div>
        </div>
        <div class="metric-card">
          <div class="metric-val">{ttfb}ms</div>
          <div class="metric-label">Server TTFB Latency</div>
        </div>
        <div class="metric-card">
          <div class="metric-val">{len(flaws)}</div>
          <div class="metric-label">Critical Vulnerabilities</div>
        </div>
      </div>

      <div style="background: #f1f5f9; padding: 14px 18px; border-radius: 8px; font-size: 11px; color: #334155; line-height: 1.5;">
        <strong>Conducted By:</strong> Scriza Autonomous Systems Engineering Group<br>
        <strong>Legal Credentials:</strong> Scriza Private Limited (CIN: U72900RJ2021PTC076840) • ISO 9001:2015 &amp; ISO/IEC 27001:2022 Certified<br>
        <strong>Engineering Delivery:</strong> Remote Architecture Hub, Udaipur, Rajasthan, India • Serving Clients Across UAE, GCC &amp; Global Markets
      </div>
    </div>

    <div class="page-footer">
      <span>Scriza Private Limited • www.scriza.in • info@scriza.in</span>
      <span>Page 1 of 5</span>
    </div>
  </div>

  <!-- ================= PAGE 2: DIAGNOSTIC SCORECARD ================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-tag"><span>SCRIZA</span> <span style="font-weight: 400; color: #64748b;">| Technical Audit Report</span></div>
      <div class="report-meta">{domain} | {order_id}</div>
    </div>

    <div>
      <h2>1. Five-Pillar Architecture Scorecard</h2>
      <p style="color: #475569; font-size: 12px; margin-bottom: 14px;">
        Every digital touchpoint is evaluated against 5 engineering benchmarks required for high-velocity commercial conversion and algorithmic search dominance:
      </p>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px;">
        <div class="metric-card" style="border-top: 3px solid #3b82f6;">
          <div class="metric-val">{perf}/25</div>
          <div class="metric-label">Performance</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 4px;">TTFB: {ttfb}ms</div>
        </div>
        <div class="metric-card" style="border-top: 3px solid #10b981;">
          <div class="metric-val">{seo}/25</div>
          <div class="metric-label">Technical SEO</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 4px;">Meta &amp; Indexing</div>
        </div>
        <div class="metric-card" style="border-top: 3px solid #8b5cf6;">
          <div class="metric-val">{aeo}/20</div>
          <div class="metric-label">AEO / AI Search</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 4px;">LLM Ingestion</div>
        </div>
        <div class="metric-card" style="border-top: 3px solid #f59e0b;">
          <div class="metric-val">{sec}/15</div>
          <div class="metric-label">Security</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 4px;">HSTS / Headers</div>
        </div>
        <div class="metric-card" style="border-top: 3px solid #ec4899;">
          <div class="metric-val">{ux}/15</div>
          <div class="metric-label">Conversion UX</div>
          <div style="font-size: 9px; color: #64748b; margin-top: 4px;">WhatsApp &amp; CTA</div>
        </div>
      </div>

      <h2>2. Economic Impact &amp; Revenue Leakage Analysis</h2>
      <div style="background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 8px; padding: 14px 18px; margin-bottom: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="color: #991b1b; font-size: 13px; font-weight: 700;">Quantified Monthly Economic Downside:</span>
          <span style="font-size: 20px; font-weight: 800; color: #dc2626;">₹{leak_inr:,} / month</span>
        </div>
        <p style="color: #7f1d1d; font-size: 11px; margin: 0; line-height: 1.5;">
          Sub-optimal server response ({ttfb}ms), unminified payloads ({size_kb}KB), and missing generative engine manifests directly inflate customer acquisition costs (CAC). Unaddressed technical debt compounds into an annualized opportunity loss exceeding <strong>₹{(leak_inr * 12):,}</strong> in forfeited commercial pipeline.
        </p>
      </div>

      <h2>3. Generative Engine Optimization (AEO/GEO) Status</h2>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 11px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <strong>/llms.txt Manifest:</strong> 
            <span style="color: {'#16a34a' if audit.get('has_llms_txt') else '#dc2626'}; font-weight: 700;">
              {'DEPLOYED (Active)' if audit.get('has_llms_txt') else 'MISSING (Zero Direct AI Summary Grounding)'}
            </span>
          </div>
          <div>
            <strong>AI Bots Allowed:</strong> {audit.get('ai_bots_allowed', 'None')}
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Scriza Private Limited • www.scriza.in • info@scriza.in</span>
      <span>Page 2 of 5</span>
    </div>
  </div>

  <!-- ================= PAGE 3: ITEMIZED FLAWS ================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-tag"><span>SCRIZA</span> <span style="font-weight: 400; color: #64748b;">| Vulnerability Inspection</span></div>
      <div class="report-meta">{domain} | {order_id}</div>
    </div>

    <div>
      <h2>4. Priority Engineering Vulnerabilities</h2>
      <p style="color: #475569; font-size: 12px; margin-bottom: 12px;">
        The automated inspection uncovered the following high-consequence defects affecting discoverability, speed, and lead conversion:
      </p>

      <div>
        {flaws_html if flaws_html else '<p style="color: #16a34a; font-weight: 700;">No critical flaws detected. Site meets baseline modern engineering standards.</p>'}
      </div>
    </div>

    <div class="page-footer">
      <span>Scriza Private Limited • www.scriza.in • info@scriza.in</span>
      <span>Page 3 of 5</span>
    </div>
  </div>

  <!-- ================= PAGE 4: COMMERCIAL ROADMAP ================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-tag"><span>SCRIZA</span> <span style="font-weight: 400; color: #64748b;">| Turnkey Remediation Packages</span></div>
      <div class="report-meta">{domain} | {order_id}</div>
    </div>

    <div>
      <h2>5. Turnkey Engineering Remediation Roadmap</h2>
      <p style="color: #475569; font-size: 12px; margin-bottom: 14px;">
        Scriza provides fixed-scope, guaranteed turnaround sprints to rectify all vulnerabilities with zero operational downtime:
      </p>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 18px;">
        <!-- Tier 1 -->
        <div class="tier-box highlight">
          <div style="font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase;">RECOMMENDED SPRINT</div>
          <h3 style="font-size: 13px; margin: 4px 0;">7-Day Speed &amp; AEO Fix</h3>
          <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 6px 0;">₹24,000 <span style="font-size: 10px; font-weight: 400; color: #64748b;">+ GST ($299)</span></div>
          <ul style="padding-left: 14px; font-size: 10px; color: #334155; line-height: 1.5;">
            <li>Full TTFB speed remediation to sub-400ms</li>
            <li>Resolve canonical and duplicate meta bugs</li>
            <li>Deploy /llms.txt &amp; JSON-LD schema</li>
            <li>Security headers injection (HSTS, CSP)</li>
            <li>WhatsApp lead capture routing</li>
          </ul>
        </div>

        <!-- Tier 2 -->
        <div class="tier-box">
          <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">MODERN RE-ARCHITECTURE</div>
          <h3 style="font-size: 13px; margin: 4px 0;">14-Day Next.js Rebuild</h3>
          <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 6px 0;">₹58,000 <span style="font-size: 10px; font-weight: 400; color: #64748b;">+ GST ($699)</span></div>
          <ul style="padding-left: 14px; font-size: 10px; color: #334155; line-height: 1.5;">
            <li>Headless Next.js 15 &amp; Tailwind architecture</li>
            <li>100/100 Core Web Vitals score</li>
            <li>Integrated WhatsApp CRM inbox (Scriwo)</li>
            <li>Dynamic interactive quote calculator</li>
            <li>30-day post-launch warranty &amp; SLA</li>
          </ul>
        </div>

        <!-- Tier 3 -->
        <div class="tier-box">
          <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">ENTERPRISE AGENTS</div>
          <h3 style="font-size: 13px; margin: 4px 0;">AI Operations Engine</h3>
          <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 6px 0;">₹1,20,000 <span style="font-size: 10px; font-weight: 400; color: #64748b;">+ GST ($1,499)</span></div>
          <ul style="padding-left: 14px; font-size: 10px; color: #334155; line-height: 1.5;">
            <li>Custom 24/7 Autonomous AI Closer</li>
            <li>Automated KYC verification (VerifyAPI)</li>
            <li>Multi-agent workflow orchestration</li>
            <li>Dedicated VPC &amp; 99.9% uptime SLA</li>
          </ul>
        </div>
      </div>

      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 4px;">
        <strong style="color: #0f172a; font-size: 12px;">Immediate Action: Lock Sprint Queue with Token Deposit</strong>
        <p style="margin: 4px 0 0 0; color: #475569; font-size: 11px;">
          Lock immediate engineering availability and receive the full 25-page Actionable Developer Remediation Blueprint with a <strong>₹2,999 (~$39)</strong> token commitment. 100% of this fee is credited against any sprint invoice.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <span>Scriza Private Limited • www.scriza.in • info@scriza.in</span>
      <span>Page 4 of 5</span>
    </div>
  </div>

  <!-- ================= PAGE 5: INSTANT PAYMENT & CREDENTIALS ================= -->
  <div class="page">
    <div class="page-header">
      <div class="brand-tag"><span>SCRIZA</span> <span style="font-weight: 400; color: #64748b;">| Payment &amp; Activation</span></div>
      <div class="report-meta">{domain} | {order_id}</div>
    </div>

    <div>
      <h2>6. Instant Activation &amp; Secure Payment Gateway</h2>
      <p style="color: #475569; font-size: 12px; margin-bottom: 16px;">
        Scan the UPI QR code using any banking or UPI app (PhonePe, Google Pay, Paytm, BHIM) to immediately reserve your development sprint:
      </p>

      <div style="display: flex; gap: 24px; align-items: center; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <div style="background: #ffffff; padding: 10px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: center;">
          <img src="{upi_qr}" alt="UPI Payment QR" style="width: 140px; height: 140px; display: block;" />
          <div style="font-size: 9px; font-weight: 700; color: #0f172a; margin-top: 4px;">SCAN TO PAY VIA UPI</div>
        </div>
        <div style="flex: 1; font-size: 11px; color: #334155; line-height: 1.6;">
          <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
            Token Deposit / Queue Lock: <span style="color: #16a34a;">₹2,999 INR</span>
          </div>
          <div><strong>Beneficiary:</strong> Scriza Private Limited</div>
          <div><strong>UPI ID (VPA):</strong> <code>scriza@icici</code></div>
          <div><strong>Order Tracking Ref:</strong> <code>{order_id}</code></div>
          <div><strong>Bank:</strong> ICICI Bank Limited, Corporate Banking Branch</div>
          <div style="margin-top: 6px; font-size: 10px; color: #64748b;">
            *For international credit card payments (USD/AED), access your secure Stripe/Razorpay link via your interactive web dashboard.
          </div>
        </div>
      </div>

      <h2>7. Statutory Credentials &amp; Assurance</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 10px; color: #475569;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px;">
          <strong style="color: #0f172a;">Statutory Compliance:</strong><br>
          • CIN: U72900RJ2021PTC076840<br>
          • DGFT IEC: AAMCS7218D<br>
          • Registered Under Companies Act, 2013 (MCA, Govt. of India)
        </div>
        <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px;">
          <strong style="color: #0f172a;">Quality &amp; Security Standards:</strong><br>
          • ISO 9001:2015 Quality Management System<br>
          • ISO/IEC 27001:2022 Information Security Management<br>
          • NDA &amp; IP Protection Standard on All Engineering Deliverables
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>Scriza Private Limited • Registered in Udaipur, Rajasthan, India • Phone: +91 80058 84894 • WhatsApp: +91 91191 12021</span>
      <span>Page 5 of 5</span>
    </div>
  </div>

</body>
</html>
    """
    return html

def generate_pdf_report(html_content: str, output_pdf_path: str, temp_html_path: str) -> bool:
    try:
        with open(temp_html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        cmd = [
            CHROME_PATH,
            "--headless",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={output_pdf_path}",
            temp_html_path
        ]
        
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        return os.path.exists(output_pdf_path) and os.path.getsize(output_pdf_path) > 1000
    except Exception as e:
        print("PDF compilation error:", str(e))
        return False

if __name__ == "__main__":
    from proposal_engine import build_proposal_data
    test_audit = {
        "id": 1,
        "domain": "testbusiness.com",
        "overall_score": 64,
        "grade": "D",
        "perf_score": 14,
        "seo_score": 16,
        "aeo_score": 10,
        "sec_score": 12,
        "ux_score": 12,
        "ttfb_ms": 1450.0,
        "page_size_kb": 2400.0,
        "revenue_leak_monthly_inr": 67000,
        "has_llms_txt": False,
        "ai_bots_allowed": "GPTBot",
        "flaws": [
            {
                "category": "Performance",
                "severity": "CRITICAL",
                "title": "Sluggish Server Response (TTFB: 1450ms)",
                "impact": "Visitors bounce within 3 seconds.",
                "fix": "Deploy Edge caching and headless SSR."
            },
            {
                "category": "AEO",
                "severity": "HIGH",
                "title": "No /llms.txt AI Citation Manifest",
                "impact": "Excluded from Perplexity & SearchGPT summaries.",
                "fix": "Publish /llms.txt with corporate knowledge."
            }
        ]
    }
    test_prop = build_proposal_data(test_audit, lead_id=1, selected_tier="DEPOSIT")
    html_out = render_audit_html(test_audit, test_prop)
    
    html_file = "/Users/karnveersingh/.gemini/antigravity/scratch/scriza-autonomous-revenue-engine/test_audit.html"
    pdf_file = "/Users/karnveersingh/.gemini/antigravity/scratch/scriza-autonomous-revenue-engine/test_audit.pdf"
    
    ok = generate_pdf_report(html_out, pdf_file, html_file)
    print("PDF Generation test passed?", ok)
    if ok:
        print(f"Generated PDF size: {os.path.getsize(pdf_file)} bytes at {pdf_file}")
