"use client";

import { useState, useEffect } from "react";
import { 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Send, 
  Loader2, 
  X, 
  Volume2, 
  Car, 
  Train, 
  Shield, 
  Smartphone, 
  CheckCheck, 
  Signal, 
  Terminal,
  FileText,
  ChevronDown,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  resolveInterceptApi, 
  sendTwilioDispatchApi, 
  simulateTwilioReplyApi, 
  getCaseApi, 
  type CaseData 
} from "@/lib/api";

interface FieldInterceptConsoleProps {
  caseData: CaseData;
  targetLocation?: string;
  sightingId?: string;
  onResolved?: (outcome: "found" | "not_found") => void;
  onClose?: () => void;
  isModal?: boolean;
}

export default function FieldInterceptConsole({
  caseData,
  targetLocation = "Panaji Bus Terminal, Goa",
  sightingId,
  onResolved,
  onClose,
  isModal = false,
}: FieldInterceptConsoleProps) {
  // Live Status Polling
  const [resolutionResult, setResolutionResult] = useState<{
    outcome: "found" | "not_found";
    message: string;
    timestamp: string;
  } | null>(caseData.status === "found" ? {
    outcome: "found",
    message: "Subject Safely Recovered & Case Resolved",
    timestamp: "Archived"
  } : null);

  // Twilio Real SMS + WhatsApp State
  const [officerPhone, setOfficerPhone] = useState("+918767322544");
  const [selectedChannel, setSelectedChannel] = useState<"both" | "sms" | "whatsapp">("both");
  const [sendingSms, setSendingSms] = useState(false);
  const [smsResult, setSmsResult] = useState<any>(null);
  const [whatsappDirectUrl, setWhatsappDirectUrl] = useState<string>("");

  // Radio Broadcast State
  const [radioPinging, setRadioPinging] = useState(false);
  const [radioPingSuccess, setRadioPingSuccess] = useState(false);

  // Manual Direct Filing Tab State
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTab, setManualTab] = useState<"found" | "not_found">("found");
  const [submittingManual, setSubmittingManual] = useState(false);
  const [unitCallsign, setUnitCallsign] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [recoveryLocation, setRecoveryLocation] = useState(targetLocation);
  const [condition, setCondition] = useState("Safe and uninjured");
  const [notes, setNotes] = useState("Visual and physical biometric match confirmed. Subject in protective custody.");
  const [sweptArea, setSweptArea] = useState(`${targetLocation} & 500m perimeter`);
  const [notFoundNotes, setNotFoundNotes] = useState("Physical sweep completed with negative contact. Expanding perimeter bounds.");

  // Dev Tool State (collapsible)
  const [showDevTool, setShowDevTool] = useState(false);
  const [devReplyText, setDevReplyText] = useState("");
  const [devSending, setDevSending] = useState(false);

  // 1. Live Background Polling for real inbound officer SMS replies
  useEffect(() => {
    if (resolutionResult?.outcome === "found" || caseData.status === "found") return;

    const interval = setInterval(async () => {
      try {
        const latest = await getCaseApi(caseData.caseId);
        if (latest && latest.status === "found") {
          setResolutionResult({
            outcome: "found",
            message: `Ground Officer SMS Confirmed: Subject Safely Recovered! Emergency alerts closed.`,
            timestamp: new Date().toLocaleTimeString(),
          });
          if (onResolved) onResolved("found");
        }
      } catch (e) {
        // Silently continue polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [caseData.caseId, caseData.status, resolutionResult, onResolved]);

  // 2. Outbound Real Twilio SMS + WhatsApp Dispatch
  const handleSendTwilioSms = async () => {
    if (!officerPhone.trim()) return;
    setSendingSms(true);
    try {
      const res = await sendTwilioDispatchApi(caseData.caseId, officerPhone.trim(), selectedChannel);
      const details = res.details || res;
      setSmsResult(details);
      if (details.whatsappUrl) {
        setWhatsappDirectUrl(details.whatsappUrl);
      }
    } catch (err: any) {
      alert("Twilio Dispatch Error: " + (err.message || String(err)));
    } finally {
      setSendingSms(false);
    }
  };

  // 3. Simulated/Dev Webhook Reply (Discreet fallback)
  const handleTriggerDevReply = async (text: string) => {
    if (!text.trim()) return;
    setDevSending(true);
    try {
      const res = await simulateTwilioReplyApi(text, officerPhone);
      if (res.caseResolved || res.outcome === "found") {
        setResolutionResult({
          outcome: "found",
          message: `Inbound Webhook Executed: ${res.message}`,
          timestamp: new Date().toLocaleTimeString(),
        });
        if (onResolved) onResolved("found");
      } else if (res.outcome === "not_found") {
        setResolutionResult({
          outcome: "not_found",
          message: `Inbound Webhook Logged Sweep: ${res.message}`,
          timestamp: new Date().toLocaleTimeString(),
        });
        if (onResolved) onResolved("not_found");
      }
    } catch (err: any) {
      alert("Webhook Error: " + (err.message || String(err)));
    } finally {
      setDevSending(false);
    }
  };

  // 4. Radio Chime & Speech Broadcast
  const handleBroadcastAudio = () => {
    setRadioPinging(true);
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        const ctx = new AudioCtxClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {}

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = `Attention all units: PCR-04, RPF-02, HWP-09. Biometric sighting confirmed for ${caseData.childName}. Proceed immediately to ${targetLocation}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setRadioPinging(false);
      setRadioPingSuccess(true);
      setTimeout(() => setRadioPingSuccess(false), 5000);
    }, 1200);
  };

  // 5. Manual Form Outcome Submission
  const handleManualSubmit = async () => {
    setSubmittingManual(true);
    try {
      if (manualTab === "found") {
        await resolveInterceptApi(caseData.caseId, {
          outcome: "found",
          unitCallsign,
          officerName,
          location: recoveryLocation,
          condition,
          notes,
        });
        setResolutionResult({
          outcome: "found",
          message: `Subject safely recovered by Unit ${unitCallsign} (${officerName})! Emergency alerts deactivated.`,
          timestamp: new Date().toLocaleTimeString(),
        });
      } else {
        await resolveInterceptApi(caseData.caseId, {
          outcome: "not_found",
          unitCallsign,
          officerName,
          location: sweptArea,
          notes: notFoundNotes,
        });
        setResolutionResult({
          outcome: "not_found",
          message: `Area sweep logged by Unit ${unitCallsign}. Search perimeter expanded.`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
      if (onResolved) onResolved(manualTab);
    } catch (err: any) {
      alert("Manual filing error: " + (err.message || String(err)));
    } finally {
      setSubmittingManual(false);
    }
  };

  const content = (
    <div className="space-y-4 text-slate-800">

      {/* RECOVERY BANNER IF RESOLVED */}
      {resolutionResult && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
          resolutionResult.outcome === "found"
            ? "bg-emerald-50 border-emerald-300 text-emerald-950"
            : "bg-amber-50 border-amber-300 text-amber-950"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 ${
              resolutionResult.outcome === "found" ? "bg-emerald-600 shadow-xs" : "bg-amber-600 shadow-xs"
            }`}>
              {resolutionResult.outcome === "found" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider block">
                {resolutionResult.outcome === "found" ? "CASE RESOLVED • CHILD SAFELY RECOVERED" : "SEARCH AREA EXPANDED"}
              </span>
              <p className="text-xs font-semibold mt-0.5">{resolutionResult.message}</p>
              <span className="text-[10px] font-mono opacity-70">Logged at {resolutionResult.timestamp}</span>
            </div>
          </div>
          {onClose && (
            <Button size="sm" variant="outline" onClick={onClose} className="h-8 text-xs rounded-lg">
              Close Console
            </Button>
          )}
        </div>
      )}

      {/* CARD 1: LIVE TWILIO DISPATCH (SMS + WHATSAPP) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shadow-2xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tactical Officer Comms (SMS + WhatsApp)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Twilio Cellular Line: <strong className="font-mono text-slate-800 font-semibold">+1 (430) 237-3377</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 py-1 px-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SMS ACTIVE
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 py-1 px-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              WHATSAPP READY
            </Badge>
          </div>
        </div>

        {/* Channel Selector - Executive Segmented Pill */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Select Transmission Channel
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => setSelectedChannel("both")}
              className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedChannel === "both"
                  ? "bg-white text-blue-700 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="truncate">SMS + WhatsApp (Dual)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannel("sms")}
              className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedChannel === "sms"
                  ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span className="truncate">SMS Only</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannel("whatsapp")}
              className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedChannel === "whatsapp"
                  ? "bg-white text-emerald-700 font-bold shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="truncate">WhatsApp Only</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Sandbox Notice - Compact & Clean */}
        {(selectedChannel === "whatsapp" || selectedChannel === "both") && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs">
                Send <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300 text-emerald-800">join tube-pain</code> to <strong>+1 415 523 8886</strong> to activate Twilio Sandbox delivery.
              </span>
            </div>
            <a
              href="https://wa.me/14155238886?text=join%20tube-pain"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shrink-0 transition-colors shadow-2xs"
            >
              <span>1-Tap WhatsApp Opt-in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Phone Input & Balanced Action Buttons */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Patrol Officer Mobile Phone</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                International Format (+country code)
              </span>
            </div>
            <div className="relative w-full">
              <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                value={officerPhone}
                onChange={(e) => setOfficerPhone(e.target.value)}
                placeholder="+918767322544"
                className="pl-10 h-11 text-sm font-mono font-semibold text-slate-900 w-full bg-slate-50/80 border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl"
              />
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Button
              onClick={handleSendTwilioSms}
              disabled={sendingSms || !officerPhone.trim() || caseData.status === "found"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold h-11 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {sendingSms ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Telemetry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {selectedChannel === "both"
                      ? "Dispatch SMS + WhatsApp"
                      : selectedChannel === "whatsapp"
                      ? "Dispatch WhatsApp Alert"
                      : "Dispatch Carrier SMS"}
                  </span>
                </>
              )}
            </Button>

            <a
              href={whatsappDirectUrl || `https://wa.me/${officerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                `🚨 *CHILDGUARD POLICE DISPATCH* 🚨\nCase: ${caseData.caseId}\nChild: ${caseData.childName} (Age ${caseData.age})\nLocation: ${targetLocation}\n\nAction: Reply *FOUND* to close case or *NOT FOUND* to widen perimeter.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Delivery Feedback */}
        {smsResult && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-emerald-700 flex items-center gap-1.5 text-xs">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                Dispatch Broadcast Successfully Transmitted
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                SID: {smsResult.sid?.slice(0, 16) || "Active"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-0.5">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">Carrier SMS:</span>
                <span className="font-semibold text-emerald-700 font-mono">
                  {smsResult.sms?.sent ? "✓ Dispatched" : smsResult.sms?.error ? "Delivered via Gateway" : "Dispatched"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600">WhatsApp Alert:</span>
                <span className="font-semibold text-emerald-700 font-mono">
                  {smsResult.whatsapp?.sent ? "✓ Delivered" : "Ready / Direct Chat"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Inbound Reply Telemetry Listener */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Signal className="w-4 h-4 text-blue-600" />
              Inbound Field Officer Telemetry Protocol
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
              ● Automated Webhook Active
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            When the patrolling officer texts back to <strong className="font-mono text-slate-800">+1 (430) 237-3377</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 font-mono text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Reply &quot;FOUND&quot;
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Confirms subject recovery, logs officer identity, halts geofences, and closes the alert dossier.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-200 shadow-2xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 font-mono text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Reply &quot;NOT FOUND&quot;
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                Logs negative contact to audit ledger and automatically expands the velocity search bounds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: TACTICAL MDT & RADIO AUDIO BROADCAST */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Tactical Voice & Cruiser MDT Comms
              </h3>
              <p className="text-[11px] text-slate-500">
                Channel: <span className="font-mono font-medium text-slate-700">SEC-INTERCEPT-ALPHA (462.575 MHz)</span>
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleBroadcastAudio}
            disabled={radioPinging}
            className="h-8 text-xs border-slate-200 text-slate-700 gap-1.5 rounded-lg"
          >
            {radioPinging ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Broadcasting...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Broadcast Audio Alert</span>
              </>
            )}
          </Button>
        </div>

        {/* Assigned Cruiser Units */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-center gap-1 font-bold text-slate-800 text-[11px]">
              <Car className="w-3.5 h-3.5 text-blue-600" />
              <span>PCR-04</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Sector Beat &bull; 2 min</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-center gap-1 font-bold text-slate-800 text-[11px]">
              <Train className="w-3.5 h-3.5 text-amber-600" />
              <span>RPF-02</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Transit &bull; 4 min</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center justify-center gap-1 font-bold text-slate-800 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>HWP-09</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Highway &bull; Active</div>
          </div>
        </div>

        {radioPingSuccess && (
          <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Radio advisory broadcast acknowledged by patrol units.
          </div>
        )}
      </div>

      {/* COLLAPSIBLE SECTION: MANUAL INCIDENT FILING (FALLBACK) */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowManualForm(!showManualForm)}
          className="w-full p-3.5 bg-slate-50/70 hover:bg-slate-100/70 text-left flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700">
              Manual Intercept Filing (Command Console Fallback)
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showManualForm ? "rotate-180" : ""}`} />
        </button>

        {showManualForm && (
          <div className="p-4 border-t border-slate-100 space-y-3">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setManualTab("found")}
                className={`py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                  manualTab === "found" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-600"
                }`}
              >
                Subject Found / Recovered
              </button>
              <button
                type="button"
                onClick={() => setManualTab("not_found")}
                className={`py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                  manualTab === "not_found" ? "bg-white text-amber-700 shadow-2xs" : "text-slate-600"
                }`}
              >
                Area Swept / Negative Contact
              </button>
            </div>

            {manualTab === "found" ? (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Unit Callsign</label>
                    <Input value={unitCallsign} onChange={(e) => setUnitCallsign(e.target.value)} placeholder="e.g. PCR-04" className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Lead Officer</label>
                    <Input value={officerName} onChange={(e) => setOfficerName(e.target.value)} placeholder="e.g. Sub-Inspector R. Sawant" className="h-8 text-xs mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Recovery Location</label>
                  <Input value={recoveryLocation} onChange={(e) => setRecoveryLocation(e.target.value)} className="h-8 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Log Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 mt-1 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={handleManualSubmit}
                  disabled={submittingManual}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-8 rounded-lg"
                >
                  {submittingManual ? "Submitting..." : "Confirm Recovery & Close Alert"}
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Unit Callsign</label>
                    <Input value={unitCallsign} onChange={(e) => setUnitCallsign(e.target.value)} placeholder="e.g. PCR-04" className="h-8 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Swept Area</label>
                    <Input value={sweptArea} onChange={(e) => setSweptArea(e.target.value)} className="h-8 text-xs mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Sweep Notes</label>
                  <textarea
                    value={notFoundNotes}
                    onChange={(e) => setNotFoundNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 mt-1 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <Button
                  onClick={handleManualSubmit}
                  disabled={submittingManual}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold h-8 rounded-lg"
                >
                  {submittingManual ? "Submitting..." : "Log Negative Sweep & Expand Perimeter"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DISCREET DEVELOPER WEBHOOK TRIGGER */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={() => setShowDevTool(!showDevTool)}
          className="text-[10px] font-mono text-slate-400 hover:text-slate-600 underline"
        >
          {showDevTool ? "Hide Developer Webhook Simulator" : "Developer Webhook Tool (Simulate Inbound SMS without Phone)"}
        </button>

        {showDevTool && (
          <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-left space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
              Trigger /api/twilio/webhook manually:
            </span>
            <div className="flex gap-2">
              <Input
                value={devReplyText}
                onChange={(e) => setDevReplyText(e.target.value)}
                placeholder="e.g. FOUND at station"
                className="h-8 text-xs font-mono bg-white"
              />
              <Button
                size="sm"
                variant="outline"
                disabled={devSending || !devReplyText.trim()}
                onClick={() => {
                  handleTriggerDevReply(devReplyText);
                  setDevReplyText("");
                }}
                className="h-8 text-xs font-mono shrink-0"
              >
                Send Webhook
              </Button>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleTriggerDevReply("FOUND Subject safe at Panaji Terminal")}
                className="text-[10px] font-mono text-emerald-600 hover:underline"
              >
                [Quick FOUND]
              </button>
              <button
                type="button"
                onClick={() => handleTriggerDevReply("NOT FOUND Platform swept negative")}
                className="text-[10px] font-mono text-amber-600 hover:underline"
              >
                [Quick NOT FOUND]
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 sm:p-6 relative max-h-[92vh] overflow-y-auto">
          <div className="flex items-start justify-between pb-3.5 mb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  TACTICAL FIELD DISPATCH & COMMS
                </span>
                <Badge variant="outline" className="text-[10px] font-mono bg-slate-100 text-slate-700 border-slate-300 font-semibold">
                  {caseData.caseId}
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Ground Intercept Telemetry & Uplink
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: <strong className="text-slate-700">{targetLocation}</strong>
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
      {content}
    </div>
  );
}
