import React, { useMemo } from 'react';
import { useStore } from '../store';
import { Button } from '../components/UI';

/**
 * Generate nomor sertifikat deterministik dari nama + kelas + timestamp
 */
function generateCertId(name: string, className: string): string {
  const clean = (name + className).replace(/\s/g, '').toUpperCase();
  const hash = Array.from(clean).reduce(
    (acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0,
    0
  );
  const num = Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padStart(6, '0');
  const year = new Date().getFullYear();
  return `HL-${year}-${num}`;
}

function formatDateId(d: Date): string {
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

export const CertificateScreen: React.FC<{
  onBack: () => void;
  onHome: () => void;
}> = ({ onBack, onHome }) => {
  const { state } = useStore();

  const profile = state.profile;
  const certId = useMemo(
    () => (profile ? generateCertId(profile.name, profile.className) : 'HL-XXXX-XXXXXX'),
    [profile]
  );
  const today = useMemo(() => formatDateId(new Date()), []);

  const quizPercent = Math.round((state.quizScore / 25) * 100);

  const predicate =
    quizPercent >= 90
      ? { label: 'SANGAT BAIK', color: 'from-amber-400 to-yellow-500', icon: '🏆' }
      : quizPercent >= 80
      ? { label: 'BAIK', color: 'from-cyan-400 to-sky-500', icon: '🥇' }
      : quizPercent >= 70
      ? { label: 'CUKUP', color: 'from-emerald-400 to-teal-500', icon: '🥈' }
      : { label: 'LULUS', color: 'from-sky-400 to-cyan-500', icon: '🥉' };

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600">Silakan login terlebih dahulu.</p>
        <Button className="mt-4" onClick={onHome}>Kembali</Button>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ===== HEADER KONTROL (tidak ikut tercetak) ===== */}
      <div className="no-print flex flex-wrap items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Kembali
        </Button>
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          SERTIFIKAT
        </span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={handlePrint}>
            🖨️ Cetak / Simpan PDF
          </Button>
        </div>
      </div>

      {/* ===== SERTIFIKAT ===== */}
      <div
        id="certificate-print"
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ aspectRatio: '297 / 210' }}
      >
        {/* Border dekoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50" />
        <div className="absolute inset-3 border-[3px] border-sky-400 rounded-xl" />
        <div className="absolute inset-5 border border-sky-300 rounded-lg" />

        {/* Ornamen sudut */}
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />

        {/* Konten utama */}
        <div className="relative h-full flex flex-col p-10 md:p-14">

          {/* HEADER — Logo & Aplikasi */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white text-2xl shadow-lg">
                💧
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg leading-none">HYDRO LAB</p>
                <p className="text-[10px] text-slate-500 mt-1 tracking-wide">
                  Laboratorium IPA Virtual · Fase D · SMP Kelas 9
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 tracking-widest font-bold">
                NOMOR SERTIFIKAT
              </p>
              <p className="font-mono font-bold text-sky-700 text-sm mt-0.5">{certId}</p>
            </div>
          </div>

          {/* PEMBATAS */}
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />

          {/* JUDUL */}
          <div className="text-center mt-6 md:mt-8">
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] text-sky-600">
              SERTIFIKAT PENYELESAIAN
            </p>
            <p className="text-[10px] md:text-xs text-slate-500 mt-1">
              Certificate of Completion
            </p>
          </div>

          {/* DIBERIKAN KEPADA */}
          <div className="text-center mt-4 md:mt-6">
            <p className="text-xs text-slate-500 mb-2">Diberikan kepada</p>
            <p className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
              {profile.name}
            </p>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
              <span>Kelas {profile.className}</span>
            </div>
          </div>

          {/* DESKRIPSI */}
          <div className="text-center mt-4 md:mt-6 max-w-2xl mx-auto">
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              telah berhasil menyelesaikan seluruh <b>8 misi</b> pembelajaran interaktif{' '}
              <b>HYDRO LAB</b> tentang <b>Tekanan Hidrostatis</b> dengan pendekatan
              inkuiri terbimbing, meliputi fenomena, eksperimen virtual, analisis data,
              perhitungan, dan penerapan konsep.
            </p>
          </div>

          {/* CAPAIAN */}
          <div className="mt-5 md:mt-7 grid grid-cols-3 gap-3 max-w-xl mx-auto">
            <Metric label="Total XP" value={state.xp.toString()} icon="⭐" />
            <Metric
              label="Skor Challenge"
              value={`${quizPercent}%`}
              icon="🎯"
            />
            <Metric label="Misi Selesai" value={`${state.completedMissions.length}/8`} icon="✅" />
          </div>

          {/* PREDIKAT */}
          <div className="mt-5 md:mt-6 flex justify-center">
            <div
              className={`px-5 py-2 rounded-full bg-gradient-to-r ${predicate.color} text-white font-black tracking-widest text-sm shadow-lg flex items-center gap-2`}
            >
              <span>{predicate.icon}</span>
              <span>PREDIKAT: {predicate.label}</span>
            </div>
          </div>

          {/* BADGES */}
          {state.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {state.badges.map((b) => (
                <span
                  key={b}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* TANDA TANGAN */}
          <div className="mt-auto pt-6 flex items-end justify-between gap-4">
            <div className="text-left">
              <p className="text-[10px] text-slate-500">
                Diberikan pada tanggal
              </p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{today}</p>
            </div>

            {/* Stempel / Seal */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-cyan-600 opacity-15" />
              <div className="absolute inset-1 rounded-full border-2 border-dashed border-sky-400 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg md:text-xl">💧</div>
                  <div className="text-[8px] font-black text-sky-700 tracking-wider mt-0.5">
                    HYDRO LAB
                  </div>
                  <div className="text-[7px] text-sky-500 tracking-widest">
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-slate-500">Pengembang Aplikasi</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">Dede Yopi, M.Pd.</p>
              <p className="text-[10px] text-slate-500">SMP Negeri 49 Jakarta</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CATATAN (tidak ikut tercetak) ===== */}
      <div className="no-print mt-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-slate-700">
        <p className="font-bold text-sky-800 mb-1">💡 Cara Menyimpan Sertifikat</p>
        <ol className="list-decimal pl-5 space-y-1 text-xs">
          <li>Klik tombol <b>🖨️ Cetak / Simpan PDF</b> di atas.</li>
          <li>Pada dialog cetak, pilih <b>"Save as PDF"</b> (atau pilih printer jika ingin dicetak).</li>
          <li>Atur ukuran kertas ke <b>A4 Landscape</b>, margin minimal.</li>
          <li>Klik <b>Save</b> — file PDF siap dibagikan atau dicetak.</li>
        </ol>
      </div>

      <div className="no-print mt-4 flex flex-wrap justify-center gap-3">
        <Button variant="secondary" size="sm" onClick={onHome}>
          🏠 Kembali ke Beranda
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Halaman Hasil
        </Button>
      </div>
    </div>
  );
};

/* ===== SUB-KOMPONEN ===== */

const Metric: React.FC<{ label: string; value: string; icon: string }> = ({
  label,
  value,
  icon,
}) => (
  <div className="text-center p-2 rounded-xl bg-white/70 border border-sky-100">
    <div className="text-lg" aria-hidden>{icon}</div>
    <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide mt-0.5">
      {label}
    </div>
    <div className="text-lg md:text-xl font-black text-sky-700 leading-none mt-1">
      {value}
    </div>
  </div>
);

const CornerOrnament: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => {
  const rotations = {
    tl: 'rotate-0',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90',
  };
  const positions = {
    tl: 'top-2 left-2',
    tr: 'top-2 right-2',
    bl: 'bottom-2 left-2',
    br: 'bottom-2 right-2',
  };
  return (
    <div className={`absolute ${positions[position]} w-14 h-14 opacity-40`}>
      <svg viewBox="0 0 60 60" className={rotations[position]}>
        <path
          d="M 5 5 L 5 25 M 5 5 L 25 5 M 5 5 L 20 20"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="5" cy="5" r="2" fill="#0ea5e9" />
        <circle cx="20" cy="20" r="1.2" fill="#0ea5e9" opacity="0.6" />
      </svg>
    </div>
  );
};
