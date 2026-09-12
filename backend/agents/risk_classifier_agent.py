import os
import json
import datetime
from models import CaseState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class RiskAssessment(BaseModel):
    risk_score: str = Field(description="One of LOW, MEDIUM, HIGH, CRITICAL")
    reasoning: str = Field(description="Detailed reasoning for the score")

def risk_classifier_agent(state: CaseState) -> CaseState:
    """
    Evaluates the risk of the missing child case using LLM (Gemini).
    """
    if not state.is_valid or not state.case:
        return state
        
    case = state.case
    
    # Initialize LLM
    try:
        # Check if API key is set, else use fallback
        if not os.environ.get("GOOGLE_API_KEY") and not os.environ.get("GEMINI_API_KEY"):
            return fallback_heuristic_scoring(state)
            
        llm = ChatGoogleGenerativeAI(
            model="gemini-3.5-flash", 
            temperature=0, 
            max_tokens=500
        )
        
        # Use structured output
        structured_llm = llm.with_structured_output(RiskAssessment)
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert law enforcement risk assessor for missing child cases. "
                       "Evaluate the risk score (LOW, MEDIUM, HIGH, CRITICAL) based on the child's age, "
                       "location, description, and circumstances. Children under 10 or with medical/custody issues "
                       "should be HIGH or CRITICAL. Provide reasoning."),
            ("user", "Evaluate this case:\n"
                     "Name: {name}\n"
                     "Age: {age}\n"
                     "Description: {description}\n"
                     "Last Seen Location: {location}\n"
                     "Custody Dispute Flag: {custody}")
        ])
        
        chain = prompt | structured_llm
        
        response = chain.invoke({
            "name": case.childName,
            "age": case.age,
            "description": case.description,
            "location": case.lastSeenLocation.address,
            "custody": state.custody_dispute_flag
        })
        
        state.risk_score = response.risk_score
        state.risk_reasoning = response.reasoning
        
    except Exception as e:
        print(f"LLM Error in Risk Classifier: {e}")
        return fallback_heuristic_scoring(state)

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    state.case.riskScore = state.risk_score
    state.case.riskReasoning = state.risk_reasoning
    
    state.audit_log.append({
        "agentName": "Risk Classifier Agent",
        "action": f"Assigned {state.risk_score} risk score",
        "reasoning": state.risk_reasoning,
        "timestamp": now_iso
    })
    
    return state

def fallback_heuristic_scoring(state: CaseState) -> CaseState:
    case = state.case
    score = "MEDIUM"
    reasons = []
    
    if case.age < 12:
        score = "HIGH"
        reasons.append("Child is under 12 years old.")
    if case.age <= 7:
        score = "CRITICAL"
        reasons.append("Child is extremely vulnerable (under 8).")
    if state.custody_dispute_flag:
        if score == "MEDIUM": score = "HIGH"
        reasons.append("Potential custody dispute involved.")
        
    state.risk_score = score
    state.risk_reasoning = "Fallback Heuristic: " + " ".join(reasons)
    
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    state.case.riskScore = state.risk_score
    state.case.riskReasoning = state.risk_reasoning
    
    state.audit_log.append({
        "agentName": "Risk Classifier Agent",
        "action": f"Assigned {state.risk_score} risk score (Fallback)",
        "reasoning": state.risk_reasoning,
        "timestamp": now_iso
    })
    return state
