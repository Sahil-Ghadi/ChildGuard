"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export type MapProps = {
  center: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    position: [number, number];
    popup?: string;
  }>;
  paths?: Array<{
    id?: string;
    positions: [number, number][];
    color?: string;
    dashArray?: string;
    weight?: number;
    opacity?: number;
  }>;
  circles?: Array<{
    id?: string;
    center: [number, number];
    radius: number;
    color?: string;
    fillColor?: string;
    fillOpacity?: number;
    weight?: number;
    dashArray?: string;
    popup?: string;
  }>;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || map.getZoom());
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function Map({ 
  center, 
  zoom = 13, 
  markers = [], 
  paths = [],
  circles = [],
  className = "w-full h-full", 
  onMapClick 
}: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={`${className} bg-slate-100 animate-pulse`} />;

  return (
    <div className={`relative ${className}`} style={{ zIndex: 1 }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="w-full h-full">
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {onMapClick && <MapClickHandler onClick={onMapClick} />}

        {/* Probable Range / Travel Radius Circles */}
        {circles.map((c, i) => (
          <Circle
            key={c.id || `circle-${i}`}
            center={c.center}
            radius={c.radius}
            pathOptions={{
              color: c.color || "#2563eb",
              fillColor: c.fillColor || "#3b82f6",
              fillOpacity: c.fillOpacity ?? 0.15,
              weight: c.weight ?? 1.5,
              dashArray: c.dashArray || "5, 5"
            }}
          >
            {c.popup && <Popup>{c.popup}</Popup>}
          </Circle>
        ))}

        {/* Tactical Trajectory Paths between Original and Reported Locations */}
        {paths.map((p, i) => (
          <Polyline
            key={p.id || `path-${i}`}
            positions={p.positions}
            pathOptions={{
              color: p.color || "#2563eb",
              dashArray: p.dashArray || "6, 8",
              weight: p.weight ?? 3.5,
              opacity: p.opacity ?? 0.85
            }}
          />
        ))}

        {/* Point Markers */}
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={icon}>
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
