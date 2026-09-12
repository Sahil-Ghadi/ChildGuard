from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")

app = FastAPI(title="ChildGuard Backend API", version="1.0.0")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "ChildGuard Backend is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
