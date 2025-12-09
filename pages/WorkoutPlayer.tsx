
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Exercise, ScaledExerciseSettings } from '../types';
import { EXERCISES, GENERAL_TIPS } from '../constants';
import { calculateScaling, formatTime, getCaloriesEstimate, saveSession } from '../utils';
import { Button } from '../components/Button';
import { ExerciseVideo } from '../components/ExerciseVideo';
import { 
  X, Pause, Play, Check, Info, Zap, AlertTriangle, 
  Activity, RotateCw, ArrowRight, BookOpen, Lightbulb, GraduationCap, Timer 
} from 'lucide-react';

interface Props {
  user: UserProfile;
  onFinish: () => void;
  onExit: () => void;
  exercises?: Exercise[]; // Now accepts dynamic list
}

export const WorkoutPlayer: React.FC<Props> = ({ user, onFinish, onExit, exercises }) => {
  // Use passed exercises or fallback to default subset
  const sessionExercises = exercises || [EXERCISES[0], EXERCISES[1], EXERCISES[3]];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45); 
  const [isResting, setIsResting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [exerciseSettings, setExerciseSettings] = useState<ScaledExerciseSettings | null>(null);
  
  // UI States
  const [showGuide, setShowGuide] = useState(false);
  const [showSafetyOverlay, setShowSafetyOverlay] = useState(false);
  const [currentTip, setCurrentTip] = useState<string>('');

  const currentExercise = sessionExercises[currentIndex];
  const timerRef = useRef<number | null>(null);

  // Initialize & Scaling
  useEffect(() => {
    if (currentExercise) {
      const settings = calculateScaling(
        user, 
        currentExercise.baseReps, 
        currentExercise.baseDurationSec,
        currentExercise.contraindications // Pass contraindications for safety scaling
      );
      setExerciseSettings(settings);
      setTimeLeft(settings.durationSec);
      setShowGuide(false); 
    }
  }, [currentIndex, user, currentExercise]);

  // Dynamic Tip Engine
  useEffect(() => {
    if (!currentExercise || !exerciseSettings) return;
    const tipsPool = [
       exerciseSettings.modificationAdvice, 
       ...currentExercise.instructions.map(i => `Form Cue: ${i}`), 
       ...GENERAL_TIPS,
       currentExercise.commonMistakes ? `Avoid: ${currentExercise.commonMistakes}` : null,
       currentExercise.intensityCue ? `Intensity: ${currentExercise.intensityCue}` : null
    ].filter(Boolean) as string[];

    setCurrentTip(tipsPool[0]);

    const interval = setInterval(() => {
        const randomTip = tipsPool[Math.floor(Math.random() * tipsPool.length)];
        setCurrentTip(randomTip);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, currentExercise, exerciseSettings]);

  // Timer Logic
  useEffect(() => {
    if (isPlaying && !isFinished && !showSafetyOverlay && !showGuide) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isResting, isFinished, showSafetyOverlay, showGuide]);

  const handleTimerComplete = () => {
    if (isResting) {
      setIsResting(false);
      if (currentIndex < sessionExercises.length - 1) {
        setCurrentIndex(curr => curr + 1);
      } else {
        finishSession();
      }
    } else {
      if (currentIndex === sessionExercises.length - 1) {
         finishSession();
      } else {
         setIsResting(true);
         setTimeLeft(exerciseSettings?.restSec || 30);
      }
    }
  };

  const finishSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFinished(true);
    
    const duration = sessionExercises.reduce((acc, ex) => {
        // Fix: Pass baseDurationSec and contraindications for accurate stats
        const s = calculateScaling(user, ex.baseReps, ex.baseDurationSec, ex.contraindications);
        return acc + s.durationSec + s.restSec;
    }, 0);

    saveSession({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        durationSeconds: duration,
        exercisesCompleted: sessionExercises.length,
        caloriesBurned: getCaloriesEstimate(user, duration),
        mode: 'Active' 
    });
  };

  const handleManualNext = () => {
    handleTimerComplete();
  };

  const triggerSafetyStop = () => {
    setIsPlaying(false);
    setShowSafetyOverlay(true);
  };

  if (isFinished) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-brand-600 text-white text-center animate-in zoom-in duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="bg-white/20 p-6 rounded-full mb-6 animate-bounce relative z-10 backdrop-blur-md shadow-xl border border-white/20">
            <Check size={48} strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black mb-2 relative z-10">Recharged!</h2>
        <p className="text-brand-100 mb-8 max-w-xs relative z-10">You've successfully reset your metabolism. Next session in ~90 mins.</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8 relative z-10">
            <div className="bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <p className="text-xs text-brand-200 uppercase font-bold mb-1">Fat Burn</p>
                <p className="text-3xl font-black">~15 <span className="text-sm font-medium">kcal</span></p>
            </div>
            <div className="bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <p className="text-xs text-brand-200 uppercase font-bold mb-1">Consistency</p>
                <p className="text-3xl font-black">Day 5</p>
            </div>
        </div>
        <Button onClick={onFinish} className="bg-white text-brand-600 w-full max-w-xs shadow-xl relative z-10 font-bold">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (!exerciseSettings) return null;

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white relative overflow-hidden">
      
      {/* 1. IMMERSIVE BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0">
         {!isResting ? (
            <div className="w-full h-full relative">
                 <ExerciseVideo 
                    videoUrl={currentExercise.videoUrl} 
                    className="w-full h-full absolute inset-0 object-cover opacity-60" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
            </div>
         ) : (
             <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                 <div className="absolute inset-0 bg-brand-900/20 animate-pulse"></div>
             </div>
         )}
      </div>

      {/* 2. HEADER HUD */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
         <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-brand-300">
                    {isResting ? 'Recovery Mode' : `${currentIndex + 1} / ${sessionExercises.length}`}
                </span>
                {exerciseSettings.intensityLabel !== 'Standard' && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/50 text-[10px] font-bold uppercase text-amber-300">
                        {exerciseSettings.intensityLabel}
                    </span>
                )}
            </div>
            <h2 className="text-lg font-bold leading-tight max-w-[200px] shadow-sm">
                {isResting ? 'Breathe & Reset' : currentExercise.name}
            </h2>
         </div>

         <div className="flex gap-2">
            {!isResting && (
                <button 
                  onClick={() => {
                      setShowGuide(!showGuide);
                      setIsPlaying(showGuide); // Resume if closing, Pause if opening
                  }} 
                  className={`p-2 backdrop-blur-md rounded-full border transition-colors ${
                      showGuide 
                        ? 'bg-brand-600 text-white border-brand-500' 
                        : 'bg-black/40 text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                    <BookOpen size={20} />
                </button>
            )}
            <button onClick={onExit} className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-white/10 border border-white/10 transition-colors">
                <X size={20} />
            </button>
         </div>
      </div>

      {/* 3. CENTRAL HUD OR GUIDE OVERLAY */}
      <div className="flex-1 relative z-10 flex flex-col p-6 overflow-hidden">
          
          {/* TECHNIQUE GUIDE OVERLAY */}
          {showGuide && !isResting && (
              <div className="absolute inset-x-4 top-20 bottom-4 bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10 flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden shadow-2xl z-30">
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                      <GraduationCap className="text-brand-400" size={24} />
                      <h3 className="text-xl font-bold text-white">Technique Guide</h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Step-by-Step</h4>
                          <ol className="space-y-4">
                              {currentExercise.instructions.map((inst, i) => (
                                  <li key={i} className="flex gap-3 text-sm text-slate-200 leading-relaxed">
                                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs border border-brand-500/30">
                                          {i+1}
                                      </span>
                                      {inst}
                                  </li>
                              ))}
                          </ol>
                      </div>
                      
                      {currentExercise.tempo && (
                        <div className="bg-brand-500/10 p-4 rounded-xl border border-brand-500/20">
                            <h4 className="text-xs font-bold text-brand-400 uppercase mb-2 flex items-center gap-2">
                                <Timer size={14} /> Recommended Tempo
                            </h4>
                            <p className="text-sm text-brand-100">{currentExercise.tempo}</p>
                        </div>
                      )}
                      
                      <div>
                          <h4 className="text-xs font-bold text-blue-400 uppercase mb-2 flex items-center gap-2">
                              <Info size={14} /> Why This Works
                          </h4>
                          <p className="text-sm text-slate-300 italic">"{currentExercise.whyItWorks}"</p>
                      </div>
                  </div>
                  
                  <div className="pt-4 mt-auto border-t border-white/10">
                      <Button fullWidth onClick={() => { setShowGuide(false); setIsPlaying(true); }}>
                          Got it, Resume Workout
                      </Button>
                  </div>
              </div>
          )}

          {/* MAIN COUNTER (Hidden if Guide is open) */}
          {!showGuide && (
            <div className="flex-1 flex flex-col items-center justify-center">
              {isResting ? (
                <div className="text-center animate-in zoom-in duration-300 w-full max-w-sm">
                    {/* Rest Timer */}
                    <div className="w-24 h-24 rounded-full border-4 border-brand-500/30 flex items-center justify-center mx-auto mb-6 relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-brand-500 transition-all duration-1000 ease-linear"
                                strokeDasharray={`${(timeLeft / exerciseSettings.restSec) * 100}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="text-3xl font-mono font-bold text-white">{timeLeft}s</span>
                    </div>

                    {/* Metabolic Fact */}
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 mb-6 text-left">
                        <div className="flex items-center gap-2 mb-2 text-brand-300">
                            <Lightbulb size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Did you know?</span>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed">
                            {sessionExercises[currentIndex + 1] 
                                ? sessionExercises[currentIndex + 1].whyItWorks 
                                : "Micro-workouts increase EPOC, meaning you burn calories for hours after stopping."}
                        </p>
                    </div>

                    <h3 className="text-slate-400 text-sm uppercase tracking-widest mb-2">Up Next</h3>
                    <p className="text-2xl font-black text-white">{sessionExercises[currentIndex + 1]?.name || 'Finish'}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in fade-in">
                    {/* METABOLIC PACER (Breathing / Rhythm Guide) */}
                    {currentExercise.type === 'reps' && isPlaying && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
                    )}

                    <div className="text-center mb-8 relative">
                        <p className="text-sm font-bold text-brand-400 uppercase tracking-widest mb-2">
                            {currentExercise.type === 'reps' ? 'Target Reps' : 'Time Remaining'}
                        </p>
                        
                        <div className="text-[7rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl">
                            {currentExercise.type === 'reps' ? exerciseSettings.reps : `${timeLeft}`}
                        </div>
                        
                        {/* NEW RHYTHM HUD */}
                        {currentExercise.tempo && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 backdrop-blur-md border border-brand-500/40 animate-pulse-slow">
                                <Activity size={16} className="text-brand-400" />
                                <span className="text-sm font-bold text-brand-100 uppercase tracking-wide">
                                    {currentExercise.tempo}
                                </span>
                            </div>
                        )}
                        
                        {currentExercise.type === 'duration' && (
                            <div className="w-48 h-2 bg-white/20 rounded-full mt-4 mx-auto overflow-hidden">
                                <div 
                                    className="h-full bg-brand-500 transition-all duration-1000 ease-linear"
                                    style={{ width: `${(timeLeft / exerciseSettings.durationSec) * 100}%` }}
                                ></div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        {currentExercise.muscleGroups.map((muscle) => (
                            <span key={muscle} className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-xs font-bold text-slate-300">
                                {muscle}
                            </span>
                        ))}
                    </div>
                </div>
              )}
            </div>
          )}
      </div>

      {/* 4. FOOTER CONTROLS */}
      <div className="relative z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 px-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={triggerSafetyStop}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors"
              >
                  <Activity size={20} />
              </button>

              <button 
                onClick={isResting ? handleManualNext : () => setIsPlaying(!isPlaying)}
                className={`flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-xl transition-transform active:scale-95 ${
                    isResting 
                     ? 'bg-brand-600 hover:bg-brand-500 text-white'
                     : isPlaying ? 'bg-white text-slate-900' : 'bg-brand-500 text-white'
                }`}
              >
                 {isResting ? (
                     <>Start Next Set <ArrowRight size={20} /></>
                 ) : isPlaying ? (
                     <><Pause size={20} fill="currentColor" /> Pause</>
                 ) : (
                     <><Play size={20} fill="currentColor" /> Resume</>
                 )}
              </button>
              
              {!isResting && (
                  <button 
                    onClick={handleManualNext}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors"
                  >
                      <Check size={20} />
                  </button>
              )}
          </div>
          
          {/* Smart Ticker - Rotates Tips & Instructions */}
          {!isResting && !showGuide && (
             <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-center min-h-[60px]">
                 <p className="text-xs sm:text-sm text-slate-200 text-center leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500" key={currentTip}>
                    <span className="text-brand-400 font-bold mr-2 uppercase">Tip:</span>
                    {currentTip}
                 </p>
             </div>
          )}
      </div>

      {/* SAFETY OVERLAY */}
      {showSafetyOverlay && (
         <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
               <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Safety Pause</h2>
            <p className="text-slate-300 mb-8 max-w-xs">
               If you are experiencing sharp pain, dizziness, or shortness of breath, stop immediately.
            </p>
            
            <div className="w-full max-w-sm space-y-3">
               <Button variant="danger" fullWidth onClick={onExit} className="bg-red-600 hover:bg-red-700 border-none">
                 Stop Workout
               </Button>
               <Button variant="secondary" fullWidth onClick={() => { setShowSafetyOverlay(false); setIsPlaying(true); }}>
                 Lower Intensity & Continue
               </Button>
               <button onClick={() => { setShowSafetyOverlay(false); setIsPlaying(true); }} className="text-slate-400 text-sm mt-4 hover:text-white">
                 False Alarm / Resume
               </button>
            </div>
         </div>
      )}
    </div>
  );
};
