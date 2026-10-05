import urllib.request
import urllib.parse
import json
import sys

BASE_PROXY = "http://127.0.0.1:5173/api"
BASE_BACKEND = "http://localhost:8080/api"
BASE_AI = "http://127.0.0.1:8000"

results = {
    "passed": 0,
    "failed": 0,
    "tests": []
}

def record(name, success, details=""):
    results["tests"].append({"name": name, "success": success, "details": details})
    if success:
        results["passed"] += 1
        print(f"  [PASS] {name} - {details}")
    else:
        results["failed"] += 1
        print(f"  [FAIL] {name} - {details}")

def http_json(url, method="GET", data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content)
        except Exception:
            return e.code, {"error": content}
    except Exception as e:
        return 0, {"error": str(e)}

print("\n--- 1. Testing AI Service Connectivity directly on :8000 ---")
code, res = http_json(f"{BASE_AI}/health")
record("AI Health Check (:8000)", code == 200 and res.get("status") == "UP", f"status={res.get('status')}, nodes={res.get('nodes_loaded')}, edges={res.get('edges_loaded')}")

code, res = http_json(f"{BASE_AI}/ml/network-analysis", method="POST", data={})
data = res.get("data", {})
record("AI Network Analysis Direct (POST)", code == 200 and res.get("success") is True and "total_nodes" in data, f"code={code}, nodes={data.get('total_nodes')}, density={data.get('density')}")

code, res = http_json(f"{BASE_AI}/ml/community-detection", method="POST", data={})
data = res.get("data", {})
record("AI Community Detection Direct (POST)", code == 200 and res.get("success") is True and "communities" in data, f"code={code}, communities={len(data.get('communities', []))}, modularity={data.get('modularity_score')}")

code, res = http_json(f"{BASE_AI}/ml/anomaly-detection", method="POST", data={})
data = res.get("data", {})
record("AI Anomaly Detection Direct (POST)", code == 200 and res.get("success") is True and "anomalies" in data, f"code={code}, anomalies={len(data.get('anomalies', []))}")

code, res = http_json(f"{BASE_AI}/ml/link-prediction", method="POST", data={})
data = res.get("data", {})
record("AI Link Prediction Direct (POST)", code == 200 and res.get("success") is True and "candidates" in data, f"code={code}, candidates={len(data.get('candidates', []))}")

code, res = http_json(f"{BASE_AI}/ml/model-info")
record("AI Model Info Direct (GET)", code == 200 and "models" in res, f"code={code}, models={len(res.get('models', []))}")

print("\n--- 2. Testing Authentication across all roles via Vite dev proxy :5173 ---")
roles = [
    ("investigator", "Password@123", "ROLE_INVESTIGATOR"),
    ("admin", "Password@123", "ROLE_ADMIN"),
    ("analyst", "Password@123", "ROLE_ANALYST"),
    ("viewer", "Password@123", "ROLE_VIEWER"),
]

tokens = {}
for username, password, expected_role in roles:
    code, res = http_json(f"{BASE_PROXY}/auth/login", method="POST", data={"username": username, "password": password})
    user_data = res.get("data", {}) if isinstance(res, dict) else {}
    token = user_data.get("token")
    role = user_data.get("role")
    tokens[username] = token
    record(f"Login {username}", code == 200 and role == expected_role and token is not None, f"token={bool(token)}, role={role}")

investigator_token = tokens.get("investigator")

print("\n--- 3. Testing Backend Endpoints via Vite dev proxy :5173 ---")
endpoints = [
    ("Dashboard Summary", "/dashboard/summary"),
    ("Cases List", "/cases"),
    ("Case Detail by ID 1", "/cases/1"),
    ("Case Detail by Number CASE-2026-0001", "/cases/number/CASE-2026-0001"),
    ("Persons List", "/persons"),
    ("Person Detail ID 1", "/persons/1"),
    ("Network Graph", "/network"),
    ("Evidence Records", "/evidence"),
    ("Incidents Registry", "/incidents"),
    ("Organizations", "/organizations"),
    ("Vehicles Registry", "/vehicles"),
    ("Locations Registry", "/locations"),
    ("Communications Traffic", "/communications"),
    ("Alerts", "/alerts"),
    ("Audit Logs", "/audit-logs"),
    ("Data Sources", "/data-sources"),
    ("Search Query 'Marcus'", "/search?q=Marcus"),
]

for name, path in endpoints:
    code, res = http_json(f"{BASE_PROXY}{path}", token=investigator_token)
    ok = (code == 200)
    count_info = ""
    if isinstance(res, dict):
        if isinstance(res.get("data"), list):
            count_info = f", items={len(res['data'])}"
        elif isinstance(res.get("data"), dict):
            count_info = f", keys={list(res['data'].keys())[:4]}"
        elif "success" in res:
            count_info = f", success={res.get('success')}"
    elif isinstance(res, list):
        count_info = f", items={len(res)}"
    record(name, ok, f"code={code}{count_info}")

print("\n--- 4. Testing AI Proxied Endpoints via Backend :8080 / Vite :5173 ---")
ai_proxied = [
    ("AI ML Dashboard proxied (GET)", "/ml/dashboard", "GET", None),
    ("AI ML Network Analysis proxied (POST)", "/ml/network-analysis", "POST", {}),
    ("AI ML Community Detection proxied (POST)", "/ml/community-detection", "POST", {}),
    ("AI ML Anomaly Detection proxied (POST)", "/ml/anomaly-detection", "POST", {}),
    ("AI ML Link Prediction proxied (POST)", "/ml/link-prediction", "POST", {}),
    ("AI ML Models Info proxied (GET)", "/ml/models", "GET", None),
]

for name, path, method, data in ai_proxied:
    code, res = http_json(f"{BASE_PROXY}{path}", method=method, data=data, token=investigator_token)
    ok = code == 200
    record(name, ok, f"code={code}")

print("\n--- 5. Security & Unauthorized Verification ---")
code, res = http_json(f"{BASE_PROXY}/dashboard/summary")
record("Unauthorized rejection (No Token)", code == 401, f"code={code}")

code, res = http_json(f"{BASE_PROXY}/auth/login", method="POST", data={"username": "invalid_user", "password": "WrongPassword"})
record("Invalid credentials rejection", code in (400, 401, 403, 500), f"code={code}")

print("\n================ QA SUITE SUMMARY ================")
print(f"Total Tests Run: {results['passed'] + results['failed']}")
print(f"Passed: {results['passed']}")
print(f"Failed: {results['failed']}")
if results["failed"] == 0:
    print("ALL FUNCTIONAL ENDPOINT TESTS PASSED SUCCESSFULLY!")
else:
    print("WARNING: SOME TESTS FAILED.")
    sys.exit(1)
