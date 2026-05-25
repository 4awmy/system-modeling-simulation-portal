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
  const [dt, setDt] = useState<number>(1);
  const departure = arrival + service;
  const totalTime = Math.max(departure + 2, 14);

  // Periodic scan: which ticks fire
  const periodicTicks: number[] = [];
  for (let t = dt; t <= totalTime; t += dt) periodicTicks.push(parseFloat(t.toFixed(2)));

  // How many periodic ticks pass before each event?
  const arrivalScan = periodicTicks.find((t) => t >= arrival) ?? arrival;
  const departureScan = periodicTicks.find((t) => t >= departure) ?? departure;
  const scanDelay = parseFloat(((arrivalScan - arrival) + (departureScan - departure)).toFixed(3));

  return (
    <div className={`${cardClass} space-y-4`}>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black text-aast-navy">⏱ Time-Driven vs Event-Driven Clock</h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-aast-navy text-aast-gold font-bold">Interactive Timeline</span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        {[{label:'Arrival Time',val:arrival,set:setArrival,min:0},{label:'Service Time',val:service,set:setService,min:1},{label:'Scan Period Δt',val:dt,set:setDt,min:0.5}].map((f) => (
          <div key={f.label}>
            <label className="text-[10px] font-bold text-slate-500">{f.label}</label>
            <input type="number" step={f.label.includes('Δt') ? 0.5 : 1} min={f.min} value={f.val}
              onChange={(e) => f.set(Math.max(f.min, Number(e.target.value) || f.min))}
              className="w-full mt-0.5 px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none" />
          </div>
        ))}
      </div>

      {/* Visual timeline */}
      <div className="space-y-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
        {/* Event-Driven row */}
        <div>
          <p className="text-[10px] font-black uppercase text-sky-700 mb-1">Event-Driven Clock (jumps exactly to event)</p>
          <div className="relative h-8 bg-sky-50 border border-sky-200 rounded-lg overflow-hidden">
            <div className="absolute inset-y-0 left-0" style={{width: `${(arrival/totalTime)*100}%`, background:'linear-gradient(90deg,#bfdbfe,#93c5fd)'}} />
            {/* Arrival marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-sky-600" style={{left:`${(arrival/totalTime)*100}%`}}>
              <span className="absolute -top-0.5 left-1 text-[8px] font-bold text-sky-700 whitespace-nowrap">A@{arrival}</span>
            </div>
            {/* Departure marker */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" style={{left:`${(departure/totalTime)*100}%`}}>
              <span className="absolute top-2 left-1 text-[8px] font-bold text-red-600 whitespace-nowrap">D@{departure}</span>
            </div>
            {/* Service bar */}
            <div className="absolute top-1.5 bottom-1.5 rounded bg-sky-400 opacity-60"
              style={{left:`${(arrival/totalTime)*100}%`, width:`${(service/totalTime)*100}%`}} />
          </div>
          <p className="text-[10px] text-sky-600 mt-1 font-semibold">✓ Clock jumps: 0 → {arrival} → {departure}. Zero wasted computation.</p>
        </div>

        {/* Periodic scan row */}
        <div>
          <p className="text-[10px] font-black uppercase text-orange-700 mb-1">Periodic Scan (checks every Δt = {dt})</p>
          <div className="relative h-8 bg-orange-50 border border-orange-200 rounded-lg overflow-hidden">
            {periodicTicks.map((t) => (
              <div key={t} className="absolute top-0 bottom-0 w-px bg-orange-300" style={{left:`${(t/totalTime)*100}%`}} />
            ))}
            <div className="absolute top-0 bottom-0 w-0.5 bg-sky-600" style={{left:`${(arrival/totalTime)*100}%`}} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-red-500" style={{left:`${(departure/totalTime)*100}%`}} />
            {/* Scan detection markers */}
            <div className="absolute top-1 bottom-1 w-2 h-2 rounded-full bg-orange-500" style={{left:`${(arrivalScan/totalTime)*100}%`}} />
            <div className="absolute top-1 bottom-1 w-2 h-2 rounded-full bg-red-500" style={{left:`${(departureScan/totalTime)*100}%`}} />
          </div>
          <p className="text-[10px] text-orange-600 mt-1 font-semibold">⚠ Arrival detected at scan t={arrivalScan} (delay: {(arrivalScan-arrival).toFixed(2)}), Depart detected at t={departureScan} (delay: {(departureScan-departure).toFixed(2)}). Total error: {scanDelay}.</p>
        </div>
      </div>

      {/* Summary table */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200">
          <p className="font-black text-sky-700">Event-Driven</p>
          <p className="text-sky-600 text-[10px] mt-0.5">FEL = &#123;A@{arrival}, D@{departure}&#125;</p>
          <p className="text-sky-600 text-[10px]">Exact timing. No overhead per tick.</p>
        </div>
        <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
          <p className="font-black text-orange-700">Periodic Scan</p>
          <p className="text-orange-600 text-[10px] mt-0.5">{periodicTicks.length} ticks to scan for {2} events</p>
          <p className="text-orange-600 text-[10px]">Accumulated timing error: {scanDelay}</p>
        </div>
      </div>
    </div>
  );
};

const QueueSimulatorTrace: React.FC = () => {
  const [customers, setCustomers] = useState<number>(8);
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

  const maxTime = rows.at(-1)?.depart ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black text-aast-navy">🏪 Single-Server Queue (FIFO)</h4>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-500">Customers:</label>
          <input type="number" min={2} max={15} value={customers}
            onChange={(e) => setCustomers(Math.min(15, Math.max(2, Number(e.target.value) || 2)))}
            className="w-14 px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none" />
        </div>
      </div>

      {/* Gantt chart */}
      <div className="bg-slate-900 rounded-xl p-3 space-y-1.5 overflow-x-auto">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">Gantt Timeline (time →)</p>
        {rows.map((r) => {
          const waitPct = (r.wait / maxTime) * 100;
          const servPct = ((r.depart - r.start) / maxTime) * 100;
          const arrPct = (r.arrival / maxTime) * 100;
          const hasWait = r.wait > 0;
          return (
            <div key={r.id} className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 font-mono w-4 shrink-0">C{r.id}</span>
              <div className="relative flex-1 h-4 bg-slate-800 rounded">
                {/* Wait bar */}
                {hasWait && (
                  <div className="absolute top-0 bottom-0 rounded-l bg-rose-500/70"
                    style={{left:`${arrPct}%`, width:`${waitPct}%`}} />
                )}
                {/* Service bar */}
                <div className="absolute top-0 bottom-0 rounded bg-sky-500"
                  style={{left:`${(r.start/maxTime)*100}%`, width:`${servPct}%`}} />
              </div>
              <span className="text-[9px] text-slate-400 font-mono w-6 text-right shrink-0">{r.depart}</span>
            </div>
          );
        })}
        <div className="flex gap-3 mt-2">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-sky-500" /><span className="text-[9px] text-slate-400">Service</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-rose-500/70" /><span className="text-[9px] text-slate-400">Waiting</span></div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
          <p className="text-xs text-sky-600 font-semibold">Avg Waiting Time</p>
          <p className="text-xl font-black text-sky-800">{metrics.avgWait.toFixed(2)}</p>
          <p className="text-[10px] text-sky-500">time units</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <p className="text-xs text-emerald-600 font-semibold">Server Utilization</p>
          <p className="text-xl font-black text-emerald-800">{(metrics.util * 100).toFixed(1)}%</p>
          <div className="mt-1 h-1.5 bg-emerald-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{width:`${(metrics.util*100).toFixed(1)}%`}} />
          </div>
        </div>
      </div>

      {/* Trace table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b">
            <tr>
              {['C#','Arrival','Start','Depart','Wait','Status'].map(h => (
                <th key={h} className="p-2 text-left font-bold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={`border-t transition-colors ${r.wait > 0 ? 'bg-rose-50/40' : 'hover:bg-slate-50'}`}>
                <td className="p-2 font-bold text-slate-400 font-mono">{r.id}</td>
                <td className="p-2 font-mono">{r.arrival}</td>
                <td className="p-2 font-mono">{r.start}</td>
                <td className="p-2 font-mono">{r.depart}</td>
                <td className={`p-2 font-mono font-bold ${r.wait > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{r.wait}</td>
                <td className="p-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    r.wait > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>{r.wait > 0 ? 'Waited' : 'Served'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const QueueSimulatorDemo: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'standard' | 'event_driven'>('standard');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
      <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 rounded-lg">
        <button
          onClick={() => setActiveSubTab('standard')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition ${
            activeSubTab === 'standard'
              ? 'bg-white text-aast-navy shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          FIFO Queue Trace Table
        </button>
        <button
          onClick={() => setActiveSubTab('event_driven')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition ${
            activeSubTab === 'event_driven'
              ? 'bg-white text-aast-navy shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Event-Driven Simulator (M/M/1)
        </button>
      </div>

      <div className="transition-all duration-300">
        {activeSubTab === 'standard' && <QueueSimulatorTrace />}
        {activeSubTab === 'event_driven' && <EventDrivenQueueDemo />}
      </div>
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
  // Simulate machine states: working, broken, being-repaired
  const machineStates = useMemo(() => {
    const states: ('working'|'broken'|'repairing')[] = [];
    const brokenCount = Math.round(machines * 0.25);
    const repairingCount = repairmen;
    for (let i = 0; i < machines; i++) {
      if (i < repairingCount && i < brokenCount) states.push('repairing');
      else if (i < brokenCount) states.push('broken');
      else states.push('working');
    }
    return states;
  }, [machines, repairmen]);

  return (
    <div className={`${cardClass} space-y-4`}>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black text-aast-navy">🔧 Repairman System Simulator</h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">Machine Grid</span>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          <button onClick={() => setRepairmen(1)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
              repairmen === 1 ? 'bg-aast-navy text-white border-aast-navy' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}>1 Repairman</button>
          <button onClick={() => setRepairmen(2)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
              repairmen === 2 ? 'bg-aast-navy text-white border-aast-navy' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}>2 Repairmen</button>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] font-bold text-slate-500">Machines:</label>
          <input type="number" min={1} max={20} value={machines}
            onChange={(e) => setMachines(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            className="w-14 px-2 py-1 text-xs border border-slate-200 rounded focus:border-aast-gold outline-none" />
        </div>
      </div>

      {/* Machine grid visual */}
      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-3">Machine Floor — {machines} Machines</p>
        <div className="flex flex-wrap gap-2">
          {machineStates.map((state, i) => (
            <div key={i} className={`relative w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
              state === 'working'   ? 'bg-emerald-500/20 border-emerald-400' :
              state === 'repairing' ? 'bg-amber-500/20 border-amber-400 animate-pulse' :
                                     'bg-rose-500/20 border-rose-400'
            }`}>
              <span className="text-base">{state === 'working' ? '⚙️' : state === 'repairing' ? '🔧' : '💥'}</span>
              <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold text-slate-400">{i+1}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3">
          {[{icon:'⚙️',label:'Working',col:'text-emerald-400'},{icon:'🔧',label:'Being Repaired',col:'text-amber-400'},{icon:'💥',label:'Broken/Waiting',col:'text-rose-400'}].map(l=>(
            <div key={l.label} className="flex items-center gap-1">
              <span className="text-xs">{l.icon}</span>
              <span className={`text-[9px] font-bold ${l.col}`}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
          <p className="text-[10px] font-bold text-rose-600">Queue Pressure</p>
          <p className="text-2xl font-black text-rose-800">{expectedQueue}</p>
          <p className="text-[10px] text-rose-500">machines waiting for repair</p>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-[10px] font-bold text-amber-600">Repairman Utilization</p>
          <p className="text-2xl font-black text-amber-800">{(utilization * 100).toFixed(1)}%</p>
          <div className="mt-1 h-1.5 bg-amber-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{width:`${(utilization*100)}%`}} />
          </div>
        </div>
      </div>
      <div className={`p-3 rounded-lg text-xs font-bold ${
        repairmen === 2 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}>
        {repairmen === 2
          ? `✅ With 2 repairmen: queue pressure drops by ~50%. Queue = ${expectedQueue} machines waiting.`
          : `⚠️ With 1 repairman: ${expectedQueue} machine(s) waiting. Consider adding a second repairman.`}
      </div>
    </div>
  );
};

export const AssemblyLineDemo: React.FC = () => {
  const [s1, setS1] = useState<number>(3);
  const [s2, setS2] = useState<number>(5);
  const [items, setItems] = useState<number>(5);
  const bottleneck = s2 > s1 ? 2 : s1 > s2 ? 1 : 0;
  const throughput = 60 / Math.max(s1, s2);
  const maxBar = Math.max(s1, s2, 1);

  // Simulate blocking trace
  const trace = useMemo(() => {
    const rows: {item:number; b1Start:number; b1End:number; b2Start:number; b2End:number; blocked:number}[] = [];
    let b1Free = 0; let b2Free = 0;
    for (let i = 1; i <= items; i++) {
      const b1Start = b1Free;
      const b1End = b1Start + s1;
      const b2Start = Math.max(b1End, b2Free);
      const b2End = b2Start + s2;
      const blocked = Math.max(0, b2Free - b1End);
      rows.push({item:i, b1Start, b1End, b2Start, b2End, blocked});
      b1Free = b2Start; // Bob blocked until Ray is free
      b2Free = b2End;
    }
    return rows;
  }, [s1, s2, items]);

  const maxTime = trace.at(-1)?.b2End ?? 1;

  return (
    <div className={`${cardClass} space-y-4`}>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black text-aast-navy">🏭 Assembly Line Simulation (Bob & Ray)</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
          bottleneck === 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-rose-100 text-rose-700 border-rose-200'
        }`}>{bottleneck === 0 ? 'Balanced' : `Station ${bottleneck} is Bottleneck`}</span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        {[{l:'Bob (S1) time',v:s1,set:setS1},{l:'Ray (S2) time',v:s2,set:setS2},{l:'Items to produce',v:items,set:setItems,max:10}].map(f=>(
          <div key={f.l}>
            <label className="text-[10px] font-bold text-slate-500">{f.l}</label>
            <input type="number" min={1} max={f.max||20} value={f.v}
              onChange={e=>f.set(Math.min(f.max||20,Math.max(1,Number(e.target.value)||1)))}
              className="w-full mt-0.5 px-2 py-1 text-xs border rounded focus:border-aast-gold outline-none" />
          </div>
        ))}
      </div>

      {/* Station rate comparison */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
        <p className="text-[10px] font-black uppercase text-slate-500">Station Rate Comparison</p>
        <div className="space-y-2">
          {[{label:'Bob — Station 1',val:s1,col:'bg-sky-500'},{label:'Ray — Station 2',val:s2,col:'bg-violet-500'}].map(st=>(
            <div key={st.label} className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-600 w-28 shrink-0">{st.label}</span>
              <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${st.col} transition-all duration-500`}
                  style={{width:`${(st.val/maxBar)*100}%`}} />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-700 w-8">{st.val}min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt trace */}
      <div className="bg-slate-900 rounded-xl p-3 overflow-x-auto">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">Production Gantt (Bob=blue, Ray=purple, Blocked=red)</p>
        {trace.map(r => (
          <div key={r.item} className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] text-slate-400 font-mono w-6 shrink-0">I{r.item}</span>
            <div className="relative flex-1 h-3.5 bg-slate-800 rounded">
              {/* Bob bar */}
              <div className="absolute top-0 bottom-0 rounded bg-sky-500"
                style={{left:`${(r.b1Start/maxTime)*100}%`, width:`${(s1/maxTime)*100}%`}} />
              {/* Blocked */}
              {r.blocked > 0 && <div className="absolute top-0 bottom-0 rounded bg-rose-500/70"
                style={{left:`${(r.b1End/maxTime)*100}%`, width:`${(r.blocked/maxTime)*100}%`}} />}
              {/* Ray bar */}
              <div className="absolute top-0 bottom-0 rounded bg-violet-500"
                style={{left:`${(r.b2Start/maxTime)*100}%`, width:`${(s2/maxTime)*100}%`}} />
            </div>
            <span className="text-[9px] text-slate-400 font-mono w-5">{r.b2End}</span>
          </div>
        ))}
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-sky-50 border border-sky-200">
          <p className="text-[10px] text-sky-600">Throughput Bound</p>
          <p className="font-black text-sky-800">{throughput.toFixed(2)}</p>
          <p className="text-[9px] text-sky-400">units/hour</p>
        </div>
        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
          <p className="text-[10px] text-rose-600">Total Bob Blocked</p>
          <p className="font-black text-rose-800">{trace.reduce((s,r)=>s+r.blocked,0)}</p>
          <p className="text-[9px] text-rose-400">time units</p>
        </div>
        <div className="p-2 rounded-lg bg-violet-50 border border-violet-200">
          <p className="text-[10px] text-violet-600">Total Makespan</p>
          <p className="font-black text-violet-800">{maxTime}</p>
          <p className="text-[9px] text-violet-400">time units</p>
        </div>
      </div>
    </div>
  );
};

export const ValidationDemo: React.FC = () => {
  const [observed, setObserved] = useState<string>('12,18,20,10');
  const [expected, setExpected] = useState<string>('15,15,15,15');
  const [alpha, setAlpha] = useState<number>(0.05);

  const { chi, rows, df } = useMemo(() => {
    const o = observed.split(',').map((x) => Number(x.trim()) || 0);
    const e = expected.split(',').map((x) => Number(x.trim()) || 1);
    const n = Math.min(o.length, e.length);
    let stat = 0;
    const dataRows: {label:string; obs:number; exp:number; contrib:number}[] = [];
    for (let i = 0; i < n; i++) {
      const contrib = ((o[i] - e[i]) ** 2) / Math.max(e[i], 1e-6);
      stat += contrib;
      dataRows.push({ label:`Class ${i+1}`, obs: o[i], exp: e[i], contrib });
    }
    return { chi: stat, rows: dataRows, df: n - 1 };
  }, [observed, expected]);

  // Approximate critical values (chi-square table subset)
  const criticalValues: Record<number, Record<number,number>> = {
    1: {0.05: 3.841, 0.01: 6.635},
    2: {0.05: 5.991, 0.01: 9.210},
    3: {0.05: 7.815, 0.01: 11.345},
    4: {0.05: 9.488, 0.01: 13.277},
    5: {0.05: 11.070, 0.01: 15.086},
  };
  const critVal = criticalValues[Math.min(df, 5)]?.[alpha] ?? 9.49;
  const rejected = chi > critVal;
  const maxContrib = Math.max(...rows.map(r => r.contrib), 0.01);

  return (
    <div className={`${cardClass} space-y-4`}>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-black text-aast-navy">📊 Chi-Square Goodness-of-Fit Test</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${
          rejected ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-emerald-100 text-emerald-700 border-emerald-300'
        }`}>{rejected ? '❌ H₀ Rejected' : '✅ H₀ Accepted'}</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-2">
        <div className="sm:col-span-1">
          <label className="text-[10px] font-bold text-slate-500">α (significance)</label>
          <select value={alpha} onChange={e=>setAlpha(Number(e.target.value))}
            className="w-full mt-0.5 px-2 py-1 text-xs border rounded focus:border-aast-gold outline-none">
            <option value={0.05}>0.05 (5%)</option>
            <option value={0.01}>0.01 (1%)</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Observed (comma-sep.)</label>
          <input value={observed} onChange={e=>setObserved(e.target.value)}
            className="w-full mt-0.5 px-2 py-1 text-xs border rounded focus:border-aast-gold outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Expected (comma-sep.)</label>
          <input value={expected} onChange={e=>setExpected(e.target.value)}
            className="w-full mt-0.5 px-2 py-1 text-xs border rounded focus:border-aast-gold outline-none" />
        </div>
      </div>

      {/* Bar chart of observed vs expected */}
      <div className="bg-slate-900 rounded-xl p-3">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-3">Observed vs Expected — Contribution to χ²</p>
        <div className="space-y-2">
          {rows.map(r => (
            <div key={r.label} className="space-y-0.5">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span className="font-bold">{r.label}</span>
                <span>χ² contrib: <strong className="text-amber-400">{r.contrib.toFixed(3)}</strong></span>
              </div>
              <div className="flex gap-1 h-3">
                {/* Observed */}
                <div className="h-full rounded bg-sky-500" style={{width:`${Math.min((r.obs/Math.max(...rows.map(x=>x.obs),1))*45,45)}%`}} />
                {/* Expected */}
                <div className="h-full rounded bg-violet-400 opacity-70" style={{width:`${Math.min((r.exp/Math.max(...rows.map(x=>x.exp),1))*45,45)}%`}} />
                {/* Contribution */}
                <div className="h-full rounded bg-amber-500" style={{width:`${(r.contrib/maxContrib)*10}%`, minWidth:'2px'}} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-3">
          {[{col:'bg-sky-500',l:'Observed'},{col:'bg-violet-400',l:'Expected'},{col:'bg-amber-500',l:'χ² Contribution'}].map(lx=>(
            <div key={lx.l} className="flex items-center gap-1"><div className={`w-2 h-2 rounded ${lx.col}`}/><span className="text-[9px] text-slate-400">{lx.l}</span></div>
          ))}
        </div>
      </div>

      {/* Decision */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-[10px] text-slate-500">χ² Statistic</p>
          <p className="font-black text-slate-800 text-lg">{chi.toFixed(3)}</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-[10px] text-slate-500">Critical Value (df={df})</p>
          <p className="font-black text-slate-800 text-lg">{critVal.toFixed(3)}</p>
        </div>
        <div className={`p-2 rounded-lg border font-bold ${
          rejected ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          <p className="text-[10px]">Decision</p>
          <p className="text-xs mt-0.5">{rejected ? 'Reject H₀' : 'Fail to Reject H₀'}</p>
          <p className="text-[9px] mt-0.5 opacity-70">{rejected ? 'Distributions differ' : 'Good fit'}</p>
        </div>
      </div>
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
export const MidSquarePlayground: React.FC<{ defaultSeed?: number }> = ({ defaultSeed = 2041 }) => {
  const [seed, setSeed] = useState<number>(defaultSeed);
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
  const [activeSubTab, setActiveSubTab] = useState<'mapping' | 'lcg' | 'midsquare' | 'traffic_light'>('mapping');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 p-1.5 rounded-lg">
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
        <button
          onClick={() => setActiveSubTab('traffic_light')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition ${
            activeSubTab === 'traffic_light'
              ? 'bg-white text-aast-navy shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Traffic Light Sim
        </button>
      </div>

      <div className="transition-all duration-300">
        {activeSubTab === 'mapping' && <RandomMappingDemo />}
        {activeSubTab === 'lcg' && <LCGPlayground />}
        {activeSubTab === 'midsquare' && <MidSquarePlayground />}
        {activeSubTab === 'traffic_light' && <TrafficLightDemo />}
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

// --- TRAFFIC LIGHT SIMULATION ---
export const TrafficLightDemo: React.FC = () => {
  const [trials, setTrials] = useState<number>(1000);
  const [pGreen, setPGreen] = useState<number>(0.40);
  const [pYellow, setPYellow] = useState<number>(0.10);
  const [pRed, setPRed] = useState<number>(0.50);
  const [activeLight, setActiveLight] = useState<'red' | 'green' | 'yellow'>('red');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const results = useMemo(() => {
    let greenCount = 0;
    let yellowCount = 0;
    let redCount = 0;
    
    // Simple LCG
    let state = 42;
    const get_rn = () => {
      state = (1664525 * state + 1013904223) % 4294967296;
      return state / 4294967296.0;
    };

    for (let i = 0; i < trials; i++) {
      const r = get_rn();
      if (r < pGreen) {
        greenCount++;
      } else if (r < pGreen + pYellow) {
        yellowCount++;
      } else {
        redCount++;
      }
    }

    const simGreen = greenCount / trials;
    const simYellow = yellowCount / trials;
    const simRed = redCount / trials;

    const errGreen = pGreen > 0 ? (Math.abs(pGreen - simGreen) / pGreen) * 100 : 0;
    const errYellow = pYellow > 0 ? (Math.abs(pYellow - simYellow) / pYellow) * 100 : 0;
    const errRed = pRed > 0 ? (Math.abs(pRed - simRed) / pRed) * 100 : 0;

    return {
      green: { count: greenCount, sim: simGreen, err: errGreen },
      yellow: { count: yellowCount, sim: simYellow, err: errYellow },
      red: { count: redCount, sim: simRed, err: errRed }
    };
  }, [trials, pGreen, pYellow, pRed]);

  // Run visual simulation loop
  const triggerSimulation = () => {
    setIsSimulating(true);
    let count = 0;
    const interval = setInterval(() => {
      const lights: ('red' | 'green' | 'yellow')[] = ['red', 'green', 'yellow'];
      setActiveLight(lights[Math.floor(Math.random() * 3)]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsSimulating(false);
        // Set final light according to final ratio
        const r = Math.random();
        if (r < pGreen) setActiveLight('green');
        else if (r < pGreen + pYellow) setActiveLight('yellow');
        else setActiveLight('red');
      }
    }, 150);
  };

  const cppCode = `#include <iostream>
#include <iomanip>
#include <cmath>
#include <cstdlib>

using namespace std;

int main() {
    int trials;
    cout << "Enter number of trials: ";
    if (!(cin >> trials)) return 1;

    double p_green = 0.40;
    double p_yellow = 0.10;
    double p_red = 0.50;

    int green = 0, yellow = 0, red = 0;
    
    // Seed random number generator
    srand(42);

    for (int i = 0; i < trials; i++) {
        double r = (double)rand() / RAND_MAX;
        if (r < p_green) {
            green++;
        } else if (r < p_green + p_yellow) {
            yellow++;
        } else {
            red++;
        }
    }

    double sim_green = (double)green / trials;
    double sim_yellow = (double)yellow / trials;
    double sim_red = (double)red / trials;

    double err_green = abs(p_green - sim_green) / p_green * 100;
    double err_yellow = abs(p_yellow - sim_yellow) / p_yellow * 100;
    double err_red = abs(p_red - sim_red) / p_red * 100;

    cout << "\\nTraffic Light Simulation Results (" << trials << " trials):" << endl;
    cout << "--------------------------------------------------------" << endl;
    cout << setw(8) << "Color" << " | " << setw(11) << "Theoretical" << " | " 
         << setw(8) << "Count" << " | " << setw(11) << "Simulated" << " | " 
         << setw(8) << "Error (%)" << endl;
    cout << "--------------------------------------------------------" << endl;
    cout << setw(8) << "Green" << " | " << setw(11) << p_green << " | " 
         << setw(8) << green << " | " << setw(11) << sim_green << " | " 
         << setw(8) << fixed << setprecision(2) << err_green << "%" << endl;
    cout << setw(8) << "Yellow" << " | " << setw(11) << p_yellow << " | " 
         << setw(8) << yellow << " | " << setw(11) << sim_yellow << " | " 
         << setw(8) << fixed << setprecision(2) << err_yellow << "%" << endl;
    cout << setw(8) << "Red" << " | " << setw(11) << p_red << " | " 
         << setw(8) << red << " | " << setw(11) << sim_red << " | " 
         << setw(8) << fixed << setprecision(2) << err_red << "%" << endl;
    cout << "--------------------------------------------------------" << endl;

    return 0;
}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <h4 className="text-sm font-black text-aast-navy">Traffic Light Probability Simulation</h4>
      <div className="grid sm:grid-cols-4 gap-4">
        {/* Visual Light */}
        <div className="flex flex-col items-center justify-center bg-slate-900 rounded-xl p-4 w-fit mx-auto border-4 border-slate-700 shadow-inner">
          <div className="space-y-3">
            <div className={`w-8 h-8 rounded-full shadow-md transition-all duration-300 ${activeLight === 'red' ? 'bg-red-500 shadow-red-500/80 ring-4 ring-red-500/25' : 'bg-red-950'}`} />
            <div className={`w-8 h-8 rounded-full shadow-md transition-all duration-300 ${activeLight === 'yellow' ? 'bg-yellow-500 shadow-yellow-500/80 ring-4 ring-yellow-500/25' : 'bg-yellow-950'}`} />
            <div className={`w-8 h-8 rounded-full shadow-md transition-all duration-300 ${activeLight === 'green' ? 'bg-emerald-500 shadow-emerald-500/80 ring-4 ring-emerald-500/25' : 'bg-emerald-950'}`} />
          </div>
          <button 
            disabled={isSimulating}
            onClick={triggerSimulation}
            className="mt-4 px-3 py-1.5 bg-aast-navy text-aast-gold text-[10px] font-bold rounded-lg border border-aast-gold/30 hover:bg-slate-800 transition"
          >
            {isSimulating ? 'Simulating...' : 'Trigger Light'}
          </button>
        </div>

        {/* Inputs */}
        <div className="sm:col-span-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500">P(Green)</label>
              <input type="number" step="0.05" min="0" max="1" value={pGreen} onChange={(e) => {
                const g = Number(e.target.value);
                setPGreen(g);
                setPRed(1 - g - pYellow);
              }} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500">P(Yellow)</label>
              <input type="number" step="0.05" min="0" max="1" value={pYellow} onChange={(e) => {
                const y = Number(e.target.value);
                setPYellow(y);
                setPRed(1 - pGreen - y);
              }} className="w-full px-2 py-1 border rounded" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500">P(Red)</label>
              <input type="number" disabled value={pRed.toFixed(2)} className="w-full px-2 py-1 border rounded bg-slate-50 text-slate-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500">Trials</label>
              <input type="number" min="10" max="50000" value={trials} onChange={(e) => setTrials(Number(e.target.value) || 10)} className="w-full px-2 py-1 border rounded" />
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-2">Light Color</th>
                  <th className="p-2">Theoretical P</th>
                  <th className="p-2">Observed Count</th>
                  <th className="p-2">Simulated P</th>
                  <th className="p-2 text-rose-600">Error (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-bold text-emerald-600">Green</td>
                  <td className="p-2 font-mono">{(pGreen * 100).toFixed(1)}%</td>
                  <td className="p-2">{results.green.count}</td>
                  <td className="p-2 font-mono">{(results.green.sim * 100).toFixed(2)}%</td>
                  <td className="p-2 text-rose-600 font-mono">{results.green.err.toFixed(2)}%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold text-amber-500">Yellow</td>
                  <td className="p-2 font-mono">{(pYellow * 100).toFixed(1)}%</td>
                  <td className="p-2">{results.yellow.count}</td>
                  <td className="p-2 font-mono">{(results.yellow.sim * 100).toFixed(2)}%</td>
                  <td className="p-2 text-rose-600 font-mono">{results.yellow.err.toFixed(2)}%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold text-rose-600">Red</td>
                  <td className="p-2 font-mono">{(pRed * 100).toFixed(1)}%</td>
                  <td className="p-2">{results.red.count}</td>
                  <td className="p-2 font-mono">{(results.red.sim * 100).toFixed(2)}%</td>
                  <td className="p-2 text-rose-600 font-mono">{results.red.err.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 border-t pt-3">
        <p className="text-[10px] font-black text-slate-500 uppercase font-mono">C++ Simulation Program Code</p>
        <pre className="text-[9px] bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-48 font-mono">
          {cppCode}
        </pre>
      </div>
    </div>
  );
};

// --- EVENT-DRIVEN M/M/1 QUEUE SIMULATION ---
export const EventDrivenQueueDemo: React.FC = () => {
  const [arrivalRate, setArrivalRate] = useState<number>(2.0);
  const [serviceRate, setServiceRate] = useState<number>(3.0);

  const trace = useMemo(() => {
    const traceData: {
      step: number;
      event: string;
      clock: number;
      sysState: number;
      lq: number;
      ls: number;
      fel: string;
    }[] = [];

    // Simple reproducible LCG seed
    let state = 42;
    const get_rn = () => {
      state = (1664525 * state + 1013904223) % 4294967296;
      return state / 4294967296.0;
    };

    const get_exp = (rate: number) => {
      let r = get_rn();
      while (r >= 1.0 || r <= 0.0) {
        r = get_rn();
      }
      return -Math.log(1.0 - r) / rate;
    };

    let clock = 0.0;
    let numInSystem = 0;
    let completions = 0;
    
    let nextArrival = get_exp(arrivalRate);
    let nextDeparture = Infinity;
    
    // Step 0
    traceData.push({
      step: 0,
      event: 'Start',
      clock: 0.0,
      sysState: 0,
      lq: 0,
      ls: 0,
      fel: `A@${nextArrival.toFixed(4)}`
    });

    let limit = 0;
    while (completions < 3 && limit < 15) {
      limit++;
      let eventName = '';
      if (nextArrival < nextDeparture) {
        clock = nextArrival;
        numInSystem++;
        const interArr = get_exp(arrivalRate);
        nextArrival = clock + interArr;

        if (numInSystem === 1) {
          const servTime = get_exp(serviceRate);
          nextDeparture = clock + servTime;
        }
        eventName = 'Arrival';
      } else {
        clock = nextDeparture;
        numInSystem--;
        completions++;

        if (numInSystem > 0) {
          const servTime = get_exp(serviceRate);
          nextDeparture = clock + servTime;
        } else {
          nextDeparture = Infinity;
        }
        eventName = 'Departure';
      }

      const lq = Math.max(0, numInSystem - 1);
      const ls = numInSystem > 0 ? 1 : 0;
      
      let felStr = '';
      if (nextArrival !== Infinity) {
        felStr += `A@${nextArrival.toFixed(4)}`;
      }
      if (nextDeparture !== Infinity) {
        if (felStr) felStr += ', ';
        felStr += `D@${nextDeparture.toFixed(4)}`;
      }

      traceData.push({
        step: limit,
        event: eventName,
        clock,
        sysState: numInSystem,
        lq,
        ls,
        fel: felStr
      });
    }

    return traceData;
  }, [arrivalRate, serviceRate]);

  const cppCode = `#include <iostream>
#include <iomanip>
#include <cmath>
#include <string>
#include <vector>

using namespace std;

unsigned long long lcg_state = 42;
double get_rn() {
    lcg_state = (1664525 * lcg_state + 1013904223) % 4294967296ULL;
    return (double)lcg_state / 4294967296.0;
}

double get_exp(double rate) {
    double r = get_rn();
    while (r >= 1.0 || r <= 0.0) {
        r = get_rn();
    }
    return -log(1.0 - r) / rate;
}

int main() {
    double X, Y;
    cout << "Enter arrival rate X (customers/hour): ";
    if (!(cin >> X)) return 1;
    cout << "Enter departure rate Y (customers/hour): ";
    if (!(cin >> Y)) return 1;

    double clock = 0.0;
    int num_in_system = 0;
    int completions = 0;

    double next_arrival = get_exp(X);
    double next_departure = 1e9; // infinity

    cout << "\\\nEvent-Driven M/M/1 Queue Simulation Trace Table (Stop after 3 completions)" << endl;
    cout << "--------------------------------------------------------------------------------" << endl;
    cout << setw(5) << "Step" << " | "
         << setw(10) << "Event" << " | "
         << setw(10) << "Clock (h)" << " | "
         << setw(10) << "Sys State" << " | "
         << setw(8) << "Q (LQ)" << " | "
         << setw(8) << "S (LS)" << " | "
         << "Future Event List (FEL)" << endl;
    cout << "--------------------------------------------------------------------------------" << endl;

    int step = 0;
    cout << setw(5) << step << " | " << setw(10) << "Start" << " | "
         << setw(10) << fixed << setprecision(4) << clock << " | "
         << setw(10) << num_in_system << " | " << setw(8) << 0 << " | " << setw(8) << 0 << " | "
         << "A@" << next_arrival << endl;

    while (completions < 3) {
        step++;
        string event_name;
        if (next_arrival < next_departure) {
            clock = next_arrival;
            num_in_system++;
            double inter_arr = get_exp(X);
            next_arrival = clock + inter_arr;

            if (num_in_system == 1) {
                double serv_time = get_exp(Y);
                next_departure = clock + serv_time;
            }
            event_name = "Arrival";
        } else {
            clock = next_departure;
            num_in_system--;
            completions++;

            if (num_in_system > 0) {
                double serv_time = get_exp(Y);
                next_departure = clock + serv_time;
            } else {
                next_departure = 1e9;
            }
            event_name = "Departure";
        }

        int lq = max(0, num_in_system - 1);
        int ls = num_in_system > 0 ? 1 : 0;

        cout << setw(5) << step << " | " << setw(10) << event_name << " | "
             << setw(10) << fixed << setprecision(4) << clock << " | "
             << setw(10) << num_in_system << " | " << setw(8) << lq << " | " << setw(8) << ls << " | ";

        if (next_arrival < 1e8) cout << "A@" << next_arrival;
        if (next_departure < 1e8) {
            if (next_arrival < 1e8) cout << ", ";
            cout << "D@" << next_departure;
        }
        cout << endl;
    }
    cout << "--------------------------------------------------------------------------------" << endl;
    return 0;
}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex justify-between items-center border-b pb-2">
        <h4 className="text-sm font-black text-aast-navy">Event-Driven M/M/1 Queue Simulator</h4>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
          Section C++ Replicator
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-[10px] font-bold text-slate-500">Arrival Rate X (per hour)</label>
          <input type="number" value={arrivalRate} onChange={(e) => setArrivalRate(Number(e.target.value) || 1)} className="w-full px-2 py-1 border rounded" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500">Departure Rate Y (per hour)</label>
          <input type="number" value={serviceRate} onChange={(e) => setServiceRate(Number(e.target.value) || 1)} className="w-full px-2 py-1 border rounded" />
        </div>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-2">Step</th>
              <th className="p-2">Event</th>
              <th className="p-2">Clock (h)</th>
              <th className="p-2">Sys State</th>
              <th className="p-2">Queue (LQ)</th>
              <th className="p-2">Server (LS)</th>
              <th className="p-2">FEL</th>
            </tr>
          </thead>
          <tbody>
            {trace.map((r) => (
              <tr key={r.step} className="border-b font-mono">
                <td className="p-2 font-bold text-slate-400">{r.step}</td>
                <td className="p-2 font-bold text-aast-navy">{r.event}</td>
                <td className="p-2">{r.clock.toFixed(4)}</td>
                <td className="p-2">{r.sysState}</td>
                <td className="p-2">{r.lq}</td>
                <td className="p-2">{r.ls}</td>
                <td className="p-2 text-slate-600">{r.fel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-1.5 border-t pt-3">
        <p className="text-[10px] font-black text-slate-500 uppercase font-mono">C++ Simulation Program Code</p>
        <pre className="text-[9px] bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto max-h-48 font-mono">
          {cppCode}
        </pre>
      </div>
    </div>
  );
};
