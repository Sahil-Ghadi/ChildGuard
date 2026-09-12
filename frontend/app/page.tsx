"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  MapPin, 
  Brain, 
  BellRing, 
  ArrowRight, 
  Eye, 
  ShieldCheck, 
  Activity, 
  Camera, 
  Phone, 
  Search, 
  Radio, 
  Cpu, 
  Lock, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Compass,
  FileSpreadsheet
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"ingestion" | "geofence" | "vision">("geofence");

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50">
        {/* Background Accents */}
        <div className="absolute inset-0 bg-grid-slate pointer-events-none opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-blue-400/15 via-indigo-300/10 to-cyan-300/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Copy */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 shadow-xs backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
                Next-Gen Missing Child Recovery & Intercept Network
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              When Minutes Matter, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Intelligent Search Saves Lives.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              ChildGuard bridges the critical golden hour with autonomous multi-agent pipelines, predictive transit corridor containment, and real-time crowdsourced facial telemetry.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              {user ? (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-13 px-8 text-base font-semibold gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all">
                    <Shield className="w-5 h-5" />
                    Enter Police Dispatch
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-13 px-8 text-base font-semibold gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all">
                    <Shield className="w-5 h-5" />
                    Officer Secure Login
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}

              <Link href="/public-alert" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-13 px-7 text-base font-semibold gap-2 rounded-xl border-slate-300 hover:bg-slate-50 text-slate-800 shadow-xs">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  View Active Alerts
                </Button>
              </Link>

              <Link href="/report-a-sighting" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto h-13 px-6 text-base font-medium gap-2 text-slate-600 hover:text-slate-900">
                  <Camera className="w-4 h-4 text-slate-500" />
                  Report a Sighting
                </Button>
              </Link>
            </div>

            {/* Quick Advisory */}
            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Inter-state Transit Sync
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Biometric Edge Verification
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                Zero False-Positive Gate
              </span>
            </div>

          </div>

          {/* Interactive Tactical Command HUD (Light-Themed Tactical Architecture) */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl overflow-hidden">
              
              {/* Window Bar */}
              <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <span className="ml-3 text-xs font-mono font-semibold text-slate-500">
                    CHILDGUARD_TACTICAL_COMMAND :: SIMULATION_FEED
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    DISPATCH ENGINE LIVE
                  </span>
                </div>
              </div>

              {/* HUD Main Grid */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
                
                {/* Left Telemetry Panel (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">Active Dossier</span>
                      <h4 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>CASE #CG-2026-DEL-04</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold">PRIORITY 1</span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-slate-400 font-bold">Elapsed Time</span>
                      <div className="text-sm font-mono text-slate-900 font-bold">00:14:38</div>
                    </div>
                  </div>

                  {/* Visual Simulation Area */}
                  <div className="relative h-56 rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-between overflow-hidden shadow-xs">
                    <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
                    
                    {/* Concentric radar circles */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-blue-500/20 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-blue-500/30 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-blue-500/40 bg-blue-500/10 animate-pulse pointer-events-none" />

                    {/* Nodes overlay */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider font-bold">Target Geofence</span>
                        <div className="text-xs font-bold text-slate-900">12.5 KM Velocity Perimeter</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-mono text-slate-700 border border-slate-200 font-semibold">
                        GPS: 15.4909° N, 73.8278° E
                      </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-3 gap-2 text-center pt-8">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                        <div className="text-[10px] text-slate-500 font-mono font-medium">Transit Corridors</div>
                        <div className="text-xs font-bold text-amber-700 font-mono mt-0.5">3 Intercepts</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                        <div className="text-[10px] text-slate-500 font-mono font-medium">Camera Relays</div>
                        <div className="text-xs font-bold text-blue-700 font-mono mt-0.5">48 Nodes Active</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                        <div className="text-[10px] text-slate-500 font-mono font-medium">Citizen Beacons</div>
                        <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">1,240 Reached</div>
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-slate-100 pt-2">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Predicted Escape Route: NH-48 Towards Gurugram Toll
                      </span>
                    </div>
                  </div>

                  {/* Mode Toggles */}
                  <div className="flex gap-2 text-xs font-mono">
                    <button 
                      onClick={() => setActiveTab("geofence")}
                      className={`px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                        activeTab === "geofence" 
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      01. Geofence Engine
                    </button>
                    <button 
                      onClick={() => setActiveTab("vision")}
                      className={`px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                        activeTab === "vision" 
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      02. Biometric Verification
                    </button>
                    <button 
                      onClick={() => setActiveTab("ingestion")}
                      className={`px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                        activeTab === "ingestion" 
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs" 
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      03. Multi-Agent Dispatch
                    </button>
                  </div>
                </div>

                {/* Right Agent Terminal Output (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-3 bg-white rounded-xl border border-slate-200 p-4 font-mono text-xs shadow-xs text-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] text-slate-500 uppercase font-bold">Autonomous Agent Logs</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">LANGGRAPH_V2</span>
                  </div>

                  <div className="space-y-2.5 flex-grow overflow-y-auto text-[11px] leading-relaxed">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
                      <span className="text-slate-400 font-mono">[09:42:01]</span> <span className="text-indigo-600 font-bold">IngestAgent:</span> Facial vector embedding normalized from reference photo.
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
                      <span className="text-slate-400 font-mono">[09:42:06]</span> <span className="text-blue-600 font-bold">RoutePredictor:</span> Calculated transport exit corridor (Probability: 88.2%).
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700">
                      <span className="text-slate-400 font-mono">[09:42:14]</span> <span className="text-amber-600 font-bold">BroadcastAgent:</span> Dispatched geofenced push alerts to 1,240 citizen devices.
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                      <span className="text-emerald-600 font-mono">[09:42:25]</span> <span className="text-emerald-700 font-bold">VisionVerify:</span> Citizen tip #8401 matched with <span className="font-bold underline text-emerald-950">98.4% confidence</span>. Routing to station supervisor.
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Officer Queue: <strong className="text-slate-900 font-bold">1 Pending Review</strong></span>
                    <Link href={user ? "/verification-desk" : "/login"} className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1">
                      Verify lead <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Mission Impact Stats Bar */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                &lt; 3.5 Min
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Average Geofence Activation
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                99.2%
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Biometric Match Precision
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                14,800+
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Transit Nodes Synchronized
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
                Zero-Lag
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Multi-Agency Synchronization
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works (The 3-Step Protocol) */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-700 text-xs font-semibold uppercase tracking-wider">
              Structured SOP Protocol
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Engineered for the Critical Golden Hour
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              When a child is reported missing, traditional delays cost valuable time. ChildGuard coordinates an immediate, multi-tier search protocol within seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl font-black text-blue-100">01</span>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-slate-900">Instant Ingestion & Biometric Dossier</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  First responders or family members register the incident. The system immediately parses reference photos, extracting high-dimensional facial embeddings and distinctive physical markers.
                </p>
              </div>
              <div className="pt-2 text-xs font-medium text-blue-700 flex items-center gap-1">
                <span>Dlib & FaceNet Feature Mapping</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl font-black text-indigo-100">02</span>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Compass className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-slate-900">Autonomous Geofencing & Transit Intercept</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our predictive mobility engine computes time-distance escape velocities across arterial highways, train stations, and bus depots, automatically establishing concentric alert perimeters.
                </p>
              </div>
              <div className="pt-2 text-xs font-medium text-indigo-700 flex items-center gap-1">
                <span>Transit Velocity Heatmaps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-4xl font-black text-emerald-100">03</span>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-slate-900">Edge Verification & Rapid Recovery</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Citizen tips and automated surveillance camera feeds are matched in real time. Station officers review high-confidence matches on the verification desk for immediate physical intercept.
                </p>
              </div>
              <div className="pt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
                <span>Human-In-The-Loop Station Dispatch</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Dual Portals (Citizen vs Law Enforcement) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tailored Portals for Community & Command
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Designed with dedicated workflows for citizens on the ground and law enforcement officers in the operations center.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Citizen Portal Card */}
            <div className="rounded-3xl p-8 sm:p-10 border border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  Public Citizen Access • No Login Required
                </div>
                
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  Every Citizen Can Be an Observer
                </h3>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  If you spot a child matching an active bulletin, submit a photo and location instantly. Your tip is analyzed immediately by our verification engine while preserving your privacy.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Browse real-time active alerts in your state or district</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Upload photos directly from your phone camera with GPS stamp</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Download and circulate verified missing child notice posters</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200/80">
                <Link href="/public-alert" className="flex-1">
                  <Button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm gap-2 shadow-sm">
                    <MapPin className="w-4 h-4" />
                    Browse Active Alerts
                  </Button>
                </Link>
                <Link href="/report-a-sighting" className="flex-1">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-sm gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    Report a Sighting
                  </Button>
                </Link>
              </div>
            </div>

            {/* Officer Portal Card (Light Themed) */}
            <div className="rounded-3xl p-8 sm:p-10 border border-blue-200/80 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 text-slate-900 shadow-md flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Law Enforcement & First Responders Only
                </div>
                
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  Autonomous Tactical Dispatch Console
                </h3>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Authorized station officers gain full control over case dossiers, real-time geofence deployment, and the AI verification queue for rapid human-in-the-loop validation.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Register new missing child cases with instant biometric embedding</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Review optical matches with SSIM score and confidence percentages</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Direct dispatch coordination with toll gates and transit police</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
                {user ? (
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm gap-2 shadow-md shadow-blue-500/20">
                      <Shield className="w-4 h-4" />
                      Open Dispatch Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login" className="flex-1">
                    <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm gap-2 shadow-md shadow-blue-500/20">
                      <Shield className="w-4 h-4" />
                      Sign In as Officer
                    </Button>
                  </Link>
                )}
                
                <Link href="/register-case" className="flex-1">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-300 hover:bg-slate-50 text-slate-800 font-medium text-sm gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                    Register a Case
                  </Button>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Statutory / Standard Operating Procedures Compliance */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 justify-between shadow-xs">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Statutory Alignment & Emergency Protocol
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Aligned with Supreme Court SOP & National Emergency Helplines
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                ChildGuard adheres strictly to the guidelines framed in Bachpan Bachao Andolan v. Union of India (Writ Petition (Crl.) No. 75 of 2012). For immediate crisis response, dial the toll-free emergency hotlines below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a 
                href="tel:112"
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>112 (National Emergency)</span>
              </a>
              <a 
                href="tel:1098"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>1098 (Childline India)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-base text-slate-900">
                ChildGuard AI Network
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">Rapid Child Intercept & Recovery Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
              <Link href="/public-alert" className="hover:text-blue-600 transition-colors">Active Alerts</Link>
              <Link href="/report-a-sighting" className="hover:text-blue-600 transition-colors">Submit Tip</Link>
              <Link href="/register-case" className="hover:text-blue-600 transition-colors">Register Case</Link>
              <Link href="/login" className="hover:text-blue-600 transition-colors">Officer Portal</Link>
              <a href="tel:112" className="text-rose-600 hover:text-rose-700">Dial 112</a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              ChildGuard is an advanced AI search pipeline prototype built for high-speed child recovery. All biometrics and geo-data processed under privacy preservation standards.
            </p>
            <p className="shrink-0">
              National Emergency: 112 • Childline: 1098
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
