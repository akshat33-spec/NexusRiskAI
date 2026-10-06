"use client";

import React from "react";

export const MascotWidget: React.FC = () => {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="bg-[#2B3B54]/90 backdrop-blur text-white text-[11px] px-3 py-1 rounded-full shadow border border-blue-400/40">
        Support Chat
      </div>
      <div className="w-12 h-12 bg-blue-500/20 border-2 border-cyan-400 rounded-2xl flex items-center justify-center text-cyan-300 font-bold text-xl shadow-lg backdrop-blur cursor-pointer hover:scale-105 transition-transform">
        AI
      </div>
    </div>
  );
};
