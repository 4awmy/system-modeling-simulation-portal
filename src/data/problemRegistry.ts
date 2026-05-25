import type { SolvedProblem } from '../types/simulation';

export interface WeekProblemRegistry {
  weekId: string;
  week: string;
  title: string;
  topics: string[];
  sourceArtifacts: string[];
  problems: SolvedProblem[];
}

export const problemRegistry: WeekProblemRegistry[] = [
  {
    "weekId": "w1",
    "week": "Week 01",
    "title": "Simulation Foundations: Systems, States, and Terminology",
    "topics": [
      "system concepts",
      "state definition",
      "events and activities"
    ],
    "sourceArtifacts": [
      "Study/Session1_Foundations/Session1_Foundations.md",
      "Lectures/Curriclum.pdf",
      "Section/Week 01/sim week 1 sec .pptx"
    ],
    "problems": [
      {
        "id": "w1_p1",
        "title": "Classify a system by behavior",
        "statement": "Classify an ATM service desk as natural/man-made, deterministic/stochastic, and discrete/continuous.",
        "method": "System classification checklist",
        "steps": [
          "Identify origin: ATM is engineered by humans => man-made.",
          "Check uncertainty: arrivals/service durations vary => stochastic.",
          "Check state changes: queue length changes at events => discrete."
        ],
        "finalAnswer": "ATM desk is man-made, stochastic, and discrete."
      },
      {
        "id": "w1_p2",
        "title": "State vector definition for single server",
        "statement": "Define the minimal state for a one-server queue with FCFS service.",
        "method": "Minimal-state abstraction",
        "steps": [
          "Track server status (idle/busy).",
          "Track number of customers waiting in queue.",
          "Use arrivals/departures as event triggers updating these states."
        ],
        "finalAnswer": "Minimal state is (server status, queue length)."
      },
      {
        "id": "w1_p3",
        "title": "Activity versus event distinction",
        "statement": "In a machine-shop model, classify service time and machine breakdown as activity or event.",
        "method": "Definition-based classification",
        "steps": [
          "Activity has duration; event is instantaneous.",
          "Service process lasts over time => activity.",
          "Breakdown occurrence changes state at an instant => event."
        ],
        "finalAnswer": "Service time is an activity; breakdown occurrence is an event."
      }
    ]
  },
  {
    "weekId": "w2",
    "week": "Week 02",
    "title": "Random Number Mapping for Discrete Outcomes",
    "topics": [
      "random number mapping",
      "cumulative probability"
    ],
    "sourceArtifacts": [
      "Study/Session1_Foundations/Session1_Foundations.md",
      "Section/Week 02/Simulation week 2 sec.pdf"
    ],
    "problems": [
      {
        "id": "w2_p1",
        "title": "Discrete demand mapping from cumulative probability",
        "statement": "Demand probabilities: D0=0.1, D1=0.5, D2=0.4. Determine demand for RN=42.",
        "method": "00-99 cumulative mapping",
        "steps": [
          "Build ranges: 00-09 -> D0, 10-59 -> D1, 60-99 -> D2.",
          "Locate RN=42 in the table.",
          "Read mapped outcome from interval 10-59."
        ],
        "finalAnswer": "Demand outcome is D1."
      },
      {
        "id": "w2_p2",
        "title": "Coin toss simulation mapping",
        "statement": "For fair-coin simulation with RN in [0,1), map RN=0.73 and RN=0.18 to outcomes.",
        "method": "RN interval partitioning",
        "steps": [
          "Use rule: RN < 0.5 => Head, else Tail.",
          "RN=0.73 is in [0.5,1) => Tail.",
          "RN=0.18 is in [0,0.5) => Head."
        ],
        "finalAnswer": "Outcomes are Tail for 0.73 and Head for 0.18."
      },
      {
        "id": "w2_p3",
        "title": "Range-table construction check",
        "statement": "Given probabilities [0.2, 0.3, 0.5], build 00-99 mapping intervals.",
        "method": "Cumulative boundary construction",
        "steps": [
          "Compute cumulative probabilities: 0.2, 0.5, 1.0.",
          "Allocate first 20 numbers to outcome 1: 00-19.",
          "Allocate next 30 numbers to outcome 2: 20-49, remaining 50 to outcome 3: 50-99."
        ],
        "finalAnswer": "Intervals are 00-19, 20-49, and 50-99."
      }
    ]
  },
  {
    "weekId": "w3",
    "week": "Week 03",
    "title": "Monte Carlo Trial Execution and Frequency Stability",
    "topics": [
      "monte carlo trials",
      "convergence"
    ],
    "sourceArtifacts": [
      "Study/All_Sections/Simulation_All_Sections.md",
      "Section/Week 03/Simulation-Section_3.pdf"
    ],
    "problems": [
      {
        "id": "w3_p1",
        "title": "100-trial fair coin estimate",
        "statement": "Estimate P(Head) using 100 Monte Carlo draws.",
        "method": "Trial replication",
        "steps": [
          "Generate 100 independent RN values.",
          "Count heads where RN<0.5.",
          "Divide head count by 100."
        ],
        "finalAnswer": "Empirical estimate approaches 0.5 with enough trials."
      },
      {
        "id": "w3_p2",
        "title": "Convergence comparison across sample sizes",
        "statement": "Compare error from 20 trials versus 200 trials for same Bernoulli process.",
        "method": "Frequency stability analysis",
        "steps": [
          "Compute p-hat at n=20 and n=200.",
          "Measure absolute error against theoretical probability.",
          "Observe lower variability for n=200."
        ],
        "finalAnswer": "Larger sample size gives a more stable, lower-error estimate."
      },
      {
        "id": "w3_p3",
        "title": "Empirical demand distribution from traces",
        "statement": "From simulated demands [0,1,2,1,1,2,0,1,2,1], estimate probabilities.",
        "method": "Relative frequency",
        "steps": [
          "Count each demand value occurrences.",
          "Convert counts to proportions by dividing by 10.",
          "Report empirical distribution and compare to input distribution."
        ],
        "finalAnswer": "Estimated probabilities are P(0)=0.2, P(1)=0.5, P(2)=0.3."
      }
    ]
  },
  {
    "weekId": "w4",
    "week": "Week 04",
    "title": "Case Simulation I: Accident and Football Risk Problems",
    "topics": [
      "inventory logic",
      "accident and football case studies"
    ],
    "sourceArtifacts": [
      "Section/Week 04/Accident Problem.pdf",
      "Section/Week 04/Football problem.pdf",
      "Study/Session2_BusinessLogic/Session2_BusinessLogic.md"
    ],
    "problems": [
      {
        "id": "w4_p1",
        "title": "Accident frequency simulation (12 days)",
        "statement": "Use Week 4 accident table (2-6 accidents/day with given probabilities) to simulate 12 days.",
        "method": "RN-to-outcome mapping with day trace",
        "steps": [
          "Convert accident probabilities into cumulative RN intervals.",
          "Map 12 random numbers to daily accident counts.",
          "Sum and average daily accidents from the simulated horizon."
        ],
        "finalAnswer": "A complete 12-day trace yields estimated mean accidents/day from mapped outcomes."
      },
      {
        "id": "w4_p2",
        "title": "Football running-backs choice problem",
        "statement": "From the Week 4 football problem, select running back outcomes according to probability ranges.",
        "method": "Categorical Monte Carlo selection",
        "steps": [
          "Build RN intervals for the six running backs.",
          "Map each generated RN to one running back outcome.",
          "Summarize frequencies to support decision comparison."
        ],
        "finalAnswer": "Mapped frequencies approximate the original running-back probabilities."
      },
      {
        "id": "w4_p3",
        "title": "Reorder-point trigger with random lead time",
        "statement": "Stock starts at 12, reorder point=5, daily demand [2,3,4,1,2], lead-time drawn from distribution.",
        "method": "Inventory state transition trace",
        "steps": [
          "Update end-of-day stock after each demand.",
          "Place order when stock <= reorder point and no outstanding order.",
          "Schedule order arrival using sampled lead-time and continue trace."
        ],
        "finalAnswer": "Order is triggered once stock crosses the threshold and arrives after sampled lead time."
      }
    ]
  },
  {
    "weekId": "w5",
    "week": "Week 05",
    "title": "Distributions and Multi-Stage Decision Simulation",
    "topics": [
      "multi-stage decisions",
      "insurance simulation"
    ],
    "sourceArtifacts": [
      "Section/Week 05/Simulation-Section_5.pdf",
      "Study/Session2_BusinessLogic/Session2_BusinessLogic.md"
    ],
    "problems": [
      {
        "id": "w5_p1",
        "title": "Insurance call two-stage simulation",
        "statement": "Using section-5 rules: RN1=30 (interest), RN2=85 (policy type), determine sale outcome.",
        "method": "Conditional branching with two RN streams",
        "steps": [
          "Map RN1 against interest range (00-49 => interested).",
          "Since interested, map RN2 against policy-type intervals.",
          "Read final branch outcome from second-stage range."
        ],
        "finalAnswer": "Outcome is a large policy sale."
      },
      {
        "id": "w5_p2",
        "title": "Expected policy value over 20 calls",
        "statement": "Simulate 20 house calls and estimate expected policy value per call.",
        "method": "Repeated branch simulation with payoff averaging",
        "steps": [
          "For each call, execute interest branch then sale-type branch.",
          "Assign payoff (no sale, small policy, large policy) by outcome.",
          "Average total payoff over 20 calls."
        ],
        "finalAnswer": "Expected value is total simulated revenue divided by 20 calls."
      },
      {
        "id": "w5_p3",
        "title": "Discrete vs continuous distribution moments",
        "statement": "From Section 5 Problem 1, compute mean and variance for one discrete and one continuous example.",
        "method": "Distribution moment formulas",
        "steps": [
          "For discrete X: compute E[X]=Σxp(x) and Var[X]=E[X^2]-E[X]^2.",
          "For continuous X: compute E[X]=∫xf(x)dx and Var[X]=E[X^2]-E[X]^2.",
          "Evaluate numerically for provided parameters in the sheet."
        ],
        "finalAnswer": "Mean and variance follow standard discrete/continuous moment definitions."
      }
    ]
  },
  {
    "weekId": "w6",
    "week": "Week 06",
    "title": "Time-Advance Methods: Periodic Scan vs Event Scan",
    "topics": [
      "time advance",
      "future event list"
    ],
    "sourceArtifacts": [
      "Section/Week 06/Section (6). Simulation.pdf",
      "Section/Week 13/Event Driven.pdf",
      "Section/Week 13/Time Driven.pdf"
    ],
    "problems": [
      {
        "id": "w6_p1",
        "title": "Periodic versus event-scan timeline",
        "statement": "Events occur at t=3 (arrival) and t=8 (departure). Compare checks for Δt=1 periodic scan vs event scan.",
        "method": "Clock-advance comparison",
        "steps": [
          "Periodic scan evaluates times 0 through 8 each tick.",
          "Event scan jumps directly to t=3 then t=8.",
          "Count checks/events processed by each method."
        ],
        "finalAnswer": "Event scan processes only real event times and needs fewer checks."
      },
      {
        "id": "w6_p2",
        "title": "Future Event List ordering",
        "statement": "Given FEL entries D@12, A@7, A@10, process next two events.",
        "method": "Priority-by-time event scheduling",
        "steps": [
          "Sort FEL by smallest event time.",
          "Execute A@7 then update state and schedule any follow-up event.",
          "Execute next earliest event from updated FEL."
        ],
        "finalAnswer": "Events are handled in chronological order: A@7 then A@10 (before D@12)."
      },
      {
        "id": "w6_p3",
        "title": "Single-server state update on arrival/departure",
        "statement": "Server idle at t=0, arrivals at t=1 and t=2, service time=3 each. Trace queue length and server status.",
        "method": "Event-by-event state transition",
        "steps": [
          "At t=1 first arrival starts service immediately.",
          "At t=2 second arrival joins queue since server is busy.",
          "At t=4 first departure occurs, queued job starts service."
        ],
        "finalAnswer": "Queue builds to length 1 at t=2 and drains when first service completes at t=4."
      }
    ]
  },
  {
    "weekId": "w7",
    "week": "Week 07",
    "title": "Queue Inputs and Random Variate Preparation",
    "topics": [
      "queue tracing",
      "waiting metrics"
    ],
    "sourceArtifacts": [
      "Section/Week 07/Simulation-Section_7.pdf",
      "Study/Session3_Performance/Session3_Performance.md"
    ],
    "problems": [
      {
        "id": "w7_p1",
        "title": "Two-customer waiting-time trace",
        "statement": "C1 arrives at 1, service 3; C2 arrives at 2, service 2. Compute waits and average wait.",
        "method": "Arrival/service/departure timeline",
        "steps": [
          "C1 starts at 1 and departs at 4 (wait=0).",
          "C2 starts at 4 and departs at 6 (wait=2).",
          "Average wait=(0+2)/2."
        ],
        "finalAnswer": "Average waiting time is 1 time unit."
      },
      {
        "id": "w7_p2",
        "title": "Queue length profile from event list",
        "statement": "Arrivals at [0,1,3], departures at [2,5,7]. Determine queue length just after each event.",
        "method": "Event-count balance",
        "steps": [
          "Start from empty system.",
          "Increment system count at arrival and decrement at departure.",
          "Record queue length considering one active server."
        ],
        "finalAnswer": "Queue length evolves by cumulative arrivals minus departures minus in-service customer."
      },
      {
        "id": "w7_p3",
        "title": "Average waiting time from full trace",
        "statement": "Waiting times are [0,1,4,2,3] minutes. Compute average and identify worst case.",
        "method": "Performance metric aggregation",
        "steps": [
          "Sum waits: 0+1+4+2+3=10.",
          "Divide by customer count 5 to get average.",
          "Find max wait by scanning list."
        ],
        "finalAnswer": "Average wait is 2 minutes; worst-case wait is 4 minutes."
      }
    ]
  },
  {
    "weekId": "w8",
    "week": "Week 08",
    "title": "Revision and Validation Tables (Chi-Square/KS Support)",
    "topics": [
      "chi-square",
      "kolmogorov-smirnov",
      "z-table"
    ],
    "sourceArtifacts": [
      "Section/Week 08 Revision/Simulation proofs.pdf",
      "Section/Week 08 Revision/Ztable.pdf",
      "Lectures/Curriclum.pdf"
    ],
    "problems": [
      {
        "id": "w8_p1",
        "title": "Chi-square goodness-of-fit statistic",
        "statement": "Observed [12,18,20,10], expected [15,15,15,15]. Compute χ².",
        "method": "Chi-square term summation",
        "steps": [
          "Compute each contribution (Oi-Ei)^2/Ei.",
          "Add all four contributions.",
          "Use DOF and alpha table for accept/reject decision."
        ],
        "finalAnswer": "χ² = 5.6 before comparing to critical value."
      },
      {
        "id": "w8_p2",
        "title": "Kolmogorov-Smirnov maximum gap",
        "statement": "For empirical CDF [0.2,0.55,0.8,1.0] and theoretical [0.25,0.5,0.75,1.0], compute D.",
        "method": "Max absolute CDF difference",
        "steps": [
          "Compute |F_emp-F_theory| at each point.",
          "Values are [0.05,0.05,0.05,0.0].",
          "Select maximum as KS statistic D."
        ],
        "finalAnswer": "D = 0.05."
      },
      {
        "id": "w8_p3",
        "title": "Z-table lookup for standardized value",
        "statement": "Find P(Z<1.25) and right-tail probability using Z-table.",
        "method": "Standard normal lookup",
        "steps": [
          "Read cumulative value at z=1.25 from table (≈0.8944).",
          "Compute right tail as 1-0.8944.",
          "Interpret as exceedance probability."
        ],
        "finalAnswer": "P(Z<1.25)≈0.8944 and P(Z>1.25)≈0.1056."
      }
    ]
  },
  {
    "weekId": "w9",
    "week": "Week 09",
    "title": "7th Exam Debrief and Integrated Trace Review",
    "topics": [
      "inventory policy sensitivity",
      "stockout metrics"
    ],
    "sourceArtifacts": [
      "Section/Week 09 7th Exam Answer/7th exam answer.pdf",
      "Exams/7th/7th Exam.pdf"
    ],
    "problems": [
      {
        "id": "w9_p1",
        "title": "Policy comparison under same demand stream",
        "statement": "Compare inventory policies RP=5 and RP=8 under identical daily demands.",
        "method": "Controlled experiment simulation",
        "steps": [
          "Run both policies with same random demand sequence.",
          "Track stockouts and average inventory for each policy.",
          "Compare service level versus holding burden."
        ],
        "finalAnswer": "Higher reorder point usually lowers stockouts and raises average stock."
      },
      {
        "id": "w9_p2",
        "title": "Stockout-day counting",
        "statement": "Given ending stocks [3,1,0,-1,4,0], count stockout days and stockout ratio.",
        "method": "Threshold-based KPI",
        "steps": [
          "Mark day as stockout when ending stock <= 0.",
          "Count marked days in horizon.",
          "Divide by total days to obtain ratio."
        ],
        "finalAnswer": "Stockout occurred on 3 of 6 days (50%)."
      },
      {
        "id": "w9_p3",
        "title": "Average inventory level from trace",
        "statement": "Daily ending stocks are [10,8,7,5,9]. Compute average inventory.",
        "method": "Time-average estimate",
        "steps": [
          "Sum levels: 10+8+7+5+9=39.",
          "Divide by 5 days.",
          "Interpret result as average carrying level."
        ],
        "finalAnswer": "Average inventory is 7.8 units."
      }
    ]
  },
  {
    "weekId": "w10",
    "week": "Week 10",
    "title": "Machine Maintenance and Replacement Simulation",
    "topics": [
      "utilization and idle time",
      "failure-repair interpretation"
    ],
    "sourceArtifacts": [
      "Section/Week 10/Week 10.pdf",
      "Section/Week 10/week 10 full solution.pdf"
    ],
    "problems": [
      {
        "id": "w10_p1",
        "title": "Server utilization from busy time",
        "statement": "Busy time is 45 minutes over a 60-minute run. Compute utilization.",
        "method": "Direct ratio",
        "steps": [
          "Use rho = busy time / total time.",
          "Substitute 45/60.",
          "Convert to percentage."
        ],
        "finalAnswer": "Utilization is 0.75 (75%)."
      },
      {
        "id": "w10_p2",
        "title": "Idle time and percentage",
        "statement": "If total run is 8 hours and busy time is 5.5 hours, compute idle time and idle percent.",
        "method": "Complementary performance metrics",
        "steps": [
          "Idle time = total - busy = 2.5 hours.",
          "Idle fraction = 2.5/8.",
          "Convert to percentage."
        ],
        "finalAnswer": "Idle time is 2.5 hours, i.e., 31.25%."
      },
      {
        "id": "w10_p3",
        "title": "Failure-repair queue interpretation",
        "statement": "In the week-10 full-solution context (frequent tube failures), explain effect of higher failure rate on queue metrics.",
        "method": "Queue pressure reasoning",
        "steps": [
          "More failures increase arrival rate to repair queue.",
          "If service capacity unchanged, waiting and queue length rise.",
          "Higher waiting raises downtime and may lower effective throughput."
        ],
        "finalAnswer": "Higher failure intensity worsens waiting, queue length, and downtime unless repair capacity is improved."
      }
    ]
  },
  {
    "weekId": "w11",
    "week": "Week 11",
    "title": "Two-Stage Assembly Line (Bob and Ray)",
    "topics": [
      "assembly line bottlenecks",
      "serial throughput"
    ],
    "sourceArtifacts": [
      "Section/Week 11/Week 11.pdf",
      "Section/Week 11/Assembly Lines-(Bob and Ray) full solution.pdf"
    ],
    "problems": [
      {
        "id": "w11_p1",
        "title": "Bob-Ray bottleneck identification",
        "statement": "In two-stage line, Bob=3 min/item and Ray=5 min/item. Identify bottleneck.",
        "method": "Service-rate comparison",
        "steps": [
          "Convert times to rates: Bob 20 items/hr, Ray 12 items/hr.",
          "Lower processing rate determines bottleneck.",
          "Infer queue buildup before slower stage."
        ],
        "finalAnswer": "Ray (stage 2) is bottleneck."
      },
      {
        "id": "w11_p2",
        "title": "Line utilization by stage",
        "statement": "Total run is 120 min. Bob busy 90 min, Ray busy 110 min. Compute stage utilizations.",
        "method": "Per-station utilization metric",
        "steps": [
          "Bob utilization = 90/120.",
          "Ray utilization = 110/120.",
          "Compare values to explain where congestion forms."
        ],
        "finalAnswer": "Bob utilization is 75%; Ray utilization is about 91.7%, confirming Ray as tighter stage."
      },
      {
        "id": "w11_p3",
        "title": "Throughput estimate for serial stations",
        "statement": "Given deterministic stage times 4 min then 6 min/item, estimate long-run throughput.",
        "method": "Bottleneck-capacity throughput",
        "steps": [
          "Compute capacities: stage1=15/hr, stage2=10/hr.",
          "Serial line throughput limited by minimum capacity.",
          "Use slower stage as long-run output rate."
        ],
        "finalAnswer": "Throughput is limited to about 10 items/hour."
      }
    ]
  },
  {
    "weekId": "w12",
    "week": "Week 12",
    "title": "Repairman Capacity Models (One vs Two Repairmen)",
    "topics": [
      "repairman systems",
      "downtime cost"
    ],
    "sourceArtifacts": [
      "Section/Week 12/Week 12.pdf",
      "Section/Week 12/repairman/One Repairman.pdf",
      "Section/Week 12/repairman/Two Repairman.pdf"
    ],
    "problems": [
      {
        "id": "w12_p1",
        "title": "One-repairman Tucson Mills interpretation",
        "statement": "For One Repairman sheet, discuss expected queue and downtime behavior under random breakdowns.",
        "method": "Single-server maintenance queue analysis",
        "steps": [
          "Model breakdowns as arrivals and repairs as service times.",
          "With one repairman, jobs can queue during clustered failures.",
          "Queued repairs increase machine downtime cost."
        ],
        "finalAnswer": "One repairman creates higher waiting and downtime risk when failures cluster."
      },
      {
        "id": "w12_p2",
        "title": "Two-repairman capacity effect",
        "statement": "Compare one versus two repairmen when downtime cost is $40/hour per failed machine.",
        "method": "Capacity-and-cost comparison",
        "steps": [
          "Estimate waiting reduction from adding second repair server.",
          "Translate reduced waiting to lower downtime hours.",
          "Compute cost impact via $40 per machine-hour down."
        ],
        "finalAnswer": "Two repairmen usually reduce queueing delay and downtime cost substantially."
      },
      {
        "id": "w12_p3",
        "title": "Repair queue KPI extraction",
        "statement": "From a repair trace, breakdown arrivals=15, completed repairs=14 in horizon with average wait 1.8h. State interpretation.",
        "method": "Queue KPI interpretation",
        "steps": [
          "Unfinished jobs imply residual backlog at horizon end.",
          "Average wait indicates repair responsiveness level.",
          "Use both to decide if extra capacity is justified."
        ],
        "finalAnswer": "System is near capacity: one unresolved job and 1.8h average wait suggest pressure on maintenance resources."
      }
    ]
  },
  {
    "weekId": "w13",
    "week": "Week 13",
    "title": "Queueing Performance Integration: Time-Driven vs Event-Driven",
    "topics": [
      "m/m/1 metrics",
      "event-driven integration"
    ],
    "sourceArtifacts": [
      "Section/Week 13/week 13 simulation.pdf",
      "Section/Week 13/Event Driven.pdf",
      "Assignments/Questions/Week 13 - assignment 4.docx"
    ],
    "problems": [
      {
        "id": "w13_p1",
        "title": "M/M/1 performance measures derivation",
        "statement": "Derive P0, Pn, L, Lq, W, Wq for M/M/1 and evaluate at rho=0.8.",
        "method": "Queueing-theory formula application",
        "steps": [
          "Use P0=1-rho and Pn=(1-rho)rho^n.",
          "Compute L=rho/(1-rho), Lq=rho^2/(1-rho).",
          "Using Little's law, compute W=L/lambda and Wq=Lq/lambda."
        ],
        "finalAnswer": "At rho=0.8: P0=0.2, L=4, Lq=3.2, with W and Wq from lambda scaling."
      },
      {
        "id": "w13_p2",
        "title": "Time-driven versus event-driven selection",
        "statement": "For irregular queue arrivals, choose simulation clock strategy and justify.",
        "method": "Algorithmic efficiency comparison",
        "steps": [
          "Time-driven scans many empty ticks when events are sparse.",
          "Event-driven jumps directly between actual event times.",
          "Prefer method minimizing unnecessary state checks."
        ],
        "finalAnswer": "Event-driven simulation is preferred for irregular sparse arrivals."
      },
      {
        "id": "w13_p3",
        "title": "Integrated simulation pipeline design",
        "statement": "Outline full workflow combining RN generation, mapping, event logic, and metric reporting for final assignment.",
        "method": "End-to-end model design",
        "steps": [
          "Generate random variates and map to interarrival/service outcomes.",
          "Run event calendar (arrivals/departures) while updating state variables.",
          "Collect KPIs (L, W, utilization), then validate against theory/tests."
        ],
        "finalAnswer": "A complete solution links random inputs, event processing, KPIs, and validation in one reproducible simulation run."
      }
    ]
  }
] as WeekProblemRegistry[];

export const problemRegistryByWeek: Record<string, SolvedProblem[]> = problemRegistry.reduce((acc, entry) => {
  acc[entry.weekId] = entry.problems;
  return acc;
}, {} as Record<string, SolvedProblem[]>);
