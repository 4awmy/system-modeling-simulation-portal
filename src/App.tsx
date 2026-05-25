import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { EnhancedCurriculumView } from './components/EnhancedCurriculumView';
import { enhancedLectures } from './data/lectures-enhanced';
import { PracticeZone } from './components/PracticeZone';
import { ApplicationsView } from './components/ApplicationsView';
import { AITutorSim } from './components/AITutorSim';
import { InstructorDashboard } from './components/InstructorDashboard';
import type { Lecture, Announcement, Exercise } from './types/simulation';

import initialLectures from './data/lectures.json';
import initialAnnouncements from './data/announcements.json';
import initialExercises from './data/exercises.json';
import { problemRegistryByWeek } from './data/problemRegistry';

const withProblemRegistry = (input: Lecture[]): Lecture[] =>
  input.map((lecture) => {
    const registryProblems = problemRegistryByWeek[lecture.id];
    if (!registryProblems) {
      return lecture;
    }

    const existingCount = lecture.solvedProblems?.length ?? 0;
    if (existingCount >= registryProblems.length) {
      return lecture;
    }

    return {
      ...lecture,
      solvedProblems: registryProblems,
    };
  });

function App() {
  const [activeTab, setActiveTab] = useState<string>('curriculum');
  const [isInstructorMode, setIsInstructorMode] = useState<boolean>(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  // Load state from local storage or fallback to static json databases
  const [lectures, setLectures] = useState<Lecture[]>(() => {
    const saved = localStorage.getItem('aast_sim_lectures');
    const parsed = saved ? (JSON.parse(saved) as Lecture[]) : (initialLectures as Lecture[]);
    return withProblemRegistry(parsed);
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('aast_sim_announcements');
    return saved ? (JSON.parse(saved) as Announcement[]) : (initialAnnouncements as Announcement[]);
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('aast_sim_exercises');
    return saved ? (JSON.parse(saved) as Exercise[]) : (initialExercises as Exercise[]);
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('aast_sim_lectures', JSON.stringify(lectures));
  }, [lectures]);

  useEffect(() => {
    localStorage.setItem('aast_sim_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('aast_sim_exercises', JSON.stringify(exercises));
  }, [exercises]);

  const handleToggleInstructor = () => {
    if (isInstructorMode) {
      setIsInstructorMode(false);
      setActiveTab('curriculum');
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
        {activeTab === 'curriculum' && (
          <EnhancedCurriculumView 
            lectures={enhancedLectures} 
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

        {activeTab === 'applications' && (
          <ApplicationsView />
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
            College of Computing and Information Technology • System Modeling & Simulation Teaching Portal
          </p>
          <p className="text-[10px] text-slate-400">
            © {new Date().getFullYear()} Dr. Farouk Shaaban. Designed for curriculum teaching, trace-based simulation, and solved problems.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
