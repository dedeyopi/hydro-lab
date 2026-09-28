import React from 'react';
import { Button, Card } from '../components/UI';

export const DeveloperScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Kembali
        </Button>
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          TENTANG APLIKASI
        </span>
      </div>

      {/* HERO */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-cyan-600 text-white text-4xl shadow-xl shadow-sky-500/30 mb-4 float-slow">
          💧
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800">
          HYDRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-600">LAB</span>
        </h1>
        <p className="text-sky-700 font-semibold mt-1">
          Misi Menyelidiki Tekanan di Dalam Air
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Laboratorium IPA Virtual · Fase D · SMP Kelas 9
        </p>
      </div>

      {/* ===== PROFIL PENGEMBANG ===== */}
      <Card className="mb-6 !p-0 overflow-hidden">
        <div className="grid md:grid-cols-[280px_1fr] gap-0">
          {/* FOTO */}
          <div className="relative bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center p-6">
            <div className="relative w-full max-w-[240px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/70">
              <img
                src="/developer.jpg"
                alt="Foto Pengembang"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback jika foto belum ada
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-200 to-cyan-300 text-sky-800 text-center p-4">
                        <div class="text-6xl mb-3">👨‍🏫</div>
                        <p class="text-xs font-bold">Foto Pengembang</p>
                        <p class="text-[10px] opacity-75 mt-1">Letakkan file di<br/><code>public/developer.jpg</code></p>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          {/* DATA */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <p className="text-xs font-bold tracking-widest text-sky-600 uppercase">
              Penulis Naskah & Pengembang MPI
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2">
              Dede Yopi, M.Pd.
            </h2>
            <div className="mt-3 space-y-1.5 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <span className="text-lg">🏫</span>
                <span><b>SMP Negeri 49 Jakarta</b></span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span>Guru IPA · Fase D</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <span>Pengembang Media Pembelajaran Interaktif</span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-700">
                IPA Terpadu
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-100 text-cyan-700">
                MPI Interaktif
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                Pembelajaran Berbasis Inkuiri
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* ===== TENTANG APLIKASI ===== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-3 text-lg">🎓 Tentang Aplikasi</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          <b>HYDRO LAB</b> adalah media pembelajaran interaktif berbasis web untuk mempelajari{' '}
          <b>tekanan hidrostatis</b> pada mata pelajaran IPA Fase D kelas 9. Aplikasi ini
          dirancang dengan pendekatan <i>guided inquiry</i> dan siklus belajar 5E{' '}
          (Engage–Explore–Explain–Elaborate–Evaluate).
        </p>
        <p className="text-sm text-slate-700 leading-relaxed mt-3">
          Siswa tidak langsung diberi rumus, tetapi diajak menemukan konsep{' '}
          <b>P = ρgh</b> melalui fenomena, prediksi, eksperimen virtual, analisis data, dan
          refleksi — sehingga pembelajaran menjadi bermakna dan berpusat pada siswa.
        </p>
      </Card>

      {/* ===== FITUR UTAMA ===== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-4 text-lg">✨ Fitur Utama</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '🎬', title: 'Fenomena & Prediksi', desc: 'Memulai dari masalah nyata sebelum rumus' },
            { icon: '🧪', title: 'Simulator Interaktif', desc: 'Probe, tangki fluida, pipa U, dan menara air' },
            { icon: '📊', title: 'Eksperimen & Data', desc: 'Pengumpulan data, tabel, dan grafik dinamis' },
            { icon: '🧮', title: 'Perhitungan Terbimbing', desc: 'Langkah substitusi P = ρgh satu per satu' },
            { icon: '🏆', title: 'Gamifikasi Ringan', desc: 'XP, badge, dan progress yang memotivasi' },
            { icon: '👩‍🏫', title: 'Mode Guru', desc: 'Kunci jawaban, miskonsepsi, dan rencana pembelajaran' },
          ].map((f) => (
            <div key={f.title} className="flex gap-3 p-3 rounded-xl bg-sky-50 border border-sky-100">
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <p className="font-bold text-sm text-slate-800">{f.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ===== TEKNOLOGI ===== */}
      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-3 text-lg">⚙️ Dibangun Dengan</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'React 18', color: 'bg-sky-100 text-sky-700' },
            { name: 'TypeScript', color: 'bg-blue-100 text-blue-700' },
            { name: 'Tailwind CSS', color: 'bg-cyan-100 text-cyan-700' },
            { name: 'Vite', color: 'bg-purple-100 text-purple-700' },
            { name: 'SVG Illustration', color: 'bg-amber-100 text-amber-700' },
            { name: 'localStorage', color: 'bg-emerald-100 text-emerald-700' },
          ].map((t) => (
            <span key={t.name} className={`px-3 py-1.5 rounded-full text-xs font-bold ${t.color}`}>
              {t.name}
            </span>
          ))}
        </div>
      </Card>

      {/* ===== TUJUAN PEMBELAJARAN ===== */}
      <Card className="mb-6 !bg-gradient-to-br !from-sky-500 !to-cyan-600 !border-0 text-white">
        <h2 className="font-bold text-lg mb-3">🎯 Tujuan Pembelajaran</h2>
        <ul className="space-y-2 text-sm">
          {[
            'Menjelaskan konsep tekanan hidrostatis secara kualitatif',
            'Menganalisis pengaruh kedalaman terhadap tekanan',
            'Menganalisis pengaruh massa jenis terhadap tekanan',
            'Menggunakan persamaan P = ρgh dalam perhitungan',
            'Menerapkan konsep pada situasi nyata sehari-hari',
          ].map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-white/90 flex-shrink-0">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* ===== FOOTER ===== */}
      <div className="text-center text-xs text-slate-500 space-y-1 py-4">
        <p>© 2025 · Dede Yopi, M.Pd. · SMP Negeri 49 Jakarta</p>
        <p className="text-slate-400">
          Dikembangkan untuk pembelajaran IPA Fase D — Kurikulum Merdeka
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="secondary" onClick={onBack}>
          ← Kembali
        </Button>
      </div>
    </div>
  );
};