import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { CurriculumDemoWrapper } from './CurriculumDemoWrapper';
import type { TimelineScenario } from './TimelineDemo';

/**
 * Enhanced Curriculum View
 * Displays deep narrative explanations, visual hierarchy, and integrated demos
 * Replaces the minimal LecturesView with comprehensive course content
 */

interface Explanation {
  id: string;
  title: string;
  type: 'narrative' | 'concept' | 'warning' | 'example';
  content: string;
  sourceReference?: string;
  order: number;
}

interface LectureWithNarrative {
  id: string;
  week: string;
  title: string;
  shortDescription: string;
  explanations: Explanation[];
  concepts: string[];
  keyTerms: Record<string, string>;
  solvedProblems: Array<{
    id: string;
    title: string;
    statement: string;
    method: string;
    steps: string[];
    finalAnswer: string;
  }>;
  learningOutcomes: string[];
  demoComponent?: string; // Identifier like 'rnVisualization', 'queueTimeline', etc.
  demoScenario?: TimelineScenario; // Optional TimelineScenario for visualization
}

interface EnhancedCurriculumViewProps {
  lectures: LectureWithNarrative[];
  onNavigateToExercise?: (exerciseId: string) => void;
}

export const EnhancedCurriculumView: React.FC<EnhancedCurriculumViewProps> = ({
  lectures,
  onNavigateToExercise,
}) => {
  const [selectedId, setSelectedId] = useState<string>(lectures[0]?.id ?? '');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['explanations', 'concepts', 'outcomes'])
  );
  const [expandedProblems, setExpandedProblems] = useState<Record<string, boolean>>({});

  const selected = useMemo(() => lectures.find((l) => l.id === selectedId) ?? lectures[0], [lectures, selectedId]);

  const toggleSection = (sectionId: string) => {
    const next = new Set(expandedSections);
    if (next.has(sectionId)) {
      next.delete(sectionId);
    } else {
      next.add(sectionId);
    }
    setExpandedSections(next);
  };

  const toggleProblem = (id: string) => {
    setExpandedProblems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const explanationsByType = useMemo(() => {
    const narrative = selected.explanations.filter((e) => e.type === 'narrative').sort((a, b) => a.order - b.order);
    const concepts = selected.explanations.filter((e) => e.type === 'concept').sort((a, b) => a.order - b.order);
    const examples = selected.explanations.filter((e) => e.type === 'example').sort((a, b) => a.order - b.order);
    const warnings = selected.explanations.filter((e) => e.type === 'warning').sort((a, b) => a.order - b.order);
    return { narrative, concepts, examples, warnings };
  }, [selected]);

  if (!selected) {
    return <div className="text-sm text-slate-600">No curriculum found.</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-4 animate-fade-in">
      {/* Sidebar: Week Navigation */}
      <aside className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm h-fit sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar space-y-3">
        <h3 className="text-xs uppercase font-black tracking-widest text-aast-navy mb-2 border-b border-slate-100 pb-2">
          Course Progression
        </h3>
        <div className="space-y-1.5">
          {lectures.map((lec) => (
            <button
              key={lec.id}
              onClick={() => setSelectedId(lec.id)}
              className={`w-full text-left rounded-xl px-4 py-3 text-xs border transition-all duration-300 transform hover:-translate-y-0.5 ${
                selected.id === lec.id
                  ? 'bg-gradient-to-r from-aast-navy via-aast-navy-light to-aast-navy text-aast-gold border-aast-navy shadow-md font-black ring-2 ring-aast-gold/20'
                  : 'bg-slate-50/50 hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="text-[10px] opacity-75 font-semibold font-mono">{lec.week}</div>
              <div className="font-extrabold truncate text-xs mt-0.5">{lec.title}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content: Deep Narrative */}
      <main className="lg:col-span-3 space-y-6">
        {/* Header */}
        <section className="bg-gradient-to-br from-aast-navy via-aast-navy-light to-aast-navy-dark rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-aast-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="text-[10px] uppercase font-black text-aast-gold bg-aast-gold/15 px-2.5 py-1 rounded-full border border-aast-gold/30 tracking-widest inline-block mb-2 font-mono">
                {selected.week}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{selected.title}</h1>
              <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">{selected.shortDescription}</p>
            </div>
            <BookOpen className="h-14 w-14 text-aast-gold/20 hidden md:block flex-shrink-0" />
          </div>
        </section>

        {/* Warnings / Operational Constraints */}
        {explanationsByType.warnings.length > 0 && (
          <div className="space-y-3">
            {explanationsByType.warnings.map((exp) => (
              <div key={exp.id} className="bg-rose-50/80 border border-rose-200/50 rounded-2xl p-4 flex gap-3 shadow-sm animate-pulse-subtle">
                <span className="text-rose-600 font-black text-base flex-shrink-0">⚠</span>
                <div>
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">{exp.title}</h4>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">{exp.content}</p>
                  {exp.sourceReference && (
                    <span className="inline-block text-[8px] text-rose-400 font-bold mt-2">
                      Reference: {exp.sourceReference}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Learning Outcomes */}
        {expandedSections.has('outcomes') && (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <button
              onClick={() => toggleSection('outcomes')}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-base font-black text-aast-navy tracking-tight">Weekly Learning Targets</h2>
              <ChevronDown className={`h-4 w-4 text-aast-navy transition-transform duration-300 ${expandedSections.has('outcomes') ? '' : 'rotate-180'}`} />
            </button>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {selected.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <span className="text-aast-gold font-bold text-sm bg-aast-gold/10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">✓</span>
                  <span className="text-xs text-slate-700 leading-normal">{outcome}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Lab / Demo Visualizer */}
        {(selected.demoComponent || selected.demoScenario) && (
          <CurriculumDemoWrapper
            demoComponent={selected.demoComponent}
            demoScenario={selected.demoScenario}
            weekId={selected.id}
          />
        )}

        {/* Narrative Explanations & Core Readings */}
        {expandedSections.has('explanations') && (explanationsByType.narrative.length > 0 || explanationsByType.concepts.length > 0) && (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <button
              onClick={() => toggleSection('explanations')}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-base font-black text-aast-navy tracking-tight">Core Curriculum Readings</h2>
              <ChevronDown className={`h-4 w-4 text-aast-navy transition-transform duration-300 ${expandedSections.has('explanations') ? '' : 'rotate-180'}`} />
            </button>
            <div className="space-y-4">
              {[...explanationsByType.narrative, ...explanationsByType.concepts].map((exp) => (
                <div key={exp.id} className="border-l-4 border-aast-gold bg-slate-50/40 hover:bg-slate-50 transition-colors pl-4 pr-3 py-3 rounded-r-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-aast-navy-light">{exp.title}</h4>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">{exp.content}</p>
                  {exp.sourceReference && (
                    <span className="inline-block text-[9px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded font-mono">
                      Reference: {exp.sourceReference}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Detailed Examples & Math Traces */}
        {explanationsByType.examples.length > 0 && (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-black text-aast-navy tracking-tight">Formulas, Programs & Step-by-Step Traces</h2>
            <div className="space-y-4">
              {explanationsByType.examples.map((exp) => (
                <div key={exp.id} className="bg-slate-900 border border-slate-800 text-slate-100 p-5 rounded-2xl space-y-3 shadow-inner font-sans">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-black text-aast-gold uppercase tracking-wider">{exp.title}</h4>
                    <span className="text-[9px] font-mono text-slate-500">Dr. Farouk Shaaban Formulation</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-wrap overflow-x-auto custom-scrollbar">
                    {exp.content}
                  </div>
                  {exp.sourceReference && (
                    <span className="inline-block text-[9px] text-slate-500 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono">
                      Reference: {exp.sourceReference}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Concepts */}
        {selected.keyTerms && Object.keys(selected.keyTerms).length > 0 && (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <button
              onClick={() => toggleSection('concepts')}
              className="w-full flex items-center justify-between text-left mb-4"
            >
              <h2 className="text-base font-black text-aast-navy tracking-tight">Glossary of Key Terms</h2>
              <ChevronDown className={`h-4 w-4 text-aast-navy transition-transform duration-300 ${expandedSections.has('concepts') ? '' : 'rotate-180'}`} />
            </button>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(selected.keyTerms).map(([term, def]) => (
                <div key={term} className="bg-slate-50 border border-slate-100 hover:border-aast-gold/40 hover:bg-aast-gold-soft/20 rounded-xl p-3.5 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-sm">
                  <p className="font-extrabold text-xs text-aast-navy tracking-tight">{term}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">{def}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Solved Problems */}
        {selected.solvedProblems && selected.solvedProblems.length > 0 && (
          <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-base font-black text-aast-navy tracking-tight">Solved Curriculum Practice Problems</h2>
            <div className="space-y-3">
              {selected.solvedProblems.map((p) => {
                const isOpen = !!expandedProblems[p.id];
                return (
                  <div
                    key={p.id}
                    className="border border-slate-150 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
                  >
                    <button
                      onClick={() => toggleProblem(p.id)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left"
                    >
                      <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-aast-gold" />
                        {p.title}
                      </span>
                      <ChevronRight className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 border-t border-slate-150 bg-white space-y-3 animate-fade-in text-[11px] leading-relaxed">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-slate-700 font-medium">
                            <strong className="text-slate-900 font-extrabold block mb-1">Problem Statement:</strong> 
                            {p.statement}
                          </p>
                        </div>
                        {p.method && (
                          <p className="text-slate-600">
                            <strong className="text-slate-800 font-extrabold">Solution Methodology:</strong> {p.method}
                          </p>
                        )}
                        {p.steps && p.steps.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="font-extrabold text-slate-800">Computation Steps:</p>
                            <ol className="list-decimal ml-4 space-y-1 text-slate-600 font-medium">
                              {p.steps.map((s, idx) => (
                                <li key={idx} className="pl-1">{s}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                        <div className="bg-emerald-50 border border-emerald-200/50 rounded-lg p-3 flex justify-between items-center mt-3 shadow-inner">
                          <div>
                            <span className="text-[9px] font-bold text-emerald-600 uppercase block tracking-wider font-mono">Final Analytical Answer</span>
                            <strong className="text-emerald-800 text-xs font-black">{p.finalAnswer}</strong>
                          </div>
                          <span className="text-emerald-500 text-lg font-mono">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {onNavigateToExercise && (
              <div className="pt-2 text-center sm:text-left">
                <button
                  onClick={() => onNavigateToExercise(selected.id)}
                  className="px-5 py-2.5 text-xs font-black rounded-xl bg-gradient-to-r from-aast-gold to-aast-gold-light hover:from-aast-gold-dark hover:to-aast-gold text-aast-navy shadow transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Start Lab Practice & Trace Tables
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default EnhancedCurriculumView;
