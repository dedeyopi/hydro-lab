export type MissionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StudentProfile {
  name: string;
  className: string;
}

export interface ExperimentDataPoint {
  id: string;
  fluidId: string;
  fluidName: string;
  fluid: string;
  density: number;
  depth: number;
  gravity: number;
  pressure: number;
  order: number;
}

export interface AppState {
  profile: StudentProfile | null;
  currentMission: MissionId | null;
  completedMissions: MissionId[];
  xp: number;
  badges: string[];
  predictions: Record<string, string>;
  experimentData: ExperimentDataPoint[];
  quizAnswers: Record<number, string>;
  quizScore: number;
  quizVersion?: string;
  reflection: Record<string, string>;
  confidence: string;
  teacherMode: boolean;
}

export type Screen =
  | { type: 'login' }
  | { type: 'landing' }
  | { type: 'map' }
  | { type: 'mission'; id: MissionId }
  | { type: 'reflection' }
  | { type: 'completion' }
  | { type: 'certificate' }
  | { type: 'teacher' }
  | { type: 'about' };

export interface Fluid {
  id: string;
  name: string;
  density: number;
  color: string;
  colorLight: string;
}
