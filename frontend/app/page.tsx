import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import MapWrapper from "@/components/MapWrapper";

export default function TacticalCommand() {
  return (
    <div className="flex flex-col w-full">
      {/* Command Center Header Band */}
      <section className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop py-space-md">
        <div className="max-w-[1280px] mx-auto flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
          
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-sm shrink-0">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
              <span className="font-semibold tracking-wide">LIVE CASE</span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface">
              <span className="font-bold text-on-surface text-headline-sm tracking-tight">Case #CG-2026-0894</span>
              <span className="text-outline-variant text-[14px]">•</span>
              <span className="font-bold text-on-surface text-headline-sm">Priya Sharma</span>
              <span className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant font-semibold px-2 py-0.5 rounded-full">7y</span>
            </div>
            <Badge variant="critical" icon>Level-1 Priority</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2.5 w-full xl:w-auto">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container transition-all">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              </div>
              <div className="flex flex-col leading-tight pr-1">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">18</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Sightings Logged</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container transition-all">
              <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div className="flex flex-col leading-tight pr-1">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">4 High</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Confirmed Leads</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container transition-all">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
                <span className="material-symbols-outlined text-[18px]">local_police</span>
              </div>
              <div className="flex flex-col leading-tight pr-1">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">2 Units</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">PCR En Route</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-error-container border border-error/20 text-on-error-container hover:bg-tertiary-fixed transition-all">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-error shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">timer</span>
              </div>
              <div className="flex flex-col leading-tight pr-1">
                <span className="font-headline-sm text-headline-sm font-bold text-error">01h 52m</span>
                <span className="font-label-sm text-label-sm text-on-error-container font-medium">Golden Hour Elapsed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Panel Main Cockpit Layout */}
      <section className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop pb-space-2xl">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
          
          {/* COLUMN 1: Case Intake & Queue */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">Live Case Queue</span>
                <span className="font-label-sm text-label-sm bg-surface-container-low px-2 py-0.5 rounded-full text-on-surface-variant font-semibold">Auto-Sync 4s</span>
              </div>
              <div className="flex items-center p-1 bg-surface-container-low rounded-lg gap-1">
                <button className="flex-1 py-1.5 px-2 rounded-md bg-primary-container text-on-primary font-label-md text-label-md transition-all shadow-sm">
                  Priority (3)
                </button>
                <button className="flex-1 py-1.5 px-2 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">
                  Ingested (18)
                </button>
                <button className="flex-1 py-1.5 px-2 rounded-md text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-all">
                  Resolved
                </button>
              </div>
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input className="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" placeholder="Search case, ward or tag..." type="text" />
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              {/* Case Card 1 */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md ring-2 ring-primary-container flex flex-col gap-space-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-error"></div>
                <div className="flex items-start justify-between gap-space-xs pl-2">
                  <div className="flex gap-space-sm">
                    <img alt="Active Subject Portrait" className="w-14 h-14 rounded-lg object-cover shadow-sm ring-1 ring-outline-variant/30 shrink-0" src="https://lh3.googleusercontent.com/aida/AEtjO1XToV2EHWWyk3MO-2isZoFgUh7LqcbkAb3CevT-abTp3hH9obMDpwTsvubtn56R60W3xNgDHbBxUkFs3Ndg11d75k1fsmbLMOlruV72SCWSuf5A4CJxnakBGPuUAvbcVTJ_ewtsYRECjFOHPxdNxoNciOTtQ68235rxotqDeTTaBjfI9T8Jw70WGDZ5toGusyg2iM5AF-A_h1FJdV577l9__EjgLGkUmH7Hv8N5rE-JzcAlX1sN1xaNAqc" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">Priya Sharma</span>
                        <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-1.5 py-0.2 rounded-full font-bold">7y</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Critical Corridor Alert</span>
                      <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span>Sarai Kale Khan ISBT</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pl-2 pt-1 flex items-center justify-between">
                  <span className="font-label-sm text-label-sm bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">3 Verified Sightings</span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">Active Vector →</span>
                </div>
              </div>
              
              {/* Case Card 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col gap-space-sm cursor-pointer">
                <div className="flex items-start justify-between gap-space-xs">
                  <div className="flex gap-space-sm">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                      <span className="material-symbols-outlined text-[24px]">child_care</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">Rohit Verma</span>
                        <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface px-1.5 py-0.2 rounded-full">9y</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Sector 14 Playfield Corridor</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Last ping: 26m ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-sm text-label-sm bg-surface-container-low px-2 py-0.5 rounded">1 Sighting Awaiting Video</span>
                  <span className="font-label-sm text-label-sm font-medium">PCR-08 Standby</span>
                </div>
              </div>

              {/* Case Card 3 */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col gap-space-sm cursor-pointer border border-outline-variant/30">
                <div className="flex items-start justify-between gap-space-xs">
                  <div className="flex gap-space-sm">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                      <span className="material-symbols-outlined text-[24px]">person</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">Aarav Kapoor</span>
                        <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface px-1.5 py-0.2 rounded-full">12y</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Transit Monitor • Ghaziabad Jn</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Last ping: 48m ago</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-sm text-label-sm bg-surface-container-low px-2 py-0.5 rounded">Railway Police Sync</span>
                  <span className="font-label-sm text-label-sm font-medium">Station Hold</span>
                </div>
              </div>

            </div>

            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">Integrated Grid Active</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">142 CCTV relays online</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
            </div>
          </div>

          {/* COLUMN 2: Tactical Geo-Tracking */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden flex flex-col relative">
              <div className="p-space-md flex flex-wrap items-center justify-between gap-space-sm z-10 bg-surface-container-lowest border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Delhi-NCR Intercept Corridor</span>
                  <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed-variant px-2.5 py-0.5 rounded-full font-semibold">Live GPS Telemetry</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
                  <button className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-semibold shadow-xs">Street View</button>
                  <button className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm">Corridors</button>
                  <button className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> CCTV
                  </button>
                </div>
              </div>
              <div className="relative w-full h-[460px] bg-surface-container-low overflow-hidden">
                <MapWrapper
                  center={[28.6675, 77.2285]}
                  zoom={12}
                  markers={[
                    { id: "1", position: [28.6415, 77.2398], popup: "Delhi Gate (14:30)" },
                    { id: "2", position: [28.6675, 77.2285], popup: "Kashmere Gate Metro (89% Match)" },
                    { id: "3", position: [28.5866, 77.2530], popup: "Sarai Kale Khan ISBT (91.2% CCTV Match • 15:38)" }
                  ]}
                />
              </div>

              {/* Sub-Map Action Banner: Intercept Target Specs */}
              <div className="p-space-md bg-surface-container flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm border-t border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-error shadow-sm border border-outline-variant/30">
                    <span className="material-symbols-outlined text-[24px]">directions_car</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Silver Hatchback</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-lowest font-label-md text-label-md text-on-surface font-bold shadow-xs border border-outline-variant/30">DL-3C-AP-9410</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Vector: Southbound via NH-19 Expressway • High probability transit</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col text-right">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Window to Toll #3</span>
                    <span className="font-headline-sm text-headline-sm font-bold text-error">18 min remaining</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rapid Response CCTV Feed Thumbnails */}
            <div className="grid grid-cols-2 gap-space-sm">
              <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col gap-1.5 border border-outline-variant/30">
                <div className="relative w-full h-24 rounded-lg bg-surface-container-high overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlSGDxYL1Y1M0VdWWGIe5-_uL85JnYWFKABPNe21vyEvf_nrgub4YTvjMigoFJMPRGJ-bBmUTipcOjPp3JTdNLULKVObfNvEwHyqioNgfTPB_iG9pzIfM9f1jIXhBba7PUk1T7pOqWiOJGbwgEIcPBEtV4_O2zoOsnKuk16GUmUCDGTlSQ4ojd6nZUvOw7HgH8iCeaJVjfhsNgclrxxaVnaoy5jFAee_aq_S5oJlBMvcbjNy3K-NfK')" }}></div>
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-surface-container-lowest/80 text-on-surface font-label-sm text-label-sm">CAM-KG-02</span>
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">15:12</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface truncate px-1">Kashmere Gate Gate 3</span>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col gap-1.5 border border-outline-variant/30">
                <div className="relative w-full h-24 rounded-lg bg-surface-container-high overflow-hidden">
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_DKKujECOWrHhwOMQSZUjXI2AyAsqGN0Ck19hcgAFhxD_iF4cipSP6Vv49nSua4I5ouh0diHzDAfK6BtP8xY1ydbLgpLOORkA2p12zrohua_HDUlId8zJbwl72mbgChvWCpDrxMKE24U4qft84CpDAoQKslOpm1eEfImqnoxo4jH83D9OCNW-fppFS2tqAdzWtoZpiI_ZameX8-D8b3EMuMpUxjFlO6mtSulmqTf4tYB92JGESU2u')" }}></div>
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-surface-container-lowest/80 text-on-surface font-label-sm text-label-sm">CAM-SKK-04B</span>
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-error text-on-error font-label-sm text-label-sm">MATCH 91%</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface truncate px-1">Sarai Kale Khan Slip</span>
              </div>
            </div>

          </div>

          {/* COLUMN 3: Tactical Action & Verified Intel (Right: 3 cols / ~360px equivalent) */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop mt-space-sm">
            {/* Left Sub-panel: Verified Lead & Operational Directives */}
            <div className="flex flex-col gap-space-md">
              {/* High Confidence Match Intel Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Top Verified Lead</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 border border-outline-variant/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 91.2% Match
                  </span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant/30">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Witness Statement (Auto-Transcribed)</span>
                  <p className="font-body-sm text-body-sm text-on-surface italic">
                    “Girl matching description in red t-shirt with adult male boarding Agra bus corridor near outer ring bay.”
                  </p>
                  <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm pt-1 border-t border-outline-variant/30">
                    <span>Witness #402 • Verified</span>
                    <span>15:34 IST</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Biometric Facial Check</span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">High Feature Correlation</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary font-bold text-label-md border border-outline-variant/30">
                    A+
                  </div>
                </div>
              </div>
              
              {/* Tactical Command Decision Controls */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Operational Directives</span>
                <button className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[20px]">local_police</span>
                  <span>Dispatch Highway Intercept Unit</span>
                </button>
                <button className="w-full py-2.5 px-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface hover:bg-surface-container transition-all flex items-center justify-center gap-2 font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Alert Toll Plaza Barrier #3</span>
                </button>
                <button className="w-full py-2.5 px-4 rounded-xl bg-secondary-fixed text-on-secondary-fixed-variant hover:bg-secondary-fixed-dim transition-all flex items-center justify-center gap-2 font-label-md text-label-md shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">send_and_archive</span>
                  <span>Broadcast to UP State Police</span>
                </button>
              </div>
            </div>
            
            {/* Right Sub-panel: Real-time Activity Timeline / Log */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm h-full border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Command Log</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Live Relays</span>
              </div>
              <div className="flex flex-col gap-space-sm pt-1 flex-1">
                <div className="flex gap-space-sm items-start">
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 mt-0.5">15:38</span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">CCTV node 04B triggered match</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Vehicle detected exiting towards DND loop</span>
                  </div>
                </div>
                <div className="flex gap-space-sm items-start">
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 mt-0.5">15:32</span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">PCR-14 Dispatched</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Assigned to Sarai Kale Khan transit perimeter</span>
                  </div>
                </div>
                <div className="flex gap-space-sm items-start">
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 mt-0.5">15:20</span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">Public Broadcast Pushed</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">42,000 devices alerted in 5km radius</span>
                  </div>
                </div>
                <div className="flex gap-space-sm items-start">
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 mt-0.5">14:48</span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">Case Registered via Hotline</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">First guardian confirmation by Delhi Control</span>
                  </div>
                </div>
              </div>
              <div className="mt-space-sm pt-space-sm border-t border-outline-variant/30 flex items-center gap-2">
                <input className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Add tactical dispatch note..." type="text" />
                <button className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 hover:bg-primary-container transition-all">
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
