"use client";

import { useState, useEffect, useCallback } from "react";
import { apiFetch, type CaseData, type SightingData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/MapWrapper";
import {
  FolderOpen, 
  Camera, 
  CheckCircle, 
  Lock, 
  User, 
  MapPin, 
  Brain, 
  Loader2, 
  XCircle,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  Radio,
  Send,
  Navigation,
  CheckCircle2,
  FileSpreadsheet,
  ChevronLeft,
  PhoneCall,
  Volume2
} from "lucide-react";
import Link from "next/link";
import FieldInterceptConsole from "@/components/FieldInterceptConsole";

export default function VerificationDesk() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [sightings, setSightings] = useState<SightingData[]>([]);
  const [activeSightingIndex, setActiveSightingIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCommsModal, setShowCommsModal] = useState(false);
  const [interceptSuccess, setInterceptSuccess] = useState<{
    sightingId: string;
    location: string;
    timestamp: string;
  } | null>(null);

  const activeCase = cases.find(c => c.caseId === selectedCaseId) || cases[0] || null;

  const fetchCasesAndSightings = useCallback(async (targetCaseId?: string) => {
    setLoading(true);
    try {
      const casesData: CaseData[] = await apiFetch("/api/cases?status=all");
      setCases(casesData);

      let caseToSelect = targetCaseId;
      if (!caseToSelect && casesData.length > 0) {
        // Prioritize case that has pending sightings
        for (const c of casesData) {
          const sList: SightingData[] = await apiFetch(`/api/cases/${c.caseId}/sightings`);
          const hasPending = sList.some(s => s.status === "pending" || s.status === "received");
          if (hasPending) {
            caseToSelect = c.caseId;
            setSightings(sList);
            break;
          }
        }
        if (!caseToSelect) {
          caseToSelect = casesData[0].caseId;
        }
      }

      if (caseToSelect) {
        setSelectedCaseId(caseToSelect);
        const sList: SightingData[] = await apiFetch(`/api/cases/${caseToSelect}/sightings`);
        setSightings(sList);
        setActiveSightingIndex(0);
      } else {
        setSightings([]);
      }
    } catch (err) {
      console.error("Error loading verification data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCasesAndSightings();
  }, [fetchCasesAndSightings]);

  const handleSelectCase = async (caseId: string) => {
    setSelectedCaseId(caseId);
    setLoading(true);
    setInterceptSuccess(null);
    try {
      const sList = await apiFetch(`/api/cases/${caseId}/sightings`);
      setSightings(sList);
      setActiveSightingIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeSighting = sightings[activeSightingIndex] || null;

  const handleVerifyAndIntercept = async (status: "dispatched" | "dismissed") => {
    if (!activeCase || !activeSighting) return;
    
    setActionLoading(true);
    try {
      const res = await apiFetch(`/api/cases/${activeCase.caseId}/sightings/${activeSighting.sightingId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: status,
          officerNotes: status === "dispatched" ? "Physical intercept authorized based on biometric match." : "Dismissed as false lead."
        })
      });

      if (status === "dispatched") {
        setInterceptSuccess({
          sightingId: activeSighting.sightingId,
          location: activeSighting.location.address,
          timestamp: new Date().toLocaleTimeString(),
        });
        setShowCommsModal(true);
      }

      // Update local state for immediate feedback
      setSightings(prev => prev.map(s => s.sightingId === activeSighting.sightingId ? { ...s, status } : s));

      if (status === "dismissed") {
        // Auto-advance after brief moment on dismiss
        setTimeout(() => {
          if (activeSightingIndex < sightings.length - 1) {
            setActiveSightingIndex(i => i + 1);
          }
        }, 1200);
      }

    } catch (err: any) {
      console.error("Failed to execute verification action:", err);
      alert(err.message || "Failed to update sighting status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && cases.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs font-mono text-slate-500">LOADING FORENSIC VERIFICATION QUEUE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Deck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>FORENSIC VERIFICATION DESK</span>
            <span>/</span>
            <span className="font-bold text-slate-800">{activeCase?.caseId || "NO ACTIVE DOSSIER"}</span>
            {activeSighting && (
              <>
                <span>/</span>
                <span className="text-blue-700 font-bold">LEAD #{activeSighting.sightingId.substring(0, 8)}</span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Biometric Sighting Verification & Intercept
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Human-in-the-loop forensic validation. Corroborate community imagery against reference embeddings before dispatching patrol intercept.
          </p>
        </div>

        {/* Case Switcher & Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {cases.length > 1 && (
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-mono text-slate-500 pl-2 font-semibold">Case:</span>
              <select
                value={selectedCaseId}
                onChange={(e) => handleSelectCase(e.target.value)}
                className="bg-white text-xs font-bold text-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-200 shadow-xs focus:outline-none"
              >
                {cases.map((c) => (
                  <option key={c.caseId} value={c.caseId}>
                    {c.childName} ({c.caseId})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchCasesAndSightings(selectedCaseId)} 
            className="h-9 text-xs gap-1.5 border-slate-300 rounded-lg text-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>

          <Link href="/dashboard">
            <Button size="sm" className="h-9 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs gap-1.5 rounded-lg">
              <span>Command Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Subject Safely Recovered Protocol Banner */}
      {activeCase?.status === "found" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  CASE RESOLVED • SUBJECT SAFELY RECOVERED
                </span>
                {activeCase.recoveredAt && (
                  <span className="text-[11px] font-mono text-emerald-700">
                    Recovered at {new Date(activeCase.recoveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                {activeCase.childName} has been safely located and secured
              </h2>
              <p className="text-xs text-slate-600">
                Lead Officer: <strong className="text-slate-800">{activeCase.recoveryOfficer || "Patrol Unit PCR-04"}</strong> | Location: <strong className="text-slate-800">{activeCase.recoveryLocation || activeCase.lastSeenLocation.address}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard">
              <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-9 gap-1.5 rounded-xl shadow-xs">
                <Navigation className="w-3.5 h-3.5" />
                <span>Command Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Success Intercept Modal / Toast Banner */}
      {interceptSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-800 tracking-wider">
                  Tactical Order Authorized
                </span>
                <span className="text-[11px] font-mono text-emerald-600">at {interceptSuccess.timestamp}</span>
              </div>
              <h3 className="font-display text-base font-extrabold text-slate-900">
                Physical Intercept Dispatched to: <span className="text-emerald-800">{interceptSuccess.location}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Patrol units and transit corridor intercept teams have been notified with the biometric evidence dossier.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button 
              size="sm" 
              onClick={() => setShowCommsModal(true)}
              className="text-xs h-8 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold gap-1.5 rounded-lg shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Ground Comms & Outcome</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setInterceptSuccess(null)} 
              className="text-xs h-8 border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 rounded-lg"
            >
              Dismiss
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold gap-1.5 rounded-lg shadow-xs">
                <Navigation className="w-3.5 h-3.5" />
                <span>Track on Map</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* When Queue is Empty */}
      {(!activeCase || sightings.length === 0) && (
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              Verification Queue Clear
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              No pending citizen sightings for {activeCase ? activeCase.childName : "this case"}. All community submissions have been evaluated.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            {activeCase && (
              <Link href={`/report-a-sighting?caseId=${activeCase.caseId}`}>
                <Button variant="outline" className="text-xs border-slate-300 font-semibold gap-1.5 rounded-xl">
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Submit Sighting for this Case</span>
                </Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl">
                Open Command Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Forensic Comparison Grid */}
      {activeCase && activeSighting && (
        <div className="space-y-6">
          
          {/* Sighting Queue Navigation Strip */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span className="text-xs font-mono font-bold text-slate-800">
                REVIEWING LEAD {activeSightingIndex + 1} OF {sightings.length}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">
                Current Status: <strong className="uppercase text-slate-800 font-mono">{activeSighting.status || "PENDING"}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                disabled={activeSightingIndex === 0}
                onClick={() => setActiveSightingIndex(i => i - 1)}
                className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Lead</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={activeSightingIndex >= sightings.length - 1}
                onClick={() => setActiveSightingIndex(i => i + 1)}
                className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 gap-1"
              >
                <span>Next Lead</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* 3-Column Forensic Comparator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: Official Reference Dossier (4 cols) */}
            <Card className="lg:col-span-4 border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Enrolled Reference Dossier
                  </CardTitle>
                </div>
                <Badge variant="success" className="text-[10px] font-bold gap-1">
                  <CheckCircle className="w-2.5 h-2.5" />
                  AUTHENTICATED
                </Badge>
              </CardHeader>

              <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="w-full aspect-square rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative shadow-inner">
                  {activeCase.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={activeCase.photoUrl} 
                      alt="Reference Photo" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-20 h-20 text-slate-400" />
                  )}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-800 font-bold border border-slate-200 shadow-xs">
                    OFFICIAL REFERENCE PHOTO
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-extrabold text-slate-900">
                      {activeCase.childName}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {activeCase.age}y
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">{activeCase.lastSeenLocation.address}</span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed line-clamp-3">
                    {activeCase.description || "No specific attire description recorded."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Center: AI Verification Engine & Intercept Dispatch (4 cols) */}
            <Card className="lg:col-span-4 border-slate-200 shadow-md bg-white overflow-hidden flex flex-col justify-between">
              <CardHeader className="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" />
                  <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Biometric Decision Engine
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono font-bold bg-white text-blue-700 border-blue-200">
                  gemini-3.6-flash
                </Badge>
              </CardHeader>

              <CardContent className="p-6 text-center space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Gauge Score */}
                <div className="space-y-3 py-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Facial Vector & Corroboration Match
                  </span>

                  <div className="py-6 px-4 bg-gradient-to-b from-blue-50/40 to-slate-50 rounded-2xl border border-blue-200/80 shadow-inner space-y-2">
                    <p className="font-display text-5xl font-black text-blue-600 tracking-tight">
                      {activeSighting.credibilityScore}%
                    </p>
                    <Badge 
                      variant={activeSighting.confidenceLabel === "HIGH" ? "success" : activeSighting.confidenceLabel === "MEDIUM" ? "warning" : "secondary"} 
                      className="text-xs uppercase font-extrabold px-3 py-1"
                    >
                      {activeSighting.confidenceLabel} MATCH PROBABILITY
                    </Badge>
                  </div>
                </div>

                {/* Multimodal Reasoning */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-left space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Forensic Reasoning</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {activeSighting.reasoning || "Multimodal vision model analyzed facial geometry vector against reference photograph."}
                  </p>
                </div>

                {/* Primary Intercept Actions */}
                <div className="pt-2">
                  {activeSighting.status === "dispatched" ? (
                    <div className="space-y-2.5">
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] text-blue-700">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          <span>INTERCEPT UNITS ACTIVE ON 462.575 MHz</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Command broadcast active. Units PCR-04, RPF-02, and HWP-09 dispatched.
                        </p>
                      </div>

                      <Button 
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2 rounded-xl shadow-xs"
                        onClick={() => setShowCommsModal(true)}
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Report Field Outcome (Found / Not Found)</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <Button 
                        disabled={actionLoading}
                        className="w-full h-13 font-extrabold text-xs gap-2 rounded-xl shadow-lg transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                        onClick={() => handleVerifyAndIntercept("dispatched")}
                      >
                        {actionLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Dispatching Highway Patrol Units...</span>
                          </>
                        ) : (
                          <>
                            <Radio className="w-4 h-4" />
                            <span>Authorize & Dispatch Physical Intercept</span>
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        disabled={actionLoading}
                        variant="outline" 
                        className="w-full h-10 text-slate-600 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200 font-bold text-xs gap-1.5 rounded-xl" 
                        onClick={() => handleVerifyAndIntercept("dismissed")}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Dismiss as False Lead</span>
                      </Button>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Right: Citizen Sighting Evidence (4 cols) */}
            <Card className="lg:col-span-4 border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Submitted Sighting Evidence
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono gap-1 text-slate-600 bg-white">
                  <Lock className="w-2.5 h-2.5" />
                  GPS AUTHENTICATED
                </Badge>
              </CardHeader>

              <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="w-full aspect-square rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative shadow-inner">
                  {activeSighting.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={activeSighting.photoUrl} 
                      alt="Sighting Evidence" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="w-20 h-20 text-slate-400" />
                  )}
                  
                  <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl flex items-center justify-between text-slate-900 text-xs border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate text-slate-800 font-semibold">{activeSighting.location.address}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                      {new Date(activeSighting.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Eyewitness Observation</span>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      {activeSighting.reasoning || "Eyewitness submitted photograph from regional location."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
                    <span>Reporter: {activeSighting.reporterUid.substring(0, 12)}...</span>
                    <span>Trust Score: {activeSighting.reporterTrustScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Ground Intercept Communications & Field Outcome Console */}
          {(activeSighting.status === "dispatched" || interceptSuccess?.sightingId === activeSighting.sightingId) && (
            <FieldInterceptConsole
              caseData={activeCase}
              targetLocation={activeSighting.location.address}
              sightingId={activeSighting.sightingId}
              onResolved={() => {
                fetchCasesAndSightings(selectedCaseId);
              }}
            />
          )}

          {/* Geospatial Correlation Map (Bottom) */}
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Geospatial Correlation (Last Known Incident Point vs Sighting Location)</span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual correlation between original disappearance coordinates and citizen sighting coordinates.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Original Incident Pin
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Eyewitness Sighting
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="relative h-80 w-full bg-slate-100">
                <MapWrapper
                  center={[activeSighting.location.lat, activeSighting.location.lng]}
                  zoom={13}
                  markers={[
                    { 
                      id: "sighting-pin", 
                      position: [activeSighting.location.lat, activeSighting.location.lng], 
                      popup: `Reported Sighting Location: ${activeSighting.location.address} (${activeSighting.credibilityScore}% Match)` 
                    },
                    { 
                      id: "lastseen-pin", 
                      position: [activeCase.lastSeenLocation.lat, activeCase.lastSeenLocation.lng], 
                      popup: `Last Known Location: ${activeCase.childName} (${activeCase.lastSeenLocation.address})` 
                    }
                  ]}
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* Ground Intercept Modal */}
      {showCommsModal && activeCase && (
        <FieldInterceptConsole
          caseData={activeCase}
          targetLocation={activeSighting?.location?.address || activeCase.lastSeenLocation.address}
          sightingId={activeSighting?.sightingId}
          isModal={true}
          onClose={() => setShowCommsModal(false)}
          onResolved={() => {
            fetchCasesAndSightings(selectedCaseId);
          }}
        />
      )}

    </div>
  );
}
