#!/usr/bin/env python3
"""
Playwright End-to-End Investigation & Interaction Script
Attaches to Chrome over IPv6 CDP WebSocket (ws://[::1]:9222), opens http://localhost:3000,
clicks 'AI Router & Gemini Setup', locates the Gemini API Key input field, types a key,
clicks 'Save AI Configuration', and captures screenshot evidence.
"""

import json
import os
import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

def run_investigation():
    print("=============================================================")
    print("PLAYWRIGHT CDP E2E GEMINI API KEY FIELD INTERACTION TEST")
    print("=============================================================")

    # 1. Discover CDP WebSocket URL
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
            print("[INFO] Connecting Playwright to Chrome over IPv6 CDP...")
            browser = p.chromium.connect_over_cdp(ws_url)
            print("[OK] Playwright attached to active Chrome process.")

            context = browser.contexts[0] if browser.contexts else browser.new_context()
            page = context.new_page()

            print("[INFO] Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000", wait_until="networkidle")
            print(f"[OK] Loaded page: '{page.title()}'")

            # 2. Click 'AI Assistant & Insights' in Sidebar
            print("[INFO] Clicking 'AI Assistant & Insights' in sidebar...")
            page.click("text='AI Assistant & Insights'")
            page.wait_for_timeout(1000)

            # Click 'Router Settings' tab button
            print("[INFO] Clicking 'Router Settings' tab button...")
            page.get_by_role("button", name="Router Settings").click()
            print("[OK] Clicked 'Router Settings' tab button.")
            page.wait_for_timeout(1000)

            # 3. Locate Gemini API Key Input Field
            print("[INFO] Scanning all input elements on page...")
            inputs = page.query_selector_all("input")
            print(f"[INFO] Found {len(inputs)} input elements on page:")
            for inp in inputs:
                p_text = inp.get_attribute("placeholder")
                t_type = inp.get_attribute("type")
                v_val = inp.get_attribute("value")
                print(f"  - Input type='{t_type}' placeholder='{p_text}' value='{v_val}'")

            key_input = page.query_selector("input[type='password']") or page.query_selector("input[placeholder*='Gemini']")

            if key_input:
                print("=============================================================")
                print("[SUCCESS] GOOGLE GEMINI API KEY INPUT FIELD LOCATED IN UI!")
                print("=============================================================")
                key_input.fill("AIzaSy_PLAYWRIGHT_VERIFIED_KEY_2026")

                # Click Save AI Configuration
                print("[INFO] Clicking 'Save AI Configuration' button...")
                save_btn = page.query_selector("button:has-text('Save AI Configuration')")
                if save_btn:
                    save_btn.click()
                    page.wait_for_timeout(1000)
                    print("[OK] Clicked 'Save AI Configuration'.")

            # Capture Screenshot
            screenshot_path = os.path.join(os.path.dirname(__file__), "playwright_gemini_setup_verified.png")
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"[OK] Full-page screenshot saved to: {screenshot_path}")

            browser.close()
        except Exception as e:
            print(f"[ERROR] Playwright interaction failed: {e}")

    print("=============================================================")

if __name__ == '__main__':
    run_investigation()
