"""
Scriza Autonomous Revenue Machine (S-ARM)
Comprehensive Integration Test Suite
Verifies database integrity, real-time auditing, PDF compilation, API routes, and payment verification.
"""

import os
import asyncio
import unittest
from fastapi.testclient import TestClient
import database as db
import auditor
import proposal_engine
import report_renderer
from app import app

class TestScrizaRevenueEngine(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        db.init_db()
        cls.client = TestClient(app)

    def test_01_database_tables(self):
        """Verify that SQLite tables exist and query cleanly."""
        metrics = db.get_metrics_summary()
        self.assertIn("total_leads", metrics)
        self.assertIn("total_audits", metrics)
        self.assertIn("total_revenue_inr", metrics)
        print("✓ Database tables verified")

    def test_02_proposal_and_upi_qr(self):
        """Verify dynamic UPI URI and QR code generation."""
        audit_dummy = {
            "id": 99,
            "domain": "testbusiness.com",
            "overall_score": 62,
            "revenue_leak_monthly_inr": 70000
        }
        prop = proposal_engine.build_proposal_data(audit_dummy, lead_id=1, selected_tier="DEPOSIT")
        self.assertTrue(prop["order_id"].startswith("SCZ-"))
        self.assertTrue(prop["upi_uri"].startswith("upi://pay?"))
        self.assertIn("pa=scriza@icici", prop["upi_uri"])
        self.assertTrue(prop["upi_qr_base64"].startswith("data:image/png;base64,"))
        self.assertEqual(prop["amount_inr"], 2999)
        print("✓ Proposal Engine & UPI QR generation verified")

    def test_03_auditor_live_execution(self):
        """Test real-time web auditor with asyncio."""
        async def run_audit():
            return await auditor.audit_website("https://example.com")
        
        result = asyncio.run(run_audit())
        self.assertEqual(result["domain"], "example.com")
        self.assertGreater(result["overall_score"], 0)
        self.assertIn(result["grade"], ["A+", "A", "B", "C", "D", "F"])
        self.assertGreater(len(result["flaws"]), 0)
        print(f"✓ Live Auditor verified on example.com (Score: {result['overall_score']}, Flaws: {len(result['flaws'])})")

    def test_04_pdf_report_compilation(self):
        """Test Chrome headless PDF generator."""
        audit_dummy = {
            "id": 100,
            "domain": "testcorp.com",
            "overall_score": 72,
            "grade": "B",
            "perf_score": 18,
            "seo_score": 18,
            "aeo_score": 14,
            "sec_score": 11,
            "ux_score": 11,
            "ttfb_ms": 520.0,
            "page_size_kb": 1200.0,
            "revenue_leak_monthly_inr": 48000,
            "has_llms_txt": False,
            "ai_bots_allowed": "GPTBot, ClaudeBot",
            "flaws": [{"category": "AEO", "severity": "HIGH", "title": "Missing /llms.txt", "impact": "Lost AI traffic", "fix": "Deploy /llms.txt"}]
        }
        prop = proposal_engine.build_proposal_data(audit_dummy, lead_id=1, selected_tier="DEPOSIT")
        html_content = report_renderer.render_audit_html(audit_dummy, prop)
        
        temp_html = "/tmp/test_report.html"
        temp_pdf = "/tmp/test_report.pdf"
        
        ok = report_renderer.generate_pdf_report(html_content, temp_pdf, temp_html)
        self.assertTrue(ok)
        self.assertTrue(os.path.exists(temp_pdf))
        self.assertGreater(os.path.getsize(temp_pdf), 10000)
        print(f"✓ Chrome Headless PDF generator verified (PDF Size: {os.path.getsize(temp_pdf)} bytes)")

    def test_05_api_endpoints_and_payment_flow(self):
        """Test full end-to-end API lifecycle from audit to checkout and verification."""
        # 1. GET /
        resp = self.client.get("/")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("SCRIZA", resp.text)
        
        # 2. POST /api/audit
        audit_resp = self.client.post("/api/audit", json={
            "url": "https://example.com",
            "company_name": "Example Global Ltd",
            "contact_email": "ops@example.com",
            "contact_phone": "+91 98765 00000",
            "country": "India"
        })
        self.assertEqual(audit_resp.status_code, 200)
        audit_data = audit_resp.json()
        self.assertTrue(audit_data["success"])
        audit_token = audit_data["audit_token"]
        order_id = audit_data["order_id"]
        
        # 3. GET /report/{audit_token}
        report_resp = self.client.get(f"/report/{audit_token}")
        self.assertEqual(report_resp.status_code, 200)
        self.assertIn("Example Global Ltd", report_resp.text)
        
        # 4. GET /api/audit/{audit_token}/pdf
        pdf_resp = self.client.get(f"/api/audit/{audit_token}/pdf")
        self.assertEqual(pdf_resp.status_code, 200)
        self.assertEqual(pdf_resp.headers["content-type"], "application/pdf")
        
        # 5. POST /api/order/create (Switch to 7-Day Sprint tier)
        order_resp = self.client.post("/api/order/create", json={
            "audit_token": audit_token,
            "package_tier": "SPRINT_REMEDIATION"
        })
        self.assertEqual(order_resp.status_code, 200)
        sprint_order = order_resp.json()
        self.assertEqual(sprint_order["amount_inr"], 24000)
        
        # 6. POST /api/order/verify (Simulate client entering UTR after paying via UPI)
        verify_resp = self.client.post("/api/order/verify", json={
            "order_id": sprint_order["order_id"],
            "payment_ref": "UTR492019385921"
        })
        self.assertEqual(verify_resp.status_code, 200)
        verify_data = verify_resp.json()
        self.assertTrue(verify_data["success"])
        
        # 7. GET /admin (Verify metrics updated)
        admin_resp = self.client.get("/admin")
        self.assertEqual(admin_resp.status_code, 200)
        self.assertIn("SCRIZA REVENUE COMMAND CENTER", admin_resp.text)
        self.assertIn(sprint_order["order_id"], admin_resp.text)
        print("✓ Full API & Autonomous Payment Lifecycle verified (Audit -> Order -> Payment -> Dashboard)")

if __name__ == "__main__":
    unittest.main()
