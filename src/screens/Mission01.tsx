import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { DiverScene } from '../components/Illustrations';
import { MissionId } from '../types';

const OPTIONS = [
  { id: 'A', label: 'Tekanan semakin kecil' },
  { id: 'B', label: 'Tekanan tetap' },
  { id: 'C', label: 'Tekanan semakin besar' },
  { id: 'D', label: 'Tekanan menjadi nol' },
];

export const Mission01: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { state, savePrediction, addXp, completeMission, addBadge } = useStore();
  const [depth, setDepth] = useState(1);
  const [selected, setSelected] = useState(state.predictions['m1_depth'] ?? '');

  const handleSelect = (id: string) => {
    if (state.predictions['m1_depth']) return;
    setSelected(id);
    savePrediction('m1_depth', id);
    addXp(10);
  };

  const finish = () => {
    completeMission(1 as MissionId);
    addBadge('🌊 Hydro Explorer');
    onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          MISI 01 · ENGAGE
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">Misteri Penyelam</h1>
        <p className="text-slate-600 mt-2">
          Amati fenomena berikut dengan cermat, lalu buatlah prediksimu.
        </p>
      </div>

     <Card className="!p-0 overflow-hidden mb-6">
  <div className="aspect-[16/9] w-full">
    <DiverScene depth={depth} />
  </div>
</Card>

      <Card className="mb-6">
        <p className="text-slate-700 leading-relaxed">
          Seorang penyelam berada di permukaan laut. Ia kemudian menyelam semakin dalam.
        </p>
        <label htmlFor="depth-slider" className="block text-sm font-semibold text-slate-700 mt-4 mb-1">
          Atur kedalaman penyelam:
          <span className="text-sky-700 ml-1 font-bold">{depth.toFixed(1)} m</span>
        </label>
        <input
          id="depth-slider"
          type="range"
          min="0.5"
          max="7"
          step="0.5"
          value={depth}
          onChange={(e) => setDepth(parseFloat(e.target.value))}
          className="w-full accent-sky-500"
        />
      </Card>

      <Card className="mb-6 !bg-sky-50 !border-sky-200">
        <h2 className="font-bold text-slate-800 mb-1">❓ Pertanyaan Penyelidikan</h2>
        <p className="text-slate-700">
          Menurutmu, apakah tekanan air yang dialami penyelam tetap sama?
          Apa yang terjadi jika penyelam turun lebih dalam?
        </p>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {OPTIONS.map((o) => {
          const isSelected = selected === o.id;
          const locked = !!state.predictions['m1_depth'];
          return (
            <button
              key={o.id}
              onClick={() => handleSelect(o.id)}
              disabled={locked && !isSelected}
              className={`text-left p-4 rounded-2xl border-2 transition ${
                isSelected
                  ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white border-transparent shadow-lg'
                  : 'bg-white border-sky-100 hover:border-sky-300'
              } ${locked && !isSelected ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {o.id}
                </span>
                <span className="font-semibold">{o.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {state.predictions['m1_depth'] && (
        <Card className="!bg-amber-50 !border-amber-200">
          <p className="font-bold text-amber-800">📝 Prediksimu sudah dicatat.</p>
          <p className="text-amber-900 text-sm mt-1">
            Untuk mengetahui jawabannya, kita perlu melakukan eksperimen.
          </p>
        </Card>
      )}

      <div className="mt-8 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          Jawaban belum akan diungkap sekarang.
        </div>
        <Button
          size="lg"
          disabled={!state.predictions['m1_depth']}
          onClick={finish}
        >
          Masuk ke Laboratorium →
        </Button>
      </div>
    </div>
  );
};