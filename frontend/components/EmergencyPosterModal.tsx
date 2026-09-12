"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { type CaseData } from "@/lib/api";
import { 
  Printer, 
  Share2, 
  X, 
  Phone, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  User, 
  QrCode,
  Download,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EmergencyPosterModalProps {
  caseData: CaseData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyPosterModal({
  caseData,
  isOpen,
  onClose,
}: EmergencyPosterModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!caseData || typeof window === "undefined") return;

    const sightingUrl = `${window.location.origin}/report-a-sighting?caseId=${caseData.caseId}`;
    QRCode.toDataURL(sightingUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then(setQrDataUrl)
      .catch((err) => console.error("QR Code Error:", err));
  }, [caseData]);

  if (!isOpen || !caseData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (typeof window === "undefined") return;
    const sightingUrl = `${window.location.origin}/report-a-sighting?caseId=${caseData.caseId}`;
    const text = `🚨 *MISSING CHILD EMERGENCY BULLETIN* 🚨\n\nChild Name: *${caseData.childName}* (Age ${caseData.age})\nLast Seen: ${caseData.lastSeenLocation.address}\nCase ID: ${caseData.caseId}\n\n📸 *Report a Sighting or Submit Photo Tip:* ${sightingUrl}\n\nEmergency Contacts: Police *112* | Childline *1098*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Card Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 print:shadow-none print:border-0 print:max-w-none print:rounded-none">
        
        {/* Modal Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              Emergency Police Bulletin Generator
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handlePrint}
              className="h-8 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs gap-1.5 rounded-lg shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleWhatsAppShare}
              className="h-8 bg-emerald-600 hover:bg-emerald-700 border-0 text-white font-semibold text-xs gap-1.5 rounded-lg shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share on WhatsApp</span>
              <span className="sm:hidden">Share</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Flyer Body */}
        <div 
          ref={posterRef} 
          className="p-6 sm:p-8 bg-white text-slate-900 space-y-6 print:p-8 print:space-y-4 font-sans"
        >
          
          {/* Top Header Banner */}
          <div className="border-b-4 border-rose-600 pb-4 text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-100 text-rose-900 border border-rose-300 text-xs font-mono font-black uppercase tracking-widest">
              <span>URGENT • MISSING CHILD NOTICE • कानून प्रवर्तन अलर्ट</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-black tracking-tight text-rose-700 uppercase">
              MISSING CHILD BULLETIN
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wide">
              Child Protection & Anti-Human Trafficking Unit (AHTU) Joint Alert
            </p>
          </div>

          {/* Core Case Layout (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Child Photo Frame (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden border-4 border-rose-600 shadow-md relative bg-slate-100 flex items-center justify-center">
                {caseData.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={caseData.photoUrl}
                    alt={caseData.childName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-24 h-24 text-slate-400" />
                )}
                <div className="absolute bottom-2 left-2 right-2 bg-rose-600/95 text-white text-[11px] font-bold text-center py-1 rounded-md uppercase tracking-wider shadow-sm">
                  Age: {caseData.age} Years Old
                </div>
              </div>
            </div>

            {/* Particulars Card (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Name of Missing Child
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {caseData.childName}
                </h2>
                <span className="inline-block font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mt-1">
                  Case ID: #{caseData.caseId}
                </span>
              </div>

              {/* Key Location & Timestamp */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-700 block uppercase">Last Known Location:</span>
                    <span className="font-semibold text-slate-900 text-sm">{caseData.lastSeenLocation.address}</span>
                  </div>
                </div>
                {caseData.lastSeenLocation.timestamp && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-600">
                      Disappeared: <strong className="text-slate-800">{new Date(caseData.lastSeenLocation.timestamp).toLocaleString()}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Physical Identifiers */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Physical Description & Attire:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200 leading-relaxed font-medium">
                  {caseData.description || "Wearing standard casual attire. No distinct birthmarks recorded."}
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Call to Action & QR Section */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-slate-800 print:bg-slate-900 print:text-white">
            
            {/* Dynamic QR Code */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={qrDataUrl} 
                    alt="Scan QR code to submit tip" 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <QrCode className="w-12 h-12 text-slate-400 animate-pulse" />
                )}
              </div>
              <div className="space-y-1 max-w-[200px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Instant Citizen Tip</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Scan with any smartphone camera to upload a photo sighting or report location.
                </p>
              </div>
            </div>

            {/* Emergency Hotline Numbers */}
            <div className="flex flex-col sm:items-end gap-2 text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                Immediate Emergency Lines
              </span>
              <div className="flex items-center gap-4 flex-wrap sm:justify-end">
                <a 
                  href="tel:112"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>POLICE: 112</span>
                </a>
                <a 
                  href="tel:1098"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>CHILDLINE: 1098</span>
                </a>
              </div>
              <span className="text-[10px] text-slate-400">
                Statutory Compliance: Section 74, Juvenile Justice Act 2015
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
