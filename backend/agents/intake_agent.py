from models import CaseState, CaseDB
import uuid
import datetime

def intake_agent(state: CaseState) -> CaseState:
    """
    Validates the raw report form and converts it to a structured Case object.
    Also checks for consent/custody-dispute flags.
    """
    raw_data = state.case_data
    
    # 1. Validation
    required_fields = ["childName", "age", "lastSeenLocation", "reporterUid"]
    for field in required_fields:
        if field not in raw_data:
            state.is_valid = False
            state.validation_error = f"Missing required field: {field}"
            return state
            
    # 2. Custody dispute heuristic (simulated check based on relationship/description)
    description = raw_data.get("description", "").lower()
    relationship = raw_data.get("reporterRelationship", "").lower()
    
    custody_flag = False
    if "custody" in description or "divorce" in description or "court" in description:
        custody_flag = True
    
    if not raw_data.get("consentFlag", False):
        custody_flag = True # Flag if consent is missing
        
    state.custody_dispute_flag = custody_flag
    
    # 3. Create structured object
    case_id = f"CG-2026-{(str(uuid.uuid4())[:6]).upper()}"
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    case_obj = CaseDB(
        caseId=case_id,
        childName=raw_data["childName"],
        age=raw_data["age"],
        photoUrl=raw_data.get("photoUrl", ""),
        description=raw_data.get("description", ""),
        lastSeenLocation=raw_data["lastSeenLocation"],
        reporterUid=raw_data["reporterUid"],
        reporterRelationship=raw_data.get("reporterRelationship", "unknown"),
        consentFlag=raw_data.get("consentFlag", False),
        custodyDisputeFlag=custody_flag,
        riskScore="PENDING",
        status="open",
        createdAt=now_iso,
        updatedAt=now_iso
    )
    
    state.case = case_obj
    state.is_valid = True
    state.audit_log.append({
        "agentName": "Intake Agent",
        "action": "Validated case data",
        "reasoning": "All required fields present. Custody flag evaluated.",
        "timestamp": now_iso
    })
    
    return state
