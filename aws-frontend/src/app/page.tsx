'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const RiskMap = dynamic(() => import('./components/RiskMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-screen bg-[#070a0f] flex items-center justify-center text-gray-500 font-mono text-xs">
      LOADING GEOSPATIAL MAP ENGINE...
    </div>
  ),
});

export interface RiskItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  coords: [number, number];
  category: 'oilRoutes' | 'airTraffic' | 'geopoliticalEvents' | 'overlayMap';
  description: string;
  mitigation: string;
}

const INITIAL_RISKS: RiskItem[] = [
  {
    id: 'sinoquartz',
    title: 'SINOQUARTZ',
    severity: 'CRITICAL',
    coords: [26.1, 56.2],
    category: 'oilRoutes',
    description:
      "Escalating Iran-US tensions and a looming oil supply crisis threaten maritime routes and increase energy costs, exposing SinoQuartz's raw-material imports and export logistics to severe disruption.",
    mitigation: 'Reroute critical shipments via Pacific shipping lines; secure forward fuel contracts.',
  },
  {
    id: 'uslogistics',
    title: 'USLOGISTICS',
    severity: 'HIGH',
    coords: [30.04, 31.23],
    category: 'airTraffic',
    description:
      "Rising fuel prices and Middle-East airspace closures trigger policy changes and higher transportation costs affecting USLogistics' domestic and overseas freight operations.",
    mitigation: 'Optimize air freight schedules and switch short-haul legs to ground rail networks.',
  },
  {
    id: 'taiwanchip',
    title: 'TAIWANCHIP',
    severity: 'CRITICAL',
    coords: [25.27, 55.29],
    category: 'geopoliticalEvents',
    description:
      'Middle-East instability and oil price spikes risk interrupting semiconductor supply chains that rely on Gulf shipping, while regional pressure heightens overall exposure.',
    mitigation: 'Buffer chip inventory at regional hubs; leverage alternate air cargo charters.',
  },
  {
    id: 'eurosteel',
    title: 'EUROSTEEL',
    severity: 'HIGH',
    coords: [24.5, 58.0],
    category: 'oilRoutes',
    description:
      'Rising oil prices and shipping bottlenecks in the Persian Gulf raise raw-material transport costs and delay steel deliveries for Eurosteel.',
    mitigation: 'Source raw steel billets from local European foundries to reduce sea dependency.',
  },
  {
    id: 'indiparts',
    title: 'INDIPARTS',
    severity: 'MODERATE',
    coords: [15.0, 65.0],
    category: 'geopoliticalEvents',
    description:
      'Global oil scarcity and geopolitical tension may modestly increase freight costs for Indian suppliers, though diversified routing mitigates severe impact.',
    mitigation: 'Implement multi-carrier load balancing across South Asian ports.',
  },
];

