import React, { useMemo, useState } from 'react';
import { CheckCircle, Eye, HelpCircle, RefreshCw, XCircle } from 'lucide-react';
import type { Exercise } from '../types/simulation';

interface PracticeZoneProps {
  exercises: Exercise[];
  selectedExerciseId: string | null;
  setSelectedExerciseId: (id: string | null) => void;
}

const normalize = (val: string | number) => String(val).trim().toLowerCase();

export const PracticeZone: React.FC<PracticeZoneProps> = ({
  exercises,
  selectedExerciseId,
  setSelectedExerciseId,
}) => {
  const currentId = selectedExerciseId || exercises[0]?.id || '';
  const exercise = useMemo(() => exercises.find((x) => x.id === currentId) ?? exercises[0], [exercises, currentId]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState<boolean>(false);

  if (!exercise) {
    return <div className="text-sm text-slate-600">No practice data found.</div>;
  }

  const setCell = (rowIdx: number, key: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [`${rowIdx}_${key}`]: val }));
  };

  const expected = (rowIdx: number, key: string) => exercise.rows[rowIdx].values[key];
  const valueAt = (rowIdx: number, key: string) => answers[`${rowIdx}_${key}`] ?? '';

  const cellState = (rowIdx: number, key: string) => {
    if (reveal) return 'correct';
    const v = valueAt(rowIdx, key);
    if (v === '') return 'empty';
    return normalize(v) === normalize(expected(rowIdx, key)) ? 'correct' : 'wrong';
  };

  const solved = exercise.rows.every((_row, rowIdx) =>
    exercise.columns.every((c) => cellState(rowIdx, c.key) === 'correct')
  );

  return (
    <div className="grid gap-6 md:grid-cols-3 animate-fade-in">
      <aside className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
        <h3 className="text-xs uppercase tracking-wider font-black text-aast-navy">Practice Sets</h3>
        {exercises.map((ex) => (
          <button
            key={ex.id}
            onClick={() => {
              setSelectedExerciseId(ex.id);
              setReveal(false);
              setAnswers({});
              setShowHint(false);
            }}
            className={`w-full text-left p-2 text-xs rounded-lg border transition ${
              currentId === ex.id
                ? 'bg-aast-navy text-aast-gold border-aast-navy'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <p className="font-bold truncate">{ex.title}</p>
            <p className={`text-[10px] mt-0.5 ${currentId === ex.id ? 'text-aast-gold/80' : 'text-slate-500'}`}>{ex.type}</p>
          </button>
        ))}
      </aside>

      <main className="md:col-span-2 space-y-4">
        <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-aast-navy">{exercise.title}</h2>
              <p className="text-xs text-slate-600 mt-1">{exercise.description}</p>
            </div>
            {solved && (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 font-black uppercase flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Solved
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowHint((p) => !p)} className="px-3 py-1.5 text-xs rounded border border-slate-200 bg-slate-50 font-semibold flex items-center gap-1"><HelpCircle className="h-3 w-3" /> {showHint ? 'Hide Hint' : 'Show Hint'}</button>
            <button onClick={() => setReveal(true)} className="px-3 py-1.5 text-xs rounded bg-amber-500 text-white font-semibold flex items-center gap-1"><Eye className="h-3 w-3" /> Reveal</button>
            <button onClick={() => { setAnswers({}); setReveal(false); }} className="px-3 py-1.5 text-xs rounded border border-red-200 text-red-600 font-semibold flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Reset</button>
          </div>

          {showHint && (
            <div className="text-xs p-3 rounded border border-aast-gold/30 bg-aast-gold-soft text-aast-gold-dark">
              <strong>Hint:</strong> {exercise.hint}
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="p-2 text-left">Step</th>
                {exercise.columns.map((c) => (
                  <th key={c.key} className="p-2 text-left">{c.label}</th>
                ))}
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {exercise.rows.map((row, rowIdx) => {
                const rowGood = exercise.columns.every((c) => cellState(rowIdx, c.key) === 'correct');
                return (
                  <tr key={row.step} className="border-b">
                    <td className="p-2 font-bold text-slate-500">{row.step}</td>
                    {exercise.columns.map((c) => {
                      const state = cellState(rowIdx, c.key);
                      return (
                        <td key={c.key} className="p-2">
                          <input
                            value={reveal ? String(expected(rowIdx, c.key)) : valueAt(rowIdx, c.key)}
                            disabled={reveal}
                            onChange={(e) => setCell(rowIdx, c.key, e.target.value)}
                            className={`w-24 px-2 py-1 rounded border text-xs ${
                              state === 'correct'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                : state === 'wrong'
                                ? 'bg-rose-50 border-rose-300 text-rose-700'
                                : 'bg-white border-slate-200'
                            }`}
                          />
                        </td>
                      );
                    })}
                    <td className="p-2">
                      {rowGood ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};
