import os
import datetime
import urllib.parse
from typing import Optional, Dict, Any

from dotenv import load_dotenv

def get_twilio_config():
    load_dotenv(override=True)
    return {
        "account_sid": os.getenv("TWILIO_ACCOUNT_SID", "").strip(),
        "auth_token": os.getenv("TWILIO_AUTH_TOKEN", "").strip(),
        "phone_number": os.getenv("TWILIO_PHONE_NUMBER", "+14302373377").strip(),
        "whatsapp_number": os.getenv("TWILIO_WHATSAPP_NUMBER", "+14155238886").strip(),
        "whatsapp_sandbox_code": os.getenv("TWILIO_WHATSAPP_SANDBOX_CODE", "join tube-pain").strip(),
        "default_officer": os.getenv("DEFAULT_OFFICER_PHONE", "+918767322544").strip()
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
    photo_url: str = "",
    channel: str = "both",  # "sms", "whatsapp", or "both"
    coords: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Sends dual-channel dispatch alerts (Carrier SMS + WhatsApp) to the patrol officer.
    Provides direct reply instructions and live Google Maps navigation link.
    """
    cfg = get_twilio_config()
    target_phone = (to_phone or cfg["default_officer"]).strip()
    
    # Generate Google Maps navigation link for officer routing
    maps_link = ""
    if coords and coords.get("lat") and coords.get("lng"):
        maps_link = f"https://www.google.com/maps?q={coords['lat']},{coords['lng']}"
    elif location_address:
        maps_link = f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(location_address)}"

    # Pure ASCII template for high-reliability carrier SMS
    sms_body = (
        f"[CHILDGUARD POLICE DISPATCH]\n"
        f"Case: {case_id}\n"
        f"Subject: {child_name} (Age {age})\n"
        f"Location: {location_address}\n"
        + (f"Directions: {maps_link}\n" if maps_link else "") +
        f"Reply FOUND to close case or NOT FOUND to expand perimeter."
    )

    # Formatted WhatsApp message with bolding, location, maps pin, and action cues
    wa_body = (
        f"🚨 *CHILDGUARD TACTICAL FIELD DISPATCH* 🚨\n\n"
        f"📋 *Case ID:* {case_id}\n"
        f"👤 *Child Name:* {child_name} (Age {age})\n"
        f"📍 *Dispatched Location:* {location_address}\n"
        + (f"🗺️ *Live Google Maps:* {maps_link}\n" if maps_link else "") +
        f"📸 *Dossier Photo:* {photo_url if photo_url else 'Available on Dispatch Console'}\n\n"
        f"⚡ *REPLY DIRECTLY VIA WHATSAPP / SMS:*\n"
        f"• Send *FOUND* to confirm recovery & close case.\n"
        f"• Send *NOT FOUND* to log negative contact & widen perimeter."
    )

    clean_digits = "".join(filter(str.isdigit, target_phone))
    direct_wa_link = f"https://wa.me/{clean_digits}?text={urllib.parse.quote(wa_body)}"
    
    sandbox_code = cfg["whatsapp_sandbox_code"]
    sandbox_number_digits = "".join(filter(str.isdigit, cfg["whatsapp_number"]))
    sandbox_join_url = f"https://wa.me/{sandbox_number_digits}?text={urllib.parse.quote(sandbox_code)}"

    results: Dict[str, Any] = {
        "success": True,
        "to": target_phone,
        "whatsappUrl": direct_wa_link,
        "sandboxJoinUrl": sandbox_join_url,
        "sandboxKeyword": sandbox_code,
        "sandboxNumber": cfg["whatsapp_number"],
        "sms": None,
        "whatsapp": None,
        "simulated": not is_twilio_configured()
    }

    if is_twilio_configured():
        try:
            from twilio.rest import Client
            client = Client(cfg["account_sid"], cfg["auth_token"])
            
            # 1. Send Carrier SMS
            if channel in ["sms", "both"]:
                try:
                    sms_msg = client.messages.create(
                        body=sms_body,
                        from_=cfg["phone_number"],
                        to=target_phone
                    )
                    results["sms"] = {
                        "sid": sms_msg.sid,
                        "status": sms_msg.status,
                        "sent": True
                    }
                    results["sid"] = sms_msg.sid
                except Exception as sms_err:
                    print(f"Twilio SMS send error: {sms_err}")
                    results["sms"] = {
                        "error": str(sms_err),
                        "sent": False
                    }

            # 2. Send Twilio WhatsApp Alert (Sandbox / Direct)
            if channel in ["whatsapp", "both"]:
                try:
                    wa_to = f"whatsapp:{target_phone}" if not target_phone.startswith("whatsapp:") else target_phone
                    wa_from = f"whatsapp:{cfg['whatsapp_number']}" if not cfg['whatsapp_number'].startswith("whatsapp:") else cfg['whatsapp_number']
                    wa_msg = client.messages.create(
                        body=wa_body,
                        from_=wa_from,
                        to=wa_to
                    )
                    results["whatsapp"] = {
                        "sid": wa_msg.sid,
                        "status": wa_msg.status,
                        "sent": True,
                        "sandbox_note": f"If WhatsApp is not received, send '{sandbox_code}' to {cfg['whatsapp_number']} on WhatsApp to activate sandbox."
                    }
                    if "sid" not in results:
                        results["sid"] = wa_msg.sid
                except Exception as wa_err:
                    print(f"Twilio WhatsApp send note: {wa_err}")
                    results["whatsapp"] = {
                        "error": str(wa_err),
                        "sent": False,
                        "sandbox_note": f"To receive Twilio Sandbox WhatsApp messages, send '{sandbox_code}' to {cfg['whatsapp_number']}, or tap the 1-click WhatsApp link."
                    }

        except Exception as e:
            print(f"Twilio client init error: {e}")
            results["error"] = str(e)
            results["simulated"] = True
    else:
        results["simulated"] = True
        results["message"] = "Twilio credentials not configured in backend/.env."

    return results
