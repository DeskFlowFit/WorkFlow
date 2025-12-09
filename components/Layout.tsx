import React from 'react';
import { ScreenName } from '../types';
import { Home, Library, BarChart2, User, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'library', icon: Library, label: 'Exercises' },
    { id: 'progress', icon: BarChart2, label: 'Progress' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 shadow-sm z-10 p-4 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/30">
             D
           </div>
           <h1 className="text-xl font-bold text-slate-800 dark:text-white">DeskFlow</h1>
        </div>
        <button 
          onClick={() => onNavigate('settings')}
          className={`p-2 rounded-full transition-all ${currentScreen === 'settings' ? 'bg-slate-100 dark:bg-slate-700 text-brand-600 dark:text-brand-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
        >
          <Settings size={22} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 max-w-3xl mx-auto w-full scroll-smooth">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 pb-safe transition-colors duration-300 z-50">
        <div className="flex justify-around p-3 max-w-3xl mx-auto">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentScreen === item.id;
             return (
               <button 
                key={item.id}
                onClick={() => onNavigate(item.id as ScreenName)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-brand-600 dark:text-brand-400 -translate-y-1' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
               >
                 <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                 <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.label}</span>
               </button>
             )
          })}
        </div>
      </nav>
    </div>
  );
};