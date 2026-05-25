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
  TrafficLightDemo,
  MidSquarePlayground,
  EventDrivenQueueDemo,
} from './Demos';

// ---- visual metadata per app ----
const appMeta: Record<string, { icon: string; gradient: string; accent: string }> = {
  app_rng:            { icon: '🎲', gradient: 'from-violet-600 to-indigo-700', accent: 'bg-violet-100 text-violet-700 border-violet-200' },
  app_accident_football: { icon: '⚽', gradient: 'from-rose-500 to-orange-600', accent: 'bg-rose-100 text-rose-700 border-rose-200' },
  app_queue:          { icon: '🏪', gradient: 'from-sky-500 to-blue-700',    accent: 'bg-sky-100 text-sky-700 border-sky-200' },
  app_inventory:      { icon: '📦', gradient: 'from-amber-500 to-yellow-600', accent: 'bg-amber-100 text-amber-700 border-amber-200' },
  app_repairman:      { icon: '🔧', gradient: 'from-slate-600 to-gray-800',   accent: 'bg-slate-100 text-slate-700 border-slate-200' },
  app_assembly:       { icon: '🏭', gradient: 'from-emerald-500 to-teal-700', accent: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  app_validation:     { icon: '📊', gradient: 'from-purple-500 to-fuchsia-700',accent: 'bg-purple-100 text-purple-700 border-purple-200' },
  app_traffic_light:  { icon: '🚦', gradient: 'from-green-500 to-emerald-700',accent: 'bg-green-100 text-green-700 border-green-200' },
  app_mid_square:     { icon: '🔢', gradient: 'from-cyan-500 to-sky-700',    accent: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  app_mm1_queue:      { icon: '⚙️', gradient: 'from-orange-500 to-red-700',  accent: 'bg-orange-100 text-orange-700 border-orange-200' },
};

const applications: ApplicationCard[] = [
  {
    id: 'app_rng',
    title: 'Random Number Generators',
    focus: 'Primary Focus',
    summary: 'Generate random streams using LCG, Mid-Square, and mapping methods. Validate distribution uniformity and understand why proper RNGs are the backbone of every simulation.',
    relatedWeeks: ['Week 01', 'Week 02', 'Week 03'],
    metrics: ['frequency stability', 'mapping consistency', 'goodness-of-fit'],
    demoType: 'rng',
  },
  {
    id: 'app_accident_football',
    title: 'Accident & Football Models',
    focus: 'Discrete Risk',
    summary: 'Section problems: Simulate daily accident costs with multi-stage random number mapping. Model football squad depletion across injury stages. Track penalty budgets and cumulative outcomes.',
    relatedWeeks: ['Week 04'],
    metrics: ['daily accident cost', 'squad depletion rate', 'injury counts'],
    demoType: 'accident_football',
  },
  {
    id: 'app_traffic_light',
    title: 'Traffic Light Simulation',
    focus: 'Discrete Probability',
    summary: 'Section C++ problem: Given theoretical probabilities P(Green), P(Yellow), P(Red) — simulate N trials, count each color, compute simulated probabilities, and calculate the percentage error for each vs. the theoretical.',
    relatedWeeks: ['Week 02', 'Week 03'],
    metrics: ['P(Green) error %', 'P(Yellow) error %', 'P(Red) error %'],
    demoType: 'traffic_light',
  },
  {
    id: 'app_mid_square',
    title: 'Middle-Square Method (PRNG)',
    focus: 'PRNG Algorithm',
    summary: 'Section exercise: Write the Mid-Square algorithm and generate 4-digit random numbers starting with seed 2041. Build the full trace table from seed to degeneration. State when degeneration occurs and analyse suitability.',
    relatedWeeks: ['Week 02'],
    metrics: ['cycle length', 'degeneration step', 'PRNG suitability'],
    demoType: 'mid_square',
  },
  {
    id: 'app_queue',
    title: 'Queue Operations (FIFO)',
    focus: 'Operations',
    summary: 'Apply simulation to single-server waiting lines. Compute start-of-service, departure times, and waiting times. Understand server utilization, throughput, and mean queue length.',
    relatedWeeks: ['Week 10', 'Week 11', 'Week 13'],
    metrics: ['avg wait', 'utilization', 'queue length'],
    demoType: 'queue',
  },
  {
    id: 'app_mm1_queue',
    title: 'M/M/1 Event-Driven Queue',
    focus: 'Queueing Theory',
    summary: 'Section problem: Given M/M/1 with arrival rate X and departure rate Y, starting with empty system — implement full event-driven simulation. Show FEL, LQ, LS, clock, and C++ program code.',
    relatedWeeks: ['Week 10', 'Week 13'],
    metrics: ['system state', 'FEL accuracy', 'server utilization'],
    demoType: 'mm1_queue',
  },
  {
    id: 'app_inventory',
    title: 'Inventory with Lead Time',
    focus: 'Supply',
    summary: 'Model reorder points with stochastic demand and uncertain lead times. Track daily stock, identify stockout events, and evaluate order frequency under different reorder policies.',
    relatedWeeks: ['Week 04', 'Week 05'],
    metrics: ['stockout days', 'average stock', 'order frequency'],
    demoType: 'inventory',
  },
  {
    id: 'app_repairman',
    title: 'Repairman Systems',
    focus: 'Maintenance',
    summary: 'Compare one-repairman vs two-repairman performance under stochastic machine failures. Evaluate repair queue pressure, server utilization, and downtime under both staffing strategies.',
    relatedWeeks: ['Week 12'],
    metrics: ['repair utilization', 'downtime pressure', 'queue pressure'],
    demoType: 'repairman',
  },
  {
    id: 'app_assembly',
    title: 'Assembly Line Bottlenecks',
    focus: 'Manufacturing',
    summary: 'Evaluate station-rate mismatch in tandem production lines. Identify blocking events, WIP buildup, and bottleneck stations using discrete-event simulation (Bob & Ray model from section).',
    relatedWeeks: ['Week 07', 'Week 11'],
    metrics: ['throughput', 'WIP pressure', 'bottleneck station'],
    demoType: 'assembly',
  },
  {
    id: 'app_validation',
    title: 'Statistical Validation',
    focus: 'Model Quality',
    summary: 'Use Chi-square goodness-of-fit and KS test workflows to validate that generated or observed data matches the intended distribution. Essential for verifying simulation model credibility.',
    relatedWeeks: ['Week 08'],
    metrics: ['chi-square statistic', 'fit confidence', 'distribution mismatch'],
    demoType: 'validation',
  },
];

const renderDemo = (type: ApplicationCard['demoType']) => {
  switch (type) {
    case 'rng':            return <RNGPlayground />;
    case 'accident_football': return <AccidentFootballPlayground />;
    case 'traffic_light':  return <TrafficLightDemo />;
    case 'mid_square':     return <MidSquareApplicationDemo />;
    case 'queue':          return <QueueSimulatorDemo />;
    case 'mm1_queue':      return <EventDrivenQueueDemo />;
    case 'inventory':      return <InventoryLeadTimeDemo />;
    case 'repairman':      return <RepairmanDemo />;
    case 'assembly':       return <AssemblyLineDemo />;
    case 'validation':     return <ValidationDemo />;
    default: return null;
  }
};

// Mid-Square standalone with seed 2041 default + explanation panel
const MidSquareApplicationDemo: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200 rounded-xl p-4 text-xs space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">📐</span>
        <h4 className="font-black text-cyan-800 text-sm">Middle-Square Method — Algorithm</h4>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-cyan-200 p-3 space-y-1.5">
          <p className="font-black text-cyan-700 uppercase text-[10px] tracking-wider">Algorithm Steps</p>
          <ol className="list-decimal ml-4 space-y-1 text-slate-700">
            <li>Start with a 4-digit seed X₀</li>
            <li>Square it: X₀²  (up to 8 digits, zero-pad left)</li>
            <li>Extract the <span className="font-black text-cyan-700">middle 4 digits</span> → X₁</li>
            <li>Normalize: U₁ = X₁ / 10000</li>
            <li>Repeat from step 2 with X₁</li>
            <li>Stop when Xₙ = 0 (degeneration)</li>
          </ol>
        </div>
        <div className="bg-white rounded-lg border border-cyan-200 p-3 space-y-1.5">
          <p className="font-black text-cyan-700 uppercase text-[10px] tracking-wider">Suitability Analysis</p>
          <div className="space-y-2">
            <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-700">
              <p className="font-bold text-[10px]">❌ NOT Suitable For Most Simulations</p>
              <p className="text-[10px] mt-0.5">Short cycle length → patterns repeat quickly. Degenerates to 0 with many seeds. Poor statistical properties fail uniformity tests.</p>
            </div>
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-700">
              <p className="font-bold text-[10px]">✅ Better Alternative: LCG</p>
              <p className="text-[10px] mt-0.5">Linear Congruential Generator: Xₙ₊₁ = (a·Xₙ + c) mod m. Longer period, proven statistical quality, widely used in practice.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-amber-200 p-3">
        <p className="font-black text-amber-700 uppercase text-[10px] tracking-wider mb-1">Example Trace — Seed 2041</p>
        <div className="font-mono text-[10px] text-slate-600 space-y-0.5">
          <p>X₀ = <strong>2041</strong> → 2041² = 04165681 → middle = <strong className="text-cyan-700">1656</strong>, U = 0.1656</p>
          <p>X₁ = <strong>1656</strong> → 1656² = 02742336 → middle = <strong className="text-cyan-700">7423</strong>, U = 0.7423</p>
          <p>X₂ = <strong>7423</strong> → 7423² = 55100929 → middle = <strong className="text-cyan-700">1009</strong>, U = 0.1009</p>
          <p>X₃ = <strong>1009</strong> → 1009² = 01018081 → middle = <strong className="text-cyan-700">0180</strong>, U = 0.0180</p>
          <p>... continues until degeneration to 0</p>
        </div>
      </div>
    </div>
    <MidSquarePlayground defaultSeed={2041} />
  </div>
);

export const ApplicationsView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(applications[0].id);
  const active = applications.find((a) => a.id === selectedId) ?? applications[0];
  const meta = appMeta[active.id] ?? { icon: '⚡', gradient: 'from-slate-600 to-gray-800', accent: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-aast-navy to-slate-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-black tracking-tight">Simulation Applications</h1>
        <p className="text-sm text-slate-300 mt-1">
          Interactive demos for all major course applications — including section exercises with C++ code
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {applications.map((app) => {
            const m = appMeta[app.id];
            const isActive = selectedId === app.id;
            return (
              <button
                key={app.id}
                onClick={() => setSelectedId(app.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-aast-navy border-white shadow-lg scale-105'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <span>{m?.icon}</span>
                <span className="hidden sm:inline">{app.title.split(' ').slice(0, 2).join(' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs uppercase font-black text-aast-navy tracking-wider">All Applications</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{applications.length} simulations available</p>
          </div>
          <div className="p-2 space-y-1 max-h-[65vh] overflow-y-auto custom-scrollbar">
            {applications.map((app) => {
              const m = appMeta[app.id];
              const isActive = selectedId === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedId(app.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'border-aast-navy/20 shadow-sm'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%)', color: 'white' } : {}}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m?.icon}</span>
                    <div className="min-w-0">
                      <p className={`font-bold text-xs truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {app.title}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                        {app.focus} · {app.relatedWeeks[0]}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <section className="lg:col-span-2 space-y-4">
          {/* Hero card */}
          <div className={`bg-gradient-to-br ${meta.gradient} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{meta.icon}</span>
                  <div>
                    <p className="text-xs font-bold opacity-70 uppercase tracking-wider">{active.focus}</p>
                    <h2 className="text-xl font-black">{active.title}</h2>
                  </div>
                </div>
                <p className="text-sm opacity-85 mt-3 leading-relaxed">{active.summary}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {active.relatedWeeks.map((w) => (
                <span key={w} className="text-[10px] px-2.5 py-1 rounded-full bg-white/20 text-white font-bold border border-white/30">
                  {w}
                </span>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {active.metrics.map((m_) => (
                <span key={m_} className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${meta.accent} opacity-90`}>
                  {m_}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive demo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
                Interactive Demo
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            {renderDemo(active.demoType)}
          </div>
        </section>
      </div>
    </div>
  );
};
