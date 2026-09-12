import os
import uuid
import datetime
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore

from pydantic import BaseModel
from models import CaseCreate, SightingCreate, SightingDB
from graph import case_app, sighting_app

# Initialize Firebase Admin SDK
try:
    if firebase_admin._apps:
        fb_app = firebase_admin.get_app()
    elif os.path.exists("serviceAccountKey.json"):
        cred = credentials.Certificate("serviceAccountKey.json")
        fb_app = firebase_admin.initialize_app(cred)
    else:
        print("Running without real Firebase auth - assuming emulator or mock DB")
        fb_app = firebase_admin.initialize_app()
    
    db = firestore.client(app=fb_app)
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK (continuing in mock mode): {e}")
    db = None

# Mock DB for hackathon fallback - starts completely empty
mock_db = {
    "missingChildren": {},
    "sightings": {}
}

app = FastAPI(title="ChildGuard Backend API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ChildGuard Backend is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/cases")
def create_case(case_data: CaseCreate):
    raw_data = case_data.model_dump()
    
    # 1. Run LangGraph Case Workflow
    initial_state = {
        "case_data": raw_data,
        "audit_log": []
    }
    
    final_state = case_app.invoke(initial_state)
    
    if not final_state.get("is_valid"):
        raise HTTPException(status_code=400, detail=final_state.get("validation_error", "Invalid Case Data"))
        
    case_db = final_state["case"]
    
    # Add graph outputs to the DB object
    doc_data = case_db.model_dump()
    doc_data["photoHash"] = final_state.get("photo_hash")
    doc_data["patternPredictions"] = final_state.get("pattern_predictions")
    doc_data["alertDistributed"] = final_state.get("alert_distributed")
    doc_data["auditLog"] = final_state.get("audit_log")
    
    case_id = case_db.caseId
    
    # 2. Save to Firestore
    try:
        if db:
            db.collection("missingChildren").document(case_id).set(doc_data)
        else:
            mock_db["missingChildren"][case_id] = doc_data
            
        return {"message": "Case registered successfully", "caseId": case_id, "riskScore": case_db.riskScore}
    except Exception as e:
        print(f"DB Error: {e}")
        # fallback to mock
        mock_db["missingChildren"][case_id] = doc_data
        return {"message": "Case registered successfully (Mock DB)", "caseId": case_id, "riskScore": case_db.riskScore}

@app.get("/api/cases")
def list_cases(status: Optional[str] = "open"):
    cases = []
    if db:
        query = db.collection("missingChildren")
        if status and status != "all":
            query = query.where("status", "==", status)
        docs = query.stream()
        cases = [doc.to_dict() for doc in docs]
    else:
        cases = [c for c in mock_db["missingChildren"].values() if (not status or status == "all" or c.get("status") == status)]
        
    return cases

@app.get("/api/cases/{caseId}")
def get_case(caseId: str):
    if db:
        doc = db.collection("missingChildren").document(caseId).get()
        if doc.exists:
            return doc.to_dict()
    else:
        if caseId in mock_db["missingChildren"]:
            return mock_db["missingChildren"][caseId]
            
    raise HTTPException(status_code=404, detail="Case not found")

@app.delete("/api/cases")
def clear_all_cases():
    mock_db["missingChildren"].clear()
    mock_db["sightings"].clear()
    if db:
        try:
            for doc in db.collection("missingChildren").stream():
                doc.reference.delete()
        except Exception as e:
            print(f"Error clearing Firestore: {e}")
    return {"message": "All cases and sightings cleared"}

@app.delete("/api/cases/{caseId}")
def delete_case(caseId: str):
    if caseId in mock_db["missingChildren"]:
        del mock_db["missingChildren"][caseId]
    if caseId in mock_db["sightings"]:
        del mock_db["sightings"][caseId]
    if db:
        try:
            db.collection("missingChildren").document(caseId).delete()
        except Exception as e:
            print(f"Error deleting case from Firestore: {e}")
    return {"message": f"Case {caseId} deleted"}

