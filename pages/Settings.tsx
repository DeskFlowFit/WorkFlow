import React, { useState } from 'react';
import { UserProfile, FitnessLevel } from '../types';
import { saveUser } from '../utils';
import { Button } from '../components/Button';
import { User, Bell, Clock, Shield, Trash2, Moon, Sun, ChevronRight, Save, Cloud, LogOut, Mail, Lock, Check } from 'lucide-react';

interface Props {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const Settings: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isDirty, setIsDirty] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

  // Auth State
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    onUpdateUser(formData);
    saveUser(formData);
    setIsDirty(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure? This will delete all your progress, history, and settings. This action cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Mock Auth Handlers
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    setIsAuthLoading(true);
    // Simulate API delay
    setTimeout(() => {
        const updatedUser = {
            ...formData,
            email: authEmail,
            isAuthenticated: true,
            lastSyncDate: new Date().toISOString()
        };
        setFormData(updatedUser);
        onUpdateUser(updatedUser);
        saveUser(updatedUser);
        setIsAuthLoading(false);
        setAuthModal(null);
        setAuthEmail('');
        setAuthPassword('');
        alert(authModal === 'signup' ? "Account created successfully!" : "Logged in successfully!");
    }, 1500);
  };

  const handleLogout = () => {
      if (confirm("Are you sure you want to log out? Local data will remain.")) {
          const updatedUser = {
              ...formData,
              isAuthenticated: false,
              email: undefined,
              lastSyncDate: undefined
          };
          setFormData(updatedUser);
          onUpdateUser(updatedUser);
          saveUser(updatedUser);
      }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
        {isDirty && (
          <Button onClick={handleSave} className="py-2 px-4 text-sm bg-brand-600 hover:bg-brand-700">
            <Save size={16} /> Save Changes
          </Button>
        )}
      </div>

      {showSaveSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-xl text-sm font-medium text-center animate-in fade-in">
          Settings saved successfully!
        </div>
      )}

      {/* Section: Account & Cloud Sync */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
            <Cloud size={18} className="text-brand-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-200">Account & Data</h3>
        </div>
        <div className="p-4">
            {formData.isAuthenticated ? (
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white">{formData.email}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                            <Check size={12} /> Synced: {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                    <Button variant="secondary" onClick={handleLogout} className="py-2 px-4 text-xs h-auto">
                        <LogOut size={14} /> Log Out
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Create an account to backup your progress and sync across devices.
                    </p>
                    <div className="flex gap-3">
                        <Button onClick={() => setAuthModal('signup')} fullWidth className="py-2.5 text-sm">
                            Sign Up
                        </Button>
                        <Button variant="secondary" onClick={() => setAuthModal('login')} fullWidth className="py-2.5 text-sm">
                            Log In
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Section: Profile */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
          <User size={18} className="text-brand-500" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200">My Profile</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Display Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-700 rounded-lg border-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Age</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-700 rounded-lg border-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weight (kg)</label>
              <input 
                type="number" 
                value={formData.weightKg}
                onChange={(e) => handleChange('weightKg', parseInt(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-700 rounded-lg border-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
              />
            </div>
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Intensity Level</label>
             <select 
               value={formData.fitnessLevel}
               onChange={(e) => handleChange('fitnessLevel', e.target.value)}
               className="w-full p-2 bg-slate-50 dark:bg-slate-700 rounded-lg border-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
             >
                <option value={FitnessLevel.Sedentary}>Sedentary (Beginner)</option>
                <option value={FitnessLevel.LightlyActive}>Lightly Active (Intermediate)</option>
                <option value={FitnessLevel.Active}>Active (Advanced)</option>
             </select>
             <p className="text-xs text-slate-400 mt-1">This adjusts exercise difficulty and reps.</p>
          </div>
        </div>
      </div>

      {/* Section: Schedule */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
          <Clock size={18} className="text-brand-500" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200">Work Schedule</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Start Time</label>
              <input 
                type="time" 
                value={formData.workStartTime}
                onChange={(e) => handleChange('workStartTime', e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-700 rounded-lg border-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">End Time</label>
              <input 
                type="time" 
                value={formData.workEndTime}
                onChange={(e) => handleChange('workEndTime', e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-700 rounded-lg border-none focus:ring-2 focus:ring-brand-500 dark:text-white font-medium"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
             <div className="flex items-center gap-3">
               <div className="bg-brand-100 dark:bg-brand-800 p-2 rounded-full text-brand-600 dark:text-brand-300">
                 <Bell size={18} />
               </div>
               <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Reminders Enabled</span>
             </div>
             <div className="w-10 h-5 bg-brand-500 rounded-full relative">
               <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Section: App Preferences */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4">
          <button onClick={toggleDarkMode} className="w-full flex items-center justify-between py-2 group">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
            </div>
            <span className="text-sm text-slate-500">{darkMode ? 'On' : 'Off'}</span>
          </button>
          
          <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

          <button className="w-full flex items-center justify-between py-2 group">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                <Shield size={18} />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">Privacy Policy</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-4">
        <button 
          onClick={handleClearData}
          className="w-full p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-center gap-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <Trash2 size={18} />
          <span className="font-bold">Reset All Progress</span>
        </button>
        <p className="text-center text-xs text-slate-400 mt-4">
          DeskFlow v1.0.2 (Build 240) <br/>
          Designed for sedentary warriors.
        </p>
      </div>

      {/* Auth Modal Overlay */}
      {authModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => !isAuthLoading && setAuthModal(null)} />
              <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      {authModal === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h3>
                  
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                          <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input 
                                type="email" 
                                required
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl border-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                                placeholder="you@example.com"
                            />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input 
                                type="password" 
                                required
                                minLength={6}
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl border-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                                placeholder="••••••••"
                            />
                          </div>
                      </div>

                      <div className="pt-2">
                        <Button fullWidth disabled={isAuthLoading} type="submit">
                            {isAuthLoading ? 'Syncing...' : authModal === 'login' ? 'Log In' : 'Create Account'}
                        </Button>
                      </div>

                      <p className="text-xs text-center text-slate-500 mt-4">
                          {authModal === 'login' ? "Don't have an account? " : "Already have an account? "}
                          <button 
                             type="button"
                             className="text-brand-600 font-bold hover:underline"
                             onClick={() => setAuthModal(authModal === 'login' ? 'signup' : 'login')}
                          >
                              {authModal === 'login' ? 'Sign Up' : 'Log In'}
                          </button>
                      </p>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};