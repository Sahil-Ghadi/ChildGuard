"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  FileCheck2
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

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
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-slate-100/50">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 bg-grid-slate opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md space-y-6">
        
        {/* Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold shadow-xs">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Authorized Personnel Gateway</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
            Officer Terminal Access
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            ChildGuard National Missing Child Alert Network & Tactical Dispatch Command
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-slate-200/80 bg-white/95 backdrop-blur-sm overflow-hidden">
          {/* Security stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
          
          <CardContent className="p-8 space-y-6">
            
            {/* Identity Emblem */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 shadow-sm">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Authentication Service</div>
                <div className="text-sm font-bold text-slate-900">National Police & Welfare SSO</div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="space-y-4 pt-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full relative h-13 text-slate-800 font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all border-slate-300 shadow-sm rounded-xl text-sm"
                onClick={async () => {
                  await signInWithGoogle();
                }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg width="22" height="22" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                </div>
                <span>Sign In with Government Identity</span>
              </Button>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  TLS 256-Bit Encrypted
                </span>
                <span>CCTNS Compliant</span>
              </div>
            </div>

            {/* Official Terms Notice */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 leading-relaxed text-center">
              Unauthorized access is strictly prohibited and monitored under the Information Technology Act 2000.
            </div>

          </CardContent>
        </Card>

        {/* Citizen Quick-Route Callout */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center space-y-3">
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
