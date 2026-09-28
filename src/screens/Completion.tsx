import React from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';

const MASTERY = [
  { id: 'pressure', label: 'Memahami tekanan hidrostatis' },
  { id: 'depth', label: 'Memahami pengaruh kedalaman' },
  { id: 'density', label: 'Memahami pengaruh massa jenis' },
  { id: 'gravity', label: 'Memahami pengaruh gravitasi' },
  { id: 'formula', label: 'Menggunakan P = ρgh' },
  { id: 'data', label: 'Menganalisis data eksperimen' },
  { id: 'apply', label: 'Menerapkan konsep' },
];

export const CompletionScreen: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
  const { state } = useStore();

  const quizPercent = Math.round((state.quizScore / 10) * 100);
  const totalXp = state.xp;
  const level = totalXp >= 300 ? 'Ahli' : totalXp >= 200 ? 'Mahir' : totalXp >= 100 ? 'Berkembang' : 'Pemula';

  const summary =
    quizPercent >= 80
      ? 'Pemahamanmu sangat kuat. Kamu mampu menjelaskan konsep tekanan hidrostatis dengan bukti dan menerapkannya pada situasi baru.'
      : quizPercent >= 60
      ? 'Pemahamanmu baik. Tinjau kembali konsep massa jenis dan pengaruhnya terhadap tekanan untuk memperkuat analisismu.'
      : 'Kamu sudah menyelesaikan perjalanan! Luangkan waktu untuk meninjau kembali hubungan P = ρgh dan cobalah eksperimen sekali lagi untuk memperkuat pemahaman.';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-block text-6xl mb-3">🏆</div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800">MISSION COMPLETE</h1>
        <p className="text-sky-700 font-bold text-xl mt-2">HYDRO INVESTIGATOR</p>
      </div>

      <Card className="mb-6 !bg-gradient-to-br !from-sky-500 !to-cyan-600 !border-0 text-white">
        <div className="text-center">
          <p className="text-sm opacity-80">Selamat, Investigator</p>
          <p className="text-3xl font-black mt-1">{state.profile?.name}</p>
          <p className="text-sm opacity-80 mt-1">Kelas {state.profile?.className}</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xs opacity-80">Total XP</div>
              <div className="text-2xl font-black">{totalXp}</div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xs opacity-80">Skor Challenge</div>
              <div className="text-2xl font-black">{quizPercent}%</div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xs opacity-80">Level</div>
              <div className="text-2xl font-black">{level}</div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-3">🎖️ Lencana yang Diraih</h2>
        <div className="flex flex-wrap gap-2">
          {state.badges.length === 0 && <p className="text-sm text-slate-500">Belum ada lencana.</p>}
          {state.badges.map((b) => (
            <span key={b} className="px-3 py-2 rounded-full bg-gradient-to-r from-sky-100 to-cyan-100 text-sky-800 font-bold text-sm border border-sky-200">
              {b}
            </span>
          ))}
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="font-bold text-slate-800 mb-3">✓ Penguasaan Konsep</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {MASTERY.map((m) => (
            <div key={m.id} className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-cyan-600 font-bold">✓</span>
              {m.label}
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-6 !bg-amber-50 !border-amber-200">
        <h2 className="font-bold text-amber-900 mb-2">📝 Ringkasan Personal</h2>
        <p className="text-sm text-amber-900">{summary}</p>
        {state.confidence && (
          <p className="text-sm text-amber-900 mt-2">
            <strong>Tingkat keyakinanmu:</strong> {state.confidence.replace('paham', '').trim() || 'tercatat'}
          </p>
        )}
      </Card>

      <Card className="!bg-sky-50 !border-sky-200 text-center">
        <p className="text-sky-800 font-semibold">
          "Mengapa semakin dalam kita berada di dalam air, semakin besar tekanan yang kita rasakan?"
        </p>
        <p className="text-slate-700 mt-3 text-sm">
          Karena tekanan hidrostatis sebanding dengan kedalaman (P = ρgh). Semakin dalam, semakin besar
          berat fluida di atas titik tersebut, sehingga tekanan yang bekerja juga semakin besar — ke segala arah.
        </p>
      </Card>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Button variant="secondary" onClick={onRestart}>Kembali ke Peta Misi</Button>
        <Button onClick={() => window.print()}>🖨️ Cetak / Simpan PDF</Button>
      </div>
    </div>
  );
};