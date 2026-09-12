# CLAUDE.md — ChildGuard Implementation Guide

> **Purpose of this file:** This is the working reference for building ChildGuard during the Bit N Build Hackathon (Track 2: Bal Suraksha). It translates the solution design into a concrete, buildable 48-hour plan — architecture, data model, agent logic, API contracts, folder structure, and an hour-by-hour build order. Read this before writing code.

---

## 1. What We're Building

ChildGuard is a multi-agent system that shortens the time between "a child goes missing" and "a child is found" by combining three tactics that work internationally but don't yet exist in a unified, India-ready form:

1. **Broadcast alerts** to a geographic radius the moment a case is marked high-risk (AMBER Alert model).
2. **Automated photo matching** against trafficking-adjacent listings, with age-progression for long-missing cases (Spotlight / NCMEC model).
3. **AI-scored community sighting verification** so police only get dispatched on credible leads, not every guess (crowd + trust-scoring model).

The MVP is a **simulated but architecturally real** system: every agent, API, and data flow is production-shaped, but external integrations that would require legal/law-enforcement partnerships (real facial recognition against CCTV, real trafficking-site scanning, real SMS gateways) are **mocked behind real interfaces** so the demo is honest about what's live vs. simulated. This is a strength to state explicitly to judges, not a weakness to hide.

### Design principles (carry these into every decision)
- **Human-in-the-loop before anything public.** No alert broadcasts, no police dispatch, and no "match found" notification fires without a confidence threshold *and* a visible audit trail of why.
- **Data minimization.** Store only what a case needs. Children's photos and location data are the most sensitive data this app touches — treat every collection field as a liability, not a feature.
- **Fail toward caution, not toward speed.** False negatives (missed sightings) are bad; false positives that send police to harass an innocent family are also bad, and are the failure mode judges will probe first. The credibility-scoring layer exists to prevent this.
- **Assume broken connectivity.** Much of India's reporting base is low-bandwidth. The intake form and alert consumption must degrade gracefully (SMS fallback, offline-capable PWA shell).

---

## 2. Enhancements Over the Original Design

The source design is strong on breadth; these additions close gaps a judge or a real deployment would immediately ask about:

| Addition | Why |
|---|---|
| **Consent & guardian verification step at intake** | Prevents the system being weaponized (e.g., a non-custodial parent or abuser filing a false "missing" report to locate a child who was deliberately relocated for safety, such as a domestic-violence case). Intake Agent must flag custody-dispute indicators for manual review before any public broadcast. |
| **Rate limiting & reporter trust scores on sightings** | Prevents flooding the police dashboard with spam/troll reports; reuses the credibility scoring already planned but formalizes it as a first-class safeguard, not just a UX nicety. |
| **Data retention & auto-purge policy** | Closed cases auto-purge biometric/photo data after a defined window (configurable, default 90 days) unless a case is still open or under legal hold. Directly addresses the "who's watching the watchers" question. |
| **Offline-first PWA + SMS fallback for intake and alerts** | Real Indian deployment conditions; also a differentiator vs. web-only competitors at the hackathon. |
| **Multi-language UI (Hindi + regional) with voice intake** | Increases the population that can actually use it; low-literacy reporting via voice note transcription. |
| **Audit log as a first-class collection** | Every agent decision (risk score, match, dispatch) is logged with reasoning, not just outcome — needed for both debugging and post-incident accountability. |
| **"Explainability" panel on the police dashboard** | Shows *why* the AI flagged something (which signals fired), so officers aren't asked to trust a black box — improves real-world adoptability and demo impressiveness. |
| **Volunteer/NGO verification network** | A lightweight layer where local NGO partners (Bachpan Bachao Andolan, CRY, etc.) can pre-register verified community volunteers whose sighting reports get a trust-score boost. |

---

## 3. System Architecture

### 3.1 Eight-Agent Workflow (LangGraph)

