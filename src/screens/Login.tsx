import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';
import { CLASS_OPTIONS } from '../utils';

export const LoginScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { state, setProfile, addXp } = useStore();
  const [name, setName] = useState(state.profile?.name ?? '');
  const [className, setClassName] = useState(state.profile?.className ?? '');
  const [customClass, setCustomClass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalClass = className === 'Lainnya' ? customClass.trim() : className;
    if (!name.trim()) return setError('Mohon isi nama panggilanmu.');
    if (!finalClass) return setError('Mohon pilih kelasmu.');
    setProfile({ name: name.trim(), className: finalClass });
    addXp(0);
    onDone();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-cyan-600 text-white text-4xl shadow-xl shadow-sky-500/30 mb-4 float-slow">
            💧
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">HYDRO LAB</h1>
          <p className="text-sky-700 font-semibold mt-1">Misi Menyelidiki Tekanan di Dalam Air</p>
        </div>

        <Card className="!p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Kartu Investigator</h2>
            <p className="text-sm text-slate-500 mt-1">
              Isi datamu untuk memulai penyelidikan. Tidak perlu membuat akun.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Nama Panggilan
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                placeholder="Contoh: Rani"
                maxLength={30}
                className="w-full px-4 py-3 rounded-xl border-2 border-sky-100 bg-white focus:border-sky-400 focus:outline-none transition text-slate-800"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kelas</label>
              <div className="grid grid-cols-4 gap-2">
                {CLASS_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setClassName(c); setError(''); }}
                    className={`py-2.5 rounded-xl font-bold transition border-2 ${
                      className === c
                        ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white border-transparent shadow-md shadow-sky-500/30'
                        : 'bg-white text-sky-700 border-sky-100 hover:border-sky-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { setClassName('Lainnya'); setError(''); }}
                className={`mt-2 w-full py-2.5 rounded-xl font-bold transition border-2 ${
                  className === 'Lainnya'
                    ? 'bg-gradient-to-br from-sky-500 to-cyan-500 text-white border-transparent'
                    : 'bg-white text-sky-700 border-sky-100 hover:border-sky-300'
                }`}
              >
                Kelas Lainnya
              </button>
              {className === 'Lainnya' && (
                <input
                  type="text"
                  value={customClass}
                  onChange={(e) => { setCustomClass(e.target.value); setError(''); }}
                  placeholder="Tulis kelasmu, contoh: 9-IPA-1"
                  className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-sky-100 bg-white focus:border-sky-400 focus:outline-none transition"
                />
              )}
            </div>

            {error && (
              <div role="alert" className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full">
              Masuk Laboratorium 🌊
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6">
          Progresmu akan tersimpan otomatis di perangkat ini.
        </p>
      </div>
    </div>
  );
};