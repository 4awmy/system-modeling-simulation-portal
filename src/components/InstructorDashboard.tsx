import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  Edit2, 
  AlertCircle, 
  GitBranch, 
  GitPullRequest, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown,
  Play,
  Folder,
  FolderOpen,
  FileText,
  Terminal,
  X
} from 'lucide-react';

export interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  pinned: boolean;
}

export interface LectureDetail {
  title: string;
  content: string;
}

export interface Lecture {
  id: string;
  week: string;
  title: string;
  description: string;
  pdfUrl: string;
  concepts: string[];
  keyDetails: LectureDetail[];
}

export interface ExerciseStep {
  k: number;
  pk: number | string;
  x: number;
  y: number;
}

export interface Exercise {
  id: string;
  type: 'line_bresenham' | 'circle_midpoint';
  title: string;
  description: string;
  params: Record<string, number>;
  hint: string;
  steps: ExerciseStep[];
}

interface TreeNode {
  name: string;
  path: string;
  isDir: boolean;
  children: Record<string, TreeNode>;
}

interface InstructorDashboardProps {
  lectures: Lecture[];
  setLectures: React.Dispatch<React.SetStateAction<Lecture[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  lectures,
  setLectures,
  announcements,
  setAnnouncements,
  exercises,
  setExercises,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  
  // Dashboard state
  const [activePanel, setActivePanel] = useState<'announcements' | 'lectures' | 'exercises' | 'files' | 'git'>('announcements');
  const [saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'local_fallback'; message?: string }>({ type: 'idle' });

  // Selections
  const [selectedLecId, setSelectedLecId] = useState<string>(lectures[0]?.id || '');
  const [selectedExId, setSelectedExId] = useState<string>(exercises[0]?.id || '');

  // Announcement form state
  const [annForm, setAnnForm] = useState({ title: '', content: '', pinned: false });
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  // File Explorer State
  const [workspaceFiles, setWorkspaceFiles] = useState<{ path: string; isDir: boolean }[]>([]);
  const [selectedFilepath, setSelectedFilepath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [originalFileContent, setOriginalFileContent] = useState<string>('');
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileSuccess, setFileSuccess] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'src/components': true,
    'src/data': true
  });
  
  // File creation state
  const [newFileParent, setNewFileParent] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState<string>('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Command execution logs state
  const [commandLogs, setCommandLogs] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    command: string;
    stdout?: string;
    stderr?: string;
    error?: string;
  }>({ status: 'idle', command: '' });

  // Git state
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [gitStatus, setGitStatus] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
    stdout?: string;
    stderr?: string;
  }>({ status: 'idle' });

  const CORRECT_PIN = 'aast2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CORRECT_PIN) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Invalid Instructor Credentials Pin.');
    }
  };

  const handleSaveToDisk = async (filename: string, data: unknown) => {
    setSaveStatus({ type: 'idle' });
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, data }),
      });
      const result = await response.json();
      if (result.success) {
        setSaveStatus({ type: 'success', message: `Saved changes directly to dev server disk: ${filename}!` });
      } else {
        throw new Error(result.error);
      }
    } catch {
      setSaveStatus({ 
        type: 'local_fallback', 
        message: `Saved changes locally in browser cache. Click 'Download ${filename}' below to export the file manually.` 
      });
    }
  };

  const triggerFileDownload = (filename: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- File System Operations ---
  const fetchWorkspaceFiles = async () => {
    try {
      const response = await fetch('/api/list-files', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setWorkspaceFiles(data.files);
      }
    } catch (err: unknown) {
      console.error('Error fetching files:', err);
    }
  };

  const handleOpenFile = async (filepath: string) => {
    setSelectedFilepath(filepath);
    setIsFileLoading(true);
    setFileError(null);
    setFileSuccess(null);
    try {
      const response = await fetch('/api/read-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filepath }),
      });
      const data = await response.json();
      if (data.success) {
        setFileContent(data.content);
        setOriginalFileContent(data.content);
      } else {
        setFileError(data.error || 'Failed to read file.');
      }
    } catch (err: unknown) {
      setFileError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsFileLoading(false);
    }
  };

  const handleSaveFile = async () => {
    if (!selectedFilepath) return;
    setIsFileLoading(true);
    setFileError(null);
    setFileSuccess(null);
    try {
      const response = await fetch('/api/write-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filepath: selectedFilepath, content: fileContent }),
      });
      const data = await response.json();
      if (data.success) {
        setFileSuccess('File written to disk successfully!');
        setOriginalFileContent(fileContent);
        // If they edited local JSON configs, hot-reload the parent state
        if (selectedFilepath === 'src/data/lectures.json') {
          try {
            const parsed = JSON.parse(fileContent);
            setLectures(parsed);
          } catch (err: unknown) {
            console.error('Failed to parse updated lectures.json:', err);
          }
        } else if (selectedFilepath === 'src/data/exercises.json') {
          try {
            const parsed = JSON.parse(fileContent);
            setExercises(parsed);
          } catch (err: unknown) {
            console.error('Failed to parse updated exercises.json:', err);
          }
        } else if (selectedFilepath === 'src/data/announcements.json') {
          try {
            const parsed = JSON.parse(fileContent);
            setAnnouncements(parsed);
          } catch (err: unknown) {
            console.error('Failed to parse updated announcements.json:', err);
          }
        }
      } else {
        setFileError(data.error || 'Failed to save file.');
      }
    } catch (err: unknown) {
      setFileError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsFileLoading(false);
    }
  };

  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilename.trim()) return;
    const filepath = newFileParent ? `${newFileParent}/${newFilename.trim()}` : newFilename.trim();
    try {
      const response = await fetch('/api/create-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filepath, isDir: newFileType === 'folder' }),
      });
      const data = await response.json();
      if (data.success) {
        setNewFilename('');
        setIsCreating(false);
        fetchWorkspaceFiles();
        if (newFileType === 'file') {
          handleOpenFile(filepath);
        }
      } else {
        alert(data.error || 'Failed to create item');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteFile = async (filepath: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filepath}"?`)) return;
    try {
      const response = await fetch('/api/delete-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filepath }),
      });
      const data = await response.json();
      if (data.success) {
        if (selectedFilepath === filepath) {
          setSelectedFilepath(null);
          setFileContent('');
        }
        fetchWorkspaceFiles();
      } else {
        alert(data.error || 'Failed to delete item');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleRunCommand = async (command: string) => {
    setCommandLogs({ status: 'loading', command });
    try {
      const response = await fetch('/api/run-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });
      const data = await response.json();
      if (data.success) {
        setCommandLogs({
          status: 'success',
          command,
          stdout: data.stdout,
          stderr: data.stderr
        });
      } else {
        setCommandLogs({
          status: 'error',
          command,
          stdout: data.stdout,
          stderr: data.stderr,
          error: data.error || 'Command exited with a non-zero code.'
        });
      }
    } catch (err: unknown) {
      setCommandLogs({
        status: 'error',
        command,
        error: err instanceof Error ? err.message : String(err)
      });
    }
  };

  useEffect(() => {
    if (activePanel === 'files') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWorkspaceFiles();
    }
  }, [activePanel]);

  // Tab texteditor key handler for Indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newValue = val.substring(0, start) + '  ' + val.substring(end);
      setFileContent(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Build Folder Tree Hierarchy
  const buildFileTree = (files: { path: string; isDir: boolean }[]) => {
    const root: TreeNode = { name: 'Root', path: '', isDir: true, children: {} };
    const sortedFiles = [...files].sort((a, b) => {
      if (a.isDir && !b.isDir) return -1;
      if (!a.isDir && b.isDir) return 1;
      return a.path.localeCompare(b.path);
    });

    for (const file of sortedFiles) {
      const parts = file.path.split('/');
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: parts.slice(0, i + 1).join('/'),
            isDir: isLast ? file.isDir : true,
            children: {}
          };
        }
        current = current.children[part];
      }
    }
    return root;
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderPath]: !prev[folderPath] }));
  };

  const renderTreeNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    const childKeys = Object.keys(node.children).sort((a, b) => {
      const childA = node.children[a];
      const childB = node.children[b];
      if (childA.isDir && !childB.isDir) return -1;
      if (!childA.isDir && childB.isDir) return 1;
      return a.localeCompare(b);
    });

    return (
      <div key={node.path || 'root'} className="select-none">
        {node.path && (
          <div
            style={{ paddingLeft: `${depth * 10}px` }}
            className={`group flex items-center justify-between py-1 px-2 rounded-lg text-xs cursor-pointer hover:bg-slate-100 transition-colors ${
              selectedFilepath === node.path ? 'bg-aast-navy text-aast-gold font-bold shadow-sm' : 'text-slate-650'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (node.isDir) {
                toggleFolder(node.path);
              } else {
                handleOpenFile(node.path);
              }
            }}
          >
            <div className="flex items-center space-x-1.5 min-w-0">
              {node.isDir ? (
                expandedFolders[node.path] ? (
                  <FolderOpen className={`h-3.5 w-3.5 shrink-0 ${selectedFilepath === node.path ? 'text-aast-gold' : 'text-aast-navy'}`} />
                ) : (
                  <Folder className={`h-3.5 w-3.5 shrink-0 ${selectedFilepath === node.path ? 'text-aast-gold' : 'text-aast-navy'}`} />
                )
              ) : (
                <FileText className={`h-3.5 w-3.5 shrink-0 ${selectedFilepath === node.path ? 'text-aast-gold' : 'text-slate-400'}`} />
              )}
              <span className="truncate">{node.name}</span>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0 ml-2">
              {node.isDir && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewFileParent(node.path);
                    setIsCreating(true);
                  }}
                  className="p-0.5 hover:bg-slate-200 text-slate-500 rounded"
                  title="New Inside"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(node.path);
                }}
                className="p-0.5 hover:bg-red-50 text-red-500 rounded animate-pulse"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
        {(node.path === '' || expandedFolders[node.path]) && childKeys.length > 0 && (
          <div className="space-y-0.5 mt-0.5">
            {childKeys.map(key => renderTreeNode(node.children[key], depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // --- Git Push Handler ---
  const handleGitPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setGitStatus({ status: 'loading' });
    try {
      const response = await fetch('/api/git-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commitMessage }),
      });
      const result = await response.json();
      if (result.success) {
        setGitStatus({
          status: 'success',
          message: 'Committed and pushed successfully to GitHub!',
          stdout: result.stdout,
          stderr: result.stderr
        });
        setCommitMessage('');
      } else {
        setGitStatus({
          status: 'error',
          message: result.error || 'Git command exited with failure status.',
          stdout: result.stdout,
          stderr: result.stderr
        });
      }
    } catch (err: unknown) {
      setGitStatus({
        status: 'error',
        message: 'Could not connect to git-sync endpoint. Ensure the dev server is running locally.',
        stderr: err instanceof Error ? err.message : String(err)
      });
    }
  };

  // --- Announcements Actions ---
  const saveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingAnnId) {
      updated = announcements.map(ann => 
        ann.id === editingAnnId 
          ? { ...ann, title: annForm.title, content: annForm.content, pinned: annForm.pinned }
          : ann
      );
      setEditingAnnId(null);
    } else {
      const newAnn: Announcement = {
        id: `ann_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: annForm.title,
        content: annForm.content,
        pinned: annForm.pinned
      };
      updated = [newAnn, ...announcements];
    }
    setAnnouncements(updated);
    setAnnForm({ title: '', content: '', pinned: false });
    handleSaveToDisk('announcements.json', updated);
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(ann => ann.id !== id);
    setAnnouncements(updated);
    handleSaveToDisk('announcements.json', updated);
  };

  const startEditAnnouncement = (ann: Announcement) => {
    setEditingAnnId(ann.id);
    setAnnForm({ title: ann.title, content: ann.content, pinned: ann.pinned });
  };

  // --- Lectures CRUD Actions ---
  const selectedLec = lectures.find(l => l.id === selectedLecId) || lectures[0];

  const handleUpdateLectureField = <K extends keyof Lecture>(field: K, value: Lecture[K]) => {
    if (!selectedLec) return;
    const updated = lectures.map(l => 
      l.id === selectedLec.id ? { ...l, [field]: value } : l
    );
    setLectures(updated);
  };

  const handleAddLecture = () => {
    const newLec: Lecture = {
      id: `lec_${Date.now()}`,
      week: `Week ${lectures.length + 1}`,
      title: 'New Lecture Topic',
      description: 'Overview of new topics covered in this week.',
      pdfUrl: 'Lectures/Week 01 - lec1_introduction.pdf',
      concepts: ['Concept 1', 'Concept 2'],
      keyDetails: [
        { title: 'Overview', content: 'Add detail page content here.' }
      ]
    };
    const updated = [...lectures, newLec];
    setLectures(updated);
    setSelectedLecId(newLec.id);
    handleSaveToDisk('lectures.json', updated);
  };

  const handleDeleteLecture = () => {
    if (!selectedLec) return;
    if (window.confirm(`Are you sure you want to delete "${selectedLec.title}"?`)) {
      const updated = lectures.filter(l => l.id !== selectedLec.id);
      setLectures(updated);
      if (updated.length > 0) {
        setSelectedLecId(updated[0].id);
      }
      handleSaveToDisk('lectures.json', updated);
    }
  };

  // Lecture Detail Note Pages Actions
  const handleUpdateDetailField = (idx: number, field: keyof LectureDetail, value: string) => {
    if (!selectedLec) return;
    const updatedDetails = selectedLec.keyDetails.map((det, dIdx) => 
      dIdx === idx ? { ...det, [field]: value } : det
    );
    handleUpdateLectureField('keyDetails', updatedDetails);
  };

  const handleAddDetail = () => {
    if (!selectedLec) return;
    const updatedDetails = [
      ...selectedLec.keyDetails,
      { title: 'New Concept Notes', content: 'Enter formulas and definitions.' }
    ];
    handleUpdateLectureField('keyDetails', updatedDetails);
  };

  const handleDeleteDetail = (idx: number) => {
    if (!selectedLec) return;
    const updatedDetails = selectedLec.keyDetails.filter((_, dIdx) => dIdx !== idx);
    handleUpdateLectureField('keyDetails', updatedDetails);
  };

  const handleMoveDetail = (idx: number, dir: 'up' | 'down') => {
    if (!selectedLec) return;
    const details = [...selectedLec.keyDetails];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= details.length) return;
    
    // Swap
    const temp = details[idx];
    details[idx] = details[targetIdx];
    details[targetIdx] = temp;
    
    handleUpdateLectureField('keyDetails', details);
  };

  // --- Exercises CRUD Actions ---
  const selectedEx = exercises.find(e => e.id === selectedExId) || exercises[0];

  const handleUpdateExerciseField = <K extends keyof Exercise>(field: K, value: Exercise[K]) => {
    if (!selectedEx) return;
    const updated = exercises.map(ex => 
      ex.id === selectedEx.id ? { ...ex, [field]: value } : ex
    );
    setExercises(updated);
  };

  const handleUpdateParams = (paramKey: string, value: number) => {
    if (!selectedEx) return;
    const updatedParams = { ...selectedEx.params, [paramKey]: value };
    handleUpdateExerciseField('params', updatedParams);
  };

  const handleAddExercise = () => {
    const newEx: Exercise = {
      id: `ex_${Date.now()}`,
      type: 'line_bresenham',
      title: 'New Line Tracing Exercise',
      description: 'Scan convert the line segment from P0 to P1 using Bresenham\'s algorithm.',
      params: { x0: 2, y0: 3, xEnd: 8, yEnd: 7 },
      hint: 'Compute dx, dy, 2dy, 2dy-2dx, and initial decision parameter P0.',
      steps: [
        { k: 0, pk: 'N/A', x: 2, y: 3 }
      ]
    };
    const updated = [...exercises, newEx];
    setExercises(updated);
    setSelectedExId(newEx.id);
    handleSaveToDisk('exercises.json', updated);
  };

  const handleDeleteExercise = () => {
    if (!selectedEx) return;
    if (window.confirm(`Are you sure you want to delete "${selectedEx.title}"?`)) {
      const updated = exercises.filter(ex => ex.id !== selectedEx.id);
      setExercises(updated);
      if (updated.length > 0) {
        setSelectedExId(updated[0].id);
      }
      handleSaveToDisk('exercises.json', updated);
    }
  };

  // Exercise steps actions
  const handleUpdateStep = (stepIdx: number, field: keyof ExerciseStep, value: string | number) => {
    if (!selectedEx) return;
    const updatedSteps = selectedEx.steps.map((st, idx) => 
      idx === stepIdx ? { ...st, [field]: value } : st
    );
    handleUpdateExerciseField('steps', updatedSteps);
  };

  const handleAddStep = () => {
    if (!selectedEx) return;
    const lastStep = selectedEx.steps[selectedEx.steps.length - 1];
    const newStep: ExerciseStep = {
      k: selectedEx.steps.length,
      pk: lastStep ? (typeof lastStep.pk === 'number' ? lastStep.pk + 1 : 0) : 0,
      x: lastStep ? lastStep.x + 1 : 0,
      y: lastStep ? lastStep.y : 0
    };
    const updatedSteps = [...selectedEx.steps, newStep];
    handleUpdateExerciseField('steps', updatedSteps);
  };

  const handleDeleteStep = (stepIdx: number) => {
    if (!selectedEx) return;
    const updatedSteps = selectedEx.steps.filter((_, idx) => idx !== stepIdx).map((st, index) => ({
      ...st,
      k: index // re-index steps
    }));
    handleUpdateExerciseField('steps', updatedSteps);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md my-12 p-6 bg-white border border-slate-200 shadow-xl rounded-2xl animate-fade">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-aast-navy/10 text-aast-navy flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800">Instructor Dashboard Access</h2>
            <p className="text-xs text-slate-500 mt-1">Please enter the security PIN credentials to toggle editor dashboards.</p>
          </div>
          
          <form onSubmit={handleLogin} className="w-full space-y-3">
            <div>
              <input
                type="password"
                placeholder="Instructor Security PIN"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-xs text-center font-semibold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
              />
              {passwordError && (
                <span className="text-[10px] text-rose-500 font-bold block mt-1.5 text-center">{passwordError}</span>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 text-xs font-bold text-white bg-aast-navy hover:bg-aast-navy-light rounded-lg shadow transition-colors flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verify credentials</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Build the hierarchical tree object
  const fileTreeRoot = buildFileTree(workspaceFiles);

  return (
    <div className="space-y-6 animate-fade">
      
      {/* Save Notification Banner */}
      {saveStatus.type !== 'idle' && (
        <div 
          className={`p-4 rounded-xl border flex items-start space-x-2 text-xs animate-fade ${
            saveStatus.type === 'success' 
              ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
              : 'bg-amber-50 border-amber-250 text-amber-800'
          }`}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">{saveStatus.type === 'success' ? 'Changes Saved!' : 'Local Cache Notice'}</p>
            <p className="mt-0.5 leading-relaxed">{saveStatus.message}</p>
          </div>
        </div>
      )}

      {/* Editor Panel Navigation tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-3.5 border border-slate-200 rounded-xl shadow-sm gap-4">
        <div className="flex flex-wrap gap-2">
          {([
            { id: 'announcements', label: 'Announcements' },
            { id: 'lectures', label: 'Lecture Slide/Notes Editor' },
            { id: 'exercises', label: 'Practice Homework Editor' },
            { id: 'files', label: 'Project Workspace Editor' },
            { id: 'git', label: 'GitHub Upload & Sync' }
          ] as const).map((panel) => (
            <button
              key={panel.id}
              onClick={() => {
                setActivePanel(panel.id);
                setSaveStatus({ type: 'idle' });
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activePanel === panel.id
                  ? 'bg-aast-navy text-aast-gold shadow-sm'
                  : 'text-slate-650 hover:bg-slate-50'
              }`}
            >
              {panel.label}
            </button>
          ))}
        </div>
        
        {/* Bulk download database files */}
        <div className="flex space-x-2 shrink-0">
          <button
            onClick={() => triggerFileDownload('announcements.json', announcements)}
            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded flex items-center space-x-1"
            title="Download announcements.json"
          >
            <Download className="h-3 w-3 text-aast-gold" />
            <span>announcements.json</span>
          </button>
          <button
            onClick={() => triggerFileDownload('lectures.json', lectures)}
            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded flex items-center space-x-1"
            title="Download lectures.json"
          >
            <Download className="h-3 w-3 text-aast-gold" />
            <span>lectures.json</span>
          </button>
          <button
            onClick={() => triggerFileDownload('exercises.json', exercises)}
            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded flex items-center space-x-1"
            title="Download exercises.json"
          >
            <Download className="h-3 w-3 text-aast-gold" />
            <span>exercises.json</span>
          </button>
        </div>
      </div>

      {/* --- Announcements Editor Tab --- */}
      {activePanel === 'announcements' && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-3 h-fit">
            <h3 className="font-bold text-aast-navy text-sm">{editingAnnId ? 'Edit Announcement' : 'Post Announcement'}</h3>
            <form onSubmit={saveAnnouncement} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="Announcements subject"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                />
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Content</label>
                <textarea
                  required
                  rows={4}
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Post content..."
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                />
              </div>

              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={annForm.pinned}
                  onChange={(e) => setAnnForm({ ...annForm, pinned: e.target.checked })}
                  className="text-aast-navy focus:ring-aast-navy h-4 w-4 rounded"
                />
                <label htmlFor="pinned" className="text-xs font-semibold text-slate-655 cursor-pointer">Pin to top of board</label>
              </div>

              <button
                type="submit"
                className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center space-x-1.5 shadow"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{editingAnnId ? 'Save Announcement' : 'Publish Announcement'}</span>
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex justify-between items-start hover:shadow-md transition-shadow">
                <div className="space-y-1 pr-4">
                  <span className="text-[9px] font-mono text-slate-400 block">{ann.date} {ann.pinned && '• Pinned'}</span>
                  <h4 className="font-bold text-xs text-slate-800">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{ann.content}</p>
                </div>
                
                <div className="flex space-x-1 shrink-0">
                  <button
                    onClick={() => startEditAnnouncement(ann)}
                    className="p-1 text-slate-400 hover:bg-slate-50 hover:text-aast-navy rounded"
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Lectures Editor Tab --- */}
      {activePanel === 'lectures' && (
        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="font-bold text-aast-navy text-xs uppercase tracking-wider">Lectures Index</h3>
              <div className="flex flex-col space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                {lectures.map((lec) => (
                  <button
                    key={lec.id}
                    onClick={() => setSelectedLecId(lec.id)}
                    className={`text-left px-2.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-start space-x-1.5 ${
                      selectedLecId === lec.id
                        ? 'bg-aast-navy text-aast-gold font-bold shadow animate-pulse-subtle'
                        : 'text-slate-650 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <span className="font-mono text-[9px] opacity-75 mt-0.5">{lec.week}:</span>
                    <span className="truncate flex-1">{lec.title}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleAddLecture}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-350 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Lecture</span>
            </button>
          </div>

          <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-5">
            {selectedLec ? (
              <>
                <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Editing Week Lecture Settings</h3>
                    <span className="text-[10px] text-slate-450 font-mono">ID: {selectedLec.id}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDeleteLecture}
                      className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-650 rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Lecture</span>
                    </button>
                    <button
                      onClick={() => handleSaveToDisk('lectures.json', lectures)}
                      className="py-1.5 px-3 bg-emerald-650 hover:bg-emerald-700 text-xs font-bold text-white rounded-lg flex items-center space-x-1 shadow transition-colors"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Week Label</label>
                    <input
                      type="text"
                      value={selectedLec.week}
                      onChange={(e) => handleUpdateLectureField('week', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Lecture Title</label>
                    <input
                      type="text"
                      value={selectedLec.title}
                      onChange={(e) => handleUpdateLectureField('title', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">PDF File URL Path</label>
                    <input
                      type="text"
                      value={selectedLec.pdfUrl}
                      onChange={(e) => handleUpdateLectureField('pdfUrl', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Description / Summary</label>
                  <input
                    type="text"
                    value={selectedLec.description}
                    onChange={(e) => handleUpdateLectureField('description', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Syllabus Concepts (Comma Separated)</label>
                  <input
                    type="text"
                    value={selectedLec.concepts.join(', ')}
                    onChange={(e) => {
                      const split = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      handleUpdateLectureField('concepts', split);
                    }}
                    placeholder="e.g. DDA, Bresenham, Grid Rasterization"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                  />
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-150">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider">Interactive Web Lesson Sections</h4>
                    <button
                      onClick={handleAddDetail}
                      className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[10px] font-bold text-slate-700 rounded flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Section Page</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {selectedLec.keyDetails.map((det, idx) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-2">
                        <div className="flex justify-between items-center">
                          <input
                            type="text"
                            value={det.title}
                            onChange={(e) => handleUpdateDetailField(idx, 'title', e.target.value)}
                            placeholder="Section Title"
                            className="bg-transparent border-b border-transparent hover:border-slate-350 focus:border-aast-navy font-bold text-xs px-1 text-slate-850 w-2/3"
                          />
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleMoveDetail(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveDetail(idx, 'down')}
                              disabled={idx === selectedLec.keyDetails.length - 1}
                              className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDetail(idx)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded animate-pulse"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={4}
                          value={det.content}
                          onChange={(e) => handleUpdateDetailField(idx, 'content', e.target.value)}
                          placeholder="Markdown / Math text content..."
                          className="w-full text-xs px-2.5 py-1.5 border border-slate-250 rounded bg-white font-medium"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select a lecture to edit or click Add New.</div>
            )}
          </div>
        </div>
      )}

      {/* --- Exercises Editor Tab --- */}
      {activePanel === 'exercises' && (
        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="font-bold text-aast-navy text-xs uppercase tracking-wider">Exercises</h3>
              <div className="flex flex-col space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                {exercises.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExId(ex.id)}
                    className={`text-left px-2.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-start space-x-1.5 ${
                      selectedExId === ex.id
                        ? 'bg-aast-navy text-aast-gold font-bold shadow animate-pulse-subtle'
                        : 'text-slate-650 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <span className="truncate flex-1">{ex.title}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleAddExercise}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-dashed border-slate-350 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Exercise</span>
            </button>
          </div>

          <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-5">
            {selectedEx ? (
              <>
                <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Editing Practice Exercise</h3>
                    <span className="text-[10px] text-slate-450 font-mono">ID: {selectedEx.id}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDeleteExercise}
                      className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-xs font-bold text-red-650 rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Exercise</span>
                    </button>
                    <button
                      onClick={() => handleSaveToDisk('exercises.json', exercises)}
                      className="py-1.5 px-3 bg-emerald-650 hover:bg-emerald-700 text-xs font-bold text-white rounded-lg flex items-center space-x-1 shadow transition-colors"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Exercise Title</label>
                    <input
                      type="text"
                      value={selectedEx.title}
                      onChange={(e) => handleUpdateExerciseField('title', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Algorithm Category</label>
                    <select
                      value={selectedEx.type}
                      onChange={(e) => handleUpdateExerciseField('type', e.target.value as 'line_bresenham' | 'circle_midpoint')}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy font-semibold"
                    >
                      <option value="line_bresenham">Bresenham's Line Algorithm</option>
                      <option value="circle_midpoint">Midpoint Circle Algorithm</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Description</label>
                    <input
                      type="text"
                      value={selectedEx.description}
                      onChange={(e) => handleUpdateExerciseField('description', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Hint</label>
                    <input
                      type="text"
                      value={selectedEx.hint}
                      onChange={(e) => handleUpdateExerciseField('hint', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider">Algorithm Formula Parameters</h4>
                  
                  {selectedEx.type === 'line_bresenham' ? (
                    <div className="grid gap-3 grid-cols-4">
                      {([
                        { k: 'x0', l: 'Start X0' },
                        { k: 'y0', l: 'Start Y0' },
                        { k: 'xEnd', l: 'End X' },
                        { k: 'yEnd', l: 'End Y' }
                      ]).map((param) => (
                        <div key={param.k}>
                          <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">{param.l}</label>
                          <input
                            type="number"
                            value={selectedEx.params[param.k] ?? 0}
                            onChange={(e) => handleUpdateParams(param.k, parseInt(e.target.value, 10) || 0)}
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-3 grid-cols-3">
                      {([
                        { k: 'xc', l: 'Center Xc' },
                        { k: 'yc', l: 'Center Yc' },
                        { k: 'r', l: 'Radius R' }
                      ]).map((param) => (
                        <div key={param.k}>
                          <label className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">{param.l}</label>
                          <input
                            type="number"
                            value={selectedEx.params[param.k] ?? 0}
                            onChange={(e) => handleUpdateParams(param.k, parseInt(e.target.value, 10) || 0)}
                            className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-150">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wider">Step-by-Step Solutions Grid</h4>
                    <button
                      onClick={handleAddStep}
                      className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-350 text-[10px] font-bold text-slate-700 rounded flex items-center space-x-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Calculation Row</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[9px] tracking-wide">
                        <tr>
                          <th className="p-2.5">Step (k)</th>
                          <th className="p-2.5">Decision Param (Pk)</th>
                          <th className="p-2.5">Plotted X</th>
                          <th className="p-2.5">Plotted Y</th>
                          <th className="p-2.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 bg-white">
                        {selectedEx.steps.map((st, sIdx) => (
                          <tr key={sIdx} className="hover:bg-slate-50/50">
                            <td className="p-2 w-20">
                              <input
                                type="number"
                                value={st.k}
                                onChange={(e) => handleUpdateStep(sIdx, 'k', parseInt(e.target.value, 10) || 0)}
                                className="w-full text-xs px-2 py-0.5 border border-slate-200 rounded text-center font-mono"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={st.pk}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const num = parseInt(val, 10);
                                  handleUpdateStep(sIdx, 'pk', isNaN(num) ? val : num);
                                }}
                                className="w-full text-xs px-2 py-0.5 border border-slate-200 rounded font-mono"
                              />
                            </td>
                            <td className="p-2 w-28">
                              <input
                                type="number"
                                value={st.x}
                                onChange={(e) => handleUpdateStep(sIdx, 'x', parseInt(e.target.value, 10) || 0)}
                                className="w-full text-xs px-2 py-0.5 border border-slate-200 rounded font-mono"
                              />
                            </td>
                            <td className="p-2 w-28">
                              <input
                                type="number"
                                value={st.y}
                                onChange={(e) => handleUpdateStep(sIdx, 'y', parseInt(e.target.value, 10) || 0)}
                                className="w-full text-xs px-2 py-0.5 border border-slate-200 rounded font-mono"
                              />
                            </td>
                            <td className="p-2 text-center w-16">
                              <button
                                onClick={() => handleDeleteStep(sIdx)}
                                className="p-1 hover:bg-red-50 text-red-500 rounded animate-pulse"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">Select an exercise to edit or click Add New.</div>
            )}
          </div>
        </div>
      )}

      {/* --- Project Workspace Editor Tab --- */}
      {activePanel === 'files' && (
        <div className="grid gap-6 md:grid-cols-4">
          
          {/* File Tree Explorer (Left column) */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="font-bold text-aast-navy text-xs uppercase tracking-wider">Workspace Files</h3>
                <button
                  onClick={() => {
                    setNewFileParent(null);
                    setIsCreating(true);
                  }}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-250 border border-slate-300 text-[9px] font-bold text-slate-700 rounded flex items-center space-x-1.5 transition-colors"
                  title="Create file at project root"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add to Root</span>
                </button>
              </div>

              {/* Inline Create Form */}
              {isCreating && (
                <div className="p-3 border border-slate-205 bg-slate-50/70 rounded-xl space-y-2 text-xs shadow-inner animate-fade-subtle">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 text-[10px]">
                      New {newFileType === 'file' ? 'File' : 'Folder'} {newFileParent ? `in ${newFileParent}` : 'at root'}
                    </span>
                    <button 
                      onClick={() => setIsCreating(false)} 
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateFile} className="space-y-2">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setNewFileType('file')}
                        className={`flex-1 py-1 rounded font-bold text-[9px] transition-colors ${
                          newFileType === 'file' ? 'bg-aast-navy text-aast-gold shadow-sm' : 'bg-slate-200 text-slate-650 hover:bg-slate-250'
                        }`}
                      >
                        File
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewFileType('folder')}
                        className={`flex-1 py-1 rounded font-bold text-[9px] transition-colors ${
                          newFileType === 'folder' ? 'bg-aast-navy text-aast-gold shadow-sm' : 'bg-slate-200 text-slate-655 hover:bg-slate-250'
                        }`}
                      >
                        Folder
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder={newFileType === 'file' ? 'e.g. index.css' : 'e.g. components'}
                      value={newFilename}
                      onChange={(e) => setNewFilename(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow transition-colors"
                    >
                      Create Item
                    </button>
                  </form>
                </div>
              )}

              {/* Tree View list */}
              <div className="max-h-[450px] overflow-y-auto pr-1 space-y-1">
                {workspaceFiles.length > 0 ? (
                  renderTreeNode(fileTreeRoot)
                ) : (
                  <div className="text-center py-6 text-slate-400 italic text-[11px]">Loading codebase files...</div>
                )}
              </div>
            </div>

            <button
              onClick={fetchWorkspaceFiles}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-aast-navy" />
              <span>Refresh Workspace</span>
            </button>
          </div>

          {/* Code Editor and Command runner (Right column) */}
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-5 flex flex-col justify-between">
            {selectedFilepath ? (
              <div className="space-y-4 flex-1 flex flex-col">
                
                {/* Title Header bar */}
                <div className="flex justify-between items-center border-b border-slate-150 pb-3 shrink-0">
                  <div className="min-w-0 pr-4">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                      <span>Editing:</span>
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border truncate" title={selectedFilepath}>
                        {selectedFilepath}
                      </span>
                      {fileContent !== originalFileContent && (
                        <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 animate-pulse">
                          Unsaved changes
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="flex space-x-2 shrink-0">
                    <button
                      onClick={() => handleOpenFile(selectedFilepath)}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg flex items-center space-x-1 transition-colors border"
                      title="Discard local edits and reload file content"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Revert</span>
                    </button>
                    <button
                      onClick={handleSaveFile}
                      disabled={isFileLoading || fileContent === originalFileContent}
                      className="py-1.5 px-3 bg-emerald-650 hover:bg-emerald-700 disabled:opacity-50 text-xs font-bold text-white rounded-lg flex items-center space-x-1 shadow transition-colors"
                    >
                      <Save className="h-3.5 w-3.5 text-aast-gold" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFilepath(null);
                        setFileContent('');
                      }}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 border text-slate-400 rounded-lg"
                      title="Close editor"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                {fileError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade">
                    <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
                {fileSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fade">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{fileSuccess}</span>
                  </div>
                )}

                {/* Code Textarea editor */}
                <div className="relative flex-1 flex flex-col min-h-[350px]">
                  {isFileLoading ? (
                    <div className="absolute inset-0 bg-slate-900/10 rounded-xl flex items-center justify-center backdrop-blur-sm z-10">
                      <RefreshCw className="h-8 w-8 animate-spin text-aast-navy" />
                    </div>
                  ) : null}
                  <textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={20}
                    className="w-full flex-1 font-mono text-[11px] p-4 bg-slate-950 text-slate-100 rounded-xl border border-slate-900 focus:outline-none focus:ring-1 focus:ring-aast-gold leading-relaxed tab-size-2 resize-none h-[420px]"
                    placeholder="Load a code file from the workspace to begin editing..."
                  />
                </div>

                <div className="text-[10px] text-slate-400 font-medium italic shrink-0">
                  Tip: Press <code className="bg-slate-100 px-1 py-0.5 border rounded font-mono font-bold text-[9px] text-slate-600">Tab</code> to indent lines. When done editing, remember to save, then run build/lint checks in the Project Overview tab before Git Sync.
                </div>

              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                
                {/* Project Workspace default overview pane */}
                <div className="space-y-4">
                  <div className="border-b border-slate-150 pb-3">
                    <h3 className="font-bold text-slate-800 text-sm">Workspace Tools & Compilation Console</h3>
                    <p className="text-[11px] text-slate-400">Verify code correctness by running production build compilation or static code check analyses before pushing.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3 hover:shadow transition-shadow">
                      <div>
                        <h4 className="font-bold text-slate-700 text-xs flex items-center space-x-1.5">
                          <Terminal className="h-4 w-4 text-aast-navy" />
                          <span>Code Style Analyzer</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          Execute standard ESLint check validation rules across the codebase. Highly recommended after editing TSX/TS components.
                        </p>
                      </div>
                      <button
                        onClick={() => handleRunCommand('npm run lint')}
                        disabled={commandLogs.status === 'loading'}
                        className="py-1.5 bg-aast-navy text-white hover:bg-slate-800 text-[10px] font-bold rounded-lg shadow disabled:opacity-50 transition-colors flex items-center justify-center space-x-1"
                      >
                        {commandLogs.status === 'loading' && commandLogs.command === 'npm run lint' ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3 fill-aast-gold text-aast-gold" />
                        )}
                        <span>Run ESLint Code check</span>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3 hover:shadow transition-shadow">
                      <div>
                        <h4 className="font-bold text-slate-700 text-xs flex items-center space-x-1.5">
                          <Terminal className="h-4 w-4 text-aast-navy" />
                          <span>Production Bundle Build</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          Test compile the entire React project inside Vite. Ensures 0 compiler errors or syntax warnings before pushing.
                        </p>
                      </div>
                      <button
                        onClick={() => handleRunCommand('npm run build')}
                        disabled={commandLogs.status === 'loading'}
                        className="py-1.5 bg-aast-navy text-white hover:bg-slate-800 text-[10px] font-bold rounded-lg shadow disabled:opacity-50 transition-colors flex items-center justify-center space-x-1"
                      >
                        {commandLogs.status === 'loading' && commandLogs.command === 'npm run build' ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3 fill-aast-gold text-aast-gold" />
                        )}
                        <span>Run Build Compilation</span>
                      </button>
                    </div>
                  </div>

                  {/* Terminal emulator display */}
                  {commandLogs.status !== 'idle' && (
                    <div className="space-y-2 animate-fade">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Terminal Output Log: <code className="bg-slate-100 border px-1.5 py-0.5 rounded font-mono text-[9px]">{commandLogs.command}</code></span>
                        {commandLogs.status === 'loading' && <span className="text-aast-gold animate-pulse text-[10px] uppercase font-bold">Executing task...</span>}
                        {commandLogs.status === 'success' && <span className="text-emerald-600 font-bold text-[10px] uppercase flex items-center space-x-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Exit Code 0 (Success)</span>
                        </span>}
                        {commandLogs.status === 'error' && <span className="text-rose-600 font-bold text-[10px] uppercase flex items-center space-x-1">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Process Failed</span>
                        </span>}
                      </div>

                      <div className="bg-slate-900 border border-slate-950 rounded-2xl p-4 font-mono text-[10px] text-slate-350 shadow-inner h-[230px] overflow-y-auto space-y-2">
                        {commandLogs.stdout && (
                          <div className="space-y-1">
                            <span className="text-slate-500 font-bold">STDOUT:</span>
                            <pre className="whitespace-pre-wrap leading-relaxed">{commandLogs.stdout}</pre>
                          </div>
                        )}
                        {commandLogs.stderr && (
                          <div className="text-rose-350 space-y-1 mt-2">
                            <span className="text-rose-500 font-bold">STDERR:</span>
                            <pre className="whitespace-pre-wrap leading-relaxed">{commandLogs.stderr}</pre>
                          </div>
                        )}
                        {commandLogs.error && (
                          <div className="text-red-400 font-bold mt-2">
                            CLI ERROR details: {commandLogs.error}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                <div className="border-t border-slate-150 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
                  <div className="text-[10px] text-slate-400 font-medium">
                    Ready to publish your file or config modifications? Double-check build outputs first, then proceed to Git Sync.
                  </div>
                  <button
                    onClick={() => setActivePanel('git')}
                    className="py-1.5 px-4 bg-slate-100 hover:bg-slate-205 border text-xs font-bold text-slate-700 rounded-lg flex items-center space-x-1.5 transition-colors"
                  >
                    <GitBranch className="h-3.5 w-3.5 text-aast-gold" />
                    <span>Go to GitHub Upload & Sync</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* --- GitHub Sync & Deploy Tab --- */}
      {activePanel === 'git' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <div className="h-10 w-10 rounded-full bg-aast-navy/5 text-aast-navy flex items-center justify-center">
              <GitPullRequest className="h-5 w-5 text-aast-gold" />
            </div>
            <div>
              <h3 className="font-bold text-aast-navy text-sm">Upload Changes to GitHub</h3>
              <p className="text-[11px] text-slate-400">Sync local database adjustments and code modifications back to the remote repository.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2 text-xs">
                <h4 className="font-bold text-slate-700 flex items-center space-x-1">
                  <GitBranch className="h-4 w-4 text-aast-gold" />
                  <span>Deployment Workflow</span>
                </h4>
                <p className="text-slate-550 leading-relaxed">
                  When you submit updates here:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-500">
                  <li>Changes are staged automatically.</li>
                  <li>A commit is recorded with your message.</li>
                  <li>Files are pushed directly to the remote repository origin branch.</li>
                </ol>
              </div>

              <form onSubmit={handleGitPush} className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Commit Message</label>
                  <input
                    type="text"
                    required
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="e.g. Updated Week 2 lecture filling algorithm math notes"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                  />
                </div>

                <button
                  type="submit"
                  disabled={gitStatus.status === 'loading'}
                  className="w-full py-2.5 bg-aast-navy text-white hover:bg-slate-800 text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 shadow disabled:opacity-50 transition-colors"
                >
                  {gitStatus.status === 'loading' ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-aast-gold" />
                      <span>Pushing changes...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-aast-gold text-aast-gold" />
                      <span>Publish Changes to GitHub</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-655">Git Console Logs</h4>
                
                {gitStatus.status === 'success' && (
                  <span className="flex items-center space-x-1 text-emerald-600 font-bold text-[10px] uppercase">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Sync Complete</span>
                  </span>
                )}
                
                {gitStatus.status === 'error' && (
                  <span className="flex items-center space-x-1 text-rose-600 font-bold text-[10px] uppercase">
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Sync Failed</span>
                  </span>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-955 rounded-2xl p-4 font-mono text-[10px] text-slate-350 shadow-inner h-[250px] overflow-y-auto space-y-2">
                {gitStatus.status === 'idle' && (
                  <div className="text-slate-500 italic">Console idle. Awaiting push trigger...</div>
                )}
                {gitStatus.status === 'loading' && (
                  <div className="text-aast-gold animate-pulse">$ git add . && git commit -m "{commitMessage || 'Instructor updates'}" && git push...</div>
                )}
                {gitStatus.message && (
                  <div className={gitStatus.status === 'success' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {gitStatus.message}
                  </div>
                )}
                {(gitStatus.stdout || gitStatus.stderr) && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    {gitStatus.stdout && (
                      <div className="text-slate-300">
                        <span className="text-slate-550 font-bold">STDOUT:</span>
                        <pre className="mt-1 whitespace-pre-wrap leading-relaxed">{gitStatus.stdout}</pre>
                      </div>
                    )}
                    {gitStatus.stderr && (
                      <div className="text-rose-350 mt-2">
                        <span className="text-rose-500 font-bold">STDERR / ERR LOG:</span>
                        <pre className="mt-1 whitespace-pre-wrap leading-relaxed">{gitStatus.stderr}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
