
import React, { useState, useEffect } from 'react';
import { UserProfile, Exercise, RiskProfile } from '../types';
import { EXERCISES } from '../constants';
import { Button } from '../components/Button';
import { ExerciseVideo } from '../components/ExerciseVideo';
import { 
  Play, Flame, Zap, Ghost, Eye, Briefcase, Info, CheckCircle2, XCircle, Activity, 
  ArrowRight, Sparkles, X, FlaskConical, Lightbulb, Timer, Shuffle, RefreshCw
} from 'lucide-react';
import { getSessions, getUserStats, getNextSessionTime } from '../utils';

interface Props {
  user: UserProfile;
  onStartWorkout: (exercises?: Exercise[]) => void;
}

export const Dashboard: React.FC<Props> = ({ user, onStartWorkout }) => {
  const sessions = getSessions();
  const stats = getUserStats();
  const [selectedTask, setSelectedTask] = useState<Exercise | null>(null);
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [timeToNext, setTimeToNext] = useState<string>('--:--');
  const [isDue, setIsDue] = useState(false);
  
  // Dynamic Circuit Generator
  const [todaysCircuit, setTodaysCircuit] = useState<Exercise[]>([]);

  // Function to generate a balanced circuit (1 Strength, 1 Cardio/Postue, 1 Mobility/Stealth)
  const generateCircuit = (stealth: boolean) => {
    const pool = EXERCISES.filter(ex => stealth ? ex.isStealth : true);
    
    // Attempt to get variety: Strength, Cardio, Mobility
    const strength = pool.filter(e => e.category === 'strength');
    const cardio = pool.filter(e => e.category === 'cardio');
    const mobility = pool.filter(e => e.category === 'mobility' || e.category === 'posture');
    
    // Fallbacks if pool is small (e.g. stealth mode)
    const e1 = strength[Math.floor(Math.random() * strength.length)] || pool[0];
    const e2 = cardio[Math.floor(Math.random() * cardio.length)] || pool[1];
    const e3 = mobility[Math.floor(Math.random() * mobility.length)] || pool[2];
    
    // Ensure uniqueness
    const circuit = Array.from(new Set([e1, e2, e3])).filter(Boolean);
    
    // If we still don't have 3, fill with randoms
    while (circuit.length < 3) {
        const random = pool[Math.floor(Math.random() * pool.length)];
        if (!circuit.find(c => c.id === random.id)) circuit.push(random);
    }
    
    setTodaysCircuit(circuit);
  };

  // Initial Generation
  useEffect(() => {
    generateCircuit(isStealthMode);
  }, [isStealthMode]);
  
  // Date & Greeting Logic
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user.name.split(' ')[0] || 'Warrior';
  const dailyTarget = 6;
  const todayStr = today.toDateString();
  const dailySessions = sessions.filter((s: any) => new Date(s.date).toDateString() === todayStr).length;
  
  const getProtocolBadge = () => {
    switch(user.riskProfile) {
      case RiskProfile.RedFlag: return { label: 'Locked', color: 'bg-red-100 text-red-700 border-red-200' };
      case RiskProfile.Geriatric: return { label: 'Stability', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      case RiskProfile.Modified: return { label: 'Modified', color: 'bg-amber-100 text-amber-700 border-amber-200' };
      default: return { label: 'Unrestricted', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }
  };
  const protocol = getProtocolBadge();

  // Timer Logic
  useEffect(() => {
    const calculateTime = () => {
        const nextTime = getNextSessionTime(user);
        const now = new Date();
        const diffMs = nextTime.getTime() - now.getTime();
        
        if (diffMs <= 0) {
            setTimeToNext('00:00');
            setIsDue(true);
        } else {
            setIsDue(false);
            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            const seconds = Math.floor((diffMs % 60000) / 1000);
            
            if (hours > 0) {
                setTimeToNext(`${hours}h ${minutes}m`);
            } else {
                setTimeToNext(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            }
        }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [user, sessions]);

  return (
    <>
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* 1. Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
            {greeting}, {firstName}
             <span className={`px-2 py-0.5 rounded-full text-[10px] border ${protocol.color}`}>
                {protocol.label}
             </span>
          </p>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
             Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">break the cycle?</span>
          </h1>
        </div>
        
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 pr-3 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-inner">
                    {stats.level}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Level</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">{stats.currentXP} XP</p>
                </div>
            </div>
        </div>
      </div>

      {/* 2. NEXT ROUND TIMER (Priority) */}
      <div className={`p-4 rounded-3xl shadow-sm border transition-all duration-500 relative overflow-hidden group ${
          isDue 
           ? 'bg-orange-500 text-white border-orange-400' 
           : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
      }`}>
         {isDue && <div className="absolute inset-0 bg-orange-400 animate-pulse opacity-50"></div>}
         
         <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isDue ? 'bg-white/20 text-white' : 'bg-brand-50 dark:bg-brand-900/20 text-brand-600'}`}>
                    {isDue ? <Zap size={24} className="animate-bounce" /> : <Timer size={24} />}
                </div>
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDue ? 'text-orange-100' : 'text-slate-500'}`}>
                        {isDue ? 'Metabolic Crash Imminent' : 'Next Recharge'}
                    </p>
                    <p className={`text-3xl font-black font-mono tracking-tight ${isDue ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {isDue ? 'NOW' : timeToNext}
                    </p>
                </div>
            </div>
            {isDue && (
                <button 
                  onClick={() => onStartWorkout(todaysCircuit)}
                  className="px-4 py-2 bg-white text-orange-600 rounded-xl font-bold text-sm shadow-lg animate-in slide-in-from-right"
                >
                    Start
                </button>
            )}
         </div>
      </div>

      {/* 3. Hero Launchpad */}
      <div 
        className={`rounded-[2rem] p-6 text-white shadow-xl shadow-brand-900/20 relative overflow-hidden transition-all duration-500 border border-white/10 ${
            isStealthMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-950' 
                : 'bg-gradient-to-br from-orange-500 to-red-600'
        }`}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
             <div className="bg-black/20 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 border border-white/10">
                 <button 
                   onClick={() => setIsStealthMode(false)}
                   className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${!isStealthMode ? 'bg-white text-orange-600 shadow-md transform scale-105' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                 >
                   <Zap size={14} fill={!isStealthMode ? "currentColor" : "none"} /> Active
                 </button>
                 <button 
                   onClick={() => setIsStealthMode(true)}
                   className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${isStealthMode ? 'bg-white text-slate-900 shadow-md transform scale-105' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                 >
                   <Ghost size={14} /> Stealth
                 </button>
             </div>
             
             {isStealthMode && (
                 <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-60 bg-black/30 px-2 py-1 rounded-lg">
                    <Eye size={12} /> Invisible
                 </div>
             )}
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black mb-1 tracking-tight">
                {isStealthMode ? 'Covert Ops' : 'Ignite Energy'}
            </h2>
            <p className="text-white/80 font-medium text-sm max-w-[80%] leading-relaxed">
                {isStealthMode 
                    ? 'Low profile movements. No one will notice.' 
                    : 'Boost metabolism with full range of motion.'}
            </p>
          </div>

          <Button 
             onClick={() => onStartWorkout(todaysCircuit)}
             className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg border border-white/10 transition-transform active:scale-95 group relative overflow-hidden ${
                 isStealthMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                    : 'bg-white text-red-600 hover:bg-orange-50'
             }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {isStealthMode ? <Play size={20} fill="currentColor"/> : <Flame size={20} fill="currentColor"/>}
                {isStealthMode ? 'Start Stealth Mission' : 'Start Active Flow'}
            </span>
          </Button>
        </div>
      </div>

      {/* 4. Stats Row */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Daily Goal</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white">{dailySessions}/{dailyTarget}</p>
              </div>
              <div className="h-10 w-10 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-600">
                  <Activity size={20} />
              </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Streak</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white">{stats.currentStreak} Days</p>
              </div>
              <div className="h-10 w-10 bg-accent-50 dark:bg-accent-900/20 rounded-full flex items-center justify-center text-accent-600">
                  <Flame size={20} fill="currentColor" />
              </div>
          </div>
      </div>

      {/* 5. Circuit Preview with Randomizer */}
      <div>
        <div className="flex justify-between items-end mb-4 px-1">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
             {isStealthMode ? <Ghost size={18} className="text-slate-500" /> : <Sparkles size={18} className="text-brand-500" />}
             Circuit Preview
          </h3>
          <button 
            onClick={() => generateCircuit(isStealthMode)}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline"
          >
             <RefreshCw size={12} /> Shuffle
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {todaysCircuit.map((ex, idx) => (
            <div 
                key={`${ex.id}-${idx}`}
                onClick={() => setSelectedTask(ex)}
                className="min-w-[140px] p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all cursor-pointer group flex flex-col justify-between h-32"
            >
              <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-1.5 rounded-lg text-slate-400 group-hover:text-brand-500 transition-colors">
                      <Info size={14} />
                  </div>
              </div>
              
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight mb-1 line-clamp-2">{ex.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {ex.type === 'reps' ? `${ex.baseReps} Reps` : `${ex.baseDurationSec} Sec`}
                </p>
              </div>
            </div>
          ))}
          
          <div 
             className="min-w-[100px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:border-brand-300 hover:text-brand-500 transition-colors cursor-pointer"
             onClick={() => generateCircuit(isStealthMode)}
          >
             <Shuffle size={24} />
             <span className="text-[10px] font-bold mt-2">Mix It Up</span>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Exercise Modal */}
    {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTask(null)} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="relative h-56 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <ExerciseVideo videoUrl={selectedTask.videoUrl} className="w-full h-full" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex flex-col justify-end p-6 pointer-events-none">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider w-max mb-2 border border-white/20">
                            {selectedTask.category}
                        </span>
                        <h3 className="text-2xl font-black text-white leading-none shadow-sm">{selectedTask.name}</h3>
                    </div>
                    <button 
                        onClick={() => setSelectedTask(null)}
                        className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition-colors backdrop-blur-md border border-white/10 z-10"
                    >
                        <X size={18} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-3">
                         <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                            <Briefcase size={20} />
                            <h4 className="font-bold text-sm uppercase tracking-wide">Why It Helps You</h4>
                         </div>
                         <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {selectedTask.description}
                         </p>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300">
                             <FlaskConical size={18} />
                             <h4 className="font-bold text-xs uppercase tracking-wide">Scientific Verification</h4>
                        </div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200 italic leading-relaxed mb-2">
                            "{selectedTask.whyItWorks}"
                        </p>
                        <div className="flex justify-end">
                            <span className="text-[10px] font-semibold text-indigo-500 bg-white dark:bg-indigo-950 px-2 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                                Source: {selectedTask.citation}
                            </span>
                        </div>
                    </div>

                    <div>
                         <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 mb-3">
                            <Lightbulb size={20} />
                            <h4 className="font-bold text-sm uppercase tracking-wide">Coach's Tips</h4>
                         </div>
                         <div className="grid grid-cols-1 gap-3">
                             {selectedTask.tempo && (
                                <div className="flex gap-3 items-start bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                    <Timer className="text-brand-500 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">Tempo</span>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">{selectedTask.tempo}</p>
                                    </div>
                                </div>
                             )}
                             <div className="flex gap-3 items-start bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <span className="text-xs font-bold text-slate-900 dark:text-white block mb-0.5">Focus On</span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        {selectedTask.instructions[1] || "Controlled movement throughout."}
                                    </p>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <Button onClick={() => { setSelectedTask(null); onStartWorkout(todaysCircuit); }} fullWidth className="py-3 shadow-xl shadow-brand-500/20">
                        Start Session Now
                    </Button>
                </div>
            </div>
        </div>
    )}
    </>
  );
};
