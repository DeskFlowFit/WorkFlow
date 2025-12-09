import { UserProfile, ScaledExerciseSettings, WorkoutSession, UserStats, RiskProfile } from './types';
import { ACHIEVEMENTS } from './constants';

// --- RISK ENGINE ---
export const calculateRiskProfile = (user: Partial<UserProfile>): RiskProfile => {
  // 1. Red Flags (Absolute Contraindications)
  if (user.redFlags && user.redFlags.length > 0) {
    return RiskProfile.RedFlag;
  }

  // 2. Geriatric / Frailty
  // BMI > 35 or Age > 65 triggers Mobility pathway
  const bmi = user.weightKg && user.heightCm ? user.weightKg / ((user.heightCm / 100) ** 2) : 25;
  if ((user.age && user.age >= 65) || bmi > 35) {
    return RiskProfile.Geriatric;
  }

  // 3. Modified (Specific Injuries)
  if (user.injuries && user.injuries.length > 0) {
    return RiskProfile.Modified;
  }

  // 4. Standard
  return RiskProfile.Unrestricted;
};

export const saveUser = (user: UserProfile) => {
  localStorage.setItem('deskflow_user', JSON.stringify(user));
};

export const loadUser = (): UserProfile | null => {
  const raw = localStorage.getItem('deskflow_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveSession = (session: any) => {
    const existing = JSON.parse(localStorage.getItem('deskflow_sessions') || '[]');
    existing.push(session);
    localStorage.setItem('deskflow_sessions', JSON.stringify(existing));
};

export const getSessions = (): WorkoutSession[] => {
    return JSON.parse(localStorage.getItem('deskflow_sessions') || '[]');
};

export const getNextSessionTime = (user: UserProfile): Date => {
    const sessions = getSessions();
    const now = new Date();
    
    // Parse Work Hours
    const [startHour, startMin] = user.workStartTime.split(':').map(Number);
    const [endHour, endMin] = user.workEndTime.split(':').map(Number);
    
    const workStart = new Date();
    workStart.setHours(startHour, startMin, 0, 0);
    
    const workEnd = new Date();
    workEnd.setHours(endHour, endMin, 0, 0);

    // If outside work hours, return next work day start
    if (now > workEnd) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(startHour, startMin, 0, 0);
        return tomorrow;
    }

    // If no sessions today, start immediately or at work start
    if (sessions.length === 0) {
        return now > workStart ? now : workStart;
    }

    // Sort sessions by date descending
    const sortedSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastSession = new Date(sortedSessions[0].date);

    // If last session was on a previous day, start now/workStart
    if (lastSession.getDate() !== now.getDate()) {
         return now > workStart ? now : workStart;
    }

    // Add 90 minutes (Ultradian Rhythm)
    const nextSession = new Date(lastSession.getTime() + 90 * 60000);
    
    // If we are already past the due time, return now (due immediately)
    if (nextSession < now) return now;

    return nextSession;
};

export const getUserStats = (): UserStats => {
  const sessions = getSessions();
  const totalSessions = sessions.length;
  const totalMinutes = Math.floor(sessions.reduce((acc: number, s: WorkoutSession) => acc + s.durationSeconds, 0) / 60);
  const totalCalories = sessions.reduce((acc: number, s: WorkoutSession) => acc + s.caloriesBurned, 0);
  
  // Calculate Streak
  let currentStreak = 0;
  if (totalSessions > 0) {
    const today = new Date().toDateString();
    const uniqueDates = Array.from<string>(new Set(sessions.map((s: WorkoutSession) => new Date(s.date).toDateString()))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    if (uniqueDates.length > 0) {
        const latest = uniqueDates[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (latest === today || latest === yesterday.toDateString()) {
             currentStreak = 1;
             for (let i = 0; i < uniqueDates.length - 1; i++) {
                 const curr = new Date(uniqueDates[i]);
                 const prev = new Date(uniqueDates[i+1]);
                 const diffTime = Math.abs(curr.getTime() - prev.getTime());
                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                 
                 if (diffDays === 1) {
                     currentStreak++;
                 } else {
                     break;
                 }
             }
        }
    }
  }

  let currentXP = (totalSessions * 100) + (totalMinutes * 5) + totalCalories;

  const unlockedAchievements: string[] = [];
  ACHIEVEMENTS.forEach(ach => {
     let achieved = false;
     if (ach.conditionType === 'sessions' && totalSessions >= ach.threshold) achieved = true;
     if (ach.conditionType === 'calories' && totalCalories >= ach.threshold) achieved = true;
     if (ach.conditionType === 'streak' && currentStreak >= ach.threshold) achieved = true;
     
     if (achieved) {
         unlockedAchievements.push(ach.id);
         currentXP += ach.xpReward;
     }
  });

  let level = 1;
  let xpForNextLevel = 500;
  let remainingXP = currentXP;
  
  while (remainingXP >= xpForNextLevel) {
      remainingXP -= xpForNextLevel;
      level++;
      xpForNextLevel = level * 500;
  }

  return {
    totalSessions,
    totalMinutes,
    totalCalories,
    currentStreak,
    level,
    currentXP: remainingXP,
    nextLevelXP: xpForNextLevel,
    unlockedAchievements
  };
};

export const calculateScaling = (
  user: UserProfile, 
  baseReps: number, 
  baseDuration?: number,
  exerciseContraindications: string[] = []
): ScaledExerciseSettings => {
  let intensity = 1.0;
  let label = 'Standard';
  let advice = 'Perform with good form.';
  let rest = 30;
  let reps = baseReps;
  let duration = baseDuration || 30;

  // Global Risk Profile Scaling
  if (user.riskProfile === RiskProfile.Geriatric) {
    intensity = 0.5;
    label = 'Stability / Low Impact';
    advice = 'Perform seated or with support. Prioritize balance.';
    rest = 60;
  } else if (user.riskProfile === RiskProfile.Modified) {
    intensity = 0.8;
    label = 'Injury Modified';
    advice = 'Controlled range of motion. Stop if any pain.';
    rest = 45;
  }

  // Specific Injury Checks (Contraindication Logic)
  const userInjuries = user.injuries || [];
  const hasConflict = userInjuries.some(injury => exerciseContraindications.includes(injury));
  
  if (hasConflict) {
      // If we haven't substituted it out (UI layer should handle substitution), we aggressively modify
      intensity *= 0.5;
      label = 'Therapeutic';
      advice = 'EXTREME CAUTION: Modified for injury. Reduce range of motion by 50%.';
  }

  // Age scaling (Legacy fallback if risk profile misses)
  if (user.age >= 65 && user.riskProfile !== RiskProfile.Geriatric) {
    intensity = 0.5;
    rest = 60;
  } 

  // Weight scaling logic
  if (user.weightKg > 130) {
    intensity *= 0.6; 
    label += ' (Supported)';
    advice = 'Use seated variants where possible. Stop if pain occurs.';
    rest = 60;
  }

  reps = Math.max(Math.floor(baseReps * intensity), 5); 
  if (baseDuration) {
     duration = Math.max(Math.floor(baseDuration * intensity), 15);
  }

  return {
    reps,
    durationSec: duration,
    restSec: rest,
    intensityLabel: label,
    modificationAdvice: advice
  };
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const getCaloriesEstimate = (user: UserProfile, durationSeconds: number) => {
    const METs = 3.8;
    const hours = durationSeconds / 3600;
    return Math.round(METs * user.weightKg * hours);
};