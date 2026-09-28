import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { MissionId } from '../types';

export const Mission04: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { state, addXp, completeMission, savePrediction } = useStore();
  const [active, setActive] = useState<'rho' | 'g' | 'h' | null>(null);

  // ✅ FIX: revealed disimpan di store (persisted), bukan useState lokal
  const revealed = state.predictions['m4_revealed'] === '1';

  const reveal = () => {
    if (revealed) return;
    savePrediction('m4_revealed', '1');
    addXp(20);
  };

  const finish = () => {
    completeMission(4 as MissionId);
    savePrediction('m4_done', '1');
    addXp(20);
    onComplete();
  };

  const explanations = {
    rho: 'Pada kedalaman yang sama, fluida dengan massa jenis (ρ) lebih besar menghasilkan tekanan hidrostatis yang lebih besar.',
    g: 'Semakin besar percepatan gravitasi (g), semakin besar tekanan hidrostatis.',
    h: 'Jika kedalaman (h) bertambah, tekanan hidrostatis bertambah.',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          MISI 04 · EXPLAIN
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">
          Temukan Polanya
        </h1>
        <p className="text-slate-600 mt-2">
          Sekarang kita susun penjelasan ilmiahnya berdasarkan bukti eksperimen.
        </p>
      </div>

      {/* KARTU VARIABEL */}
      <Card className="mb-6">
        <p className="text-slate-700">
          Dari eksperimen tadi, apa saja faktor yang tampaknya memengaruhi tekanan hidrostatis?
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {[
            { id: 'h', symbol: 'h', name: 'Kedalaman', unit: 'meter (m)', color: 'from-sky-400 to-cyan-500' },
            { id: 'rho', symbol: 'ρ', name: 'Massa Jenis Fluida', unit: 'kg/m³', color: 'from-cyan-400 to-teal-500' },
            { id: 'g', symbol: 'g', name: 'Percepatan Gravitasi', unit: 'm/s²', color: 'from-blue-400 to-indigo-500' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f.id as any)}
              className={`text-left p-4 rounded-2xl border-2 transition ${
                active === f.id
                  ? 'border-transparent bg-gradient-to-br text-white shadow-lg ' + f.color
                  : 'bg-white border-sky-100 hover:border-sky-300'
              }`}
            >
              <div className={`text-3xl font-black ${active === f.id ? '' : 'text-sky-600'}`}>
                {f.symbol}
              </div>
              <div className="font-bold mt-1">{f.name}</div>
              <div className={`text-xs mt-0.5 ${active === f.id ? 'text-white/80' : 'text-slate-500'}`}>
                {f.unit}
              </div>
            </button>
          ))}
        </div>
        {active && (
          <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-slate-700">
            {explanations[active]}
          </div>
        )}
      </Card>

      {/* MENUJU RUMUS */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-3">🧩 Menuju Rumus</h2>
        <p className="text-slate-700 text-sm">
          Data eksperimen menunjukkan bahwa tekanan meningkat ketika kedalaman bertambah.
          Tekanan juga dipengaruhi oleh massa jenis fluida dan percepatan gravitasi.
          Bagaimana kita menuliskan hubungan ini secara matematis?
        </p>

        <button
          onClick={reveal}
          disabled={revealed}
          className={`mt-4 w-full sm:w-auto px-5 py-3 rounded-xl font-bold shadow-lg transition ${
            revealed
              ? 'bg-emerald-100 text-emerald-700 cursor-default'
              : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:shadow-xl'
          }`}
        >
          {revealed ? '✓ Rumus sudah ditemukan' : '🔓 Ungkapkan Rumus P = ρgh'}
        </button>

        {revealed && (
          <div className="mt-6 text-center py-8 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white animate-fade-in">
            <p className="text-sm opacity-80">Rumus Tekanan Hidrostatis</p>
            <p className="text-6xl md:text-7xl font-black mt-2 tracking-tight">P = ρgh</p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto text-left text-sm">
              <div className="bg-white/15 rounded-lg p-2"><b>P</b> = tekanan hidrostatis (Pa)</div>
              <div className="bg-white/15 rounded-lg p-2"><b>ρ</b> = massa jenis (kg/m³)</div>
              <div className="bg-white/15 rounded-lg p-2"><b>g</b> = gravitasi (m/s²)</div>
              <div className="bg-white/15 rounded-lg p-2"><b>h</b> = kedalaman (m)</div>
            </div>
          </div>
        )}
      </Card>

      {/* CATATAN ILMIAH */}
      <Card className="!bg-amber-50 !border-amber-200">
        <h3 className="font-bold text-amber-900 mb-1">📌 Catatan Ilmiah</h3>
        <p className="text-sm text-amber-900">
          P = ρgh adalah <strong>tekanan hidrostatis</strong>, yaitu tekanan yang disebabkan
          oleh berat fluida di atas suatu titik. Jika permukaan fluida terbuka dan terpapar
          atmosfer, tekanan totalnya adalah P<sub>total</sub> = P<sub>atm</sub> + ρgh.
          Untuk pembelajaran ini, kita fokus pada tekanan hidrostatis.
        </p>
      </Card>

      {/* TOMBOL LANJUT + HINT */}
      <div className="mt-8">
        {!revealed && (
          <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2 text-sm text-amber-900">
            <span className="text-lg" aria-hidden>💡</span>
            <span>
              Untuk melanjutkan, klik tombol <b>🔓 Ungkapkan Rumus P = ρgh</b> di atas
              terlebih dahulu — inilah momen penemuan rumusmu!
            </span>
          </div>
        )}
        <div className="flex justify-end">
          <Button size="lg" disabled={!revealed} onClick={finish}>
            Lanjut ke Laboratorium Fluida →
          </Button>
        </div>
      </div>
    </div>
  );
};