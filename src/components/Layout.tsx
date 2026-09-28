import React from 'react';
import { useStore } from '../store';
import { ProgressBar } from './UI';

export const TopBar: React.FC<{ onHome: () => void; onMap: () => void }> = ({ onHome, onMap }) => {
  const { state } = useStore();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-lg bg-white/70 border-b border-sky-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <button onClick={onHome} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition">
            💧
          </div>
          <span className="font-bold text-slate-800 hidden sm:inline">HYDRO LAB</span>
        </button>
        <nav className="flex items-center gap-2 ml-2">
          <button onClick={onMap} className="text-sm font-semibold text-sky-700 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition">
            Peta Misi
          </button>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {state.profile && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-slate-500">HYDRO INVESTIGATOR</span>
              <span className="text-sm font-bold text-slate-800">
                {state.profile.name} · {state.profile.className}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
            <span className="text-amber-500" aria-hidden>⭐</span>
            <span className="text-sm font-bold text-amber-700">{state.xp} XP</span>
          </div>
        </div>
      </div>
      <ProgressBar value={state.completedMissions.length} max={7} className="!h-1 !rounded-none" />
    </header>
  );
};

<button
  onClick={() => {
    // Navigasi ke about — perlu pass callback dari parent
  }}
  className="text-sm font-semibold text-sky-700 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition"
>
  ℹ️ Tentang
</button>

export const BubbleBackground: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden>
    {Array.from({ length: 14 }).map((_, i) => {
      const left = (i * 7.3) % 100;
      const size = 6 + ((i * 3) % 16);
      const delay = (i * 0.7) % 6;
      const duration = 7 + ((i * 1.3) % 6);
      return (
        <span
          key={i}
          className="bubble absolute rounded-full bg-white/50 border border-white/70"
          style={{
            left: `${left}%`,
            bottom: '-20px',
            width: size,
            height: size,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      );
    })}
  </div>
);