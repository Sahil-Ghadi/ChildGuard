"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { uploadOrEncodePhoto } from "@/lib/image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch, type CaseData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import MapWrapper from "@/components/MapWrapper";
import {
  Camera, 
  MapPin, 
  Clock, 
  User, 
  Users, 
  Car, 
  HelpCircle,
  Send, 
  Shield, 
  Lock, 
  Phone, 
  Locate, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2,
  Upload,
  Eye,
  ShieldCheck,
  Check,
  Crosshair
} from "lucide-react";
import Link from "next/link";

function ReportSightingContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [cases, setCases] = useState<CaseData[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(caseId || "");
  const [activeCase, setActiveCase] = useState<CaseData | null>(null);
  const [caseLoading, setCaseLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ id: string } | null>(null);

  const [formData, setFormData] = useState({
    location_address: "",
    timestamp: "",
    accompanied_status: "Unsure",
    description: "",
    phone_callback: "",
    confidential: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number }>({
    lat: 15.4909,
    lng: 73.8278,
  });
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    apiFetch(`/api/cases?status=open`)
      .then((casesData: CaseData[]) => {
        setCases(casesData);
        if (casesData.length > 0) {
          const matched = caseId ? casesData.find(c => c.caseId === caseId) : null;
          const chosen = matched || casesData[0];
          setSelectedCaseId(chosen.caseId);
          setActiveCase(chosen);
          setLocationCoords({
            lat: chosen.lastSeenLocation.lat,
            lng: chosen.lastSeenLocation.lng,
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load active cases:", err);
      })
      .finally(() => setCaseLoading(false));
  }, [caseId]);

  const handleCaseSelect = (newCaseId: string) => {
    setSelectedCaseId(newCaseId);
    const chosen = cases.find(c => c.caseId === newCaseId);
    if (chosen) {
      setActiveCase(chosen);
      setLocationCoords({
        lat: chosen.lastSeenLocation.lat,
        lng: chosen.lastSeenLocation.lng,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAddressForCoords = async (lat: number, lng: number) => {
    setResolvingAddress(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        const address = data.address;
        let formatted = "";
        if (address) {
          const parts = [
            data.name || address.amenity || address.shop || address.building || address.tourism || address.road,
            address.suburb || address.neighbourhood || address.residential || address.subdistrict,
            address.city || address.town || address.village || address.county,
            address.state
          ].filter(Boolean);
          formatted = Array.from(new Set(parts)).join(", ");
        }
        if (!formatted && data.display_name) {
          formatted = data.display_name.split(",").slice(0, 4).join(", ").trim();
        }
        if (formatted) {
          setFormData((prev) => ({ ...prev, location_address: formatted }));
          return;
        }
      }
      setFormData((prev) => ({ ...prev, location_address: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}` }));
    } catch {
      setFormData((prev) => ({ ...prev, location_address: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}` }));
    } finally {
      setResolvingAddress(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    const fixedLat = Number(lat.toFixed(6));
    const fixedLng = Number(lng.toFixed(6));
    setLocationCoords({ lat: fixedLat, lng: fixedLng });
    fetchAddressForCoords(fixedLat, fixedLng);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleMapClick(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setError("Unable to retrieve device GPS. Please click on the map to drop the sighting pin.");
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!caseId && !activeCase) {
      setError("Please specify which active case this sighting pertains to.");
      return;
    }

    setLoading(true);
    try {
      let photoUrl = "";
      if (file) {
        photoUrl = await uploadOrEncodePhoto(file, `sightings/${Date.now()}_${file.name}`);
      }

      const targetCaseId = selectedCaseId || caseId || activeCase?.caseId;
      if (!targetCaseId) {
        setError("Please select which missing child this sighting relates to.");
        setLoading(false);
        return;
      }
      const result = await apiFetch(`/api/cases/${targetCaseId}/sightings`, {
        method: "POST",
        body: JSON.stringify({
          location: {
            lat: locationCoords.lat,
            lng: locationCoords.lng,
            address: formData.location_address || `Coordinates: ${locationCoords.lat.toFixed(5)}, ${locationCoords.lng.toFixed(5)}`,
          },
          timestamp: formData.timestamp || new Date().toISOString(),
          photoUrl: photoUrl,
          reporterUid: user?.uid || `anon_${Math.random().toString(36).substring(2, 9)}`,
          reporterTrustScore: user ? 0.85 : 0.5,
        }),
      });

      setSuccess({ id: result.sightingId });
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting the sighting.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || caseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs font-mono text-slate-500">PREPARING REPORTING CONSOLE...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto my-16 px-4">
        <Card className="border-slate-200 shadow-xl overflow-hidden bg-white">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sighting Tip Transmitted
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Your report has been forwarded to field patrol units and the station verification desk. Optical verification is processing in real time.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
              Reference: <strong className="text-slate-900">{success.id}</strong>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/public-alert" className="flex-1">
                <Button variant="outline" className="w-full h-12 rounded-xl border-slate-300 font-semibold text-xs">
                  View Active Alerts
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Public Sighting Gateway • Anonymous & Encrypted
          </span>
          {activeCase && (
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Case #{activeCase.caseId}
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Report a Sighting
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          If you have seen a child matching an active alert, submit the location and photo below. Transmitted immediately to duty officers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form id="sighting-form" onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 0: Select Missing Child Dossier */}
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                    00
                  </div>
                  <div>
                    <CardTitle className="font-display text-base font-bold text-slate-900">
                      Target Missing Child Dossier
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                      Select which active missing child alert this sighting report relates to.
                    </p>
                  </div>
                </div>
                {activeCase && (
                  <Badge variant="destructive" className="text-[10px] font-bold uppercase">
                    {activeCase.riskScore} PRIORITY
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-4">
                {cases.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <p className="text-xs text-slate-500">No active missing child alerts found in the database.</p>
                    <Link href="/register-case">
                      <Button size="sm" variant="outline" className="text-xs font-semibold">
                        Register a Case First
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold">Active Missing Children in Network ({cases.length})</span>
                      <span className="text-[11px] font-mono text-slate-400">Click a card to select target child</span>
                    </div>

                    {/* Quick Card Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {cases.map((c) => {
                        const isSelected = selectedCaseId === c.caseId;
                        return (
                          <div
                            key={c.caseId}
                            onClick={() => handleCaseSelect(c.caseId)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 relative ${
                              isSelected
                                ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/30 shadow-xs"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white"
                            }`}
                          >
                            <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                              {c.photoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={c.photoUrl} alt={c.childName} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-6 h-6 text-slate-400" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-bold text-xs text-slate-900 truncate">
                                  {c.childName}
                                </h4>
                                {isSelected && (
                                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5" />
                                  </div>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 truncate">
                                Age {c.age} &bull; {c.lastSeenLocation.address}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400 block">
                                {c.caseId}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 1: Visual Photo */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                    01
                  </div>
                  <div>
                    <CardTitle className="font-display text-base font-bold text-slate-900">
                      Photo Verification
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                      Snap or upload a photo if safe to do so. Our biometric engine verifies match against reference dossier.
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/70 hover:bg-blue-50/20 transition-all cursor-pointer relative overflow-hidden">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Preview" className="w-36 h-36 object-cover rounded-xl shadow-md border-2 border-white" />
                      <span className="text-xs font-bold text-blue-700 mt-1">{file?.name}</span>
                      <span className="text-[11px] text-slate-400">Click or drag another image to replace</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">Snap Photo with Camera or Drop File</span>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Even partial or angled photos help our facial vector algorithms determine match probability.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Location & Timing */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                    02
                  </div>
                  <div>
                    <CardTitle className="font-display text-base font-bold text-slate-900">
                      Sighting Location & Timing
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                      Click directly on the map to pinpoint where you observed the subject.
                    </p>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="h-8 text-xs font-semibold gap-1.5 border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  <Locate className={`w-3.5 h-3.5 text-blue-600 ${locating ? "animate-spin" : ""}`} />
                  <span>{locating ? "Detecting..." : "Pin My GPS"}</span>
                </Button>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                
                {/* Interactive Sighting Map */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                      <span>Point / Click on Map to Drop Sighting Location</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      <span>LAT: <strong className="text-slate-800">{locationCoords.lat.toFixed(5)}</strong></span>
                      <span className="text-slate-300">|</span>
                      <span>LNG: <strong className="text-slate-800">{locationCoords.lng.toFixed(5)}</strong></span>
                    </div>
                  </div>

                  <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm relative z-0">
                    <MapWrapper
                      center={[locationCoords.lat, locationCoords.lng]}
                      zoom={14}
                      onMapClick={handleMapClick}
                      markers={[
                        {
                          id: "sighting-point",
                          position: [locationCoords.lat, locationCoords.lng],
                          popup: formData.location_address || `Sighting Point: ${locationCoords.lat.toFixed(4)}, ${locationCoords.lng.toFixed(4)}`,
                        },
                        ...(activeCase ? [{
                          id: "case-incident-point",
                          position: [activeCase.lastSeenLocation.lat, activeCase.lastSeenLocation.lng] as [number, number],
                          popup: `Original Incident Location: ${activeCase.childName}`,
                        }] : [])
                      ]}
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Click anywhere on the map to relocate the sighting pin. The address resolves automatically for tactical corroboration.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">Specific Location / Landmark</label>
                      {resolvingAddress && (
                        <span className="text-[11px] font-mono text-blue-600 flex items-center gap-1 animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin" /> Resolving...
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        required 
                        name="location_address" 
                        value={formData.location_address} 
                        onChange={handleInputChange} 
                        className="pl-9 h-11 text-sm bg-slate-50 border-slate-200 rounded-lg" 
                        placeholder="e.g. Near Panaji Bus Terminal, Platform 2" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Approximate Time Observed</label>
                    <Input 
                      type="datetime-local" 
                      name="timestamp" 
                      value={formData.timestamp} 
                      onChange={handleInputChange} 
                      required 
                      className="h-11 text-sm bg-slate-50 border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Step 3: Contextual Observations */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
                    03
                  </div>
                  <div>
                    <CardTitle className="font-display text-base font-bold text-slate-900">
                      Context & Companions
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                      Note if the child was accompanied or travelling in a vehicle.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Accompanied Status</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { icon: User, label: "Alone" },
                      { icon: Users, label: "1 Adult (M)" },
                      { icon: Users, label: "1 Adult (F)" },
                      { icon: Car, label: "In Vehicle" },
                      { icon: HelpCircle, label: "Unsure" },
                    ].map((opt) => {
                      const isSelected = formData.accompanied_status === opt.label;
                      const Icon = opt.icon;
                      return (
                        <Button
                          key={opt.label}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`flex flex-col h-auto py-3 gap-1 rounded-xl text-xs font-medium border ${
                            isSelected 
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                          onClick={() => setFormData(f => ({ ...f, accompanied_status: opt.label }))}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{opt.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Additional Observations</label>
                  <Textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Describe clothing colors, state of distress, direction of movement, bus route numbers, or license plate fragments..." 
                    rows={3} 
                    className="rounded-lg text-sm bg-slate-50 border-slate-200 resize-y"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Phone Callback (Optional)</label>
                    <Input 
                      name="phone_callback" 
                      value={formData.phone_callback} 
                      onChange={handleInputChange} 
                      placeholder="+91 98765 43210" 
                      className="w-full sm:w-60 h-10 text-xs bg-slate-50 border-slate-200 rounded-lg" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="confidential" 
                      checked={formData.confidential} 
                      onChange={(e) => setFormData(f => ({ ...f, confidential: e.target.checked }))} 
                      className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" 
                    />
                    <label htmlFor="confidential" className="text-xs font-medium text-slate-700">
                      Keep identity confidential
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              disabled={loading} 
              size="lg" 
              className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm gap-2 shadow-lg shadow-blue-500/25 lg:hidden"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Submit Verified Sighting</span>
            </Button>

          </form>
        </div>

        {/* Sidebar Dossier & Protocol (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 h-fit">
          
          {/* Reference Case Card */}
          {activeCase && (
            <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-blue-700 tracking-wider">
                  Target Case Dossier
                </span>
                <Badge variant="destructive" className="text-[10px] font-bold uppercase">
                  {activeCase.riskScore} PRIORITY
                </Badge>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {cases.length > 1 && (
                  <div className="space-y-1.5 pb-3 border-b border-slate-100">
                    <label className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                      Switch Target Missing Child
                    </label>
                    <select
                      value={selectedCaseId}
                      onChange={(e) => handleCaseSelect(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
                    >
                      {cases.map((c) => (
                        <option key={c.caseId} value={c.caseId}>
                          {c.childName} ({c.age}y) — {c.caseId}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3.5 items-center">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                    {activeCase.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={activeCase.photoUrl} alt="Child" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900">
                      {activeCase.childName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{activeCase.age} years old</p>
                    <span className="text-[11px] font-mono text-slate-400 block mt-1">
                      {activeCase.caseId}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Physical Description</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{activeCase.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Desktop Submit Button */}
          <Button 
            disabled={loading} 
            size="lg" 
            className="w-full h-13 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm gap-2 shadow-lg shadow-blue-500/25 hidden lg:flex"
            onClick={(e) => {
              e.preventDefault();
              const form = document.getElementById("sighting-form") as HTMLFormElement;
              if (form) form.requestSubmit();
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Transmit Sighting to Dispatch</span>
          </Button>

          {/* Emergency Helplines Callout */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                Emergency Hotlines
              </span>
              <span className="text-[10px] font-mono text-slate-400">24x7 TOLL FREE</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a 
                href="tel:112"
                className="p-2.5 rounded-xl bg-rose-600 text-white text-center text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                Dial 112 (Police)
              </a>
              <a 
                href="tel:1098"
                className="p-2.5 rounded-xl bg-slate-900 text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Dial 1098 (Childline)
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted telemetry under IPC regulations</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function ReportSighting() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    }>
      <ReportSightingContent />
    </Suspense>
  );
}
