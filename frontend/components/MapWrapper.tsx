"use client";

import dynamic from "next/dynamic";

const MapWrapper = dynamic(() => import("./Map"), { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500">Loading Map...</div> });

export default MapWrapper;
