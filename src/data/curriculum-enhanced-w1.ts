/**
 * BULK CURRICULUM POPULATION - WEEK 1 (Word-for-Word from Curriculum PDF)
 */

export const enhancedCurriculumWeeks = {
  w1: {
    id: "w1",
    week: "Week 01",
    title: "Simulation Foundations: Systems, States, and Terminology",
    shortDescription: "Master the foundational concepts that underpin all discrete-event simulation: system definition, state variables, entities, events, and the Planning-Modeling-Validation-Application (PMVA) problem-solving cycle.",

    learningOutcomes: [
      "Define system, state, entity, event, and activity with precision using Dr. Ismail's definitions",
      "Classify systems by behavior (natural/man-made, deterministic/stochastic, discrete/continuous)",
      "Understand the PMVA cycle: Planning → Modeling → Validation → Application",
      "Identify minimal state variables needed to describe a system",
      "Distinguish between events (instantaneous) and activities (duration-based) in simulations",
      "Recognize when a system is appropriate for simulation modeling"
    ],

    explanations: [
      {
        id: "w1_exp_1",
        title: "Introduction to Simulation",
        type: "narrative",
        order: 1,
        content: "The basic idea of Simulation is to build an experimental device (model) that acts like (simulates) the real system in certain important aspects. The purpose is to understand or evaluate the behavior of a complex real-world system over an extended period without risk to the real system performance.",
        sourceReference: "Curriclum.pdf, Section 1: Introduction"
      },
      {
        id: "w1_exp_2",
        title: "Why Use Simulation?",
        type: "concept",
        order: 2,
        content: "a) If experimentation on the real-world system is not feasible or not possible:\n  • Too expensive (not feasible)\n  • Too risky (atomic problems) (not possible)\n  • Too complex\n  • Not existing system\n  • Intractable\n\nb) Simulation is the best (may be the only) technique available under conditions of uncertainty due to stochastic (random) variables or nonlinearity. Mathematical treatment of such systems is frequently not possible.\n\nc) Computer simulation gives control over time, which may be compressed or expanded, such as an aircraft; simulation may gather data on many months of operations in minutes.",
        sourceReference: "Curriclum.pdf, Section 2: Why Use Simulation?"
      },
      {
        id: "w1_exp_3",
        title: "Simulation Application Areas",
        type: "concept",
        order: 3,
        content: "Simulation can be used in:\n• Theoretical problems in basic science areas such as math, physics, and chemistry.\n• Practical problems in all aspects of life such as industrial problems, business, economic, biomedical systems, social problems (Population dynamics), space research, and War strategies.",
        sourceReference: "Curriclum.pdf, Section 3: Simulation Application"
      },
      {
        id: "w1_exp_4",
        title: "Basic Concepts: System & State",
        type: "concept",
        order: 4,
        content: "a) System: Is defined as an isolated collection of interacting components or objects with a defined set of interactions among them. A Jet aircraft is an excellent example of a complex system consisting of mechanical, electronic, chemical, and human components.\n\nb) State of a system: It is the minimal collection of information with which the system’s future behavior can be predicted. For the Jet aircraft, the state of the system can be determined by Speed, Direction of travel, weather conditions, number of passengers, and amount of remaining fuel.",
        sourceReference: "Curriclum.pdf, Section 4: Basic Concepts and Terminology"
      },
      {
        id: "w1_exp_5",
        title: "Basic Concepts: Activity & Classification",
        type: "concept",
        order: 5,
        content: "c) An Activity: It is the process or Event Which changes the system state.\n\nd) System Classification:\n• Natural and Man-Made\n• Deterministic / Stochastic (Probabilistic)\n• Continuous: A system whose changes in its state occur continuously over time (liquid flow in a pipeline)\n• Discrete: Growth of world population with respect to time.",
        sourceReference: "Curriclum.pdf, Section 4: Basic Concepts and Terminology"
      },
      {
        id: "w1_exp_6",
        title: "System Methodology stages",
        type: "narrative",
        order: 6,
        content: "When simulation is used to solve a problem, the following time-tested steps, or stages are applied:\n1. Observation of the system\n2. Formulation of hypotheses or theories that account for the observed behavior\n3. Prediction of the future behavior of the system based on the assumption that the hypotheses are correct\n4. Comparison of the predicted behavior with the actual behavior\n\nThe system being studied may impose constraints on certain steps of this scientific method. For example, consider the simulation of a system that does not yet exist. Obviously, the observation of such a system is not possible, but the simulation of such a system may still be possible if the analysis is carefully conducted and if the ultimate requirements are known.",
        sourceReference: "Curriclum.pdf, Section 5: System Methodology"
      },
      {
        id: "w1_exp_7",
        title: "Problem Solving Phases (Planning & Modeling)",
        type: "concept",
        order: 7,
        content: "The problem-solving process is divided into four phases: Planning, Modeling, Validation, and Application.\n\na) Planning: Includes the initial encounter with the system, the problem to be solved, and the factors pertaining to the system and its environment that are likely to affect the solution of the problem. This means the problem must be well-defined. Obviously, the more accurate and precise the problem statement is, the more smoothly the solution process can proceed. Resources must be considered and estimated such as money, time, personnel, and special equipment. If crucial resources are not available, the solution of the problem can be judged infeasible before a significant amount of time or money is spent.\n\nb) Modeling: In this phase, the analyst constructs the system model, which is a representation of the real system. The characteristics of this model should be Representative (not identical) of the characteristics of the real system. You must select some minimal set of the system’s characteristics so that the model approximates the real system to be cost-effective and manageable. There are many types of simulation models: Descriptive, Physical, Mathematical, Flowcharts, Schematics, and Computer programs.",
        sourceReference: "Curriclum.pdf, Section 5: System Methodology"
      },
      {
        id: "w1_exp_8",
        title: "Problem Solving Phases (Validation & Application)",
        type: "concept",
        order: 8,
        content: "c) Validation: Is to check that the system or the model is a correct representation of the real system. But verification means that the logic of a computer program is ok. So, a verified computer program can represent an invalid model. Validation techniques include comparing simulation results with historical real system results, using a simulator to predict results and comparing with real data, or statistical procedures (Chi-square goodness-of-fit and Kolmogorov-Smirnov tests).\n\nd) Application: Once the model has been properly validated, it can be applied to solve the problem at hand. A simulator may work error-free for a long period until it encounters a new and perhaps unique combination of program parameters that generates the next error.",
        sourceReference: "Curriclum.pdf, Section 5: System Methodology"
      },
      {
        id: "w1_exp_9",
        title: "Advantages and Disadvantages",
        type: "warning",
        order: 9,
        content: "Phillips, Ravindran, and Solberg stated that simulation is one of the easiest tools of management science to use but probably one of the hardest to apply properly and perhaps the most difficult one from which to draw accurate conclusions.\n\nAdkins and Pooch list 5 advantages:\n1. It permits controlled experimentation\n2. It permits time compression\n3. It permits sensitivity analysis by manipulation of input variables\n4. It does not disturb the real system\n5. It is an effective training tool\n\nThey also list 4 disadvantages:\n1. A simulation model may become expensive in terms of manpower and computer time\n2. Extensive development time may be encountered\n3. Hidden critical assumption may cause the model to diverge from reality\n4. Model parameters may be difficult to initialize.",
        sourceReference: "Curriclum.pdf, Section 6: Advantages and Disadvantages"
      }
    ],

    keyTerms: {
      "System": "An isolated collection of interacting components or objects with a defined set of interactions among them.",
      "State": "The minimal collection of information with which the system’s future behavior can be predicted.",
      "Activity": "The process or Event which changes the system state.",
      "Continuous": "A system whose changes in its state occur continuously over time.",
      "Discrete": "A system whose changes in its state occur at discrete points in time.",
      "Validation": "Checking that the system or the model is a correct representation of the real system.",
      "Verification": "Confirming that the logic of the computer program is correct."
    },

    solvedProblems: [
      {
        id: "w1_p1",
        title: "Classify a system by behavior",
        statement: "Classify an ATM service desk as natural/man-made, deterministic/stochastic, and discrete/continuous.",
        method: "System classification checklist",
        steps: [
          "Identify origin: ATM is engineered by humans => man-made.",
          "Check uncertainty: arrivals/service durations vary => stochastic.",
          "Check state changes: queue length changes at events => discrete."
        ],
        finalAnswer: "ATM desk is man-made, stochastic, and discrete."
      },
      {
        id: "w1_p2",
        title: "State vector definition for single server",
        statement: "Define the minimal state for a one-server queue with FCFS service.",
        method: "Minimal-state abstraction",
        steps: [
          "Track server status (idle/busy).",
          "Track number of customers waiting in queue.",
          "Use arrivals/departures as event triggers updating these states."
        ],
        finalAnswer: "Minimal state is (server status, queue length)."
      },
      {
        id: "w1_p3",
        title: "Activity versus event distinction",
        statement: "In a machine-shop model, classify service time and machine breakdown as activity or event.",
        method: "Definition-based classification",
        steps: [
          "Activity has duration; event is instantaneous.",
          "Service process lasts over time => activity.",
          "Breakdown occurrence changes state at an instant => event."
        ],
        finalAnswer: "Service time is an activity; breakdown occurrence is an event."
      }
    ]
  }
};

export default enhancedCurriculumWeeks;