```
                                   ┌─────────────────┐
Missing Child Report ─────────────▶  1. Intake Agent │
                                   └────────┬─────────┘
                                            │ validated case + consent flag
                                            ▼
                                   ┌─────────────────────┐
                                   │ 2. Risk Classifier    │
                                   │    Agent               │
                                   └────────┬─────────────┘
                                            │ risk score + flags
                                            ▼
                                   ┌─────────────────────┐
                                   │ 3. Photo Processor    │
                                   │    Agent               │
                                   └────────┬─────────────┘
                                            │
                     ┌──────────────────────┼──────────────────────┐
                     ▼                      ▼                      ▼
          ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
          │ 4. Trafficking      │ │ 5. Pattern Detector │ │ 6. Age Progression  │
          │    Scanner Agent    │ │    Agent             │ │    Agent (if >180d) │
          │    (simulated)      │ │                      │ │    (simulated)       │
          └──────────┬──────────┘ └──────────┬───────────┘ └──────────┬───────────┘
                      └───────────────────────┼──────────────────────┘
                                               ▼
                                   ┌─────────────────────┐
                                   │ 7. Alert Distributor  │
                                   │    Agent               │
                                   └────────┬─────────────┘
                                            ▼
                                   Firestore (case store) + Public Alert Feed
                                            │
                                            ▼
                              Community Sighting Submitted
                                            │
                                            ▼
                                   ┌─────────────────────┐
                                   │ 8. Sighting Verifier  │
                                   │    Agent               │
                                   └────────┬─────────────┘
                                            │ credibility score
                                     ≥85% ──┴── <85%
                                      │              │
                                      ▼              ▼
                          Police Dashboard    Held for manual review
                          (HIGH CONFIDENCE)   (still visible, deprioritized)
```

### 3.2 Agent Responsibilities

| # | Agent | Input | Output | Notes |
|---|---|---|---|---|
| 1 | **Intake Agent** | Raw report form (text/voice) | Structured case object, photo-quality check, consent/custody-dispute flag | Rejects incomplete submissions with specific missing-field feedback, not a generic error |
| 2 | **Risk Classifier Agent** | Structured case | `riskScore`: LOW / MEDIUM / HIGH / CRITICAL + reasoning string | LLM-assisted (Gemini) scoring vulnerable-profile indicators (age, area, time-since-seen, prior similar cases nearby) — reasoning is stored, not just the label |
| 3 | **Photo Processor Agent** | Raw photo | Normalized image + perceptual hash | Rejects unusable photos (too blurry/small) back to Intake for a re-request |
| 4 | **Trafficking Scanner Agent** | Perceptual hash | Match list (simulated dataset for MVP, real interface for prod) | Clearly labeled "SIMULATED" in the UI during demo — honesty here is a credibility point with judges |
| 5 | **Pattern Detector Agent** | Case location + timestamp | Similar historical cases, predicted route/probability | Uses a small seeded historical dataset (see §5) + simple clustering, not a black box |
| 6 | **Age Progression Agent** | Original photo + years elapsed | Age-adjusted photo variant | Only triggers for cases open >180 days; simulated via a pretrained aging model or a clearly-labeled mock for MVP |
| 7 | **Alert Distributor Agent** | Case + risk score ≥ HIGH | Formatted SMS/app/social payloads, radius calculation | Only fires with an explicit threshold check — this is the "human-in-loop before public" gate, implemented as a required review-or-auto-approve toggle configurable per deployment |
| 8 | **Sighting Verifier Agent** | Sighting report + case + reporter history | Credibility score 0–100%, HIGH/MEDIUM/LOW confidence label | Scoring inputs: facial similarity, location plausibility given elapsed time, reporter trust score, submission consistency |

### 3.3 Data Flow (updated)

```
Report → Intake (validate + consent check) → Risk Classifier → Photo Processor
  → [Trafficking Scanner ∥ Pattern Detector ∥ Age Progression (conditional)]
  → Alert Distributor (if HIGH/CRITICAL) → Firestore write + Audit Log write
  → Public Alert Feed + Police Dashboard (live)
  → Community Sighting → Sighting Verifier → Firestore write + Audit Log write
  → Police Dispatch (if ≥85%) → Resolution → Case closed → Retention timer starts
```

