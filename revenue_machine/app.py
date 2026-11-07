"""
Scriza Autonomous Revenue Machine (S-ARM)
Production Web Application & Autonomous Checkout Gateway
Powered by FastAPI, Jinja2, SQLite, and Chrome Headless PDF Engine.
"""

import os
import json
import uuid
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jinja2

import database as db
import auditor
import proposal_engine
import report_renderer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

jinja_env = jinja2.Environment(
    loader=jinja2.FileSystemLoader(TEMPLATES_DIR),
    autoescape=jinja2.select_autoescape(["html", "xml"])
)

app = FastAPI(title="Scriza Autonomous Revenue Machine", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure DB is initialized
db.init_db()

class AuditRequest(BaseModel):
    url: str
    company_name: Optional[str] = ""
    contact_email: Optional[str] = ""
    contact_phone: Optional[str] = ""
    country: Optional[str] = "India"
    source: Optional[str] = "inbound_web"

class CreateOrderRequest(BaseModel):
    audit_token: str
    package_tier: str

class VerifyPaymentRequest(BaseModel):
    order_id: str
    payment_ref: str

class HunterRequest(BaseModel):
    domains: List[str]

@app.get("/", response_class=HTMLResponse)
async def home_page():
    template = jinja_env.get_template("home.html")
    return HTMLResponse(content=template.render())

@app.post("/api/audit")
async def execute_audit(payload: AuditRequest):
    target = payload.url.strip()
    if not target:
        raise HTTPException(status_code=400, detail="Target URL is required")
        
    # 1. Run live inspection
    audit_res = await auditor.audit_website(target)
    
    # 2. Generate tokens
    lead_token = f"lead_{uuid.uuid4().hex[:12]}"
    audit_token = f"aud_{uuid.uuid4().hex[:12]}"
    
    # 3. Save Lead
    lead_id = db.save_lead({
        "lead_token": lead_token,
        "domain": audit_res["domain"],
        "target_url": audit_res["target_url"],
        "company_name": payload.company_name or audit_res["domain"],
        "contact_email": payload.contact_email,
        "contact_phone": payload.contact_phone,
        "country": payload.country,
        "source": payload.source,
        "status": "AUDITED"
    })
    
    # 4. Generate Proposal & UPI details
    proposal = proposal_engine.build_proposal_data(audit_res, lead_id=lead_id, selected_tier="DEPOSIT")
    
    # 5. Create initial pending order
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
    
    # 6. Render HTML & PDF reports
    html_content = report_renderer.render_audit_html(audit_res, proposal)
    html_filename = f"{audit_token}.html"
    pdf_filename = f"{audit_token}.pdf"
    
    html_path = os.path.join(REPORTS_DIR, html_filename)
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)
    
    # Generate vector PDF via Google Chrome
    report_renderer.generate_pdf_report(html_content, pdf_path, html_path)
    
    # 7. Save Audit Record
    audit_data = {
        **audit_res,
        "lead_id": lead_id,
        "audit_token": audit_token,
        "report_html_path": html_path,
        "report_pdf_path": pdf_path
    }
    audit_id = db.save_audit(audit_data)
    
    # Update order with audit_id
    conn = db.get_connection()
    conn.execute("UPDATE orders SET audit_id = ? WHERE order_id = ?", (audit_id, proposal["order_id"]))
    conn.commit()
    conn.close()

    return {
        "success": True,
        "audit_token": audit_token,
        "order_id": proposal["order_id"],
        "overall_score": audit_res["overall_score"],
        "grade": audit_res["grade"],
        "flaws_count": len(audit_res["flaws"]),
        "revenue_leak_monthly_inr": audit_res["revenue_leak_monthly_inr"],
        "redirect_url": f"/report/{audit_token}"
    }

@app.get("/report/{audit_token}", response_class=HTMLResponse)
async def view_report(audit_token: str):
    audit = db.get_audit_by_token(audit_token)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit report not found")
        
    proposal = proposal_engine.build_proposal_data(audit, lead_id=audit["lead_id"], selected_tier="DEPOSIT")
    
    template = jinja_env.get_template("report.html")
    rendered = template.render(
        audit=audit,
        proposal=proposal,
        audit_token=audit_token,
        domain=audit["domain"],
        score=audit["overall_score"],
        grade=audit["grade"],
        leak_inr=audit["revenue_leak_monthly_inr"],
        ttfb=audit["ttfb_ms"],
        flaws=audit["flaws"]
    )
    return HTMLResponse(content=rendered)

@app.get("/api/audit/{audit_token}/pdf")
async def download_pdf(audit_token: str):
    audit = db.get_audit_by_token(audit_token)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
        
    pdf_path = audit.get("report_pdf_path")
    if not pdf_path or not os.path.exists(pdf_path):
        proposal = proposal_engine.build_proposal_data(audit, lead_id=audit["lead_id"], selected_tier="DEPOSIT")
        html_content = report_renderer.render_audit_html(audit, proposal)
        html_path = os.path.join(REPORTS_DIR, f"{audit_token}.html")
        pdf_path = os.path.join(REPORTS_DIR, f"{audit_token}.pdf")
        report_renderer.generate_pdf_report(html_content, pdf_path, html_path)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"Scriza_Audit_{audit['domain']}_2026.pdf"
    )

@app.post("/api/order/create")
async def create_order_endpoint(payload: CreateOrderRequest):
    audit = db.get_audit_by_token(payload.audit_token)
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")
        
    proposal = proposal_engine.build_proposal_data(audit, lead_id=audit["lead_id"], selected_tier=payload.package_tier)
    
    db.create_order({
        "order_id": proposal["order_id"],
        "lead_id": audit["lead_id"],
        "audit_id": audit["id"],
        "package_tier": proposal["package_tier"],
        "amount_inr": proposal["amount_inr"],
        "amount_usd": proposal["amount_usd"],
        "currency": "INR",
        "payment_method": "UPI_DIRECT",
        "payment_status": "PENDING",
        "upi_uri": proposal["upi_uri"],
        "upi_qr_base64": proposal["upi_qr_base64"]
    })
    
    return {
        "order_id": proposal["order_id"],
        "package_tier": proposal["package_tier"],
        "amount_inr": proposal["amount_inr"],
        "upi_uri": proposal["upi_uri"],
        "upi_qr_base64": proposal["upi_qr_base64"]
    }

@app.post("/api/order/verify")
async def verify_payment(payload: VerifyPaymentRequest):
    success = db.mark_order_paid(payload.order_id, payload.payment_ref)
    if not success:
        return {"success": False, "message": "Order ID not found or already verified"}
    return {"success": True, "order_id": payload.order_id, "status": "COMPLETED"}

@app.get("/admin", response_class=HTMLResponse)
async def admin_dashboard():
    metrics = db.get_metrics_summary()
    template = jinja_env.get_template("admin.html")
    rendered = template.render(metrics=metrics)
    return HTMLResponse(content=rendered)

@app.post("/api/hunter/run")
async def run_hunter(payload: HunterRequest):
    import lead_hunter
    results = await lead_hunter.hunt_and_generate(payload.domains)
    return {"success": True, "count": len(results), "campaigns": results}

if __name__ == "__main__":
    import uvicorn
    print("Starting Scriza Autonomous Revenue Server on http://127.0.0.1:8765 ...")
    uvicorn.run("app:app", host="127.0.0.1", port=8765, reload=False)
