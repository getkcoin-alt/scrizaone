"""
Scriza Autonomous Revenue Machine (S-ARM)
Proposal & Monetization Engine - Dynamic commercial packaging, UPI QR generation, and automated checkout.
"""

import io
import base64
import uuid
import qrcode
from typing import Dict, Any, List

# Official Scriza Payment Receiver Configuration
UPI_VPA = "scriza@icici"
PAYEE_NAME = "Scriza Private Limited"
MERCHANT_CODE = "0000"

PACKAGES = {
    "DEPOSIT": {
        "id": "DEPOSIT",
        "name": "Audit Implementation Blueprint & Queue Lock",
        "tagline": "Immediate 25-Page Dev Blueprint + Priority Sprint Lock",
        "price_inr": 2999,
        "price_usd": 39,
        "delivery_days": 1,
        "features": [
            "Complete 25-page line-by-line developer remediation spec",
            "Exact code snippets for Next.js/Nginx/Apache canonical and header fixes",
            "Custom-authored /llms.txt and AI Search robots.txt configuration",
            "1-on-1 Senior Architect Strategy Walkthrough (30 Mins)",
            "100% of this ₹2,999 is credited toward any full engineering sprint"
        ]
    },
    "SPRINT_REMEDIATION": {
        "id": "SPRINT_REMEDIATION",
        "name": "7-Day Technical Speed & AEO Remediation Sprint",
        "tagline": "Done-For-You Turnkey Resolution of All Identified Critical Flaws",
        "price_inr": 24000,
        "price_usd": 299,
        "delivery_days": 7,
        "features": [
            "Turnkey execution by Scriza senior backend and frontend engineers",
            "Server TTFB optimization to sub-400ms & edge caching setup",
            "Resolution of all canonical loops, meta duplication, and JSON-LD schema",
            "Deployment of official /llms.txt and Perplexity/SearchGPT crawl authorizations",
            "Security headers injection (HSTS, CSP, X-Frame-Options, SSL hardening)",
            "Automated WhatsApp click-to-chat conversion lead capture setup",
            "Before-and-after verification report signed by Lead QA Specialist"
        ]
    },
    "PLATFORM_REBUILD": {
        "id": "PLATFORM_REBUILD",
        "name": "Full-Stack High-Conversion Modernization (14 Days)",
        "tagline": "Complete Headless Re-Architecture (Next.js 15 + FastAPI + Tailwind)",
        "price_inr": 58000,
        "price_usd": 699,
        "delivery_days": 14,
        "features": [
            "Complete rewrite onto modern Next.js 15 App Router & Tailwind CSS",
            "100/100 Core Web Vitals on mobile and desktop",
            "Integrated WhatsApp Shared Inbox & Lead Routing flow (Scriwo/WppFlow)",
            "Bespoke interactive proposal/quote engine tailored to your customers",
            "Full AEO/GEO semantic entity graph for dominant AI search placement",
            "30 days post-launch SLA warranty & production monitoring"
        ]
    },
    "ENTERPRISE_AI": {
        "id": "ENTERPRISE_AI",
        "name": "Autonomous AI Agent & Operations Engine",
        "tagline": "24/7 Autonomous Sales, KYC & Operations Pipeline",
        "price_inr": 120000,
        "price_usd": 1499,
        "delivery_days": 21,
        "features": [
            "Custom autonomous AI Sales Closer agent trained on your business domain",
            "Instant WhatsApp & Web autonomous conversation and lead capture",
            "Identity & Verification integration (PAN, GST, Bank via VerifyAPI)",
            "Automated proposal and invoice generation pipeline",
            "Dedicated VPC staging, CI/CD pipeline, and 99.9% uptime SLA"
        ]
    }
}

def generate_upi_uri(order_id: str, amount_inr: int, note: str = "Scriza Engineering") -> str:
    # Standard NPCI UPI URI Specification
    params = [
        f"pa={UPI_VPA}",
        f"pn={PAYEE_NAME.replace(' ', '%20')}",
        f"mc={MERCHANT_CODE}",
        f"tr={order_id}",
        f"tn={note.replace(' ', '%20')[:30]}",
        f"am={amount_inr:.2f}",
        "cu=INR"
    ]
    return "upi://pay?" + "&".join(params)

def generate_qr_base64(upi_uri: str) -> str:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=2,
    )
    qr.add_data(upi_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0f172a", back_color="#ffffff")
    
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{img_b64}"

def build_proposal_data(audit: Dict[str, Any], lead_id: int, selected_tier: str = "DEPOSIT") -> Dict[str, Any]:
    order_id = f"SCZ-{uuid.uuid4().hex[:8].upper()}"
    package = PACKAGES.get(selected_tier, PACKAGES["DEPOSIT"])
    amount_inr = package["price_inr"]
    amount_usd = package["price_usd"]
    
    note = f"Scriza-{order_id}-{audit.get('domain', 'Audit')[:10]}"
    upi_uri = generate_upi_uri(order_id, amount_inr, note)
    qr_base64 = generate_qr_base64(upi_uri)
    
    return {
        "order_id": order_id,
        "lead_id": lead_id,
        "audit_id": audit.get("id", 0),
        "domain": audit.get("domain", ""),
        "overall_score": audit.get("overall_score", 0),
        "revenue_leak_monthly_inr": audit.get("revenue_leak_monthly_inr", 0),
        "package_tier": selected_tier,
        "package_details": package,
        "amount_inr": amount_inr,
        "amount_usd": amount_usd,
        "upi_vpa": UPI_VPA,
        "payee_name": PAYEE_NAME,
        "upi_uri": upi_uri,
        "upi_qr_base64": qr_base64,
        "all_packages": PACKAGES
    }

if __name__ == "__main__":
    dummy_audit = {"id": 1, "domain": "example.com", "overall_score": 68, "revenue_leak_monthly_inr": 85000}
    proposal = build_proposal_data(dummy_audit, lead_id=1, selected_tier="DEPOSIT")
    print("Generated Proposal Order:", proposal["order_id"])
    print("UPI URI:", proposal["upi_uri"])
    print("QR Code Length:", len(proposal["upi_qr_base64"]))
