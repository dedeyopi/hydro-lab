import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { DamIllustration, WaterTowerIllustration } from '../components/Illustrations';
import { MissionId } from '../types';
import { calculatePressure, formatPressure } from '../utils';

export const Mission06: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { addXp, completeMission, addBadge, savePrediction } = useStore();

  // Dam question
  const [damAnswer, setDamAnswer] = useState('');
  // Guided calculation
  const [step, setStep] = useState(0);
  const [waterLevel, setWaterLevel] = useState(0.7);
  const [applicationIndex, setApplicationIndex] = useState(0);

  const rho = 1025, g = 10, h = 20;
  const pressure = calculatePressure(rho, g, h);

  const damOptions = [
    { id: 'A', label: 'Air di bawah memiliki suhu lebih tinggi.' },
    { id: 'B', label: 'Tekanan air semakin besar dengan kedalaman.' },
    { id: 'C', label: 'Air hanya menekan bagian bawah.' },
    { id: 'D', label: 'Gravitasi tidak bekerja di bagian atas.' },
  ];

  const applications = [
    { icon: '🌊', title: 'Bendungan', desc: 'Dinding bendungan dibuat lebih tebal di bagian bawah untuk menahan tekanan hidrostatis yang lebih besar.', q: 'Mengapa bagian bawah bendungan lebih tebal?' },
    { icon: '🤿', title: 'Penyelaman', desc: 'Penyelam harus naik perlahan agar tubuh beradaptasi dengan perubahan tekanan.', q: 'Mengapa penyelam tidak boleh naik terlalu cepat?' },
    { icon: '🚢', title: 'Kapal Selam', desc: 'Lambung kapal selam dirancang menahan tekanan pada kedalaman tertentu.', q: 'Apa yang membatasi kedalaman maksimum kapal selam?' },
    { icon: '🏊', title: 'Kolam Renang', desc: 'Bagian kolam yang dalam memiliki tekanan lebih besar pada dindingnya.', q: 'Mengapa dinding kolam dalam lebih kuat?' },
    { icon: '💧', title: 'Menara Air', desc: 'Semakin tinggi posisi air, semakin besar tekanan di pipa bawah.', q: 'Bagaimana ketinggian menara memengaruhi tekanan air?' },
    { icon: '🚰', title: 'Tandon Air', desc: 'Tandon diletakkan tinggi agar air mengalir dengan tekanan cukup ke rumah.', q: 'Mengapa tandon diletakkan di atap?' },
    { icon: '🏗️', title: 'Struktur Bawah Air', desc: 'Pondasi jembatan dan terowongan bawah laut dirancang untuk menahan tekanan besar.', q: 'Faktor apa yang paling menentukan tekanan di dasar laut?' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          MISI 06 · ELABORATE
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">Hydro Engineer</h1>
        <p className="text-slate-600 mt-2">
          Terapkan konsep tekanan hidrostatis pada situasi nyata.
        </p>
      </div>

      {/* Dam */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-3">🏗️ Studi Kasus: Bendungan</h2>
        <div className="rounded-xl overflow-hidden mb-4">
          <DamIllustration />
        </div>
        <p className="text-slate-700 font-semibold mb-3">
          Mengapa bagian bawah bendungan biasanya dibuat lebih kuat dan tebal?
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {damOptions.map((o) => {
            const isSel = damAnswer === o.id;
            return (
              <button
                key={o.id}
                onClick={() => { setDamAnswer(o.id); savePrediction('m6_dam', o.id); if (!damAnswer) addXp(10); }}
                className={`text-left p-3 rounded-xl border-2 font-medium transition ${
                  isSel
                    ? o.id === 'B'
                      ? 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white border-transparent'
                      : 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-white border-sky-100 hover:border-sky-300'
                }`}
              >
                <span className="font-bold mr-2">{o.id}.</span>{o.label}
              </button>
            );
          })}
        </div>
        {damAnswer && (
          <div className={`mt-3 p-4 rounded-xl text-sm ${damAnswer === 'B' ? 'bg-cyan-50 border border-cyan-200 text-cyan-900' : 'bg-amber-50 border border-amber-200 text-amber-900'}`}>
            {damAnswer === 'B'
              ? '✓ Tepat! Tekanan hidrostatis meningkat dengan kedalaman sehingga bagian bawah bendungan menerima tekanan lebih besar.'
              : 'Belum tepat. Ingat P = ρgh. Semakin dalam, semakin besar tekanan. Pilih B.'}
          </div>
        )}
      </Card>

      {/* Water tower */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-2">💧 Menara Air</h2>
        <p className="text-sm text-slate-600 mb-3">
          Ubah ketinggian air dan lihat bagaimana tekanan di titik bawah berubah.
        </p>
        <div className="grid md:grid-cols-2 gap-4 items-center">
          <div className="max-h-[320px]"><WaterTowerIllustration level={waterLevel} /></div>
          <div>
            <label htmlFor="lvl" className="block text-sm font-semibold text-slate-700 mb-2">
              Ketinggian air: <span className="text-sky-700 font-bold">{(waterLevel * 10).toFixed(1)} m</span>
            </label>
            <input id="lvl" type="range" min="0.1" max="1" step="0.05" value={waterLevel} onChange={(e) => setWaterLevel(parseFloat(e.target.value))} className="w-full accent-sky-500" />
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white">
              <div className="text-xs opacity-80">Tekanan di titik bawah</div>
              <div className="text-2xl font-black mt-1">{formatPressure(calculatePressure(1000, 10, waterLevel * 10))}</div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Semakin tinggi permukaan air, semakin besar tekanan hidrostatis di bagian bawah. Itulah sebabnya menara air dibangun tinggi.
            </p>
          </div>
        </div>
      </Card>

      {/* Guided Calculation */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-2">🧮 Perhitungan Terbimbing</h2>
        <p className="text-sm text-slate-600 mb-4">
          Sebuah jendela kapal selam berada pada kedalaman 20 m di air laut (ρ = 1025 kg/m³, g = 10 m/s²).
          Hitung tekanan hidrostatis yang dialami jendela tersebut.
        </p>

        <div className="space-y-3">
          <CalcStep
            num={1}
            title="Identifikasi besaran yang diketahui"
            open={step >= 1}
            onOpen={() => setStep(Math.max(step, 1))}
          >
            <ul className="text-sm space-y-1">
              <li>ρ = 1025 kg/m³</li>
              <li>g = 10 m/s²</li>
              <li>h = 20 m</li>
            </ul>
          </CalcStep>

          <CalcStep num={2} title="Pilih persamaan" open={step >= 2} onOpen={() => setStep(Math.max(step, 2))}>
            <p className="font-mono text-lg font-bold text-sky-700">P = ρgh</p>
          </CalcStep>

          <CalcStep num={3} title="Substitusi nilai" open={step >= 3} onOpen={() => setStep(Math.max(step, 3))}>
            <p className="font-mono text-slate-800">P = 1025 × 10 × 20</p>
          </CalcStep>

          <CalcStep num={4} title="Hitung" open={step >= 4} onOpen={() => setStep(Math.max(step, 4))}>
            <p className="font-mono text-lg font-black text-sky-700">P = {pressure.toLocaleString('id-ID')} Pa = 205 kPa</p>
          </CalcStep>

          <CalcStep num={5} title="Interpretasi" open={step >= 5} onOpen={() => setStep(Math.max(step, 5))}>
            <p className="text-sm text-slate-700">
              Tekanan hidrostatis pada jendela kapal selam di kedalaman 20 m adalah <strong>205.000 Pa (205 kPa)</strong>.
              Karena itu jendela kapal selam harus dibuat dari material yang kuat.
            </p>
          </CalcStep>
        </div>
      </Card>

      {/* Applications */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-3">🌍 Penerapan dalam Kehidupan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {applications.map((a, i) => (
            <button
              key={a.title}
              onClick={() => setApplicationIndex(i)}
              className={`p-3 rounded-xl border-2 transition text-center ${
                applicationIndex === i
                  ? 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white border-transparent'
                  : 'bg-white border-sky-100 hover:border-sky-300'
              }`}
            >
              <div className="text-2xl">{a.icon}</div>
              <div className="text-xs font-bold mt-1">{a.title}</div>
            </button>
          ))}
        </div>
        <div className="p-5 rounded-xl bg-sky-50 border border-sky-200">
          <h3 className="font-bold text-sky-800 text-lg">
            {applications[applicationIndex].icon} {applications[applicationIndex].title}
          </h3>
          <p className="text-sm text-slate-700 mt-2">{applications[applicationIndex].desc}</p>
          <p className="text-sm text-sky-700 font-semibold mt-3">❓ {applications[applicationIndex].q}</p>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={() => { addXp(30); completeMission(6 as MissionId); addBadge('🏗️ Hydro Engineer'); onComplete(); }}>
          Lanjut ke Hydro Challenge →
        </Button>
      </div>
    </div>
  );
};

const CalcStep: React.FC<{
  num: number; title: string; open: boolean; onOpen: () => void; children: React.ReactNode;
}> = ({ num, title, open, onOpen, children }) => (
  <div className={`rounded-xl border-2 transition ${open ? 'border-sky-300 bg-sky-50/50' : 'border-sky-100 bg-white'}`}>
    <button onClick={onOpen} disabled={open} className="w-full flex items-center gap-3 p-3 text-left">
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${open ? 'bg-sky-500 text-white' : 'bg-sky-100 text-sky-700'}`}>
        {open ? '✓' : num}
      </span>
      <span className="font-semibold text-slate-800">{title}</span>
      {!open && <span className="ml-auto text-xs text-sky-600 font-semibold">Buka →</span>}
    </button>
    {open && <div className="px-4 pb-4 pl-14">{children}</div>}
  </div>
);