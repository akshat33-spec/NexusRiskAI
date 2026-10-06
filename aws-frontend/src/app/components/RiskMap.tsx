'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

export interface ToggleState {
  oilRoutes: boolean;
  airTraffic: boolean;
  geopoliticalEvents: boolean;
  overlayMap: boolean;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  coords: [number, number];
  category: keyof ToggleState;
  description: string;
  mitigation: string;
}

function MapController({ selectedCoords }: { selectedCoords: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 6, { duration: 1.5 });
    }
  }, [selectedCoords, map]);

  return null;
}

const createPulseIcon = (colorHex: string) =>
  L.divIcon({
    className: 'custom-pulse-marker',
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${colorHex}; opacity: 0.6; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <span style="position: relative; width: 10px; height: 10px; border-radius: 50%; background-color: ${colorHex}; border: 2px solid white; box-shadow: 0 0 10px ${colorHex};"></span>
      </div>
      <style>
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const criticalMarker = createPulseIcon('#ef4444');
const highMarker = createPulseIcon('#f59e0b');
const infoMarker = createPulseIcon('#00f2fe');

export default function RiskMap({
  toggles,
  selectedCoords,
  risks,
}: {
  toggles: ToggleState;
  selectedCoords: [number, number] | null;
  risks: RiskItem[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-screen bg-[#070a0f] flex items-center justify-center text-gray-500 font-mono text-xs">
        INITIALIZING TACTICAL RADAR...
      </div>
    );
  }

  const cartoApiKey = 'cb1_484d_1_7657af6c431c080ecd90f9db';
  const tileUrl = `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${cartoApiKey}`;

  const straitOfHormuzRoute: [number, number][] = [
    [26.1, 56.2],
    [25.3, 55.3],
    [24.5, 58.0],
    [22.0, 60.0],
    [15.0, 65.0],
  ];

  const airFlightPath: [number, number][] = [
    [25.27, 55.29],
    [30.04, 31.23],
    [48.85, 2.35],
  ];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        key="tactical-nexus-map-v3"
        center={[22.0, 45.0]}
        zoom={3.5}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '100vh', background: '#070a0f' }}
      >
        <MapController selectedCoords={selectedCoords} />

        {toggles.overlayMap && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
            maxZoom={19}
          />
        )}

        {/* Cyan Maritime Corridor */}
        {toggles.oilRoutes && (
          <>
            <Polyline
              positions={straitOfHormuzRoute}
              pathOptions={{ color: '#00f2fe', weight: 3, dashArray: '8, 12' }}
            />
            <Marker position={[26.1, 56.2]} icon={criticalMarker}>
              <Popup>
                <div className="text-black font-sans text-xs">
                  <strong>Strait of Hormuz Oil Corridor</strong>
                  <p className="text-red-600 font-bold">Status: High Chokepoint Risk</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Rose Airway Corridor */}
        {toggles.airTraffic && (
          <>
            <Polyline
              positions={airFlightPath}
              pathOptions={{ color: '#f43f5e', weight: 3, dashArray: '6, 10' }}
            />
            <Marker position={[30.04, 31.23]} icon={highMarker}>
              <Popup>
                <div className="text-black font-sans text-xs">
                  <strong>Middle-East Flight Corridor</strong>
                  <p className="text-amber-600 font-bold">Status: Rerouted Airway</p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Dynamic Threat Markers */}
        {risks.map((risk) => {
          if (!toggles[risk.category]) return null;
          const markerIcon =
            risk.severity === 'CRITICAL'
              ? criticalMarker
              : risk.severity === 'HIGH'
              ? highMarker
              : infoMarker;

          return (
            <Marker key={risk.id} position={risk.coords} icon={markerIcon}>
              <Popup>
                <div className="text-black font-sans text-xs p-1">
                  <div className="font-bold text-gray-900 border-b pb-1 mb-1">{risk.title}</div>
                  <p className="text-gray-700">{risk.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
