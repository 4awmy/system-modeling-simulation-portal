import React, { useState, useEffect } from 'react';
import { TimelineDemo } from './TimelineDemo';
import type { TimelineScenario } from './TimelineDemo';
import {
  AssemblyLineDemo,
  InventoryLeadTimeDemo,
  MonteCarloCoinDemandDemo,
  MultiStageDecisionDemo,
  QueueSimulatorDemo,
  RepairmanDemo,
  TimeEventScanDemo,
  ValidationDemo,
  RNGPlayground,
  AccidentFootballPlayground,
} from './Demos';
import { Sparkles, BarChart2, Cpu } from 'lucide-react';

interface CurriculumDemoWrapperProps {
  demoComponent?: string;
  demoScenario?: TimelineScenario;
  weekId?: string;
}

export const CurriculumDemoWrapper: React.FC<CurriculumDemoWrapperProps> = ({
  demoScenario,
  weekId = '',
}) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'playground'>('trace');

  // Determine if a playground component is available for this week
  const getPlaygroundComponent = (id: string) => {
    switch (id) {
      case 'w2':
        return <RNGPlayground />;
      case 'w3':
        return <MonteCarloCoinDemandDemo />;
      case 'w4':
        return <AccidentFootballPlayground />;
      case 'w5':
        return <MultiStageDecisionDemo />;
      case 'w6':
      case 'w12':
        return <TimeEventScanDemo />;
      case 'w7':
      case 'w10':
        return <QueueSimulatorDemo />;
      case 'w8':
        return <ValidationDemo />;
      case 'w9':
        return <InventoryLeadTimeDemo />;
      case 'w11':
        return <AssemblyLineDemo />;
      case 'w13':
        return <RepairmanDemo />;
      default:
        return null;
    }
  };

  const playground = getPlaygroundComponent(weekId);
  const hasTrace = !!demoScenario;
  const hasPlayground = !!playground;

  // Auto-switch active tab when week changes
  useEffect(() => {
    if (hasTrace) {
      setActiveTab('trace');
    } else if (hasPlayground) {
      setActiveTab('playground');
    }
  }, [weekId, hasTrace, hasPlayground]);

  // Don't render anything if no visualization is available
  if (!hasTrace && !hasPlayground) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-lg my-8 transition-all animate-fade-in relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-aast-navy-soft/30 rounded-full blur-2xl pointer-events-none" />
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-aast-navy flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-aast-gold" />
            Interactive Lab & Visualizer
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hands-on simulation playground corresponding to Dr. Farouk Shaaban's lecture material.
          </p>
        </div>

        {/* Tab Controls (only shown if both trace and playground exist) */}
        {hasTrace && hasPlayground && (
          <div className="flex border border-slate-200 bg-slate-50 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('trace')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'trace'
                  ? 'bg-aast-navy text-aast-gold shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              Step Trace
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'playground'
                  ? 'bg-aast-navy text-aast-gold shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              Calculator Lab
            </button>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="transition-all duration-300">
        {activeTab === 'trace' && hasTrace && demoScenario && (
          <div className="space-y-4">
            <TimelineDemo scenario={demoScenario} />
          </div>
        )}

        {activeTab === 'playground' && hasPlayground && playground && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-150">
            {playground}
          </div>
        )}

        {!hasTrace && activeTab === 'trace' && hasPlayground && (
          <div className="text-center py-6 text-slate-400 text-xs">
            No trace available for this week. Please switch to the Calculator Lab tab.
          </div>
        )}
      </div>

      {/* Tip Box */}
      <div className="mt-4 p-3 bg-aast-gold-soft/50 border border-aast-gold/20 rounded-xl text-[11px] text-aast-navy flex gap-2">
        <span className="font-extrabold text-aast-gold-dark text-xs flex-shrink-0">★</span>
        <p className="leading-relaxed">
          {activeTab === 'trace' 
            ? "Use the 'Play' and 'Next' controls above to trace state transitions step-by-step as outlined in the course textbook."
            : "Adjust input parameters, initial stocks, or arrival times above to recalculate metrics and witness simulation variance dynamically."}
        </p>
      </div>
    </div>
  );
};

export default CurriculumDemoWrapper;
