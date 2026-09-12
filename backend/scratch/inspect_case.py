import urllib.request
import json

req = urllib.request.urlopen("http://localhost:8000/api/cases/CG-2026-9185E6")
case = json.loads(req.read().decode())

print("=== CASE DETAILS ===")
print("ID:", case.get("caseId"))
print("Name:", case.get("childName"))
print("Risk Score:", case.get("riskScore"))
print("Risk Reasoning:", case.get("riskReasoning"))

print("\n=== TRAFFICKING CROSS-VERIFICATION ===")
print("Photo Hash:", case.get("photoHash"))
print("Trafficking Matches:", case.get("traffickingMatches"))

print("\n=== TRANSIT CORRIDOR PATTERN PREDICTIONS ===")
print(json.dumps(case.get("patternPredictions"), indent=2))

print("\n=== AUDIT TRAIL LOG ===")
for entry in case.get("auditLog", []):
    print(f"- [{entry.get('agentName')}] -> {entry.get('action')}")
    print(f"  Reasoning: {entry.get('reasoning')}")
