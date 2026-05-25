import React, { useMemo, useState } from 'react';
import { Lock, Save, ShieldCheck } from 'lucide-react';
import type { Announcement, Exercise, Lecture } from '../types/simulation';

export type { Announcement, Exercise, Lecture } from '../types/simulation';

interface InstructorDashboardProps {
  lectures: Lecture[];
  setLectures: React.Dispatch<React.SetStateAction<Lecture[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

type Panel = 'lectures' | 'announcements' | 'exercises';

const CORRECT_PIN = 'aast2026';

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  lectures,
  setLectures,
  announcements,
  setAnnouncements,
  exercises,
  setExercises,
}) => {
  const [isAuthed, setIsAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [panel, setPanel] = useState<Panel>('lectures');
  const [status, setStatus] = useState('');

  const [selectedLectureId, setSelectedLectureId] = useState(lectures[0]?.id ?? '');
  const [selectedExerciseId, setSelectedExerciseId] = useState(exercises[0]?.id ?? '');
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(announcements[0]?.id ?? '');

  const selectedLecture = useMemo(
    () => lectures.find((l) => l.id === selectedLectureId) ?? lectures[0],
    [lectures, selectedLectureId]
  );
  const selectedExercise = useMemo(
    () => exercises.find((x) => x.id === selectedExerciseId) ?? exercises[0],
    [exercises, selectedExerciseId]
  );
  const selectedAnnouncement = useMemo(
    () => announcements.find((a) => a.id === selectedAnnouncementId) ?? announcements[0],
    [announcements, selectedAnnouncementId]
  );

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsAuthed(true);
      setError('');
      return;
    }
    setError('Invalid instructor pin.');
  };

  const save = async (filename: string, data: unknown) => {
    setStatus('');
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, data }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error ?? 'Save failed');
      }
      setStatus(`Saved ${filename}`);
    } catch (err) {
      setStatus(`Save failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (!isAuthed) {
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-aast-navy" />
          <h2 className="text-lg font-black text-aast-navy">Instructor Dashboard</h2>
        </div>
        <p className="text-xs text-slate-600 mb-4">Enter instructor pin to edit curriculum data.</p>
        <form onSubmit={login} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded text-sm"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button className="w-full px-3 py-2 bg-aast-navy text-white rounded text-sm font-bold flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-2">
        {(['lectures', 'announcements', 'exercises'] as Panel[]).map((p) => (
          <button
            key={p}
            onClick={() => setPanel(p)}
            className={`px-3 py-1.5 rounded text-xs font-bold ${
              panel === p ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {p}
          </button>
        ))}
        {status && <span className="ml-auto text-xs text-slate-600">{status}</span>}
      </div>

      {panel === 'lectures' && selectedLecture && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex gap-2">
            <select value={selectedLecture.id} onChange={(e) => setSelectedLectureId(e.target.value)} className="px-2 py-1 text-xs border rounded">
              {lectures.map((l) => (
                <option key={l.id} value={l.id}>{l.week} - {l.title}</option>
              ))}
            </select>
            <button onClick={() => save('lectures.json', lectures)} className="px-3 py-1.5 rounded bg-aast-navy text-white text-xs font-bold flex items-center gap-1"><Save className="h-3.5 w-3.5" /> Save</button>
          </div>
          <input
            value={selectedLecture.title}
            onChange={(e) => setLectures((prev) => prev.map((x) => (x.id === selectedLecture.id ? { ...x, title: e.target.value } : x)))}
            className="w-full px-3 py-2 border rounded text-sm font-semibold"
          />
          <textarea
            value={selectedLecture.description}
            onChange={(e) => setLectures((prev) => prev.map((x) => (x.id === selectedLecture.id ? { ...x, description: e.target.value } : x)))}
            rows={5}
            className="w-full px-3 py-2 border rounded text-xs"
          />
        </div>
      )}

      {panel === 'announcements' && selectedAnnouncement && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex gap-2">
            <select value={selectedAnnouncement.id} onChange={(e) => setSelectedAnnouncementId(e.target.value)} className="px-2 py-1 text-xs border rounded">
              {announcements.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            <button onClick={() => save('announcements.json', announcements)} className="px-3 py-1.5 rounded bg-aast-navy text-white text-xs font-bold flex items-center gap-1"><Save className="h-3.5 w-3.5" /> Save</button>
          </div>
          <input
            value={selectedAnnouncement.title}
            onChange={(e) => setAnnouncements((prev) => prev.map((x) => (x.id === selectedAnnouncement.id ? { ...x, title: e.target.value } : x)))}
            className="w-full px-3 py-2 border rounded text-sm font-semibold"
          />
          <textarea
            value={selectedAnnouncement.content}
            onChange={(e) => setAnnouncements((prev) => prev.map((x) => (x.id === selectedAnnouncement.id ? { ...x, content: e.target.value } : x)))}
            rows={4}
            className="w-full px-3 py-2 border rounded text-xs"
          />
        </div>
      )}

      {panel === 'exercises' && selectedExercise && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex gap-2">
            <select value={selectedExercise.id} onChange={(e) => setSelectedExerciseId(e.target.value)} className="px-2 py-1 text-xs border rounded">
              {exercises.map((x) => (
                <option key={x.id} value={x.id}>{x.title}</option>
              ))}
            </select>
            <button onClick={() => save('exercises.json', exercises)} className="px-3 py-1.5 rounded bg-aast-navy text-white text-xs font-bold flex items-center gap-1"><Save className="h-3.5 w-3.5" /> Save</button>
          </div>
          <input
            value={selectedExercise.title}
            onChange={(e) => setExercises((prev) => prev.map((x) => (x.id === selectedExercise.id ? { ...x, title: e.target.value } : x)))}
            className="w-full px-3 py-2 border rounded text-sm font-semibold"
          />
          <textarea
            value={selectedExercise.hint}
            onChange={(e) => setExercises((prev) => prev.map((x) => (x.id === selectedExercise.id ? { ...x, hint: e.target.value } : x)))}
            rows={4}
            className="w-full px-3 py-2 border rounded text-xs"
          />
        </div>
      )}
    </div>
  );
};
