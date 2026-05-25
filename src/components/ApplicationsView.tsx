import React, { useState } from 'react';
import type { ApplicationCard } from '../types/simulation';
import {
  AssemblyLineDemo,
  InventoryLeadTimeDemo,
  QueueSimulatorDemo,
  RepairmanDemo,
  ValidationDemo,
  RNGPlayground,
  AccidentFootballPlayground,
} from './Demos';

const applications: ApplicationCard[] = [
  {
    id: 'app_rng',
    title: 'Random Number Generators',
    focus: 'Primary Focus',
    summary: 'Generate random streams, map outcomes, and validate distributions for simulation reliability.',
    relatedWeeks: ['Week 01', 'Week 02', 'Week 03'],
    metrics: ['frequency stability', 'mapping consistency', 'goodness-of-fit'],
    demoType: 'rng',
  },
  {
    id: 'app_accident_football',
    title: 'Accident & Football Models',
    focus: 'Discrete Risk',
    summary: 'Model multi-stage discrete events, tracking penalty budgets and squad depletion dynamics from real course slides.',
    relatedWeeks: ['Week 04'],
    metrics: ['daily accident cost', 'squad depletion rate', 'injury counts'],
    demoType: 'accident_football',
  },
  {
    id: 'app_queue',
    title: 'Queue Operations',
    focus: 'Operations',
    summary: 'Apply simulation to waiting lines, server utilization, and throughput balancing.',
    relatedWeeks: ['Week 10', 'Week 11', 'Week 13'],
    metrics: ['avg wait', 'utilization', 'queue length'],
    demoType: 'queue',
  },
  {
    id: 'app_inventory',
    title: 'Inventory with Lead Time',
    focus: 'Supply',
    summary: 'Model reorder points, uncertain demand, and stochastic lead time arrivals.',
    relatedWeeks: ['Week 04', 'Week 05'],
    metrics: ['stockout days', 'average stock', 'order frequency'],
    demoType: 'inventory',
  },
  {
    id: 'app_repairman',
    title: 'Repairman Systems',
    focus: 'Maintenance',
    summary: 'Compare one-repairman vs two-repairman performance under machine failures.',
    relatedWeeks: ['Week 12'],
    metrics: ['repair utilization', 'downtime pressure', 'queue pressure'],
    demoType: 'repairman',
  },
  {
    id: 'app_assembly',
    title: 'Assembly Line Bottlenecks',
    focus: 'Manufacturing',
    summary: 'Evaluate station-rate mismatch and identify bottlenecks using simulation.',
    relatedWeeks: ['Week 07', 'Week 11'],
    metrics: ['throughput', 'WIP pressure', 'bottleneck station'],
    demoType: 'assembly',
  },
  {
    id: 'app_validation',
    title: 'Statistical Validation',
    focus: 'Model Quality',
    summary: 'Use Chi-square and KS workflows to validate generated or observed distributions.',
    relatedWeeks: ['Week 08'],
    metrics: ['chi-square statistic', 'fit confidence', 'distribution mismatch'],
    demoType: 'validation',
  },
];

const renderDemo = (type: ApplicationCard['demoType']) => {
  switch (type) {
    case 'rng':
      return <RNGPlayground />;
    case 'accident_football':
      return <AccidentFootballPlayground />;
    case 'queue':
      return <QueueSimulatorDemo />;
    case 'inventory':
      return <InventoryLeadTimeDemo />;
    case 'repairman':
      return <RepairmanDemo />;
    case 'assembly':
      return <AssemblyLineDemo />;
    case 'validation':
      return <ValidationDemo />;
    default:
      return null;
  }
};

export const ApplicationsView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(applications[0].id);
  const active = applications.find((a) => a.id === selectedId) ?? applications[0];

  return (
    <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
      <aside className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
        <h3 className="text-xs uppercase font-black text-aast-navy tracking-wider">Applications</h3>
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedId(app.id)}
            className={`w-full text-left p-3 rounded-lg border text-xs transition ${
              selectedId === app.id
                ? 'bg-aast-navy text-aast-gold border-aast-navy'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <p className="font-bold">{app.title}</p>
            <p className={`text-[10px] mt-0.5 ${selectedId === app.id ? 'text-aast-gold/80' : 'text-slate-500'}`}>{app.focus}</p>
          </button>
        ))}
      </aside>

      <section className="md:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-black text-aast-navy">{active.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{active.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {active.relatedWeeks.map((w) => (
              <span key={w} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">{w}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Primary metrics: {active.metrics.join(' • ')}</p>
        </div>
        {renderDemo(active.demoType)}
      </section>
    </div>
  );
};