export default function Home() {
  const [toggles, setToggles] = useState({
    oilRoutes: true,
    airTraffic: true,
    geopoliticalEvents: true,
    overlayMap: true,
  });

  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeMitigation, setActiveMitigation] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([
    'Hello! How can I assist with your supply chain risk analysis today?',
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCardClick = (risk: RiskItem) => {
    setSelectedCoords(risk.coords);
    setActiveMitigation((prev) => (prev === risk.id ? null : risk.id));
  };

  const handleReScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleExport = () => {
    const reportData = JSON.stringify(INITIAL_RISKS, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexusRisk_Report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      `You: ${chatInput}`,
      `AI Assistant: Analyzing tactical parameters for "${chatInput}"...`,
    ]);
    setChatInput('');
  };

  const visibleRisks = INITIAL_RISKS.filter((risk) => toggles[risk.category]);

  const getSeverityBadge = (severity: RiskItem['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'MODERATE':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#05080e] text-white flex flex-col font-sans select-none">
      {/* Top Header */}
      <header className="h-12 border-b border-[#1a2332] bg-[#05080e] px-4 pr-16 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-extrabold italic tracking-wider text-white flex items-center gap-1.5">
            <span className="text-cyan-400 font-normal">🛡️</span> NEXUSRISK AI
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="text-gray-300 tracking-wide">
            ANALYSIS COMPLETE: <strong className="text-cyan-400 font-bold">{visibleRisks.length} RISKS ACTIVE</strong>
          </span>

          <button
            onClick={handleReScan}
            disabled={isScanning}
            className="px-3.5 py-1.5 bg-[#141f30] hover:bg-[#1f2f48] text-white font-semibold rounded-lg border border-cyan-500/40 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className={isScanning ? 'animate-spin' : ''}>🔄</span>
            <span>{isScanning ? 'Scanning...' : 'Re-Scan Data'}</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3.5 py-1.5 bg-[#141f30] hover:bg-[#1f2f48] text-white font-semibold rounded-lg border border-cyan-500/40 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>📄</span>
            <span>Export Report</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-row flex-1 w-full h-[calc(100vh-3rem)] overflow-hidden relative">
        {/* Left Intelligence Feed Panel */}
        <aside className="w-[360px] min-w-[360px] max-w-[360px] border-r border-[#1a2332] bg-[#070b12] overflow-y-auto z-20 shrink-0 flex flex-col relative">
          <div className="p-3 border-b border-[#1a2332] flex items-center justify-between text-xs font-mono tracking-wider text-gray-200 shrink-0 font-semibold">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400">⚠️</span>
              <span>INTELLIGENCE FEED</span>
            </div>
            <span className="text-[10px] text-gray-400">({visibleRisks.length} Active)</span>
          </div>

          <div className="divide-y divide-[#1a2332] text-xs flex-1 overflow-y-auto pb-14">
            {visibleRisks.map((risk) => (
              <div
                key={risk.id}
                onClick={() => handleCardClick(risk)}
                className={`p-4 transition-all cursor-pointer hover:bg-[#0f1828] ${
                  activeMitigation === risk.id ? 'bg-[#0e1726] border-l-2 border-cyan-400' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white tracking-wider font-mono text-xs uppercase">
                      {risk.title}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full border font-mono font-bold ${getSeverityBadge(
                        risk.severity
                      )}`}
                    >
                      {risk.severity}
                    </span>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed text-[11.5px]">{risk.description}</p>

                {activeMitigation === risk.id && (
                  <div className="mt-3 p-2.5 bg-[#081322] border border-cyan-500/40 rounded text-[11px] text-cyan-300 font-mono">
                    <strong className="text-cyan-400">RECOMMENDED MITIGATION:</strong>
                    <p className="mt-1 text-gray-300">{risk.mitigation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-3 left-4 z-30">
            <div className="px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-full shadow-lg flex items-center space-x-1.5 border border-red-400/50">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span>{visibleRisks.length} Active Threats</span>
            </div>
          </div>
        </aside>

        {/* Right Geospatial Map */}
        <section className="relative flex-1 h-full w-full bg-black overflow-hidden">
          <div className="absolute top-3 left-4 z-20 bg-[#090d16]/90 border border-[#1d2b3e] text-cyan-300 text-[10px] font-mono px-3 py-1 rounded shadow-md pointer-events-none tracking-wider">
            REAL-TIME GEOSPATIAL RADAR
          </div>

          {/* Unified Map Controls Overlay */}
          <div className="absolute top-12 left-4 z-20 w-56 bg-[#090d16]/95 border border-[#1d2b3e] rounded-xl p-3.5 shadow-2xl backdrop-blur-md space-y-3 text-xs">
            <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
              DISPLAY LAYERS
            </div>
            {(Object.keys(toggles) as Array<keyof typeof toggles>).map((key) => (
              <div
                key={key}
                onClick={() => handleToggle(key)}
                className="flex items-center justify-between cursor-pointer select-none hover:opacity-80 transition-opacity"
              >
                <span className="text-gray-200 font-medium text-[12px] capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <div
                  className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                    toggles[key] ? 'bg-cyan-500' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${
                      toggles[key] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Left Legend */}
          <div className="absolute bottom-6 left-4 z-20 bg-[#090d16]/95 border border-[#1d2b3e] rounded-xl p-3 shadow-2xl backdrop-blur-md space-y-2 text-[11px] font-mono">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">MAP LEGEND</div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="w-3 h-1 bg-[#00f2fe] rounded"></span>
              <span>Oil Chokepoints</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="w-3 h-1 bg-[#f43f5e] rounded"></span>
              <span>Air Corridors</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Critical Threat</span>
            </div>
          </div>

          {/* Chat Support Drawer */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-2">
            {isChatOpen && (
              <div className="w-80 h-96 bg-[#090d16] border border-[#1d2b3e] rounded-2xl shadow-2xl p-3 flex flex-col justify-between backdrop-blur-md">
                <div className="flex justify-between items-center border-b border-[#1a2332] pb-2 text-xs font-mono font-bold text-cyan-300">
                  <span>🤖 RISK INTELLIGENCE CHAT</span>
                  <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 my-2 text-xs font-mono">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="p-2 rounded bg-[#101b2b] text-gray-200 border border-gray-800">
                      {msg}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about route status..."
                    className="flex-1 bg-black border border-[#1d2b3e] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button type="submit" className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs">
                    Send
                  </button>
                </form>
              </div>
            )}

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-12 h-12 bg-[#1a2b42] hover:bg-[#253d5e] border border-cyan-400/50 rounded-xl flex items-center justify-center text-xl shadow-2xl cursor-pointer hover:scale-105 transition-all"
            >
              🤖
            </button>
          </div>

          <RiskMap toggles={toggles} selectedCoords={selectedCoords} risks={visibleRisks} />
        </section>
      </div>
    </div>
  );
}