---

## 4. Database Schema (Firebase Firestore)

```
/missingChildren/{caseId}
  ├─ childName, age, photoUrl, description
  ├─ lastSeenLocation: { lat, lng, address, timestamp }
  ├─ reporterUid, reporterRelationship
  ├─ consentFlag: boolean            // guardian/legal-authority confirmed
  ├─ custodyDisputeFlag: boolean     // requires manual review if true
  ├─ riskScore: LOW|MEDIUM|HIGH|CRITICAL
  ├─ riskReasoning: string
  ├─ status: open|found|closed
  ├─ createdAt, updatedAt
  └─ retentionExpiresAt              // auto-purge date, extended if case reopens

/missingChildren/{caseId}/sightings/{sightingId}
  ├─ location: { lat, lng, address }
  ├─ timestamp, photoUrl
  ├─ reporterUid, reporterTrustScore
  ├─ credibilityScore: number (0-100)
  ├─ confidenceLabel: HIGH|MEDIUM|LOW
  ├─ verifiedBy: agent|human
  └─ status: pending|dispatched|dismissed

/missingChildren/{caseId}/resolution
  ├─ foundTime, foundLocation
  ├─ method: sighting|trafficking_match|other
  └─ notes

/missingChildren/{caseId}/auditLog/{eventId}
  ├─ agentName, action, reasoning
  ├─ timestamp
  └─ inputSnapshotRef                // pointer, not full payload, to control storage growth

/patterns/{regionId}
  ├─ traffickingRoutes: [ { from, to, frequency, avgTimeHours } ]
  ├─ seasonalTrends
  └─ vulnerableZones

/reporters/{uid}
  ├─ trustScore: number
  ├─ verifiedVolunteer: boolean       // true if pre-registered via NGO partner
  ├─ reportHistory: [ { caseId, accuracy } ]
  └─ ngoAffiliation (optional)

/users/{uid}
  ├─ role: parent|police|admin|volunteer
  ├─ badgeNumber (police only)
  └─ jurisdiction (police only)
```

---

## 5. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS | PWA-enabled (`next-pwa`) for offline shell |
| State/data fetching | React Query | |
| Maps | Leaflet + OpenStreetMap tiles | Free, no API key needed |
| Backend | FastAPI (Python, async) | |
| Orchestration | LangGraph | 8-agent graph, each node independently testable |
| LLM | Google Generative AI (Gemini) | Risk reasoning, credibility scoring assistance |
| Image processing | Pillow, OpenCV, scikit-image | Perceptual hashing for match simulation |
| Data/ML | Pandas, NumPy, scikit-learn | Pattern clustering, credibility heuristics |
| Auth | Firebase Auth | Separate role claims for parent/police/admin/volunteer |
| Database | Firebase Firestore | Free Spark tier sufficient for demo |
| File storage | Firebase Storage | Photos, capped at reasonable size on upload |
| SMS (mocked for MVP) | Twilio-shaped interface, console-logged in dev | Swap-in ready for post-hackathon |
| Hosting | Vercel (frontend), Render (backend) | Free tiers |
| CI/CD | GitHub Actions | |
| Containerization | Docker + docker-compose | One command local spin-up |

**Total cost for 48-hour build: $0.**

---

## 6. API Contract (FastAPI)

```
POST   /api/cases                     — create missing-child report (Intake Agent trigger)
GET    /api/cases/{caseId}            — fetch case detail
GET    /api/cases?status=open         — list active cases (public feed, PII-reduced)
PATCH  /api/cases/{caseId}/status     — police/admin only: update status

POST   /api/cases/{caseId}/sightings  — submit community sighting (triggers Verifier Agent)
GET    /api/cases/{caseId}/sightings  — police dashboard: list sightings, sorted by credibility

GET    /api/patterns/{regionId}       — predicted routes for a region
GET    /api/dashboard/summary         — aggregate stats for admin panel

POST   /api/auth/register             — role-scoped registration
GET    /api/audit/{caseId}            — full audit trail (police/admin only)
```

