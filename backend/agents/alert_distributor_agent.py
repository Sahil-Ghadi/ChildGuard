import datetime
from models import CaseState

def alert_distributor_agent(state: CaseState) -> CaseState:
    """
    Distributes public alerts if the risk score is HIGH or CRITICAL.
    """
    if not state.is_valid or not state.case:
        return state
        
    case = state.case
    
    if case.riskScore in ["HIGH", "CRITICAL"]:
        state.alert_distributed = True
        
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        state.audit_log.append({
            "agentName": "Alert Distributor Agent",
            "action": "Broadcasted public alert",
            "reasoning": f"Risk score is {case.riskScore}. Simulated SMS broadcast to 100k recipients in radius.",
            "timestamp": now_iso
        })
        
        # In a real app, this would call Twilio/SNS here
        print(f"--- SIMULATED ALERT --- Case {case.caseId}: {case.childName} missing near {case.lastSeenLocation.address}")
    else:
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        state.audit_log.append({
            "agentName": "Alert Distributor Agent",
            "action": "Skipped public alert",
            "reasoning": f"Risk score is {case.riskScore}. Below HIGH threshold.",
            "timestamp": now_iso
        })
        
    return state
