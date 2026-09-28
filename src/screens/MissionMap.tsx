import React from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { MISSION_INFO } from '../utils';
import { MissionId } from '../types';

export const MissionMapScreen: React.FC<{ onSelect: (id: MissionId) => void; onTeacher: () => void }> = ({ onSelect, onTeacher }) => {
  const { state } = useStore();

  const isUnlocked = (id: MissionId) => {
    if (state.teacherMode) return true;
    if (id === 1) return true;
    return state.completedMissions.includes((id - 1) as MissionId);
  };

  const missions = ([1, 2, 3, 4, 5, 6, 7, 8] as MissionId[]).map((id) => ({
    id,
    ...MISSION_INFO[id],
    completed: state.completedMissions.includes(id),
    unlocked: isUnlocked(id),
  }));

  const allDone = state.completedMissions.filter((id) => id !== 8).length >= 7;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800">PETA MISI</h1>
        <p className="text-slate-600 mt-2">
          Selesaikan misi secara berurutan untuk membuka misi berikutnya.
        </p>
        <div className="mt-3 inline-flex items-center gap-3 bg-white border border-sky-100 rounded-full px-4 py-2">
          <span className="text-xs font-semibold text-slate-500">Progres</span>
          <span className="font-bold text-sky-700">
            {state.completedMissions.length}/8 misi selesai
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {missions.map((m) => (
          <Card
            key={m.id}
            className={`relative overflow-hidden transition-all ${
              m.unlocked ? 'hover:shadow-xl hover:-translate-y-0.5 cursor-pointer' : 'opacity-60'
            } ${m.completed ? '!border-cyan-300 !bg-cyan-50/60' : ''}`}
          >
            <button
              disabled={!m.unlocked}
              onClick={() => m.unlocked && onSelect(m.id)}
              className="absolute inset-0 w-full h-full text-left"
              aria-label={`Misi ${m.id}: ${m.title}`}
            >
              <span className="sr-only">Buka misi</span>
            </button>
            <div className="relative flex items-start gap-4 pointer-events-none">
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                  m.completed
                    ? 'bg-gradient-to-br from-cyan-400 to-sky-600 text-white'
                    : m.unlocked
                    ? 'bg-gradient-to-br from-sky-400 to-cyan-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {m.completed ? '✓' : String(m.id).padStart(2, '0')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold tracking-widest text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                    {m.phase}
                  </span>
                  <span className="text-[10px] text-slate-500">⏱ {m.duration}</span>
                </div>
                <h3 className="font-bold text-slate-800 mt-1.5 text-lg leading-tight">
                  {m.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{m.desc}</p>
                {!m.unlocked && (
                  <p className="text-xs text-slate-500 mt-2 font-semibold">
                    🔒 Selesaikan misi sebelumnya
                  </p>
                )}
                {m.completed && (
                  <p className="text-xs text-cyan-700 mt-2 font-semibold">✓ Selesai</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {allDone && (
        <div className="mt-8 text-center">
          <Button size="lg" onClick={() => onSelect(8)}>
            Lanjut ke Hydro Challenge →
          </Button>
        </div>
      )}

      <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" size="sm" onClick={onTeacher}>
          👩‍🏫 Mode Guru / Demo
        </Button>
      </div>
    </div>
  );
};