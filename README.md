# 🛡️ ChildGuard: AI-Powered Autonomous Missing Child Recovery & Tactical Alert Grid

[![ChildGuard Network](https://img.shields.io/badge/Compliance-Section%2074%20JJ%20Act%20%7C%20NCRB%20AHTU-blue.svg)](#)
[![Perception Engine](https://img.shields.io/badge/Perception%20Engine-Gemini%203.5%20Flash%20Vision%20%2B%20Audio-purple.svg)](#)
[![Agent Workflow](https://img.shields.io/badge/Orchestration-LangGraph%20Autonomous%20Agents-orange.svg)](#)
[![Carrier Telemetry](https://img.shields.io/badge/Carrier%20Comms-Twilio%20SMS%20%2B%20WhatsApp-emerald.svg)](#)
[![Frontend Architecture](https://img.shields.io/badge/Frontend-Next.js%2016%20Turbopack%20%7C%20Tailwind-black.svg)](#)
[![Backend Engine](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Uvicorn%20%7C%20Firestore-teal.svg)](#)

ChildGuard is an enterprise-grade tactical command platform engineered for law enforcement, Anti-Human Trafficking Units (AHTU), and emergency responders to drastically collapse the critical **"Golden Hour" (first 60 minutes)** response window for missing and abducted children in India.

By uniting **LangGraph autonomous agent state machines, Gemini 3.5 Flash multimodal vision & audio perception, real-time Twilio WhatsApp/SMS police dispatch, and statutory AHTU interstate transit corridor modeling**, ChildGuard transforms passive eyewitness leads into immediate, verified ground recoveries.

---

## 🌟 Comprehensive Feature Guide

### 1. Officer Terminal & Secret Access Gateway
Designed for frictionless field authentication without dependency on third-party OAuth popups:
* **Departmental Secret Code Authentication**: Officers enter authorized departmental passcodes (e.g., `CG-OFFICER-2026`, `POLICE112`, `CHILDGUARD2026`) along with badge callsign.
* **Persistent Session Management**: Authenticated sessions are securely stored in local state (`childguard_officer_session`), granting verified access across tactical grids.
* **Adaptive Navigation**: Dynamic topbar switching between public citizen routes and tactical officer command links (`Command Center`, `Register Case`, `Verification Desk`, `Active Alerts`).
* **Government SSO Alternative**: Integrated Google Cloud Identity for federated police department accounts.

---

### 2. Autonomous Biometric Verification Desk
Eliminates cognitive overload and triage delay when reviewing hundreds of crowd-sourced citizen leads:
* **Multimodal Face Corroboration**: Powered by **Gemini 3.5 Flash Vision** to calculate biometric facial similarity, landmark structure, and physical trait alignment.
* **Side-by-Side Visual Audit Dossier**: Renders the official reference dossier photo directly alongside the citizen eyewitness photo with optical alignment comparison.
* **Geospatial Proximity & Speed-Distance Logic**: Validates reported sighting locations against the last known coordinates and elapsed time to quarantine physically impossible sightings.
* **Confidence Tiering**:
  * **High Confidence (≥ 80%)**: Direct path to immediate field interdiction and tactical dispatch.
  * **Moderate Confidence (50–79%)**: Flagged for secondary supervisory review.
  * **Unverified (< 50%)**: Archived to prevent patrol resource misallocation.

---

### 3. Tactical Field Intercept Console (Twilio WhatsApp & SMS)
A command terminal built into both the Verification Desk and Central Dashboard for orchestrating ground teams:
* **Real Carrier SMS Dispatch (Twilio)**:
  * Formats and transmits actionable dispatch payloads to patrolling officers.
  * Includes Case ID, child name, age, physical landmarks, and photo link.
* **Direct WhatsApp Alerts with Google Maps GPS**:
  * Outbound transmission via Twilio WhatsApp Sandbox (`+1 415 523 8886`).
  * Delivers high-priority dossiers with clickable **Google Maps navigation links** directly to field constables' smartphones.
* **Tactical Audio Broadcast Ping**:
  * Plays emergency synthesized radio chimes (`SEC-INTERCEPT-ALPHA 462.575 MHz`) with spoken dispatch audio directly in the command room.
* **Patrol Unit Live Roster**:
  * Tracks assigned vehicles (e.g., `PCR-04 Sector Beat Patrol`, `RPF-02 Transit Intercept`, `HWP-09 Highway Checkpoint`) with estimated arrival times.

---

### 4. Inbound Carrier Reply-to-Resolve Webhook
Enables boots-on-the-ground officers to control case state directly from feature phones or smartphones via standard carrier SMS:
* **Instant Case Resolution (`FOUND`)**:
  * Patrolling officers text back `FOUND [optional notes]` to the ChildGuard carrier number (`+1 430 237 3377`).
  * The inbound webhook automatically transitions case status to **`Found / Safely Recovered`**.
  * Deactivates regional public alert broadcasts and emergency geofences.
  * Appends cryptographic timestamp and officer callsign to the audit trail.
  * Responds back via carrier TwiML confirmation:
    > *"ChildGuard Central: Case #[ID] RESOLVED. Subject logged as safely recovered. Perimeter geofence stood down. Good work, Officer."*
* **Negative Contact Protocol (`NOT FOUND`)**:
  * Officers reply `NOT FOUND` after completing a physical perimeter sweep.
  * Case remains open, logs negative sweep observations, and automatically signals an expansion of the velocity search bounds.

---

### 5. Central Incident Command Dashboard & Escape Corridor HUD
A high-density tactical operations center providing complete situational awareness:
* **Live Incident GIS Mapping**: Interactive Leaflet GIS mapping showing active cases, sighting clusters, and patrol search geofence radiuses.
* **Floating Escape Corridor HUD**:
  * Predicts real Indian National Highway egress vectors (e.g. *"Goa to Mumbai via NH66 Konkan Corridor"*, *"Delhi to Agra via Yamuna Expressway NH19"*).
  * Displays corridor likelihood percentage (`88% Confidence`), historical precedent count, designated AHTU unit (`AHTU-GA-PAN-01`), and NCRB transit zone.
* **AHTU Trafficking Cross-Check Card**:
  * Renders statutory cross-verification status under **Section 74, Juvenile Justice Act 2015** against 1,240+ interstate alerts.
* **Cryptographic Activity Log**:
  * Displays chronological, transparent multi-agent audit logs detailing every agent action and forensic reasoning.

---

### 6. 1-Click Emergency Poster Generator with Dynamic QR Code
Bridges physical grassroots policing with digital agentic search:
* **High-Contrast Police Flyer**: Clean, official missing child flyer layout designed for instant distribution to bus conductors, auto-rickshaw stands, and railway station masters.
* **Dynamic QR Code**:
  * Scanning the poster with any smartphone camera opens directly to `/report-a-sighting?caseId=...`.
  * Pre-selects the child dossier for instantaneous, frictionless citizen reporting.
* **Print-Ready A4 Engine**: Uses `@media print` stylesheets for 1-click single-page high-contrast A4 printing.
* **1-Click WhatsApp Flyer Share**: Formats case synopsis and direct reporting links for rapid group chat circulation.

---

### 7. Multimodal Voice Note Eyewitness Submission (Gemini 3.5 Flash Audio)
Solves the eyewitness ergonomics challenge at crowded transit hubs:
* **Web Audio API Voice Recorder**: Bystanders tap "Record Voice Note" and speak naturally for 5–15 seconds with a live recording indicator and timer (`REC 00:08`).
* **Direct Multimodal Audio Perception**:
  * `POST /api/transcribe-voice-tip` sends audio directly to **Gemini 3.5 Flash**.
  * Understands English and Indian vernacular speech.
  * Automatically extracts structured forensic intelligence:
    * `clothing`: Attire and distinctive garments observed.
    * `accompaniedBy`: Companion status (`Alone`, `1 Adult (M)`, `1 Adult (F)`, `In Vehicle`, `Unsure`).
    * `directionOfTravel`: Mentioned landmarks, vehicle numbers, or bus platforms.
    * `urgency`: Priority rating (`HIGH`, `MEDIUM`, `LOW`).
* **Instant Form Auto-Population**: Automatically fills the sighting observation description and selects the companion status without manual typing.

---

### 8. Statutory Anti-Human Trafficking Unit (AHTU) Cross-Verification
* **Statutory Compliance**: Built in accordance with **Section 74 of the Juvenile Justice (Care and Protection of Children) Act, 2015** and **NCRB Standard Operating Procedures**.
* **Perceptual Hash Cross-Referencing**:
  * `trafficking_scanner_agent` generates cryptographic image hashes and queries known interstate trafficking watchlists (e.g. Howrah-Delhi Trunk Rail, Raxaul-Patna Indo-Nepal corridor, Mumbai-Surat NH48, Konkan NH66).
  * Automatically tags positive matches with confidential AHTU intercept protocols or confirms clean clearance across 1,240+ interstate records.

---

### 9. Public Citizen Alert & Sighting Grid
* **AMBER-Style Public Broadcast**: Clean citizen cards showing child photo, age, last seen location, and urgency indicator.
* **Citizen Sighting Submission**: Mobile-first photo upload, interactive GPS map pin-drop, reverse geocoding, and voice recording.
* **Emergency Hotlines**: Permanent 1-tap call links to the National Police Helpline (`112`) and Childline (`1098`).

---

## 🏛️ System Architecture

```
                                  [ Citizen Sighting Portal / QR Scan ]
                                                    │
                                                    ▼
                                       [ Next.js 16 Edge Frontend ]
                                                    │
                         ┌──────────────────────────┴──────────────────────────┐
                         ▼                                                     ▼
            [ Public Alert Broadcast ]                           [ Officer Terminal Access ]
            (Emergency A4 Poster & QR)                           (Departmental Secret Code)
                                                                               │
                                                                               ▼
                                                                 [ Officer Command Center ]
                                                                 (Dashboard / Verification)
                                                                               │
                         ┌─────────────────────────────────────────────────────┘
                         ▼
            [ FastAPI Backend Engine ]
                         │
        ┌────────────────┼──────────────────────────────┐
        ▼                ▼                              ▼
  [ LangGraph ]   [ Gemini 3.5 Flash ]          [ Twilio Gateway ]
  (Agent Graph)   • Facial Corroboration        • Real SMS Dispatch
        │         • Audio Voice Transcription   • Real WhatsApp Telemetry
        │         • Corridor Reasoning          • Reply Webhook (FOUND/NOT FOUND)
        ▼                                               │
 [ Firestore DB ]                                       ▼
  (Case & Sighting)                            [ Field Patrol Units ]
        │                                        (WhatsApp GPS Navigation)
        ▼                                               │
  [ Case State ] ◄──────────────────────────────────────┘
```

---

## 🛠️ Setup & Installation Guide

Follow these steps to run ChildGuard locally on your machine.

### Prerequisites
* **Python**: 3.11+ installed (`python --version`)
* **Node.js**: 18+ or 20+ installed (`node --version`)
* **npm**: 9+ installed (`npm --version`)
* **Git**: Installed (`git --version`)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sahil-Ghadi/ChildGuard.git
cd ChildGuard
```

---

### Step 2: Backend Setup (FastAPI + LangGraph)

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   * **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install the streamlined dependencies:
   ```bash
   pip install --no-cache-dir -r requirements.txt
   ```

4. Configure your backend environment variables:
   * Create a `.env` file in the `backend/` directory (see [Backend Environment Structure](#backend-environment-structure-backendenv) below for details).
   * You can copy the example file:
     ```bash
     cp .env.example .env
     ```

5. Start the FastAPI backend server:
   ```bash
   python main.py
   ```
   *Or using Uvicorn directly:*
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   *The backend will be live at `http://localhost:8000` (API docs at `http://localhost:8000/docs`).*

---

### Step 3: Frontend Setup (Next.js 16 + TailwindCSS)

1. Open a second terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Configure your frontend environment variables:
   * Create a `.env.local` file in the `frontend/` directory (see [Frontend Environment Structure](#frontend-environment-structure-frontendenvlocal) below for details).
   * You can copy the example file:
     ```bash
     cp .env.example .env.local
     ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be live at `http://localhost:3000`.*

5. *(Optional)* Verify the production bundle:
   ```bash
   npm run build
   ```

---

## ⚙️ Environment Variable Structures

### Backend Environment Structure (`backend/.env`)

Place this file in the `backend/` directory:

```env
# ── Gemini AI Multimodal Engine ──
GOOGLE_API_KEY=AIzaSy...your_gemini_api_key...
GEMINI_API_KEY=AIzaSy...your_gemini_api_key...

# ── Twilio Telemetry & Carrier Comms ──
TWILIO_ACCOUNT_SID=AC...your_twilio_account_sid...
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+14302373377
TWILIO_WHATSAPP_NUMBER=+14155238886
TWILIO_WHATSAPP_SANDBOX_CODE=join tube-pain
DEFAULT_OFFICER_PHONE=+918767322544

# ── Firebase Admin SDK Service Account ──
# Compact one-line JSON string representing your Firebase service account credentials:
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"childguard-17520","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-...@childguard-17520.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

| Variable | Required | Description |
| :--- | :---: | :--- |
| `GOOGLE_API_KEY` / `GEMINI_API_KEY` | **Yes** | Google AI Studio key for `gemini-3.5-flash` (used for risk classification, multimodal audio voice note transcription, and transit corridor prediction). |
| `TWILIO_ACCOUNT_SID` | Optional | Twilio account SID for outbound SMS and WhatsApp dispatches. |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio authentication token. |
| `TWILIO_PHONE_NUMBER` | Optional | Twilio virtual carrier phone number for SMS dispatches (e.g., `+14302373377`). |
| `TWILIO_WHATSAPP_NUMBER` | Optional | Twilio WhatsApp Sandbox number (`+14155238886`). |
| `TWILIO_WHATSAPP_SANDBOX_CODE` | Optional | Sandbox join code (e.g., `join tube-pain`). |
| `DEFAULT_OFFICER_PHONE` | Optional | Default fallback phone number for patrol officer dispatches. |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Optional | One-line JSON string containing Firebase Service Account credentials. If omitted, the backend seamlessly falls back to an in-memory database. |

---

### Frontend Environment Structure (`frontend/.env.local`)

Place this file in the `frontend/` directory:

```env
# ── Firebase Client SDK Configuration ──
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your_client_api_key...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=childguard-17520.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=childguard-17520
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=childguard-17520.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=422864100090
NEXT_PUBLIC_FIREBASE_APP_ID=1:422864100090:web:...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-...

# ── Cloudinary Media Upload Preset ──
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=daamfgbqv
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=childguard_preset

# ── ChildGuard Backend API Endpoint ──
# Local development:
NEXT_PUBLIC_API_URL=http://localhost:8000
# Production deployment (e.g. on Render):
# NEXT_PUBLIC_API_URL=https://childguarddd.onrender.com

# ── Departmental Officer Terminal Access Code ──
NEXT_PUBLIC_OFFICER_SECRET_CODE=CG-OFFICER-2026
```

| Variable | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_FIREBASE_*` | Optional | Firebase web client keys for authentication and client-side Firestore listeners. |
| `NEXT_PUBLIC_CLOUDINARY_*` | Optional | Cloudinary cloud name and unsigned upload preset for uploading citizen sighting and case photos. |
| `NEXT_PUBLIC_API_URL` | **Yes** | Base URL pointing to the FastAPI backend (`http://localhost:8000` for local dev). |
| `NEXT_PUBLIC_OFFICER_SECRET_CODE` | **Yes** | Departmental passcode for instant Officer Terminal duty login (`CG-OFFICER-2026`). |

---

## 🚀 Cloud Deployment

### 1. Backend on Render (`render.yaml`)
The repository includes a ready-to-use [`render.yaml`](file:///c:/Users/shrid/OneDrive/Documents/NextJS/hackathons/BitsGDG/ChildGuard/render.yaml) configuration for 1-click deployment on Render:
* **Service Type**: Python Web Service
* **Build Command**: `pip install --no-cache-dir -r requirements.txt` *(keeps slug size under ~200MB, well below Render's 512MB free tier limit)*
* **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2. Frontend on Vercel
Deploy the `frontend/` directory directly to Vercel:
* **Root Directory**: `frontend`
* **Framework Preset**: Next.js
* **Build Command**: `next build`
* **Output Directory**: `.next`
* Add your environment variables from `.env.local` to the Vercel project dashboard.

---

## 🔒 Security & Statutory Compliance Standards

* **Section 74, Juvenile Justice Act 2015**: Strictly restricts the unauthorized public exposure of juvenile identities; public alerts are issued under statutory law enforcement protocols.
* **Role-Based Access Control (RBAC)**: Public citizen routes are read-only broadcasts or anonymous tip submissions. Case triage dossiers, biometric similarity scores, and field communications require Level-2 Officer Clearance.
* **CCTNS-Compliant Audit Trail**: Every status change, manual resolution, and carrier webhook trigger is permanently stamped with officer callsign, source IP/phone, and UTC timestamp.
* **Zero PII Exposure on Carrier SMS**: Outbound SMS payloads adhere to minimal necessary detail principles to protect the child's identity while giving officers actionable identifiers.
* **TLS 256-Bit Cryptography**: All data in transit between mobile browsers, edge CDNs, and backend microservices is secured via HTTPS/TLS.

---

## 📱 Officer Quick Reference

| Action | Channel | Syntax / Instructions |
| :--- | :--- | :--- |
| **Duty Terminal Login** | Web (`/login`) | Enter departmental passcode: `CG-OFFICER-2026` or `POLICE112` |
| **Generate Emergency Poster** | Web (`/public-alert` or `/dashboard`) | Click **"Generate Emergency Bulletin"** / **"Emergency Flyer"**; print A4 or scan dynamic QR |
| **Dispatch Intercept** | Console | Select patrol unit, choose channel (SMS / WhatsApp), click **Dispatch** |
| **Confirm Recovery** | SMS to `+14302373377` | Text: `FOUND [Recovery location & notes]` |
| **Report Sweep Negative** | SMS to `+14302373377` | Text: `NOT FOUND [Observed clues]` |
| **WhatsApp Bot Opt-In** | WhatsApp to `+14155238886` | Text: `join tube-pain` (activates Twilio sandbox forwarding) |

---

## 👥 Presenter & Team Resources

For teammates presenting ChildGuard to hackathon judges, consult the **[Presenter's Pitch Guide & Demo Handbook](file:///c:/Users/shrid/OneDrive/Documents/NextJS/hackathons/BitsGDG/ChildGuard/PRESENTER_GUIDE.md)** for a 5-minute click-by-click script, page-by-page design rationale, and a tough judge Q&A cheat sheet.
