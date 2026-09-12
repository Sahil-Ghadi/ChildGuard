import Button from "@/components/ui/Button";
import MapWrapper from "@/components/MapWrapper";

export default function PublicAlert() {
  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-full antialiased flex flex-col justify-between w-full">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Hero Missing Person Showcase Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Photo Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-md bg-slate-100 aspect-square">
                <img alt="Priya Sharma missing child alert photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1XToV2EHWWyk3MO-2isZoFgUh7LqcbkAb3CevT-abTp3hH9obMDpwTsvubtn56R60W3xNgDHbBxUkFs3Ndg11d75k1fsmbLMOlruV72SCWSuf5A4CJxnakBGPuUAvbcVTJ_ewtsYRECjFOHPxdNxoNciOTtQ68235rxotqDeTTaBjfI9T8Jw70WGDZ5toGusyg2iM5AF-A_h1FJdV577l9__EjgLGkUmH7Hv8N5rE-JzcAlX1sN1xaNAqc" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-600/90 text-white backdrop-blur-sm shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    Active Alert
                  </span>
                </div>
                <div className="absolute bottom-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 text-white backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Verified Guardian
                  </span>
                </div>
              </div>
            </div>
            
            {/* Details & Primary Actions Column */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Case #CG-2026-0894</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full font-semibold">Priority Incident</span>
                </div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Priya Sharma</h1>
                  <span className="text-lg font-medium text-slate-500">7 years old • Female</span>
                </div>
                <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                  Reported missing near Kashmere Gate terminal. Multi-jurisdiction search actively coordinated with local transit officers and civil defense.
                </p>
              </div>

              {/* Key vital details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Last Seen</span>
                  <p className="text-sm font-semibold text-slate-900">Kashmere Gate, Delhi</p>
                  <span className="text-xs text-slate-500">Today at 2:30 PM</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Wearing</span>
                  <p className="text-sm font-semibold text-slate-900">Red t-shirt, blue jeans</p>
                  <span className="text-xs text-slate-500">White sneakers</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Key Markers</span>
                  <p className="text-sm font-semibold text-slate-900">Responds to "Pihu"</p>
                  <span className="text-xs text-slate-500">Mole below left eye • Ponytail</span>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button className="sm:col-span-2 bg-slate-900 hover:bg-slate-800 text-white min-h-[56px] text-[16px]">
                  <span className="material-symbols-outlined text-[20px]">share_location</span>
                  Report a Sighting
                </Button>
                <button className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-5 rounded-xl transition">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                  <span>Share Alert</span>
                </button>
                <a href="tel:112" className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-5 rounded-xl transition">
                  <span className="material-symbols-outlined text-rose-600 text-[20px]">call</span>
                  <span>112 Direct</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Sighting Map & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Sighting Radius &amp; Corridors</h2>
                <p className="text-sm text-slate-500">Active alerts mapped across local transport hubs</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Last Known</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Verified Sighting</span>
              </div>
            </div>
            
            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner">
              <MapWrapper
                center={[28.6415, 77.2398]}
                zoom={14}
                markers={[
                  { id: "1", position: [28.6415, 77.2398], popup: "Delhi Gate • 2:30 PM" }
                ]}
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Recent Sighting Reports</h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">3 Reports</span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified • Police En Route
                    </span>
                    <span className="text-xs text-slate-400 font-medium">4 mins ago</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mt-1.5 font-medium">
                    "Child matching description seen near Metro Escalator Gate 3 holding a cartoon bottle. Looked confused."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
