import Button from "@/components/ui/Button";
import MapWrapper from "@/components/MapWrapper";

export default function ReportSighting() {
  return (
    <div className="max-w-[1280px] w-full mx-auto px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl">
      <div className="flex flex-col gap-space-md mb-space-xl">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Active Priority Protocol</span>
            <span className="text-outline-variant text-label-sm">•</span>
            <span className="font-label-md text-label-md text-on-surface font-medium">Case #CG-2026-0894</span>
            <span className="text-outline-variant text-label-sm">•</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Priya Sharma (7 yrs)</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
            <span>Encrypted Direct Terminal Relay</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="font-display text-headline-lg md:text-display text-on-surface tracking-tight">Submit a Community Sighting</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your information is transmitted instantly to vetted tactical field officers within a 3km radius. Takes under 60 seconds.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 p-1.5 bg-surface-container-low rounded-full self-start md:self-auto shadow-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-on-primary">
              <span className="font-label-sm text-label-sm bg-surface-container-lowest/20 w-4 h-4 rounded-full flex items-center justify-center">1</span>
              <span className="font-label-md text-label-md">Visual</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface shadow-sm">
              <span className="font-label-sm text-label-sm bg-surface-container-high w-4 h-4 rounded-full flex items-center justify-center font-bold">2</span>
              <span className="font-label-md text-label-md">Place &amp; Time</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-on-surface-variant">
              <span className="font-label-sm text-label-sm bg-surface-container-high w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
              <span className="font-label-md text-label-md hidden sm:inline">Details</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          
          {/* Card 1: Visual Verification */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-label-md text-label-md">01</span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Visual Verification</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Attach an immediate photo or dashcam capture if safe to do so.</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">High Priority</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
              <div className="md:col-span-7 bg-surface-container-low/70 rounded-xl p-space-lg flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface-container border border-dashed border-outline-variant/50 transition-all">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm text-secondary mb-space-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                </div>
                <p className="font-headline-sm text-headline-sm text-on-surface mb-0.5">Snap or Drop Image</p>
                <div className="flex items-center gap-space-xs mt-4">
                  <Button variant="primary">Browse Files</Button>
                  <Button variant="secondary" icon={<span className="material-symbols-outlined text-[16px]">sensors</span>}>Live Camera</Button>
                </div>
              </div>

              <div className="md:col-span-5 bg-surface-container rounded-xl p-space-md flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Preview Buffer</span>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                      <span>AI Scanned</span>
                    </div>
                  </div>
                  <div className="relative h-28 rounded-lg overflow-hidden bg-surface-container-high">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnAerrgldokWsRklQt4X6-sLNvbUH6dm25N7pJT4odcumN4lHcEUk3L3M_kzmGXzw_LoLSyv7BZIY8k7BP1aaITmri3xQJxg3knd4nqYG6GKZLeBw3K8VsKu1Jj178GY_CBZCq0NSmBCgv-IIJA7uD6bjxUmuaPvOKhbc_iwzWRcszTLZolSgb4GOcp_yK3biZQ9QITqLu8qIDhS9jJjj-MHY_AQYgvQfEt5iFpHNXyW4qFdPPJh19" />
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-inverse-surface/85 backdrop-blur-sm text-inverse-on-surface font-label-sm text-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary-container">verified</span>
                      <span>Candidate #01</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest rounded-lg p-2.5 mt-2 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Feature Confidence</span>
                    <span className="font-label-md text-label-md text-secondary">88.4% Match</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-[88%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Location & Timestamp */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-label-md text-label-md">02</span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Location &amp; Timestamp</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Pinpoint the exact transit point or landmark where contact occurred.</p>
                </div>
              </div>
              <Button variant="secondary" icon={<span className="material-symbols-outlined text-[16px]">my_location</span>}>
                Use Current GPS
              </Button>
            </div>
            
            <div className="space-y-space-sm">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px]">location_on</span>
                <input className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md pl-11 pr-4 py-2.5 rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:shadow-md transition-all placeholder:text-outline" placeholder="Enter landmark, street name, or transit station" type="text" defaultValue="Kashmere Gate Metro Interchange, Gate 2 Concourse" />
              </div>
              
              <div className="relative w-full h-52 rounded-xl overflow-hidden shadow-sm border border-outline-variant/30">
                <MapWrapper
                  center={[28.6675, 77.2285]}
                  zoom={15}
                  markers={[
                    { id: "1", position: [28.6675, 77.2285], popup: "Kashmere Gate Metro Interchange" }
                  ]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Estimated Observation Time</span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <button className="py-2 px-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md text-center shadow-sm flex items-center justify-center gap-1.5" type="button">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                  <span>Just Now (&lt;5m)</span>
                </button>
                <button className="py-2 px-3 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md text-center transition-colors" type="button">
                  ~15 mins ago
                </button>
                <button className="py-2 px-3 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md text-center transition-colors" type="button">
                  ~30 mins ago
                </button>
                <button className="py-2 px-3 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md text-center transition-colors flex items-center justify-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>Custom Time</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Card 3: Context & Companions */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center gap-space-sm">
              <span className="w-7 h-7 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-label-md text-label-md">03</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Context &amp; Companions</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Select who the child appeared to be with, and key behavioral indicators.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Accompanied Status</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <button className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md text-center transition-colors flex flex-col items-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">person</span>
                  <span>Alone</span>
                </button>
                <button className="p-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md text-center shadow-sm flex flex-col items-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[20px] text-secondary-container">group</span>
                  <span>1 Adult (Male)</span>
                </button>
                <button className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md text-center transition-colors flex flex-col items-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">group</span>
                  <span>1 Adult (Female)</span>
                </button>
                <button className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md text-center transition-colors flex flex-col items-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">directions_car</span>
                  <span>In a Vehicle</span>
                </button>
                <button className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md text-center transition-colors flex flex-col items-center gap-1" type="button">
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">help</span>
                  <span>Unsure</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Detailed Observations</label>
                <span className="font-label-sm text-label-sm text-secondary font-medium">Voice Assist Enabled</span>
              </div>
              <textarea className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md p-3.5 rounded-xl focus:outline-none border border-outline-variant/30 focus:border-secondary transition-all placeholder:text-outline" placeholder="Describe distinct clothing changes, demeanour, direction of travel, or escort identifiers..." rows={3}></textarea>
            </div>
            
            <div className="pt-2 border-t border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
              <div className="space-y-1 w-full sm:w-auto">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Phone Callback (Optional for field officers)</label>
                <input className="w-full sm:w-64 bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-1.5 rounded-lg focus:outline-none border border-outline-variant/30 focus:border-secondary" placeholder="+91 •••• ••••••" type="tel" />
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto bg-surface-container-low px-3 py-2 rounded-lg">
                <input defaultChecked className="w-4 h-4 rounded accent-primary text-on-primary focus:ring-0 cursor-pointer" id="confidential" type="checkbox" />
                <label className="font-label-md text-label-md text-on-surface cursor-pointer select-none" htmlFor="confidential">
                  Keep identity confidential
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reference & Dispatch Actions (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg lg:sticky lg:top-24">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">Broadcast Dossier</span>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm">Active 4h 12m</span>
            </div>
            <div className="flex gap-space-sm items-start">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
                <img alt="Candid portrait of missing child Priya Sharma" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1XToV2EHWWyk3MO-2isZoFgUh7LqcbkAb3CevT-abTp3hH9obMDpwTsvubtn56R60W3xNgDHbBxUkFs3Ndg11d75k1fsmbLMOlruV72SCWSuf5A4CJxnakBGPuUAvbcVTJ_ewtsYRECjFOHPxdNxoNciOTtQ68235rxotqDeTTaBjfI9T8Jw70WGDZ5toGusyg2iM5AF-A_h1FJdV577l9__EjgLGkUmH7Hv8N5rE-JzcAlX1sN1xaNAqc" />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">Priya Sharma</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">7 years old • Female</p>
                <div className="pt-1 flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">Height 120 cm</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">Ponytail</span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0 mt-0.5">checkroom</span>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Last Known Attire:</span>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">Red cotton t-shirt with yellow motif, blue jeans, white canvas shoes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-sm border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">shield</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface text-[14px]">Public Protection Protocol</h4>
            </div>
            <ul className="space-y-2 text-on-surface-variant font-body-sm text-body-sm text-[12px]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-secondary shrink-0 mt-0.5">verified_user</span>
                <span>Direct relay to PCR Mobile vans &amp; local station duty officers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-secondary shrink-0 mt-0.5">lock</span>
                <span>Full end-to-end cryptographic hash. Your location IP is sanitized.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-space-sm">
            <Button variant="primary" className="w-full py-3.5 flex justify-center text-lg gap-2" icon={<span className="material-symbols-outlined">send</span>}>
              Submit Verified Sighting
            </Button>
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-error">emergency</span>
                <span className="font-label-md text-label-md text-on-surface">Hotlines</span>
              </div>
              <div className="flex items-center gap-2">
                <a className="px-2.5 py-1 rounded bg-error-container text-on-error-container font-label-md text-label-md hover:opacity-90" href="tel:112">112</a>
                <a className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container shadow-sm border border-outline-variant/30" href="tel:1098">1098</a>
              </div>
            </div>
            <p className="text-center font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-relaxed px-4">
              False information penalised under Section 182 IPC. Submit genuine observations only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
