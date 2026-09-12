"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, type CaseData, type SightingData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MapWrapper from "@/components/MapWrapper";
import {
  Search, 
  MapPin, 
  Clock, 
  Eye, 
  CheckCircle, 
  Radio,
  AlertTriangle, 
  Send, 
  Users, 
  Timer, 
  Shield,
  Loader2, 
  RefreshCw,
  FileSpreadsheet,
  Activity,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Compass,
  FileText,
  User,
  PhoneCall,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import FieldInterceptConsole from "@/components/FieldInterceptConsole";

function riskBadgeVariant(score: string) {
  switch (score) {
    case "CRITICAL": return "critical" as const;
    case "HIGH": return "destructive" as const;
    case "MEDIUM": return "warning" as const;
    case "LOW": return "secondary" as const;
    default: return "secondary" as const;
  }
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [sightings, setSightings] = useState<SightingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"open" | "found" | "closed">("open");
  const [showCommsModal, setShowCommsModal] = useState(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/cases?status=${filter}`);
      setCases(data);
      if (data.length > 0) {
        setActiveCase((prev) => {
          if (!prev) return data[0];
          const exists = data.find((c: CaseData) => c.caseId === prev.caseId);
          return exists || data[0];
        });
      } else {
        setActiveCase(null);
      }
    } catch (err) {
      console.error("Failed to load cases:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchSightings = useCallback(async (caseId: string) => {
    try {
      const data = await apiFetch(`/api/cases/${caseId}/sightings`);
      setSightings(data);
    } catch (err) {
      console.error("Failed to load sightings:", err);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    if (activeCase) {
      fetchSightings(activeCase.caseId);
    } else {
      setSightings([]);
    }
  }, [activeCase, fetchSightings]);

  const filteredCases = cases.filter(
    (c) =>
      c.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifiedSightings = sightings.filter((s) => s.confidenceLabel === "HIGH");
  const mapMarkers = activeCase
    ? [
        {
          id: "last-seen",
          position: [activeCase.lastSeenLocation.lat, activeCase.lastSeenLocation.lng] as [number, number],
          popup: `Incident Pin: ${activeCase.childName} (${activeCase.lastSeenLocation.address})`,
        },
        ...sightings.map((s) => ({
          id: s.sightingId,
          position: [s.location.lat, s.location.lng] as [number, number],
          popup: `Sighting: ${s.location.address} (${s.credibilityScore}% Match)`,
        })),
      ]
    : [];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs font-mono text-slate-500">SYNCING TACTICAL DISPATCH FEED...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Sleek Top Console Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tactical Dispatch Console
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time geospatial tracking, autonomous AI transit corridor prediction, and community corroboration.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {activeCase && (
            <>
              <Link href={`/report-a-sighting?caseId=${activeCase.caseId}`}>
                <Button size="sm" variant="outline" className="h-9 text-xs font-semibold gap-1.5 border-slate-300 rounded-lg hover:bg-slate-50">
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Log Sighting</span>
                </Button>
              </Link>
              <Link href="/public-alert">
                <Button size="sm" variant="outline" className="h-9 text-xs font-semibold gap-1.5 border-slate-300 rounded-lg hover:bg-slate-50">
                  <Radio className="w-3.5 h-3.5 text-rose-600" />
                  <span>Public Broadcast</span>
                </Button>
              </Link>
            </>
          )}

          <Link href="/register-case">
            <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5 rounded-lg shadow-sm">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Register New Case</span>
            </Button>
          </Link>

          <Button variant="ghost" size="sm" onClick={fetchCases} className="h-9 text-xs gap-1.5 rounded-lg text-slate-600 hover:text-slate-900">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>
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
            <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 text-xs px-3 py-1 font-mono">
              ALL SEARCH GEOFENCES DEACTIVATED
            </Badge>
          </div>
        </div>
      )}

      {/* Active Incident Summary Bar */}
      {activeCase && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:px-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Subject Summary */}
            <div className="flex items-center gap-4 min-w-0">
              {activeCase.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={activeCase.photoUrl} 
                  alt={activeCase.childName} 
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-200 shrink-0 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                  <User className="w-6 h-6" />
                </div>
              )}

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-display text-xl font-extrabold text-slate-900 tracking-tight truncate">
                    {activeCase.childName}
                  </h2>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {activeCase.age} Years Old
                  </span>
                  <Badge variant={riskBadgeVariant(activeCase.riskScore)} className="text-[11px] font-bold uppercase gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {activeCase.riskScore} PRIORITY
                  </Badge>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {activeCase.caseId}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{activeCase.lastSeenLocation.address}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    GPS: {activeCase.lastSeenLocation.lat.toFixed(4)}, {activeCase.lastSeenLocation.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* High-Contrast KPIs */}
            <div className="flex items-center gap-3 sm:gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block">Community Tips</span>
                <span className="font-display text-lg font-bold text-slate-900">{sightings.length} Logged</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-mono font-medium text-emerald-600 uppercase tracking-wider block">Biometric Match</span>
                <span className="font-display text-lg font-bold text-emerald-700">{verifiedSightings.length} Confirmed</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-mono font-medium text-blue-600 uppercase tracking-wider block">Geofence</span>
                <span className="font-display text-lg font-bold text-blue-700">{activeCase.alertDistributed ? "Active 15km" : "Standby"}</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-left sm:text-right">
                <span className="text-[11px] font-mono font-medium text-rose-600 uppercase tracking-wider block">Time Elapsed</span>
                <span className="font-display text-lg font-bold text-rose-700">{timeAgo(activeCase.createdAt)}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tactical Field Intercept & Communications Action Bar */}
      {activeCase && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:px-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  RADIO 462.575 MHz ACTIVE
                </span>
                <span className="text-[11px] font-mono text-slate-500">Patrol Units: PCR-04, RPF-02, HWP-09</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Field Intercept Comms & Twilio Cellular Gateway
              </h3>
              <p className="text-xs text-slate-500">
                Outbound voice & live SMS dispatch to patrol units. Auto-resolves case upon officer reply.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setShowCommsModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-9 gap-1.5 rounded-lg shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Ground Intercept Console</span>
            </Button>
            <Link href="/verification-desk">
              <Button
                variant="outline"
                className="text-slate-700 hover:text-slate-900 border-slate-200 text-xs h-9 gap-1.5 rounded-lg"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Verification Desk</span>
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main 2-Column Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Case Dossier Brief & Registry (4 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          {/* Active Case Details Card */}
          {activeCase && (
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/60">
                <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dossier Intelligence</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 block mb-0.5">Physical Description</span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">
                    {activeCase.description || "No specific distinctive clothing description noted."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-mono">Authority</span>
                    <span className="font-semibold text-slate-800 capitalize">{activeCase.reporterRelationship}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-mono">Status</span>
                    <span className={`font-semibold uppercase ${activeCase.status === "found" ? "text-emerald-700" : "text-blue-700"}`}>{activeCase.status}</span>
                  </div>
                </div>

                {activeCase.status === "found" && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                    <div className="flex items-center gap-1 font-bold font-mono text-[10px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SAFELY RECOVERED & SECURED</span>
                    </div>
                    {activeCase.recoveryOfficer && (
                      <p className="text-[11px] text-slate-700">
                        Officer: <strong>{activeCase.recoveryOfficer}</strong>
                      </p>
                    )}
                    {activeCase.recoveryLocation && (
                      <p className="text-[11px] text-slate-700">
                        Location: <strong>{activeCase.recoveryLocation}</strong>
                      </p>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">Registered:</span>
                  <span className="font-medium text-slate-700">{new Date(activeCase.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Case Registry Card */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-4 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Case Registry</span>
                </CardTitle>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {cases.length}
                </span>
              </div>

              {/* Status Filter */}
              <div className="flex gap-1 mt-3 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setFilter("open")}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${filter === "open" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Active ({filter === "open" ? cases.length : ""})
                </button>
                <button 
                  onClick={() => setFilter("found")}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${filter === "found" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Resolved
                </button>
              </div>

              {/* Search */}
              <div className="relative mt-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input 
                  className="pl-8 h-8 text-xs bg-slate-50 border-slate-200 rounded-lg" 
                  placeholder="Search name or ID..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
            </CardHeader>

            <CardContent className="p-3">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              ) : filteredCases.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No dossiers match current filter.
                </div>
              ) : (
                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {filteredCases.map((c) => {
                    const isSelected = activeCase?.caseId === c.caseId;
                    return (
                      <div
                        key={c.caseId}
                        onClick={() => setActiveCase(c)}
                        className={`rounded-xl p-3 cursor-pointer transition-all border ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {c.childName}
                          </span>
                          <Badge variant={riskBadgeVariant(c.riskScore)} className="text-[9px] font-bold uppercase shrink-0">
                            {c.riskScore}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {c.lastSeenLocation.address}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1.5 mt-1.5 border-t border-slate-100">
                          <span>{c.caseId}</span>
                          <span>{timeAgo(c.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Right Console: Map & Intelligence Feeds (8 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* Map Console Card */}
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <CardHeader className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Geospatial Intercept Perimeter & Telemetry</span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeCase ? `Incident coordinates & reported sighting vectors for ${activeCase.childName}` : "Select a case from the registry"}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Incident Pin
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Sightings
                </span>
              </div>
            </CardHeader>

            {/* Map Canvas with Floating Prediction HUD */}
            <div className="relative w-full h-[480px] xl:h-[520px] bg-slate-100">
              <MapWrapper
                center={
                  activeCase
                    ? [activeCase.lastSeenLocation.lat, activeCase.lastSeenLocation.lng]
                    : [15.4909, 73.8278]
                }
                zoom={13}
                markers={mapMarkers}
              />

              {/* Floating Escape Corridor HUD */}
              {activeCase?.patternPredictions && (
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xl z-[400] pointer-events-auto">
                  <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3.5 shadow-lg flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                          Predicted Escape Corridor
                        </span>
                        <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {Math.round(activeCase.patternPredictions.probability * 100)}% Confidence
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 leading-snug">
                        {activeCase.patternPredictions.predictedRoute}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                        <span>{activeCase.patternPredictions.similarCasesCount} Regional Transit Precedents</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Intelligence Deck: Sightings & Audit Trail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Community Sightings Feed */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>Citizen Sighting Submissions</span>
                </CardTitle>
                <Badge variant="secondary" className="font-mono text-xs">
                  {sightings.length}
                </Badge>
              </CardHeader>
              
              <CardContent className="p-4 space-y-3">
                {sightings.length === 0 ? (
                  <div className="text-center py-10 space-y-1.5">
                    <p className="text-xs font-semibold text-slate-600">No community sightings logged yet</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Citizen alerts are broadcasting across regional transit hubs and community channels.
                    </p>
                  </div>
                ) : (
                  sightings.map((s) => (
                    <div key={s.sightingId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={s.confidenceLabel === "HIGH" ? "success" : s.confidenceLabel === "MEDIUM" ? "warning" : "secondary"} 
                          className="text-[10px] gap-1 font-bold"
                        >
                          <CheckCircle className="w-2.5 h-2.5" />
                          {s.credibilityScore}% Match • {s.confidenceLabel}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-400">{timeAgo(s.timestamp)}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">{s.location.address}</p>
                      {s.reasoning && (
                        <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                          {s.reasoning}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Autonomous Multi-Agent Audit Trail */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span>Autonomous Agent Audit Trail</span>
                </CardTitle>
                <Badge variant="secondary" className="font-mono text-xs">
                  {activeCase?.auditLog?.length || 0} Events
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {!activeCase?.auditLog || activeCase.auditLog.length === 0 ? (
                  <div className="text-center py-10 space-y-1.5">
                    <p className="text-xs font-semibold text-slate-600">Awaiting multi-agent pipeline events</p>
                    <p className="text-[11px] text-slate-400">All intake and predictive steps are cryptographically audited.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {activeCase.auditLog.map((entry, i) => (
                      <div key={i} className="flex gap-3 items-start text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold shrink-0 border border-blue-200/60 mt-0.5">
                          {entry.agentName.split(" ")[0]}
                        </span>
                        <div className="min-w-0 space-y-0.5">
                          <p className="font-bold text-slate-900 leading-tight">{entry.action}</p>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{entry.reasoning}</p>
                          <span className="text-[10px] font-mono text-slate-400 block pt-0.5">
                            {new Date(entry.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

        </div>

      </div>

      {/* Field Intercept Comms & Outcome Modal */}
      {showCommsModal && activeCase && (
        <FieldInterceptConsole
          caseData={activeCase}
          targetLocation={sightings[0]?.location?.address || activeCase.lastSeenLocation.address}
          sightingId={sightings[0]?.sightingId}
          isModal={true}
          onClose={() => setShowCommsModal(false)}
          onResolved={() => {
            fetchCases();
          }}
        />
      )}

    </div>
  );
}
