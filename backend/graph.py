from langgraph.graph import StateGraph, END
from models import CaseState, SightingState

from agents.intake_agent import intake_agent
from agents.risk_classifier_agent import risk_classifier_agent
from agents.photo_processor_agent import photo_processor_agent
from agents.trafficking_scanner_agent import trafficking_scanner_agent
from agents.pattern_detector_agent import pattern_detector_agent
from agents.alert_distributor_agent import alert_distributor_agent
from agents.sighting_verifier_agent import sighting_verifier_agent

# --- Case Processing Graph ---

def route_valid_case(state: CaseState):
    if state.is_valid:
        return "risk_classifier"
    return END

def build_case_graph():
    workflow = StateGraph(CaseState)
    
    workflow.add_node("intake", intake_agent)
    workflow.add_node("risk_classifier", risk_classifier_agent)
    workflow.add_node("photo_processor", photo_processor_agent)
    workflow.add_node("trafficking_scanner", trafficking_scanner_agent)
    workflow.add_node("pattern_detector", pattern_detector_agent)
    workflow.add_node("alert_distributor", alert_distributor_agent)
    
    workflow.set_entry_point("intake")
    
    # Conditional routing after intake
    workflow.add_conditional_edges("intake", route_valid_case, {
        "risk_classifier": "risk_classifier",
        END: END
    })
    
    workflow.add_edge("risk_classifier", "photo_processor")
    
    # Parallel processing in LangGraph requires some fan-out/fan-in or sequential. 
    # For simplicity, we execute them sequentially here
    workflow.add_edge("photo_processor", "trafficking_scanner")
    workflow.add_edge("trafficking_scanner", "pattern_detector")
    workflow.add_edge("pattern_detector", "alert_distributor")
    workflow.add_edge("alert_distributor", END)
    
    return workflow.compile()


# --- Sighting Verification Graph ---

def build_sighting_graph():
    workflow = StateGraph(SightingState)
    workflow.add_node("verifier", sighting_verifier_agent)
    workflow.set_entry_point("verifier")
    workflow.add_edge("verifier", END)
    
    return workflow.compile()

case_app = build_case_graph()
sighting_app = build_sighting_graph()
