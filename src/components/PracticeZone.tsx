import React, { useMemo, useState } from 'react';
import { CheckCircle, Eye, HelpCircle, RefreshCw, XCircle, Edit, Plus, Trash, Save } from 'lucide-react';
import type { Exercise } from '../types/simulation';
import initialExercises from '../data/exercises.json';

interface PracticeZoneProps {
  exercises: Exercise[];
  selectedExerciseId: string | null;
  setSelectedExerciseId: (id: string | null) => void;
  setExercises?: React.Dispatch<React.SetStateAction<Exercise[]>>;
  isInstructorMode: boolean;
}

const normalize = (val: string | number) => String(val).trim().toLowerCase();

export const PracticeZone: React.FC<PracticeZoneProps> = ({
  exercises,
  selectedExerciseId,
  setSelectedExerciseId,
  setExercises,
  isInstructorMode,
}) => {
  const currentId = selectedExerciseId || exercises[0]?.id || '';
  const exercise = useMemo(() => exercises.find((x) => x.id === currentId) ?? exercises[0], [exercises, currentId]);
  
  const [showHint, setShowHint] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reveal, setReveal] = useState<boolean>(false);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [editHint, setEditHint] = useState<string>('');
  const [editType, setEditType] = useState<string>('');
  const [editColumns, setEditColumns] = useState<{ key: string; label: string }[]>([]);
  const [editRows, setEditRows] = useState<{ step: number; values: Record<string, string | number> }[]>([]);

  // Initialize edit fields when entering edit mode
  const enterEditMode = () => {
    if (!exercise) return;
    setEditTitle(exercise.title);
    setEditDesc(exercise.description);
    setEditHint(exercise.hint);
    setEditType(exercise.type);
    setEditColumns([...exercise.columns]);
    setEditRows(exercise.rows.map(r => ({ step: r.step, values: { ...r.values } })));
    setIsEditing(true);
  };

  if (!exercise) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-4">
        <p className="text-sm text-slate-600 font-bold">No practice exercises found.</p>
        <button
          onClick={() => {
            if (setExercises) {
              setExercises(initialExercises as Exercise[]);
              localStorage.setItem('aast_sim_exercises', JSON.stringify(initialExercises));
            }
          }}
          className="px-3 py-1.5 bg-aast-navy text-white text-xs font-bold rounded-lg"
        >
          Reset to Defaults
        </button>
      </div>
    );
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

  // Add a new blank exercise
  const handleAddNewExercise = () => {
    if (!setExercises) return;
    const newId = `new_ex_${Date.now()}`;
    const newEx: Exercise = {
      id: newId,
      type: 'queue_trace',
      title: 'New Section Queue Trace',
      description: 'Solve the queue trace with custom parameters.',
      hint: 'Service starts when server is free and customer has arrived.',
      columns: [
        { key: 'arrival', label: 'Arrival' },
        { key: 'service', label: 'Service' },
        { key: 'start', label: 'Start' },
        { key: 'depart', label: 'Depart' },
      ],
      rows: [
        { step: 1, values: { arrival: '1', service: '3', start: '1', depart: '4' } },
        { step: 2, values: { arrival: '2', service: '2', start: '4', depart: '6' } },
      ],
    };
    const updated = [...exercises, newEx];
    setExercises(updated);
    setSelectedExerciseId(newId);
    setAnswers({});
    setReveal(false);
  };

  // Delete current exercise
  const handleDeleteExercise = () => {
    if (!setExercises || exercises.length <= 1) return;
    const remaining = exercises.filter(x => x.id !== exercise.id);
    setExercises(remaining);
    setSelectedExerciseId(remaining[0].id);
    setAnswers({});
    setReveal(false);
    setIsEditing(false);
  };

  // Save current exercise edits
  const handleSaveEdits = () => {
    if (!setExercises) return;
    const updated: Exercise = {
      ...exercise,
      title: editTitle,
      description: editDesc,
      hint: editHint,
      type: editType as any,
      columns: editColumns,
      rows: editRows,
    };
    const nextExercises = exercises.map(x => x.id === exercise.id ? updated : x);
    setExercises(nextExercises);
    setIsEditing(false);
    setAnswers({});
    setReveal(false);
  };

  // Reset to default JSON exercises
  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to restore the default exercises? All your custom edits will be lost.')) {
      if (setExercises) {
        setExercises(initialExercises as Exercise[]);
        setSelectedExerciseId(initialExercises[0].id);
        setAnswers({});
        setReveal(false);
        setIsEditing(false);
      }
    }
  };

  // Column functions
  const addColumn = () => {
    setEditColumns([...editColumns, { key: `col_${Date.now()}`, label: 'New Column' }]);
  };
  const updateColumn = (index: number, keyVal: string, labelVal: string) => {
    const updated = [...editColumns];
    updated[index] = { key: keyVal, label: labelVal };
    setEditColumns(updated);
  };
  const removeColumn = (index: number) => {
    setEditColumns(editColumns.filter((_, i) => i !== index));
  };

  // Row functions
  const addRow = () => {
    const nextStep = editRows.length > 0 ? editRows[editRows.length - 1].step + 1 : 1;
    const newValues: Record<string, string | number> = {};
    editColumns.forEach(c => { newValues[c.key] = ''; });
    setEditRows([...editRows, { step: nextStep, values: newValues }]);
  };
  const updateRowValue = (rowIndex: number, colKey: string, val: string) => {
    const updated = [...editRows];
    updated[rowIndex].values[colKey] = val;
    setEditRows(updated);
  };
  const removeRow = (rowIndex: number) => {
    setEditRows(editRows.filter((_, i) => i !== rowIndex));
  };

  return (
    <div className="grid gap-6 md:grid-cols-4 animate-fade-in">
      {/* Sidebar - Exercise Selector */}
      <aside className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider font-black text-aast-navy border-b pb-2">Practice Sets</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
            {exercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => {
                  setSelectedExerciseId(ex.id);
                  setReveal(false);
                  setAnswers({});
                  setShowHint(false);
                  setIsEditing(false);
                }}
                className={`w-full text-left p-2.5 text-xs rounded-lg border transition ${
                  currentId === ex.id
                    ? 'bg-aast-navy text-aast-gold border-aast-navy'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <p className="font-bold truncate">{ex.title}</p>
                <p className={`text-[9px] mt-0.5 uppercase tracking-wide font-mono ${currentId === ex.id ? 'text-aast-gold/80' : 'text-slate-400'}`}>{ex.type.replace('_', ' ')}</p>
              </button>
            ))}
          </div>
        </div>

        {isInstructorMode && setExercises && (
          <div className="border-t pt-3 space-y-2">
            <button
              onClick={handleAddNewExercise}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add Exercise
            </button>
            <button
              onClick={handleResetToDefaults}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset Defaults
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="md:col-span-3 space-y-4">
        {isEditing ? (
          /* EDIT MODE FORM */
          <section className="bg-white border-2 border-aast-gold rounded-xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-black text-aast-navy uppercase flex items-center gap-2">
                <Edit className="h-5 w-5 text-aast-gold" />
                Edit Exercise Parameters
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdits}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-sm transition"
                >
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500">Exercise Title</label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:border-aast-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500">Exercise Description</label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:border-aast-gold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500">Hint / Formulas</label>
                  <textarea
                    value={editHint}
                    onChange={(e) => setEditHint(e.target.value)}
                    rows={2}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-xs focus:border-aast-gold outline-none"
                  />
                </div>
              </div>

              {/* Columns Editor */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-[10px] font-black uppercase text-slate-500">Columns Mapping</span>
                  <button onClick={addColumn} className="px-2 py-1 bg-aast-navy text-aast-gold font-bold rounded text-[10px] flex items-center gap-1 hover:bg-slate-800 transition">
                    <Plus className="h-3 w-3" /> Column
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {editColumns.map((col, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        placeholder="Key (id)"
                        value={col.key}
                        onChange={(e) => updateColumn(idx, e.target.value, col.label)}
                        className="w-24 px-2 py-1 text-[11px] border rounded"
                      />
                      <input
                        placeholder="Column Label"
                        value={col.label}
                        onChange={(e) => updateColumn(idx, col.key, e.target.value)}
                        className="flex-1 px-2 py-1 text-[11px] border rounded"
                      />
                      <button onClick={() => removeColumn(idx)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rows & Answers Editor */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-[10px] font-black uppercase text-slate-500">Trace Steps and Expected Answers</span>
                <button onClick={addRow} className="px-2 py-1 bg-aast-navy text-aast-gold font-bold rounded text-[10px] flex items-center gap-1 hover:bg-slate-800 transition">
                  <Plus className="h-3 w-3" /> Step Row
                </button>
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-64 bg-white">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100 border-b">
                    <tr>
                      <th className="p-2 text-left w-12">Step</th>
                      {editColumns.map((col) => (
                        <th key={col.key} className="p-2 text-left min-w-[100px]">{col.label}</th>
                      ))}
                      <th className="p-2 text-left w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editRows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-t">
                        <td className="p-2 font-bold text-slate-500">{row.step}</td>
                        {editColumns.map((col) => (
                          <td key={col.key} className="p-2">
                            <input
                              value={row.values[col.key] ?? ''}
                              onChange={(e) => updateRowValue(rIdx, col.key, e.target.value)}
                              className="w-full px-2 py-1 text-xs border rounded outline-none focus:border-aast-gold"
                            />
                          </td>
                        ))}
                        <td className="p-2">
                          <button onClick={() => removeRow(rIdx)} className="p-1 text-rose-600 hover:bg-rose-50 rounded">
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between border-t pt-4">
              <button
                onClick={handleDeleteExercise}
                disabled={exercises.length <= 1}
                className="px-3 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-rose-700 flex items-center gap-1 transition"
              >
                <Trash className="h-4 w-4" /> Delete Exercise Set
              </button>
              <button
                onClick={handleSaveEdits}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-sm transition"
              >
                <Save className="h-4 w-4" /> Save and Close
              </button>
            </div>
          </section>
        ) : (
          /* STANDARD PLAY MODE */
          <>
            <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3 border-b pb-3">
                <div>
                  <h2 className="text-xl font-black text-aast-navy">{exercise.title}</h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exercise.description}</p>
                </div>
                <div className="flex gap-2 items-center">
                  {solved && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700 font-black uppercase flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Solved
                    </span>
                  )}
                  {isInstructorMode && setExercises && (
                    <button
                      onClick={enterEditMode}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 transition shadow-sm"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit Exercise
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowHint((p) => !p)}
                  className="px-3 py-1.5 text-xs rounded border border-slate-200 bg-slate-50 font-bold flex items-center gap-1 hover:bg-slate-100 transition"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={() => setReveal(true)}
                  className="px-3 py-1.5 text-xs rounded bg-amber-500 text-white font-bold flex items-center gap-1 hover:bg-amber-600 transition shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5" /> Reveal Answers
                </button>
                <button
                  onClick={() => {
                    setAnswers({});
                    setReveal(false);
                  }}
                  className="px-3 py-1.5 text-xs rounded border border-rose-200 text-rose-600 font-bold flex items-center gap-1 hover:bg-rose-50 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset Exercise
                </button>
              </div>

              {showHint && (
                <div className="text-xs p-3 rounded-xl border border-aast-gold/30 bg-aast-gold-soft/50 text-aast-navy leading-relaxed">
                  <strong>Formulas & Guidelines:</strong> {exercise.hint}
                </div>
              )}
            </section>

            <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-2 text-left w-12 text-slate-500">Step</th>
                    {exercise.columns.map((c) => (
                      <th key={c.key} className="p-2 text-left font-bold text-slate-700">{c.label}</th>
                    ))}
                    <th className="p-2 text-left w-16 text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.rows.map((row, rowIdx) => {
                    const rowGood = exercise.columns.every((c) => cellState(rowIdx, c.key) === 'correct');
                    return (
                      <tr key={row.step} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-2 font-bold text-slate-400 font-mono">{row.step}</td>
                        {exercise.columns.map((c) => {
                          const state = cellState(rowIdx, c.key);
                          return (
                            <td key={c.key} className="p-2">
                              <input
                                value={reveal ? String(expected(rowIdx, c.key)) : valueAt(rowIdx, c.key)}
                                disabled={reveal}
                                onChange={(e) => setCell(rowIdx, c.key, e.target.value)}
                                className={`w-24 px-2 py-1 rounded border text-xs font-mono transition-all ${
                                  state === 'correct'
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                                    : state === 'wrong'
                                    ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                                    : 'bg-white border-slate-200 text-slate-800'
                                }`}
                              />
                            </td>
                          );
                        })}
                        <td className="p-2">
                          {rowGood ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-slate-300" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
};
