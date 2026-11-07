#!/bin/bash
# Scriza Autonomous Revenue Machine (S-ARM)
# Production Launch Script

cd "$(dirname "$0")"

echo "=========================================================="
echo " Starting Scriza Autonomous Revenue Machine (S-ARM)"
echo " Environment: Production Daemon"
echo " Host: 0.0.0.0 | Port: 8765"
echo "=========================================================="

# Check Python and dependencies
python3 -c "import fastapi, uvicorn, qrcode, httpx, bs4, jinja2; print('✓ All core dependencies verified')" || {
    echo "Error: Missing dependencies. Run: pip3 install fastapi uvicorn qrcode httpx beautifulsoup4 jinja2"
    exit 1
}

# Ensure reports directory exists
mkdir -p reports

# Launch Uvicorn server
exec python3 -m uvicorn app:app --host 0.0.0.0 --port 8765 --workers 2
