import React, { useState } from 'react';
import { StoreProvider, useStore } from './store';
import { TopBar, BubbleBackground } from './components/Layout';
import { LoginScreen } from './screens/Login';
import { LandingScreen } from './screens/Landing';
import { MissionMapScreen } from './screens/MissionMap';
import { Mission01 } from './screens/Mission01';
import { Mission02 } from './screens/Mission02';
import { Mission03 } from './screens/Mission03';
import { Mission04 } from './screens/Mission04';
import { Mission05 } from './screens/Mission05';
import { Mission06 } from './screens/Mission06';
import { Mission07 } from './screens/Mission07';
import { Mission08 } from './screens/Mission08';
import { ReflectionScreen } from './screens/Reflection';
import { CompletionScreen } from './screens/Completion';
import { TeacherScreen } from './screens/Teacher';
import { DeveloperScreen } from './screens/Developer';
import { CertificateScreen } from './screens/Certificate';
import { Screen, MissionId } from './types';

const AppInner: React.FC = () => {
  const { state, setCurrentMission } = useStore();
  const [screen, setScreen] = useState<Screen>(() =>
    state.profile ? { type: 'landing' } : { type: 'login' }
  );

  const go = (s: Screen) => {
    setScreen(s);
    if (s.type !== 'mission') setCurrentMission(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openMission = (id: MissionId) => {
    setCurrentMission(id);
    go({ type: 'mission', id });
  };

  const next = (from: MissionId) => {
    if (from === 8) return go({ type: 'reflection' });
    if (from >= 1 && from < 8) {
      return go({ type: 'mission', id: (from + 1) as MissionId });
    }
    go({ type: 'map' });
  };

  const renderScreen = () => {
    if (screen.type === 'login') {
      return <LoginScreen onDone={() => go({ type: 'landing' })} />;
    }

    if (screen.type === 'teacher') {
      return <TeacherScreen onBack={() => go({ type: 'map' })} />;
    }

    if (screen.type === 'landing') {
  return (
    <LandingScreen
      onStart={() => go({ type: 'map' })}
      onMap={() => go({ type: 'map' })}
      onAbout={() => go({ type: 'about' })}
    />
  );
}

    if (screen.type === 'map') {
      return (
        <MissionMapScreen
          onSelect={openMission}
          onTeacher={() => go({ type: 'teacher' })}
        />
      );
    }

    if (screen.type === 'reflection') {
      return <ReflectionScreen onComplete={() => go({ type: 'completion' })} />;
    }

    if (screen.type === 'completion') {
  return (
    <CompletionScreen
      onRestart={() => go({ type: 'map' })}
      onCertificate={() => go({ type: 'certificate' })}
    />
  );
}
    if (screen.type === 'about') {
  return <DeveloperScreen onBack={() => go({ type: 'landing' })} />;
}
if (screen.type === 'certificate') {
  return (
    <CertificateScreen
      onBack={() => go({ type: 'completion' })}
      onHome={() => go({ type: 'landing' })}
    />
  );
}
    // screen.type === 'mission'
    switch (screen.id) {
      case 1:
        return <Mission01 onComplete={() => next(1)} />;
      case 2:
        return <Mission02 onComplete={() => next(2)} />;
      case 3:
        return <Mission03 onComplete={() => next(3)} />;
      case 4:
        return <Mission04 onComplete={() => next(4)} />;
      case 5:
        return <Mission05 onComplete={() => next(5)} />;
      case 6:
        return <Mission06 onComplete={() => next(6)} />;
      case 7:
        return <Mission07 onComplete={() => next(7)} />;
      case 8:
        return <Mission08 onComplete={() => next(8)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      <BubbleBackground />
      {screen.type !== 'login' && (
        <TopBar
          onHome={() => go({ type: 'landing' })}
          onMap={() => go({ type: 'map' })}
        />
      )}
      <main className="relative z-10">{renderScreen()}</main>
      {screen.type !== 'login' && (
        <footer className="relative z-10 text-center text-xs text-slate-500 py-8">
          HYDRO LAB · Laboratorium IPA Virtual · Fase D SMP Kelas 9
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <StoreProvider>
    <AppInner />
  </StoreProvider>
);

export default App;
