import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { WaterTank } from '../components/Illustrations';
import { MissionId } from '../types';
import { calculatePressure, formatPressure, getFluidById } from '../utils';

const DEPTHS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
const FRESH_WATER_ID = 'fresh';
const FRESH_WATER = getFluidById(FRESH_WATER_ID);

const PREDICTION_OPTIONS = [
  { id: 'A', label: 'Tidak berubah' },
  { id: 'B', label: 'Menjadi setengah' },
  { id: 'C', label: 'Menjadi dua kali lipat' },
  { id: 'D', label: 'Menjadi empat kali lipat' },
];

export const Mission03: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const {
    state,
    savePrediction,
    addExperimentData,
    addXp,
    completeMission,
    addBadge,
  } = useStore();

  const [prediction, setPrediction] = useState(state.predictions['m3_double'] ?? '');
  const [sensorDepth, setSensorDepth] = useState(0.5);
  const [checkPrediction, setCheckPrediction] = useState(state.predictions['m3_check'] ?? '');

  const density = FRESH_WATER.density;
  const gravity = 10;

  // ✅ FIX: filter berdasarkan fluidId yang konsisten
  const myData = useMemo(
    () => state.experimentData.filter((d) => d.fluidId === FRESH_WATER_ID),
    [state.experimentData]
  );

  // ✅ FIX: turunkan 'measured' dari myData, bukan state lokal
  // (sehingga tidak hilang saat refresh & selalu sinkron dengan tabel)
  const measuredDepths = useMemo(
    () => myData.map((d) => d.depth),
    [myData]
  );

  const isMeasured = (d: number) =>
    measuredDepths.some((x) => Math.abs(x - d) < 0.001);

  const measure = () => {
    if (isMeasured(sensorDepth)) return;

    const pressure = calculatePressure(density, gravity, sensorDepth);

    addExperimentData({
      id: `${Date.now()}-${sensorDepth}`,
      fluidId: FRESH_WATER_ID,               // ✅ KUNCI FIX
      fluidName: FRESH_WATER.name,           // ✅ KUNCI FIX
      fluid: FRESH_WATER.name,               // backward-compat
      density,
      gravity,
      depth: sensorDepth,
      pressure,
      order: state.experimentData.length,
    });

    addXp(20);
  };

  const canContinue = myData.length >= 4 && !!checkPrediction;

  const finish = () => {
    completeMission(3 as MissionId);
    addBadge('📊 Data Detective');
    onComplete();
  };

  const sortedData = useMemo(
    () => myData.slice().sort((a, b) => a.depth - b.depth),
    [myData]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          MISI 03 · EXPLORE
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">
          Eksperimen Kedalaman
        </h1>
        <p className="text-slate-600 mt-2">
          Ukur tekanan hidrostatis pada berbagai kedalaman dan catat datanya.
        </p>
      </div>

      {/* PREDIKSI */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-2">
          🔮 Prediksi dulu: Jika kedalaman dilipatgandakan, bagaimana tekanan hidrostatis berubah?
        </h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {PREDICTION_OPTIONS.map((o) => {
            const isSel = prediction === o.id;
            const locked = !!state.predictions['m3_double'];
            return (
              <button
                key={o.id}
                disabled={locked && !isSel}
                onClick={() => {
                  if (locked) return;
                  setPrediction(o.id);
                  savePrediction('m3_double', o.id);
                  addXp(10);
                }}
                className={`text-left p-3 rounded-xl border-2 font-semibold transition ${
                  isSel
                    ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white border-transparent'
                    : 'bg-white border-sky-100 hover:border-sky-300'
                } ${locked && !isSel ? 'opacity-50' : ''}`}
              >
                <span className="font-bold mr-2">{o.id}.</span>
                {o.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* EKSPERIMEN */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="!p-4">
          <div className="aspect-[3/4] max-h-[420px] mx-auto">
            <WaterTank
              fluidColor={FRESH_WATER.color}
              fluidColorLight={FRESH_WATER.colorLight}
              probeDepth={sensorDepth}
              maxDepth={3.5}
              arrowIntensity={Math.min(1, sensorDepth / 2)}
            />
          </div>
        </Card>

        <div className="space-y-4">
          {/* KONTROL SENSOR */}
          <Card>
            <label
              htmlFor="sensor"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Posisi Sensor:{' '}
              <span className="text-sky-700 font-bold">{sensorDepth.toFixed(1)} m</span>
            </label>

            <div className="flex flex-wrap gap-2 mt-3">
              {DEPTHS.map((d) => {
                const done = isMeasured(d);
                const active = Math.abs(sensorDepth - d) < 0.001;
                return (
                  <button
                    key={d}
                    onClick={() => setSensorDepth(d)}
                    aria-label={`Set posisi sensor ke ${d} meter${done ? ' (sudah diukur)' : ''}`}
                    className={`px-3 py-2 rounded-xl font-bold text-sm border-2 transition ${
                      active
                        ? 'bg-sky-500 text-white border-transparent'
                        : done
                        ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                        : 'bg-white border-sky-100 text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    {d} m {done && '✓'}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={measure}
              disabled={isMeasured(sensorDepth)}
              className="mt-4 w-full"
            >
              {isMeasured(sensorDepth) ? 'Sudah diukur ✓' : '📏 UKUR TEKANAN'}
            </Button>

            {/* Info tekanan real-time untuk posisi saat ini */}
            <div className="mt-3 p-3 rounded-xl bg-sky-50 border border-sky-100">
              <p className="text-xs font-semibold text-slate-500">
                Nilai tekanan di {sensorDepth.toFixed(1)} m:
              </p>
              <p className="text-lg font-black text-sky-700">
                {formatPressure(calculatePressure(density, gravity, sensorDepth))}
              </p>
            </div>
          </Card>

          {/* TABEL DATA */}
          <Card className="!bg-sky-50 !border-sky-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">
                📋 Data Terkumpul ({myData.length}/6)
              </h3>
              {myData.length > 0 && (
                <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full">
                  ✓ {myData.length} tercatat
                </span>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-sky-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-sky-100">
                  <tr>
                    <th className="text-left px-3 py-2 font-bold text-sky-800 w-10">#</th>
                    <th className="text-left px-3 py-2 font-bold text-sky-800">Kedalaman</th>
                    <th className="text-right px-3 py-2 font-bold text-sky-800">Tekanan</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-slate-400 py-6">
                        Belum ada data. Pilih posisi sensor lalu klik <b>UKUR TEKANAN</b>.
                      </td>
                    </tr>
                  )}
                  {sortedData.map((d, i) => (
                    <tr
                      key={d.id}
                      className={`border-t border-sky-100 ${
                        i % 2 === 0 ? 'bg-white' : 'bg-sky-50/40'
                      }`}
                    >
                      <td className="px-3 py-2 text-slate-400 font-mono text-xs">{i + 1}</td>
                      <td className="px-3 py-2 font-semibold text-slate-700">
                        {d.depth.toFixed(1)} m
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-sky-700">
                        {formatPressure(d.pressure)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Progress pengumpulan data */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Progress pengumpulan</span>
                <span className="font-bold">{myData.length}/4 minimal</span>
              </div>
              <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (myData.length / 4) * 100)}%` }}
                />
              </div>
              {myData.length < 4 && (
                <p className="text-xs text-slate-500 mt-2">
                  Butuh minimal 4 data untuk melanjutkan.
                </p>
              )}
              {myData.length >= 4 && (
                <p className="text-xs text-cyan-700 font-semibold mt-2">
                  ✓ Data cukup! Lanjutkan ke analisis pola di bawah.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* GRAFIK */}
      {myData.length >= 3 && (
        <Card className="mt-6">
          <h3 className="font-bold text-slate-800 mb-3">📈 Grafik Tekanan vs Kedalaman</h3>
          <PressureGraph data={sortedData} />
        </Card>
      )}

      {/* ANALISIS POLA */}
      {myData.length >= 4 && (
        <Card className="mt-4">
          <h2 className="font-bold text-slate-800 mb-3">
            🧠 Apakah hasil eksperimen sesuai prediksimu?
          </h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {['Sesuai', 'Tidak sesuai', 'Belum yakin'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCheckPrediction(c);
                  savePrediction('m3_check', c);
                }}
                className={`px-4 py-2 rounded-xl border-2 font-semibold transition ${
                  checkPrediction === c
                    ? 'bg-sky-500 text-white border-transparent'
                    : 'bg-white border-sky-100 hover:border-sky-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          {checkPrediction && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-slate-700">
              <p className="font-bold text-sky-800 mb-1">🔎 Pola yang terlihat:</p>
              Tekanan bertambah secara teratur seiring bertambahnya kedalaman. Ketika kedalaman
              menjadi dua kali lipat, tekanan juga menjadi dua kali lipat. Hubungannya{' '}
              <strong>berbanding lurus</strong>.
            </div>
          )}
        </Card>
      )}

      {/* TOMBOL LANJUT */}
      <div className="mt-8 flex justify-end">
        <Button size="lg" disabled={!canContinue} onClick={finish}>
          Temukan Polanya →
        </Button>
      </div>
    </div>
  );
};

/* ===== GRAFIK SVG ===== */
const PressureGraph: React.FC<{ data: { depth: number; pressure: number }[] }> = ({ data }) => {
  const sorted = data.slice().sort((a, b) => a.depth - b.depth);
  const w = 560;
  const h = 260;
  const pad = 46;
  const maxX = Math.max(3.5, ...sorted.map((d) => d.depth));
  const maxY = Math.max(35000, ...sorted.map((d) => d.pressure));

  const xScale = (x: number) => pad + (x / maxX) * (w - pad * 2);
  const yScale = (y: number) => h - pad - (y / maxY) * (h - pad * 2);

  const points = sorted.map((d) => `${xScale(d.depth)},${yScale(d.pressure)}`).join(' ');

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full min-w-[400px] h-auto"
        role="img"
        aria-label="Grafik tekanan hidrostatis terhadap kedalaman"
      >
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={pad}
            x2={w - pad}
            y1={pad + i * ((h - pad * 2) / 3)}
            y2={pad + i * ((h - pad * 2) / 3)}
            stroke="#bae6fd"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#0c4a6e" strokeWidth="2" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#0c4a6e" strokeWidth="2" />
        <text x={w / 2} y={h - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0c4a6e">
          Kedalaman (m)
        </text>
        <text
          x={14}
          y={h / 2}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#0c4a6e"
          transform={`rotate(-90 14 ${h / 2})`}
        >
          Tekanan (Pa)
        </text>
        {[0, 10000, 20000, 30000].map((v) => (
          <text
            key={v}
            x={pad - 6}
            y={yScale(v) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#0c4a6e"
          >
            {v / 1000}k
          </text>
        ))}
        {[0.5, 1, 1.5, 2, 2.5, 3].map((v) => (
          <text
            key={v}
            x={xScale(v)}
            y={h - pad + 16}
            textAnchor="middle"
            fontSize="10"
            fill="#0c4a6e"
          >
            {v}
          </text>
        ))}
        {sorted.length > 1 && (
          <polyline
            points={points}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {sorted.map((d, i) => (
          <g key={i}>
            <circle
              cx={xScale(d.depth)}
              cy={yScale(d.pressure)}
              r="6"
              fill="#fbbf24"
              stroke="#0c4a6e"
              strokeWidth="2"
            />
            <text
              x={xScale(d.depth)}
              y={yScale(d.pressure) - 12}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#0c4a6e"
            >
              {(d.pressure / 1000).toFixed(1)}k
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};