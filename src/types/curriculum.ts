/**
 * Enhanced Curriculum Data Model
 * Supports deeper narrative explanations, visual demos, and comprehensive course structure
 */

// ===== DEEP LECTURE EXPLANATIONS =====
export interface LectureExplanation {
  id: string; // e.g. "w1_intro", "w1_system_def"
  title: string;
  order: number; // Sequence within lecture
  type: 'narrative' | 'concept' | 'warning' | 'example' | 'visual_cue';
  content: string; // Paraphrased or verbatim from curriculum, with source citations
  sourceReference?: string; // e.g. "Curriclum.pdf, p. 5" or "sim week 1 sec.pptx, slide 3"
  relatedProblems?: string[]; // e.g. ["w1_p1", "w1_p2"]
  visualHint?: string; // Instruction for what visual/demo should accompany this
}

// ===== VISUAL DEMO DEFINITION =====
export interface DemoDefinition {
  id: string; // e.g. "demo_pump_timeline", "demo_queue_trace"
  lectureId: string;
  title: string;
  description: string;
  type: 'timeline' | 'trace_table' | 'interactive_sim' | 'chart' | 'animation';
  config?: Record<string, unknown>; // Demo-specific configuration
  scenarioDescription?: string; // What problem/scenario does this illustrate?
}

// ===== ENHANCED LECTURE =====
export interface EnhancedLecture {
  id: string;
  week: string;
  title: string;
  shortDescription: string;
  
  // Deep explanation
  explanations: LectureExplanation[];
  
  // Core concepts
  concepts: string[];
  keyTerms: Record<string, string>; // term -> definition
  
  // Resource links
  mainPdfUrl: string;
  sectionPdfUrls: string[];
  sourceUrls?: string[];
  videoUrls?: string[]; // Links to related videos (e.g., animation.mp4)
  
  // Problems and demos
  solvedProblems: SolvedProblem[];
  integrationDemos: DemoDefinition[];
  
  // Learning outcomes
  learningOutcomes: string[]; // What should student know/do after this week?
}

// ===== SOLVED PROBLEM (EXTENDED) =====
export interface SolvedProblem {
  id: string;
  title: string;
  statement: string;
  method: string;
  steps: string[];
  finalAnswer: string;
  explanation?: string; // Narrative explanation of the solution
  relatedConcepts?: string[]; // Link to lecture concepts
  difficulty?: 'easy' | 'medium' | 'hard';
}

// ===== TIMELINE DEMO SCENARIO =====
export interface TimelineEvent {
  time: number;
  label: string;
  description: string;
  entities?: Record<string, unknown>; // State of entities at this time
  highlight?: string; // CSS class or ID for visual emphasis
}

export interface TimelineDemo {
  id: string;
  title: string;
  description: string;
  timelineEvents: TimelineEvent[];
  initialState?: Record<string, unknown>;
  finalState?: Record<string, unknown>;
  notes?: string;
}

// ===== TRACE TABLE EXERCISE (EXTENDED) =====
export interface TraceTableRow {
  step: number;
  values: Record<string, string | number>;
  explanation?: string; // Why this row's values are important
}

export interface TraceTableExercise {
  id: string;
  lectureId: string;
  type: string;
  title: string;
  description: string;
  scenario?: string; // Background/problem context
  hint: string;
  columns: Array<{ key: string; label: string; description?: string }>;
  rows: TraceTableRow[];
  solutionNotes?: string; // Explain common mistakes or key insights
}

// ===== CURRICULUM STRUCTURE =====
export interface EnhancedCurriculum {
  title: string;
  courseCode: string;
  instructor: string;
  semester: string;
  totalWeeks: number;
  learningOutcomes: string[]; // Course-level outcomes
  lectures: EnhancedLecture[];
  textbookReference: {
    title: string;
    authors: string;
    year: number;
    publisher: string;
  };
}
