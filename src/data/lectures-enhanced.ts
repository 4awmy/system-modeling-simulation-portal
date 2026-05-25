import { enhancedCurriculumWeeks as w1Data } from './curriculum-enhanced-w1';
import { enhancedCurriculumWeeks as w2w13Data } from './curriculum-enhanced-w2-w13';
import { demoScenarioMap } from './demo-scenarios';
import type { TimelineScenario } from '../components/TimelineDemo';

export interface EnhancedLectureData {
  id: string;
  week: string;
  title: string;
  shortDescription: string;
  concepts: string[];
  learningOutcomes: string[];
  explanations: Array<{
    id: string;
    title: string;
    type: 'narrative' | 'concept' | 'warning' | 'example';
    content: string;
    sourceReference?: string;
    order: number;
  }>;
  keyTerms: Record<string, string>;
  solvedProblems: Array<{
    id: string;
    title: string;
    statement: string;
    method: string;
    steps: string[];
    finalAnswer: string;
  }>;
  demoComponent?: string;
  demoScenario?: TimelineScenario;
}

const conceptsByWeek: Record<string, string[]> = {
  w1: ["System definition", "State variables", "Entity-Activity-Event", "Deterministic vs stochastic", "Planning-Modeling-Validation-Application"],
  w2: ["Cumulative probability", "RN interval mapping", "Discrete demand simulation", "Trace-table setup"],
  w3: ["Monte Carlo trials", "Empirical probability", "Large-sample stabilization", "Demand simulation"],
  w4: ["Case-based simulation", "Outcome probability tables", "Risk/cost estimation", "Scenario interpretation"],
  w5: ["Discrete vs continuous distributions", "Expected value and variance", "Conditional branching", "Two-stage RN streams"],
  w6: ["Clock advance", "Future Event List (FEL)", "Periodic scan", "Next-event simulation"],
  w7: ["CDF derivation", "Inverse transform method", "Uniform distribution", "Exponential distribution", "Queue model inputs"],
  w8: ["Revision drills", "Goodness-of-fit support", "Z-table usage", "Validation readiness"],
  w9: ["Midterm solution analysis", "Trace correction", "Interpretation quality", "Coverage integration"],
  w10: ["Reliability simulation", "Time-to-failure mapping", "Replacement policy", "Downtime/cost metrics"],
  w11: ["Serial service stations", "Blocking and waiting", "Throughput limits", "Bottleneck identification"],
  w12: ["Finite-source repair model", "Service capacity effect", "Machine downtime", "Cost comparison"],
  w13: ["M/M/1 metrics (P0, L, Lq, W, Wq)", "Event-driven execution", "Time-driven execution", "Method comparison"]
};

const allWeeks = {
  w1: w1Data.w1,
  ...w2w13Data
};

export const enhancedLectures: EnhancedLectureData[] = Object.keys(allWeeks).map((key) => {
  const weekId = key as keyof typeof allWeeks;
  const rawWeek = allWeeks[weekId];
  return {
    id: rawWeek.id,
    week: rawWeek.week,
    title: rawWeek.title,
    shortDescription: rawWeek.shortDescription,
    concepts: conceptsByWeek[rawWeek.id] || [],
    learningOutcomes: rawWeek.learningOutcomes,
    explanations: rawWeek.explanations as any[],
    keyTerms: rawWeek.keyTerms,
    solvedProblems: rawWeek.solvedProblems,
    demoComponent: (rawWeek as any).demoComponent,
    demoScenario: demoScenarioMap[rawWeek.id]
  };
});

export default enhancedLectures;
