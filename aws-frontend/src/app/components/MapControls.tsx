'use client';

export interface MapLayersState {
  oilRoutes: boolean;
  airTraffic: boolean;
  geopoliticalEvents: boolean;
  overlayMap: boolean;
}

interface MapControlsProps {
  layers: MapLayersState;
  setLayers: React.Dispatch<React.SetStateAction<MapLayersState>>;
}

export default function MapControls({ layers, setLayers }: MapControlsProps) {
  const toggleLayer = (key: keyof MapLayersState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="absolute top-12 left-4 z-20 w-64 bg-[#0a0e17]/90 backdrop-blur-md border border-gray-800 rounded-lg p-3 shadow-xl text-xs">
      <div className="space-y-2.5">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-gray-200 font-medium">Oil Routes</span>
          <input
            type="checkbox"
            checked={layers.oilRoutes}
            onChange={() => toggleLayer('oilRoutes')}
            className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-gray-200 font-medium">Air Traffic</span>
          <input
            type="checkbox"
            checked={layers.airTraffic}
            onChange={() => toggleLayer('airTraffic')}
            className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-gray-200 font-medium">Geopolitical Events</span>
          <input
            type="checkbox"
            checked={layers.geopoliticalEvents}
            onChange={() => toggleLayer('geopoliticalEvents')}
            className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-gray-200 font-medium">Overlay Map</span>
          <input
            type="checkbox"
            checked={layers.overlayMap}
            onChange={() => toggleLayer('overlayMap')}
            className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
