from pydantic import BaseModel, Field
from typing import Optional, Literal, List
from datetime import datetime

class Location(BaseModel):
    lat: float
    lng: float
    address: str
    timestamp: Optional[str] = None

class CaseCreate(BaseModel):
    childName: str
    age: int
    photoUrl: str
    description: str
    lastSeenLocation: Location
    reporterUid: str
    reporterRelationship: str
    consentFlag: bool

class CaseDB(CaseCreate):
    caseId: str
    custodyDisputeFlag: bool = False
    riskScore: Literal["PENDING", "LOW", "MEDIUM", "HIGH", "CRITICAL"] = "PENDING"
    riskReasoning: str = ""
    status: Literal["open", "found", "closed"] = "open"
    createdAt: str
    updatedAt: str
    retentionExpiresAt: Optional[str] = None
    
class SightingCreate(BaseModel):
    location: Location
    photoUrl: str
    reporterUid: str
    
class SightingDB(SightingCreate):
    sightingId: str
    reporterTrustScore: float = 50.0
    credibilityScore: float = 0.0
    confidenceLabel: Literal["PENDING", "LOW", "MEDIUM", "HIGH"] = "PENDING"
    verifiedBy: str = "agent"
    status: Literal["pending", "dispatched", "dismissed"] = "pending"
    timestamp: str

# Sighting Sate for LangGraph
class SightingState(BaseModel):
    sighting: SightingDB
    case: CaseDB
    reporterHistory: Optional[dict] = None
    facialSimilarity: Optional[float] = None
    locationPlausibility: Optional[float] = None
    credibilityScore: float = 0.0
    confidenceLabel: Literal["PENDING", "LOW", "MEDIUM", "HIGH"] = "PENDING"
    reasoning: str = ""
    
# Case State for LangGraph
class CaseState(BaseModel):
    case_data: dict # Raw data initially
    case: Optional[CaseDB] = None
    is_valid: bool = False
    validation_error: str = ""
    custody_dispute_flag: bool = False
    risk_score: str = "PENDING"
    risk_reasoning: str = ""
    photo_hash: str = ""
    trafficking_matches: List[dict] = []
    pattern_predictions: dict = {}
    age_progressed_photo_url: str = ""
    alert_distributed: bool = False
    audit_log: List[dict] = []
