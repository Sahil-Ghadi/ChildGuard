import datetime
from models import CaseState

def trafficking_scanner_agent(state: CaseState) -> CaseState:
    """
    Simulated scan against a mock trafficking dataset.
    """
    if not state.is_valid or not state.case:
        return state
        
    # Simulated matches. Always return empty for the hackathon demo unless we hardcode a match condition.
    state.trafficking_matches = []
    
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    state.audit_log.append({
        "agentName": "Trafficking Scanner Agent (SIMULATED)",
        "action": "Scanned against mock trafficking dataset",
        "reasoning": "No matches found.",
        "timestamp": now_iso
    })
    
    return state
