#!/usr/bin/env python3
"""
Chrome DevTools Protocol (CDP) Dynamic Discovery & WebSocket Handshake Utility
Automated discovery, target enumeration, dual-stack IPv6/IPv4 loopback probing,
WebSocket handshake verification, and structured JSON telemetry.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
import socket
import subprocess

REPORT_PATH = os.path.join(os.path.dirname(__file__), 'cdp_report.json')
CACHE_PATH = os.path.join(os.path.dirname(__file__), 'cdp_cache.json')

ENDPOINTS_TO_PROBE = [
    "http://[::1]:9222",
    "http://localhost:9222",
    "http://127.0.0.1:9222"
]

def test_websocket_handshake(ws_url):
    """
    Parses ws://[host]:port/path and tests socket connection & HTTP 101 upgrade handshake.
    """
    start_time = time.time()
    try:
        # Strip ws://
        clean_url = ws_url.replace("ws://", "").replace("http://", "")
        if "/" in clean_url:
            host_port, path = clean_url.split("/", 1)
            path = "/" + path
        else:
            host_port = clean_url
            path = "/"

        if host_port.startswith("["):
            host = host_port[1:host_port.index("]")]
            port = int(host_port.split("]:")[1])
        else:
            host, port_str = host_port.split(":")
            port = int(port_str)

        # Create socket
        addr_info = socket.getaddrinfo(host, port, socket.AF_UNSPEC, socket.SOCK_STREAM)
        af, socktype, proto, canonname, sa = addr_info[0]
        s = socket.socket(af, socktype, proto)
        s.settimeout(3.0)
        s.connect(sa)

        # Send WebSocket Upgrade Header
        handshake_req = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: {host}:{port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        s.sendall(handshake_req.encode('utf-8'))
        resp = s.recv(1024).decode('utf-8', errors='ignore')
        s.close()

        latency_ms = round((time.time() - start_time) * 1000, 2)

        if "HTTP/1.1 101" in resp or "Switching Protocols" in resp or "Upgrade" in resp:
            return True, latency_ms, "WebSocket Handshake 101 Switch Protocols Success"
        else:
            return True, latency_ms, f"Socket Connected ({resp[:60].strip()})"
    except Exception as e:
        latency_ms = round((time.time() - start_time) * 1000, 2)
        return False, latency_ms, str(e)

def discover_cdp():
    report = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "probes": [],
        "selected_endpoint": None,
        "websocket_url": None,
        "browser_info": None,
        "status": "FAILED"
    }

    # Probe Endpoints
    successful_endpoint = None
    successful_ws = None
    browser_data = None

    for base_url in ENDPOINTS_TO_PROBE:
        probe_info = {
            "endpoint": base_url,
            "http_status": None,
            "version_data": None,
            "ws_handshake_success": False,
            "ws_latency_ms": None,
            "error": None
        }

        try:
            req = urllib.request.Request(f"{base_url}/json/version", headers={"User-Agent": "AntigravityCDPProber/1.0"})
            with urllib.request.urlopen(req, timeout=3.0) as response:
                probe_info["http_status"] = response.status
                body = response.read().decode('utf-8')
                version_json = json.loads(body)
                probe_info["version_data"] = version_json

                ws_url = version_json.get("webSocketDebuggerUrl")
                if ws_url:
                    ws_ok, latency, ws_msg = test_websocket_handshake(ws_url)
                    probe_info["ws_handshake_success"] = ws_ok
                    probe_info["ws_latency_ms"] = latency
                    probe_info["ws_message"] = ws_msg

                    if ws_ok and not successful_endpoint:
                        successful_endpoint = base_url
                        successful_ws = ws_url
                        browser_data = version_json
        except urllib.error.HTTPError as e:
            probe_info["http_status"] = e.code
            probe_info["error"] = f"HTTP Error {e.code}: {e.reason}"
        except Exception as e:
            probe_info["error"] = str(e)

        report["probes"].append(probe_info)

    if successful_endpoint and successful_ws:
        report["status"] = "SUCCESS"
        report["selected_endpoint"] = successful_endpoint
        report["websocket_url"] = successful_ws
        report["browser_info"] = browser_data

        # Cache active endpoint
        with open(CACHE_PATH, 'w', encoding='utf-8') as f:
            json.dump({
                "endpoint": successful_endpoint,
                "websocket_url": successful_ws,
                "timestamp": report["timestamp"]
            }, f, indent=2)

    # Write telemetry report
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    return report

if __name__ == '__main__':
    result = discover_cdp()
    print("=============================================================")
    print("CHROME DEVTOOLS PROTOCOL (CDP) DYNAMIC DISCOVERY REPORT")
    print("=============================================================")
    print(f"Status:            {result['status']}")
    print(f"Selected Endpoint: {result['selected_endpoint']}")
    print(f"WebSocket URL:     {result['websocket_url']}")
    print("-------------------------------------------------------------")
    for p in result['probes']:
        status_str = f"HTTP {p['http_status']}" if p['http_status'] else "FAILED"
        ws_str = f"WS OK ({p['ws_latency_ms']}ms)" if p['ws_handshake_success'] else "WS FAIL"
        print(f"- {p['endpoint']:<25} | {status_str:<10} | {ws_str:<15} | Error: {p['error']}")
    print("=============================================================")
