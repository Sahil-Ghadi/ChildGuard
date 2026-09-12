"use client";

import { useState, useEffect } from "react";
import { uploadOrEncodePhoto } from "@/lib/image-upload";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Upload, 
  UserPlus, 
  AlertTriangle, 
  LogIn, 
  Shield, 
  Loader2,
  FileSpreadsheet,
  Camera,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  Locate,
  Crosshair
} from "lucide-react";
import Link from "next/link";
import MapWrapper from "@/components/MapWrapper";

export default function RegisterCase() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    child_name: "",
    age: "",
    last_seen_location: "",
    last_seen_timestamp: "",
    description: "",
    reporter_relationship: "parent",
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 15.4909,
    lng: 73.8278, // Default to Goa (Panaji)
  });
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [locating, setLocating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [success, setSuccess] = useState<{ id: string; riskScore?: string } | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAddressForCoords = async (lat: number, lng: number) => {
    setResolvingAddress(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
          "Accept": "application/json",
        }
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
          const uniqueParts = Array.from(new Set(parts));
          formatted = uniqueParts.join(", ");
        }
        if (!formatted && data.display_name) {
          formatted = data.display_name.split(",").slice(0, 4).join(", ").trim();
        }

        if (formatted) {
          setFormData((prev) => ({
            ...prev,
            last_seen_location: formatted,
          }));
          return;
        }
      }
      setFormData((prev) => ({
        ...prev,
        last_seen_location: `Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
      }));
    } catch {
      setFormData((prev) => ({
        ...prev,
        last_seen_location: `Location (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
      }));
    } finally {
      setResolvingAddress(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    const fixedLat = Number(lat.toFixed(6));
    const fixedLng = Number(lng.toFixed(6));
    setCoords({ lat: fixedLat, lng: fixedLng });
    fetchAddressForCoords(fixedLat, fixedLng);
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleMapClick(latitude, longitude);
        setLocating(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Automatically populate landmark name for default coordinates on mount
    fetchAddressForCoords(coords.lat, coords.lng);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be signed in as authorized personnel to register a case.");
      return;
    }
    if (!file) {
      setError("Please upload a high-resolution reference photo of the child for facial embedding.");
      return;
    }
    if (!consent) {
      setError("You must confirm guardian consent or official police authorization to proceed.");
      return;
    }

    setLoading(true);
    try {
      const photoUrl = await uploadOrEncodePhoto(file, `missing-children-photos/${Date.now()}_${file.name}`);

      const result = await apiFetch("/api/cases", {
        method: "POST",
        body: JSON.stringify({
          childName: formData.child_name,
          age: parseInt(formData.age),
          lastSeenLocation: {
            lat: coords.lat,
            lng: coords.lng,
            address: formData.last_seen_location || `Coordinates: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
            timestamp: formData.last_seen_timestamp,
          },
          description: formData.description,
          photoUrl,
          reporterUid: user.uid,
          reporterRelationship: formData.reporter_relationship,
          consentFlag: consent,
        }),
      });

      setSuccess({ id: result.caseId, riskScore: result.riskScore });
      setFormData({ child_name: "", age: "", last_seen_location: "", last_seen_timestamp: "", description: "", reporter_relationship: "parent" });
      setFile(null);
      setPreviewUrl(null);
      setConsent(false);
    } catch (err: any) {
      setError(err.message || "An error occurred while registering the case.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs font-mono text-slate-500">VERIFYING OFFICER CREDENTIALS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
          <Shield className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            Officer Authentication Required
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Incident case dossiers must be authenticated by law enforcement or designated child welfare officers.
          </p>
        </div>
        <Button onClick={signInWithGoogle} size="lg" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white gap-2 rounded-xl">
          <LogIn className="w-4 h-4" />
          <span>Sign In to Continue</span>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4">
        <Card className="border-slate-200 shadow-xl overflow-hidden bg-white">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <CardContent className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Case Successfully Registered
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                The incident has been ingested into the autonomous pipeline. Biometric feature vectors have been extracted, and transit corridor geofences are initializing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[11px] font-mono uppercase text-slate-400">Assigned Case Identifier</span>
                <div className="font-mono text-base font-bold text-slate-900">{success.id}</div>
              </div>
              {success.riskScore && (
                <Badge variant={success.riskScore === "CRITICAL" ? "critical" : "destructive"} className="text-xs uppercase font-bold">
                  {success.riskScore} PRIORITY
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={() => setSuccess(null)} variant="outline" className="flex-1 h-12 rounded-xl border-slate-300 font-semibold text-xs">
                Register Another Incident
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5 shadow-md shadow-blue-500/20">
                  <Shield className="w-4 h-4" />
                  <span>Open Tactical Dashboard</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold">
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
          <span>Case Intake Protocol</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Register Missing Child Dossier
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Submitting this incident initiates automated transit route prediction, optical facial embedding generation, and rapid geofence broadcast.
        </p>
        <div className="text-xs text-slate-400 font-mono pt-1">
          Authenticated Officer: <strong className="text-slate-700">{user.displayName || user.email}</strong>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {error && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: Child Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>01. Subject Identity</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Child&apos;s Full Legal Name</label>
                  <Input 
                    required 
                    name="child_name" 
                    value={formData.child_name} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Priya Sharma" 
                    className="h-11 rounded-lg text-sm bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Age</label>
                  <Input 
                    required 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleInputChange} 
                    placeholder="e.g. 7" 
                    min="0" 
                    max="18" 
                    className="h-11 rounded-lg text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Last Seen Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>02. Incident Coordinates & Timing</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDetectGPS}
                  disabled={locating}
                  className="h-8 px-3 text-xs font-semibold text-blue-700 bg-blue-50/80 border-blue-200 hover:bg-blue-100 rounded-lg gap-1.5 transition-colors"
                >
                  <Locate className={`w-3.5 h-3.5 ${locating ? "animate-spin text-blue-600" : ""}`} />
                  <span>{locating ? "Pinning GPS..." : "Pin Current GPS"}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">Last Seen Specific Location / Landmark</label>
                    {resolvingAddress && (
                      <span className="text-[11px] font-mono text-blue-600 flex items-center gap-1 font-medium animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> Updating landmark...
                      </span>
                    )}
                  </div>
                  <Input 
                    required 
                    name="last_seen_location" 
                    value={formData.last_seen_location} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Kashmiri Gate Bus Terminal, Gate 2" 
                    className="h-11 rounded-lg text-sm bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Date & Approximate Time</label>
                  <Input 
                    required 
                    type="datetime-local" 
                    name="last_seen_timestamp" 
                    value={formData.last_seen_timestamp} 
                    onChange={handleInputChange} 
                    className="h-11 rounded-lg text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              {/* Interactive Map Section */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                    <span>Point / Click on Map to Set Incident Location</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    <span>LAT: <strong className="text-slate-900">{coords.lat.toFixed(5)}</strong></span>
                    <span className="text-slate-300">|</span>
                    <span>LNG: <strong className="text-slate-900">{coords.lng.toFixed(5)}</strong></span>
                  </div>
                </div>

                <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm relative z-0">
                  <MapWrapper
                    center={[coords.lat, coords.lng]}
                    zoom={13}
                    onMapClick={handleMapClick}
                    markers={[
                      {
                        id: "pinned-incident",
                        position: [coords.lat, coords.lng],
                        popup: formData.last_seen_location || `Coordinates: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                      }
                    ]}
                    className="w-full h-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-medium text-slate-500">Manual Latitude</label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={coords.lat}
                      onChange={(e) => setCoords((prev) => ({ ...prev, lat: parseFloat(e.target.value) || 0 }))}
                      onBlur={() => fetchAddressForCoords(coords.lat, coords.lng)}
                      className="h-9 font-mono text-xs bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-medium text-slate-500">Manual Longitude</label>
                    <Input
                      type="number"
                      step="0.000001"
                      value={coords.lng}
                      onChange={(e) => setCoords((prev) => ({ ...prev, lng: parseFloat(e.target.value) || 0 }))}
                      onBlur={() => fetchAddressForCoords(coords.lat, coords.lng)}
                      className="h-9 font-mono text-xs bg-slate-50 border-slate-200"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Clicking anywhere on the map drops the pin and automatically resolves the approximate location for predictive transit route calculations and geofencing.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-800">Reporter Authority / Relationship</label>
                <select
                  name="reporter_relationship"
                  value={formData.reporter_relationship}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 font-medium"
                >
                  <option value="parent">Parent / Immediate Family</option>
                  <option value="guardian">Legal Guardian</option>
                  <option value="police">Station Police Officer / Investigating Officer</option>
                  <option value="teacher">School Authority / Teacher</option>
                  <option value="welfare">Child Welfare Committee (CWC)</option>
                  <option value="other">Other Official Agency</option>
                </select>
              </div>
            </div>

            {/* Section 3: Physical Description */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>03. Physical Description & Distinctive Identifiers</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">Clothing, Height & Visual Identifiers</label>
                <Textarea 
                  required 
                  rows={4} 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Detail attire color, school uniform, birthmarks, eyeglasses, footwear, and any notable mannerisms..." 
                  className="rounded-lg text-sm bg-slate-50 border-slate-200 resize-y"
                />
              </div>
            </div>

            {/* Section 4: Biometric Photo Reference */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>04. Reference Photo for Facial Biometrics</span>
              </div>

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
                    <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl shadow-md border-2 border-white" />
                    <span className="text-xs font-bold text-blue-700 mt-1">{file?.name}</span>
                    <span className="text-[11px] text-slate-400">Click or drag another image to replace</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Upload Clear Face Photograph</span>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Front-facing portrait preferred. Used by edge vision agents to verify community sighting submissions.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 5: Legal & Statutory Compliance */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <input 
                  type="checkbox" 
                  id="consent" 
                  checked={consent} 
                  onChange={(e) => setConsent(e.target.checked)} 
                  className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" 
                />
                <label htmlFor="consent" className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong>Official Authorization & Guardian Consent:</strong> I verify that I am an authorized law enforcement officer or legal guardian submitting this missing child report, and authorize the automated emergency broadcast across regional transit hubs.
                </label>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Notice: Filing fraudulent missing person reports is punishable under Section 182 of the Indian Penal Code.</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button 
                type="submit" 
                disabled={loading} 
                size="lg" 
                className="h-13 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm gap-2 shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Multi-Agent Pipeline...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Register Incident & Launch Search</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
