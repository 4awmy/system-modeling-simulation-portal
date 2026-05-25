import React, { useMemo, useState } from 'react';
import { RefreshCw, Info } from 'lucide-react';

const cardClass = 'bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3';

const seededUnit = (seed: number) => {
  const x = (seed * 1664525 + 1013904223) % 4294967296;
  return x / 4294967296;
};

const seededInt = (seed: number, max: number) => Math.floor(seededUnit(seed) * max);

export const RandomMappingDemo: React.FC = () => {
  const [rn, setRn] = useState<number>(42);
  const bands = [
    { label: 'Demand 0', from: 0, to: 9 },
    { label: 'Demand 1', from: 10, to: 59 },
    { label: 'Demand 2', from: 60, to: 99 },
  ];
  const active = bands.find((b) => rn >= b.from && rn <= b.to);

  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">00-99 Cumulative Probability Mapping</h4>
      <div className="flex items-end gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600">Random Number (00-99)</label>
          <input
            type="number"
            min={0}
            max={99}
            value={rn}
            onChange={(e) => setRn(Math.min(99, Math.max(0, Number(e.target.value) || 0)))}
            className="mt-1 w-28 px-2 py-1 text-xs border border-slate-200 rounded"
          />
        </div>
        <button
          onClick={() => setRn((prev) => (prev * 37 + 11) % 100)}
          className="px-3 py-1.5 text-xs rounded bg-aast-navy text-white font-bold"
        >
          Generate RN
        </button>
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        {bands.map((b) => (
          <div
            key={b.label}
            className={`rounded-lg border p-2 text-xs ${
              active?.label === b.label ? 'border-aast-gold bg-aast-gold-soft' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <p className="font-bold">{b.label}</p>
            <p className="text-slate-500">
              {String(b.from).padStart(2, '0')} - {String(b.to).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-700">
        Outcome for RN {String(rn).padStart(2, '0')}: <strong>{active?.label}</strong>
      </p>
    </div>
  );
};

export const MonteCarloCoinDemandDemo: React.FC = () => {
  const [trials, setTrials] = useState<number>(50);
  const result = useMemo(() => {
    let heads = 0;
    let demandSum = 0;
    for (let i = 0; i < trials; i++) {
      if (seededUnit(i + trials) < 0.5) heads++;
      const rn = seededInt(i * 3 + trials, 100);
      if (rn <= 9) demandSum += 0;
      else if (rn <= 59) demandSum += 1;
      else demandSum += 2;
    }
    return { heads, tails: trials - heads, avgDemand: trials > 0 ? demandSum / trials : 0 };
  }, [trials]);

  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">Monte Carlo: Coin + Demand</h4>
      <div className="flex items-end gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600">Trials</label>
          <input
            type="number"
            min={1}
            max={5000}
            value={trials}
            onChange={(e) => setTrials(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 w-28 px-2 py-1 text-xs border border-slate-200 rounded"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-2 text-xs">
        <div className="p-2 border rounded bg-slate-50">Heads: <strong>{result.heads}</strong></div>
        <div className="p-2 border rounded bg-slate-50">Tails: <strong>{result.tails}</strong></div>
        <div className="p-2 border rounded bg-slate-50">Avg Demand: <strong>{result.avgDemand.toFixed(3)}</strong></div>
      </div>
    </div>
  );
};

export const MultiStageDecisionDemo: React.FC = () => {
  const [rn1, setRn1] = useState<number>(30);
  const [rn2, setRn2] = useState<number>(85);
  const interested = rn1 <= 49;
  const outcome = !interested ? 'No Interest'
    : rn2 <= 59 ? 'No Sale'
    : rn2 <= 79 ? 'Small Policy'
    : 'Large Policy';

  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">Multi-Stage Decision Simulation</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600">RN₁ Interest (00-99)</label>
          <input type="number" min={0} max={99} value={rn1} onChange={(e) => setRn1(Math.min(99, Math.max(0, Number(e.target.value) || 0)))} className="mt-1 w-full px-2 py-1 text-xs border border-slate-200 rounded" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600">RN₂ Sale Type (00-99)</label>
          <input type="number" min={0} max={99} value={rn2} onChange={(e) => setRn2(Math.min(99, Math.max(0, Number(e.target.value) || 0)))} className="mt-1 w-full px-2 py-1 text-xs border border-slate-200 rounded" />
        </div>
      </div>
      <p className="text-xs text-slate-700">
        Stage 1: <strong>{interested ? 'Interested' : 'Not Interested'}</strong> | Final Outcome: <strong>{outcome}</strong>
      </p>
    </div>
  );
};

export const TimeEventScanDemo: React.FC = () => {
  const [arrival, setArrival] = useState<number>(3);
  const [service, setService] = useState<number>(5);
  const periodicTicks = Array.from({ length: 12 }, (_, i) => i);
  const events = [
    { t: arrival, e: 'Arrival' },
    { t: arrival + service, e: 'Departure' },
  ];

  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">Time-Driven vs Event-Driven</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600">Arrival Time</label>
          <input type="number" min={0} value={arrival} onChange={(e) => setArrival(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full px-2 py-1 text-xs border border-slate-200 rounded" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-slate-600">Service Time</label>
          <input type="number" min={1} value={service} onChange={(e) => setService(Math.max(1, Number(e.target.value) || 1))} className="mt-1 w-full px-2 py-1 text-xs border border-slate-200 rounded" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <div className="p-2 border rounded bg-slate-50">
          <p className="font-bold mb-1">Periodic Scan</p>
          <p>Clock checks at ticks: {periodicTicks.join(', ')}</p>
        </div>
        <div className="p-2 border rounded bg-slate-50">
          <p className="font-bold mb-1">Event Scan</p>
          <p>{events.map((x) => `${x.e}@t=${x.t}`).join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export const QueueSimulatorDemo: React.FC = () => {
  const [customers, setCustomers] = useState<number>(10);
  const rows = useMemo(() => {
    let clock = 0;
    let serverFreeAt = 0;
    const trace: { id: number; arrival: number; start: number; depart: number; wait: number }[] = [];
    for (let i = 1; i <= customers; i++) {
      const ia = 1 + seededInt(i + customers, 4);
      const st = 2 + seededInt(i * 2 + customers, 4);
      clock += ia;
      const start = Math.max(clock, serverFreeAt);
      const depart = start + st;
      trace.push({ id: i, arrival: clock, start, depart, wait: start - clock });
      serverFreeAt = depart;
    }
    return trace;
  }, [customers]);

  const metrics = useMemo(() => {
    const totalWait = rows.reduce((s, r) => s + r.wait, 0);
    const busy = rows.reduce((s, r) => s + (r.depart - r.start), 0);
    const simEnd = rows.at(-1)?.depart ?? 1;
    return { avgWait: totalWait / rows.length, util: busy / simEnd };
  }, [rows]);

  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">Single-Server Queue (Trace)</h4>
      <div>
        <label className="text-[11px] font-semibold text-slate-600">Customers</label>
        <input type="number" min={1} max={100} value={customers} onChange={(e) => setCustomers(Math.max(1, Number(e.target.value) || 1))} className="mt-1 w-28 px-2 py-1 text-xs border border-slate-200 rounded" />
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 text-left">C</th>
              <th className="p-2 text-left">Arrival</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">Depart</th>
              <th className="p-2 text-left">Wait</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.id}</td>
                <td className="p-2">{r.arrival}</td>
                <td className="p-2">{r.start}</td>
                <td className="p-2">{r.depart}</td>
                <td className="p-2">{r.wait}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-700">
        Avg Wait: <strong>{metrics.avgWait.toFixed(2)}</strong> | Utilization: <strong>{(metrics.util * 100).toFixed(1)}%</strong>
      </p>
    </div>
  );
};

export const InventoryLeadTimeDemo: React.FC = () => {
  const [initialStock, setInitialStock] = useState<number>(20);
  const [reorderPoint, setReorderPoint] = useState<number>(8);
  const [days, setDays] = useState<number>(12);

  const result = useMemo(() => {
    let stock = initialStock;
    let pending: { due: number; qty: number } | null = null;
    const trace: { day: number; demand: number; stock: number; note: string }[] = [];
    for (let d = 1; d <= days; d++) {
      if (pending && pending.due === d) {
        stock += pending.qty;
        pending = null;
      }
      const demand = seededInt(d + initialStock + reorderPoint + days, 4);
      stock = Math.max(0, stock - demand);
      let note = '';
      if (stock <= reorderPoint && !pending) {
        const lead: number = 1 + seededInt(stock + d, 3);
        pending = { due: d + lead, qty: 12 };
        note = `Order placed (lead=${lead})`;
      }
      trace.push({ day: d, demand, stock, note });
    }
    return trace;
  }, [initialStock, reorderPoint, days]);

  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">Inventory with Stochastic Lead Time</h4>
      <div className="grid sm:grid-cols-3 gap-2">
        <input type="number" value={initialStock} onChange={(e) => setInitialStock(Math.max(1, Number(e.target.value) || 1))} className="px-2 py-1 text-xs border rounded" />
        <input type="number" value={reorderPoint} onChange={(e) => setReorderPoint(Math.max(0, Number(e.target.value) || 0))} className="px-2 py-1 text-xs border rounded" />
        <input type="number" value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value) || 1))} className="px-2 py-1 text-xs border rounded" />
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr><th className="p-2 text-left">Day</th><th className="p-2 text-left">Demand</th><th className="p-2 text-left">Stock</th><th className="p-2 text-left">Note</th></tr>
          </thead>
          <tbody>
            {result.slice(0, 10).map((r) => (
              <tr key={r.day} className="border-t"><td className="p-2">{r.day}</td><td className="p-2">{r.demand}</td><td className="p-2">{r.stock}</td><td className="p-2">{r.note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RepairmanDemo: React.FC = () => {
  const [repairmen, setRepairmen] = useState<1 | 2>(1);
  const [machines, setMachines] = useState<number>(6);
  const expectedQueue = Math.max(0, machines - repairmen * 2);
  const utilization = Math.min(0.98, machines / (repairmen * 7));
  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">One/Two Repairman Approximation</h4>
      <div className="flex gap-2">
        <button onClick={() => setRepairmen(1)} className={`px-3 py-1 text-xs rounded ${repairmen === 1 ? 'bg-aast-navy text-white' : 'bg-slate-100'}`}>One Repairman</button>
        <button onClick={() => setRepairmen(2)} className={`px-3 py-1 text-xs rounded ${repairmen === 2 ? 'bg-aast-navy text-white' : 'bg-slate-100'}`}>Two Repairmen</button>
        <input type="number" min={1} value={machines} onChange={(e) => setMachines(Math.max(1, Number(e.target.value) || 1))} className="w-24 px-2 py-1 text-xs border rounded" />
      </div>
      <p className="text-xs text-slate-700">
        Estimated queue pressure: <strong>{expectedQueue}</strong> | Estimated utilization: <strong>{(utilization * 100).toFixed(1)}%</strong>
      </p>
    </div>
  );
};

export const AssemblyLineDemo: React.FC = () => {
  const [s1, setS1] = useState<number>(3);
  const [s2, setS2] = useState<number>(5);
  const bottleneck = s2 > s1 ? 'Station 2' : s1 > s2 ? 'Station 1' : 'Balanced';
  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">Two-Stage Assembly Line</h4>
      <div className="grid sm:grid-cols-2 gap-2">
        <div><label className="text-[11px]">Station 1 time</label><input type="number" min={1} value={s1} onChange={(e) => setS1(Math.max(1, Number(e.target.value) || 1))} className="mt-1 w-full px-2 py-1 text-xs border rounded" /></div>
        <div><label className="text-[11px]">Station 2 time</label><input type="number" min={1} value={s2} onChange={(e) => setS2(Math.max(1, Number(e.target.value) || 1))} className="mt-1 w-full px-2 py-1 text-xs border rounded" /></div>
      </div>
      <p className="text-xs text-slate-700">
        Bottleneck: <strong>{bottleneck}</strong> | Throughput bound ≈ <strong>{(60 / Math.max(s1, s2)).toFixed(2)}</strong> units/hour
      </p>
    </div>
  );
};

export const ValidationDemo: React.FC = () => {
  const [observed, setObserved] = useState<string>('12,18,20,10');
  const [expected, setExpected] = useState<string>('15,15,15,15');

  const chi = useMemo(() => {
    const o = observed.split(',').map((x) => Number(x.trim()) || 0);
    const e = expected.split(',').map((x) => Number(x.trim()) || 1);
    const n = Math.min(o.length, e.length);
    let stat = 0;
    for (let i = 0; i < n; i++) {
      stat += ((o[i] - e[i]) ** 2) / Math.max(e[i], 1e-6);
    }
    return stat;
  }, [observed, expected]);

  return (
    <div className={cardClass}>
      <h4 className="text-sm font-black text-aast-navy">Chi-Square / KS Validation Starter</h4>
      <div className="grid gap-2">
        <input value={observed} onChange={(e) => setObserved(e.target.value)} className="px-2 py-1 text-xs border rounded" />
        <input value={expected} onChange={(e) => setExpected(e.target.value)} className="px-2 py-1 text-xs border rounded" />
      </div>
      <p className="text-xs text-slate-700">Chi-square statistic: <strong>{chi.toFixed(4)}</strong></p>
      <p className="text-[11px] text-slate-500">Use this as teaching support; compare with critical value by degrees of freedom.</p>
    </div>
  );
};

// --- HELPER FUNCTIONS FOR LCG ---
const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
};

const getPrimeFactors = (n: number): number[] => {
  const factors = new Set<number>();
  let temp = Math.abs(n);
  while (temp % 2 === 0) {
    factors.add(2);
    temp = temp / 2;
  }
  for (let i = 3; i <= Math.sqrt(temp); i += 2) {
    while (temp % i === 0) {
      factors.add(i);
      temp = temp / i;
    }
  }
  if (temp > 2) {
    factors.add(temp);
  }
  return Array.from(factors);
};

const checkHullDobell = (a: number, c: number, m: number) => {
  if (m <= 0) return { passed: false, details: [{ text: 'Modulus must be positive', passed: false }] };
  
  const c1RelPrime = c !== 0 && gcd(c, m) === 1;
  const primeFactors = getPrimeFactors(m);
  const c2FactorsDivisible = m > 1 && primeFactors.length > 0 && primeFactors.every(p => (a - 1) % p === 0);
  const c3DivisibleBy4 = m % 4 !== 0 || (a - 1) % 4 === 0;
  
  const passed = c1RelPrime && c2FactorsDivisible && c3DivisibleBy4;
  
  return {
    passed,
    details: [
      { text: `c and m are relatively prime (gcd(${c}, ${m}) = ${gcd(c, m)})`, passed: c1RelPrime },
      { text: `a - 1 (${a - 1}) is divisible by all prime factors of m (${primeFactors.join(', ') || 'none'})`, passed: c2FactorsDivisible },
      { text: `a - 1 (${a - 1}) is divisible by 4 if m (${m}) is divisible by 4`, passed: c3DivisibleBy4 }
    ]
  };
};

// --- LCG PLAYGROUND ---
export const LCGPlayground: React.FC = () => {
  const [x0, setX0] = useState<number>(27);
  const [a, setA] = useState<number>(17);
  const [c, setC] = useState<number>(43);
  const [m, setM] = useState<number>(100);
  const [numSteps, setNumSteps] = useState<number>(20);

  const { trace, repeatStep, cycleLength } = useMemo(() => {
    const traceData = [];
    let current = x0;
    const seen = new Map<number, number>();
    let rStep = -1;
    let cLen = 0;

    for (let i = 0; i < numSteps; i++) {
      const term = a * current + c;
      const next = term % m;
      const u = next / m;

      let isRepeat = false;
      if (seen.has(current)) {
        isRepeat = true;
        if (rStep === -1) {
          rStep = seen.get(current)!;
          cLen = i - rStep;
        }
      } else {
        seen.set(current, i);
      }

      traceData.push({
        step: i + 1,
        xCurrent: current,
        term,
        xNext: next,
        uNext: u,
        isRepeat,
      });

      current = next;
    }
    return { trace: traceData, repeatStep: rStep, cycleLength: cLen };
  }, [x0, a, c, m, numSteps]);

  const hdCheck = useMemo(() => checkHullDobell(a, c, m), [a, c, m]);

  const stats = useMemo(() => {
    if (trace.length === 0) return { mean: 0, variance: 0 };
    const sum = trace.reduce((s, r) => s + r.uNext, 0);
    const mean = sum / trace.length;
    const sqDiffSum = trace.reduce((s, r) => s + (r.uNext - mean) ** 2, 0);
    const variance = sqDiffSum / trace.length;
    return { mean, variance };
  }, [trace]);

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <h4 className="text-sm font-black text-aast-navy">Linear Congruential Generator (LCG)</h4>
        <span className="text-[10px] px-2 py-0.5 rounded bg-aast-navy-soft text-aast-navy font-bold font-mono">
          X_n+1 = (aX_n + c) mod m
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div>
          <label className="text-[10px] font-bold text-slate-500">Seed X₀</label>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Multiplier a</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Increment c</label>
          <input
            type="number"
            value={c}
            onChange={(e) => setC(Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Modulus m</label>
          <input
            type="number"
            value={m}
            onChange={(e) => setM(Math.max(1, Number(e.target.value) || 1))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Iterations</label>
          <input
            type="number"
            min={5}
            max={200}
            value={numSteps}
            onChange={(e) => setNumSteps(Math.min(200, Math.max(5, Number(e.target.value) || 5)))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
        <div className="space-y-1.5">
          <p className="font-bold text-aast-navy text-[11px] flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-aast-gold" /> Hull-Dobell Theorem (Full Period m Check):
          </p>
          <div className="space-y-1 text-[11px]">
            {hdCheck.details.map((cond, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className={cond.passed ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                  {cond.passed ? "✔" : "✘"}
                </span>
                <span className="text-slate-600">{cond.text}</span>
              </div>
            ))}
          </div>
          <div className="pt-1">
            <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-black uppercase ${
              hdCheck.passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              Hull-Dobell Passed: {hdCheck.passed ? 'Yes (Period = m)' : 'No (Period < m)'}
            </span>
          </div>
        </div>

        <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 pt-2.5 md:pt-0 md:pl-3">
          <p className="font-bold text-aast-navy text-[11px]">Cycle Detection & Stats:</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-1.5 bg-white border border-slate-100 rounded">
              <span className="text-slate-500 block text-[9px] uppercase font-bold">First Repeat</span>
              <strong className="text-slate-800">{repeatStep !== -1 ? `Step ${repeatStep}` : 'None'}</strong>
            </div>
            <div className="p-1.5 bg-white border border-slate-100 rounded">
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Detected Period</span>
              <strong className="text-slate-800">{cycleLength > 0 ? `${cycleLength} steps` : 'No cycle yet'}</strong>
            </div>
            <div className="p-1.5 bg-white border border-slate-100 rounded">
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Empirical Mean (U)</span>
              <strong className="text-slate-800">{stats.mean.toFixed(4)} <span className="text-[9px] text-slate-400 font-normal">(Target: 0.5)</span></strong>
            </div>
            <div className="p-1.5 bg-white border border-slate-100 rounded">
              <span className="text-slate-500 block text-[9px] uppercase font-bold">Empirical Var (U)</span>
              <strong className="text-slate-800">{stats.variance.toFixed(4)} <span className="text-[9px] text-slate-400 font-normal">(Target: 0.083)</span></strong>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-150 rounded-lg max-h-56 custom-scrollbar">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
            <tr>
              <th className="p-2 text-left w-12">Step</th>
              <th className="p-2 text-left">Current Xᵢ</th>
              <th className="p-2 text-left">a * Xᵢ + c</th>
              <th className="p-2 text-left">Next Xᵢ₊₁</th>
              <th className="p-2 text-left">Random U_n+1</th>
              <th className="p-2 text-left">Repeat?</th>
            </tr>
          </thead>
          <tbody>
            {trace.map((r) => (
              <tr key={r.step} className={`border-t hover:bg-slate-50 transition-colors ${
                r.isRepeat ? 'bg-amber-50/50' : ''
              }`}>
                <td className="p-2 font-bold text-slate-400">{r.step}</td>
                <td className="p-2 font-mono">{r.xCurrent}</td>
                <td className="p-2 text-slate-500 font-mono">{a} * {r.xCurrent} + {c} = {r.term}</td>
                <td className="p-2 font-mono font-bold text-aast-navy">{r.xNext}</td>
                <td className="p-2 font-mono font-bold text-aast-gold">{r.uNext.toFixed(4)}</td>
                <td className="p-2">
                  {r.isRepeat ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                      Repeat
                    </span>
                  ) : (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">New</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MID-SQUARE PLAYGROUND ---
export const MidSquarePlayground: React.FC = () => {
  const [seed, setSeed] = useState<number>(2905);
  const [numSteps, setNumSteps] = useState<number>(15);

  const { trace, repeatStep, cycleLength, degenerated } = useMemo(() => {
    const traceData = [];
    let current = seed;
    const seen = new Map<number, number>();
    let rStep = -1;
    let cLen = 0;
    let degen = false;

    for (let i = 0; i < numSteps; i++) {
      const squared = current * current;
      const padded = String(squared).padStart(8, '0');
      const middleStr = padded.substring(2, 6);
      const next = parseInt(middleStr, 10);
      const u = next / 10000;

      let isRepeat = false;
      if (seen.has(current)) {
        isRepeat = true;
        if (rStep === -1) {
          rStep = seen.get(current)!;
          cLen = i - rStep;
        }
      } else {
        seen.set(current, i);
      }

      if (current === 0) {
        degen = true;
      }

      traceData.push({
        step: i + 1,
        xCurrent: current,
        squared,
        padded,
        middleStr,
        next,
        uNext: u,
        isRepeat,
      });

      current = next;
    }
    return { trace: traceData, repeatStep: rStep, cycleLength: cLen, degenerated: degen };
  }, [seed, numSteps]);

  const isValidSeed = seed >= 1000 && seed <= 9999;

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <h4 className="text-sm font-black text-aast-navy">Mid-Square Method</h4>
        <span className="text-[10px] px-2 py-0.5 rounded bg-aast-navy-soft text-aast-navy font-bold">
          4-Digit Seed RNG
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-bold text-slate-500">4-Digit Seed (1000 - 9999)</label>
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value) || 0)}
            className={`w-full px-2 py-1 text-xs border rounded outline-none focus:border-aast-gold ${
              isValidSeed ? 'border-slate-200' : 'border-rose-300 bg-rose-50'
            }`}
          />
          {!isValidSeed && (
            <p className="text-[9px] text-rose-500 mt-0.5 font-bold">Seed must be a 4-digit number</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Iterations</label>
          <input
            type="number"
            min={5}
            max={50}
            value={numSteps}
            onChange={(e) => setNumSteps(Math.min(50, Math.max(5, Number(e.target.value) || 5)))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => setSeed(Math.floor(1000 + Math.random() * 9000))}
            className="w-full px-3 py-1.5 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition"
          >
            Generate Random Seed
          </button>
        </div>
      </div>

      {degenerated && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700 flex items-start gap-1.5">
          <span className="font-bold">⚠️ Warning:</span>
          <span>The generator has degenerated to 0. This is a common flaw in the Mid-Square method, where the sequence collapses.</span>
        </div>
      )}

      {cycleLength > 0 && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-700 flex items-start gap-1.5">
          <span className="font-bold">⚠️ Cycle Detected:</span>
          <span>A repeating cycle was found. First repeat at Step {repeatStep} with a cycle length of {cycleLength} steps.</span>
        </div>
      )}

      <div className="overflow-x-auto border border-slate-150 rounded-lg max-h-56 custom-scrollbar">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
            <tr>
              <th className="p-2 text-left w-12">Step</th>
              <th className="p-2 text-left">Current Xᵢ</th>
              <th className="p-2 text-left">Square Xᵢ²</th>
              <th className="p-2 text-left">Padded Square (8d)</th>
              <th className="p-2 text-left">Middle 4 (Xᵢ₊₁)</th>
              <th className="p-2 text-left">Random U_n+1</th>
            </tr>
          </thead>
          <tbody>
            {trace.map((r) => {
              const startIdx = 2;
              const endIdx = 6;
              const beforeMiddle = r.padded.substring(0, startIdx);
              const middle = r.padded.substring(startIdx, endIdx);
              const afterMiddle = r.padded.substring(endIdx);
              return (
                <tr key={r.step} className={`border-t hover:bg-slate-50 transition-colors ${
                  r.isRepeat ? 'bg-amber-50/50' : ''
                }`}>
                  <td className="p-2 font-bold text-slate-400">{r.step}</td>
                  <td className="p-2 font-mono">{r.xCurrent.toString().padStart(4, '0')}</td>
                  <td className="p-2 font-mono text-slate-500">{r.squared}</td>
                  <td className="p-2 font-mono">
                    <span className="text-slate-400">{beforeMiddle}</span>
                    <span className="text-aast-gold font-bold underline decoration-2">{middle}</span>
                    <span className="text-slate-400">{afterMiddle}</span>
                  </td>
                  <td className="p-2 font-mono font-bold text-aast-navy">{r.next.toString().padStart(4, '0')}</td>
                  <td className="p-2 font-mono font-bold text-aast-gold">{r.uNext.toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- COMBINED RNG PLAYGROUND ---
export const RNGPlayground: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'mapping' | 'lcg' | 'midsquare'>('mapping');

  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 rounded-lg">
        <button
          onClick={() => setActiveSubTab('mapping')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition ${
            activeSubTab === 'mapping'
              ? 'bg-white text-aast-navy shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          00-99 Cumulative Mapping
        </button>
        <button
          onClick={() => setActiveSubTab('lcg')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition ${
            activeSubTab === 'lcg'
              ? 'bg-white text-aast-navy shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Linear Congruential (LCG)
        </button>
        <button
          onClick={() => setActiveSubTab('midsquare')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition ${
            activeSubTab === 'midsquare'
              ? 'bg-white text-aast-navy shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mid-Square Method
        </button>
      </div>

      <div className="transition-all duration-300">
        {activeSubTab === 'mapping' && <RandomMappingDemo />}
        {activeSubTab === 'lcg' && <LCGPlayground />}
        {activeSubTab === 'midsquare' && <MidSquarePlayground />}
      </div>
    </div>
  );
};

// --- ACCIDENT RISK PLAYGROUND ---
export const AccidentRiskPlayground: React.FC = () => {
  const defaultRns = '92, 44, 99, 15, 97, 21, 47, 80, 28, 87, 13, 33, 42, 84, 27, 64, 59, 33, 84, 00, 10, 50, 51, 09, 31, 12, 94, 96, 97, 77';
  const [rnString, setRnString] = useState<string>(defaultRns);
  const [days, setDays] = useState<number>(12);

  const parsedRns = useMemo(() => {
    return rnString
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x !== '')
      .map((x) => parseInt(x, 10))
      .filter((x) => !isNaN(x));
  }, [rnString]);

  const { trace, maxDailyCost, totalCost } = useMemo(() => {
    const traceData = [];
    let rnPointer = 0;
    
    const getNextRN = (): { val: number; isGenerated: boolean } => {
      if (rnPointer < parsedRns.length) {
        return { val: parsedRns[rnPointer++], isGenerated: false };
      }
      const seed = rnPointer + 100 * days;
      const val = (seed * 1103515245 + 12345) % 2147483648;
      rnPointer++;
      return { val: Math.floor((val / 2147483648) * 100), isGenerated: true };
    };

    let total = 0;
    let maxDaily = 0;

    for (let d = 1; d <= days; d++) {
      const occurrenceRN = getNextRN();
      const hasAccident = occurrenceRN.val < 30;
      
      let countRN = { val: 0, isGenerated: false };
      let numAccidents = 0;
      const accidentDetails: { id: number; rnCost: number; cost: number; isGenerated: boolean }[] = [];
      let dayCost = 0;

      if (hasAccident) {
        countRN = getNextRN();
        const crn = countRN.val;
        if (crn <= 4) numAccidents = 2;
        else if (crn <= 19) numAccidents = 3;
        else if (crn <= 59) numAccidents = 4;
        else if (crn <= 84) numAccidents = 5;
        else numAccidents = 6;

        for (let a = 1; a <= numAccidents; a++) {
          const costRN = getNextRN();
          const crnVal = costRN.val;
          const cost = crnVal <= 29 ? 50 : crnVal <= 59 ? 100 : crnVal <= 84 ? 150 : 200;

          dayCost += cost;
          accidentDetails.push({
            id: a,
            rnCost: crnVal,
            cost,
            isGenerated: costRN.isGenerated
          });
        }
      }

      total += dayCost;
      if (dayCost > maxDaily) {
        maxDaily = dayCost;
      }

      traceData.push({
        day: d,
        occurrenceRN: occurrenceRN.val,
        isOccurGenerated: occurrenceRN.isGenerated,
        hasAccident,
        countRN: hasAccident ? countRN.val : null,
        isCountGenerated: hasAccident ? countRN.isGenerated : false,
        numAccidents,
        accidentDetails,
        dayCost
      });
    }

    return {
      trace: traceData,
      maxDailyCost: maxDaily,
      totalCost: total
    };
  }, [parsedRns, days]);

  const handleRandomize = () => {
    const arr = Array.from({ length: 40 }, () => Math.floor(Math.random() * 100));
    setRnString(arr.join(', '));
  };

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <div>
          <h4 className="text-sm font-black text-aast-navy">Accident Risk Simulator</h4>
          <p className="text-[10px] text-slate-500">Models daily accident occurrence (30%) & random repair costs</p>
        </div>
        <button
          onClick={() => setRnString(defaultRns)}
          className="text-[10px] px-2 py-1 border border-aast-gold text-aast-gold-dark hover:bg-aast-gold-soft rounded font-bold transition"
        >
          Load Slide Sequence
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[10px] font-bold text-slate-500">Days to Simulate</label>
          <input
            type="number"
            min={1}
            max={50}
            value={days}
            onChange={(e) => setDays(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleRandomize}
            className="w-full px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 font-bold flex items-center justify-center gap-1 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Randomize
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500">
          Random Numbers (00-99, comma separated, consumed in order)
        </label>
        <input
          type="text"
          value={rnString}
          onChange={(e) => setRnString(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none font-mono"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 border border-slate-100 rounded-lg bg-slate-50 text-center">
          <span className="text-[9px] font-black text-slate-400 uppercase block">Total Cost</span>
          <strong className="text-sm text-slate-800">{totalCost} L.E</strong>
        </div>
        <div className="p-2 border border-slate-100 rounded-lg bg-slate-50 text-center">
          <span className="text-[9px] font-black text-slate-400 uppercase block">Avg Daily Cost</span>
          <strong className="text-sm text-slate-800">{(totalCost / days).toFixed(2)} L.E</strong>
        </div>
        <div className="p-2 border border-aast-gold/25 rounded-lg bg-aast-gold-soft text-center">
          <span className="text-[9px] font-black text-aast-gold-dark uppercase block">Min Fund (Max Daily Cost)</span>
          <strong className="text-sm text-aast-navy">{maxDailyCost} L.E</strong>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-150 rounded-lg max-h-72 custom-scrollbar">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
            <tr>
              <th className="p-2 text-left w-12">Day</th>
              <th className="p-2 text-left">RN₁ (Occur)</th>
              <th className="p-2 text-left">Accident?</th>
              <th className="p-2 text-left">RN₂ (Count)</th>
              <th className="p-2 text-left">No. of Acc</th>
              <th className="p-2 text-left">Accident Cost Breakdown (RN: Cost)</th>
              <th className="p-2 text-right">Daily Cost</th>
            </tr>
          </thead>
          <tbody>
            {trace.map((r) => (
              <tr key={r.day} className={`border-t hover:bg-slate-50 transition-colors ${
                r.hasAccident ? 'bg-rose-50/20' : ''
              }`}>
                <td className="p-2 font-bold text-slate-400">{r.day}</td>
                <td className="p-2 font-mono">
                  {r.occurrenceRN} 
                  {r.isOccurGenerated && <span className="text-[8px] text-slate-400 font-bold block">(Generated)</span>}
                </td>
                <td className="p-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    r.hasAccident ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {r.hasAccident ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-2 font-mono text-slate-500">
                  {r.hasAccident ? (
                    <>
                      {r.countRN}
                      {r.isCountGenerated && <span className="text-[8px] text-slate-400 font-bold block">(Generated)</span>}
                    </>
                  ) : '-'}
                </td>
                <td className="p-2 font-bold">{r.hasAccident ? r.numAccidents : '-'}</td>
                <td className="p-2">
                  {r.hasAccident ? (
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {r.accidentDetails.map((acc) => (
                        <span key={acc.id} className="text-[10px] px-1.5 py-0.5 bg-white border rounded font-mono shadow-sm">
                          Acc #{acc.id} (RN:{acc.rnCost}) → <strong className="text-slate-800">{acc.cost} LE</strong>
                          {acc.isGenerated && <span className="text-[7px] text-slate-400"> (G)</span>}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No accident</span>
                  )}
                </td>
                <td className="p-2 text-right font-mono font-bold text-slate-800">
                  {r.dayCost > 0 ? `${r.dayCost} LE` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- FOOTBALL ROSTER PLAYGROUND ---
export const FootballRosterPlayground: React.FC = () => {
  const defaultRns = '044, 392, 898, 615, 986, 959, 558, 353, 577, 866, 305, 813, 024, 189, 878, 023, 285, 442, 862, 848, 060, 131, 963, 874, 805, 105, 452';
  const [rnString, setRnString] = useState<string>(defaultRns);
  const [initialSquadSize, setInitialSquadSize] = useState<number>(6);
  const [gamesCount, setGamesCount] = useState<number>(10);

  const parsedRns = useMemo(() => {
    return rnString
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x !== '')
      .map((x) => parseInt(x, 10))
      .filter((x) => !isNaN(x));
  }, [rnString]);

  const { trace, avgAvailable, totalMajor, totalMinor } = useMemo(() => {
    const traceData = [];
    let rnPointer = 0;

    const getNextRN = (): { val: number; isGenerated: boolean } => {
      if (rnPointer < parsedRns.length) {
        return { val: parsedRns[rnPointer++], isGenerated: false };
      }
      const seed = rnPointer + 1000 * gamesCount + initialSquadSize;
      const val = (seed * 1103515245 + 12345) % 2147483648;
      rnPointer++;
      return { val: Math.floor((val / 2147483648) * 1000), isGenerated: true };
    };

    let activeSquadSize = initialSquadSize;
    let countMajor = 0;
    let countMinor = 0;

    const minorInjuriesPerGame: Record<number, number> = {};

    for (let g = 1; g <= gamesCount; g++) {
      const prevMinor = minorInjuriesPerGame[g - 1] || 0;
      const availableCount = Math.max(0, activeSquadSize - prevMinor);

      const majorRN = getNextRN();
      const hasMajor = majorRN.val < 50 && availableCount > 0;
      
      const minorRN = getNextRN();
      let minorCount = 0;
      
      if (availableCount > 0) {
        const remainingAfterMajor = availableCount - (hasMajor ? 1 : 0);
        if (remainingAfterMajor > 0) {
          const mrn = minorRN.val;
          if (mrn <= 199) minorCount = 0;
          else if (mrn <= 699) minorCount = 1;
          else if (mrn <= 919) minorCount = 2;
          else if (mrn <= 969) minorCount = 3;
          else if (mrn <= 994) minorCount = 4;
          else minorCount = 5;
          
          minorCount = Math.min(minorCount, remainingAfterMajor);
        }
      }

      minorInjuriesPerGame[g] = minorCount;
      if (hasMajor) countMajor++;
      countMinor += minorCount;

      const stockLeft = Math.max(0, availableCount - (hasMajor ? 1 : 0) - minorCount);

      traceData.push({
        game: g,
        available: availableCount,
        majorRN: majorRN.val,
        isMajorGenerated: majorRN.isGenerated,
        hasMajor,
        minorRN: minorRN.val,
        isMinorGenerated: minorRN.isGenerated,
        minorCount,
        stockLeft,
        squadSize: activeSquadSize
      });

      if (hasMajor) {
        activeSquadSize = Math.max(0, activeSquadSize - 1);
      }
    }

    const sumAvailable = traceData.reduce((s, r) => s + r.available, 0);

    return {
      trace: traceData,
      avgAvailable: gamesCount > 0 ? sumAvailable / gamesCount : 0,
      totalMajor: countMajor,
      totalMinor: countMinor
    };
  }, [parsedRns, initialSquadSize, gamesCount]);

  const handleRandomize = () => {
    const arr = Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000));
    setRnString(arr.map(x => String(x).padStart(3, '0')).join(', '));
  };

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <div>
          <h4 className="text-sm font-black text-aast-navy">Football Squad Roster Simulator</h4>
          <p className="text-[10px] text-slate-500">Models permanent major injuries (5%) and temporary minor injuries</p>
        </div>
        <button
          onClick={() => setRnString(defaultRns)}
          className="text-[10px] px-2 py-1 border border-aast-gold text-aast-gold-dark hover:bg-aast-gold-soft rounded font-bold transition"
        >
          Load Slide Sequence
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-2.5">
        <div>
          <label className="text-[10px] font-bold text-slate-500">Initial Squad Size</label>
          <input
            type="number"
            min={1}
            max={20}
            value={initialSquadSize}
            onChange={(e) => setInitialSquadSize(Math.max(1, Number(e.target.value) || 1))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Games to Simulate</label>
          <input
            type="number"
            min={1}
            max={30}
            value={gamesCount}
            onChange={(e) => setGamesCount(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
            className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleRandomize}
            className="w-full px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-700 font-bold flex items-center justify-center gap-1 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Randomize
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 font-mono">
          3-Digit Random Numbers (000-999, consumed in pairs: major check then minor check)
        </label>
        <input
          type="text"
          value={rnString}
          onChange={(e) => setRnString(e.target.value)}
          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none font-mono"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 border border-slate-100 rounded-lg bg-slate-50 text-center">
          <span className="text-[9px] font-black text-slate-400 uppercase block">Avg Active Players</span>
          <strong className="text-sm text-slate-800">{avgAvailable.toFixed(2)}</strong>
        </div>
        <div className="p-2 border border-slate-100 rounded-lg bg-slate-50 text-center">
          <span className="text-[9px] font-black text-slate-400 uppercase block">Total Major Injuries</span>
          <strong className="text-sm text-rose-600">{totalMajor} <span className="text-[9px] text-slate-400 font-normal">(Out)</span></strong>
        </div>
        <div className="p-2 border border-slate-100 rounded-lg bg-slate-50 text-center">
          <span className="text-[9px] font-black text-slate-400 uppercase block">Total Minor Injuries</span>
          <strong className="text-sm text-amber-600">{totalMinor} <span className="text-[9px] text-slate-400 font-normal">(Miss 1 Game)</span></strong>
        </div>
      </div>

      <div className="p-3 border border-slate-150 rounded-lg space-y-2">
        <p className="text-[10px] font-bold text-aast-navy uppercase">Roster Status Timeline</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {trace.map((r) => {
            const injuredCount = r.squadSize - r.available;
            const majorCount = initialSquadSize - r.squadSize;
            const minorCount = injuredCount;
            const healthyCount = r.available;
            return (
              <div key={r.game} className="border border-slate-200 rounded p-1.5 bg-slate-50 flex flex-col items-center min-w-16">
                <span className="text-[9px] font-bold text-slate-500">Game {r.game}</span>
                <span className="text-xs font-black text-slate-800 mt-1">{healthyCount} / {r.squadSize}</span>
                <div className="flex gap-0.5 mt-1.5">
                  {Array.from({ length: healthyCount }).map((_, i) => (
                    <span key={`h-${i}`} className="w-1.5 h-3 bg-emerald-500 rounded-sm" title="Healthy" />
                  ))}
                  {Array.from({ length: minorCount }).map((_, i) => (
                    <span key={`m-${i}`} className="w-1.5 h-3 bg-amber-500 rounded-sm" title="Minor Injury" />
                  ))}
                  {Array.from({ length: majorCount }).map((_, i) => (
                    <span key={`mj-${i}`} className="w-1.5 h-3 bg-rose-500 rounded-sm" title="Major Injury" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-150 rounded-lg max-h-72 custom-scrollbar">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
            <tr>
              <th className="p-2 text-left w-12">Game #</th>
              <th className="p-2 text-left">No. of Players (A_g)</th>
              <th className="p-2 text-left">RN Major</th>
              <th className="p-2 text-left">Major Injury?</th>
              <th className="p-2 text-left">RN Minor</th>
              <th className="p-2 text-left">Minor Count</th>
              <th className="p-2 text-right">Roster Stock Left (STOCK_g)</th>
            </tr>
          </thead>
          <tbody>
            {trace.map((r) => (
              <tr key={r.game} className={`border-t hover:bg-slate-50 transition-colors ${
                r.hasMajor ? 'bg-rose-50/20' : r.minorCount > 0 ? 'bg-amber-50/20' : ''
              }`}>
                <td className="p-2 font-bold text-slate-400">{r.game}</td>
                <td className="p-2 font-bold text-slate-800">{r.available}</td>
                <td className="p-2 font-mono text-slate-500">
                  {r.majorRN.toString().padStart(3, '0')}
                  {r.isMajorGenerated && <span className="text-[8px] text-slate-400 font-bold block">(Generated)</span>}
                </td>
                <td className="p-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    r.hasMajor ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {r.hasMajor ? 'YES' : 'NO'}
                  </span>
                </td>
                <td className="p-2 font-mono text-slate-500">
                  {r.minorRN.toString().padStart(3, '0')}
                  {r.isMinorGenerated && <span className="text-[8px] text-slate-400 font-bold block">(Generated)</span>}
                </td>
                <td className="p-2 font-bold">{r.minorCount}</td>
                <td className="p-2 text-right font-mono font-bold text-slate-800">
                  {r.stockLeft}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- ACCIDENT & FOOTBALL PLAYGROUND CONTAINER ---
export const AccidentFootballPlayground: React.FC = () => {
  const [subTab, setSubTab] = useState<'accident' | 'football'>('accident');
  
  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 rounded-lg">
        <button
          onClick={() => setSubTab('accident')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition ${
            subTab === 'accident'
              ? 'bg-white text-aast-navy shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Accident Risk Model (12 Days)
        </button>
        <button
          onClick={() => setSubTab('football')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition ${
            subTab === 'football'
              ? 'bg-white text-aast-navy shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Football Roster Model (10 Games)
        </button>
      </div>

      <div className="transition-all duration-350">
        {subTab === 'accident' ? <AccidentRiskPlayground /> : <FootballRosterPlayground />}
      </div>
    </div>
  );
};
