import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { MissionId } from '../types';

/* =================================================================
   TIPE SOAL
================================================================= */
type Category = 'konsep' | 'aplikasi' | 'penalaran';

interface BaseQ {
  id: number;
  category: Category;
  prompt: React.ReactNode;
  xp: number;
  feedbackCorrect: string;
  feedbackWrong: string;
}

interface MCQ extends BaseQ {
  type: 'mc';
  options: { id: string; text: string }[];
  correct: string;
}
interface MCComplexQ extends BaseQ {
  type: 'mc-complex';
  options: { id: string; text: string }[];
  correct: string[];
}
interface TFQ extends BaseQ {
  type: 'true-false';
  statements: { text: string; correct: 'B' | 'S' }[];
}
interface MatchingQ extends BaseQ {
  type: 'matching';
  pairs: { left: string; right: string }[];
}
interface FillQ extends BaseQ {
  type: 'fill';
  accepted: string[];
  placeholder?: string;
}
interface NumericQ extends BaseQ {
  type: 'numeric';
  correct: number;
  tolerance: number;
  unit: string;
}
interface EssayQ extends BaseQ {
  type: 'essay';
  keywords: string[];
  minKeywords: number;
  minLength: number;
}
type Q = MCQ | MCComplexQ | TFQ | MatchingQ | FillQ | NumericQ | EssayQ;

