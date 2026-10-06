"use client";

import React from 'react';

interface Props {
    onScan: () => void;
    status: string;
}

export const TelemetryHeader: React.FC<Props> = ({ onScan, status }) => {
    return (
        <header className="h-16 w-full z-30 flex justify-between items-center
                         px-8 bg-black/80 backdrop-blur-md border-b border-cyan-500/30
                         text-white font-sans relative overflow-hidden">

            {/* Background accent glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-cyan-500/20 blur-sm" />

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#00F0FF]" />
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">
                        Nexus<span className="text-cyan-400">Risk</span> AI
                    </h1>
                </div>

                <div className="h-4 w-px bg-white/20" />

                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">System Status:</span>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">
                        {status}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onScan}
                    className="group relative px-5 py-2 bg-cyan-500/10 border border-cyan-500/50
                               text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all
                               text-xs font-bold uppercase tracking-widest rounded-sm overflow-hidden"
                >
                    <span className="relative z-10">Re-Scan Data</span>
                    <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                </button>

                <button className="px-5 py-2 border border-white/20 text-white hover:bg-white/10 transition-all
                                   text-xs font-bold uppercase tracking-widest rounded-sm">
                    Export Report
                </button>
            </div>
        </header>
    );
};