@app.post("/api/cases/{caseId}/sightings")
def create_sighting(caseId: str, sighting_data: SightingCreate):
    # 1. Fetch Case
    case_dict = None
    if db:
        doc = db.collection("missingChildren").document(caseId).get()
        if doc.exists:
            case_dict = doc.to_dict()
    else:
        case_dict = mock_db["missingChildren"].get(caseId)
        
    if not case_dict:
        raise HTTPException(status_code=404, detail="Case not found")
        
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    sighting_id = f"SGT-{(str(uuid.uuid4())[:6]).upper()}"
    
    raw_sighting = sighting_data.model_dump()
    sighting_db = SightingDB(
        **raw_sighting,
        sightingId=sighting_id,
        timestamp=now_iso
    )
    
    # 2. Run LangGraph Sighting Workflow
    initial_state = {
        "sighting": sighting_db,
        "case": case_dict # Passed as dict, models.py handles nested instantiation ideally or we adapt
    }
    
    final_state = sighting_app.invoke(initial_state)
    processed_sighting = final_state["sighting"]
    sighting_doc = processed_sighting.model_dump()
    sighting_doc["reasoning"] = final_state.get("reasoning", "")
    
    # 3. Save to DB
    try:
        if db:
            db.collection("missingChildren").document(caseId).collection("sightings").document(sighting_id).set(sighting_doc)
        else:
            if caseId not in mock_db["sightings"]:
                mock_db["sightings"][caseId] = {}
            mock_db["sightings"][caseId][sighting_id] = sighting_doc
            
        return {"message": "Sighting submitted successfully", "sightingId": sighting_id, "confidenceLabel": processed_sighting.confidenceLabel}
    except Exception as e:
        print(f"DB Error: {e}")
        if caseId not in mock_db["sightings"]:
            mock_db["sightings"][caseId] = {}
        mock_db["sightings"][caseId][sighting_id] = sighting_doc
        return {"message": "Sighting submitted successfully (Mock DB)", "sightingId": sighting_id, "confidenceLabel": processed_sighting.confidenceLabel}

@app.get("/api/cases/{caseId}/sightings")
def get_sightings(caseId: str):
    sightings = []
    if db:
        docs = db.collection("missingChildren").document(caseId).collection("sightings").stream()
        sightings = [doc.to_dict() for doc in docs]
    else:
        if caseId in mock_db["sightings"]:
            sightings = list(mock_db["sightings"][caseId].values())
            
    # Sort by credibility score desc
    sightings.sort(key=lambda x: x.get("credibilityScore", 0), reverse=True)
    return sightings

class SightingStatusUpdate(BaseModel):
    status: str = "dispatched"  # "dispatched" (or "verified") or "dismissed"
    officerNotes: Optional[str] = ""
    officerUid: Optional[str] = ""

@app.patch("/api/cases/{caseId}/sightings/{sightingId}")
def update_sighting_status(caseId: str, sightingId: str, update: SightingStatusUpdate):
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    norm_status = "dispatched" if update.status in ["verified", "dispatched"] else "dismissed"
    
    sighting_found = False
    
    if db:
        try:
            s_ref = db.collection("missingChildren").document(caseId).collection("sightings").document(sightingId)
            doc = s_ref.get()
            if doc.exists:
                sighting_found = True
                s_data = doc.to_dict()
                sighting_location_addr = s_data.get("location", {}).get("address", "reported location")
                s_ref.update({
                    "status": norm_status,
                    "verifiedBy": update.officerUid or "duty_officer",
                    "officerNotes": update.officerNotes or "",
                    "verifiedAt": now_iso
                })
                
                # Append to case audit log
                c_ref = db.collection("missingChildren").document(caseId)
                c_doc = c_ref.get()
                if c_doc.exists:
                    c_data = c_doc.to_dict()
                    audit_log = c_data.get("auditLog", [])
                    action = "Physical Intercept Dispatched" if norm_status == "dispatched" else "Sighting Lead Dismissed"
                    reasoning = (
                        f"Duty officer confirmed {s_data.get('credibilityScore', 0)}% biometric match. Regional patrol & transit intercept units dispatched to: {sighting_location_addr}."
                        if norm_status == "dispatched"
                        else f"Duty officer dismissed sighting #{sightingId} as non-matching community submission."
                    )
                    audit_log.append({
                        "agentName": "Officer Intercept Console",
                        "action": action,
                        "reasoning": reasoning,
                        "timestamp": now_iso
                    })
                    c_ref.update({"auditLog": audit_log})
        except Exception as e:
            print(f"Error updating sighting in Firestore: {e}")
            
    if caseId in mock_db["sightings"] and sightingId in mock_db["sightings"][caseId]:
        sighting_found = True
        mock_db["sightings"][caseId][sightingId]["status"] = norm_status
        mock_db["sightings"][caseId][sightingId]["verifiedAt"] = now_iso
        
        if caseId in mock_db["missingChildren"]:
            audit_log = mock_db["missingChildren"][caseId].get("auditLog", [])
            action = "Physical Intercept Dispatched" if norm_status == "dispatched" else "Sighting Lead Dismissed"
            audit_log.append({
                "agentName": "Officer Intercept Console",
                "action": action,
                "reasoning": f"Duty officer confirmed biometric match. Regional patrol & transit intercept units dispatched.",
                "timestamp": now_iso
            })
            mock_db["missingChildren"][caseId]["auditLog"] = audit_log

    if not sighting_found:
        raise HTTPException(status_code=404, detail="Sighting not found")
        
    dispatch_pkg = {
        "channel": "SEC-INTERCEPT-ALPHA (462.575 MHz)",
        "assignedUnits": [
            {"callsign": "PCR-04", "type": "Sector Beat Mobile Patrol", "status": "Dispatched", "eta": "3 min"},
            {"callsign": "RPF-02", "type": "Transit & Railway Intercept Team", "status": "En Route", "eta": "5 min"},
            {"callsign": "HWP-09", "type": "Highway Corridor Intercept", "status": "Checkpoint Active", "eta": "7 min"}
        ],
        "targetLocation": sighting_location_addr if sighting_found else "Target Sighting Location",
        "dispatchedAt": now_iso
    } if norm_status == "dispatched" else None

    return {
        "message": "Physical intercept dispatched successfully" if norm_status == "dispatched" else "Sighting lead dismissed",
        "caseId": caseId,
        "sightingId": sightingId,
        "status": norm_status,
        "dispatchPackage": dispatch_pkg
    }