/* =================================================================
   DATA SOAL (25 SOAL)
================================================================= */
const QS: Q[] = [
  /* ---------- A. PG BIASA (5) ---------- */
  {
    id: 1, type: 'mc', category: 'konsep', xp: 10,
    prompt: 'Tekanan hidrostatis adalah...',
    options: [
      { id: 'A', text: 'Gaya total yang menekan seluruh permukaan benda' },
      { id: 'B', text: 'Gaya per satuan luas akibat berat fluida di atas suatu titik' },
      { id: 'C', text: 'Massa fluida per satuan volume' },
      { id: 'D', text: 'Berat total fluida di dalam wadah' },
    ],
    correct: 'B',
    feedbackCorrect: 'Tepat! Tekanan hidrostatis = gaya per satuan luas akibat berat fluida di atas titik tersebut.',
    feedbackWrong: 'Ingat: tekanan berbeda dengan gaya. Tekanan = gaya per satuan luas.',
  },
  {
    id: 2, type: 'mc', category: 'konsep', xp: 10,
    prompt: 'Faktor yang TIDAK memengaruhi tekanan hidrostatis pada suatu titik adalah...',
    options: [
      { id: 'A', text: 'Massa jenis fluida' },
      { id: 'B', text: 'Percepatan gravitasi' },
      { id: 'C', text: 'Kedalaman titik dari permukaan' },
      { id: 'D', text: 'Bentuk dan lebar wadah' },
    ],
    correct: 'D',
    feedbackCorrect: 'Benar! P = ρgh tidak memuat bentuk atau lebar wadah.',
    feedbackWrong: 'Perhatikan persamaan P = ρgh. Variabel apa yang tidak muncul?',
  },
  {
    id: 3, type: 'mc', category: 'konsep', xp: 10,
    prompt: 'Arah tekanan hidrostatis pada suatu titik di dalam fluida adalah...',
    options: [
      { id: 'A', text: 'Hanya ke bawah' },
      { id: 'B', text: 'Hanya ke atas' },
      { id: 'C', text: 'Ke segala arah' },
      { id: 'D', text: 'Hanya horizontal' },
    ],
    correct: 'C',
    feedbackCorrect: 'Tepat! Tekanan fluida bekerja ke segala arah — bukan hanya ke bawah.',
    feedbackWrong: 'Bayangkan balon di dalam air. Ia tertekan dari segala arah.',
  },
  {
    id: 4, type: 'mc', category: 'aplikasi', xp: 10,
    prompt: 'Dua titik A dan B di dalam air memiliki kedalaman 2 m dan 4 m. Perbandingan P_A : P_B adalah...',
    options: [
      { id: 'A', text: '1 : 1' },
      { id: 'B', text: '1 : 2' },
      { id: 'C', text: '2 : 1' },
      { id: 'D', text: '4 : 1' },
    ],
    correct: 'B',
    feedbackCorrect: 'Benar! Karena P sebanding h, P_A:P_B = h_A:h_B = 2:4 = 1:2.',
    feedbackWrong: 'Gunakan P = ρgh. Karena ρ dan g sama, P sebanding dengan h.',
  },
  {
    id: 5, type: 'mc', category: 'aplikasi', xp: 10,
    prompt: 'Tekanan hidrostatis di dasar kolam berisi air setinggi 2 m (ρ = 1000 kg/m³, g = 10 m/s²) adalah...',
    options: [
      { id: 'A', text: '200 Pa' },
      { id: 'B', text: '2.000 Pa' },
      { id: 'C', text: '20.000 Pa' },
      { id: 'D', text: '200.000 Pa' },
    ],
    correct: 'C',
    feedbackCorrect: 'Tepat! P = ρgh = 1000 × 10 × 2 = 20.000 Pa.',
    feedbackWrong: 'Hitung: P = ρgh = 1000 × 10 × 2.',
  },

  /* ---------- B. BENAR/SALAH (4) ---------- */
  {
    id: 6, type: 'true-false', category: 'konsep', xp: 12,
    prompt: 'Perhatikan pernyataan tentang tekanan hidrostatis.',
    statements: [
      { text: 'Tekanan hidrostatis bergantung pada volume total fluida di wadah.', correct: 'S' },
      { text: 'Tekanan hidrostatis bertambah ketika kedalaman bertambah.', correct: 'B' },
    ],
    feedbackCorrect: '(a) Salah — bergantung pada ρ, g, h bukan volume. (b) Benar — P sebanding dengan h.',
    feedbackWrong: 'Cermati: P = ρgh tidak memuat volume. Dan P sebanding dengan h.',
  },
  {
    id: 7, type: 'true-false', category: 'konsep', xp: 12,
    prompt: 'Perhatikan pernyataan berikut.',
    statements: [
      { text: 'Dalam fluida yang sama pada kedalaman yang sama, tekanan hidrostatis sama besar meski bentuk wadah berbeda.', correct: 'B' },
      { text: 'Massa jenis fluida tidak memengaruhi tekanan hidrostatis.', correct: 'S' },
    ],
    feedbackCorrect: '(a) Benar — sesuai P = ρgh yang tidak bergantung bentuk. (b) Salah — ρ muncul di rumus.',
    feedbackWrong: 'Ingat: P = ρgh bergantung pada ρ. Dan bentuk wadah tidak muncul.',
  },
  {
    id: 8, type: 'true-false', category: 'konsep', xp: 12,
    prompt: 'Pernyataan tentang tekanan hidrostatis.',
    statements: [
      { text: 'Di permukaan fluida terbuka (h = 0), tekanan hidrostatis relatif terhadap permukaan sama dengan nol.', correct: 'B' },
      { text: 'Tekanan hidrostatis pada suatu titik bergantung pada arah pengukuran (atas, bawah, samping).', correct: 'S' },
    ],
    feedbackCorrect: '(a) Benar — P = ρgh = 0 saat h = 0. (b) Salah — tekanan adalah skalar, sama ke segala arah.',
    feedbackWrong: 'Tekanan = besaran skalar (tanpa arah); pada h = 0 → P = 0 Pa.',
  },
  {
    id: 9, type: 'true-false', category: 'aplikasi', xp: 12,
    prompt: 'Perhatikan pernyataan berikut.',
    statements: [
      { text: 'Jika percepatan gravitasi diperkecil, tekanan hidrostatis pada kedalaman tertentu juga mengecil.', correct: 'B' },
      { text: 'Tekanan hidrostatis dan gaya tekanan adalah besaran yang sama.', correct: 'S' },
    ],
    feedbackCorrect: '(a) Benar — P sebanding dengan g. (b) Salah — tekanan = gaya/luas, satuan berbeda.',
    feedbackWrong: 'P = ρgh → P sebanding dengan g. Tekanan ≠ gaya (satuan berbeda).',
  },

  /* ---------- C. PG KOMPLEKS (4) ---------- */
  {
    id: 10, type: 'mc-complex', category: 'konsep', xp: 15,
    prompt: 'Manakah pernyataan yang BENAR tentang tekanan hidrostatis? (Pilih SEMUA yang benar)',
    options: [
      { id: 'A', text: 'Merupakan besaran skalar' },
      { id: 'B', text: 'Arahnya selalu ke bawah' },
      { id: 'C', text: 'Bergantung pada kedalaman' },
      { id: 'D', text: 'Bergantung pada massa jenis fluida' },
      { id: 'E', text: 'Satuannya Newton' },
    ],
    correct: ['A', 'C', 'D'],
    feedbackCorrect: 'Tepat! Skalar (A), bergantung h (C) dan ρ (D).',
    feedbackWrong: 'Periksa: apakah tekanan punya arah? Satuannya Newton atau Pascal?',
  },
  {
    id: 11, type: 'mc-complex', category: 'konsep', xp: 15,
    prompt: 'Sebuah bejana berisi air. Manakah pernyataan yang benar? (Pilih SEMUA)',
    options: [
      { id: 'A', text: 'Semakin dalam, tekanan hidrostatis semakin besar' },
      { id: 'B', text: 'Tekanan di dasar bergantung pada luas dasar' },
      { id: 'C', text: 'Di permukaan air (h = 0), tekanan hidrostatis = 0' },
      { id: 'D', text: 'Tekanan hidrostatis tidak bergantung pada bentuk wadah' },
      { id: 'E', text: 'Tekanan hidrostatis bergantung pada volume total air' },
    ],
    correct: ['A', 'C', 'D'],
    feedbackCorrect: 'Tepat! A, C, D benar. P = ρgh tidak memuat luas atau volume.',
    feedbackWrong: 'Ingat P = ρgh — tidak memuat luas dasar atau volume total.',
  },
  {
    id: 12, type: 'mc-complex', category: 'konsep', xp: 15,
    prompt: 'Manakah yang termasuk faktor yang MEMENGARUHI tekanan hidrostatis? (Pilih SEMUA)',
    options: [
      { id: 'A', text: 'Kedalaman (h)' },
      { id: 'B', text: 'Massa jenis fluida (ρ)' },
      { id: 'C', text: 'Percepatan gravitasi (g)' },
      { id: 'D', text: 'Bentuk wadah' },
      { id: 'E', text: 'Warna fluida' },
    ],
    correct: ['A', 'B', 'C'],
    feedbackCorrect: 'Tepat! Ketiganya (h, ρ, g) adalah faktor utama dalam P = ρgh.',
    feedbackWrong: 'Perhatikan P = ρgh. Hanya A, B, C yang muncul.',
  },
  {
    id: 13, type: 'mc-complex', category: 'penalaran', xp: 15,
    prompt: 'Perhatikan P = ρgh. Manakah pernyataan yang BENAR? (Pilih SEMUA)',
    options: [
      { id: 'A', text: 'P sebanding dengan h jika ρ dan g tetap' },
      { id: 'B', text: 'P sebanding dengan ρ jika h dan g tetap' },
      { id: 'C', text: 'P berbanding terbalik dengan g' },
      { id: 'D', text: 'Jika h diperbesar 2×, P menjadi 4×' },
      { id: 'E', text: 'Satuan P adalah Pascal' },
    ],
    correct: ['A', 'B', 'E'],
    feedbackCorrect: 'Tepat! A, B, E benar. Jika h 2×, P juga 2× (bukan 4×).',
    feedbackWrong: 'Periksa C dan D: hubungan linear (bukan kuadratik atau terbalik).',
  },

  /* ---------- D. MENJODOHKAN (3) ---------- */
  {
    id: 14, type: 'matching', category: 'konsep', xp: 15,
    prompt: 'Jodohkan besaran dengan satuannya.',
    pairs: [
      { left: 'Tekanan hidrostatis (P)', right: 'Pascal (Pa)' },
      { left: 'Massa jenis (ρ)', right: 'kg/m³' },
      { left: 'Kedalaman (h)', right: 'meter (m)' },
      { left: 'Percepatan gravitasi (g)', right: 'm/s²' },
    ],
    feedbackCorrect: 'Pasangan tepat: P→Pa, ρ→kg/m³, h→m, g→m/s².',
    feedbackWrong: 'Beberapa pasangan belum tepat. Periksa satuan SI untuk tiap besaran.',
  },
  {
    id: 15, type: 'matching', category: 'konsep', xp: 15,
    prompt: 'Jodohkan besaran dengan definisinya.',
    pairs: [
      { left: 'Tekanan hidrostatis', right: 'Tekanan akibat berat fluida di atas suatu titik' },
      { left: 'Massa jenis', right: 'Massa per satuan volume' },
      { left: 'Kedalaman', right: 'Jarak vertikal dari permukaan fluida ke titik' },
      { left: 'Gaya', right: 'Dorongan atau tarikan yang dapat mengubah gerak benda' },
    ],
    feedbackCorrect: 'Semua pasangan sesuai definisi standar.',
    feedbackWrong: 'Cek kembali definisi tiap besaran.',
  },
  {
    id: 16, type: 'matching', category: 'aplikasi', xp: 15,
    prompt: 'Jodohkan penerapan dengan prinsip tekanan hidrostatis.',
    pairs: [
      { left: 'Bendungan lebih tebal di bawah', right: 'Tekanan bertambah dengan kedalaman' },
      { left: 'Menara air dibangun tinggi', right: 'Ketinggian air menentukan tekanan di pipa' },
      { left: 'Kapal selam punya batas kedalaman', right: 'Tekanan sangat besar di kedalaman ekstrem' },
      { left: 'Telinga sakit saat menyelam dalam', right: 'Tekanan air meningkat seiring kedalaman' },
    ],
    feedbackCorrect: 'Semua penerapan menggunakan prinsip P = ρgh.',
    feedbackWrong: 'Kaitkan tiap situasi dengan variabel h dalam P = ρgh.',
  },

  /* ---------- E. ISIAN SINGKAT (4) ---------- */
  {
    id: 17, type: 'fill', category: 'konsep', xp: 10,
    prompt: 'Satuan tekanan hidrostatis dalam Sistem Internasional (SI) adalah ...',
    accepted: ['pascal', 'pa'],
    placeholder: 'Ketik jawabanmu',
    feedbackCorrect: 'Benar! Satuannya Pascal (Pa), setara dengan N/m².',
    feedbackWrong: 'Satuan tekanan adalah Pascal (Pa) — sama seperti satuan tekanan lainnya.',
  },
  {
    id: 18, type: 'fill', category: 'konsep', xp: 10,
    prompt: 'Tekanan hidrostatis pada kedalaman h dirumuskan sebagai P = ...',
    accepted: ['ρgh', 'ρ g h', 'pgh', 'rho g h', 'ρ*g*h', 'rho.gh'],
    placeholder: 'Contoh: xxx',
    feedbackCorrect: 'Benar! P = ρgh.',
    feedbackWrong: 'Rumusnya P = ρ × g × h, ditulis P = ρgh.',
  },
  {
    id: 19, type: 'fill', category: 'aplikasi', xp: 10,
    prompt: 'Jika kedalaman dilipatgandakan (ρ dan g tetap), tekanan hidrostatis menjadi ... kali lipat.',
    accepted: ['2', 'dua', '2x', '2 kali', 'dua kali'],
    placeholder: 'Ketik angka',
    feedbackCorrect: 'Benar! P sebanding dengan h, jadi 2× lipat.',
    feedbackWrong: 'P sebanding dengan h → jika h 2×, P juga 2×.',
  },
  {
    id: 20, type: 'fill', category: 'konsep', xp: 10,
    prompt: 'Di permukaan air terbuka (h = 0), tekanan hidrostatis (relatif terhadap permukaan) bernilai ... Pa.',
    accepted: ['0', 'nol', '0 pa', 'nol pa', '0pa'],
    placeholder: 'Ketik angka',
    feedbackCorrect: 'Benar! h = 0 → P = 0 Pa (tekanan hidrostatis relatif terhadap permukaan).',
    feedbackWrong: 'Substitusi h = 0 ke P = ρgh. Hasilnya 0 Pa.',
  },

  /* ---------- F. ANALISIS DATA & NUMERIK (3) ---------- */
  {
    id: 21, type: 'mc', category: 'penalaran', xp: 10,
    prompt: (
      <div>
        <p className="mb-2">Data eksperimen tekanan hidrostatis pada air (ρ = 1000 kg/m³, g = 10 m/s²):</p>
        <table className="text-xs font-mono bg-sky-50 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-sky-100">
              <th className="px-3 py-1 text-left">h (m)</th>
              <th className="px-3 py-1 text-right">P (Pa)</th>
            </tr>
          </thead>
          <tbody>
            {[[1, 10000], [2, 20000], [3, 30000], [4, 40000]].map(([h, p]) => (
              <tr key={h}>
                <td className="px-3 py-0.5">{h}</td>
                <td className="px-3 py-0.5 text-right">{p.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2">Kesimpulan yang paling tepat adalah...</p>
      </div>
    ),
    options: [
      { id: 'A', text: 'P berbanding terbalik dengan h' },
      { id: 'B', text: 'P berbanding lurus dengan h' },
      { id: 'C', text: 'P tidak bergantung pada h' },
      { id: 'D', text: 'P sebanding dengan kuadrat h' },
    ],
    correct: 'B',
    feedbackCorrect: 'Tepat! Setiap kenaikan h sebesar 1 m menambah P sebesar 10.000 Pa — hubungan linear.',
    feedbackWrong: 'Amati pola: saat h 2×, P juga 2×. Hubungan linear.',
  },
  {
    id: 22, type: 'numeric', category: 'aplikasi', xp: 15,
    prompt: 'Hitung tekanan hidrostatis pada kedalaman 5 m dalam air tawar (ρ = 1000 kg/m³, g = 10 m/s²).',
    correct: 50000, tolerance: 100, unit: 'Pa',
    feedbackCorrect: 'Benar! P = 1000 × 10 × 5 = 50.000 Pa = 50 kPa.',
    feedbackWrong: 'Gunakan P = ρgh = 1000 × 10 × 5.',
  },
  {
    id: 23, type: 'numeric', category: 'penalaran', xp: 15,
    prompt: 'Sebuah titik di dalam minyak (ρ = 800 kg/m³, g = 10 m/s²) mengalami tekanan hidrostatis 24.000 Pa. Berapa kedalaman titik tersebut?',
    correct: 3, tolerance: 0.05, unit: 'm',
    feedbackCorrect: 'Benar! h = P / (ρg) = 24.000 / (800 × 10) = 3 m.',
    feedbackWrong: 'Gunakan h = P / (ρg). Masukkan P = 24.000, ρ = 800, g = 10.',
  },

  /* ---------- G. PENALARAN/ESAI (2) ---------- */
  {
    id: 24, type: 'essay', category: 'penalaran', xp: 25,
    prompt: 'Mengapa dinding bendungan dibuat lebih tebal di bagian bawah? Jelaskan menggunakan konsep tekanan hidrostatis.',
    keywords: ['tekanan', 'kedalaman', 'ρgh', 'bertambah', 'besar', 'bawah'],
    minKeywords: 3, minLength: 40,
    feedbackCorrect: 'Jawaban baik! Tekanan hidrostatis bertambah dengan kedalaman (P = ρgh), sehingga bagian bawah bendungan menerima tekanan lebih besar dan harus dibuat lebih kuat.',
    feedbackWrong: 'Jawaban yang baik menyebut: tekanan hidrostatis bertambah dengan kedalaman (P = ρgh), sehingga bagian bawah menerima tekanan lebih besar.',
  },
  {
    id: 25, type: 'essay', category: 'penalaran', xp: 25,
    prompt: 'Dua titik pada kedalaman sama dalam fluida sama memiliki tekanan hidrostatis sama, meskipun bentuk wadahnya berbeda. Mengapa?',
    keywords: ['ρgh', 'kedalaman', 'sama', 'tidak bergantung', 'bentuk', 'massa jenis'],
    minKeywords: 3, minLength: 40,
    feedbackCorrect: 'Benar! Tekanan hidrostatis hanya bergantung pada ρ, g, dan h (P = ρgh). Bentuk wadah dan volume total tidak memengaruhi tekanan pada titik tertentu.',
    feedbackWrong: 'Kunci: P = ρgh hanya bergantung pada ρ, g, h — bukan pada bentuk atau volume wadah.',
  },
];

/* =================================================================
   GRADING
================================================================= */
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function gradeQ(q: Q, answer: string | undefined): boolean {
  if (answer === undefined || answer === '') return false;
  switch (q.type) {
    case 'mc':
      return answer === q.correct;
    case 'mc-complex': {
      const a = answer.split(',').sort().join(',');
      const c = [...q.correct].sort().join(',');
      return a === c;
    }
    case 'true-false': {
      const parts = answer.split(',');
      if (parts.length !== q.statements.length) return false;
      return q.statements.every((s, i) => parts[i] === s.correct);
    }
    case 'matching': {
      try {
        const map = JSON.parse(answer) as Record<string, string>;
        return q.pairs.every((p) => map[p.left] === p.right);
      } catch {
        return false;
      }
    }
    case 'fill': {
      const n = normalize(answer);
      return q.accepted.some((a) => normalize(a) === n);
    }
    case 'numeric': {
      const num = parseFloat(answer.replace(/[^\d.-]/g, ''));
      if (isNaN(num)) return false;
      return Math.abs(num - q.correct) <= q.tolerance;
    }
    case 'essay': {
      const text = answer.toLowerCase();
      if (text.length < q.minLength) return false;
      const found = q.keywords.filter((k) => text.includes(k.toLowerCase())).length;
      return found >= q.minKeywords;
    }
  }
}

const SECTION_INFO: { start: number; end: number; label: string; icon: string }[] = [
  { start: 1, end: 5, label: 'A. Konsep Dasar', icon: '🧠' },
  { start: 6, end: 9, label: 'B. Benar / Salah', icon: '⚖️' },
  { start: 10, end: 13, label: 'C. Pilihan Ganda Kompleks', icon: '🎯' },
  { start: 14, end: 16, label: 'D. Menjodohkan', icon: '🔗' },
  { start: 17, end: 20, label: 'E. Isian Singkat', icon: '✏️' },
  { start: 21, end: 23, label: 'F. Analisis & Numerik', icon: '📊' },
  { start: 24, end: 25, label: 'G. Penalaran', icon: '💭' },
];

function getSection(qid: number) {
  return SECTION_INFO.find((s) => qid >= s.start && qid <= s.end)!;
}

/* =================================================================
   KOMPONEN
================================================================= */
export const Mission08: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { state, saveQuizAnswer, setQuizScore, addXp, completeMission, addBadge } = useStore();
  const [current, setCurrent] = useState(0);
  const [feedbackShown, setFeedbackShown] = useState(false);

  const q = QS[current];
  const section = getSection(q.id);
  const stored = state.quizAnswers[q.id];

  const score = useMemo(
    () => QS.reduce((acc, q) => acc + (gradeQ(q, state.quizAnswers[q.id]) ? 1 : 0), 0),
    [state.quizAnswers]
  );
  const answeredCount = QS.filter((q) => state.quizAnswers[q.id] !== undefined).length;

  const submit = (answer: string) => {
    saveQuizAnswer(q.id, answer);
    setFeedbackShown(true);
    if (gradeQ(q, answer)) addXp(q.xp);
  };

  const next = () => {
    setFeedbackShown(false);
    if (current < QS.length - 1) setCurrent(current + 1);
  };

  const prev = () => {
    setFeedbackShown(false);
    if (current > 0) setCurrent(current - 1);
  };

  const finish = () => {
    setQuizScore(score);
    addXp(50);
    completeMission(8 as MissionId);
    addBadge('🏆 Hydro Master');
    onComplete();
  };

  const answered = stored !== undefined;
  const isCorrect = answered && gradeQ(q, stored);
  const allAnswered = answeredCount === QS.length;
  const percent = Math.round((score / QS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          MISI 08 · EVALUATE
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">
          Hydro Challenge
        </h1>
        <p className="text-slate-600 mt-2">
          25 soal dari 6 tipe berbeda untuk menguji pemahamanmu secara menyeluruh.
        </p>
      </div>

      {/* PROGRESS */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 h-2 bg-sky-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 transition-all"
            style={{ width: `${(answeredCount / QS.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-sky-700 whitespace-nowrap">
          {answeredCount}/{QS.length}
        </span>
      </div>

      {/* SECTION NAV */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {SECTION_INFO.map((s) => {
          const isCurrent = q.id >= s.start && q.id <= s.end;
          const done = QS.filter((qq) => qq.id >= s.start && qq.id <= s.end && state.quizAnswers[qq.id] !== undefined).length;
          const total = s.end - s.start + 1;
          return (
            <button
              key={s.label}
              onClick={() => {
                const idx = QS.findIndex((x) => x.id === s.start);
                if (idx !== -1) {
                  setCurrent(idx);
                  setFeedbackShown(false);
                }
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isCurrent
                  ? 'bg-sky-500 text-white'
                  : done === total
                  ? 'bg-cyan-100 text-cyan-700'
                  : 'bg-white text-slate-600 border border-sky-100 hover:border-sky-300'
              }`}
            >
              {s.icon} {s.label}
            </button>
          );
        })}
      </div>

      {/* QUESTION CARD */}
      <Card>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
            {section.icon} {section.label}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            q.category === 'konsep' ? 'bg-sky-100 text-sky-700'
              : q.category === 'aplikasi' ? 'bg-cyan-100 text-cyan-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {q.category === 'konsep' ? 'Konsep' : q.category === 'aplikasi' ? 'Aplikasi' : 'Penalaran'}
          </span>
          <span className="text-xs text-slate-500 ml-auto">
            Soal {current + 1}/{QS.length} · {q.xp} XP
          </span>
        </div>

        <div className="font-semibold text-slate-800 text-lg mb-4">{q.prompt}</div>

        {/* RENDER BY TYPE */}
        {/* RENDER BY TYPE */}
{q.type === 'mc' && (
  <MCRender key={q.id} q={q} stored={stored} answered={answered} onSubmit={submit} />
)}
{q.type === 'mc-complex' && (
  <MCComplexRender key={q.id} q={q} stored={stored} answered={answered} onSubmit={submit} />
)}
{q.type === 'true-false' && (
  <TFRender key={q.id} q={q} stored={stored} answered={answered} onSubmit={submit} />
)}
{q.type === 'matching' && (
  <MatchingRender key={q.id} q={q} stored={stored} answered={answered} onSubmit={submit} />
)}
{q.type === 'fill' && (
  <FillRender key={q.id} q={q} stored={stored} answered={answered} onSubmit={submit} />
)}
{q.type === 'numeric' && (
  <NumericRender key={q.id} q={q} stored={stored} answered={answered} onSubmit={submit} />
)}
{q.type === 'essay' && (
  <EssayRender key={q.id} q={q} stored={stored} answered={answered} onSubmit={submit} />
)}

        {/* FEEDBACK */}
        {feedbackShown && answered && (
          <div
            className={`mt-4 p-4 rounded-xl text-sm ${
              isCorrect
                ? 'bg-cyan-50 border border-cyan-200 text-cyan-900'
                : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}
          >
            <strong>{isCorrect ? '✓ Benar. ' : 'Perhatikan: '}</strong>
            {isCorrect ? q.feedbackCorrect : q.feedbackWrong}
          </div>
        )}

        {/* NAVIGATION */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={prev} disabled={current === 0}>
            ← Sebelumnya
          </Button>

          <span className="text-xs text-slate-500">
            Skor: <b className="text-sky-700">{score}</b>/{QS.length}
            {answeredCount > 0 && <> ({Math.round((score / answeredCount) * 100)}%)</>}
          </span>

          {current < QS.length - 1 ? (
            <Button size="sm" onClick={next} disabled={!answered}>
              Berikutnya →
            </Button>
          ) : (
            <Button size="sm" onClick={finish} disabled={!allAnswered}>
              Selesai 🏆
            </Button>
          )}
        </div>
      </Card>

      {/* SUMMARY CARD (muncul jika semua dijawab) */}
      {allAnswered && current === QS.length - 1 && (
        <Card className="mt-4 !bg-gradient-to-br !from-sky-500 !to-cyan-600 !border-0 text-white">
          <p className="text-sm opacity-85">Hasil Akhir</p>
          <p className="text-3xl font-black mt-1">
            {percent}% ({score}/{QS.length})
          </p>
          <p className="text-xs opacity-85 mt-1">
            Klik <b>Selesai</b> untuk menyimpan skor & melihat rekap.
          </p>
        </Card>
      )}
    </div>
  );
};

/* =================================================================
   SUB-RENDER PER TIPE SOAL
================================================================= */
const MCRender: React.FC<{ q: MCQ; stored?: string; answered: boolean; onSubmit: (a: string) => void }> = ({
  q, stored, answered, onSubmit,
}) => (
  <div className="space-y-2">
    {q.options.map((o) => {
      const isSel = stored === o.id;
      const showCorrect = answered && o.id === q.correct;
      const showWrong = answered && isSel && o.id !== q.correct;
      return (
        <button
          key={o.id}
          onClick={() => !answered && onSubmit(o.id)}
          disabled={answered}
          className={`w-full text-left p-3 rounded-xl border-2 font-medium transition ${
            showCorrect ? 'bg-cyan-50 border-cyan-400 text-cyan-900'
              : showWrong ? 'bg-rose-50 border-rose-300 text-rose-800'
              : isSel ? 'bg-sky-100 border-sky-400'
              : 'bg-white border-sky-100 hover:border-sky-300'
          }`}
        >
          {showCorrect && <span className="mr-2">✓</span>}
          {showWrong && <span className="mr-2">✗</span>}
          <span className="font-bold mr-2">{o.id}.</span>
          {o.text}
        </button>
      );
    })}
  </div>
);

const MCComplexRender: React.FC<{
  q: MCComplexQ; stored?: string; answered: boolean; onSubmit: (a: string) => void;
}> = ({ q, stored, answered, onSubmit }) => {
  const [sel, setSel] = useState<string[]>(
    stored ? stored.split(',').filter(Boolean) : []
  );

  const toggle = (id: string) => {
    if (answered) return;
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  return (
    <>
      <div className="space-y-2">
        {q.options.map((o) => {
          const isSel = sel.includes(o.id);
          const isCorrect = q.correct.includes(o.id);
          const showCorrect = answered && isCorrect;
          const showWrong = answered && isSel && !isCorrect;
          return (
            <button
              key={o.id}
              onClick={() => toggle(o.id)}
              disabled={answered}
              className={`w-full text-left p-3 rounded-xl border-2 font-medium transition ${
                showCorrect ? 'bg-cyan-50 border-cyan-400 text-cyan-900'
                  : showWrong ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : isSel ? 'bg-sky-100 border-sky-400'
                  : 'bg-white border-sky-100 hover:border-sky-300'
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-5 h-5 mr-3 rounded-md border-2 text-xs font-bold align-middle ${
                  isSel ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300'
                }`}
              >
                {isSel ? '✓' : ''}
              </span>
              <span className="font-bold mr-2">{o.id}.</span>
              {o.text}
            </button>
          );
        })}
      </div>
      {!answered && (
        <Button
          className="mt-3"
          size="sm"
          disabled={sel.length === 0}
          onClick={() => onSubmit([...sel].sort().join(','))}
        >
          Kunci Jawaban ({sel.length} dipilih)
        </Button>
      )}
    </>
  );
};

const TFRender: React.FC<{
  q: TFQ; stored?: string; answered: boolean; onSubmit: (a: string) => void;
}> = ({ q, stored, answered, onSubmit }) => {
  const [ans, setAns] = useState<string[]>(
    stored ? stored.split(',') : q.statements.map(() => '')
  );

  const setAt = (i: number, v: 'B' | 'S') => {
    if (answered) return;
    setAns((a) => a.map((x, idx) => (idx === i ? v : x)));
  };

  const canSubmit = ans.every((a) => a === 'B' || a === 'S') && !answered;

  return (
    <>
      <div className="space-y-3">
        {q.statements.map((s, i) => {
          const chosen = ans[i];
          const isCorrect = answered && chosen === s.correct;
          const isWrong = answered && chosen && chosen !== s.correct;
          return (
            <div
              key={i}
              className={`p-3 rounded-xl border-2 ${
                isCorrect ? 'border-cyan-300 bg-cyan-50'
                  : isWrong ? 'border-rose-300 bg-rose-50'
                  : 'border-sky-100 bg-white'
              }`}
            >
              <p className="text-sm font-medium mb-2">
                ({String.fromCharCode(97 + i)}) {s.text}
              </p>
              <div className="flex gap-2">
                {(['B', 'S'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAt(i, opt)}
                    disabled={answered}
                    className={`px-4 py-1.5 rounded-lg font-bold text-sm border-2 transition ${
                      chosen === opt
                        ? opt === 'B'
                          ? 'bg-cyan-500 text-white border-cyan-500'
                          : 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white border-sky-200 text-slate-600 hover:border-sky-400'
                    }`}
                  >
                    {opt === 'B' ? 'Benar' : 'Salah'}
                  </button>
                ))}
                {answered && (
                  <span className="ml-auto text-xs font-bold self-center">
                    Kunci: {s.correct === 'B' ? 'Benar' : 'Salah'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!answered && (
        <Button
          className="mt-3"
          size="sm"
          disabled={!canSubmit}
          onClick={() => onSubmit(ans.join(','))}
        >
          Kunci Jawaban
        </Button>
      )}
    </>
  );
};

const MatchingRender: React.FC<{
  q: MatchingQ; stored?: string; answered: boolean; onSubmit: (a: string) => void;
}> = ({ q, stored, answered, onSubmit }) => {
  const initial: Record<string, string> = stored ? JSON.parse(stored) : {};
  const [map, setMap] = useState<Record<string, string>>(initial);

  const rights = q.pairs.map((p) => p.right);
  // Rotasi 1 posisi agar tidak identik dengan urutan kiri
  const displayRights = [...rights.slice(1), rights[0]];

  const setPair = (left: string, right: string) => {
    if (answered) return;
    setMap((m) => ({ ...m, [left]: right }));
  };

  const allSet = q.pairs.every((p) => map[p.left]);

  return (
    <>
      <div className="space-y-2">
        {q.pairs.map((p) => {
          const chosen = map[p.left];
          const correct = chosen === p.right;
          return (
            <div
              key={p.left}
              className={`p-3 rounded-xl border-2 ${
                answered
                  ? correct
                    ? 'border-cyan-300 bg-cyan-50'
                    : 'border-rose-300 bg-rose-50'
                  : 'border-sky-100 bg-white'
              }`}
            >
              <p className="text-sm font-bold text-slate-800 mb-2">{p.left}</p>
              <div className="flex flex-wrap gap-1.5">
                {displayRights.map((r) => (
                  <button
                    key={r}
                    onClick={() => setPair(p.left, r)}
                    disabled={answered}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border-2 transition ${
                      chosen === r
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'bg-white border-sky-200 text-slate-600 hover:border-sky-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {answered && !correct && (
                <p className="text-xs mt-2 text-rose-700">
                  Kunci: <b>{p.right}</b>
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!answered && (
        <Button
          className="mt-3"
          size="sm"
          disabled={!allSet}
          onClick={() => onSubmit(JSON.stringify(map))}
        >
          Kunci Jawaban
        </Button>
      )}
    </>
  );
};

const FillRender: React.FC<{
  q: FillQ; stored?: string; answered: boolean; onSubmit: (a: string) => void;
}> = ({ q, stored, answered, onSubmit }) => {
  const [val, setVal] = useState(stored ?? '');
  const ok = gradeQ(q, stored);
  return (
    <>
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        disabled={answered}
        placeholder={q.placeholder ?? 'Ketik jawabanmu'}
        className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none ${
          answered
            ? ok
              ? 'border-cyan-400 bg-cyan-50'
              : 'border-rose-300 bg-rose-50'
            : 'border-sky-100 focus:border-sky-400'
        }`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !answered && val.trim()) onSubmit(val.trim());
        }}
      />
      {!answered && (
        <Button
          className="mt-3"
          size="sm"
          disabled={!val.trim()}
          onClick={() => onSubmit(val.trim())}
        >
          Kunci Jawaban
        </Button>
      )}
      {answered && !ok && (
        <p className="mt-2 text-xs text-rose-700">
          Jawaban yang diterima: <b>{q.accepted[0]}</b>
        </p>
      )}
    </>
  );
};

const NumericRender: React.FC<{
  q: NumericQ; stored?: string; answered: boolean; onSubmit: (a: string) => void;
}> = ({ q, stored, answered, onSubmit }) => {
  const [val, setVal] = useState(stored ?? '');
  const ok = gradeQ(q, stored);
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            disabled={answered}
            placeholder="Ketik angka"
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none pr-16 ${
              answered
                ? ok
                  ? 'border-cyan-400 bg-cyan-50'
                  : 'border-rose-300 bg-rose-50'
                : 'border-sky-100 focus:border-sky-400'
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !answered && val.trim()) onSubmit(val.trim());
            }}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            {q.unit}
          </span>
        </div>
        {!answered && (
          <Button size="sm" disabled={!val.trim()} onClick={() => onSubmit(val.trim())}>
            Kunci
          </Button>
        )}
      </div>
      {answered && !ok && (
        <p className="mt-2 text-xs text-rose-700">
          Jawaban benar: <b>{q.correct.toLocaleString('id-ID')} {q.unit}</b>
        </p>
      )}
    </>
  );
};

const EssayRender: React.FC<{
  q: EssayQ; stored?: string; answered: boolean; onSubmit: (a: string) => void;
}> = ({ q, stored, answered, onSubmit }) => {
  const [val, setVal] = useState(stored ?? '');
  const ok = gradeQ(q, stored);
  const len = val.trim().length;
  const enough = len >= q.minLength;
  return (
    <>
      <textarea
        value={val}
        onChange={(e) => setVal(e.target.value)}
        disabled={answered}
        rows={5}
        placeholder="Tulis jawabanmu di sini..."
        className={`w-full px-4 py-3 rounded-xl border-2 bg-white focus:outline-none resize-y text-sm ${
          answered
            ? ok
              ? 'border-cyan-400 bg-cyan-50'
              : 'border-rose-300 bg-rose-50'
            : 'border-sky-100 focus:border-sky-400'
        }`}
      />
      <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
        <span>
          Minimal {q.minLength} karakter ({len} karakter)
          {enough ? ' ✓' : ''}
        </span>
        {!answered && (
          <Button size="sm" disabled={!enough} onClick={() => onSubmit(val.trim())}>
            Kunci Jawaban
          </Button>
        )}
      </div>
    </>
  );
};
