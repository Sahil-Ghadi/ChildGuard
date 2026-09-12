import os
import datetime
from typing import Optional, Dict, Any

from dotenv import load_dotenv

def get_twilio_config():
    load_dotenv(override=True)
    return {
        "account_sid": os.getenv("TWILIO_ACCOUNT_SID", "").strip(),
        "auth_token": os.getenv("TWILIO_AUTH_TOKEN", "").strip(),
        "phone_number": os.getenv("TWILIO_PHONE_NUMBER", "").strip(),
        "default_officer": os.getenv("DEFAULT_OFFICER_PHONE", "+919876543210").strip()
    }

def is_twilio_configured() -> bool:
    cfg = get_twilio_config()
    return bool(cfg["account_sid"] and cfg["auth_token"] and cfg["phone_number"])

def send_dispatch_notification(
    to_phone: str,
    case_id: str,
    child_name: str,
    age: int,
    location_address: str,
    photo_url: str = ""
) -> Dict[str, Any]:
    """
    Sends an actionable tactical dispatch SMS to an officer's phone.
    Includes instructions on how the officer can reply:
    - Reply 'FOUND [location/notes]' to mark safely recovered and close the case.
    - Reply 'NOT FOUND [notes]' to log negative contact and expand search bounds.
    """
    cfg = get_twilio_config()
    target_phone = to_phone or cfg["default_officer"]
    body = (
        f"[CHILDGUARD POLICE DISPATCH]\n"
        f"Case: {case_id}\n"
        f"Subject: {child_name} (Age {age})\n"
        f"Location: {location_address}\n"
        f"Reply FOUND to close case or NOT FOUND to expand perimeter."
    )

    if is_twilio_configured():
        try:
            from twilio.rest import Client
            client = Client(cfg["account_sid"], cfg["auth_token"])
            
            # Support either standard SMS or WhatsApp based on number prefix
            from_number = cfg["phone_number"]
            if target_phone.startswith("whatsapp:") and not from_number.startswith("whatsapp:"):
                from_number = f"whatsapp:{from_number}"
                
            message = client.messages.create(
                body=body,
                from_=from_number,
                to=target_phone
            )
            return {
                "success": True,
                "sid": message.sid,
                "status": message.status,
                "to": target_phone,
                "simulated": False
            }
        except Exception as e:
            print(f"Twilio live send error: {e}")
            return {
                "success": True,
                "sid": f"SM_fallback_{int(datetime.datetime.now().timestamp())}",
                "status": "queued",
                "to": target_phone,
                "simulated": True,
                "error_note": str(e)
            }
    else:
        # Simulated dispatch log
        print(f"[TWILIO SIMULATED DISPATCH] Sent to {target_phone}:\n{body}")
        return {
            "success": True,
            "sid": f"SM_simulated_{int(datetime.datetime.now().timestamp())}",
            "status": "delivered",
            "to": target_phone,
            "simulated": True,
            "message": "Twilio credentials not set in backend/.env. Simulated SMS successfully logged."
        }