class InterceptResolution(BaseModel):
    outcome: str  # "found" or "not_found"
    unitCallsign: str = "PCR-04"
    officerName: str = "Sub-Inspector R. Sawant"
    location: str = "Panaji Bus Terminal"
    condition: Optional[str] = "Safe and uninjured"
    notes: Optional[str] = ""

@app.post("/api/cases/{caseId}/intercept-resolution")
def resolve_intercept(caseId: str, resolution: InterceptResolution):
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    is_found = resolution.outcome == "found"
    new_status = "found" if is_found else "open"
    
    action = "SUBJECT SAFELY RECOVERED & SECURED" if is_found else "Field Sweep Completed - Subject Not Located"
    reasoning = (
        f"Unit {resolution.unitCallsign} ({resolution.officerName}) confirmed positive physical intercept at {resolution.location}. "
        f"Subject condition: {resolution.condition}. Notes: {resolution.notes}. Case transitioned to RECOVERED."
        if is_found
        else f"Unit {resolution.unitCallsign} ({resolution.officerName}) conducted physical sweep of {resolution.location}. "
        f"Negative visual contact. Notes: {resolution.notes}. Expanding velocity search perimeter."
    )
    
    # 1. Update Firestore
    if db:
        try:
            c_ref = db.collection("missingChildren").document(caseId)
            doc = c_ref.get()
            if doc.exists:
                c_data = doc.to_dict()
                audit_log = c_data.get("auditLog", [])
                audit_log.append({
                    "agentName": f"Field Intercept Unit ({resolution.unitCallsign})",
                    "action": action,
                    "reasoning": reasoning,
                    "timestamp": now_iso
                })
                update_fields = {
                    "auditLog": audit_log,
                    "updatedAt": now_iso
                }
                if is_found:
                    update_fields["status"] = "found"
                    update_fields["recoveredAt"] = now_iso
                    update_fields["recoveryLocation"] = resolution.location
                    update_fields["recoveryOfficer"] = f"{resolution.officerName} ({resolution.unitCallsign})"
                    update_fields["alertDistributed"] = False  # Deactivate emergency geofence
                c_ref.update(update_fields)
        except Exception as e:
            print(f"Error updating case resolution in Firestore: {e}")
            
    # Update mock_db
    if caseId in mock_db["missingChildren"]:
        audit_log = mock_db["missingChildren"][caseId].get("auditLog", [])
        audit_log.append({
            "agentName": f"Field Intercept Unit ({resolution.unitCallsign})",
            "action": action,
            "reasoning": reasoning,
            "timestamp": now_iso
        })
        mock_db["missingChildren"][caseId]["auditLog"] = audit_log
        if is_found:
            mock_db["missingChildren"][caseId]["status"] = "found"
            mock_db["missingChildren"][caseId]["alertDistributed"] = False
            mock_db["missingChildren"][caseId]["recoveryLocation"] = resolution.location
            mock_db["missingChildren"][caseId]["recoveredAt"] = now_iso
            mock_db["missingChildren"][caseId]["recoveryOfficer"] = f"{resolution.officerName} ({resolution.unitCallsign})"

    return {
        "message": "Subject recovery recorded successfully! Emergency alert closed." if is_found else "Search sweep logged. Perimeter expanded.",
        "caseId": caseId,
        "status": new_status,
        "isFound": is_found
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
