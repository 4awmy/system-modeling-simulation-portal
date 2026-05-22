import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { LecturesView } from './components/LecturesView';
import { PracticeZone } from './components/PracticeZone';
import { AITutorSim } from './components/AITutorSim';
import { InstructorDashboard } from './components/InstructorDashboard';
import type { Lecture, Announcement, Exercise } from './components/InstructorDashboard';

import initialLectures from './data/lectures.json';
import initialAnnouncements from './data/announcements.json';
import initialExercises from './data/exercises.json';

function App() {
  const [activeTab, setActiveTab] = useState<string>('lectures');
  const [isInstructorMode, setIsInstructorMode] = useState<boolean>(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  // Load state from local storage or fallback to static json databases
  const [lectures, setLectures] = useState<Lecture[]>(() => {
    const saved = localStorage.getItem('aast_cg_lectures');
    return saved ? JSON.parse(saved) as Lecture[] : initialLectures as unknown as Lecture[];
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('aast_cg_announcements');
    return saved ? JSON.parse(saved) as Announcement[] : initialAnnouncements as unknown as Announcement[];
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('aast_cg_exercises');
    return saved ? JSON.parse(saved) as Exercise[] : initialExercises as unknown as Exercise[];
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('aast_cg_lectures', JSON.stringify(lectures));
  }, [lectures]);

  useEffect(() => {
    localStorage.setItem('aast_cg_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('aast_cg_exercises', JSON.stringify(exercises));
  }, [exercises]);

  const handleToggleInstructor = () => {
    if (isInstructorMode) {
      setIsInstructorMode(false);
      setActiveTab('lectures');
    } else {
      setIsInstructorMode(true);
      setActiveTab('instructor');
    }
  };

  const handleNavigateToExercise = (exerciseId: string) => {
    setActiveTab('practice');
    setSelectedExerciseId(exerciseId);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* AAST Global Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isInstructorMode={isInstructorMode}
        onToggleInstructor={handleToggleInstructor}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Render Tab Views */}
        {activeTab === 'lectures' && (
          <LecturesView 
            lectures={lectures} 
            announcements={announcements} 
            onNavigateToExercise={handleNavigateToExercise} 
          />
        )}
        
        {activeTab === 'practice' && (
          <PracticeZone 
            exercises={exercises} 
            selectedExerciseId={selectedExerciseId}
            setSelectedExerciseId={setSelectedExerciseId}
          />
        )}
        
        {activeTab === 'instructor' && (
          <InstructorDashboard
            lectures={lectures}
            setLectures={setLectures}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            exercises={exercises}
            setExercises={setExercises}
          />
        )}
      </main>

      {/* AITutor floating globally */}
      <AITutorSim />

      {/* AAST Academic Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-1">
          <p className="font-bold text-slate-700">
            Arab Academy for Science, Technology and Maritime Transport (AAST)
          </p>
          <p>
            College of Computing and Information Technology • Computer Graphics Portal
          </p>
          <p className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} Dr. Gouda Ismail. Designed for Student Learning & Visual Tracing.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
