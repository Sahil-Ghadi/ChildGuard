from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
from models import CaseCreate
import uuid
import datetime

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    db = None

app = FastAPI(title="ChildGuard Backend API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
    if not db:
        raise HTTPException(status_code=500, detail="Database not initialized")

    case_id = f"CG-2026-{(str(uuid.uuid4())[:6]).upper()}"
    
    doc_data = case_data.model_dump()
    doc_data.update({
        "status": "open",
        "riskScore": "PENDING",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    })

    try:
        db.collection("missingChildren").document(case_id).set(doc_data)
        return {"message": "Case registered successfully", "caseId": case_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
