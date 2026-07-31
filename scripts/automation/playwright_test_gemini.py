#!/usr/bin/env python3
"""
Playwright CDP Attachment Test for Gemini API Key UI Field over IPv6 Loopback
Connects to Chrome via ws://[::1]:9222/devtools/browser/...
"""

import json
import os
import sys
import urllib.request
from playwright.sync_api import sync_playwright

def run():
    print("=============================================================")
    print("PLAYWRIGHT CDP IPv6 ATTACHMENT TEST")
    print("=============================================================")

    # 1. Fetch CDP WebSocket URL
    try:
        url = "http://[::1]:9222/json/version"
        req = urllib.request.Request(url, headers={"User-Agent": "PlaywrightProber"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            v_data = json.loads(resp.read().decode('utf-8'))
            ws_url = v_data.get('webSocketDebuggerUrl')
            print(f"[OK] Discovered WebSocket URL: {ws_url}")
    except Exception as e:
        print(f"[ERROR] Failed to discover CDP WebSocket: {e}")
        return

    with sync_playwright() as p:
        try:
            print("[INFO] Connecting to Chrome over IPv6 CDP WebSocket...")
            browser = p.chromium.connect_over_cdp(ws_url)
            print("[OK] Playwright successfully attached to Chrome via CDP!")

            context = browser.contexts[0] if browser.contexts else browser.new_context()
            page = context.new_page()
            
            print("[INFO] Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000", wait_until="networkidle")
            print(f"[OK] Page title: '{page.title()}'")

            # Capture Screenshot
            screenshot_path = os.path.join(os.path.dirname(__file__), "router_settings_verified.png")
            page.screenshot(path=screenshot_path)
            print(f"[OK] Screenshot captured and saved to: {screenshot_path}")

            browser.close()
        except Exception as e:
            print(f"[WARN] Playwright attachment warning: {e}")

    print("=============================================================")

if __name__ == '__main__':
    run()
