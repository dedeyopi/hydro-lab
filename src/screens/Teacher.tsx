import React from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';

export const TeacherScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, unlockAllMissions, resetAll, toggleTeacherMode } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>← Kembali</Button>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800">👩‍🏫 Mode Guru</h1>
      </div>

      <Card className="mb-6 !bg-sky-50 !border-sky-200">
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm" onClick={unlockAllMissions}>🔓 Buka Semua Misi (Demo)</Button>
          <Button size="sm" variant="danger" onClick={resetAll}>Reset Semua Data</Button>
          <span className="text-xs text-slate-500">
            Status: {state.teacherMode ? 'Aktif' : 'Nonaktif'} ·
            Misi selesai: {state.completedMissions.length}/7
          </span>
          <Button size="sm" variant="ghost" onClick={toggleTeacherMode}>Toggle Demo Mode</Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <h2 className="font-bold text-slate-800 mb-3">🎯 Tujuan Pembelajaran</h2>
          <ul className="text-sm text-slate-700 space-y-1.5 list-disc pl-5">
            <li>Menjelaskan secara kualitatif apa itu tekanan hidrostatis.</li>
            <li>Menjelaskan mengapa tekanan fluida bertambah dengan kedalaman.</li>
            <li>Mengidentifikasi faktor-faktor yang memengaruhi tekanan hidrostatis.</li>
            <li>Menggunakan persamaan P = ρgh untuk perhitungan sederhana.</li>
            <li>Membandingkan tekanan pada kedalaman dan fluida berbeda.</li>
            <li>Menafsirkan data eksperimen dan menarik kesimpulan.</li>
            <li>Menerapkan konsep pada situasi nyata.</li>
          </ul>
        </Card>

        <Card>
          <h2 className="font-bold text-slate-800 mb-3">🧭 Alur Pembelajaran (5E)</h2>
          <ol className="text-sm text-slate-700 space-y-1.5">
            <li><b>ENGAGE</b> — Misi 01: Misteri Penyelam</li>
            <li><b>EXPLORE</b> — Misi 02–03: Eksplorasi & Eksperimen</li>
            <li><b>EXPLAIN</b> — Misi 04: Temukan Polanya</li>
            <li><b>ELABORATE</b> — Misi 05–06: Lab & Engineer</li>
            <li><b>EVALUATE</b> — Misi 07: Hydro Challenge</li>
          </ol>
        </Card>

        <Card>
          <h2 className="font-bold text-slate-800 mb-3">📅 Saran Penggunaan Kelas</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div><b>Pertemuan 1:</b> Misi 01 & 02</div>
            <div><b>Pertemuan 2:</b> Misi 03 (Pengumpulan Data)</div>
            <div><b>Pertemuan 3:</b> Misi 04 & 05</div>
            <div><b>Pertemuan 4:</b> Misi 06, 07 & Refleksi</div>
          </div>
        </Card>

        <Card>
          <h2 className="font-bold text-slate-800 mb-3">💬 Pertanyaan Pemandu</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <div>
              <b>Sebelum eksperimen:</b>
              <ul className="list-disc pl-5 mt-1">
                <li>Apa prediksimu?</li>
                <li>Variabel apa yang akan kita ubah?</li>
              </ul>
            </div>
            <div>
              <b>Saat eksperimen:</b>
              <ul className="list-disc pl-5 mt-1">
                <li>Apa yang kamu amati?</li>
                <li>Apakah hasilnya sesuai prediksi?</li>
                <li>Data apa yang mendukung jawabanmu?</li>
              </ul>
            </div>
            <div>
              <b>Setelah eksperimen:</b>
              <ul className="list-disc pl-5 mt-1">
                <li>Apa pola yang terlihat?</li>
                <li>Jika kedalaman dua kali lipat, apa yang terjadi?</li>
                <li>Bagaimana jika cairannya berbeda?</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="font-bold text-slate-800 mb-3">📋 Kunci Jawaban Hydro Challenge</h2>
          <div className="text-sm text-slate-700 space-y-1.5">
            <p>1. Berat fluida di atas titik bertambah.</p>
            <p>2. Volume total fluida.</p>
            <p>3. Sama besar.</p>
            <p>4. Lebih besar (air laut &gt; minyak).</p>
            <p>5. P = 1000 × 10 × 4 = 40.000 Pa.</p>
            <p>6. Tekanan berbanding lurus dengan kedalaman.</p>
            <p>7. Karena tekanan hidrostatis lebih besar di bawah.</p>
            <p>8. Perbedaan ketinggian menciptakan tekanan hidrostatis.</p>
            <p>9. Tekanan hidrostatis bergantung pada bentuk wadah (miskonsepsi).</p>
            <p>10. Sama, karena fluida sama dan kedalaman sama.</p>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="font-bold text-slate-800 mb-3">⚠️ Miskonsepsi Umum & Koreksi</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p><b>M1:</b> "Semakin dalam, tekanan semakin besar karena air menekan dari atas." → Fluida menekan ke <i>segala arah</i>. Tekanan hidrostatis terkait dengan berat fluida di atas titik dan sifat fluida.</p>
            <p><b>M2:</b> "Tekanan hidrostatis hanya bergantung pada banyaknya air." → Tergantung ρ, g, dan h.</p>
            <p><b>M3:</b> "Volume lebih besar = tekanan lebih besar." → Pada kedalaman sama dalam fluida sama, tekanan bergantung kedalaman, bukan volume.</p>
            <p><b>M4:</b> "Bentuk wadah menentukan tekanan." → Bentuk wadah tidak muncul dalam P = ρgh.</p>
            <p><b>M5:</b> "Tekanan sama dengan gaya." → Tekanan = gaya per satuan luas (P = F/A), berbeda dari gaya.</p>
            <p><b>M6:</b> "Tekanan air hanya ke bawah." → Fluida menekan ke segala arah.</p>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="font-bold text-slate-800 mb-3">📊 Kisi-kisi Asesmen</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sky-50">
                <tr>
                  <th className="text-left px-3 py-2">Kategori</th>
                  <th className="text-left px-3 py-2">Porsi</th>
                  <th className="text-left px-3 py-2">Contoh</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-sky-100"><td className="px-3 py-2">Konsep</td><td className="px-3 py-2">30%</td><td className="px-3 py-2">Soal 1, 2, 3, 9</td></tr>
                <tr className="border-t border-sky-100"><td className="px-3 py-2">Aplikasi / Hitungan</td><td className="px-3 py-2">40%</td><td className="px-3 py-2">Soal 4, 5</td></tr>
                <tr className="border-t border-sky-100"><td className="px-3 py-2">Penalaran</td><td className="px-3 py-2">30%</td><td className="px-3 py-2">Soal 6, 7, 8, 10</td></tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};