#!/usr/bin/env python3
"""
Playwright Script to Save User Gemini API Key into Router Settings
Connects to Chrome via IPv6 CDP (ws://[::1]:9222), fills user key, clicks Save,
and verifies MySQL 0_ai_config persistence via REST API.
"""

import json
import os
import sys
import time
import urllib.request
from playwright.sync_api import sync_playwright

USER_KEY = os.getenv('GEMINI_API_KEY', '')

def run_save():
    print("=============================================================")
    print("SAVING USER GEMINI API KEY VIA PLAYWRIGHT & CDP")
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
            print("[OK] Playwright attached to Chrome.")

            context = browser.contexts[0] if browser.contexts else browser.new_context()
            page = context.new_page()

            print("[INFO] Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000", wait_until="networkidle")

            print("[INFO] Navigating to AI Assistant & Insights -> Router Settings...")
            page.click("text='AI Assistant & Insights'")
            page.wait_for_timeout(1000)
            page.get_by_role("button", name="Router Settings").click()
            page.wait_for_timeout(1000)

            # Locate Gemini Key input field
            print("[INFO] Filling user Gemini API key into input field...")
            key_input = page.query_selector("input[type='password']") or page.query_selector("input[placeholder*='Gemini']")
            if key_input:
                key_input.fill(USER_KEY)
                print("[OK] User Gemini API key filled into UI.")

                print("[INFO] Clicking 'Save AI Configuration' button...")
                page.click("button:has-text('Save AI Configuration')")
                page.wait_for_timeout(1500)
                print("[OK] Clicked 'Save AI Configuration'.")

            # Capture Screenshot
            screenshot_path = os.path.join(os.path.dirname(__file__), "key_saved_successfully.png")
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"[OK] Screenshot saved to: {screenshot_path}")

            browser.close()
        except Exception as e:
            print(f"[ERROR] Save key script error: {e}")

    # Verify persistence via REST API
    print("-------------------------------------------------------------")
    print("[INFO] Verifying backend database persistence via REST API...")
    try:
        cfg_req = urllib.request.Request("http://localhost:3000/api/v1/ai/config", headers={"User-Agent": "AntigravityProber"})
        with urllib.request.urlopen(cfg_req, timeout=3) as resp:
            cfg_data = json.loads(resp.read().decode('utf-8'))
            saved_key = cfg_data.get('data', {}).get('gemini_api_key', '')
            print(f"[OK] REST API returned stored key: '{saved_key}'")
            if saved_key == USER_KEY:
                print("=============================================================")
                print("[SUCCESS] USER GEMINI API KEY IS SUCCESSFULLY SAVED & PERSISTED!")
                print("=============================================================")
            else:
                print(f"[WARN] Key mismatch! Expected '{USER_KEY}', got '{saved_key}'")
    except Exception as e:
        print(f"[ERROR] Verification failed: {e}")

if __name__ == '__main__':
    run_save()
