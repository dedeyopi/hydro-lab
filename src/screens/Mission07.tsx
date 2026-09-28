import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { UTubeSimulator } from '../components/Illustrations';
import { MissionId } from '../types';

const WATER_DENSITY = 1000;
const FIXED_H1 = 5; // cm
const EXPERIMENT_DENSITIES = [600, 700, 800, 900, 950];

interface Trial {
  density: number;
  h1: number;
  h2: number;
  order: number;
}

const fmt = (n: number, d = 1) => n.toFixed(d).replace('.', ',');

export const Mission07: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { state, savePrediction, addXp, completeMission, addBadge } = useStore();

  // ===== Simulator =====
  const [oilDensity, setOilDensity] = useState(800);
  const [h1, setH1] = useState(5);
  const h2Live = (oilDensity / WATER_DENSITY) * h1;

  // ===== Trials =====
  const trials = useMemo<Trial[]>(() => {
    const keys = Object.keys(state.predictions).filter((k) => k.startsWith('m8_trial_'));
    return keys
      .map((k) => {
        try {
          const t = JSON.parse(state.predictions[k]) as Trial;
          return t && typeof t.density === 'number' ? t : null;
        } catch {
          return null;
        }
      })
      .filter((t): t is Trial => t !== null)
      .sort((a, b) => a.order - b.order);
  }, [state.predictions]);

  const recordedDensities = trials.map((t) => t.density);

  const recordTrial = (density: number) => {
    if (recordedDensities.includes(density)) return;
    const h2 = (density / WATER_DENSITY) * FIXED_H1;
    const order = trials.length;
    savePrediction(
      `m8_trial_${order}`,
      JSON.stringify({ density, h1: FIXED_H1, h2, order })
    );
    addXp(20);
  };

  // ===== Prediction & reveal =====
  const initialPrediction = state.predictions['m8_initial'] ?? '';
  const patternRevealed = state.predictions['m8_revealed'] === '1';

  const revealPattern = () => {
    if (patternRevealed) return;
    savePrediction('m8_revealed', '1');
    addXp(20);
  };

  // ===== Application =====
  const [appAnswer, setAppAnswer] = useState(state.predictions['m8_app'] ?? '');
  const [appChecked, setAppChecked] = useState(
    state.predictions['m8_app_checked'] === '1'
  );

  const correctApp = 750; // kg/m³

  const checkApp = () => {
    if (appChecked) return;
    const num = parseFloat(appAnswer.replace(/[^\d.-]/g, ''));
    const correct = Math.abs(num - correctApp) <= 30;
    savePrediction('m8_app', appAnswer);
    savePrediction('m8_app_checked', '1');
    setAppChecked(true);
    if (correct) addXp(30);
  };

  const finish = () => {
    completeMission(7 as MissionId);
    addBadge('🧪 Density Detective');
    onComplete();
  };

  const canFinish =
    initialPrediction &&
    trials.length >= 4 &&
    patternRevealed &&
    appChecked;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
  MISI 07 · ELABORATE
    </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800">
          Detektif Massa Jenis
        </h1>
        <p className="text-slate-600 mt-2">
          Bagaimana kita dapat menentukan massa jenis suatu cairan hanya dengan mengukur
          ketinggiannya di dalam pipa U? Ayo selidiki!
        </p>
      </div>

      {/* =====================================================
          SECTION 1 — FENOMENA & PREDIKSI AWAL
      ===================================================== */}
      <Card className="mb-6">
        <div className="flex items-start gap-2 mb-3">
          <span className="text-2xl" aria-hidden>🌊</span>
          <div>
            <h2 className="font-bold text-slate-800">Fenomena</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Sebuah pipa U diisi air, lalu dituangkan minyak dari salah satu sisi. Minyak dan
              air tidak bercampur — minyak mengapung di atas air.
            </p>
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-700 mb-3">
          🔮 Menurutmu, bagaimana ketinggian permukaan minyak dibandingkan permukaan air?
        </p>

        {!initialPrediction ? (
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { id: 'A', label: 'Permukaan minyak sama tinggi dengan permukaan air' },
              { id: 'B', label: 'Permukaan minyak lebih tinggi daripada permukaan air' },
              { id: 'C', label: 'Permukaan minyak lebih rendah daripada permukaan air' },
              { id: 'D', label: 'Keduanya tumpah keluar dari pipa' },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  savePrediction('m8_initial', o.id);
                  addXp(10);
                }}
                className="text-left p-3 rounded-xl border-2 font-semibold bg-white border-sky-100 hover:border-sky-400 hover:shadow-md transition"
              >
                <span className="font-bold mr-2 text-sky-700">{o.id}.</span>
                {o.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <p className="font-bold mb-1">📝 Prediksimu tercatat.</p>
            Sekarang kita buktikan lewat simulasi interaktif di bawah. Perhatikan mana yang
            lebih tinggi: <strong>minyak</strong> atau <strong>air</strong>?
          </div>
        )}
      </Card>

      {/* =====================================================
          SECTION 2 — SIMULATOR INTERAKTIF
      ===================================================== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-3">🧪 Simulator Pipa U</h2>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="aspect-[520/400] w-full">
            <UTubeSimulator oilDensity={oilDensity} oilHeightCm={h1} />
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="m8-density"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Massa Jenis Minyak:{' '}
                <span className="text-sky-700 font-bold">{oilDensity} kg/m³</span>
              </label>
              <input
                id="m8-density"
                type="range"
                min="600"
                max="950"
                step="10"
                value={oilDensity}
                onChange={(e) => setOilDensity(parseInt(e.target.value))}
                className="w-full accent-sky-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Massa jenis air = 1000 kg/m³ (tetap)
              </p>
            </div>

            <div>
              <label
                htmlFor="m8-h1"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Tinggi Kolom Minyak (h₁):{' '}
                <span className="text-sky-700 font-bold">{h1} cm</span>
              </label>
              <input
                id="m8-h1"
                type="range"
                min="3"
                max="8"
                step="0.5"
                value={h1}
                onChange={(e) => setH1(parseFloat(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 font-semibold">ρ minyak</div>
                <div className="font-black text-amber-700">{oilDensity}</div>
                <div className="text-[10px] text-slate-400">kg/m³</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 font-semibold">h₁</div>
                <div className="font-black text-amber-700">{fmt(h1)}</div>
                <div className="text-[10px] text-slate-400">cm</div>
              </div>
              <div className="bg-sky-50 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 font-semibold">h₂</div>
                <div className="font-black text-sky-700">{fmt(h2Live)}</div>
                <div className="text-[10px] text-slate-400">cm</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white">
              <p className="text-xs opacity-85 mb-1">Kesetimbangan di garis batas:</p>
              <p className="text-sm font-mono">
                ρ<sub>minyak</sub> · h₁ = ρ<sub>air</sub> · h₂
              </p>
              <p className="text-sm font-mono mt-1 text-white/90">
                {oilDensity} × {fmt(h1)} = {WATER_DENSITY} × {fmt(h2Live)}
              </p>
              <p className="text-sm font-mono mt-1 text-yellow-200">
                {(oilDensity * h1).toLocaleString('id-ID')} = {(WATER_DENSITY * h2Live).toLocaleString('id-ID')}
              </p>
            </div>

            <p className="text-xs text-slate-500 italic">
              💡 Karena minyak lebih ringan (massa jenis lebih kecil), kolom minyak harus{' '}
              <strong>lebih tinggi</strong> agar dapat menyeimbangkan kolom air.
            </p>
          </div>
        </div>
      </Card>

      {/* =====================================================
          SECTION 3 — EKSPERIMEN: MENGUMPULKAN DATA
      ===================================================== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-2">📏 Eksperimen: Kumpulkan Data</h2>
        <p className="text-sm text-slate-600 mb-4">
          Ukur tinggi kolom air (h₂) untuk berbagai massa jenis minyak. Kolom minyak dibuat tetap
          h₁ = <strong>5 cm</strong>.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {EXPERIMENT_DENSITIES.map((d) => {
            const done = recordedDensities.includes(d);
            const h2 = (d / WATER_DENSITY) * FIXED_H1;
            return (
              <button
                key={d}
                onClick={() => recordTrial(d)}
                disabled={done}
                className={`p-3 rounded-xl border-2 text-center transition ${
                  done
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-800 cursor-default'
                    : 'bg-white border-sky-100 hover:border-sky-400 hover:shadow-md'
                }`}
              >
                <div className="text-xs text-slate-500 font-semibold">ρ = {d}</div>
                <div className="text-[10px] text-slate-400 mb-1">kg/m³</div>
                <div className="font-black text-sky-700 text-sm">
                  {done ? `h₂ = ${fmt(h2)} cm` : '📏 UKUR'}
                </div>
                {done && <div className="text-[10px] text-cyan-600 mt-0.5">✓ tercatat</div>}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-xl border border-sky-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-sky-100">
              <tr>
                <th className="text-left px-3 py-2 font-bold text-sky-800 w-10">#</th>
                <th className="text-left px-3 py-2 font-bold text-sky-800">ρ minyak (kg/m³)</th>
                <th className="text-right px-3 py-2 font-bold text-sky-800">h₁ (cm)</th>
                <th className="text-right px-3 py-2 font-bold text-sky-800">h₂ (cm)</th>
                <th className="text-right px-3 py-2 font-bold text-sky-800">ρ·h₁</th>
                <th className="text-right px-3 py-2 font-bold text-sky-800">1000·h₂</th>
              </tr>
            </thead>
            <tbody>
              {trials.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-6">
                    Belum ada data. Klik tombol UKUR di atas.
                  </td>
                </tr>
              )}
              {trials.map((t, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-sky-50/40'}>
                  <td className="px-3 py-2 text-slate-400 font-mono text-xs">{i + 1}</td>
                  <td className="px-3 py-2 font-semibold">{t.density}</td>
                  <td className="px-3 py-2 text-right">{fmt(t.h1)}</td>
                  <td className="px-3 py-2 text-right font-bold text-sky-700">{fmt(t.h2)}</td>
                  <td className="px-3 py-2 text-right font-mono text-amber-700">
                    {(t.density * t.h1).toLocaleString('id-ID')}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-cyan-700">
                    {(WATER_DENSITY * t.h2).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Data terkumpul: <b>{trials.length}/5</b> — butuh minimal 4 untuk melanjutkan.
          </p>
        </div>
      </Card>

      {/* =====================================================
          SECTION 4 — TEMUKAN POLA
      ===================================================== */}
      {trials.length >= 4 && (
        <Card className="mb-6 animate-fade-in">
          <h2 className="font-bold text-slate-800 mb-3">🔎 Temukan Polanya</h2>
          <p className="text-sm text-slate-700 mb-4">
            Amati kolom <strong>ρ·h₁</strong> dan <strong>1000·h₂</strong> di tabel. Apa yang
            kamu lihat?
          </p>

          {!patternRevealed ? (
            <Button onClick={revealPattern}>🔓 Ungkapkan Pola</Button>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
                <p className="font-bold mb-1">✨ Pola yang ditemukan:</p>
                Nilai <strong>ρ·h₁</strong> pada kolom minyak <strong>selalu sama</strong> dengan
                nilai <strong>1000·h₂</strong> pada kolom air. Artinya:
              </div>

              <div className="text-center py-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                <p className="text-sm opacity-90">Hubungan Kesetimbangan Pipa U</p>
                <p className="text-4xl md:text-5xl font-black mt-2 tracking-tight">
                  ρ₁ h₁ = ρ₂ h₂
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 max-w-md mx-auto text-xs">
                  <div className="bg-white/15 rounded-lg p-2">
                    <b>ρ₁, h₁</b> = massa jenis & tinggi fluida 1
                  </div>
                  <div className="bg-white/15 rounded-lg p-2">
                    <b>ρ₂, h₂</b> = massa jenis & tinggi fluida 2
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-slate-700">
                <p className="font-bold text-sky-800 mb-1">🤔 Mengapa?</p>
                Karena pada garis batas antara kedua fluida, tekanan dari kedua kolom harus{' '}
                <strong>sama besar</strong>. Tekanan kolom fluida sebanding dengan ρ·h — fluida
                yang lebih ringan harus lebih tinggi agar tekanannya setara.
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-sm text-purple-900">
                <p className="font-bold mb-1">🔬 Kegunaan praktis:</p>
                Jika kita tahu massa jenis salah satu fluida (misal air, 1000 kg/m³) dan mengukur
                h₁ dan h₂, kita dapat <strong>menentukan massa jenis fluida lain</strong> tanpa
                alat ukur khusus!
              </div>
            </div>
          )}
        </Card>
      )}

      {/* =====================================================
          SECTION 5 — APLIKASI: DETEKTIF
      ===================================================== */}
      {patternRevealed && (
        <Card className="mb-6 animate-fade-in">
          <h2 className="font-bold text-slate-800 mb-3">🕵️ Tantangan Detektif</h2>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-sm text-slate-700">
            <p className="mb-2">
              Seorang siswa menemukan cairan misterius di laboratorium. Ia menuangkannya ke dalam
              pipa U yang sudah berisi air. Hasil pengukuran:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tinggi kolom cairan misterius: <b>h₁ = 6 cm</b></li>
              <li>Tinggi kolom air di sisi lain: <b>h₂ = 4,5 cm</b></li>
              <li>Massa jenis air: <b>ρ_air = 1000 kg/m³</b></li>
            </ul>
          </div>

          <p className="font-semibold text-slate-800 mb-2">
            Berapakah massa jenis cairan misterius tersebut?
          </p>

          {!appChecked ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={appAnswer}
                onChange={(e) => setAppAnswer(e.target.value)}
                placeholder="Ketik jawabanmu (kg/m³)"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-sky-100 bg-white focus:border-sky-400 focus:outline-none"
              />
              <Button onClick={checkApp} disabled={!appAnswer.trim()}>
                ✓ Periksa
              </Button>
            </div>
          ) : (
            <div
              className={`p-4 rounded-xl text-sm ${
                Math.abs(parseFloat(appAnswer.replace(/[^\d.-]/g, '')) - correctApp) <= 30
                  ? 'bg-cyan-50 border border-cyan-200 text-cyan-900'
                  : 'bg-amber-50 border border-amber-200 text-amber-900'
              }`}
            >
              <p className="font-bold mb-1">
                {Math.abs(parseFloat(appAnswer.replace(/[^\d.-]/g, '')) - correctApp) <= 30
                  ? '🎯 Detektif hebat! Jawabanmu tepat.'
                  : '🔍 Belum tepat, tapi bukan masalah.'}
              </p>
              <p className="mb-2">
                Massa jenis cairan misterius = <b>750 kg/m³</b>
              </p>
              <div className="text-xs bg-white/60 rounded-lg p-3 font-mono">
                ρ₁ = ρ₂ · h₂ / h₁ = 1000 × 4,5 / 6 = <b>750 kg/m³</b>
              </div>
              <p className="mt-2 text-xs">
                Nilai ini mendekati massa jenis <strong>alkohol/aseton</strong> — cairan yang
                lebih ringan dari air.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* =====================================================
          TOMBOL SELESAI
      ===================================================== */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {!canFinish && (
          <p className="text-xs text-slate-500">
            💡 Selesaikan semua langkah di atas untuk mengakhiri misi ini.
          </p>
        )}
        <div className="sm:ml-auto">
          <Button size="lg" disabled={!canFinish} onClick={finish}>
            Selesaikan Misi Bonus ✓
          </Button>
        </div>
      </div>
    </div>
  );
};