**Public feed responses must never include:** exact home address, reporter phone/email, or full audit reasoning — only what a citizen needs to recognize the child and report safely.

---

## 7. Frontend Pages

| Route | Audience | Purpose |
|---|---|---|
| `/` | Public | Active alert feed, big "Report Sighting" CTA |
| `/report` | Public/parent | Missing-child intake form (voice + text), consent step |
| `/sighting/[caseId]` | Public | Submit a sighting with photo + location picker |
| `/police` | Police (auth) | Case list, map of sightings, predicted routes, explainability panel |
| `/police/case/[caseId]` | Police (auth) | Full case detail, audit log, dispatch action |
| `/admin` | Admin (auth) | Pattern analytics, system health, retention queue |
| `/volunteer/onboard` | NGO-invited | Volunteer registration for trust-score boost |

---

## 8. 48-Hour Build Plan

Assume a team of 3–4. Adjust parallelism to team size.

### Phase 0 — Setup (Hours 0–2)
- Repo scaffold, Docker Compose, Firebase project, `.env` templates.
- Agree on the 8-agent contracts (input/output shape) as TypeScript/Pydantic interfaces *before* anyone writes agent logic — this is the single highest-leverage step to avoid integration pain later.

### Phase 1 — Core Pipeline (Hours 2–14)
- Intake Agent + `/api/cases` POST + Firestore write.
- Risk Classifier Agent (Gemini call + fallback heuristic if API quota hit).
- Photo Processor Agent (Pillow normalize + perceptual hash).
- Wire these three into a working LangGraph chain with console-visible intermediate state.
- **Checkpoint:** submitting the intake form produces a scored, stored case.

### Phase 2 — Detection & Prediction (Hours 14–22)
- Trafficking Scanner Agent (simulated match against a seeded fixture dataset — label clearly as simulated).
- Pattern Detector Agent (seed 15–20 synthetic historical cases across 2–3 Indian cities so clustering has something real to show).
- Age Progression Agent (mock endpoint returning a pre-generated aged variant for the demo photo, or a real lightweight model if time allows — mock first, upgrade only if time remains).

### Phase 3 — Alerts & Public Feed (Hours 22–30)
- Alert Distributor Agent + mocked SMS/push layer (console + in-app toast standing in for SMS).
- Public alert feed page (`/`), PII-reduced.
- Sighting submission flow (`/sighting/[caseId]`).

### Phase 4 — Verification & Police Dashboard (Hours 30–38)
- Sighting Verifier Agent (facial similarity via perceptual hash distance, location/timeline plausibility, reporter trust lookup).
- Police dashboard with map (Leaflet), sighting list sorted by credibility, explainability panel showing which signals fired.
- Dispatch action → resolution flow → case closed.

### Phase 5 — Safeguards & Polish (Hours 38–44)
- Consent/custody-dispute flag on intake, manual-review queue for flagged cases.
- Retention timer + admin purge queue view.
- Audit log wired into every agent (if not already incremental).
- Hindi language toggle (even partial coverage of key screens beats none).

### Phase 6 — Demo Prep (Hours 44–48)
- Seed the Delhi→Agra demo scenario exactly as in the walkthrough (§9).
- Record the 3-minute demo video.
- Finalize README, architecture diagram, deployment.
- Rehearse the live demo path end-to-end at least twice.

---

## 9. Demo Script (Delhi → Agra Scenario)

Use this as the literal click-path during the live demo and video — it's designed to hit every agent in under 5 minutes of real interaction.

1. **Report:** Submit intake form for a 7-year-old, Delhi Gate, 2:00 PM, vulnerable-profile indicators filled in.
2. **Risk score:** Dashboard shows CRITICAL with visible reasoning (age, area, solo travel, historical pattern in zone).
3. **Photo pipeline:** Show normalized photo + hash generated.
4. **Trafficking scan:** Show "no match" result, clearly labeled SIMULATED SCAN.
5. **Pattern prediction:** Show "80% probability route toward Agra via NH48" pulled from the seeded historical dataset, with the 3 similar prior cases it's based on visible on click.
6. **Alert fires:** Public feed updates instantly; show the (mocked) SMS payload that *would* have gone to 100K+ recipients.
7. **Sighting submitted:** From a second browser/device, submit a sighting at an Agra bus stand with a photo.
8. **Verification:** Credibility score computes live (~88%), confidence HIGH, explainability panel shows each contributing factor.
9. **Police dispatch:** Dashboard shows HIGH CONFIDENCE sighting, officer clicks dispatch, case status updates.
10. **Resolution:** Case marked found, timeline recap shown (T+90min), retention timer starts.

