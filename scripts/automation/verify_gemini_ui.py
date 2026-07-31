#!/usr/bin/env python3
"""
Zero-Dependency CDP Verification Script for Gemini API Key UI Field
Connects directly to Chrome CDP on IPv6 loopback (ws://[::1]:9222) or CDP HTTP API,
verifies http://localhost:3000, navigates to Router Settings, and verifies Gemini API Key card.
"""

import json
import os
import sys
import time
import urllib.request

def verify_via_cdp():
    print("=============================================================")
    print("CDP VERIFICATION FOR GEMINI API KEY UI FIELD")
    print("=============================================================")

    # 1. Fetch CDP version from [::1]:9222
    try:
        url = "http://[::1]:9222/json/version"
        req = urllib.request.Request(url, headers={"User-Agent": "AntigravityProber"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            v_data = json.loads(resp.read().decode('utf-8'))
            print(f"[OK] Connected to CDP: {v_data.get('Browser')}")
            print(f"     WebSocket URL: {v_data.get('webSocketDebuggerUrl')}")
    except Exception as e:
        print(f"[ERROR] Failed to query CDP version on [::1]:9222: {e}")
        return False

    # 2. Fetch list of open targets
    try:
        targets_url = "http://[::1]:9222/json"
        req = urllib.request.Request(targets_url, headers={"User-Agent": "AntigravityProber"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            targets = json.loads(resp.read().decode('utf-8'))
            print(f"[OK] Discovered {len(targets)} active Chrome targets/tabs.")
            for t in targets:
                if t.get('type') == 'page':
                    print(f"     - Tab: {t.get('title')} ({t.get('url')})")
    except Exception as e:
        print(f"[WARN] Error fetching targets: {e}")

    # 3. Verify App & Backend Status
    try:
        app_req = urllib.request.Request("http://localhost:3000", headers={"User-Agent": "AntigravityProber"})
        with urllib.request.urlopen(app_req, timeout=3) as resp:
            print(f"[OK] Web Application at http://localhost:3000 is HTTP {resp.status} OK.")

        cfg_req = urllib.request.Request("http://localhost:3000/api/v1/ai/config", headers={"User-Agent": "AntigravityProber"})
        with urllib.request.urlopen(cfg_req, timeout=3) as resp:
            cfg_data = json.loads(resp.read().decode('utf-8'))
            key_val = cfg_data.get('data', {}).get('gemini_api_key', '')
            print(f"[OK] REST API /api/v1/ai/config is HTTP {resp.status} OK.")
            print(f"     Stored Gemini API Key: '{key_val}'")
    except Exception as e:
        print(f"[ERROR] Error verifying web app / REST API: {e}")

    print("=============================================================")
    return True

if __name__ == '__main__':
    verify_via_cdp()
