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
  w2: ["Congruential method (LCG)", "Pseudo-random number generation", "Seed and period", "C++ coin tossing code"],
  w3: ["Monte Carlo trials", "Empirical probability convergence", "Bowl mapping", "Expected daily demand"],
  w4: ["Discrete observation mapping", "Single-digit RN mapping", "Rejection logic for die", "Traffic light probability intervals"],
  w5: ["Discrete and continuous distributions", "Expected value and variance", "Multi-stage conditional branching", "Insurance problem simulation"],
  w6: ["Variance reduction techniques", "Antithetic variates", "Complement random numbers", "Estimation error comparison"],
  w7: ["Queueing system notation A/B/C/D/E", "Little's formula", "Stochastic balance equations", "M/M/1 state probabilities"],
  w8: ["Inverse transform method", "Uniform distribution inversion", "Exponential distribution inversion", "Allocation vs inverse method"],
  w9: ["Exam debrief and corrections", "Inventory reorder point", "Stockout and carrying cost", "Lead time trace"],
  w10: ["Time-to-failure (TTF) simulation", "Preventive vs breakdown maintenance", "Machine availability", "Tube replacement cost analysis"],
  w11: ["Serial assembly line (Bob & Ray)", "Bottleneck identification", "Blocking and starvation", "Throughput bound"],
  w12: ["Simulation clock types", "Periodic scan technique", "Event scan / FEL technique", "10-minute station trace"],
  w13: ["M/M/1 time scan vs event scan", "Transition probability in dt", "Finite-source repairman model", "Machine downtime calculation"]
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
