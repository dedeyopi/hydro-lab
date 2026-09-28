import React from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { DiverScene } from '../components/Illustrations';

export const LandingScreen: React.FC<{
  onStart: () => void;
  onMap: () => void;
  onAbout: () => void;
}> = ({ onStart, onMap, onAbout }) => {
  const { state } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-14">
      {/* ===== HERO ===== */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            🔬 Laboratorium IPA · Fase D · Kelas 9
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight leading-[1.05]">
            HYDRO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-600">
              LAB
            </span>
          </h1>
          <p className="mt-3 text-xl font-bold text-sky-700">
            Misi Menyelidiki Tekanan di Dalam Air
          </p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Semakin dalam kita menyelam, semakin besar tekanan yang bekerja. Tetapi mengapa?
            Selidiki fenomenanya, kumpulkan data, temukan polanya, dan bangun sendiri konsepnya.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button size="lg" onClick={onStart}>
              {state.completedMissions.length > 0 ? 'Lanjutkan Misi' : 'Mulai Misi'} →
            </Button>
            <Button size="lg" variant="secondary" onClick={onMap}>
              Lihat Peta Misi
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[
              { n: '01', t: 'Amati Fenomena' },
              { n: '02', t: 'Kumpulkan Data' },
              { n: '03', t: 'Bangun Konsep' },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="text-2xl font-black text-sky-500">{s.n}</div>
                <div className="text-xs font-semibold text-slate-600 mt-1">{s.t}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="!p-2 aspect-square overflow-hidden">
          <DiverScene depth={4} />
        </Card>
      </div>

      {/* ===== FITUR HIGHLIGHT ===== */}
      <div className="mt-14 grid md:grid-cols-3 gap-4">
        {[
          { icon: '🌊', title: 'Fenomena', desc: 'Mulai dengan pertanyaan, bukan rumus.' },
          { icon: '🧪', title: 'Eksperimen', desc: 'Ubahlah variabel dan ukur sendiri datanya.' },
          { icon: '📊', title: 'Analisis', desc: 'Temukan pola dari data yang kamu kumpulkan.' },
        ].map((c) => (
          <Card key={c.title}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <h3 className="font-bold text-slate-800">{c.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{c.desc}</p>
          </Card>
        ))}
      </div>

      {/* ===== PERTANYAAN PENYELIDIKAN ===== */}
      <Card className="mt-8 !bg-gradient-to-br !from-sky-500 !to-cyan-600 !border-0 text-white">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">
          Pertanyaan Penyelidikan
        </p>
        <p className="text-xl md:text-2xl font-bold mt-2">
          "Mengapa semakin dalam kita berada di dalam air, semakin besar tekanan yang kita
          rasakan?"
        </p>
      </Card>

      {/* ===== TOMBOL TENTANG ===== */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button variant="ghost" size="sm" onClick={onAbout}>
          ℹ️ Tentang Aplikasi &amp; Pengembang
        </Button>
      </div>
    </div>
  );
};