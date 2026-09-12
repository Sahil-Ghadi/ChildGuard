"use client";

import { useState } from "react";
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
  Users, 
  Clock, 
  Activity,
  CheckCircle,
  Car,
  Train,
  Shield,
  PhoneCall,
  Wifi,
  FileCheck2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { resolveInterceptApi, type CaseData } from "@/lib/api";

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
  const [activeTab, setActiveTab] = useState<"found" | "not_found">("found");
  const [radioPinging, setRadioPinging] = useState(false);
  const [radioPingSuccess, setRadioPingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resolutionResult, setResolutionResult] = useState<{
    outcome: "found" | "not_found";
    message: string;
    timestamp: string;
  } | null>(null);

  // Form State for Found
  const [unitCallsign, setUnitCallsign] = useState("PCR-04");
  const [officerName, setOfficerName] = useState("Sub-Inspector R. Sawant");
  const [recoveryLocation, setRecoveryLocation] = useState(targetLocation);
  const [condition, setCondition] = useState("Safe and uninjured");
  const [notes, setNotes] = useState("Subject verified against reference biometric dossier. Physical match confirmed. Child in protective custody.");

  // Form State for Not Found
  const [sweptArea, setSweptArea] = useState(`${targetLocation} & 500m commercial perimeter`);
  const [notFoundNotes, setNotFoundNotes] = useState("Conducted physical sweep of transit platforms, ticket counters, and exits. Negative visual contact. Recommend expanding velocity perimeter.");

  const handleSimulateRadioPing = () => {
    setRadioPinging(true);
    setTimeout(() => {
      setRadioPinging(false);
      setRadioPingSuccess(true);
      setTimeout(() => setRadioPingSuccess(false), 5000);
    }, 1200);
  };

  const handleReportOutcome = async () => {
    setSubmitting(true);
    try {
      if (activeTab === "found") {
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
          message: `Subject safely recovered by Unit ${unitCallsign} (${officerName})! Emergency geofences deactivated.`,
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
          message: `Area sweep logged by Unit ${unitCallsign}. Search perimeter automatically expanded.`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      if (onResolved) {
        onResolved(activeTab);
      }
    } catch (err: any) {
      console.error("Resolution submit error:", err);
      alert(err.message || "Failed to submit intercept outcome.");
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-6">
      
      {/* SECTION 1: HOW COMMAND IS CONTACTING THE TEAM */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-blue-600" />
              1. Outbound Tactical Comms (Command &rarr; Ground Units)
            </h3>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-700 border-blue-200">
            CHANNEL: SEC-INTERCEPT-ALPHA (462.575 MHz)
          </Badge>
        </div>

        {/* Radio Channel & Broadcast Banner */}
        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-300">POLICE MDT & ENCRYPTED TACTICAL RADIO</span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Target: <strong className="text-white">{targetLocation}</strong> | Case Dossier: <strong className="text-blue-400">{caseData.childName} ({caseData.caseId})</strong>
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleSimulateRadioPing}
              disabled={radioPinging}
              className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs h-8 gap-1.5 rounded-lg shrink-0 shadow-xs"
            >
              {radioPinging ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>TRANSMITTING...</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Broadcast Audio Advisory</span>
                </>
              )}
            </Button>
          </div>

          {/* Simulated Radio Transmission Display */}
          <div className="bg-slate-950/80 rounded-lg p-2.5 border border-slate-800/80 text-[11px] font-mono flex items-start gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Live Transmission Dispatch String:</span>
              <p className="text-emerald-400/90 leading-relaxed">
                &ldquo;ALL UNITS (PCR-04, RPF-02, HWP-09): High-confidence biometric sighting confirmed for {caseData.childName}, age {caseData.age}. Target coordinates pushed to cruisers at {targetLocation}. Initiate immediate perimeter sealing and visual contact.&rdquo;
              </p>
              {radioPingSuccess && (
                <span className="text-[10px] text-emerald-300 font-bold block pt-1 animate-in fade-in">
                  &check; AUDIO DISPATCH ACKNOWLEDGED BY ALL THREE FIELD STATIONS (462.575 MHz)
                </span>
              )}
            </div>
          </div>

          {/* Assigned Field Units */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs font-bold font-mono text-white">PCR-04</div>
                  <div className="text-[10px] text-slate-400">Sector Beat Patrol</div>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/50 text-emerald-400 bg-emerald-950/30">
                ETA 2 MIN
              </Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold font-mono text-white">RPF-02</div>
                  <div className="text-[10px] text-slate-400">Railway & Bus Intercept</div>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono border-amber-500/50 text-amber-400 bg-amber-950/30">
                ETA 4 MIN
              </Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-bold font-mono text-white">HWP-09</div>
                  <div className="text-[10px] text-slate-400">Highway Roadblock</div>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono border-purple-500/50 text-purple-400 bg-purple-950/30">
                ACTIVE
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: HOW THE TEAM CONTACTS COMMAND (FIELD RESOLUTION UPLINK) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
              2. Inbound Field Resolution Uplink (Ground Units &rarr; Command)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Real-time Officer Telemetry
          </span>
        </div>

        {/* Resolution Outcome Success Notification */}
        {resolutionResult && (
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 ${
            resolutionResult.outcome === "found" 
              ? "bg-emerald-50 border-emerald-300 text-emerald-900" 
              : "bg-amber-50 border-amber-300 text-amber-900"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${
                resolutionResult.outcome === "found" ? "bg-emerald-600" : "bg-amber-600"
              }`}>
                {resolutionResult.outcome === "found" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                  {resolutionResult.outcome === "found" ? "CRITICAL PROTOCOL: RECOVERY CONFIRMED" : "SEARCH ADJUSTMENT LOGGED"}
                </span>
                <p className="text-xs font-bold">{resolutionResult.message}</p>
                <span className="text-[10px] font-mono opacity-75">Logged at {resolutionResult.timestamp}</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setResolutionResult(null)}
              className="h-8 text-xs border-slate-300 rounded-lg"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Action Choice Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("found")}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "found"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SUBJECT FOUND / RECOVERED</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("not_found")}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "not_found"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>AREA SWEPT - NOT LOCATED</span>
          </button>
        </div>

        {/* Tab 1: Subject Found Form */}
        {activeTab === "found" && (
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Positive Intercept Verification & Safe Recovery Filing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Reporting Unit Call sign</label>
                <select
                  value={unitCallsign}
                  onChange={(e) => setUnitCallsign(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="PCR-04">PCR-04 (Sector Beat Mobile Patrol)</option>
                  <option value="RPF-02">RPF-02 (Transit & Railway Police)</option>
                  <option value="HWP-09">HWP-09 (Highway Corridor Checkpoint)</option>
                  <option value="CID-01">CID-01 (Special Crime Investigation)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Lead Officer Name</label>
                <Input
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="bg-white border-slate-200 text-xs h-9"
                  placeholder="Officer name..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Confirmed Recovery Location</label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-600" />
                  <Input
                    value={recoveryLocation}
                    onChange={(e) => setRecoveryLocation(e.target.value)}
                    className="bg-white border-slate-200 pl-8 text-xs h-9"
                    placeholder="Specific landmark or street..."
                  />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Child&apos;s Current Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Safe and uninjured">Safe and uninjured</option>
                  <option value="Mild dehydration / receiving oral rehydration">Mild dehydration / receiving oral rehydration</option>
                  <option value="Undergoing routine checkup at District Hospital">Undergoing routine checkup at District Hospital</option>
                  <option value="Reunited with family / guardian">Reunited with family / guardian</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Field Officer Report & Log Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  placeholder="Officer observations, guardian notification notes..."
                />
              </div>
            </div>

            <Button
              onClick={handleReportOutcome}
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 gap-2 rounded-xl shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>COMMITTING TO CRYPTOGRAPHIC AUDIT LEDGER...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Subject Safely Recovered & Close Alert</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* Tab 2: Area Swept - Not Located Form */}
        {activeTab === "not_found" && (
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-4">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Negative Contact Log & Search Perimeter Expansion</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Sweeping Unit Call sign</label>
                <select
                  value={unitCallsign}
                  onChange={(e) => setUnitCallsign(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="PCR-04">PCR-04 (Sector Beat Mobile Patrol)</option>
                  <option value="RPF-02">RPF-02 (Transit & Railway Police)</option>
                  <option value="HWP-09">HWP-09 (Highway Corridor Checkpoint)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Reporting Officer</label>
                <Input
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="bg-white border-slate-200 text-xs h-9"
                  placeholder="Officer name..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Area / Perimeter Swept</label>
                <Input
                  value={sweptArea}
                  onChange={(e) => setSweptArea(e.target.value)}
                  className="bg-white border-slate-200 text-xs h-9"
                  placeholder="Area bounds swept..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Field Sweep Intelligence & Directional Clues</label>
                <textarea
                  value={notFoundNotes}
                  onChange={(e) => setNotFoundNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                  placeholder="Observations, CCTV review, witness interviews..."
                />
              </div>
            </div>

            <Button
              onClick={handleReportOutcome}
              disabled={submitting}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-10 gap-2 rounded-xl shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>LOGGING TO AUDIT TRAIL...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Log Negative Sweep & Expand Search Perimeter</span>
                </>
              )}
            </Button>
          </div>
        )}

      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 relative">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                TACTICAL INCIDENT DISPATCH & RESOLUTION
              </span>
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                Ground Intercept Comms & Outcome Uplink
              </h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {content}
    </div>
  );
}
