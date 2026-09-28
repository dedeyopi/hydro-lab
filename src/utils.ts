import { Fluid } from './types';

export const calculatePressure = (density: number, gravity: number, depth: number): number =>
  density * gravity * depth;

export const formatPressure = (pa: number): string => {
  if (pa === 0) return '0 Pa';
  if (Math.abs(pa) >= 1000) {
    const kpa = pa / 1000;
    return `${kpa.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kPa`;
  }
  return `${pa.toLocaleString('id-ID', { maximumFractionDigits: 0 })} Pa`;
};

export const formatNumber = (n: number, decimals = 0): string =>
  n.toLocaleString('id-ID', { maximumFractionDigits: decimals });

export const FLUIDS: Fluid[] = [
  { id: 'fresh', name: 'Air Tawar', density: 1000, color: '#38bdf8', colorLight: '#bae6fd' },
  { id: 'sea', name: 'Air Laut', density: 1025, color: '#0284c7', colorLight: '#7dd3fc' },
  { id: 'oil', name: 'Minyak', density: 800, color: '#f59e0b', colorLight: '#fde68a' },
];

export const getFluidById = (id: string): Fluid =>
  FLUIDS.find((f) => f.id === id) ?? FLUIDS[0];

export const MISSION_INFO: Record<number, { title: string; desc: string; duration: string; phase: string }> = {
  1: { title: 'Misteri Penyelam', desc: 'Amati fenomena dan buat prediksimu.', duration: '5 menit', phase: 'ENGAGE' },
  2: { title: 'Apa yang Menekan?', desc: 'Jelajahi tekanan di dalam air.', duration: '7 menit', phase: 'EXPLORE' },
  3: { title: 'Eksperimen Kedalaman', desc: 'Ukur tekanan pada berbagai kedalaman.', duration: '12 menit', phase: 'EXPLORE' },
  4: { title: 'Temukan Polanya', desc: 'Rumuskan hubungan dari data eksperimen.', duration: '10 menit', phase: 'EXPLAIN' },
  5: { title: 'Laboratorium Fluida', desc: 'Uji pengaruh massa jenis dan gravitasi.', duration: '15 menit', phase: 'ELABORATE' },
  6: { title: 'Hydro Engineer', desc: 'Terapkan konsep pada struktur nyata.', duration: '12 menit', phase: 'ELABORATE' },
  7: { title: 'Detektif Massa Jenis', desc: 'Selidiki kesetimbangan dua fluida di pipa U.', duration: '12 menit', phase: 'ELABORATE' },
  8: { title: 'Hydro Challenge', desc: 'Uji pemahamanmu dengan 25 soal beragam.', duration: '30 menit', phase: 'EVALUATE' },
};

export const BADGES = {
  EXPLORER: '🌊 Hydro Explorer',
  INVESTIGATOR: '🔬 Pressure Investigator',
  DETECTIVE: '📊 Data Detective',
  ENGINEER: '🏗️ Hydro Engineer',
  DENSITY_DETECTIVE: '🧪 Density Detective',
  MASTER: '🏆 Hydro Master',
};

export const CLASS_OPTIONS = [
  '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H', '9I'
];