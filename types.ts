
export enum UserGender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum FitnessLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'Lightly Active',
  Active = 'Active'
}

export enum RiskProfile {
  Unrestricted = 'Unrestricted',
  Modified = 'Modified', // Injury specific
  Geriatric = 'Geriatric', // Low impact/seated
  RedFlag = 'RedFlag' // Medical lockout
}

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number; // Added for BMI
  gender: UserGender;
  fitnessLevel: FitnessLevel;
  
  // Clinical Data
  medicalConditions: string[]; // e.g. 'Hypertension', 'Pregnancy'
  injuries: string[]; // e.g. 'Knees', 'Back', 'Shoulders'
  redFlags: string[]; // e.g. 'Chest Pain', 'Dizziness'
  riskProfile: RiskProfile;

  workStartTime: string; 
  workEndTime: string; 
  hasAgreedToDisclaimer: boolean;
  waiverSignedAt: string | null; 
  onboardingCompleted: boolean;
  email?: string;
  isAuthenticated?: boolean;
  lastSyncDate?: string;
}

export interface ExerciseModification {
  description: string;
  level: 'easier' | 'harder' | 'standard';
}

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'mobility' | 'cardio' | 'posture';
  muscleGroups: string[];
  description: string;
  instructions: string[]; 
  commonMistakes: string;
  modifications: ExerciseModification[];
  citation: string;
  expertQuote?: string;
  whyItWorks: string;
  
  // Clinical Logic
  contraindications: string[]; // Injuries that ban this move
  isStealth: boolean; // Invisible to webcam
  
  baseReps: number;
  baseDurationSec?: number;
  type: 'reps' | 'duration';
  
  // Intensity & Science
  tempo?: string; // e.g. "3-0-1" (3s down, 0s hold, 1s up)
  intensityCue?: string; // e.g. "Explosive Up!"
  
  // Media
  videoUrl?: string;
}

export interface WorkoutSession {
  id: string;
  date: string; 
  durationSeconds: number;
  exercisesCompleted: number;
  caloriesBurned: number;
  mode: 'Active' | 'Stealth';
}

export interface ScaledExerciseSettings {
  reps: number;
  durationSec: number;
  restSec: number;
  intensityLabel: string;
  modificationAdvice: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; 
  conditionType: 'sessions' | 'streak' | 'calories' | 'consistency';
  threshold: number;
  xpReward: number;
}

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  unlockedAchievements: string[]; 
}

export type ScreenName = 'onboarding' | 'dashboard' | 'workout' | 'library' | 'progress' | 'profile' | 'settings' | 'lockout';
