import React from 'react';
import { BookOpen, CheckSquare, ShieldAlert, Award } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isInstructorMode: boolean;
  onToggleInstructor: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  isInstructorMode,
  onToggleInstructor,
}) => {
  const navItems = [
    { id: 'lectures', label: 'Lectures & Sheets', icon: BookOpen },
    { id: 'practice', label: 'Practice Zone', icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* AAST Branding Crest & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('lectures')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-aast-navy text-aast-gold shadow-md">
            <Award className="h-6 w-6 stroke-[1.5]" />
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-aast-gold text-[8px] font-black text-aast-navy border border-white">
              AAST
            </div>
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight text-aast-navy sm:text-lg">
              AAST Computer Graphics
            </h1>
            <p className="text-[10px] font-medium text-slate-500">
              Dr. Gouda Ismail • Portal
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-aast-navy text-aast-gold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls / Instructor Toggle */}
        <div className="flex items-center space-x-2">
          {/* Mobile navigation button dropdown or small indicator */}
          <div className="flex md:hidden space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-aast-navy text-aast-gold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>

          <span className="h-6 w-px bg-slate-200 hidden sm:inline-block" />

          {/* Instructor Mode Trigger */}
          <button
            onClick={onToggleInstructor}
            className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              isInstructorMode
                ? 'bg-amber-500 border-amber-600 text-white shadow-sm hover:bg-amber-600'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <ShieldAlert className={`h-3.5 w-3.5 ${isInstructorMode ? 'animate-pulse' : ''}`} />
            <span>{isInstructorMode ? 'Instructor Mode' : 'Instructor'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
