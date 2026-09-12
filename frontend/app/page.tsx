"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  Camera, 
  Phone, 
  Radio, 
  CheckCircle2, 
  ChevronRight,
  AlertTriangle,
  FileSpreadsheet,
  MapPin,
  Brain,
  Clock,
  Compass,
  Lock,
  Zap,
  Users,
  Smartphone
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* ── Hero ── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate pointer-events-none opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-semibold text-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            National Missing Child Alert Network
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            When Minutes Matter,{" "}
            <span className="text-blue-600">AI-Powered Search Saves Lives.</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AI-powered alerts, facial recognition, and community tips — working together to bring missing children home faster.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {user ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-6 text-sm font-semibold gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md transition-all">
                  <Shield className="w-4 h-4" />
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-6 text-sm font-semibold gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md transition-all">
                  <Shield className="w-4 h-4" />
                  Officer Login
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}

            <Link href="/public-alert" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-6 text-sm font-semibold gap-2 rounded-xl border-slate-300">
                <Radio className="w-4 h-4 text-blue-600" />
                View Active Alerts
              </Button>
            </Link>

            <Link href="/report-a-sighting" className="w-full sm:w-auto">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto h-12 px-5 text-sm font-medium gap-2 text-slate-600 hover:text-slate-900">
                <Camera className="w-4 h-4" />
                Report a Sighting
              </Button>
            </Link>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Real-time Alerts
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              AI Face Matching
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              Community Powered
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">&lt; 3.5 Min</div>
              <p className="text-sm text-slate-500 mt-1">Alert Activation</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-blue-600">99.2%</div>
              <p className="text-sm text-slate-500 mt-1">Match Accuracy</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900">14,800+</div>
              <p className="text-sm text-slate-500 mt-1">Transit Nodes</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-600">Real-time</div>
              <p className="text-sm text-slate-500 mt-1">Multi-Agency Sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Three automated steps that activate within seconds of a missing child report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: FileSpreadsheet,
                color: "blue",
                title: "Report & Register",
                desc: "File a report with photo and details. AI instantly extracts facial features and distinctive markers for matching.",
                tag: "Facial Embedding Extraction"
              },
              {
                step: "02",
                icon: Compass,
                color: "indigo",
                title: "Alert & Search",
                desc: "Automatic geofenced alerts broadcast to nearby communities, transit hubs, and patrol units within the predicted travel radius.",
                tag: "Geofenced Push Alerts"
              },
              {
                step: "03",
                icon: ShieldCheck,
                color: "emerald",
                title: "Verify & Recover",
                desc: "Citizens submit sighting photos. AI scores each match. Officers verify high-confidence leads and dispatch patrol teams.",
                tag: "Human-in-the-Loop Verification"
              }
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-display font-black text-slate-100">{item.step}</span>
                  <div className={`w-10 h-10 rounded-lg bg-${item.color}-50 flex items-center justify-center text-${item.color}-600`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1.5">{item.desc}</p>
                </div>
                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  {item.tag} <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two Portals ── */}
      <section className="py-20 bg-slate-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Two Portals, One Mission
            </h2>
            <p className="text-base text-slate-600">
              Dedicated interfaces for citizens on the ground and officers in the command center.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Citizen */}
            <div className="rounded-xl p-6 sm:p-8 border border-slate-200 bg-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  Public Access — No Login Required
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Every Citizen is an Observer
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Spot a child matching an active alert? Submit a photo and location instantly. Your tip is analyzed by AI while your privacy is preserved.
                </p>
                <div className="space-y-2">
                  {["Browse active missing child alerts in your area", "Upload photos with GPS from your phone camera", "Share verified alert posters on social media"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-100">
                <Link href="/public-alert" className="flex-1">
                  <Button className="w-full h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm gap-2">
                    <MapPin className="w-4 h-4" /> Active Alerts
                  </Button>
                </Link>
                <Link href="/report-a-sighting" className="flex-1">
                  <Button variant="outline" className="w-full h-10 rounded-lg border-slate-200 text-sm gap-2">
                    <Camera className="w-4 h-4 text-blue-600" /> Report Sighting
                  </Button>
                </Link>
              </div>
            </div>

            {/* Officer */}
            <div className="rounded-xl p-6 sm:p-8 border border-blue-200 bg-gradient-to-b from-blue-50/30 to-white flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  Law Enforcement Only
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                  Command Dashboard
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Full control over case management, live map tracking, AI verification queue, and SMS/WhatsApp dispatch to patrol officers.
                </p>
                <div className="space-y-2">
                  {["Register and manage missing child cases", "Review AI-scored sighting matches", "Dispatch alerts to patrol teams via SMS/WhatsApp"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-4 border-t border-slate-100">
                <Link href={user ? "/dashboard" : "/login"} className="flex-1">
                  <Button className="w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm gap-2 shadow-sm">
                    <Shield className="w-4 h-4" /> {user ? "Open Dashboard" : "Sign In"}
                  </Button>
                </Link>
                <Link href="/register-case" className="flex-1">
                  <Button variant="outline" className="w-full h-10 rounded-lg border-slate-200 text-sm gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-slate-500" /> Register Case
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency Info ── */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                <AlertTriangle className="w-3 h-3" />
                Emergency Protocol
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Aligned with Supreme Court SOP & National Helplines
              </h3>
              <p className="text-sm text-slate-600">
                ChildGuard follows guidelines from Bachpan Bachao Andolan v. Union of India. For immediate emergency response, call:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a href="tel:112" className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors">
                <Phone className="w-4 h-4" /> 112 Emergency
              </a>
              <a href="tel:1098" className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center gap-2 transition-colors">
                <Phone className="w-4 h-4" /> 1098 Childline
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-sm text-slate-900">ChildGuard</span>
              <span className="text-xs text-slate-400">Missing Child Recovery Platform</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <Link href="/public-alert" className="hover:text-blue-600 transition-colors">Alerts</Link>
              <Link href="/report-a-sighting" className="hover:text-blue-600 transition-colors">Report</Link>
              <Link href="/register-case" className="hover:text-blue-600 transition-colors">Register</Link>
              <Link href="/login" className="hover:text-blue-600 transition-colors">Officer Portal</Link>
              <a href="tel:112" className="text-rose-600 hover:text-rose-700">Dial 112</a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
            ChildGuard is an AI-powered search pipeline prototype for rapid child recovery. All data processed under privacy preservation standards.
          </div>
        </div>
      </footer>
    </div>
  );
}