---

## 10. Repository Structure

```
childguard/
├── frontend/                # Next.js app
│   ├── app/
│   │   ├── page.tsx                    # public feed
│   │   ├── report/page.tsx
│   │   ├── sighting/[caseId]/page.tsx
│   │   ├── police/page.tsx
│   │   ├── police/case/[caseId]/page.tsx
│   │   └── admin/page.tsx
│   └── components/
├── backend/
│   ├── main.py                          # FastAPI entrypoint
│   ├── agents/
│   │   ├── intake_agent.py
│   │   ├── risk_classifier_agent.py
│   │   ├── photo_processor_agent.py
│   │   ├── trafficking_scanner_agent.py
│   │   ├── pattern_detector_agent.py
│   │   ├── age_progression_agent.py
│   │   ├── alert_distributor_agent.py
│   │   └── sighting_verifier_agent.py
│   ├── graph.py                         # LangGraph wiring
│   ├── models/                          # Pydantic schemas
│   ├── services/
│   │   ├── firestore_client.py
│   │   ├── sms_mock.py
│   │   └── retention_scheduler.py
│   └── fixtures/
│       ├── seeded_historical_cases.json
│       └── mock_trafficking_dataset.json
├── docker-compose.yml
├── .github/workflows/deploy.yml
└── README.md
```

---

## 11. Ethical & Safety Safeguards (do not skip when demoing)

State these explicitly in the pitch — judges in a child-safety track will reward this more than an extra feature:

- **No autonomous public broadcast without a threshold + audit trail.** The system can recommend; a documented rule (or, in production, a human) approves.
- **Custody-dispute and consent checks** prevent the system from being usable as a tool to locate a child who was deliberately moved for safety reasons.
- **Reporter trust scoring and rate limiting** prevent both trolling and the police dashboard being flooded into uselessness.
- **PII-reduced public feed** — the public sees what helps them recognize a child, not data that endangers the family further.
- **Data retention limits with auto-purge** on closed cases — sensitive child data isn't kept indefinitely by default.
- **Full audit logging** of every agent decision for post-incident review and accountability.
- **Every "AI detection" claim is either real and demonstrable, or explicitly labeled simulated** in the UI. Don't oversell mocked components as live during judging — a judge who catches an unlabeled mock will discount everything else.

---

## 12. Post-Hackathon Roadmap (condensed)

1. **Weeks 1–4:** Pilot integration proposal with one state's police 112 system; real SMS gateway (Twilio/AWS SNS); legal review of consent flow with a child-rights NGO partner.
2. **Months 2–6:** Expand pattern dataset with real (anonymized, consented) historical case data via NGO partnership; replace simulated trafficking scan with a vetted partner integration (e.g., PhotoDNA-style hash-sharing program) under proper legal authorization.
3. **6–12 months:** Multi-state rollout, MWCD engagement, formal data-protection audit (DPDP Act compliance in India).
4. **Beyond:** Regional expansion (Nepal, Bangladesh) mirroring the existing Plan India cross-border alert precedent.

---

## 13. Judging Alignment Checklist

- [ ] Problem stated with data, not just anecdote
- [ ] Architecture diagram matches what's actually running (no vaporware)
- [ ] At least the core pipeline (Intake → Risk → Alert) is live and clickable, not just slides
- [ ] Simulated components are clearly labeled as such in the live UI
- [ ] Safety/misuse safeguards are demoed, not just mentioned
- [ ] Demo video follows the exact scripted path in §9
- [ ] README has setup, architecture, and honest "what's real vs. simulated" section
