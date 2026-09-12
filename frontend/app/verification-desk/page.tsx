import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import MapWrapper from "@/components/MapWrapper";

export default function VerificationDesk() {
  return (
    <div className="flex flex-col w-full">
      <div className="max-w-[1280px] mx-auto w-full px-margin md:px-margin-tablet lg:px-margin-desktop py-space-lg space-y-space-lg pb-32">
        
        {/* Header & Breadcrumb Context Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Cases</span>
              <span className="text-outline-variant font-label-sm text-label-sm">/</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase font-semibold">Case #CG-2026-0894</span>
              <span className="text-outline-variant font-label-sm text-label-sm">/</span>
              <span className="font-label-sm text-label-sm text-secondary tracking-wider uppercase font-semibold bg-surface-container-high px-2 py-0.5 rounded-full">Sighting Evidence Review (#S-1049)</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Forensic Sighting Verification Desk</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Compare community and CCTV submissions against the verified reference dossier using cross-sensor biometric correlation.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-sm self-start md:self-auto border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-label-md text-label-md text-on-surface">Queue: 2 Pending Review</span>
            </div>
            <div className="h-3 w-[1px] bg-surface-container"></div>
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant">
              <span>Next Item</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface font-semibold shadow-xs">N</kbd>
            </div>
          </div>
        </div>

        {/* Section 1: Side-by-Side Visual Comparison with Center Match Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          
          {/* Left Card: Reference Dossier */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">folder_shared</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Reference Dossier</h2>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-container-low text-secondary px-2.5 py-1 rounded-full font-label-sm text-label-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>Guardian Verified</span>
                </div>
              </div>
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-low shadow-sm group">
                <img alt="Reference photo of Priya Sharma" className="w-full h-full object-cover object-center" src="https://lh3.googleusercontent.com/aida/AEtjO1XToV2EHWWyk3MO-2isZoFgUh7LqcbkAb3CevT-abTp3hH9obMDpwTsvubtn56R60W3xNgDHbBxUkFs3Ndg11d75k1fsmbLMOlruV72SCWSuf5A4CJxnakBGPuUAvbcVTJ_ewtsYRECjFOHPxdNxoNciOTtQ68235rxotqDeTTaBjfI9T8Jw70WGDZ5toGusyg2iM5AF-A_h1FJdV577l9__EjgLGkUmH7Hv8N5rE-JzcAlX1sN1xaNAqc" />
                <div className="absolute bottom-3 left-3 right-3 bg-primary-container/85 backdrop-blur-md px-3.5 py-2 rounded-lg flex items-center justify-between text-on-primary">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md">Priya Sharma</span>
                    <span className="font-label-sm text-label-sm text-on-primary-container">• 7 yrs</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-primary-container">ID: REF-0894-A</span>
                </div>
              </div>
              <div className="mt-space-md space-y-2">
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Registered Identifiers</div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-start gap-2 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0 mt-0.5">checkroom</span>
                    <span className="font-body-sm text-body-sm text-on-surface">Red cotton t-shirt with small yellow rabbit motif</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0 mt-0.5">straighten</span>
                    <span className="font-body-sm text-body-sm text-on-surface">Dark blue denim jeans, height approx 122 cm</span>
                  </div>
                  <div className="flex items-start gap-2 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0 mt-0.5">face</span>
                    <span className="font-body-sm text-body-sm text-on-surface">Distinct small mole 4mm below left orbital crest</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-space-md flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>Logged: 24 May 2026, 08:15 IST</span>
              <span>Source: Family Primary Archive</span>
            </div>
          </div>

          {/* Center Metric Overlay */}
          <div className="lg:col-span-2 flex flex-col justify-between items-center py-2 space-y-space-md">
            
            {/* Redesigned Match Score */}
            <div className="w-full bg-gradient-to-b from-primary-container to-surface-container-highest border border-primary/20 rounded-xl p-space-md shadow-md flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5 bg-primary/20 text-on-primary-container px-2.5 py-1 rounded-full font-label-sm text-label-sm mb-3 border border-primary/30">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>Neural-8 Sync</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-surface-container-lowest w-full py-4 rounded-xl shadow-inner border border-outline-variant/50">
                <span className="font-display text-[2.5rem] font-bold text-secondary leading-none">91.2%</span>
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold mt-1 uppercase tracking-wide">High Confidence</span>
              </div>
              <div className="flex items-center gap-1 text-on-primary-container font-label-sm text-label-sm mt-3">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span>Multimodal Biometrics</span>
              </div>
            </div>

            <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-md shadow-sm space-y-4 flex-1 flex flex-col justify-center">
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-1.5">
                  <span className="text-on-surface font-semibold">Facial Landmark</span>
                  <span className="font-bold text-secondary">88.4%</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: "88.4%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-1.5">
                  <span className="text-on-surface font-semibold">Clothing Spectrum</span>
                  <span className="font-bold text-secondary">94.2%</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: "94.2%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-label-sm text-label-sm mb-1.5">
                  <span className="text-on-surface font-semibold">Stature & Gait</span>
                  <span className="font-bold text-secondary">91.0%</span>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: "91.0%" }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-outline-variant/30">
                <div className="flex justify-between font-label-sm text-label-sm items-center">
                  <span className="text-on-surface font-semibold">Motif Detection</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Matched</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Citizen Evidence Photo */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-[20px]">photo_camera</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Citizen Evidence Photo (#S-1049)</h2>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-container text-on-secondary-container px-2.5 py-1 rounded-full font-label-sm text-label-sm border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>EXIF Untampered</span>
                </div>
              </div>
              
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container-low shadow-sm group">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZUmrZ43VZKggaIiOOGy0BnvAPvV9iNrLSCfHPZYsw3jRGZ1926xpS-mlSDC-cegBr4poD7zFdW9sXVMriK53fa9CArktp-eIeA3EDzJ5RV_acmLexy9hLaSqS9zRuP1vCgEyko8cgyXvIKhje593IWZgJ0F9zUnaGN2rf7M1cU1beLkzvfFOaDYHf7dgBlwXGPQFzxEk20y0T8xGgkOUBwPIhBGtONRrvzWbaYWyEhH-CST8U3eou')" }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 via-transparent to-transparent"></div>
                  <div className="absolute left-1/4 top-1/5 w-44 h-56 rounded-lg pointer-events-none shadow-[0_0_0_9999px_rgba(15,23,42,0.35)] flex flex-col justify-between p-1.5 border-2 border-secondary/50">
                    <div className="flex items-center justify-between">
                      <span className="bg-secondary text-on-secondary font-label-sm text-[10px] px-1.5 py-0.5 rounded shadow-xs font-semibold">TGT_01 • 91.2%</span>
                      <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-primary-container/85 backdrop-blur-md px-3.5 py-2 rounded-lg flex items-center justify-between text-on-primary">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary-container">location_on</span>
                    <span className="font-label-md text-label-md truncate">Agra ISBT, Bay 4</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-primary-container">15:30:18 IST • Today</span>
                </div>
              </div>

            </div>
            <div className="pt-space-md flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>Ingest Relay: Node #UP-AGRA-04</span>
              <span>Hash: 4f98...d2c1</span>
            </div>
          </div>
        </div>

        {/* Section 2: Context & Witness Dossier (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mt-space-lg">
          {/* Left Box: Witness Credibility & Metadata */}
          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-lg shadow-sm space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">badge</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Witness Credibility &amp; Metadata</h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-secondary-container bg-surface-container px-2.5 py-0.5 rounded-full">Civilian Tipster Verified</span>
            </div>
            
            <div className="flex items-center gap-space-md bg-surface-container-low p-space-md rounded-xl">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-headline-sm font-bold">RM</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-label-md text-label-md text-on-surface">Rajeev M.</h4>
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Agra Resident • Commuter Network</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">4.9</span>
                  <span className="text-secondary font-label-sm text-label-sm">/ 5.0</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">4 Prior Validated Tips</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Audio Field Deposition (0:24)</span>
              <div className="bg-surface-container p-3 rounded-xl flex items-center gap-3">
                <button aria-label="Play witness audio statement" className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary hover:opacity-90 shadow-sm transition-all shrink-0">
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </button>
                <div className="flex-1 flex items-center gap-1 h-6">
                  {[3,5,2,6,4,5,3,4,2,5,3,1,4].map((h, i) => (
                    <span key={i} className={`w-1 rounded-full ${i < 7 ? 'bg-secondary' : 'bg-surface-variant'}`} style={{ height: `${h*4}px` }}></span>
                  ))}
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant">00:14</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <p className="font-body-sm text-body-sm text-on-surface italic">
                  “Was standing in line for Kanpur bus ticket counter near Bay 4. Observed a tall adult companion holding her hand hurriedly towards the interstate coach line. The child looked disoriented.”
                </p>
              </div>
            </div>
          </div>

          {/* Right Box: Telemetry & Geofence Corridor */}
          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-lg shadow-sm space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">near_me</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Telemetry &amp; Geofence Corridor</h3>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-surface-container-low px-2.5 py-0.5 rounded-full font-semibold">Corridor Matched</span>
            </div>
            
            <div className="relative h-44 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30">
              <MapWrapper
                center={[27.1767, 78.0081]}
                zoom={14}
                markers={[
                  { id: "1", position: [27.1767, 78.0081], popup: "Agra ISBT" }
                ]}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                <span>Automated Optical Intercepts</span>
                <span>Real-time Stream</span>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-container-low">
                <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between font-label-md text-label-md text-on-surface">
                    <span>Jewar Toll Plaza Camera #08</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">14:18 IST</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Silver sedan (Plate: UP80-XX-4412) logged traveling southbound at 88 km/h.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
