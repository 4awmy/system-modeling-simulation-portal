import React, { useMemo, useState } from 'react';
import { FileText, Megaphone, Pin } from 'lucide-react';
import type { Announcement, Lecture } from '../types/simulation';
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
  RandomMappingDemo,
  EventDrivenQueueDemo,
  TrafficLightDemo,
} from './Demos';

interface LecturesViewProps {
  lectures: Lecture[];
  announcements: Announcement[];
  onNavigateToExercise?: (exerciseId: string) => void;
}

const demoByWeek = (id: string) => {
  // W1: System Foundations — RNG intro
  if (id === 'w1') return <RNGPlayground />;
  // W2: LCG + Mid-Square PRNG
  if (id === 'w2') return <RNGPlayground />;
  // W3: Monte Carlo / Demand simulation
  if (id === 'w3') return <MonteCarloCoinDemandDemo />;
  // W4: Discrete Observation Mapping — Coin, Die, Traffic Light
  if (id === 'w4') return (
    <div className="space-y-4">
      <RandomMappingDemo />
      <TrafficLightDemo />
    </div>
  );
  // W5: Multi-Stage Decision (Insurance Problem)
  if (id === 'w5') return <MultiStageDecisionDemo />;
  // W6: Variance Reduction / Antithetic Variates — Accident/Football multi-stage models
  if (id === 'w6') return <AccidentFootballPlayground />;
  // W7: Queueing Theory (M/M/1, Little's Law, balance equations)
  if (id === 'w7') return <QueueSimulatorDemo />;
  // W8: Inverse Transform + Revision (Chi-Square goodness-of-fit)
  if (id === 'w8') return <ValidationDemo />;
  // W9: Exam Debrief + Inventory Reorder Policy simulation
  if (id === 'w9') return <InventoryLeadTimeDemo />;
  // W10: Machine Maintenance — TTF/TTR, Repairman system
  if (id === 'w10') return <RepairmanDemo />;
  // W11: Two-Stage Assembly Line (Bob & Ray bottleneck)
  if (id === 'w11') return <AssemblyLineDemo />;
  // W12: Time-Advance Clock Mechanics (Periodic vs Event Scan, FEL)
  if (id === 'w12') return <TimeEventScanDemo />;
  // W13: M/M/1 Event-Driven Simulation + Finite-Source Repairman
  if (id === 'w13') return <EventDrivenQueueDemo />;
  return null;
};

export const LecturesView: React.FC<LecturesViewProps> = ({ lectures, announcements, onNavigateToExercise }) => {
  const [selectedId, setSelectedId] = useState<string>(lectures[0]?.id ?? '');
  const selected = useMemo(() => lectures.find((l) => l.id === selectedId) ?? lectures[0], [lectures, selectedId]);

  if (!selected) {
    return <div className="text-sm text-slate-600">No curriculum data found.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-4 animate-fade-in">
      <aside className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
        <h3 className="text-xs uppercase font-black tracking-wider text-aast-navy">Chronological Curriculum</h3>
        {lectures.map((lec) => (
          <button
            key={lec.id}
            onClick={() => setSelectedId(lec.id)}
            className={`w-full text-left rounded-lg px-3 py-2 text-xs border transition ${
              selected.id === lec.id
                ? 'bg-aast-navy text-aast-gold border-aast-navy'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="text-[10px] opacity-80">{lec.week}</div>
            <div className="font-bold truncate">{lec.title}</div>
          </button>
        ))}
      </aside>

      <main className="md:col-span-3 space-y-4">
        {announcements.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-aast-navy text-white px-4 py-2 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-aast-gold" />
              <p className="text-xs uppercase font-black tracking-wider">Announcements</p>
            </div>
            <div className="p-4 grid gap-2">
              {announcements.map((a) => (
                <div key={a.id} className="rounded border border-slate-200 p-3 bg-slate-50 text-xs">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-800">{a.title}</p>
                    {a.pinned && <Pin className="h-3 w-3 text-aast-gold fill-aast-gold" />}
                  </div>
                  <p className="text-[10px] text-slate-500">{a.date}</p>
                  <p className="mt-1 text-slate-700">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500">{selected.week}</p>
              <h2 className="text-2xl font-black text-aast-navy">{selected.title}</h2>
            </div>
            <a
              href={selected.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-bold bg-aast-navy-soft text-aast-navy rounded-lg border border-aast-navy/20"
            >
              Open Main Material
            </a>
          </div>
          <p className="text-sm text-slate-600">{selected.description}</p>

          <div className="flex flex-wrap gap-2">
            {selected.concepts.map((c) => (
              <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                {c}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-aast-navy">Week Explanation</h3>
          {selected.keyDetails.map((d) => (
            <div key={d.title} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
              <p className="text-sm font-bold text-slate-800 mb-1">{d.title}</p>
              <p className="text-xs text-slate-700 whitespace-pre-line">{d.content}</p>
            </div>
          ))}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-black text-aast-navy">Section Materials</h3>
          <div className="grid gap-2">
            {selected.sectionUrls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs border border-slate-200 bg-slate-50 rounded px-3 py-2 hover:bg-slate-100">
                {url}
              </a>
            ))}
          </div>
        </section>

        {selected.sourceUrls && selected.sourceUrls.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-lg font-black text-aast-navy">Source Citations</h3>
            <div className="grid gap-2">
              {selected.sourceUrls.map((url) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs border border-slate-200 bg-slate-50 rounded px-3 py-2 hover:bg-slate-100">
                  {url}
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-lg font-black text-aast-navy">Solved Problems (Curriculum Coverage)</h3>
          {selected.solvedProblems.map((p) => (
            <div key={p.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-xs space-y-2">
              <p className="font-black text-slate-800">{p.title}</p>
              <p><strong>Statement:</strong> {p.statement}</p>
              <p><strong>Method:</strong> {p.method}</p>
              <div>
                <p className="font-bold">Steps:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  {p.steps.map((s, idx) => <li key={idx}>{s}</li>)}
                </ol>
              </div>
              <p><strong>Final Answer:</strong> {p.finalAnswer}</p>
            </div>
          ))}
          <div className="pt-2">
            <button
              onClick={() => onNavigateToExercise?.(selected.id)}
              className="px-3 py-2 text-xs font-bold rounded-lg bg-aast-gold text-white"
            >
              Practice this week in trace tables
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-black text-aast-navy flex items-center gap-2">
            <FileText className="h-5 w-5 text-aast-gold" />
            Interactive Teaching Demo
          </h3>
          {demoByWeek(selected.id)}
        </section>
      </main>
    </div>
  );
};
