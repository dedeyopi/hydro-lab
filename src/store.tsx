import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState, MissionId, StudentProfile, ExperimentDataPoint } from './types';

const STORAGE_KEY = 'hydrolab-state-v1';

const initialState: AppState = {
  profile: null,
  currentMission: null,
  completedMissions: [],
  xp: 0,
  badges: [],
  predictions: {},
  experimentData: [],
  quizAnswers: {},
  quizScore: 0,
  quizVersion: 'v2',
  reflection: {},
  confidence: '',
  teacherMode: false,
};

interface StoreContextType {
  state: AppState;
  setProfile: (p: StudentProfile) => void;
  setCurrentMission: (id: MissionId | null) => void;
  completeMission: (id: MissionId) => void;
  addXp: (amount: number) => void;
  addBadge: (badge: string) => void;
  savePrediction: (key: string, value: string) => void;
  addExperimentData: (d: ExperimentDataPoint) => void;
  resetExperiment: () => void;
  saveQuizAnswer: (id: number, answer: string) => void;
  setQuizScore: (score: number) => void;
  saveReflection: (key: string, value: string) => void;
  setConfidence: (value: string) => void;
  toggleTeacherMode: () => void;
  unlockAllMissions: () => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.quizVersion !== 'v2') {
        parsed.quizAnswers = {};
        parsed.quizScore = 0;
        parsed.quizVersion = 'v2';
      }
      return { ...initialState, ...parsed };
    }
  } catch {}
  return initialState;
});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const setProfile = (profile: StudentProfile) => setState((s) => ({ ...s, profile }));
  const setCurrentMission = (id: MissionId | null) => setState((s) => ({ ...s, currentMission: id }));
  const completeMission = (id: MissionId) =>
    setState((s) =>
      s.completedMissions.includes(id) ? s : { ...s, completedMissions: [...s.completedMissions, id] }
    );
  const addXp = (amount: number) => setState((s) => ({ ...s, xp: s.xp + amount }));
  const addBadge = (badge: string) =>
    setState((s) => (s.badges.includes(badge) ? s : { ...s, badges: [...s.badges, badge] }));
  const savePrediction = (key: string, value: string) =>
    setState((s) => ({ ...s, predictions: { ...s.predictions, [key]: value } }));
  const addExperimentData = (d: ExperimentDataPoint) =>
    setState((s) => ({ ...s, experimentData: [...s.experimentData, d] }));
  const resetExperiment = () => setState((s) => ({ ...s, experimentData: [] }));
  const saveQuizAnswer = (id: number, answer: string) =>
    setState((s) => ({ ...s, quizAnswers: { ...s.quizAnswers, [id]: answer } }));
  const setQuizScore = (score: number) => setState((s) => ({ ...s, quizScore: score }));
  const saveReflection = (key: string, value: string) =>
    setState((s) => ({ ...s, reflection: { ...s.reflection, [key]: value } }));
  const setConfidence = (value: string) => setState((s) => ({ ...s, confidence: value }));
  const toggleTeacherMode = () => setState((s) => ({ ...s, teacherMode: !s.teacherMode }));
  const unlockAllMissions = () =>
    setState((s) => ({ ...s, completedMissions: [1, 2, 3, 4, 5, 6, 7, 8] }));
  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  };

  return (
    <StoreContext.Provider
      value={{
        state, setProfile, setCurrentMission, completeMission, addXp, addBadge,
        savePrediction, addExperimentData, resetExperiment, saveQuizAnswer,
        setQuizScore, saveReflection, setConfidence, toggleTeacherMode,
        unlockAllMissions, resetAll,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};