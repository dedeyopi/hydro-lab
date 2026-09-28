import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { WaterTank, CommunicatingVessels } from '../components/Illustrations';
import { MissionId } from '../types';
import { FLUIDS, calculatePressure, formatPressure, getFluidById } from '../utils';

export const Mission05: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { state, addXp, completeMission, savePrediction } = useStore();

  // ====== SIMULATOR UTAMA ======
  const [fluidId, setFluidId] = useState('fresh');
  const [depth, setDepth] = useState(5);
  const [gravity, setGravity] = useState(10);
  const fluid = getFluidById(fluidId);
  const pressure = calculatePressure(fluid.density, gravity, depth);

  // ====== PERCOBAAN 1: PERBANDINGAN FLUIDA ======
  const [comparePrediction, setComparePrediction] = useState(
    state.predictions['m5_cmp'] ?? ''
  );
  const [compareRevealed, setCompareRevealed] = useState(
    state.predictions['m5_cmp_revealed'] === '1'
  );

  // ====== PERCOBAAN 2: PERBANDINGAN KEDALAMAN ======
  const [depthPrediction, setDepthPrediction] = useState(
    state.predictions['m5_dcmp'] ?? ''
  );
  const [depthRevealed, setDepthRevealed] = useState(
    state.predictions['m5_dcmp_revealed'] === '1'
  );

  // ====== BEJANA BERHUBUNGAN ======
  const [commFill, setCommFill] = useState(0.7);
  const [commProbe, setCommProbe] = useState(0.4);
  const commDepthMeters = commProbe * commFill * 3;
  const commPressure = 1000 * 10 * commDepthMeters;
  const commPredicted = state.predictions['m5_comm_pred'];

  // ====== WHAT IF ======
  const [whatIfStep, setWhatIfStep] = useState(0);

  const finish = () => {
    completeMission(5 as MissionId);
    addXp(30);
    onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          MISI 05 · ELABORATE
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">
          Laboratorium Fluida
        </h1>
        <p className="text-slate-600 mt-2">
          Ubah kedalaman, massa jenis, dan gravitasi. Amati pengaruhnya terhadap tekanan.
        </p>
      </div>

      {/* =====================================================
          SIMULATOR UTAMA
      ===================================================== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-4">🧪 Simulator Utama</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-[3/4] max-h-[420px] mx-auto">
            <WaterTank
              fluidColor={fluid.color}
              fluidColorLight={fluid.colorLight}
              probeDepth={depth}
              maxDepth={10}
              arrowIntensity={Math.min(1, depth / 8)}
            />
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Jenis Fluida
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FLUIDS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFluidId(f.id)}
                    className={`p-2.5 rounded-xl border-2 font-bold text-sm transition ${
                      fluidId === f.id
                        ? 'text-white border-transparent shadow-md'
                        : 'bg-white border-sky-100 text-slate-700 hover:border-sky-300'
                    }`}
                    style={
                      fluidId === f.id
                        ? { background: `linear-gradient(135deg, ${f.color}, ${f.colorLight})` }
                        : {}
                    }
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="m5-depth" className="block text-sm font-semibold text-slate-700 mb-1">
                Kedalaman: <span className="text-sky-700 font-bold">{depth} m</span>
              </label>
              <input
                id="m5-depth"
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={depth}
                onChange={(e) => setDepth(parseFloat(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            <div>
              <label htmlFor="m5-g" className="block text-sm font-semibold text-slate-700 mb-1">
                Gravitasi: <span className="text-sky-700 font-bold">{gravity} m/s²</span>
              </label>
              <input
                id="m5-g"
                type="range"
                min="1.6"
                max="12"
                step="0.2"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-sky-50 rounded-xl p-3">
                <div className="text-xs text-slate-500 font-semibold">Massa Jenis (ρ)</div>
                <div className="font-bold text-slate-800">{fluid.density} kg/m³</div>
              </div>
              <div className="bg-cyan-50 rounded-xl p-3">
                <div className="text-xs text-slate-500 font-semibold">Gravitasi (g)</div>
                <div className="font-bold text-slate-800">{gravity} m/s²</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="text-xs text-slate-500 font-semibold">Kedalaman (h)</div>
                <div className="font-bold text-slate-800">{depth} m</div>
              </div>
              <div className="bg-gradient-to-br from-sky-500 to-cyan-600 rounded-xl p-3 text-white">
                <div className="text-xs opacity-80 font-semibold">Tekanan (P)</div>
                <div className="font-black text-lg">{formatPressure(pressure)}</div>
              </div>
            </div>

            <div className="text-xs bg-slate-50 rounded-lg p-3 font-mono text-slate-700 break-words">
              P = ρgh = {fluid.density} × {gravity} × {depth} = {pressure.toLocaleString('id-ID')} Pa
            </div>
          </div>
        </div>
      </Card>

      {/* =====================================================
          PERCOBAAN 1 — PERBANDINGAN FLUIDA (DENSITY)
      ===================================================== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-2">⚖️ Percobaan 1: Perbandingan Fluida</h2>
        <p className="text-sm text-slate-600 mb-4">
          Tiga sensor diletakkan pada kedalaman yang <strong>sama</strong> (3 m) dalam tiga
          fluida berbeda. Menurutmu, apakah tekanan hidrostatisnya sama?
        </p>

        {!comparePrediction ? (
          <div className="flex flex-wrap gap-2">
            {['Sama', 'Berbeda', 'Belum yakin'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setComparePrediction(c);
                  savePrediction('m5_cmp', c);
                  addXp(10);
                }}
                className="px-4 py-2 rounded-xl border-2 font-semibold bg-white border-sky-100 hover:border-sky-300 transition"
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              {FLUIDS.map((f) => {
                const p = calculatePressure(f.density, 10, 3);
                return (
                  <div
                    key={f.id}
                    className="text-center p-3 rounded-xl border-2 bg-white"
                    style={{ borderColor: f.color }}
                  >
                    <div className="text-3xl mb-1">💧</div>
                    <div className="font-bold text-slate-800 text-sm">{f.name}</div>
                    <div className="text-xs text-slate-500">{f.density} kg/m³</div>
                    <div className="mt-2 text-lg font-black text-sky-700">
                      {compareRevealed ? formatPressure(p) : '?'}
                    </div>
                  </div>
                );
              })}
            </div>

            {!compareRevealed ? (
              <Button
                className="mt-4"
                onClick={() => {
                  setCompareRevealed(true);
                  savePrediction('m5_cmp_revealed', '1');
                }}
              >
                🔎 Jalankan Simulasi
              </Button>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-slate-700">
                <strong>Kesimpulan:</strong> Pada kedalaman yang sama, fluida dengan massa jenis
                lebih besar menghasilkan tekanan hidrostatis yang lebih besar. Air laut (1025 kg/m³)
                &gt; air tawar (1000 kg/m³) &gt; minyak (800 kg/m³).
              </div>
            )}
          </>
        )}
      </Card>

      {/* =====================================================
          PERCOBAAN 2 — PERBANDINGAN KEDALAMAN
      ===================================================== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-2">🔽 Percobaan 2: Perbandingan Kedalaman</h2>
        <p className="text-sm text-slate-600 mb-3">
          Dua probe dalam fluida yang sama. Probe A di 2 m, Probe B di 5 m. Probe mana yang
          mengalami tekanan lebih besar?
        </p>

        {!depthPrediction ? (
          <div className="flex gap-2 flex-wrap">
            {['Probe A (2 m)', 'Probe B (5 m)', 'Sama besar'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setDepthPrediction(c);
                  savePrediction('m5_dcmp', c);
                  addXp(10);
                }}
                className="px-4 py-2 rounded-xl border-2 font-semibold bg-white border-sky-100 hover:border-sky-300 transition"
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Probe A', h: 2, color: '#38bdf8' },
                { label: 'Probe B', h: 5, color: '#0284c7' },
              ].map((p) => (
                <div
                  key={p.label}
                  className="text-center p-3 rounded-xl border-2 bg-white"
                  style={{ borderColor: p.color }}
                >
                  <div className="font-bold text-slate-800">{p.label}</div>
                  <div className="text-xs text-slate-500">{p.h} m</div>
                  <div className="mt-2 text-lg font-black text-sky-700">
                    {depthRevealed ? formatPressure(calculatePressure(1000, 10, p.h)) : '?'}
                  </div>
                </div>
              ))}
            </div>

            {!depthRevealed ? (
              <Button
                className="mt-4"
                onClick={() => {
                  setDepthRevealed(true);
                  savePrediction('m5_dcmp_revealed', '1');
                }}
              >
                🔎 Bandingkan
              </Button>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-slate-700">
                Pada fluida yang sama, semakin dalam probe, semakin besar tekanan hidrostatisnya.
                P<sub>B</sub> = 50.000 Pa &gt; P<sub>A</sub> = 20.000 Pa.
              </div>
            )}
          </>
        )}
      </Card>

      {/* =====================================================
    BEJANA BERHUBUNGAN — SIMULASI + PREDIKSI
===================================================== */}
<Card className="mb-6">
  <div className="flex items-start gap-2 mb-4">
    <span className="text-2xl" aria-hidden>🤝</span>
    <div>
      <h2 className="font-bold text-slate-800">Prinsip Bejana Berhubungan</h2>
      <p className="text-sm text-slate-600 mt-0.5">
        Lima wadah dengan bentuk berbeda dihubungkan di bagian bawah dan diisi fluida yang
        sama. Amati apa yang terjadi pada permukaan airnya, lalu uji pemahamanmu.
      </p>
    </div>
  </div>

  {/* ===== SIMULASI (SELALU TAMPIL) ===== */}
  <div className="rounded-2xl overflow-hidden bg-sky-50 border border-sky-200">
    <div className="aspect-[400/280] w-full">
      <CommunicatingVessels fillFraction={commFill} probeDepth={commProbe} />
    </div>
  </div>

  {/* ===== KONTROL + PANEL TEKANAN ===== */}
  <div className="grid md:grid-cols-2 gap-4 mt-4">
    <div className="space-y-4">
      <div>
        <label
          htmlFor="comm-fill"
          className="block text-sm font-semibold text-slate-700 mb-1"
        >
          💧 Ketinggian Air:{' '}
          <span className="text-sky-700 font-bold">{Math.round(commFill * 100)}%</span>
        </label>
        <input
          id="comm-fill"
          type="range"
          min="0.25"
          max="1"
          step="0.01"
          value={commFill}
          onChange={(e) => setCommFill(parseFloat(e.target.value))}
          className="w-full accent-sky-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Perhatikan: permukaan air di kelima wadah selalu sejajar.
        </p>
      </div>

      <div>
        <label
          htmlFor="comm-probe"
          className="block text-sm font-semibold text-slate-700 mb-1"
        >
          📍 Kedalaman Probe A & B:{' '}
          <span className="text-sky-700 font-bold">{commDepthMeters.toFixed(2)} m</span>
        </label>
        <input
          id="comm-probe"
          type="range"
          min="0.1"
          max="0.85"
          step="0.01"
          value={commProbe}
          onChange={(e) => setCommProbe(parseFloat(e.target.value))}
          className="w-full accent-sky-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Kedua probe selalu berada di kedalaman yang sama.
        </p>
      </div>
    </div>

    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 border border-sky-100">
          <div className="text-xs font-semibold text-slate-500">Probe A</div>
          <div className="text-[10px] text-slate-400">wadah 1 · lurus</div>
          <div className="text-lg font-black text-sky-700 mt-1">
            {formatPressure(commPressure)}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-sky-100">
          <div className="text-xs font-semibold text-slate-500">Probe B</div>
          <div className="text-[10px] text-slate-400">wadah 5 · lurus</div>
          <div className="text-lg font-black text-sky-700 mt-1">
            {formatPressure(commPressure)}
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white text-center">
        <div className="text-xs opacity-85">Kesimpulan</div>
        <div className="text-xl font-black mt-1">
          P<sub>A</sub> = P<sub>B</sub>
        </div>
        <div className="text-xs opacity-85 mt-1">bentuk wadah tidak berpengaruh</div>
      </div>

      <div className="text-xs bg-slate-50 rounded-lg p-3 font-mono text-slate-700 break-words">
        P = ρgh = 1000 × 10 × {commDepthMeters.toFixed(2)} ={' '}
        {commPressure.toLocaleString('id-ID')} Pa
      </div>
    </div>
  </div>

  {/* ===== PREDIKSI (DI BAWAH SIMULASI) ===== */}
  <div className="mt-6 p-4 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50">
    <div className="flex items-start gap-2 mb-3">
      <span className="text-xl" aria-hidden>🔮</span>
      <div>
        <p className="font-bold text-slate-800 text-sm">
          Sekarang, uji pemahamanmu:
        </p>
        <p className="text-sm text-slate-600 mt-0.5">
          Setelah mengamati simulasi di atas, menurutmu bagaimana ketinggian permukaan air di
          kelima wadah?
        </p>
      </div>
    </div>

    {!commPredicted ? (
      <div className="grid sm:grid-cols-2 gap-2">
        {[
          { id: 'A', label: 'Permukaan air di semua wadah sama tinggi' },
          { id: 'B', label: 'Wadah lebar punya permukaan paling rendah' },
          { id: 'C', label: 'Wadah sempit punya permukaan paling tinggi' },
          { id: 'D', label: 'Ketinggiannya bergantung volume tiap wadah' },
        ].map((o) => (
          <button
            key={o.id}
            onClick={() => {
              savePrediction('m5_comm_pred', o.id);
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
      <div
        className={`p-4 rounded-xl text-sm ${
          commPredicted === 'A'
            ? 'bg-cyan-50 border border-cyan-200 text-cyan-900'
            : 'bg-amber-50 border border-amber-200 text-amber-900'
        }`}
      >
        {commPredicted === 'A' ? (
          <>
            <p className="font-bold">✓ Prediksimu tepat!</p>
            <p className="mt-1">
              Permukaan air di kelima wadah <strong>selalu sama tinggi</strong> — tidak peduli
              bentuk wadahnya. Ini disebut <em>Prinsip Bejana Berhubungan</em>. Kamu sudah
              memverifikasinya lewat slider di atas.
            </p>
          </>
        ) : (
          <>
            <p className="font-bold">🔎 Coba perhatikan lagi!</p>
            <p className="mt-1">
              Meskipun bentuk kelima wadah berbeda-beda (lurus, berkelok, lebar, botol),
              permukaan airnya <strong>selalu sejajar</strong>. Jawaban yang tepat adalah{' '}
              <strong>A</strong>. Geser slider ketinggian air untuk memverifikasi.
            </p>
          </>
        )}
        <p className="mt-2 text-xs opacity-80">
          Konsekuensinya: pada kedalaman sama di fluida terhubung, tekanan hidrostatis juga sama
          — tidak bergantung pada bentuk atau volume wadah.
        </p>
      </div>
    )}
  </div>
</Card>

      {/* =====================================================
          BAGAIMANA JIKA...?
      ===================================================== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-2">💭 Bagaimana Jika...?</h2>
        <p className="text-sm text-slate-600 mb-4">
          Jawab satu per satu untuk melihat efek perubahan variabel.
        </p>
        <div className="space-y-3">
          {[
            {
              q: 'Jika kedalaman menjadi 2× lipat (ρ dan g tetap), tekanan hidrostatis menjadi...',
              a: '2× lipat',
            },
            {
              q: 'Jika massa jenis menjadi 2× lipat (h dan g tetap), tekanan hidrostatis menjadi...',
              a: '2× lipat',
            },
            {
              q: 'Jika gravitasi diperkecil, tekanan hidrostatis...',
              a: 'mengecil',
            },
            {
              q: 'Jika kedalaman h = 0 (di permukaan), tekanan hidrostatis = ...',
              a: '0 Pa',
            },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl border-2 border-sky-100 bg-white">
              <p className="text-sm font-semibold text-slate-700">{item.q}</p>
              {whatIfStep > i ? (
                <p className="text-sm mt-1 text-cyan-700 font-bold">➜ {item.a}</p>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => setWhatIfStep(i + 1)}
                  disabled={whatIfStep !== i}
                >
                  Tampilkan Jawaban
                </Button>
              )}
            </div>
          ))}
        </div>

        {whatIfStep >= 4 && (
          <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-slate-700">
            <p className="font-bold text-sky-800 mb-1">📌 Catatan tentang h = 0</p>
            P = 0 Pa yang dimaksud di sini adalah <strong>tekanan hidrostatis</strong> relatif
            terhadap permukaan fluida — bukan berarti tidak ada tekanan sama sekali. Di permukaan
            terbuka, tekanan atmosfer (P<sub>atm</sub>) tetap ada. Tekanan totalnya adalah{' '}
            P<sub>total</sub> = P<sub>atm</sub> + ρgh.
          </div>
        )}
      </Card>

      {/* TOMBOL LANJUT */}
      <div className="flex justify-end">
        <Button size="lg" onClick={finish}>
          Lanjut ke Hydro Engineer →
        </Button>
      </div>
    </div>
  );
};