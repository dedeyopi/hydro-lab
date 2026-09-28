import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { WaterTank } from '../components/Illustrations';
import { MissionId } from '../types';
import { calculatePressure, formatPressure } from '../utils';

interface OptionItem {
  id: string;
  label: string;
  hint: string;
}

const OPTIONS: OptionItem[] = [
  {
    id: 'a',
    label: 'Kedalaman',
    hint: 'Jarak vertikal dari permukaan air ke titik pengukuran',
  },
  {
    id: 'b',
    label: 'Jumlah air di atas titik',
    hint: 'Banyaknya fluida yang berada di atas titik tersebut',
  },
  {
    id: 'c',
    label: 'Tekanan',
    hint: 'Besaran yang menyatakan gaya per satuan luas pada titik itu',
  },
];

export const Mission02: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { state, addXp, completeMission, savePrediction } = useStore();

  // Simulator state
  const [depth, setDepth] = useState(0.5);
  const density = 1000;
  const gravity = 10;
  const pressure = calculatePressure(density, gravity, depth);
  const indicator = depth < 1 ? 'rendah' : depth < 3 ? 'sedang' : 'tinggi';

  // Quiz state
  const storedAnswer = state.predictions['m2_changes'] ?? '';
  const [selected, setSelected] = useState<string[]>(
    storedAnswer ? storedAnswer.split(',') : []
  );
  const [committed, setCommitted] = useState<boolean>(
    state.predictions['m2_committed'] === '1'
  );

  const toggle = (id: string) => {
    if (committed) return;
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const commit = () => {
    if (selected.length === 0 || committed) return;
    // Simpan jawaban dalam urutan konsisten
    const ordered = OPTIONS.filter((o) => selected.includes(o.id)).map((o) => o.id);
    savePrediction('m2_changes', ordered.join(','));
    savePrediction('m2_committed', '1');
    setSelected(ordered);
    setCommitted(true);
    addXp(20);
  };

  const finish = () => {
    completeMission(2 as MissionId);
    onComplete();
  };

  // Analisis jawaban siswa (setelah commit)
  const pickCount = selected.length;
  const pickedAll = pickCount === 3;
  const pickedSome = pickCount > 0 && pickCount < 3;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          MISI 02 · EXPLORE
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">
          Apa yang Menekan?
        </h1>
        <p className="text-slate-600 mt-2">
          Geser probe tekanan ke berbagai kedalaman. Perhatikan apa yang berubah.
        </p>
      </div>

      {/* ===== SIMULATOR ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="!p-4">
          <div className="aspect-[3/4] max-h-[480px] mx-auto">
            <WaterTank
              probeDepth={depth}
              maxDepth={6}
              arrowIntensity={Math.min(1, depth / 4)}
            />
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <label htmlFor="depth" className="block text-sm font-semibold text-slate-700 mb-2">
              Kedalaman Probe
            </label>
            <input
              id="depth"
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={depth}
              onChange={(e) => setDepth(parseFloat(e.target.value))}
              className="w-full accent-sky-500"
            />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-sky-50 rounded-xl p-3">
                <div className="text-xs text-slate-500 font-semibold">Kedalaman</div>
                <div className="text-2xl font-black text-sky-700">{depth.toFixed(1)} m</div>
              </div>
              <div className="bg-cyan-50 rounded-xl p-3">
                <div className="text-xs text-slate-500 font-semibold">Indikator Tekanan</div>
                <div className="text-2xl font-black text-cyan-700 capitalize">{indicator}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              Nilai tekanan:{' '}
              <span className="font-bold text-slate-800">{formatPressure(pressure)}</span>
            </div>
          </Card>

          <Card className="!bg-amber-50 !border-amber-200">
            <p className="font-bold text-amber-800 mb-2">🔍 Perhatikan arah panah!</p>
            <p className="text-sm text-amber-900">
              Di dalam fluida, tekanan bekerja ke <strong>segala arah</strong> — atas, bawah,
              kiri, dan kanan. Ketika kedalaman bertambah, panah-panah itu menjadi lebih kuat
              dan rapat.
            </p>
          </Card>
        </div>
      </div>

      {/* ===== PERTANYAAN SINTESIS ===== */}
      <Card className="mt-6">
        <div className="flex items-start gap-3 mb-1">
          <span className="text-2xl" aria-hidden>❓</span>
          <div>
            <h2 className="font-bold text-slate-800">
              Berdasarkan pengamatanmu, apa yang berubah ketika titik pengukuran semakin dalam?
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Pilih semua yang menurutmu berubah — lalu kunci jawabanmu.
            </p>
          </div>
        </div>

        <fieldset className="grid sm:grid-cols-3 gap-3 mt-4" disabled={committed}>
          <legend className="sr-only">Pilih apa yang berubah</legend>
          {OPTIONS.map((o) => {
            const isChecked = selected.includes(o.id);
            return (
              <label
                key={o.id}
                className={`relative p-3 rounded-xl border-2 transition cursor-pointer select-none ${
                  isChecked
                    ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white border-transparent shadow-md'
                    : 'bg-white border-sky-100 text-slate-700 hover:border-sky-300'
                } ${committed ? 'cursor-default' : ''}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() => toggle(o.id)}
                  disabled={committed}
                />
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                      isChecked
                        ? 'bg-white/25 border-white/60 text-white'
                        : 'bg-white border-sky-300 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className="font-bold text-sm">{o.label}</span>
                </div>
                <p
                  className={`text-xs mt-1.5 leading-snug ${
                    isChecked ? 'text-white/85' : 'text-slate-500'
                  }`}
                >
                  {o.hint}
                </p>
              </label>
            );
          })}
        </fieldset>

        {/* TOMBOL KUNCI JAWABAN */}
        {!committed && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={commit} disabled={selected.length === 0}>
              🔒 Kunci Jawaban Saya
            </Button>
            <span className="text-xs text-slate-500">
              {selected.length === 0
                ? 'Pilih minimal satu opsi dulu.'
                : `${selected.length} opsi dipilih.`}
            </span>
          </div>
        )}

        {/* ===== FEEDBACK SETELAH COMMIT ===== */}
        {committed && (
          <div className="mt-6 space-y-3 animate-fade-in">
            {/* Status ringkas */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-sky-100 text-sky-700">
                Jawaban Terkunci
              </span>
              <span className="text-xs text-slate-500">
                Kamu memilih {pickCount} dari 3 kemungkinan.
              </span>
            </div>

            {/* Umpan balik kontekstual */}
            {pickedAll && (
              <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900">
                <p className="font-bold">🎯 Penalaranmu tajam!</p>
                <p className="text-sm mt-1">
                  Kamu melihat ketiga besaran itu sekaligus — dan memang itulah kuncinya.
                  Mereka bukan tiga hal terpisah, melainkan satu rantai sebab-akibat.
                </p>
              </div>
            )}

            {pickedSome && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <p className="font-bold">🔎 Pengamatanmu sudah tepat sebagian!</p>
                <p className="text-sm mt-1">
                  Kamu memilih{' '}
                  <strong>
                    {OPTIONS.filter((o) => selected.includes(o.id))
                      .map((o) => o.label.toLowerCase())
                      .join(' dan ')}
                  </strong>
                  . Itu benar. Tapi ternyata <strong>ketiganya</strong> berubah — karena
                  saling berhubungan. Lihat rantai di bawah untuk memahami mengapa.
                </p>
              </div>
            )}

            {/* Rantai sebab-akibat (reveal konsep) */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200">
              <p className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-3">
                Rantai Sebab-Akibat
              </p>
              <ol className="space-y-2 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                  <span>
                    Titik pengukuran semakin dalam → <strong>kedalaman (h)</strong> bertambah.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                  <span>
                    Karena lebih dalam, ada <strong>lebih banyak fluida di atas</strong> titik
                    itu — beratnya bertambah.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
                  <span>
                    Akibatnya, <strong>tekanan hidrostatis</strong> di titik itu bertambah.
                  </span>
                </li>
              </ol>
              <p className="text-sm text-slate-600 mt-4 italic">
                Jadi ketiganya benar — tetapi bukan sebagai daftar terpisah, melainkan sebagai
                satu hubungan sebab-akibat yang berurutan.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* ===== GAGASAN KUNCI (muncul setelah commit) ===== */}
      {committed && (
        <Card className="mt-4 !bg-gradient-to-br !from-sky-500 !to-cyan-600 !border-0 text-white animate-fade-in">
          <h3 className="font-bold text-lg">💡 Gagasan Kunci</h3>
          <p className="mt-2">
            Di dalam fluida, semakin dalam suatu titik berada, semakin besar tekanan
            hidrostatis yang diterimanya. Tekanan itu bekerja ke <em>segala arah</em>,
            bukan hanya ke bawah.
          </p>
        </Card>
      )}

      {/* ===== TOMBOL LANJUT ===== */}
      <div className="mt-8 flex justify-end">
        <Button size="lg" disabled={!committed} onClick={finish}>
          Lanjut ke Eksperimen →
        </Button>
      </div>
    </div>
  );
};