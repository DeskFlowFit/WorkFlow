
import React, { useState, useEffect } from 'react';
import { loadUser, saveUser } from './utils';
import { UserProfile, ScreenName, Exercise } from './types';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { WorkoutPlayer } from './pages/WorkoutPlayer';
import { Library } from './pages/Library';
import { Progress } from './pages/Progress';
import { Settings } from './pages/Settings';
import { Layout } from './components/Layout';
import { HashRouter } from 'react-router-dom';

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [screen, setScreen] = useState<ScreenName>('onboarding');
  const [activeWorkout, setActiveWorkout] = useState<Exercise[] | undefined>(undefined);

  useEffect(() => {
    const loaded = loadUser();
    if (loaded && loaded.onboardingCompleted) {
      setUser(loaded);
      setScreen('dashboard');
    }
    
    // Check system dark mode preference on load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    saveUser(profile);
    setScreen('dashboard');
  };

  const handleStartWorkout = (exercises?: Exercise[]) => {
    setActiveWorkout(exercises);
    setScreen('workout');
  };

  const handleFinishWorkout = () => {
    setScreen('dashboard');
    setActiveWorkout(undefined);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const navigate = (s: ScreenName) => {
    setScreen(s);
  };

  // Render specific screens without layout for immersive experience
  if (screen === 'workout') {
     return user ? (
      <WorkoutPlayer 
        user={user} 
        onFinish={handleFinishWorkout} 
        onExit={() => setScreen('dashboard')}
        exercises={activeWorkout}
      />
     ) : null;
  }

  if (screen === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Screens with Layout
  return (
    <HashRouter>
      <Layout currentScreen={screen} onNavigate={navigate}>
        {screen === 'dashboard' && user && (
          <Dashboard user={user} onStartWorkout={handleStartWorkout} />
        )}
        {screen === 'library' && (
          <Library />
        )}
        {screen === 'progress' && (
          <Progress />
        )}
        {screen === 'settings' && user && (
          <Settings user={user} onUpdateUser={handleUpdateUser} />
        )}
      </Layout>
    </HashRouter>
  );
};

export default App;
