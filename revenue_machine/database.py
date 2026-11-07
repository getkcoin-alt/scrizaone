"""
Scriza Autonomous Revenue Machine (S-ARM)
Database Layer - SQLite durable transactional storage.
"""

import sqlite3
import os
import json
from datetime import datetime
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(__file__), "scriza_revenue.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Leads Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_token TEXT UNIQUE NOT NULL,
        domain TEXT NOT NULL,
        target_url TEXT NOT NULL,
        company_name TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        country TEXT DEFAULT 'India',
        source TEXT DEFAULT 'inbound_web',
        status TEXT DEFAULT 'AUDITED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Audits Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lead_id INTEGER NOT NULL REFERENCES leads(id),
        audit_token TEXT UNIQUE NOT NULL,
        overall_score INTEGER NOT NULL,
        grade TEXT NOT NULL,
        perf_score INTEGER NOT NULL,
        seo_score INTEGER NOT NULL,
        aeo_score INTEGER NOT NULL,
        sec_score INTEGER NOT NULL,
        ux_score INTEGER NOT NULL,
        ttfb_ms REAL,
        page_size_kb REAL,
        ssl_valid BOOLEAN,
        canonical_status TEXT,
        has_llms_txt BOOLEAN,
        ai_bots_allowed TEXT,
        flaws_json TEXT,
        opportunities_json TEXT,
        audit_raw_json TEXT,
        revenue_leak_monthly_inr INTEGER,
        report_html_path TEXT,
        report_pdf_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 3. Orders / Transactions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        lead_id INTEGER NOT NULL REFERENCES leads(id),
        audit_id INTEGER NOT NULL REFERENCES audits(id),
        package_tier TEXT NOT NULL,
        amount_inr INTEGER NOT NULL,
        amount_usd INTEGER NOT NULL,
        currency TEXT DEFAULT 'INR',
        payment_method TEXT DEFAULT 'UPI_DIRECT',
        payment_ref TEXT,
        payment_status TEXT DEFAULT 'PENDING',
        upi_uri TEXT,
        upi_qr_base64 TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

# Auto-initialize tables on module import
init_db()

def save_lead(lead_data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO leads (lead_token, domain, target_url, company_name, contact_email, contact_phone, country, source, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        lead_data['lead_token'],
        lead_data['domain'],
        lead_data['target_url'],
        lead_data.get('company_name', ''),
        lead_data.get('contact_email', ''),
        lead_data.get('contact_phone', ''),
        lead_data.get('country', 'India'),
        lead_data.get('source', 'inbound_web'),
        lead_data.get('status', 'AUDITED')
    ))
    lead_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return lead_id

def save_audit(audit_data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO audits (
            lead_id, audit_token, overall_score, grade, perf_score, seo_score, 
            aeo_score, sec_score, ux_score, ttfb_ms, page_size_kb, ssl_valid, 
            canonical_status, has_llms_txt, ai_bots_allowed, flaws_json, 
            opportunities_json, audit_raw_json, revenue_leak_monthly_inr, 
            report_html_path, report_pdf_path
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        audit_data['lead_id'],
        audit_data['audit_token'],
        audit_data['overall_score'],
        audit_data['grade'],
        audit_data['perf_score'],
        audit_data['seo_score'],
        audit_data['aeo_score'],
        audit_data['sec_score'],
        audit_data['ux_score'],
        audit_data.get('ttfb_ms', 0),
        audit_data.get('page_size_kb', 0),
        audit_data.get('ssl_valid', True),
        audit_data.get('canonical_status', ''),
        audit_data.get('has_llms_txt', False),
        audit_data.get('ai_bots_allowed', ''),
        json.dumps(audit_data.get('flaws', [])),
        json.dumps(audit_data.get('opportunities', [])),
        json.dumps(audit_data.get('raw', {})),
        audit_data.get('revenue_leak_monthly_inr', 0),
        audit_data.get('report_html_path', ''),
        audit_data.get('report_pdf_path', '')
    ))
    audit_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return audit_id

def create_order(order_data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO orders (
            order_id, lead_id, audit_id, package_tier, amount_inr, amount_usd, 
            currency, payment_method, payment_status, upi_uri, upi_qr_base64
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order_data['order_id'],
        order_data['lead_id'],
        order_data['audit_id'],
        order_data['package_tier'],
        order_data['amount_inr'],
        order_data['amount_usd'],
        order_data.get('currency', 'INR'),
        order_data.get('payment_method', 'UPI_DIRECT'),
        order_data.get('payment_status', 'PENDING'),
        order_data.get('upi_uri', ''),
        order_data.get('upi_qr_base64', '')
    ))
    order_pk = cursor.lastrowid
    conn.commit()
    conn.close()
    return order_pk

def mark_order_paid(order_id: str, payment_ref: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute("""
        UPDATE orders 
        SET payment_status = 'COMPLETED', payment_ref = ?, paid_at = ?
        WHERE order_id = ?
    """, (payment_ref, now, order_id))
    
    # Also update lead status to PAID
    cursor.execute("""
        UPDATE leads 
        SET status = 'PAID', updated_at = ?
        WHERE id = (SELECT lead_id FROM orders WHERE order_id = ?)
    """, (now, order_id))
    
    success = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return success

def get_audit_by_token(token: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT a.*, l.domain, l.target_url, l.company_name, l.contact_email, l.contact_phone, l.country, l.status as lead_status
        FROM audits a
        JOIN leads l ON a.lead_id = l.id
        WHERE a.audit_token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d['flaws'] = json.loads(d['flaws_json']) if d['flaws_json'] else []
    d['opportunities'] = json.loads(d['opportunities_json']) if d['opportunities_json'] else []
    return d

def get_metrics_summary() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM leads")
    total_leads = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM audits")
    total_audits = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM orders WHERE payment_status = 'COMPLETED'")
    paid_orders = cursor.fetchone()[0]
    
    cursor.execute("SELECT COALESCE(SUM(amount_inr), 0) FROM orders WHERE payment_status = 'COMPLETED'")
    total_revenue_inr = cursor.fetchone()[0]
    
    cursor.execute("SELECT COALESCE(SUM(revenue_leak_monthly_inr), 0) FROM audits")
    total_leak_uncovered = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT o.order_id, o.amount_inr, o.package_tier, o.payment_status, o.created_at, l.domain, l.company_name
        FROM orders o
        JOIN leads l ON o.lead_id = l.id
        ORDER BY o.id DESC LIMIT 10
    """)
    recent_orders = [dict(r) for r in cursor.fetchall()]
    
    conn.close()
    return {
        "total_leads": total_leads,
        "total_audits": total_audits,
        "paid_orders": paid_orders,
        "total_revenue_inr": total_revenue_inr,
        "total_leak_uncovered": total_leak_uncovered,
        "recent_orders": recent_orders
    }

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at", DB_PATH)
