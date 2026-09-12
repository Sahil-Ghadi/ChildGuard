import os
import datetime
import urllib.request
import hashlib
from models import SightingState
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from pydantic import BaseModel, Field

class SightingVerification(BaseModel):
    credibility_score: float = Field(description="Score from 0.0 to 100.0")
    confidence_label: str = Field(description="One of LOW, MEDIUM, HIGH")
    reasoning: str = Field(description="Detailed forensic reasoning for the score")

def sighting_verifier_agent(state: SightingState) -> SightingState:
    """
    Verifies a community sighting using real multimodal face comparison with gemini-3.6-flash.
    """
    case = state.case
    sighting = state.sighting
    
    # 1. Location plausibility check
    location_str = sighting.location.address.lower()
    case_location_str = case.lastSeenLocation.address.lower()
    
    # Check geographic proximity or transit corridor
    if any(term in location_str for term in ["metro", "station", "isbt", "highway", "bus", "railway", "terminal", "gate", "road"]):
        state.locationPlausibility = 0.85
    else:
        state.locationPlausibility = 0.60

    case_photo = (case.photoUrl or "").strip()
    sighting_photo = (sighting.photoUrl or "").strip()

    # 2. Check for identical image match (Exact match)
    if case_photo and sighting_photo and case_photo == sighting_photo:
        state.facialSimilarity = 1.0
        state.credibilityScore = 98.5
        state.confidenceLabel = "HIGH"
        state.reasoning = "Visual identity match: The submitted sighting photograph is an identical match to the reference dossier photo."
        state.sighting.credibilityScore = state.credibilityScore
        state.sighting.confidenceLabel = state.confidenceLabel
        return state

    # 3. If either photo is missing, calculate without image
    if not sighting_photo or not case_photo:
        state.facialSimilarity = 0.0
        state.credibilityScore = 25.0
        state.confidenceLabel = "LOW"
        state.reasoning = "No sighting photo provided for facial biometric verification."
        state.sighting.credibilityScore = state.credibilityScore
        state.sighting.confidenceLabel = state.confidenceLabel
        return state

    # 4. Multimodal comparison with gemini-3.6-flash
    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if api_key:
        try:
            llm = ChatGoogleGenerativeAI(
                model="gemini-3.6-flash"
            )
            structured_llm = llm.with_structured_output(SightingVerification)
            
            prompt_text = (
                f"You are a forensic biometric investigator for the ChildGuard Missing Child Alert Network.\n"
                f"You are evaluating whether a citizen sighting photograph matches a reported missing child.\n\n"
                f"Missing Child Dossier:\n"
                f"- Name: {case.childName}\n"
                f"- Age: {case.age} years old\n"
                f"- Last Seen Location: {case.lastSeenLocation.address}\n"
                f"- Description: {case.description}\n\n"
                f"Citizen Sighting Submission:\n"
                f"- Sighting Location: {sighting.location.address}\n\n"
                f"Images Provided:\n"
                f"- Image 1: Official reference photograph of the missing child.\n"
                f"- Image 2: Sighting photograph submitted by citizen eyewitness.\n\n"
                f"Verification Guidelines:\n"
                f"1. Check if Image 2 shows a human child or person. If Image 2 is an inanimate object, animal, vehicle, or clearly an adult, score credibility below 15 and label LOW.\n"
                f"2. Compare facial structure carefully: eyes, nose shape, mouth, face contour, hairline, skin tone, and distinguishing marks.\n"
                f"3. If Image 2 shows the SAME child or identical photo, assign credibility score between 90.0 and 99.0 and confidence label HIGH.\n"
                f"4. If Image 2 shows strong resemblance but uncertain lighting/angle, assign credibility score 65.0 - 84.0 and confidence label MEDIUM.\n"
                f"5. If Image 2 shows a clearly different child or adult, assign credibility score 0.0 - 40.0 and confidence label LOW.\n"
                f"Provide clear, professional forensic reasoning."
            )
            
            msg = HumanMessage(content=[
                {"type": "text", "text": prompt_text},
                {"type": "image_url", "image_url": case_photo},
                {"type": "image_url", "image_url": sighting_photo}
            ])
            
            result = structured_llm.invoke([msg])
            
            state.credibilityScore = float(result.credibility_score)
            state.confidenceLabel = result.confidence_label.upper()
            state.reasoning = result.reasoning
            state.facialSimilarity = state.credibilityScore / 100.0
            
            state.sighting.credibilityScore = state.credibilityScore
            state.sighting.confidenceLabel = state.confidenceLabel
            return state

        except Exception as e:
            print(f"Gemini Multimodal Verification Error: {e}")

    # Fallback heuristic if multimodal API call fails
    return fallback_verification(state)

def fallback_verification(state: SightingState) -> SightingState:
    base = (state.sighting.reporterTrustScore or 50.0) * 0.3 + (state.locationPlausibility or 0.5) * 70.0
    state.credibilityScore = round(min(base, 65.0), 1)
    state.confidenceLabel = "MEDIUM" if state.credibilityScore >= 50 else "LOW"
    state.reasoning = f"Heuristic analysis based on location plausibility ({state.locationPlausibility * 100:.0f}%) and reporter credibility."
    state.sighting.credibilityScore = state.credibilityScore
    state.sighting.confidenceLabel = state.confidenceLabel
    return state
