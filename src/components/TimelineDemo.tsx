import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export interface TimelineState {
  time: number;
  name: string;
  description: string;
  entities: Record<string, { position: number; label: string; color: string; status?: string }>;
}

export interface TimelineScenario {
  title: string;
  description: string;
  states: TimelineState[];
  totalTime: number;
  speed: number; // milliseconds per step
}

const getColorClass = (colorName: string) => {
  switch (colorName?.toLowerCase()) {
    case 'blue':
      return 'bg-gradient-to-r from-sky-400 to-blue-500 shadow-lg shadow-sky-500/30 text-white border border-sky-300/30';
    case 'green':
      return 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30 text-white border border-emerald-300/30';
    case 'red':
    case 'darkred':
      return 'bg-gradient-to-r from-rose-500 to-red-600 shadow-lg shadow-rose-500/30 text-white border border-rose-400/30';
    case 'orange':
    case 'darkorange':
      return 'bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg shadow-orange-500/30 text-white border border-orange-300/30';
    case 'yellow':
      return 'bg-gradient-to-r from-amber-300 to-yellow-400 shadow-lg shadow-yellow-400/30 text-slate-900 border border-yellow-200/50';
    case 'gray':
    default:
      return 'bg-gradient-to-r from-slate-400 to-slate-500 shadow-lg shadow-slate-500/20 text-white border border-slate-300/20';
  }
};

/**
 * Interactive Timeline Demo Component
 * Visualizes discrete event scenarios with movable entities and state transitions
 * Used for pump, car-stop, and other event-driven simulations
 */
export const TimelineDemo: React.FC<{ scenario: TimelineScenario }> = ({ scenario }) => {
  const [currentStateIdx, setCurrentStateIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentState = scenario.states[currentStateIdx];
  const progress = (currentStateIdx / (scenario.states.length - 1)) * 100;

  const handleNext = () => {
    if (currentStateIdx < scenario.states.length - 1) {
      setCurrentStateIdx(currentStateIdx + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStateIdx > 0) {
      setCurrentStateIdx(currentStateIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStateIdx(0);
    setIsPlaying(false);
  };

  // Auto-play loop
  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => handleNext(), scenario.speed || 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStateIdx]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-slate-100 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-aast-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-aast-navy-light/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-aast-gold animate-pulse-subtle" />
            {scenario.title}
          </h3>
          <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700/50">
            DES Visualizer
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{scenario.description}</p>
      </div>

      {/* Timeline Visualization Track Console */}
      <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-800/60 space-y-4">
        {/* Track Lanes */}
        <div className="space-y-4 relative">
          {Object.entries(currentState.entities).map(([key, entity]) => {
            const pctPosition = (entity.position / (scenario.totalTime || 100)) * 100;
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-300">{entity.label}</span>
                  <span className="font-mono text-slate-500">Pos: {entity.position} / {scenario.totalTime}</span>
                </div>
                
                {/* Lane Track */}
                <div className="h-8 relative w-full bg-slate-950/80 border border-slate-800/80 rounded-lg overflow-hidden">
                  {/* Subtle Grid Markings inside lane */}
                  <div className="absolute inset-0 flex justify-between pointer-events-none opacity-10">
                    <div className="border-r border-dashed border-white h-full" />
                    <div className="border-r border-dashed border-white h-full" />
                    <div className="border-r border-dashed border-white h-full" />
                    <div className="border-r border-dashed border-white h-full" />
                  </div>
                  
                  {/* Entity Node Slider */}
                  <div
                    className={`absolute top-0.5 bottom-0.5 rounded-md transition-all duration-300 px-2 flex items-center justify-center font-bold text-[10px] uppercase tracking-wider ${getColorClass(
                      entity.color
                    )}`}
                    style={{
                      left: `${Math.min(92, Math.max(0.5, pctPosition))}%`,
                      width: 'fit-content',
                      minWidth: '5rem',
                    }}
                  >
                    <span className="truncate">{entity.status || 'Active'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time display HUD */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 bg-slate-950/20 px-3 py-2 rounded-lg">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clock Status</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-white font-mono">
              Simulation Time: <span className="text-aast-gold text-lg">{currentState.time.toFixed(1)}</span>
            </div>
            <div className="text-[10px] text-aast-gold-light/80 font-semibold">{currentState.name}</div>
          </div>
        </div>
      </div>

      {/* State Description */}
      <div className="bg-gradient-to-r from-aast-navy-dark/40 to-slate-900/60 border border-aast-gold/20 rounded-xl p-4 shadow-inner relative">
        <div className="absolute top-3 left-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aast-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-aast-gold"></span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed pl-4">
          {currentState.description}
        </p>
      </div>

      {/* Progress & Speed bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center border-t border-slate-800/60 pt-4">
        {/* Progress track */}
        <div className="sm:col-span-3 space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span>Progress: {progress.toFixed(0)}%</span>
            <span>Step {currentStateIdx + 1} of {scenario.states.length}</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-aast-gold to-yellow-400 h-full transition-all duration-300 shadow shadow-yellow-500/20"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls Panel */}
        <div className="sm:col-span-1 flex items-center justify-end gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Reset to Seed"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={handlePrev}
            disabled={currentStateIdx === 0}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Previous Step"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
              isPlaying 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' 
                : 'bg-aast-gold hover:bg-aast-gold-dark text-slate-950 shadow-aast-gold/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> Play
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStateIdx === scenario.states.length - 1}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Next Step"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Legend / Key Insights */}
      <div className="text-[10px] text-slate-400 bg-slate-900/20 border border-slate-900 p-3 rounded-lg flex gap-2">
        <HelpCircle className="h-4 w-4 text-aast-gold flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-200">Simulation Insight:</p>
          <p className="mt-0.5 leading-relaxed">
            Entities change positions based on cumulative event timing. Yellow nodes signify active decisions, red indicates busy/blocked bottlenecks, and green shows system-ready idle states.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelineDemo;
