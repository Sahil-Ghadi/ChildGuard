"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Loader2, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  MapPin, 
  Camera, 
  KeyRound,
  Eye,
  EyeOff,
  BadgeCheck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithSecretCode } = useAuth();
  const router = useRouter();

  const [authMode, setAuthMode] = useState<"secret_code" | "google">("secret_code");
  const [secretCode, setSecretCode] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSecretCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!secretCode.trim()) {
      setErrorMsg("Please enter your official departmental secret code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signInWithSecretCode(
        secretCode, 
        officerName.trim() || "Duty Officer", 
        badgeNumber.trim() || ""
      );

      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMsg(res.message || "Invalid officer security code. Check authorization code and try again.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to authenticate session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[85vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs font-mono text-slate-500">AUTHENTICATING SECURE SESSION...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-10 overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-slate-100/50">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-grid-slate opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg space-y-6">
        
        {/* Portal Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Officer Sign In
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Access the ChildGuard command dashboard
          </p>
        </div>

        {/* Main Authentication Card */}
        <Card className="shadow-lg border-slate-200 bg-white overflow-hidden">
          <div className="h-1 w-full bg-blue-600" />
          
          <CardContent className="p-6 sm:p-8 space-y-5">

            {/* Auth Mode Toggle Switch */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setAuthMode("secret_code"); setErrorMsg(null); }}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === "secret_code"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Officer Secret Code</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode("google"); setErrorMsg(null); }}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === "google"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <BadgeCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Google SSO</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            {/* MODE 1: Officer Secret Code Authentication */}
            {authMode === "secret_code" && (
              <form onSubmit={handleSecretCodeSubmit} className="space-y-4">
                {/* Secret Code Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                      Departmental Secret Code <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Case-Insensitive</span>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      placeholder="Enter Departmental Security PIN"
                      className="pr-10 h-11 text-sm font-mono tracking-wider border-slate-300 focus:border-blue-500"
                      autoComplete="off"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Officer Name & Badge Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Officer Callsign / Name
                    </label>
                    <Input
                      type="text"
                      value={officerName}
                      onChange={(e) => setOfficerName(e.target.value)}
                      placeholder="e.g. Sub-Inspector R. Sawant"
                      className="h-10 text-xs border-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">
                      Badge Number
                    </label>
                    <Input
                      type="text"
                      value={badgeNumber}
                      onChange={(e) => setBadgeNumber(e.target.value)}
                      placeholder="e.g. IPS-4089"
                      className="h-10 text-xs font-mono border-slate-300"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-12 mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating Security Key...</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate & Enter Terminal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* MODE 2: Google SSO Authentication */}
            {authMode === "google" && (
              <div className="space-y-4 pt-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full relative h-12 text-slate-800 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all border-slate-300 shadow-sm rounded-xl text-sm"
                  onClick={async () => {
                    await signInWithGoogle();
                  }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg width="20" height="20" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                  </div>
                  <span>Sign In with Government Google ID</span>
                </Button>

                <p className="text-center text-xs text-slate-500">
                  Secured via Google Cloud Identity and federated IAM for state police departments.
                </p>
              </div>
            )}

            {/* Compliance Footer */}
            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-100">
              Encrypted & CCTNS Compliant
            </div>

          </CardContent>
        </Card>

        {/* Citizen Quick-Route Callout */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center space-y-2">
          <p className="text-xs text-slate-600 font-medium">
            Are you a citizen seeking active missing alerts or submitting a sighting?
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link href="/public-alert">
              <Button variant="ghost" size="sm" className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold gap-1">
                <MapPin className="w-3 h-3" />
                Active Alerts
              </Button>
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/report-a-sighting">
              <Button variant="ghost" size="sm" className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold gap-1">
                <Camera className="w-3 h-3" />
                Report Sighting
              </Button>
            </Link>
          </div>
        </div>

        {/* Emergency Assistance Direct Call */}
        <div className="text-center">
          <a 
            href="tel:112"
            className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Emergency Police Helpline: Dial 112 (Toll Free)</span>
          </a>
        </div>

      </div>
    </div>
  );
}
