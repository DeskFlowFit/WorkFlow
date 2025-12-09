import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { getSessions, getUserStats } from '../utils';
import { ACHIEVEMENTS } from '../constants';
import { Calendar, Flame, Clock, Trophy, TrendingUp, History, Lock, Medal, Star } from 'lucide-react';
import { WorkoutSession } from '../types';
import * as LucideIcons from 'lucide-react';

export const Progress = () => {
  const sessions = getSessions();
  const stats = getUserStats();
  
  // Transform data for chart (Last 7 Days)
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    return last7Days.map(date => {
      const dateStr = date.toDateString();
      const count = sessions.filter((s: WorkoutSession) => new Date(s.date).toDateString() === dateStr).length;
      return {
        name: days[date.getDay()],
        fullDate: dateStr,
        sessions: count,
        isToday: date.toDateString() === new Date().toDateString()
      };
    });
  }, [sessions]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Your Journey</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm">
             Level {stats.level} Desk Warrior
           </p>
        </div>
        <div className="text-right">
           <p className="text-2xl font-black text-brand-600 dark:text-brand-400">{Math.floor(stats.currentXP)}</p>
           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total XP</p>
        </div>
      </div>

      {/* Hero Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={Flame} 
          value={stats.totalCalories} 
          label="Kcal Burned" 
          color="accent" 
        />
        <StatCard 
          icon={Clock} 
          value={stats.totalMinutes} 
          label="Minutes Moved" 
          color="brand" 
        />
        <StatCard 
          icon={Trophy} 
          value={stats.totalSessions} 
          label="Total Snacks" 
          color="violet" 
        />
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 p-2 opacity-20">
              <TrendingUp size={48} />
           </div>
           <div className="flex items-center gap-2 opacity-90 relative z-10">
             <TrendingUp size={18} />
             <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
           </div>
           <div className="relative z-10">
             <span className="text-3xl font-black">{stats.currentStreak}</span>
             <span className="text-sm font-medium opacity-80 ml-1">Days</span>
           </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
           <Medal size={20} className="text-accent-500" />
           Achievements
        </h3>
        <div className="grid grid-cols-3 gap-3">
           {ACHIEVEMENTS.map(ach => {
              const isUnlocked = stats.unlockedAchievements.includes(ach.id);
              // Dynamic Icon Rendering
              const IconComponent = (LucideIcons as any)[ach.icon] || Star;

              return (
                 <div key={ach.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center border-2 transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-white dark:bg-slate-800 border-accent-400 dark:border-accent-500 shadow-md scale-100' 
                      : 'bg-slate-100 dark:bg-slate-800/50 border-transparent opacity-60 grayscale scale-95'
                 }`}>
                    <div className={`p-2 rounded-full mb-2 ${isUnlocked ? 'bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400' : 'bg-slate-200 text-slate-400'}`}>
                       {isUnlocked ? <IconComponent size={20} /> : <Lock size={20} />}
                    </div>
                    <p className="text-[10px] font-bold leading-tight text-slate-800 dark:text-slate-200 mb-1">{ach.title}</p>
                    {isUnlocked && <p className="text-[8px] font-bold text-brand-500">+{ach.xpReward} XP</p>}
                 </div>
              );
           })}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Activity This Week</h3>
          <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">
            Target: 6/day
          </span>
        </div>
        
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                dy={10}
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-xl">
                        <p className="font-bold mb-1">{payload[0].payload.fullDate}</p>
                        <p>{payload[0].value} Sessions</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="sessions" radius={[6, 6, 6, 6]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.sessions >= 6 ? '#4f46e5' : entry.sessions > 0 ? '#818cf8' : '#f1f5f9'} 
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: any, value: number, label: string, color: 'accent' | 'brand' | 'violet' }> = ({ icon: Icon, value, label, color }) => {
  const colorStyles = {
    accent: 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30',
    brand: 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
    violet: 'bg-violet-50 dark:bg-violet-900/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/30',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorStyles[color]} flex flex-col justify-between h-28 hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-center gap-2 opacity-80">
        <Icon size={18} />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
};