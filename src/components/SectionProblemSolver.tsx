import React, { useState, useCallback, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, BookOpen, Play, Pause } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SolverStep {
  title: string;
  explanation: string;
  formula?: string;
  data?: Record<string, unknown>;
}

interface SectionProblem {
  weekId: string;
  source: string;
  title: string;
  statement: string;
  steps: SolverStep[];
  Visual: React.FC<{ step: number; totalSteps: number }>;
}

// ─── Shared step-solver hook ──────────────────────────────────────────────────
const useSolver = (total: number) => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const next = useCallback(() => setStep(s => Math.min(s + 1, total - 1)), [total]);
  const prev = useCallback(() => setStep(s => Math.max(s - 1, 0)), []);
  const reset = useCallback(() => { setStep(0); setPlaying(false); }, []);
  useEffect(() => {
    if (!playing) return;
    if (step >= total - 1) { setPlaying(false); return; }
    const t = setTimeout(next, 1200);
    return () => clearTimeout(t);
  }, [playing, step, total, next]);
  return { step, next, prev, reset, playing, setPlaying, atEnd: step >= total - 1, atStart: step === 0 };
};

// ─── Shared card wrapper ──────────────────────────────────────────────────────
const SolverCard: React.FC<{
  problem: SectionProblem;
}> = ({ problem }) => {
  const s = useSolver(problem.steps.length);
  const cur = problem.steps[s.step];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-aast-navy to-slate-800 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-3.5 w-3.5 text-aast-gold" />
              <span className="text-[10px] font-black uppercase tracking-widest text-aast-gold">{problem.source}</span>
            </div>
            <h3 className="text-base font-black text-white">{problem.title}</h3>
          </div>
          <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
            Step {s.step + 1}/{problem.steps.length}
          </span>
        </div>
        {/* Problem statement */}
        <div className="mt-3 bg-white/10 rounded-xl p-3 text-xs text-white/90 leading-relaxed border border-white/10">
          <p className="font-bold text-aast-gold text-[10px] uppercase tracking-wider mb-1.5">📋 Problem Statement</p>
          <p className="whitespace-pre-line">{problem.statement}</p>
        </div>
      </div>

      {/* Body: steps + visual */}
      <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Left: step solver */}
        <div className="p-5 space-y-4">
          {/* Step list */}
          <div className="space-y-1.5">
            {problem.steps.map((st, i) => (
              <button
                key={i}
                onClick={() => { s.reset(); setTimeout(() => { for (let k = 0; k < i; k++) s.next(); }, 10); }}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-all text-xs ${
                  i === s.step
                    ? 'border-aast-navy bg-aast-navy text-white shadow-sm'
                    : i < s.step
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shrink-0 ${
                    i < s.step ? 'bg-emerald-500 text-white' :
                    i === s.step ? 'bg-aast-gold text-aast-navy' :
                    'bg-slate-300 text-slate-500'
                  }`}>{i < s.step ? '✓' : i + 1}</span>
                  <span className="font-semibold truncate">{st.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-black text-aast-navy">{cur.title}</p>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{cur.explanation}</p>
            {cur.formula && (
              <div className="bg-aast-navy/5 border border-aast-navy/10 rounded-lg px-3 py-2 font-mono text-xs text-aast-navy font-bold whitespace-pre-line">
                {cur.formula}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button onClick={s.reset} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition" title="Reset">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button onClick={s.prev} disabled={s.atStart} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition disabled:opacity-30">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => s.setPlaying(p => !p)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition ${
                s.playing ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-aast-navy text-white'
              }`}
            >
              {s.playing ? <><Pause className="h-3 w-3" />Pause</> : <><Play className="h-3 w-3" />Auto-Play</>}
            </button>
            <button onClick={s.next} disabled={s.atEnd} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition disabled:opacity-30">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {s.atEnd && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs font-bold text-emerald-700 text-center">
              ✅ Solution Complete! Click Reset to replay.
            </div>
          )}
        </div>

        {/* Right: live visual */}
        <div className="p-5 bg-slate-50 flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Live Visualization</p>
          <div className="flex-1">
            <problem.Visual step={s.step} totalSteps={problem.steps.length} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 2 — LCG Trace: a=1, c=4, T=5, R₀=2
// ══════════════════════════════════════════════════════════════════════════════
const lcgTrace = (() => {
  const a = 1, c = 4, T = 5;
  const seq: number[] = [2];
  for (let i = 1; i <= 9; i++) seq.push((a * seq[i - 1] + c) % T);
  return seq;
})();

const W2Visual: React.FC<{ step: number }> = ({ step }) => {
  const visible = Math.min(step + 1, lcgTrace.length);
  return (
    <div className="space-y-3">
      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs space-y-1">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">LCG Sequence: Rᵢ₊₁ = (1·Rᵢ + 4) mod 5</p>
        {lcgTrace.slice(0, visible).map((val, i) => (
          <div key={i} className={`flex items-center gap-3 ${i === visible - 1 ? 'text-aast-gold' : 'text-emerald-400'}`}>
            <span className="text-slate-500 w-6 text-right">R{i}=</span>
            <span className="font-black text-lg w-4">{val}</span>
            <span className="text-slate-500">→ U{i} = {val}/{5} = {(val/5).toFixed(1)}</span>
            {i === 0 && <span className="text-amber-400 text-[9px]">(seed)</span>}
            {i > 0 && i === visible - 1 && <span className="text-aast-gold text-[9px]">← current</span>}
          </div>
        ))}
      </div>
      {/* Number line */}
      <div className="bg-white rounded-xl border border-slate-200 p-3">
        <p className="text-[10px] font-bold text-slate-500 mb-2">Values on number line (0–4)</p>
        <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
          {lcgTrace.slice(0, visible).map((val, i) => (
            <div key={i} className={`absolute top-0.5 bottom-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-all ${
              i === visible - 1 ? 'bg-aast-gold text-aast-navy' : 'bg-emerald-500 text-white'
            }`} style={{ left: `${(val / 5) * 85}%` }}>
              {val}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 mt-1">
          {[0,1,2,3,4].map(v => <span key={v}>{v}</span>)}
        </div>
      </div>
      {visible >= 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-700 font-bold">
          ⚠️ Sequence repeats at R{visible-1}={lcgTrace[visible-1]}! Period = 5.
        </div>
      )}
    </div>
  );
};

const w2Problem: SectionProblem = {
  weekId: 'w2',
  source: 'Section Week 2 — Simulation week 2 sec.pdf',
  title: 'LCG Random Number Generation',
  statement: `For a = 1, c = 4, T = 5, R₀ = 2 (seed):
Generate 10 random numbers using the Congruential method.
Formula: Rᵢ₊₁ = (a × Rᵢ + c) mod T`,
  steps: [
    { title: 'Set parameters', explanation: 'Given: multiplier a = 1, increment c = 4, modulus T = 5, seed R₀ = 2.\nThe uniform random number Uᵢ = Rᵢ / T.', formula: 'Rᵢ₊₁ = (1 × Rᵢ + 4) mod 5\nU₀ = 2/5 = 0.4' },
    { title: 'Compute R₁', explanation: 'Apply formula with R₀ = 2:', formula: 'R₁ = (1×2 + 4) mod 5 = 6 mod 5 = 1\nU₁ = 1/5 = 0.2' },
    { title: 'Compute R₂', explanation: 'Apply formula with R₁ = 1:', formula: 'R₂ = (1×1 + 4) mod 5 = 5 mod 5 = 0\nU₂ = 0/5 = 0.0' },
    { title: 'Compute R₃', explanation: 'Apply formula with R₂ = 0:', formula: 'R₃ = (1×0 + 4) mod 5 = 4 mod 5 = 4\nU₃ = 4/5 = 0.8' },
    { title: 'Compute R₄', explanation: 'Apply formula with R₃ = 4:', formula: 'R₄ = (1×4 + 4) mod 5 = 8 mod 5 = 3\nU₄ = 3/5 = 0.6' },
    { title: 'Sequence repeats', explanation: 'R₅ = (1×3 + 4) mod 5 = 7 mod 5 = 2 = R₀ !\nThe sequence has period = 5: {2,1,0,4,3,2,1,0,4,3...}', formula: 'Period = T = 5 (maximum possible for this modulus)' },
    { title: 'Generated sequence', explanation: 'Full 10 numbers: 2, 1, 0, 4, 3, 2, 1, 0, 4, 3\nFull-period: ✅ (period = T = 5 means every value 0–4 appears exactly once per cycle)', formula: 'Hull-Dobell theorem satisfied:\n• gcd(c, T) = gcd(4,5) = 1 ✓\n• a−1=0 divisible by all prime factors of T=5 ✓' },
  ],
  Visual: ({ step }) => <W2Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 3 — Grocery Demand Simulation
// ══════════════════════════════════════════════════════════════════════════════
const w3DemandData = [
  { demand: 100, prob: 0.2, from: 0, to: 19 },
  { demand: 110, prob: 0.5, from: 20, to: 69 },
  { demand: 120, prob: 0.3, from: 70, to: 99 },
];
const w3Trials = [
  { rn: 24, demand: 110 }, { rn: 35, demand: 110 }, { rn: 65, demand: 110 },
  { rn: 10, demand: 100 }, { rn: 85, demand: 120 },
];
const theoretical = 100 * 0.2 + 110 * 0.5 + 120 * 0.3;

const W3Visual: React.FC<{ step: number }> = ({ step }) => {
  const visibleDays = Math.min(step, w3Trials.length);
  const sum = w3Trials.slice(0, visibleDays).reduce((s, t) => s + t.demand, 0);
  const avg = visibleDays > 0 ? sum / visibleDays : 0;
  return (
    <div className="space-y-3">
      {/* Mapping table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b">
            <tr>{['Demand','Prob','RN Range','Class'].map(h=><th key={h} className="p-2 text-left font-bold text-slate-600 text-[10px]">{h}</th>)}</tr>
          </thead>
          <tbody>
            {w3DemandData.map((d, i) => (
              <tr key={i} className={step >= 1 ? 'border-t' : 'border-t opacity-30'}>
                <td className="p-2 font-mono font-bold">{d.demand}</td>
                <td className="p-2">{d.prob}</td>
                <td className="p-2 font-mono">{d.from.toString().padStart(2,'0')}–{d.to.toString().padStart(2,'0')}</td>
                <td className="p-2"><div className={`w-3 h-3 rounded-full ${i===0?'bg-sky-400':i===1?'bg-violet-400':'bg-emerald-400'}`}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Simulation trace */}
      {visibleDays > 0 && (
        <div className="space-y-1.5">
          {w3Trials.slice(0, visibleDays).map((t, i) => {
            const cls = w3DemandData.find(d => t.rn >= d.from && t.rn <= d.to)!;
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-500 w-10">Day {i+1}</span>
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">RN={t.rn}</span>
                <span className="text-slate-400">→</span>
                <span className="font-black text-aast-navy">Demand={t.demand}</span>
                <div className={`w-2 h-2 rounded-full ${cls?.demand===100?'bg-sky-400':cls?.demand===110?'bg-violet-400':'bg-emerald-400'}`}/>
              </div>
            );
          })}
        </div>
      )}
      {/* Running average vs theoretical */}
      {visibleDays > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <p className="text-[10px] font-bold text-slate-500 mb-2">Simulated vs Theoretical Demand</p>
          <div className="space-y-2">
            {[{ label:'Simulated Avg', val:avg, col:'bg-sky-500', max:130 },
              { label:'Theoretical', val:theoretical, col:'bg-violet-400', max:130 }].map(b=>(
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 w-24 shrink-0">{b.label}</span>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${b.col} transition-all duration-700`} style={{width:`${(b.val/b.max)*100}%`}}/>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-700 w-12">{b.val.toFixed(1)}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Error: {avg>0?Math.abs(((avg-theoretical)/theoretical)*100).toFixed(1):'-'}%</p>
        </div>
      )}
    </div>
  );
};

const w3Problem: SectionProblem = {
  weekId: 'w3',
  source: 'Section Week 3 — Simulation-Section_3.pdf',
  title: 'Grocery Store Demand Simulation',
  statement: `Get the average daily demand for a small grocery store selling fresh bread.
Distribution: P(100)=0.2, P(110)=0.5, P(120)=0.3
Use RNs: 24, 35, 65, 10, 85 to simulate 5 days.
Compare simulated average with the theoretical expected value.`,
  steps: [
    { title: 'Build probability table', explanation: 'List the demand values and their probabilities.\nTheoretical E(X) = 100×0.2 + 110×0.5 + 120×0.3 = 111 units/day', formula: 'E(X) = Σ xᵢ·P(xᵢ) = 20 + 55 + 36 = 111' },
    { title: 'Assign RN ranges', explanation: 'Map cumulative probabilities to RN ranges 00–99:\n• Demand 100 (P=0.2): RN 00–19\n• Demand 110 (P=0.5): RN 20–69\n• Demand 120 (P=0.3): RN 70–99', formula: 'Range width = probability × 100' },
    { title: 'Day 1: RN=24', explanation: 'RN=24 falls in 20–69 → Demand = 110 units', formula: 'Cumulative sum so far: 110' },
    { title: 'Day 2: RN=35', explanation: 'RN=35 falls in 20–69 → Demand = 110 units', formula: 'Running sum: 220, avg = 110' },
    { title: 'Day 3: RN=65', explanation: 'RN=65 falls in 20–69 → Demand = 110 units', formula: 'Running sum: 330, avg = 110' },
    { title: 'Day 4: RN=10', explanation: 'RN=10 falls in 00–19 → Demand = 100 units', formula: 'Running sum: 430, avg = 107.5' },
    { title: 'Day 5: RN=85', explanation: 'RN=85 falls in 70–99 → Demand = 120 units', formula: 'Running sum: 550, avg = 110' },
    { title: 'Compare results', explanation: 'Simulated average = 550/5 = 110 units/day\nTheoretical = 111 units/day\nError = |110-111|/111 × 100 ≈ 0.9%', formula: 'Error = |(Sim - Theory)/Theory| × 100%' },
  ],
  Visual: ({ step }) => <W3Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 4 — Discrete Mapping: Coin, Die, Traffic Light
// ══════════════════════════════════════════════════════════════════════════════
const w4RNs = [6, 3, 5, 0, 8];
const w4Coin = w4RNs.map(r => r <= 4 ? 'Head' : 'Tail');
const w4Die = w4RNs.map(r => r >= 1 && r <= 6 ? r : 'Reject');
const w4Light = w4RNs.map(r => r <= 3 ? 'Green' : r === 4 ? 'Yellow' : 'Red');

const W4Visual: React.FC<{ step: number }> = ({ step }) => {
  const showCoin = step >= 2;
  const showDie = step >= 3;
  const showLight = step >= 4;
  return (
    <div className="space-y-3">
      <div className="bg-slate-900 rounded-xl p-3 space-y-1">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">RN Stream: 6, 3, 5, 0, 8</p>
        <div className="grid grid-cols-5 gap-1 text-center">
          {w4RNs.map((r, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-2">
              <div className="text-lg font-black text-aast-gold">{r}</div>
              <div className="text-[8px] text-slate-400">RN{i+1}</div>
            </div>
          ))}
        </div>
      </div>

      {showCoin && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3">
          <p className="text-[10px] font-black text-sky-700 mb-2">a) Coin (0–4=Head, 5–9=Tail)</p>
          <div className="flex gap-1 flex-wrap">
            {w4RNs.map((r, i) => (
              <div key={i} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${w4Coin[i]==='Head'?'bg-sky-500 text-white':'bg-slate-300 text-slate-700'}`}>
                {r}→{w4Coin[i][0]}
              </div>
            ))}
          </div>
        </div>
      )}

      {showDie && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
          <p className="text-[10px] font-black text-violet-700 mb-2">b) Die (1–6=face, 0,7,8,9=Reject)</p>
          <div className="flex gap-1 flex-wrap">
            {w4RNs.map((r, i) => (
              <div key={i} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${w4Die[i]==='Reject'?'bg-rose-200 text-rose-700':'bg-violet-500 text-white'}`}>
                {r}→{w4Die[i]}
              </div>
            ))}
          </div>
        </div>
      )}

      {showLight && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3">
          <p className="text-[10px] font-black text-slate-300 mb-2">c) Traffic Light (0–3=Green 40%, 4=Yellow 10%, 5–9=Red 50%)</p>
          <div className="flex gap-2 flex-wrap">
            {w4RNs.map((r, i) => (
              <div key={i} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                w4Light[i]==='Green'?'bg-emerald-500 text-white':
                w4Light[i]==='Yellow'?'bg-yellow-400 text-slate-900':
                'bg-rose-500 text-white'
              }`}>
                {r}→{w4Light[i]}
              </div>
            ))}
          </div>
          {/* Traffic light visual */}
          <div className="flex gap-3 mt-3 justify-center">
            {['Green','Yellow','Red'].map(c => {
              const cnt = w4Light.filter(l => l === c).length;
              return (
                <div key={c} className="text-center">
                  <div className={`w-10 h-10 rounded-full mx-auto ${c==='Green'?'bg-emerald-400':c==='Yellow'?'bg-yellow-400':'bg-rose-500'} ${cnt>0?'shadow-lg':'opacity-20'}`}/>
                  <p className="text-[9px] text-slate-300 mt-1">{cnt}×{c}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const w4Problem: SectionProblem = {
  weekId: 'w4',
  source: 'Section Week 4 — Curriclum.pdf p.9',
  title: 'Discrete Observation Mapping',
  statement: `Use one-digit Random Numbers (6, 3, 5, 0, 8) to generate observations for:
a) Throwing an unbiased coin
b) Throwing a die
c) A traffic light — Green 40%, Yellow 10%, Red 50%`,
  steps: [
    { title: 'Identify digit ranges', explanation: 'Single-digit RNs are 0–9. We assign ranges proportional to probability. Each digit covers 1/10 = 10% probability.', formula: '10 digits × 10% each = 100% coverage' },
    { title: 'Coin mapping rule', explanation: '50% each → split 10 digits in half:\n• 0, 1, 2, 3, 4 → Head (P = 5/10 = 50%)\n• 5, 6, 7, 8, 9 → Tail (P = 5/10 = 50%)', formula: 'RNs (6,3,5,0,8) → (T, H, T, H, T)' },
    { title: 'Apply coin mapping', explanation: 'Stream: 6→Tail, 3→Head, 5→Tail, 0→Head, 8→Tail\nResult: T, H, T, H, T', formula: '2 Heads, 3 Tails' },
    { title: 'Die mapping (with rejection)', explanation: 'Die has 6 equal faces (P=1/6 each).\nAssign: 1→face1, 2→face2, ..., 6→face6\nReject: 0, 7, 8, 9 (outside 1–6)', formula: 'RNs (6,3,5,0,8):\n6→6, 3→3, 5→5, 0→Reject, 8→Reject' },
    { title: 'Traffic light mapping', explanation: 'Green 40%: digits 0,1,2,3\nYellow 10%: digit 4\nRed 50%: digits 5,6,7,8,9', formula: 'RNs (6,3,5,0,8):\n6→Red, 3→Green, 5→Red, 0→Green, 8→Red' },
    { title: 'Summary of results', explanation: 'Coin:    T, H, T, H, T\nDie:     6, 3, 5, Reject, Reject\nLight:   Red, Green, Red, Green, Red\n\nNote: 2 rejects from die are valid — only 3 usable die outcomes.', formula: 'Simulated P(Red) = 3/5 = 60% vs theoretical 50%\nMore trials needed to converge.' },
  ],
  Visual: ({ step }) => <W4Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 5 — Insurance Multi-Stage Decision (20 visits)
// ══════════════════════════════════════════════════════════════════════════════
const w5Visits = [
  {rn1:95,rn2:null,interest:false,outcome:'No Interest',value:0},
  {rn1:27,rn2:16,interest:true,outcome:'No Sale',value:0},
  {rn1:11,rn2:73,interest:true,outcome:'Small (10k)',value:10000},
  {rn1:82,rn2:null,interest:false,outcome:'No Interest',value:0},
  {rn1:47,rn2:92,interest:true,outcome:'Large (20k)',value:20000},
];

const W5Visual: React.FC<{ step: number }> = ({ step }) => {
  const visible = Math.max(0, step - 2);
  const sales = w5Visits.slice(0, visible).filter(v => v.value > 0).length;
  const total = w5Visits.slice(0, visible).length;
  return (
    <div className="space-y-3">
      {/* Decision Tree */}
      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-3">Decision Tree</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-16 h-7 bg-slate-700 rounded flex items-center justify-center text-[9px] font-bold text-white">Visit</div>
            <div className="w-px h-6 bg-slate-600"/>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2 rounded-lg border text-center ${step>=1?'border-sky-400 bg-sky-900/30':'border-slate-700 opacity-30'}`}>
              <p className="text-[9px] text-sky-400 font-bold">Interested (50%)</p>
              <p className="text-[9px] text-slate-400">RN 00–49</p>
              <div className="mt-1 grid grid-cols-3 gap-1">
                {['No Sale\n00-49','10k Policy\n50-82','20k Policy\n83-99'].map((o,i)=>(
                  <div key={i} className={`p-1 rounded text-center text-[8px] font-bold ${step>=2?'bg-slate-700 text-slate-200':'opacity-30 bg-slate-800'}`}>
                    {o.split('\n')[0]}<br/><span className="text-slate-400">{o.split('\n')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`p-2 rounded-lg border text-center ${step>=1?'border-rose-400 bg-rose-900/30':'border-slate-700 opacity-30'}`}>
              <p className="text-[9px] text-rose-400 font-bold">Not Interested (50%)</p>
              <p className="text-[9px] text-slate-400">RN 50–99</p>
              <div className="mt-2 p-2 bg-slate-700 rounded text-[8px] text-rose-300">No Sale</div>
            </div>
          </div>
        </div>
      </div>
      {/* Sample visits */}
      {visible > 0 && (
        <div className="space-y-1">
          {w5Visits.slice(0, visible).map((v, i) => (
            <div key={i} className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded-lg ${v.value>0?'bg-emerald-50 border border-emerald-200':'bg-slate-50 border border-slate-200'}`}>
              <span className="font-bold text-slate-500 w-10">Visit {i+1}</span>
              <span className="font-mono bg-white border border-slate-200 px-1 rounded">{v.rn1}</span>
              {v.rn2 && <><span className="text-slate-400">→</span><span className="font-mono bg-white border border-slate-200 px-1 rounded">{v.rn2}</span></>}
              <span className="text-slate-400">→</span>
              <span className={`font-black ${v.value>0?'text-emerald-700':'text-slate-500'}`}>{v.outcome}</span>
              {v.value>0 && <span className="ml-auto font-black text-emerald-700">+{(v.value/1000).toFixed(0)}k LE</span>}
            </div>
          ))}
        </div>
      )}
      {/* Summary metrics */}
      {visible >= 3 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[9px] text-emerald-600">P(Sale)</p>
            <p className="font-black text-emerald-800">{total>0?((sales/total)*100).toFixed(0):0}%</p>
            <p className="text-[9px] text-emerald-500">Theoretical: 25%</p>
          </div>
          <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-center">
            <p className="text-[9px] text-sky-600">Theoretical E(Policy)</p>
            <p className="font-black text-sky-800">13,333 LE</p>
          </div>
        </div>
      )}
    </div>
  );
};

const w5Problem: SectionProblem = {
  weekId: 'w5',
  source: 'Section Week 5 — Curriclum.pdf p.11',
  title: 'Sales of Life Insurance Simulation',
  statement: `Each house call: 50% not interested (RN 50–99), 50% willing to discuss (RN 00–49).
After discussion: 50% No Sale (RN 00–49), 1/3 → 10,000 LE policy (RN 50–82), 1/6 → 20,000 LE policy (RN 83–99).
Simulate 5 visits. Find: P(sale) and expected policy value.`,
  steps: [
    { title: 'Theoretical analysis', explanation: 'P(No Interest) = 0.5\nP(Interested, No Sale) = 0.5 × 0.5 = 0.25\nP(10k policy) = 0.5 × 1/3 ≈ 0.167\nP(20k policy) = 0.5 × 1/6 ≈ 0.083\nP(sale) = 0.25', formula: 'E(Policy|sale) = 10000×(2/3) + 20000×(1/3) = 13,333 LE' },
    { title: 'Set up RN mapping', explanation: 'Stage 1 — Interest check:\n• RN 00–49: Interested (50%)\n• RN 50–99: Not Interested (50%)\n\nStage 2 — Policy type:\n• RN 00–49: No Sale (50%)\n• RN 50–82: 10,000 LE policy (33%)\n• RN 83–99: 20,000 LE policy (17%)', formula: 'Two-stage random number mapping' },
    { title: 'Visit 1: RN₁=95', explanation: 'RN₁=95 → 95 ≥ 50 → NOT Interested → No Sale\n(No need for second RN)', formula: 'Outcome: No Sale, Value: 0' },
    { title: 'Visit 2: RN₁=27, RN₂=16', explanation: 'RN₁=27 → 27 < 50 → INTERESTED\nRN₂=16 → 16 < 50 → No Sale', formula: 'Outcome: No Sale, Value: 0' },
    { title: 'Visit 3: RN₁=11, RN₂=73', explanation: 'RN₁=11 → INTERESTED\nRN₂=73 → 50≤73≤82 → Small Policy (10,000 LE)', formula: 'Outcome: 10,000 LE policy ✅' },
    { title: 'Visits 4 & 5', explanation: 'Visit 4: RN₁=82 → NOT Interested → No Sale\nVisit 5: RN₁=47 → Interested, RN₂=92 → ≥83 → Large Policy (20,000 LE)', formula: 'Visits 4→0, Visit 5→20,000 LE ✅' },
    { title: 'Compare sim vs theoretical', explanation: 'Simulated: 2 sales in 5 visits → P(sale) = 40%\nTheoretical: P(sale) = 25%\n\nExpected value of sales: (10000+20000)/2 = 15,000 LE\nTheoretical: 13,333 LE\n\nMore trials reduce this gap.', formula: 'Error reduces as N → ∞ (Law of Large Numbers)' },
  ],
  Visual: ({ step }) => <W5Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 11 — Bob & Ray Assembly Line Blocking Trace
// ══════════════════════════════════════════════════════════════════════════════
const buildBobRayTrace = (s1: number, s2: number, n: number) => {
  const rows: { item: number; b1s: number; b1e: number; blocked: number; b2s: number; b2e: number }[] = [];
  let b1Free = 0, b2Free = 0;
  for (let i = 1; i <= n; i++) {
    const b1s = b1Free;
    const b1e = b1s + s1;
    const b2s = Math.max(b1e, b2Free);
    const b2e = b2s + s2;
    const blocked = Math.max(0, b2Free - b1e);
    rows.push({ item: i, b1s, b1e, blocked, b2s, b2e });
    b1Free = b2s; b2Free = b2e;
  }
  return rows;
};

const W11Visual: React.FC<{ step: number }> = ({ step }) => {
  const trace = buildBobRayTrace(3, 5, 5);
  const visible = Math.min(step, trace.length);
  const maxT = trace[trace.length - 1]?.b2e || 1;
  return (
    <div className="space-y-3">
      <div className="bg-slate-900 rounded-xl p-3">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-3">Gantt Chart — Bob (S1=3min) & Ray (S2=5min)</p>
        <div className="space-y-2">
          {trace.slice(0, visible).map(r => (
            <div key={r.item} className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 font-mono w-5 shrink-0">I{r.item}</span>
              <div className="relative flex-1 h-5 bg-slate-800 rounded">
                {/* Bob bar */}
                <div className="absolute top-0.5 bottom-0.5 rounded bg-sky-500"
                  style={{ left: `${(r.b1s/maxT)*100}%`, width: `${(3/maxT)*100}%` }}>
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white">BOB</span>
                </div>
                {/* Blocked time */}
                {r.blocked > 0 && (
                  <div className="absolute top-0.5 bottom-0.5 rounded bg-rose-500/70"
                    style={{ left: `${(r.b1e/maxT)*100}%`, width: `${(r.blocked/maxT)*100}%` }}>
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white">BLK</span>
                  </div>
                )}
                {/* Ray bar */}
                <div className="absolute top-0.5 bottom-0.5 rounded bg-violet-500"
                  style={{ left: `${(r.b2s/maxT)*100}%`, width: `${(5/maxT)*100}%` }}>
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white">RAY</span>
                </div>
              </div>
              <span className="text-[8px] text-slate-400 font-mono w-4">{r.b2e}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-2">
          {[{c:'bg-sky-500',l:'Bob (S1)'},{c:'bg-violet-500',l:'Ray (S2)'},{c:'bg-rose-500/70',l:'Blocked'}].map(lx=>(
            <div key={lx.l} className="flex items-center gap-1"><div className={`w-2 h-2 rounded ${lx.c}`}/><span className="text-[8px] text-slate-400">{lx.l}</span></div>
          ))}
        </div>
      </div>
      {visible > 0 && (
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
            <p className="text-[9px] text-rose-600">Total Blocked</p>
            <p className="font-black text-rose-800">{trace.slice(0,visible).reduce((s,r)=>s+r.blocked,0)} min</p>
          </div>
          <div className="p-2 rounded-lg bg-violet-50 border border-violet-200">
            <p className="text-[9px] text-violet-600">Throughput Bound</p>
            <p className="font-black text-violet-800">{(60/5).toFixed(0)} items/hr</p>
            <p className="text-[8px] text-violet-400">(limited by Ray)</p>
          </div>
        </div>
      )}
    </div>
  );
};

const w11Problem: SectionProblem = {
  weekId: 'w11',
  source: 'Section Week 11 — Assembly Lines-(Bob and Ray) full solution.pdf',
  title: 'Two-Stage Assembly Line Simulation',
  statement: `Bob (Station 1) takes 3 min/item. Ray (Station 2) takes 5 min/item.
There is NO buffer between them — Bob must WAIT (blocked) if Ray is busy.
Simulate 5 items. Build the full trace table.
Find: bottleneck, total blocking time, throughput bound.`,
  steps: [
    { title: 'Identify bottleneck', explanation: 'Bob rate = 60/3 = 20 items/hour\nRay rate = 60/5 = 12 items/hour\nBottleneck = RAY (slower station)\nLine throughput ≤ 12 items/hour', formula: 'Throughput = min(rate₁, rate₂) = 12 items/hr' },
    { title: 'Item 1 (no blocking)', explanation: 'Bob starts at t=0, finishes at t=3.\nRay starts at t=3, finishes at t=8.\nBob is FREE at t=3, blocked until Ray finishes at t=8.', formula: 'Item1: Bob[0→3], Blocked[3→8], Ray[3→8]' },
    { title: 'Item 2 trace', explanation: 'Bob can start only when Ray releases item 1 at t=8.\nBob[8→11], Ray[11→16]. No blocking.', formula: 'Item2: Bob[8→11], Ray[11→16]' },
    { title: 'Item 3 trace', explanation: 'Bob can start at t=11 (when Ray takes item 2 at t=11).\nBob[11→14], Ray[16→21]. Blocked[14→16] = 2 min.', formula: 'Item3: Bob[11→14], Blocked[14→16], Ray[16→21]' },
    { title: 'Items 4 & 5', explanation: 'Continue the trace. Bob is always blocked when Ray is still busy.\nEach cycle: Bob finishes in 3 min, waits ~2 min for Ray.', formula: 'Average blocking ≈ S₂ - S₁ = 5 - 3 = 2 min/item' },
    { title: 'Summary', explanation: 'Total makespan for 5 items = 40 min\nBob total blocking = 10 min (25% of time)\nRay utilization ≈ 25/40 = 62.5%\nThroughput: 5 items / 40 min = 7.5 items/hr', formula: 'Utilization_Bob = 15/40 = 37.5%\nUtilization_Ray = 25/40 = 62.5%' },
  ],
  Visual: ({ step }) => <W11Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 12 — 10-minute Station Trace (Periodic vs Event Scan)
// ══════════════════════════════════════════════════════════════════════════════
const w12Events = [
  { t: 1.8, type: 'A', label: 'Arrival C1' },
  { t: 2.6, type: 'C', label: 'Completion C1' },
  { t: 3.2, type: 'A', label: 'Arrival C2' },
  { t: 4.8, type: 'C', label: 'Completion C2' },
  { t: 6.1, type: 'A', label: 'Arrival C3' },
  { t: 7.3, type: 'C', label: 'Completion C3' },
  { t: 7.4, type: 'A', label: 'Arrival C4' },
  { t: 8.1, type: 'C', label: 'Completion C4' },
];

const W12Visual: React.FC<{ step: number }> = ({ step }) => {
  const showEventScan = step >= 2;
  const showPeriodicScan = step >= 4;
  const eventVisible = Math.max(0, step - 1);
  const maxT = 10;
  return (
    <div className="space-y-3">
      {/* Timeline */}
      <div className="bg-slate-900 rounded-xl p-3">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">10-Minute Station Timeline</p>
        <div className="relative h-8 bg-slate-800 rounded-lg overflow-hidden mx-1">
          {/* Time axis */}
          {[0,2,4,6,8,10].map(t => (
            <div key={t} className="absolute top-0 bottom-0 w-px bg-slate-700" style={{left:`${(t/maxT)*100}%`}}>
              <span className="absolute top-0.5 -translate-x-1/2 text-[7px] text-slate-500">{t}</span>
            </div>
          ))}
          {/* Events */}
          {w12Events.slice(0, showEventScan ? Math.min(eventVisible + 1, 8) : 0).map((e, i) => (
            <div key={i} className={`absolute top-2 w-1 h-4 rounded-sm ${e.type==='A'?'bg-sky-400':'bg-rose-400'}`}
              style={{left:`${(e.t/maxT)*100}%`}}
              title={e.label}>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-1.5">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-sky-400"/><span className="text-[8px] text-slate-400">Arrival</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-rose-400"/><span className="text-[8px] text-slate-400">Completion</span></div>
        </div>
      </div>

      {/* Event scan table */}
      {showEventScan && (
        <div className="rounded-xl border border-sky-200 overflow-hidden">
          <div className="bg-sky-50 px-3 py-1.5 border-b border-sky-200">
            <p className="text-[10px] font-black text-sky-700">Event Scan — Clock jumps to exact event time</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead className="bg-sky-50/50"><tr>{['Clock','Event','System State'].map(h=><th key={h} className="p-1.5 text-left font-bold text-sky-600">{h}</th>)}</tr></thead>
              <tbody>
                {w12Events.slice(0, Math.min(eventVisible + 1, 8)).map((e, i) => (
                  <tr key={i} className={`border-t ${i===eventVisible?'bg-sky-50':'hover:bg-slate-50'}`}>
                    <td className="p-1.5 font-mono font-bold">{e.t}</td>
                    <td className="p-1.5 font-bold">{e.type==='A'?'Arrival':'Completion'}</td>
                    <td className="p-1.5">{e.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Periodic scan */}
      {showPeriodicScan && (
        <div className="rounded-xl border border-orange-200 overflow-hidden">
          <div className="bg-orange-50 px-3 py-1.5 border-b border-orange-200">
            <p className="text-[10px] font-black text-orange-700">Periodic Scan (Δt=1 min) — Loses exact timing!</p>
          </div>
          <div className="px-3 py-2 text-[10px] text-orange-700 space-y-0.5">
            {[0,1,2,3,4,5,6,7,8,9,10].map(t => {
              const arrivals = w12Events.filter(e => e.t > t-1 && e.t <= t && e.type==='A');
              const completions = w12Events.filter(e => e.t > t-1 && e.t <= t && e.type==='C');
              if (!arrivals.length && !completions.length) return <p key={t} className="text-slate-400">t={t}: No events</p>;
              return (
                <p key={t} className="font-bold">
                  t={t}: {[...arrivals.map(e=>e.label),...completions.map(e=>e.label)].join(', ')}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const w12Problem: SectionProblem = {
  weekId: 'w12',
  source: 'Section Week 12 — Curriclum.pdf p.11-12',
  title: '10-Minute Station: Periodic vs Event Scan',
  statement: `Single-bay service station for 10 minutes. System empty at start and end.
4 customers: Arrivals at t=1.8, 3.2, 6.1, 7.4
Completions at t=2.6, 4.8, 7.3, 8.1

Compare: Periodic Scan (Δt=1 min) vs Event Scan
Show state of system at each transition.`,
  steps: [
    { title: 'List all events chronologically', explanation: 'Eight events total in time order:\n1. Arrival t=1.8\n2. Completion t=2.6\n3. Arrival t=3.2\n4. Completion t=4.8\n5. Arrival t=6.1\n6. Completion t=7.3\n7. Arrival t=7.4\n8. Completion t=8.1', formula: 'FEL = {1.8, 2.6, 3.2, 4.8, 6.1, 7.3, 7.4, 8.1}' },
    { title: 'Event Scan: clock jumps', explanation: 'Clock advances directly to each event time.\nNo time is wasted between events.\nExact timing is preserved.', formula: 'Δt varies: 0→1.8→2.6→3.2→4.8→6.1→7.3→7.4→8.1' },
    { title: 'Event Scan trace (first 3 events)', explanation: 't=1.8: C1 arrives, server idle → service starts\nt=2.6: C1 completes, server idle\nt=3.2: C2 arrives, server idle → service starts', formula: 'No waiting for C1 or C2' },
    { title: 'Periodic Scan: clock ticks 1 by 1', explanation: 'Clock advances in fixed steps of Δt=1 min.\nEvents between ticks are batched together.\n\nProblem: At Δt=7 to Δt=8:\nCompletion C3 (t=7.3) and Arrival C4 (t=7.4) both processed at t=8 simultaneously — order is LOST!', formula: 'Both treated as if they occurred at t=8.0' },
    { title: 'Critical error in Periodic Scan', explanation: 'In event scan: C3 finishes at t=7.3, then C4 arrives at t=7.4 to an idle server.\nIn periodic scan: both appear at t=8 — C4 might wrongly be treated as arriving to a busy server!', formula: 'Event scan preserves C3→C4 order\nPeriodic scan loses it → incorrect state' },
    { title: 'Conclusion', explanation: 'Event Scan is PREFERRED:\n✅ Exact timing\n✅ No information loss\n✅ Correct event ordering\n\nPeriodic Scan trade-off:\n⚠️ Simpler to implement\n⚠️ Approximate timing\n⚠️ May create phantom simultaneity', formula: 'Use Event Scan for accuracy\nUse Periodic Scan only if exact timing is not critical' },
  ],
  Visual: ({ step }) => <W12Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 13 — M/M/1 Time Scan (λ=20/h, μ=25/h, Δt=1 min)
// ══════════════════════════════════════════════════════════════════════════════
const w13λ = 20/60; // per minute
const w13μ = 25/60;
const pArrival = parseFloat((1 - Math.exp(-w13λ)).toFixed(4));
const pDepart  = parseFloat((1 - Math.exp(-w13μ)).toFixed(4));

const W13Visual: React.FC<{ step: number }> = ({ step }) => {
  return (
    <div className="space-y-3">
      {/* System parameters */}
      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-3">M/M/1 System Parameters</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Arrival Rate λ', val: '20/hr = 1/3 per min', col: 'text-sky-400' },
            { label: 'Service Rate μ', val: '25/hr = 5/12 per min', col: 'text-violet-400' },
            { label: 'Traffic Intensity ρ', val: '20/25 = 0.8', col: 'text-amber-400' },
            { label: 'Time Step Δt', val: '1 minute', col: 'text-emerald-400' },
          ].map((p, i) => (
            <div key={i} className={`space-y-0.5 ${step < Math.floor(i/2)+1 ? 'opacity-30' : ''}`}>
              <p className="text-[9px] text-slate-500">{p.label}</p>
              <p className={`text-xs font-black ${p.col}`}>{p.val}</p>
            </div>
          ))}
        </div>
      </div>

      {step >= 2 && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 space-y-2">
          <p className="text-[10px] font-black text-sky-700">Time Scan Probabilities (per Δt=1 min)</p>
          <div className="space-y-2">
            {[
              { label: 'P(Arrival in 1 min)', formula: '1 − e^(−λ·1) = 1 − e^(−1/3)', val: pArrival, col: 'bg-sky-500' },
              { label: 'P(Departure in 1 min)', formula: '1 − e^(−μ·1) = 1 − e^(−5/12)', val: pDepart, col: 'bg-violet-500' },
            ].map(p => (
              <div key={p.label}>
                <div className="flex justify-between text-[9px] text-slate-600 mb-0.5">
                  <span className="font-bold">{p.label}</span>
                  <span className="font-mono text-aast-navy font-black">{p.val}</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${p.col} transition-all duration-700`} style={{ width: `${p.val * 100}%` }}/>
                </div>
                <p className="text-[8px] text-slate-400 mt-0.5 font-mono">{p.formula}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step >= 4 && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 space-y-2">
          <p className="text-[10px] font-black text-violet-700">Event Scan — Generate inter-event times</p>
          <div className="space-y-1 text-[10px]">
            <div className="bg-white border border-violet-100 rounded p-2">
              <p className="font-bold text-violet-600">Time to next arrival:</p>
              <p className="font-mono text-slate-700">t_arr = −(1/λ)·ln(1−R) = −3·ln(1−R)</p>
            </div>
            <div className="bg-white border border-violet-100 rounded p-2">
              <p className="font-bold text-violet-600">Time to next departure:</p>
              <p className="font-mono text-slate-700">t_dep = −(1/μ)·ln(1−R) = −2.4·ln(1−R)</p>
            </div>
            <p className="text-slate-500">Schedule both. The smaller time fires next → advance FEL.</p>
          </div>
        </div>
      )}

      {step >= 5 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <p className="text-[10px] font-black text-emerald-700 mb-2">M/M/1 Steady-State Metrics (ρ=0.8)</p>
          <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
            {[['L (in system)', '4 customers'],['Lq (in queue)','3.2 customers'],['W (time in sys)','12 min'],['Wq (wait time)','9.6 min']].map(([k,v])=>(
              <div key={k} className="bg-white border border-emerald-100 rounded p-1.5">
                <p className="text-emerald-600 font-bold">{k}</p>
                <p className="font-black text-emerald-800">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const w13Problem: SectionProblem = {
  weekId: 'w13',
  source: 'Section Week 13 — Curriclum.pdf p.12 + week 13 simulation.pdf',
  title: 'M/M/1 Queue: Time Scan vs Event Scan (λ=20/h, μ=25/h)',
  statement: `Simulate M/M/1 system: arrival rate λ=20/hour, service rate μ=25/hour.
System is EMPTY at time zero.

1. Using Time Scan (Δt = 1 minute):
   Compute P(arrival in Δt) and P(departure in Δt).
2. Using Event Scan:
   Generate inter-arrival and inter-service times using inverse transform.
Compare both approaches.`,
  steps: [
    { title: 'Convert rates to per-minute', explanation: 'λ = 20/hour = 20/60 = 1/3 customer/min\nμ = 25/hour = 25/60 = 5/12 customer/min\nρ = λ/μ = 20/25 = 0.8 (< 1 → stable system)', formula: 'ρ = λ/μ must be < 1 for stability' },
    { title: 'Time Scan: P(arrival) in Δt=1 min', explanation: 'Exponential inter-arrival times → P(at least one arrival in Δt):\nP(arrival) = 1 − e^(−λ·Δt) = 1 − e^(−1/3·1)', formula: `P(arrival) = 1 − e^(−1/3) ≈ ${pArrival}\nRN range: 0.00 → ${pArrival} → Arrival` },
    { title: 'Time Scan: P(departure) in Δt=1 min', explanation: 'P(departure) = 1 − e^(−μ·Δt) = 1 − e^(−5/12·1)', formula: `P(departure) = 1 − e^(−5/12) ≈ ${pDepart}\nRN range: 0.00 → ${pDepart} → Departure` },
    { title: 'Time Scan simulation rule', explanation: `Each minute, check two independent RNs:
RN₁ < ${pArrival} → Arrival occurs
RN₂ < ${pDepart} AND server busy → Departure occurs
Both can happen in same minute!`, formula: 'Repeat for each minute until simulation horizon' },
    { title: 'Event Scan: generate times', explanation: 'Use Exponential inverse transform:\nInter-arrival time: t_arr = −(1/λ)·ln(1−R) = −3·ln(1−R)\nInter-service time: t_dep = −(1/μ)·ln(1−R) = −(12/5)·ln(1−R)', formula: 'Example: R=0.5 → t_arr = −3·ln(0.5) ≈ 2.08 min' },
    { title: 'Event Scan: FEL scheduling', explanation: 'Schedule next arrival and (if server busy) next departure.\nAdvance clock to whichever is sooner.\nProcess that event → update system state → repeat.', formula: 'Clock = min(t_next_arrival, t_next_departure)' },
    { title: 'Steady-state M/M/1 formulas', explanation: 'Using analytical M/M/1 results with ρ=0.8:\nL = ρ/(1−ρ) = 4 customers in system\nLq = ρ²/(1−ρ) = 3.2 in queue\nW = 1/(μ−λ) = 12 min in system\nWq = λ/(μ(μ−λ)) = 9.6 min waiting\n\nSimulation should converge to these values.', formula: 'Simulation validates: L→4, Lq→3.2, W→12min' },
  ],
  Visual: ({ step }) => <W13Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 1 — Mid-Square Method (seed 2041)
// ══════════════════════════════════════════════════════════════════════════════
const midSquareSeq = (() => {
  const seq: { r: number; sq: string; next: number }[] = [];
  let r = 2041;
  for (let i = 0; i < 6; i++) {
    const sq = r * r;
    const padded = sq.toString().padStart(8, '0');
    const next = parseInt(padded.slice(2, 6));
    seq.push({ r, sq: padded, next });
    r = next;
  }
  return seq;
})();

const W1Visual: React.FC<{ step: number }> = ({ step }) => {
  const visible = Math.min(step + 1, midSquareSeq.length);
  return (
    <div className="space-y-3">
      <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs space-y-2">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Mid-Square: seed = 2041</p>
        {midSquareSeq.slice(0, visible).map((row, i) => (
          <div key={i} className={`space-y-0.5 ${i === visible - 1 ? 'text-aast-gold' : 'text-emerald-400'}`}>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 w-6 text-right">R{i}=</span>
              <span className="font-black text-base w-12">{row.r}</span>
              <span className="text-slate-500 text-[9px]">→ R²= {row.sq}</span>
              {i === visible - 1 && <span className="text-aast-gold text-[9px]">← current</span>}
            </div>
            <div className="ml-8 text-[9px] flex gap-2">
              <span className="text-slate-600">{row.sq.slice(0,2)}</span>
              <span className={`font-black ${i === visible - 1 ? 'text-aast-gold' : 'text-emerald-300'}`}>[{row.sq.slice(2,6)}]</span>
              <span className="text-slate-600">{row.sq.slice(6,8)}</span>
              <span className="text-slate-500">→ R{i+1}={row.next}</span>
            </div>
          </div>
        ))}
      </div>
      {visible > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3">
          <p className="text-[10px] font-bold text-slate-500 mb-2">Uniform RNs (Uᵢ = Rᵢ / 10000)</p>
          <div className="space-y-1">
            {midSquareSeq.slice(0, visible).map((row, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-500 font-mono w-8">U{i}=</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${i === visible-1 ? 'bg-aast-gold' : 'bg-emerald-400'} transition-all duration-500`}
                    style={{ width: `${(row.r / 9999) * 100}%` }} />
                </div>
                <span className="font-mono font-bold text-slate-700 w-12">{(row.r / 10000).toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const w1Problem: SectionProblem = {
  weekId: 'w1',
  source: 'Section Week 1 — Curriclum.pdf p.3-4',
  title: 'Mid-Square Random Number Generation',
  statement: `Using the Mid-Square method with seed R₀ = 2041:
1. Square the seed to get an 8-digit number (pad with leading zeros).
2. Extract the MIDDLE 4 digits as the next random number.
3. Repeat to generate 5 more values.
Compute Uᵢ = Rᵢ / 10000 for each.`,
  steps: [
    { title: 'Set seed', explanation: 'Seed R₀ = 2041. The Mid-Square method squares the current value, pads to 8 digits, then extracts the middle 4 digits as the next number.', formula: 'Rᵢ₊₁ = middle_4_digits(Rᵢ²)' },
    { title: 'Compute R₁', explanation: '2041² = 4,165,681 → pad to 8 digits: 04165681\nMiddle 4 digits (positions 3–6): [1656]\nR₁ = 1656, U₁ = 0.1656', formula: '04[1656]81 → R₁ = 1656' },
    { title: 'Compute R₂', explanation: '1656² = 2,742,336 → pad to 8 digits: 02742336\nMiddle 4 digits: [7423]\nR₂ = 7423, U₂ = 0.7423', formula: '02[7423]36 → R₂ = 7423' },
    { title: 'Compute R₃', explanation: '7423² = 55,100,929 → 8 digits: 55100929\nMiddle 4 digits: [1009]\nR₃ = 1009, U₃ = 0.1009', formula: '55[1009]29 → R₃ = 1009' },
    { title: 'Compute R₄', explanation: '1009² = 1,018,081 → pad to 8: 01018081\nMiddle 4 digits: [0180]\nR₄ = 180, U₄ = 0.0180', formula: '01[0180]81 → R₄ = 0180' },
    { title: 'Compute R₅ & evaluate', explanation: '0180² = 32,400 → pad to 8: 00032400\nMiddle 4 digits: [0324]\nR₅ = 324, U₅ = 0.0324\n\nNote: the sequence is drifting toward zero — a known weakness of Mid-Square!', formula: '00[0324]00 → R₅ = 0324' },
  ],
  Visual: ({ step }) => <W1Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 6 — Variance Reduction: Antithetic Variates
// ══════════════════════════════════════════════════════════════════════════════
const w6RNs = [0.41, 0.23, 0.87, 0.65, 0.12];
const w6Direct  = w6RNs.map(r => parseFloat((2 + 6 * r).toFixed(3)));
const w6Compl   = w6RNs.map(r => parseFloat((2 + 6 * (1 - r)).toFixed(3)));
const w6Paired  = w6Direct.map((d, i) => parseFloat(((d + w6Compl[i]) / 2).toFixed(3)));
const w6DirectAvg  = parseFloat((w6Direct.reduce((s,v)=>s+v,0)/5).toFixed(3));
const w6ComplAvg   = parseFloat((w6Compl.reduce((s,v)=>s+v,0)/5).toFixed(3));
const w6PairedAvg  = parseFloat((w6Paired.reduce((s,v)=>s+v,0)/5).toFixed(3));

const W6Visual: React.FC<{ step: number }> = ({ step }) => {
  const showCompl = step >= 3;
  const showPaired = step >= 5;
  return (
    <div className="space-y-3">
      {/* RN stream */}
      <div className="bg-slate-900 rounded-xl p-3">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">X = 2 + 6·R, where R ~ U(0,1)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-center">
            <thead><tr className="text-slate-400">
              <th className="p-1">RN</th>
              <th className="p-1 text-sky-400">X = 2+6R</th>
              {showCompl && <th className="p-1 text-violet-400">R' = 1−R</th>}
              {showCompl && <th className="p-1 text-violet-400">X' = 2+6R'</th>}
              {showPaired && <th className="p-1 text-emerald-400">Avg(X,X')</th>}
            </tr></thead>
            <tbody>
              {w6RNs.map((r, i) => (
                <tr key={i} className="border-t border-slate-700">
                  <td className="p-1 font-mono text-slate-300">{r}</td>
                  <td className="p-1 font-black text-sky-300">{w6Direct[i]}</td>
                  {showCompl && <td className="p-1 font-mono text-violet-300">{(1-r).toFixed(2)}</td>}
                  {showCompl && <td className="p-1 font-black text-violet-300">{w6Compl[i]}</td>}
                  {showPaired && <td className="p-1 font-black text-emerald-300">{w6Paired[i]}</td>}
                </tr>
              ))}
              <tr className="border-t-2 border-slate-600 font-black">
                <td className="p-1 text-slate-400">Avg</td>
                <td className="p-1 text-sky-200">{w6DirectAvg}</td>
                {showCompl && <td />}
                {showCompl && <td className="p-1 text-violet-200">{w6ComplAvg}</td>}
                {showPaired && <td className="p-1 text-emerald-200">{w6PairedAvg}</td>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {showPaired && (
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          {[
            { label: 'Direct Avg', val: w6DirectAvg, target: 5, col: 'bg-sky-50 border-sky-200 text-sky-700' },
            { label: 'Complement Avg', val: w6ComplAvg, target: 5, col: 'bg-violet-50 border-violet-200 text-violet-700' },
            { label: 'Paired Avg', val: w6PairedAvg, target: 5, col: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          ].map(b => (
            <div key={b.label} className={`p-2 rounded-xl border ${b.col}`}>
              <p className="font-bold">{b.label}</p>
              <p className="text-lg font-black">{b.val}</p>
              <p className="text-[9px] opacity-70">err={Math.abs(b.val-b.target).toFixed(3)}</p>
            </div>
          ))}
        </div>
      )}
      {showPaired && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[10px] text-emerald-700">
          <p className="font-black mb-1">✅ Antithetic Variates Result</p>
          <p>True mean of U(2,8) = (2+8)/2 = <strong>5.000</strong></p>
          <p>Paired average = <strong>{w6PairedAvg}</strong> — always exact for symmetric distributions!</p>
          <p className="mt-1">Variance(paired) ≪ Variance(direct)</p>
        </div>
      )}
    </div>
  );
};

const w6Problem: SectionProblem = {
  weekId: 'w6',
  source: 'Section Week 6 — Curriclum.pdf (Variance Reduction)',
  title: 'Antithetic Variates: Variance Reduction',
  statement: `Estimate E[X] where X ~ Uniform(2, 8).
True mean = (2+8)/2 = 5.

Use 5 random numbers: R = {0.41, 0.23, 0.87, 0.65, 0.12}
Method 1 (Direct): X = 2 + 6·R
Method 2 (Antithetic): also use complements R' = 1 − R, then average each pair.
Compare the two estimates with the true mean.`,
  steps: [
    { title: 'Direct sampling setup', explanation: 'We sample X = a + (b−a)·R = 2 + 6·R for each RN.\nTrue mean = (a+b)/2 = 5.\nWith only 5 samples the direct estimate may be far from 5.', formula: 'X = 2 + 6·R' },
    { title: 'Direct sample: R=0.41', explanation: 'X₁ = 2 + 6×0.41 = 2 + 2.46 = 4.46', formula: 'X₁ = 4.460' },
    { title: 'Direct samples: R=0.23, 0.87, 0.65, 0.12', explanation: 'X₂ = 2+6×0.23 = 3.38\nX₃ = 2+6×0.87 = 7.22\nX₄ = 2+6×0.65 = 5.90\nX₅ = 2+6×0.12 = 2.72\n\nDirect average = (4.46+3.38+7.22+5.90+2.72)/5 = 4.736', formula: 'Direct avg = 4.736, error = |4.736−5| = 0.264' },
    { title: 'Antithetic: complement RNs', explanation: 'For each R, form R\' = 1 − R:\n0.41→0.59, 0.23→0.77, 0.87→0.13, 0.65→0.35, 0.12→0.88\nThen X\' = 2 + 6·R\'', formula: 'R\' = 1 − R  →  antithetic samples' },
    { title: 'Complement averages', explanation: 'X\'₁ = 2+6×0.59 = 5.54\nX\'₂ = 2+6×0.77 = 6.62\nX\'₃ = 2+6×0.13 = 2.78\nX\'₄ = 2+6×0.35 = 4.10\nX\'₅ = 2+6×0.88 = 7.28\n\nComplement average = 5.264', formula: 'Complement avg = 5.264, error = 0.264' },
    { title: 'Pair and average', explanation: 'Average each direct-complement pair:\n(4.46+5.54)/2=5.00\n(3.38+6.62)/2=5.00\n(7.22+2.78)/2=5.00\n(5.90+4.10)/2=5.00\n(2.72+7.28)/2=5.00\n\nPaired avg = 5.000 — EXACT!', formula: 'Ȳ = (X + X\')/2 → Variance(Ȳ) ≪ Variance(X)' },
    { title: 'Conclusion', explanation: 'Antithetic variates exploit negative correlation between R and 1−R to cancel out noise. For symmetric distributions U(a,b), they give the EXACT mean with any number of pairs!\n\nFor non-symmetric distributions, variance is still significantly reduced.', formula: 'Var(antithetic) = ½·Var(direct)·(1 + Cov(X,X\')/Var(X))' },
  ],
  Visual: ({ step }) => <W6Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 7 — M/M/1 Queue: Little's Law (λ=4/hr, μ=6/hr)
// ══════════════════════════════════════════════════════════════════════════════
const w7λ = 4, w7μ = 6;
const w7ρ = w7λ / w7μ;                     // 0.6667
const w7L  = w7ρ / (1 - w7ρ);             // 2
const w7Lq = w7ρ * w7ρ / (1 - w7ρ);      // 1.333
const w7W  = 1 / (w7μ - w7λ);            // 0.5 hr = 30 min
const w7Wq = w7λ / (w7μ * (w7μ - w7λ)); // 1/3 hr = 20 min

const W7Visual: React.FC<{ step: number }> = ({ step }) => {
  const metrics = [
    { key: 'ρ (traffic intensity)', val: w7ρ.toFixed(4), bar: w7ρ, col: 'bg-amber-400', lo: step >= 1 },
    { key: 'L (avg in system)', val: w7L.toFixed(3) + ' customers', bar: w7L / 6, col: 'bg-sky-500', lo: step >= 2 },
    { key: 'Lq (avg in queue)', val: w7Lq.toFixed(3) + ' customers', bar: w7Lq / 6, col: 'bg-sky-300', lo: step >= 3 },
    { key: 'W (avg time in sys)', val: (w7W * 60).toFixed(0) + ' min', bar: w7W / 1, col: 'bg-violet-500', lo: step >= 4 },
    { key: 'Wq (avg wait time)', val: (w7Wq * 60).toFixed(0) + ' min', bar: w7Wq, col: 'bg-violet-300', lo: step >= 5 },
  ];
  return (
    <div className="space-y-3">
      <div className="bg-slate-900 rounded-xl p-3">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-3">M/M/1 Queue — λ=4/hr, μ=6/hr</p>
        {/* Queue diagram */}
        <div className="flex items-center gap-2 justify-center mb-3">
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-6 h-8 rounded border-2 flex items-center justify-center text-[9px] font-black transition-all duration-500 ${
                step >= 3 && i < Math.round(w7Lq)
                  ? 'bg-sky-500 border-sky-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-600'
              }`}>{step >= 3 && i < Math.round(w7Lq) ? '👤' : ''}</div>
            ))}
          </div>
          <div className="text-[9px] text-slate-400 font-bold">QUEUE</div>
          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg transition-all duration-500 ${
            step >= 1 ? 'bg-violet-600 border-violet-400' : 'bg-slate-800 border-slate-700'
          }`}>{step >= 1 ? '⚙️' : ''}</div>
          <div className="text-[9px] text-slate-400 font-bold">SERVER</div>
        </div>
      </div>

      <div className="space-y-2">
        {metrics.map(m => (
          <div key={m.key} className={`transition-all duration-500 ${m.lo ? 'opacity-100' : 'opacity-20'}`}>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="font-bold text-slate-600">{m.key}</span>
              <span className="font-mono font-black text-aast-navy">{m.val}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${m.col} transition-all duration-700`} style={{ width: m.lo ? `${Math.min(m.bar * 100, 100)}%` : '0%' }} />
            </div>
          </div>
        ))}
      </div>

      {step >= 6 && (
        <div className="bg-aast-gold/10 border border-aast-gold/30 rounded-xl p-3 text-[10px] text-aast-navy">
          <p className="font-black mb-1">Little's Law Verification</p>
          <p>L = λ·W = 4 × 0.5 = <strong>2.000 ✅</strong></p>
          <p>Lq = λ·Wq = 4 × (1/3) = <strong>1.333 ✅</strong></p>
        </div>
      )}
    </div>
  );
};

const w7Problem: SectionProblem = {
  weekId: 'w7',
  source: 'Section Week 7 — Curriclum.pdf (Queueing Theory)',
  title: 'M/M/1 Queue Analysis — Little\'s Law',
  statement: `A single-server queue has:
  λ = 4 customers/hour (arrival rate)
  μ = 6 customers/hour (service rate)

Find: traffic intensity ρ, average number in system L, average number in queue Lq,
average time in system W, and average waiting time Wq.
Verify results using Little's Law.`,
  steps: [
    { title: 'Traffic intensity ρ', explanation: 'ρ = λ/μ = 4/6 = 2/3 ≈ 0.667\nSince ρ < 1, the queue is STABLE (server handles load).\nρ also equals the server utilization: busy 66.7% of the time.', formula: 'ρ = λ/μ = 4/6 = 0.6̄  < 1 ✅' },
    { title: 'Average in system: L', explanation: 'For M/M/1: L = ρ/(1−ρ)\nL = (2/3)/(1/3) = 2 customers on average in the entire system (queue + service).', formula: 'L = ρ/(1−ρ) = (2/3)/(1/3) = 2 customers' },
    { title: 'Average in queue: Lq', explanation: 'Lq = ρ²/(1−ρ)\nLq = (4/9)/(1/3) = 4/3 ≈ 1.333 customers waiting.', formula: 'Lq = ρ²/(1−ρ) = 4/3 ≈ 1.333 customers' },
    { title: 'Average time in system: W', explanation: 'W = 1/(μ−λ) = 1/(6−4) = 1/2 hour = 30 minutes.\nThis is the total sojourn time: wait + service.', formula: 'W = 1/(μ−λ) = 1/2 hr = 30 min' },
    { title: 'Average waiting time: Wq', explanation: 'Wq = λ/[μ(μ−λ)] = 4/[6×2] = 4/12 = 1/3 hr ≈ 20 min.\nOr: Wq = W − 1/μ = 0.5 − 1/6 = 1/3 hr.', formula: 'Wq = λ/[μ(μ−λ)] = 1/3 hr = 20 min' },
    { title: 'Verify with Little\'s Law', explanation: 'Little\'s Law: L = λ·W\nCheck: 4 × (1/2) = 2 ✅\n\nAlso: Lq = λ·Wq\nCheck: 4 × (1/3) = 4/3 ≈ 1.333 ✅\n\nLittle\'s Law holds for any stable queue (not just M/M/1).', formula: 'L = λW  and  Lq = λWq' },
    { title: 'Interpret results', explanation: 'On average:\n• 2 customers are present in the system\n• 1.33 are waiting in the queue\n• Each customer spends 30 min total (20 waiting + 10 in service)\n• Server is busy 66.7% of the time\n\nIncreasing μ or decreasing λ reduces all metrics.', formula: 'Avg service time = 1/μ = 10 min → 30−10 = 20 min waiting ✅' },
  ],
  Visual: ({ step }) => <W7Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 8 — Inverse Transform: Exponential(λ=2) sampling
// ══════════════════════════════════════════════════════════════════════════════
const w8λ = 2;
const w8RNs = [0.30, 0.70, 0.50, 0.90];
const w8Samples = w8RNs.map(r => parseFloat((-(1 / w8λ) * Math.log(1 - r)).toFixed(4)));
const w8Mean = parseFloat((w8Samples.reduce((s,v)=>s+v,0)/w8Samples.length).toFixed(4));

const W8Visual: React.FC<{ step: number }> = ({ step }) => {
  const visible = step >= 2 ? Math.min(step - 1, w8Samples.length) : 0;
  return (
    <div className="space-y-3">
      {/* CDF curve representation */}
      {step >= 1 && (
        <div className="bg-slate-900 rounded-xl p-3">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">Exponential CDF: F(x) = 1 − e^(−λx), λ={w8λ}</p>
          <div className="relative h-20 bg-slate-800 rounded overflow-hidden">
            {/* CDF curve (approximate with segments) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
              <path d={`M 0 80 ${[...Array(41)].map((_,i)=>{
                const x = i/40;
                const y = 80 - (1 - Math.exp(-w8λ * x * 2)) * 75;
                return `L ${x*200} ${y}`;
              }).join(' ')}`} fill="none" stroke="#60a5fa" strokeWidth="2"/>
            </svg>
            {/* RN horizontal lines + sample points */}
            {w8RNs.slice(0, visible).map((r, i) => {
              const xPct = (w8Samples[i] / 2) * 100;
              const yPct = r * 100;
              return (
                <React.Fragment key={i}>
                  <div className="absolute right-0 h-px bg-aast-gold/60" style={{ top: `${100 - yPct}%`, width: `${100 - xPct}%` }} />
                  <div className="absolute w-2 h-2 rounded-full bg-aast-gold -translate-x-1 -translate-y-1" style={{ left: `${xPct}%`, top: `${100 - yPct}%` }} />
                </React.Fragment>
              );
            })}
          </div>
          <p className="text-[8px] text-slate-500 mt-1">x-axis: 0–2, y-axis: F(x) 0–1 (approx)</p>
        </div>
      )}

      {visible > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-[10px]">
            <thead className="bg-slate-50 border-b">
              <tr>{['i','R','1−R','X = −(1/2)·ln(1−R)'].map(h=><th key={h} className="p-2 text-left font-bold text-slate-600">{h}</th>)}</tr>
            </thead>
            <tbody>
              {w8RNs.slice(0, visible).map((r, i) => (
                <tr key={i} className="border-t hover:bg-slate-50">
                  <td className="p-2 font-mono font-bold text-slate-500">{i+1}</td>
                  <td className="p-2 font-mono">{r}</td>
                  <td className="p-2 font-mono">{(1-r).toFixed(2)}</td>
                  <td className="p-2 font-mono font-black text-aast-navy">{w8Samples[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {visible >= 4 && (
        <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
          <div className="p-2 rounded-xl bg-sky-50 border border-sky-200">
            <p className="text-sky-600 font-bold">Sample Mean</p>
            <p className="text-lg font-black text-sky-800">{w8Mean}</p>
          </div>
          <div className="p-2 rounded-xl bg-violet-50 border border-violet-200">
            <p className="text-violet-600 font-bold">Theoretical E[X]</p>
            <p className="text-lg font-black text-violet-800">{(1/w8λ).toFixed(4)}</p>
            <p className="text-[9px] text-violet-400">= 1/λ = 1/2</p>
          </div>
        </div>
      )}
    </div>
  );
};

const w8Problem: SectionProblem = {
  weekId: 'w8',
  source: 'Section Week 8 — Curriclum.pdf (Inverse Transform)',
  title: 'Inverse Transform: Exponential(λ=2) Sampling',
  statement: `Use the Inverse Transform Method to generate samples from
Exponential distribution with λ = 2 (mean = 0.5).

CDF: F(x) = 1 − e^(−2x)  →  Inverse: X = −(1/2)·ln(1−R)

Use random numbers: R = {0.30, 0.70, 0.50, 0.90}
Compare the sample mean with the theoretical mean 1/λ = 0.5.`,
  steps: [
    { title: 'Inverse Transform principle', explanation: 'If U ~ Uniform(0,1) and F is a CDF, then X = F⁻¹(U) follows distribution F.\nFor Exponential(λ): F(x) = 1−e^(−λx)\nSolving for x: X = −(1/λ)·ln(1−U)', formula: 'X = F⁻¹(U) = −(1/λ)·ln(1−U) = −(1/2)·ln(1−R)' },
    { title: 'Draw CDF curve', explanation: 'Plot F(x) = 1 − e^(−2x) for x ≥ 0.\nFor each random number R on the y-axis, draw a horizontal line to the curve, then drop vertically to get the sample x.\nThis is the graphical interpretation of the inverse transform.', formula: 'R=0.5 → solve: 0.5=1−e^(−2x) → x=−(1/2)ln(0.5)≈0.347' },
    { title: 'Sample x₁: R=0.30', explanation: 'x₁ = −(1/2)·ln(1−0.30) = −(1/2)·ln(0.70)\n   = −(1/2)·(−0.3567)\n   = 0.1783', formula: 'x₁ = 0.1783' },
    { title: 'Sample x₂: R=0.70', explanation: 'x₂ = −(1/2)·ln(1−0.70) = −(1/2)·ln(0.30)\n   = −(1/2)·(−1.2040)\n   = 0.6020', formula: 'x₂ = 0.6020' },
    { title: 'Samples x₃, x₄', explanation: 'x₃: R=0.50 → −(1/2)·ln(0.50) = −(1/2)·(−0.6931) = 0.3466\nx₄: R=0.90 → −(1/2)·ln(0.10) = −(1/2)·(−2.3026) = 1.1513', formula: 'x₃ = 0.3466,  x₄ = 1.1513' },
    { title: 'Compare with theory', explanation: `Sample mean = (0.1783+0.6020+0.3466+1.1513)/4 = ${w8Mean}\nTheoretical mean = 1/λ = 1/2 = 0.500\n\nRelative error = |${w8Mean}−0.5|/0.5 × 100 = ${(Math.abs(w8Mean-0.5)/0.5*100).toFixed(1)}%\n\nMore samples → mean converges to 0.5 (Law of Large Numbers).`, formula: 'E[X] = 1/λ = 0.500  →  converges with N→∞' },
  ],
  Visual: ({ step }) => <W8Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 9 — Inventory Lead Time Simulation
// ══════════════════════════════════════════════════════════════════════════════
const w9Demand = [
  { demand: 10, prob: 0.25, from: 0, to: 24 },
  { demand: 20, prob: 0.50, from: 25, to: 74 },
  { demand: 30, prob: 0.25, from: 75, to: 99 },
];
const w9DemandRNs = [72, 18, 85, 50, 38];
const w9DemandSim = w9DemandRNs.map(r => w9Demand.find(d => r >= d.from && r <= d.to)!.demand);
const w9ReorderPoint = 30;
const w9OrderQty = 40;

const W9Visual: React.FC<{ step: number }> = ({ step }) => {
  let inv = 50;
  const rows: { day: number; rn: number; demand: number; invBefore: number; invAfter: number; reorder: boolean; stockout: boolean }[] = [];
  let orderPending = false;
  let leadTimeLeft = 0;

  for (let d = 0; d < 5; d++) {
    const invBefore = inv;
    if (orderPending && leadTimeLeft === 0) { inv += w9OrderQty; orderPending = false; }
    const demand = w9DemandSim[d];
    const invAfter = inv - demand;
    const stockout = invAfter < 0;
    inv = Math.max(invAfter, 0);
    const reorder = inv <= w9ReorderPoint && !orderPending;
    if (reorder) { orderPending = true; leadTimeLeft = 2; }
    if (leadTimeLeft > 0) leadTimeLeft--;
    rows.push({ day: d + 1, rn: w9DemandRNs[d], demand, invBefore: invBefore, invAfter, reorder, stockout });
  }

  const visibleRows = Math.min(step, rows.length);
  return (
    <div className="space-y-3">
      {step >= 1 && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-3 py-1.5 border-b">
            <p className="text-[10px] font-black text-slate-600">Demand Mapping Table (reorder point = {w9ReorderPoint}, Q = {w9OrderQty})</p>
          </div>
          <table className="w-full text-[10px]">
            <thead className="bg-slate-50/50"><tr>{['Demand','P','RN Range'].map(h=><th key={h} className="p-1.5 text-left font-bold text-slate-500">{h}</th>)}</tr></thead>
            <tbody>{w9Demand.map((d,i)=>(
              <tr key={i} className="border-t">
                <td className="p-1.5 font-black">{d.demand}</td>
                <td className="p-1.5">{d.prob}</td>
                <td className="p-1.5 font-mono">{d.from.toString().padStart(2,'0')}–{d.to.toString().padStart(2,'0')}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {visibleRows > 0 && (
        <div className="space-y-1.5">
          {rows.slice(0, visibleRows).map((r, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-xl border text-[10px] ${
              r.stockout ? 'bg-rose-50 border-rose-200' :
              r.reorder ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'
            }`}>
              <span className="font-bold text-slate-500 w-10">Day {r.day}</span>
              <span className="font-mono bg-slate-100 px-1.5 rounded">RN={r.rn}</span>
              <span className="font-black text-slate-700">D={r.demand}</span>
              <span className="text-slate-400">→</span>
              <span className={`font-black ${r.invAfter < 0 ? 'text-rose-600' : 'text-aast-navy'}`}>
                Inv={r.invAfter}
              </span>
              {r.stockout && <span className="text-[9px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">STOCKOUT</span>}
              {r.reorder && <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">ORDER Q={w9OrderQty}</span>}
            </div>
          ))}
        </div>
      )}

      {visibleRows >= 5 && (
        <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
            <p className="text-rose-600 font-bold">Stockout Days</p>
            <p className="text-lg font-black text-rose-800">{rows.filter(r=>r.stockout).length}</p>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-amber-700 font-bold">Reorders Placed</p>
            <p className="text-lg font-black text-amber-800">{rows.filter(r=>r.reorder).length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const w9Problem: SectionProblem = {
  weekId: 'w9',
  source: 'Section Week 9 — Curriclum.pdf (Inventory Simulation)',
  title: 'Inventory Lead-Time Simulation',
  statement: `Simulate 5 days of inventory for a store with:
  • Starting inventory = 50 units
  • Reorder point s = 30 units, Order quantity Q = 40 units
  • Lead time = 2 days (fixed)

Daily demand distribution:
  P(10) = 0.25 (RN 00–24)
  P(20) = 0.50 (RN 25–74)
  P(30) = 0.25 (RN 75–99)

Demand RNs: 72, 18, 85, 50, 38
Find: stockout days, orders placed.`,
  steps: [
    { title: 'Set up demand mapping', explanation: 'Build cumulative probability table and assign RN ranges:\n• Demand=10: P=0.25 → RN 00–24\n• Demand=20: P=0.50 → RN 25–74\n• Demand=30: P=0.25 → RN 75–99\n\nStarting inventory = 50. Reorder when inventory ≤ 30.', formula: 'If RN in [from, to] → demand = that value' },
    { title: 'Day 1: RN=72 → demand=20', explanation: 'RN=72 falls in 25–74 → Demand=20\nInventory: 50 − 20 = 30\nInv ≤ reorder point (30) → PLACE ORDER Q=40 (arrives day 3)', formula: 'Inv = 50 − 20 = 30 → reorder!' },
    { title: 'Day 2: RN=18 → demand=10', explanation: 'RN=18 falls in 00–24 → Demand=10\nInventory: 30 − 10 = 20\nOrder still in transit (lead time = 2 days)', formula: 'Inv = 30 − 10 = 20' },
    { title: 'Day 3: order arrives + RN=85', explanation: 'Order of 40 units arrives at start of day 3.\nInventory: 20 + 40 = 60\nRN=85 → demand=30\nInventory: 60 − 30 = 30 → reorder again!', formula: 'Inv = 20+40−30 = 30 → reorder!' },
    { title: 'Days 4 & 5: RN=50, RN=38', explanation: 'Day 4: RN=50→demand=20 → Inv=30−20=10\nDay 5: RN=38→demand=20 → Inv=10−20=−10 → STOCKOUT!\n\nOrder placed on Day 3 arrives on Day 5 (too late).', formula: 'Day 5: Inv = 10−20 = −10 → Stockout!' },
    { title: 'Summary & findings', explanation: 'Stockout days: 1 (Day 5)\nOrders placed: 2 (Days 1 and 3)\n\nLessons:\n• A reorder point of 30 with lead time 2 days is risky under high demand\n• Increase reorder point or reduce lead time to prevent stockouts\n• Simulation helps find the optimal (s, Q) policy', formula: 'Service level = (5−1)/5 = 80%' },
  ],
  Visual: ({ step }) => <W9Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// WEEK 10 — Machine Maintenance: TTF Simulation
// ══════════════════════════════════════════════════════════════════════════════
const w10TTFDist = [
  { ttf: 1, prob: 0.25, from: 0, to: 24 },
  { ttf: 2, prob: 0.50, from: 25, to: 74 },
  { ttf: 3, prob: 0.25, from: 75, to: 99 },
];
const w10TTFRNs = [18, 62, 89, 41];
const w10TTFs = w10TTFRNs.map(r => w10TTFDist.find(d => r >= d.from && r <= d.to)!.ttf);
const w10RepairTime = 1; // constant

const W10Visual: React.FC<{ step: number }> = ({ step }) => {
  // Build timeline
  const cycles: { ttf: number; rn: number; start: number; failAt: number; repairEnd: number }[] = [];
  let t = 0;
  for (let i = 0; i < 4; i++) {
    const start = t;
    const failAt = t + w10TTFs[i];
    const repairEnd = failAt + w10RepairTime;
    cycles.push({ ttf: w10TTFs[i], rn: w10TTFRNs[i], start, failAt, repairEnd });
    t = repairEnd;
  }
  const maxT = t;
  const totalRun = w10TTFs.reduce((s,v)=>s+v,0);
  const totalDown = 4 * w10RepairTime;
  const availability = parseFloat((totalRun / maxT * 100).toFixed(1));

  const visibleCycles = Math.min(step, cycles.length);
  return (
    <div className="space-y-3">
      {/* TTF table */}
      {step >= 1 && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-[10px]">
            <thead className="bg-slate-50 border-b"><tr>{['TTF','P','RN Range'].map(h=><th key={h} className="p-1.5 text-left font-bold text-slate-500">{h}</th>)}</tr></thead>
            <tbody>{w10TTFDist.map((d,i)=>(
              <tr key={i} className="border-t">
                <td className="p-1.5 font-black">{d.ttf} hr</td>
                <td className="p-1.5">{d.prob}</td>
                <td className="p-1.5 font-mono">{d.from.toString().padStart(2,'0')}–{d.to.toString().padStart(2,'0')}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* Gantt */}
      {visibleCycles > 0 && (
        <div className="bg-slate-900 rounded-xl p-3">
          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">Machine Timeline (total {maxT} hrs)</p>
          <div className="space-y-1.5">
            {cycles.slice(0, visibleCycles).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[9px] text-slate-400 font-mono w-5">C{i+1}</span>
                <div className="relative flex-1 h-6 bg-slate-800 rounded">
                  {/* Running bar */}
                  <div className="absolute top-0.5 bottom-0.5 rounded bg-emerald-500"
                    style={{ left: `${(c.start/maxT)*100}%`, width: `${(c.ttf/maxT)*100}%` }}>
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white">RUN {c.ttf}h</span>
                  </div>
                  {/* Repair bar */}
                  <div className="absolute top-0.5 bottom-0.5 rounded bg-rose-500"
                    style={{ left: `${(c.failAt/maxT)*100}%`, width: `${(w10RepairTime/maxT)*100}%` }}>
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-white">FIX</span>
                  </div>
                </div>
                <span className="text-[8px] text-slate-400 font-mono w-4">{c.repairEnd}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-2">
            {[{c:'bg-emerald-500',l:'Running'},{c:'bg-rose-500',l:'Repair'}].map(lx=>(
              <div key={lx.l} className="flex items-center gap-1"><div className={`w-2 h-2 rounded ${lx.c}`}/><span className="text-[8px] text-slate-400">{lx.l}</span></div>
            ))}
          </div>
        </div>
      )}

      {visibleCycles >= 4 && (
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          {[
            { label: 'Total Run', val: `${totalRun} hr`, col: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
            { label: 'Total Down', val: `${totalDown} hr`, col: 'bg-rose-50 border-rose-200 text-rose-700' },
            { label: 'Availability', val: `${availability}%`, col: 'bg-sky-50 border-sky-200 text-sky-700' },
          ].map(b => (
            <div key={b.label} className={`p-2 rounded-xl border ${b.col}`}>
              <p className="font-bold">{b.label}</p>
              <p className="text-base font-black">{b.val}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const w10Problem: SectionProblem = {
  weekId: 'w10',
  source: 'Section Week 10 — Curriclum.pdf (Machine Maintenance)',
  title: 'Machine Maintenance: TTF Simulation',
  statement: `A machine has time-to-failure (TTF) distribution:
  P(TTF=1 hr) = 0.25 (RN 00–24)
  P(TTF=2 hr) = 0.50 (RN 25–74)
  P(TTF=3 hr) = 0.25 (RN 75–99)

Repair time is constant = 1 hour.
Simulate 4 failure-repair cycles using RNs: 18, 62, 89, 41.
Find: total run time, total downtime, machine availability.`,
  steps: [
    { title: 'Set up TTF mapping', explanation: 'Assign RN ranges based on cumulative probabilities:\n• TTF=1 hr (P=0.25): RN 00–24\n• TTF=2 hr (P=0.50): RN 25–74\n• TTF=3 hr (P=0.25): RN 75–99\n\nRepair time = 1 hr (deterministic)', formula: 'TTF = f(RN) using lookup table' },
    { title: 'Cycle 1: RN=18 → TTF=1 hr', explanation: 'RN=18 falls in 00–24 → TTF=1 hr\nMachine runs t=0 to t=1, then fails.\nRepair: t=1 to t=2 (1 hr).\nMachine available again at t=2.', formula: 'Run[0→1], Repair[1→2]' },
    { title: 'Cycle 2: RN=62 → TTF=2 hr', explanation: 'RN=62 falls in 25–74 → TTF=2 hr\nMachine runs t=2 to t=4, then fails.\nRepair: t=4 to t=5.\nAvailable again at t=5.', formula: 'Run[2→4], Repair[4→5]' },
    { title: 'Cycle 3: RN=89 → TTF=3 hr', explanation: 'RN=89 falls in 75–99 → TTF=3 hr\nMachine runs t=5 to t=8, then fails.\nRepair: t=8 to t=9.\nAvailable again at t=9.', formula: 'Run[5→8], Repair[8→9]' },
    { title: 'Cycle 4: RN=41 → TTF=2 hr', explanation: 'RN=41 falls in 25–74 → TTF=2 hr\nMachine runs t=9 to t=11, then fails.\nRepair: t=11 to t=12.\nSimulation ends at t=12.', formula: 'Run[9→11], Repair[11→12]' },
    { title: 'Calculate availability', explanation: `Total simulation time = 12 hr
Total running time = 1+2+3+2 = 8 hr
Total downtime (repairs) = 4×1 = 4 hr
Machine availability = 8/12 ≈ 66.7%

Theoretical: E[TTF] = 0.25×1 + 0.5×2 + 0.25×3 = 2.0 hr
E[Cycle] = E[TTF] + E[Repair] = 2+1 = 3 hr
Theoretical availability = 2/3 ≈ 66.7% ✅`, formula: 'Availability = Run / (Run + Down) = 8/12 = 66.7%' },
  ],
  Visual: ({ step }) => <W10Visual step={step} />,
};

// ══════════════════════════════════════════════════════════════════════════════
// Lookup map
// ══════════════════════════════════════════════════════════════════════════════
const problemsByWeek: Record<string, SectionProblem> = {
  w1: w1Problem,
  w2: w2Problem,
  w3: w3Problem,
  w4: w4Problem,
  w5: w5Problem,
  w6: w6Problem,
  w7: w7Problem,
  w8: w8Problem,
  w9: w9Problem,
  w10: w10Problem,
  w11: w11Problem,
  w12: w12Problem,
  w13: w13Problem,
};

// ══════════════════════════════════════════════════════════════════════════════
// Public export
// ══════════════════════════════════════════════════════════════════════════════
export const SectionProblemSolver: React.FC<{ weekId: string }> = ({ weekId }) => {
  const problem = problemsByWeek[weekId];
  if (!problem) return null;
  return <SolverCard problem={problem} />;
};

export const hasSectionProblem = (weekId: string) => weekId in problemsByWeek;

export default SectionProblemSolver;
