import React, { useState } from 'react';
import { EXERCISES } from '../constants';
import { PlayCircle, AlertCircle, BookOpen, Clock, Zap } from 'lucide-react';
import { Exercise } from '../types';
import { ExerciseVideo } from '../components/ExerciseVideo';

export const Library = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'strength', label: 'Strength' },
    { id: 'mobility', label: 'Mobility' },
    { id: 'posture', label: 'Posture' },
    { id: 'cardio', label: 'Energy' },
  ];

  const filteredExercises = selectedCategory === 'all' 
    ? EXERCISES 
    : EXERCISES.filter(ex => ex.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-20 pb-4 pt-2">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Exercise Library</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
          Master the moves. Click any card to watch the video guide.
        </p>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredExercises.map((ex) => (
          <ExerciseCard 
            key={ex.id} 
            exercise={ex} 
            isExpanded={expandedId === ex.id} 
            onToggle={() => toggleExpand(ex.id)} 
          />
        ))}
      </div>
    </div>
  );
};

const ExerciseCard: React.FC<{ exercise: Exercise; isExpanded: boolean; onToggle: () => void }> = ({ 
  exercise, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <div 
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ${
        isExpanded ? 'ring-2 ring-brand-500 shadow-lg' : ''
      }`}
    >
      {/* Card Header (Clickable) */}
      <div 
        onClick={onToggle}
        className="cursor-pointer p-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
      >
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
           <ExerciseVideo videoUrl={exercise.videoUrl} className="w-full h-full scale-125" autoPlay={false} />
           {!isExpanded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <PlayCircle className="text-white opacity-90" size={24} />
            </div>
           )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-800 dark:text-white truncate pr-2">{exercise.name}</h3>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
              exercise.category === 'strength' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
              exercise.category === 'mobility' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            }`}>
              {exercise.category}
            </span>
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {exercise.description}
          </p>

          <div className="flex items-center gap-4 mt-2">
             <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
               {exercise.type === 'reps' ? (
                 <><Zap size={12} className="text-brand-500" /> {exercise.baseReps} Reps</>
               ) : (
                 <><Clock size={12} className="text-brand-500" /> {exercise.baseDurationSec}s</>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          
          {/* Video Player */}
          <div className="w-full aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
             <ExerciseVideo videoUrl={exercise.videoUrl} className="w-full h-full max-h-[300px]" autoPlay={true} />
          </div>

          <div className="p-5 space-y-6">
            
            {/* Instructions */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
                <BookOpen size={16} className="text-brand-500" />
                How to Perform
              </h4>
              <ol className="list-decimal list-outside pl-4 space-y-2">
                {exercise.instructions.map((step, idx) => (
                  <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Why It Works & Mistakes */}
            <div className="grid md:grid-cols-2 gap-4">
               <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                 <h5 className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-2">Science</h5>
                 <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{exercise.whyItWorks}"</p>
                 <p className="text-[10px] text-slate-500 mt-2 text-right">— {exercise.citation}</p>
               </div>

               <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
                 <h5 className="text-xs font-bold text-red-700 dark:text-red-300 uppercase flex items-center gap-1 mb-2">
                   <AlertCircle size={12} /> Common Mistakes
                 </h5>
                 <p className="text-sm text-slate-700 dark:text-slate-300">{exercise.commonMistakes}</p>
               </div>
            </div>

            {/* Modifications */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Modifications</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.modifications.map((mod, idx) => (
                  <div key={idx} className="px-3 py-2 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-300">
                    <span className={`font-bold uppercase mr-1 ${
                      mod.level === 'easier' ? 'text-green-600' : mod.level === 'harder' ? 'text-orange-600' : 'text-blue-600'
                    }`}>{mod.level}:</span>
                    {mod.description}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};