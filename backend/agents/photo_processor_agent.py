import datetime
import hashlib
from models import CaseState

def photo_processor_agent(state: CaseState) -> CaseState:
    """
    Simulates photo processing and perceptual hashing.
    """
    if not state.is_valid or not state.case:
        return state
        
    case = state.case
    
    if not case.photoUrl:
        state.photo_hash = ""
        return state
        
    # Simulate perceptual hashing (in reality, download image, normalize, calculate pHash)
    # Using SHA-256 for simulation
    mock_hash = hashlib.sha256(case.photoUrl.encode()).hexdigest()[:16]
    state.photo_hash = mock_hash
    
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    state.audit_log.append({
        "agentName": "Photo Processor Agent",
        "action": "Generated perceptual hash",
        "reasoning": f"Generated hash {mock_hash} for photo matching.",
        "timestamp": now_iso
    })
    
    return state
