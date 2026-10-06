import React from 'react';

interface FloatingPanelProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({ children, title, className = "" }) => {
  return (
    <div className={`absolute z-10 p-4
                bg-black/70 backdrop-blur-xl
                border border-cyan-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]
                text-cyan-400 font-mono ${className}`}
                style={{ clipPath: 'polygon(0 0, 95% 0, 100% 10%, 100% 100%, 5% 100%, 0 90%)' }}>
      <div className="text-[10px] uppercase tracking-[0.2em] border-b border-cyan-500/30 pb-2 mb-4 flex justify-between items-center">
        <span className="font-bold text-white/80">{title}</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_#00F0FF]"></span>
          <span className="text-cyan-400 font-black">SENTRY ACTIVE</span>
        </span>
      </div>
      {children}
    </div>
  );
};
