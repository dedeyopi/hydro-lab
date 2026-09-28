import React, { useState } from 'react';
import { useStore } from '../store';
import { Button, Card } from '../components/UI';

const QUESTIONS = [
  'Mengapa tekanan hidrostatis bertambah ketika kedalaman bertambah?',
  'Faktor apa saja yang memengaruhi tekanan hidrostatis?',
  'Apa hubungan massa jenis fluida dengan tekanan hidrostatis?',
  'Apa yang paling mengejutkanmu dari eksperimen ini?',
  'Di mana kamu menemukan konsep tekanan hidrostatis dalam kehidupan sehari-hari?',
];

const CONFIDENCE = [
  { id: 'paham-', emoji: '😕', label: 'Masih bingung' },
  { id: 'paham', emoji: '🙂', label: 'Mulai memahami' },
  { id: 'paham+', emoji: '😀', label: 'Memahami' },
  { id: 'paham++', emoji: '🤩', label: 'Sangat memahami' },
];

export const ReflectionScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { state, saveReflection, setConfidence, addXp } = useStore();

  const handleSubmit = () => {
    addXp(20);
    onComplete();
  };

  const allFilled = QUESTIONS.every((_, i) => (state.reflection[`q${i}`] ?? '').trim().length > 0) && state.confidence;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs font-bold tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
          REFLEKSI
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mt-3">Refleksi Investigator</h1>
        <p className="text-slate-600 mt-2">
          Luangkan waktu sejenak untuk merenungkan perjalanan penyelidikanmu.
        </p>
      </div>

      <div className="space-y-4">
        {QUESTIONS.map((q, i) => (
          <Card key={i}>
            <label htmlFor={`r${i}`} className="block font-semibold text-slate-800 mb-2">
              {i + 1}. {q}
            </label>
            <textarea
              id={`r${i}`}
              value={state.reflection[`q${i}`] ?? ''}
              onChange={(e) => saveReflection(`q${i}`, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border-2 border-sky-100 bg-white focus:border-sky-400 focus:outline-none resize-y text-sm"
              placeholder="Tulis jawabanmu di sini..."
            />
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="font-bold text-slate-800 mb-3">Seberapa yakin kamu memahami tekanan hidrostatis?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CONFIDENCE.map((c) => (
            <button
              key={c.id}
              onClick={() => setConfidence(c.id)}
              className={`p-4 rounded-xl border-2 transition text-center ${
                state.confidence === c.id
                  ? 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white border-transparent shadow-lg'
                  : 'bg-white border-sky-100 hover:border-sky-300'
              }`}
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="text-xs font-bold mt-1">{c.label}</div>
            </button>
          ))}
        </div>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button size="lg" disabled={!allFilled} onClick={handleSubmit}>
          Lihat Hasil Akhir →
        </Button>
      </div>
    </div>
  );
};