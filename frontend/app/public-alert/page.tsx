"use client";

import { useState, useEffect } from "react";
import { apiFetch, type CaseData, type SightingData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapWrapper from "@/components/MapWrapper";
import { 
  MapPin, 
  Share2, 
  Phone, 
  Clock, 
  Eye, 
  User, 
  CheckCircle, 
  Loader2, 
  AlertTriangle,
  Camera,
  Radio,
  ShieldAlert,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function PublicAlert() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [sightings, setSightings] = useState<SightingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch("/api/cases?status=open")
      .then((data) => {
        setCases(data);
        if (data.length > 0) {
          apiFetch(`/api/cases/${data[0].caseId}/sightings`)
            .then(setSightings)
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
          <p className="text-xs font-mono text-slate-500">LOADING ACTIVE CHILD ALERTS...</p>
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            No Active Emergency Bulletins
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            There are currently no active missing child broadcasts matching the regional geofence.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/">
            <Button variant="outline" className="border-slate-300">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeCase = cases[0];
  const mapMarkers = [
    {
      id: "last-seen",
      position: [activeCase.lastSeenLocation.lat, activeCase.lastSeenLocation.lng] as [number, number],
      popup: `Last seen: ${activeCase.lastSeenLocation.address}`,
    },
    ...sightings.map((s) => ({
      id: s.sightingId,
      position: [s.location.lat, s.location.lng] as [number, number],
      popup: `Sighting (${s.credibilityScore}%)`,
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Emergency Alert Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 text-white p-4 sm:p-5 shadow-lg shadow-rose-600/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-200">
                CRITICAL BROADCAST
              </span>
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-tight">
              Active Missing Child Alert • Public Mobilization Protocol
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs shadow-sm hover:bg-rose-50 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Dial 112</span>
          </a>
        </div>
      </div>

      {/* Featured Alert Dossier Card */}
      <Card className="border-slate-200 shadow-md overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Child Photo Section */}
            <div className="lg:col-span-5 relative bg-slate-100 min-h-[360px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
              {activeCase.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={activeCase.photoUrl} 
                  alt={activeCase.childName} 
                  className="w-full h-full object-cover min-h-[360px] max-h-[480px]" 
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <User className="w-20 h-20" />
                  <span className="text-xs font-mono">NO PHOTO ATTACHED</span>
                </div>
              )}

              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="destructive" className="gap-1.5 text-xs font-bold shadow-md bg-rose-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  PRIORITY 1
                </Badge>
              </div>

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Case Dossier</div>
                <div className="text-xs font-bold font-mono text-slate-900">{activeCase.caseId}</div>
              </div>
            </div>

            {/* Dossier Information */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
                    {activeCase.caseId}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Registered: {new Date(activeCase.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                      {activeCase.childName}
                    </h1>
                    <span className="text-base font-bold text-slate-600 bg-slate-100 px-3 py-0.5 rounded-md">
                      {activeCase.age} Years Old
                    </span>
                  </div>
                  <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                    {activeCase.description}
                  </p>
                </div>

                {/* Key Facts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-xs font-bold uppercase tracking-wider">Last Known Location</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{activeCase.lastSeenLocation.address}</p>
                    {activeCase.lastSeenLocation.timestamp && (
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {new Date(activeCase.lastSeenLocation.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-bold uppercase tracking-wider">Time Criticality</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">High Speed Corridor Alert</p>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Transit hubs & toll barriers notified
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <Link href={`/report-a-sighting?caseId=${activeCase.caseId}`} className="block">
                  <Button size="lg" className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base gap-2 shadow-md shadow-blue-500/20 transition-all">
                    <Camera className="w-5 h-5" />
                    I Have Seen This Child (Submit Photo Tip)
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Button 
                    variant="outline" 
                    onClick={handleShare}
                    className="flex-1 h-11 rounded-xl border-slate-300 font-semibold text-xs gap-2 text-slate-700 hover:bg-slate-50"
                  >
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>{copied ? "Link Copied to Clipboard!" : "Share Alert Bulletin"}</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    asChild
                    className="flex-1 h-11 rounded-xl border-slate-300 font-semibold text-xs gap-2 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                  >
                    <a href="tel:112">
                      <Phone className="w-4 h-4 text-rose-600" />
                      <span>Call Police Emergency (112)</span>
                    </a>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map & Community Sighting Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Map (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="p-4 sm:px-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display text-base font-bold text-slate-900">
                  Incident & Sighting Map
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sightings.length} community tip(s) geolocated
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Last Known
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Sighting
                </span>
              </div>
            </CardHeader>
            <div className="relative w-full h-[380px] bg-slate-100">
              <MapWrapper
                center={[activeCase.lastSeenLocation.lat, activeCase.lastSeenLocation.lng]}
                zoom={12}
                markers={mapMarkers}
              />
            </div>
          </Card>
        </div>

        {/* Community Reports (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <Card className="border-slate-200 shadow-sm h-full flex flex-col justify-between">
            <CardHeader className="p-4 sm:px-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="font-display text-base font-bold text-slate-900">
                Community Sighting Feed
              </CardTitle>
              <Badge variant="secondary" className="font-mono text-xs">
                {sightings.length} Logged
              </Badge>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-3 flex-grow overflow-y-auto max-h-[380px]">
              {sightings.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-800">No sightings submitted yet</p>
                    <p className="text-xs text-slate-500">If you are nearby, report any relevant observations.</p>
                  </div>
                  <Link href={`/report-a-sighting?caseId=${activeCase.caseId}`}>
                    <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold">
                      Submit First Tip
                    </Button>
                  </Link>
                </div>
              ) : (
                sightings.map((s) => (
                  <div key={s.sightingId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={s.confidenceLabel === "HIGH" ? "success" : s.confidenceLabel === "MEDIUM" ? "warning" : "secondary"}
                        className="text-[10px] gap-1 font-semibold"
                      >
                        <CheckCircle className="w-2.5 h-2.5" />
                        {s.credibilityScore}% Confidence
                      </Badge>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{s.status}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 leading-snug">{s.location.address}</p>
                    {s.reasoning && (
                      <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                        {s.reasoning}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
