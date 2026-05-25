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

export interface SolvedProblem {
  id: string;
  title: string;
  statement: string;
  method: string;
  steps: string[];
  finalAnswer: string;
}

export interface Lecture {
  id: string;
  week: string;
  title: string;
  description: string;
  pdfUrl: string;
  sectionUrls: string[];
  sourceUrls?: string[];
  concepts: string[];
  keyDetails: LectureDetail[];
  solvedProblems: SolvedProblem[];
}

export interface ExerciseColumn {
  key: string;
  label: string;
}

export interface ExerciseRow {
  step: number;
  values: Record<string, string | number>;
}

export interface Exercise {
  id: string;
  type:
    | 'rn_mapping'
    | 'monte_carlo'
    | 'multi_stage'
    | 'time_event_scan'
    | 'queue_trace'
    | 'inventory_trace'
    | 'validation'
    | 'mid_square'
    | 'lcg_congruential'
    | 'discrete_mapping'
    | 'variance_reduction'
    | 'assembly_blocking'
    | 'clock_scan_comparison'
    | 'continuous_mm1'
    | 'inverse_transform';
  title: string;
  description: string;
  hint: string;
  columns: ExerciseColumn[];
  rows: ExerciseRow[];
}

export interface ApplicationCard {
  id: string;
  title: string;
  focus: string;
  summary: string;
  relatedWeeks: string[];
  metrics: string[];
  demoType:
    | 'rng'
    | 'queue'
    | 'inventory'
    | 'repairman'
    | 'assembly'
    | 'validation'
    | 'accident_football'
    | 'traffic_light'
    | 'mid_square'
    | 'mm1_queue';
}
