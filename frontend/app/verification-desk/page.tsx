"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch, type CaseData, type SightingData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/MapWrapper";
import {
  Camera,
  CheckCircle,
  User,
  MapPin,
  Brain,
  Loader2,
  XCircle,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Clock,
  Sparkles,
  Radio,
  Send,
  CheckCircle2,
  PhoneCall,
  Eye,
  Layers
} from "lucide-react";
import Link from "next/link";
import FieldInterceptConsole from "@/components/FieldInterceptConsole";

export default function VerificationDesk() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [sightings, setSightings] = useState<SightingData[]>([]);
  const [selectedSightingId, setSelectedSightingId] = useState<string>("");
  const [sightingFilter, setSightingFilter] = useState<"all" | "pending" | "dispatched" | "dismissed">("all");
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
            if (sList.length > 0) {
              setSelectedSightingId(sList[0].sightingId);
            }
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
        if (sList.length > 0) {
          setSelectedSightingId(prev => (sList.some(s => s.sightingId === prev) ? prev : sList[0].sightingId));
        } else {
          setSelectedSightingId("");
        }
      } else {
        setSightings([]);
        setSelectedSightingId("");
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
      if (sList.length > 0) {
        setSelectedSightingId(sList[0].sightingId);
      } else {
        setSelectedSightingId("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSightings = useMemo(() => {
    if (sightingFilter === "all") return sightings;
    if (sightingFilter === "pending") return sightings.filter(s => s.status === "pending" || s.status === "received");
    return sightings.filter(s => s.status === sightingFilter);
  }, [sightings, sightingFilter]);

  const activeSighting = useMemo(() => {
    return sightings.find(s => s.sightingId === selectedSightingId) || sightings[0] || null;
  }, [sightings, selectedSightingId]);

  const pendingCount = useMemo(() => sightings.filter(s => s.status === "pending" || s.status === "received").length, [sightings]);
  const dispatchedCount = useMemo(() => sightings.filter(s => s.status === "dispatched").length, [sightings]);

  const handleVerifyAndIntercept = async (status: "dispatched" | "dismissed") => {
    if (!activeCase || !activeSighting) return;
    
    setActionLoading(true);
    try {
      await apiFetch(`/api/cases/${activeCase.caseId}/sightings/${activeSighting.sightingId}`, {
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
          <p className="text-sm text-slate-500">Loading verification desk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Deck */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>VERIFICATION DESK</span>
            <span>/</span>
            <span className="font-bold text-slate-800">{activeCase?.childName || "NO ACTIVE CASE"}</span>
            {activeSighting && (
              <>
                <span>/</span>
                <span className="text-blue-600 font-bold">TIP #{activeSighting.sightingId.substring(0, 8)}</span>
              </>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verify Sightings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review community sightings against the reference photo and dispatch patrol intercept.
          </p>
        </div>

        {/* Case Switcher & Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {cases.length > 1 && (
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-xs font-medium text-slate-600 pl-2">Case:</span>
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
            className="h-9 text-xs gap-1.5 border-slate-300 rounded-xl text-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>

          <Link href="/dashboard">
            <Button size="sm" className="h-9 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs gap-1.5 rounded-xl">
              <span>Command Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Subject Safely Recovered Protocol Banner */}
      {activeCase?.status === "found" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-[10px] font-bold">
                  CASE RESOLVED • CHILD SAFELY RECOVERED
                </Badge>
                {activeCase.recoveredAt && (
                  <span className="text-xs text-emerald-700">
                    Recovered at {new Date(activeCase.recoveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
                {activeCase.childName} has been safely located and secured
              </h2>
              <p className="text-xs text-slate-600">
                Lead Officer: <strong className="text-slate-800">{activeCase.recoveryOfficer || "Patrol Unit PCR-04"}</strong> | Location: <strong className="text-slate-800">{activeCase.recoveryLocation || activeCase.lastSeenLocation.address}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Intercept Modal / Toast Banner */}
      {interceptSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800">
                  Patrol Intercept Dispatched
                </span>
                <span className="text-xs text-emerald-600">at {interceptSuccess.timestamp}</span>
              </div>
              <h3 className="font-display text-sm sm:text-base font-bold text-slate-900">
                Units En Route to: <span className="text-emerald-800">{interceptSuccess.location}</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Ground patrol units have received the alert dossier and photo tip.
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
              <span>Ground Comms</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setInterceptSuccess(null)} 
              className="text-xs h-8 border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 rounded-lg"
            >
              Dismiss
            </Button>
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

      {/* Main Multi-Entry Workspace */}
      {activeCase && sightings.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: All Sightings Queue + Reference Dossier (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sightings List Card */}
            <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Sightings Queue
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {sightings.length} Total
                  </Badge>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 pt-3 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setSightingFilter("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      sightingFilter === "all"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    All ({sightings.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSightingFilter("pending")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      sightingFilter === "pending"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    Pending ({pendingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSightingFilter("dispatched")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                      sightingFilter === "dispatched"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    Dispatched ({dispatchedCount})
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-3 space-y-2 max-h-[480px] overflow-y-auto">
                {filteredSightings.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No sightings match the selected filter.
                  </div>
                ) : (
                  filteredSightings.map((s, idx) => {
                    const isSelected = activeSighting?.sightingId === s.sightingId;
                    return (
                      <button
                        key={s.sightingId}
                        type="button"
                        onClick={() => setSelectedSightingId(s.sightingId)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 relative ${
                          isSelected
                            ? "bg-blue-50/60 border-blue-400 ring-1 ring-blue-400 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200/80"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative flex items-center justify-center">
                          {s.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={s.photoUrl} 
                              alt="Sighting thumbnail" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <User className="w-6 h-6 text-slate-400" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              Lead #{idx + 1}
                            </span>
                            <Badge
                              variant={s.confidenceLabel === "HIGH" ? "success" : s.confidenceLabel === "MEDIUM" ? "warning" : "secondary"}
                              className="text-[10px] font-bold px-1.5 py-0 shrink-0"
                            >
                              {s.credibilityScore}%
                            </Badge>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{s.location.address}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className={`uppercase font-bold ${
                              s.status === "dispatched" ? "text-blue-600" :
                              s.status === "dismissed" ? "text-slate-400" : "text-amber-600"
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute right-2 top-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 block" />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Official Reference Dossier Card */}
            <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Reference Photo & Case Info
                  </CardTitle>
                </div>
                <Badge variant="success" className="text-[10px] font-bold gap-1">
                  <CheckCircle className="w-2.5 h-2.5" />
                  AUTHENTICATED
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0 relative">
                    {activeCase.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={activeCase.photoUrl} 
                        alt="Reference Photo" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-base font-bold text-slate-900 truncate">
                        {activeCase.childName}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                        {activeCase.age}y
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{activeCase.lastSeenLocation.address}</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 pt-0.5">
                      {activeCase.description || "No specific attire description recorded."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN: Sighting Deep Dive & Actions (8 cols) */}
          {activeSighting && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Selected Sighting Comparison Card */}
              <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
                <CardHeader className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <CardTitle className="font-display text-sm font-bold text-slate-900">
                      Sighting Comparison & AI Score
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">ID: {activeSighting.sightingId.substring(0, 10)}</span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 font-sans font-medium">Trust Score: {activeSighting.reporterTrustScore}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-6">
                  
                  {/* AI Match Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center px-4 py-2 bg-white rounded-xl border border-blue-200 shadow-2xs">
                        <span className="font-display text-3xl sm:text-4xl font-black text-blue-600 tracking-tight block">
                          {activeSighting.credibilityScore}%
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Match Score
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={activeSighting.confidenceLabel === "HIGH" ? "success" : activeSighting.confidenceLabel === "MEDIUM" ? "warning" : "secondary"} 
                            className="text-xs uppercase font-extrabold px-2.5 py-0.5"
                          >
                            {activeSighting.confidenceLabel} MATCH
                          </Badge>
                          <Badge variant="outline" className="text-[10px] font-mono text-blue-700 bg-white border-blue-200">
                            Gemini 3.5 Flash
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                          {activeSighting.reasoning || "Vision model analyzed facial geometry vector against reference photograph."}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action Button in Score Banner */}
                    <div className="shrink-0 self-end sm:self-center">
                      {activeCase.status === "found" ? (
                        <Badge variant="success" className="px-3 py-1.5 text-xs font-bold">
                          Case Closed
                        </Badge>
                      ) : activeSighting.status === "dispatched" ? (
                        <Button 
                          size="sm"
                          onClick={() => setShowCommsModal(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5 rounded-xl shadow-xs"
                        >
                          <Radio className="w-3.5 h-3.5" />
                          <span>Ground Comms</span>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button 
                            disabled={actionLoading}
                            size="sm"
                            onClick={() => handleVerifyAndIntercept("dispatched")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 rounded-xl shadow-xs"
                          >
                            {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Radio className="w-3.5 h-3.5" />}
                            <span>Dispatch Intercept</span>
                          </Button>
                          <Button 
                            disabled={actionLoading}
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyAndIntercept("dismissed")}
                            className="border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 text-xs rounded-xl"
                          >
                            Dismiss
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Side-by-Side Photos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Left: Official Photo */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Official Reference Photo
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">ENROLLED</span>
                      </div>

                      <div className="w-full aspect-square rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative">
                        {activeCase.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={activeCase.photoUrl} 
                            alt="Official Reference" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <User className="w-16 h-16 text-slate-400" />
                        )}
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="font-semibold text-slate-900">{activeCase.childName}, {activeCase.age} years old</div>
                        <div className="flex items-center gap-1 text-slate-500 truncate">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{activeCase.lastSeenLocation.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Sighting Photo */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Reported Sighting Evidence
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">GPS TAGGED</span>
                      </div>

                      <div className="w-full aspect-square rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative">
                        {activeSighting.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={activeSighting.photoUrl} 
                            alt="Reported Sighting" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <Camera className="w-16 h-16 text-slate-400" />
                        )}
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 truncate">{activeSighting.location.address}</span>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                            {new Date(activeSighting.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic line-clamp-2">
                          &quot;{activeSighting.reasoning || "Eyewitness submitted tip."}&quot;
                        </p>
                      </div>
                    </div>

                  </div>

                </CardContent>
              </Card>

              {/* Geospatial Correlation Map */}
              <Card className="border-slate-200 shadow-xs overflow-hidden bg-white">
                <CardHeader className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Location & Travel Vector</span>
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Last known point vs sighting coordinates and probable travel perimeter.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Last Known
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Sighting
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-0.5 border-t-2 border-dashed border-blue-600" /> Travel Vector
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400/25 border border-blue-500" /> Probable Radius
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="relative h-80 sm:h-96 w-full bg-slate-100">
                    {(() => {
                      const startLat = activeCase.lastSeenLocation.lat;
                      const startLng = activeCase.lastSeenLocation.lng;
                      const endLat = activeSighting.location.lat;
                      const endLng = activeSighting.location.lng;

                      const R = 6371;
                      const dLat = (endLat - startLat) * (Math.PI / 180);
                      const dLon = (endLng - startLng) * (Math.PI / 180);
                      const a = 
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(startLat * (Math.PI / 180)) * Math.cos(endLat * (Math.PI / 180)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                      const distKm = Math.max(Math.round((R * c) * 10) / 10, 0.1);
                      const probableRadiusMeters = Math.max(Math.round(distKm * 1000 * 1.25), 1500);

                      return (
                        <MapWrapper
                          center={[(startLat + endLat) / 2, (startLng + endLng) / 2]}
                          zoom={13}
                          markers={[
                            { 
                              id: "sighting-pin", 
                              position: [endLat, endLng], 
                              popup: `Reported Sighting: ${activeSighting.location.address} (${activeSighting.credibilityScore}% Match, ~${distKm} km from origin)` 
                            },
                            { 
                              id: "lastseen-pin", 
                              position: [startLat, startLng], 
                              popup: `Original Incident Location: ${activeCase.childName} (${activeCase.lastSeenLocation.address})` 
                            }
                          ]}
                          paths={[
                            {
                              id: "trajectory-vector",
                              positions: [
                                [startLat, startLng],
                                [endLat, endLng]
                              ],
                              color: "#2563eb",
                              dashArray: "6, 8",
                              weight: 3.5,
                              opacity: 0.9
                            }
                          ]}
                          circles={[
                            {
                              id: "probable-covered-radius",
                              center: [startLat, startLng],
                              radius: probableRadiusMeters,
                              color: "#2563eb",
                              fillColor: "#3b82f6",
                              fillOpacity: 0.12,
                              weight: 1.5,
                              dashArray: "5, 5",
                              popup: `Probable Travel Radius: ~${(probableRadiusMeters / 1000).toFixed(1)} km estimated range from last seen origin`
                            }
                          ]}
                          className="w-full h-full"
                        />
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Ground Intercept Communications (when dispatched) */}
              {(activeSighting.status === "dispatched" || interceptSuccess?.sightingId === activeSighting.sightingId) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Officer Dispatch & Field Comms
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 truncate max-w-md">
                      Target: {activeSighting.location.address}
                    </span>
                  </div>
                  <FieldInterceptConsole
                    caseData={activeCase}
                    targetLocation={activeSighting.location.address}
                    sightingId={activeSighting.sightingId}
                    onResolved={() => {
                      fetchCasesAndSightings(selectedCaseId);
                    }}
                  />
                </div>
              )}

            </div>
          )}

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
