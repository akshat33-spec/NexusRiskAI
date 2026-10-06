"use client";

import React from "react";

export interface RiskItem {
  id: string;
  company: string;
  tag: string;
  description: string;
}

interface RiskFeedPanelProps {
  risks?: RiskItem[];
}

export const RiskFeedPanel: React.FC<RiskFeedPanelProps> = ({ risks = [] }) => {
  return (
    <div className="flex flex-col w-full divide-y divide-gray-800 bg-[#080C14]">
      {risks.map((risk) => (
        <div key={risk.id} className="p-3.5 hover:bg-[#0D1420] transition-colors cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-xs tracking-wider text-white font-mono uppercase">
              {risk.company}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded font-mono bg-[#1E2D42] text-cyan-200 border border-cyan-700/50">
              {risk.tag}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-gray-200 font-sans">
            {risk.description}
          </p>
        </div>
      ))}
    </div>
  );
};
