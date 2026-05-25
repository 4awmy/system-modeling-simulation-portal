import type { TimelineScenario } from '../components/TimelineDemo';

/**
 * CREATIVE DEMO SCENARIOS FOR CURRICULUM WEEKS
 * Each scenario visualizes key concepts through interactive timelines
 * Integrated into EnhancedCurriculumView via demoComponent reference
 */

// ============================================================================
// WEEK 02: Random Number Generation - RN Histogram Visualization
// ============================================================================
export const rnGenerationScenario: TimelineScenario = {
  title: "Pseudo-Random Number Generation (LCG Method)",
  description: "Watch how a Linear Congruential Generator produces a stream of pseudo-random numbers converging to uniform distribution. Formula: R_{i+1} = (aR_i + c) mod T",
  totalTime: 100,
  speed: 200,
  states: [
    {
      time: 0,
      name: "Seed initialized",
      description: "LCG initialized with seed R_0 = 7. Parameters: a=5, c=3, T=16 (Powers of 2 produce full period)",
      entities: {
        rnStream: { position: 10, label: "R_0=7", color: "blue", status: "Seed" },
        histogram: { position: 50, label: "0 values generated", color: "gray", status: "Empty" }
      }
    },
    {
      time: 10,
      name: "First iteration",
      description: "R_1 = (5×7 + 3) mod 16 = 38 mod 16 = 6. Normalize U_1 = 6/16 = 0.375",
      entities: {
        rnStream: { position: 20, label: "R_1=6 → U=0.375", color: "green", status: "Generated" },
        histogram: { position: 55, label: "1 value", color: "lightblue", status: "1/100" }
      }
    },
    {
      time: 20,
      name: "Second iteration",
      description: "R_2 = (5×6 + 3) mod 16 = 33 mod 16 = 1. U_2 = 1/16 = 0.0625",
      entities: {
        rnStream: { position: 30, label: "R_2=1 → U=0.0625", color: "green", status: "Generated" },
        histogram: { position: 60, label: "2 values", color: "lightblue", status: "2/100" }
      }
    },
    {
      time: 50,
      name: "Mid-stream (10 values)",
      description: "After 10 iterations, histogram shows distribution emerging but still sparse",
      entities: {
        rnStream: { position: 50, label: "10 values generated", color: "orange", status: "Partial" },
        histogram: { position: 70, label: "10 values", color: "yellow", status: "10/100" }
      }
    },
    {
      time: 100,
      name: "Convergence achieved",
      description: "After 100 iterations, U values show near-uniform distribution across [0,1]. Empirical frequency ≈ theoretical probability (1/16 per bin)",
      entities: {
        rnStream: { position: 90, label: "100 values generated", color: "green", status: "Converged" },
        histogram: { position: 85, label: "100 values uniform", color: "darkgreen", status: "Converged" }
      }
    }
  ]
};

// ============================================================================
// WEEK 03: Law of Large Numbers - Monte Carlo Convergence
// ============================================================================
export const monteCarloScenario: TimelineScenario = {
  title: "Law of Large Numbers: Empirical Probability Convergence",
  description: "Simulate 1000 coin flips. Empirical frequency converges to theoretical P(Heads)=0.5 as sample size increases",
  totalTime: 1000,
  speed: 50,
  states: [
    {
      time: 0,
      name: "Starting simulation",
      description: "N=0 flips. Empirical P(Heads) = undefined. Theoretical = 0.5",
      entities: {
        empirical: { position: 10, label: "Empirical: --", color: "red", status: "Not started" },
        theoretical: { position: 50, label: "Theoretical: 0.500", color: "green", status: "Fixed" }
      }
    },
    {
      time: 10,
      name: "First 10 flips",
      description: "N=10, Heads=7. Empirical P(H) = 0.700 (far from 0.5, high variance)",
      entities: {
        empirical: { position: 20, label: "Empirical: 0.700", color: "orange", status: "N=10" },
        theoretical: { position: 50, label: "Theoretical: 0.500", color: "green", status: "Fixed" }
      }
    },
    {
      time: 50,
      name: "First 100 flips",
      description: "N=100, Heads=48. Empirical P(H) = 0.480 (closer to 0.5, variance decreasing)",
      entities: {
        empirical: { position: 35, label: "Empirical: 0.480", color: "yellow", status: "N=100" },
        theoretical: { position: 50, label: "Theoretical: 0.500", color: "green", status: "Fixed" }
      }
    },
    {
      time: 500,
      name: "First 500 flips",
      description: "N=500, Heads=249. Empirical P(H) = 0.498 (very close to theoretical)",
      entities: {
        empirical: { position: 48, label: "Empirical: 0.498", color: "lightgreen", status: "N=500" },
        theoretical: { position: 50, label: "Theoretical: 0.500", color: "green", status: "Fixed" }
      }
    },
    {
      time: 1000,
      name: "All 1000 flips completed",
      description: "N=1000, Heads=501. Empirical P(H) = 0.501. Convergence achieved! As N→∞, empirical → theoretical",
      entities: {
        empirical: { position: 50, label: "Empirical: 0.501", color: "darkgreen", status: "N=1000 CONVERGED" },
        theoretical: { position: 50, label: "Theoretical: 0.500", color: "green", status: "Fixed" }
      }
    }
  ]
};

// ============================================================================
// WEEK 04: Probability Distributions - Accident Trace Timeline
// ============================================================================
export const accidentScenario: TimelineScenario = {
  title: "Daily Accident Events: Discrete Distribution Over Time",
  description: "Model city accidents following Poisson distribution. Events are instantaneous; intervals between accidents vary (exponential)",
  totalTime: 30,
  speed: 300,
  states: [
    {
      time: 0,
      name: "Day starts",
      description: "t=0, No accidents yet. Expected rate: λ=2 accidents/day (from historical data)",
      entities: {
        city: { position: 10, label: "Day 0", color: "blue", status: "Safe" },
        accidents: { position: 50, label: "Count: 0", color: "gray", status: "None" }
      }
    },
    {
      time: 2,
      name: "First accident",
      description: "t=2 hours: Accident at intersection A. Event (instantaneous), now in response queue",
      entities: {
        city: { position: 15, label: "Accident @ t=2h", color: "red", status: "Event" },
        accidents: { position: 55, label: "Count: 1", color: "orange", status: "1 event" }
      }
    },
    {
      time: 5,
      name: "Second accident",
      description: "t=5 hours: Accident at intersection B (3 hours after first). Interval = 3h (exponentially distributed)",
      entities: {
        city: { position: 25, label: "Accident @ t=5h", color: "red", status: "Event" },
        accidents: { position: 60, label: "Count: 2", color: "darkorange", status: "2 events" }
      }
    },
    {
      time: 12,
      name: "Third & Fourth accidents",
      description: "t=12h: Two more accidents (short interval 1h apart). Clustering visible but stochastic",
      entities: {
        city: { position: 40, label: "2 accidents @ t=12,13h", color: "darkred", status: "Clustered" },
        accidents: { position: 70, label: "Count: 4", color: "red", status: "4 events" }
      }
    },
    {
      time: 30,
      name: "End of day",
      description: "t=24h: Total 6 accidents. Distribution: P(N=6|λ=2) ≈ 0.12 (Poisson). Tomorrow: new random sequence",
      entities: {
        city: { position: 50, label: "Day end: 6 accidents", color: "darkred", status: "Complete" },
        accidents: { position: 80, label: "Daily total: 6", color: "darkred", status: "Final count" }
      }
    }
  ]
};

// ============================================================================
// WEEK 06: Event-Driven vs Periodic Scan - Side-by-Side Comparison
// ============================================================================
export const eventVsPeriodicScenario: TimelineScenario = {
  title: "Event-Driven vs Periodic Scan Clock Mechanics",
  description: "Same system, two approaches: Event-driven jumps to next event (efficient). Periodic checks every 5 min (may miss/double-count)",
  totalTime: 50,
  speed: 200,
  states: [
    {
      time: 0,
      name: "Both start t=0",
      description: "Event-driven ready at next event (t=5). Periodic scheduled check at t=5",
      entities: {
        eventDriven: { position: 5, label: "ED: Clock=0", color: "blue", status: "Idle" },
        periodic: { position: 5, label: "Per: Clock=0", color: "green", status: "Idle" }
      }
    },
    {
      time: 10,
      name: "First customer arrival",
      description: "Real event: Customer arrives at t=3. Event-driven detects at t=3, periodic misses (next check t=5)",
      entities: {
        eventDriven: { position: 15, label: "ED: Clock=3 ✓", color: "blue", status: "Arrival detected" },
        periodic: { position: 10, label: "Per: Clock=0", color: "orange", status: "Still waiting" }
      }
    },
    {
      time: 20,
      name: "Periodic catches up",
      description: "Periodic clock advances to t=5, detects arrival (2 min late), updates queue",
      entities: {
        eventDriven: { position: 25, label: "ED: Clock=3", color: "blue", status: "Already processed" },
        periodic: { position: 20, label: "Per: Clock=5", color: "yellow", status: "Detects arrival (late)" }
      }
    },
    {
      time: 35,
      name: "Multiple events by t=20",
      description: "Events at t=3, t=8, t=18. Event-driven processed all 3. Periodic (checking every 5min) processed only 2, possibly double-counted one",
      entities: {
        eventDriven: { position: 35, label: "ED: 3 events exact", color: "darkblue", status: "Accurate" },
        periodic: { position: 30, label: "Per: 2 events (may err)", color: "darkorange", status: "Uncertain" }
      }
    },
    {
      time: 50,
      name: "Summary: ED superior accuracy",
      description: "Event-driven: exact timing, zero missed events, no double-counts. Periodic: cheaper (fewer checks) but error-prone. Choose based on required accuracy",
      entities: {
        eventDriven: { position: 45, label: "ED: Accurate, efficient", color: "darkgreen", status: "Recommended" },
        periodic: { position: 40, label: "Per: Fast but risky", color: "darkorange", status: "Use with caution" }
      }
    }
  ]
};

// ============================================================================
// WEEK 07: Queueing System - Pump Station Timeline (Enhanced)
// ============================================================================
export const pumpQueueScenario: TimelineScenario = {
  title: "M/M/1 Queue: Pump Station Service System",
  description: "Cars arrive at fuel pump, wait in queue, get serviced. Track arrivals, service times, departures. Calculate utilization ρ = λ/μ",
  totalTime: 25,
  speed: 250,
  states: [
    {
      time: 0,
      name: "System starts",
      description: "t=0, pump idle, queue empty. λ=0.5 cars/min, μ=1 car/min (service rate). ρ = 0.5/1 = 0.5",
      entities: {
        pump: { position: 20, label: "IDLE", color: "green", status: "Pump empty" },
        queue: { position: 50, label: "Q=0", color: "gray", status: "No queue" }
      }
    },
    {
      time: 2,
      name: "Car 1 arrives",
      description: "t=2, Car 1 arrives. Pump free, so service starts immediately (service time = 3 min, departs at t=5)",
      entities: {
        pump: { position: 20, label: "BUSY (Car1)", color: "red", status: "Service: 3min" },
        queue: { position: 50, label: "Q=0", color: "gray", status: "No queue" }
      }
    },
    {
      time: 5,
      name: "Car 1 departs, Car 2 arrives",
      description: "t=5, Car 1 finishes (service time=3, as predicted). Car 2 arrives immediately, starts service",
      entities: {
        pump: { position: 20, label: "BUSY (Car2)", color: "red", status: "Service: 2min" },
        queue: { position: 50, label: "Q=0", color: "gray", status: "Immediate service" }
      }
    },
    {
      time: 7,
      name: "Queue builds: Car 3,4 arrive",
      description: "t=7, Car 2 still busy (leaves at t=7). Cars 3&4 arrive (t=7). Car 3 enters service, Car 4 waits (Q=1)",
      entities: {
        pump: { position: 20, label: "BUSY (Car3)", color: "red", status: "Service: 4min" },
        queue: { position: 50, label: "Q=1 (Car4)", color: "orange", status: "Waiting..." }
      }
    },
    {
      time: 12,
      name: "Peak queue",
      description: "t=12, Car 3 departs. Car 4 enters service. Cars 5,6,7 arrive and queue (Q=2)",
      entities: {
        pump: { position: 20, label: "BUSY (Car4)", color: "red", status: "Service: 3min" },
        queue: { position: 50, label: "Q=2 (Cars5,6)", color: "darkorange", status: "Waiting..." }
      }
    },
    {
      time: 16,
      name: "Throughput stabilized",
      description: "t=16, queuing dynamics evident. L_q = ρ²/(1-ρ) = 0.25/0.5 = 0.5 cars (theory). Observed ≈ 1",
      entities: {
        pump: { position: 20, label: "BUSY (Car5)", color: "red", status: "Continuous service" },
        queue: { position: 50, label: "Q≈1", color: "darkorange", status: "Steady-state" }
      }
    },
    {
      time: 25,
      name: "End simulation",
      description: "t=25, Calculate final metrics. System utilization ρ=0.5 achieved (avg service demand vs capacity)",
      entities: {
        pump: { position: 20, label: "BUSY", color: "darkred", status: "Throughout" },
        queue: { position: 50, label: "Steady avg Q=0.5", color: "darkred", status: "Final" }
      }
    }
  ]
};

// ============================================================================
// WEEK 09: Inventory System - Stock Level Visualization
// ============================================================================
export const inventoryScenario: TimelineScenario = {
  title: "Inventory Management: Reorder Point Policy",
  description: "Stock depletes with demand. At reorder point, order triggered (lead time delay). Minimize stockout while controlling holding costs. EOQ = √(2DS/H)",
  totalTime: 60,
  speed: 150,
  states: [
    {
      time: 0,
      name: "Inventory full",
      description: "Stock level Q=100 units. Demand d=5 units/day. Reorder point R=20. Lead time L=5 days. Order not needed",
      entities: {
        stock: { position: 80, label: "Stock: 100", color: "green", status: "Full" },
        pipeline: { position: 10, label: "Orders: 0", color: "gray", status: "None" }
      }
    },
    {
      time: 10,
      name: "Stock declining",
      description: "Day 10: Demand accumulates (10 days × 5 units = 50 depleted). Stock = 50. Still above reorder point",
      entities: {
        stock: { position: 60, label: "Stock: 50", color: "yellow", status: "Declining" },
        pipeline: { position: 10, label: "Orders: 0", color: "gray", status: "None" }
      }
    },
    {
      time: 16,
      name: "Reorder triggered",
      description: "Day 16: Stock drops to 20 (reorder point). Order Q=80 units placed. Lead time = 5 days (arrives day 21)",
      entities: {
        stock: { position: 25, label: "Stock: 20", color: "orange", status: "Reorder point hit" },
        pipeline: { position: 30, label: "Order placed: 80", color: "orange", status: "In transit (5d)" }
      }
    },
    {
      time: 25,
      name: "Stock at minimum before replenishment",
      description: "Day 21 (5 days after order): Stock would drop to ~0 (dangerous). Order arrives just in time!",
      entities: {
        stock: { position: 10, label: "Stock: 2 (critical!)", color: "red", status: "Near stockout" },
        pipeline: { position: 50, label: "Order arrives!", color: "green", status: "Received" }
      }
    },
    {
      time: 35,
      name: "Replenishment received",
      description: "Day 21: Order received (80 units). Stock = 2 + 80 = 82. Back above reorder point",
      entities: {
        stock: { position: 75, label: "Stock: 82", color: "lightgreen", status: "Replenished" },
        pipeline: { position: 10, label: "Orders: 0", color: "gray", status: "None" }
      }
    },
    {
      time: 60,
      name: "Cycle repeats",
      description: "Steady-state pattern: Order → Wait (5d) → Receive → Consume → Reorder. Total cost = holding + ordering (balanced)",
      entities: {
        stock: { position: 50, label: "Stock: 50 (steady)", color: "green", status: "Cyclic" },
        pipeline: { position: 10, label: "Inventory policy working", color: "green", status: "Optimal" }
      }
    }
  ]
};

// ============================================================================
// WEEK 11: Assembly Line - Bottleneck Analysis
// ============================================================================
export const assemblyLineScenario: TimelineScenario = {
  title: "Assembly Line Bottleneck: Throughput Limited by Slowest Station",
  description: "Parts flow through 3 stations in series. Station processing times: St1=1min, St2=3min (bottleneck), St3=2min. System throughput = min(1/1, 1/3, 1/2) = 0.33 parts/min",
  totalTime: 30,
  speed: 200,
  states: [
    {
      time: 0,
      name: "System initialized",
      description: "Part P1 enters Station 1. Station 1 time = 1 min (fastest). St1: 1min, St2: 3min, St3: 2min",
      entities: {
        station1: { position: 15, label: "St1 (1m): P1", color: "blue", status: "Processing" },
        station2: { position: 50, label: "St2 (3m): idle", color: "gray", status: "Waiting" },
        station3: { position: 85, label: "St3 (2m): idle", color: "gray", status: "Waiting" }
      }
    },
    {
      time: 5,
      name: "Parts at each station",
      description: "t=1: P1→St2 (3min), P2→St1. t=2: P2→St2, P3→St1. Station 2 saturated (longest service)",
      entities: {
        station1: { position: 15, label: "St1: P3", color: "lightblue", status: "Quick" },
        station2: { position: 50, label: "St2: P1,P2 queue", color: "red", status: "BOTTLENECK" },
        station3: { position: 85, label: "St3: P1 now", color: "lightblue", status: "Processing" }
      }
    },
    {
      time: 10,
      name: "Bottleneck obvious",
      description: "Station 2 accumulates parts (Q=2-3). St1 idle waiting. St3 starved (no input from slow St2). Throughput ≈ 0.33 parts/min from Station 2",
      entities: {
        station1: { position: 15, label: "St1: IDLE", color: "lightgray", status: "Starved" },
        station2: { position: 50, label: "St2: Q=3", color: "darkred", status: "BOTTLENECK!" },
        station3: { position: 85, label: "St3: IDLE", color: "lightgray", status: "Starved" }
      }
    },
    {
      time: 15,
      name: "System in steady state",
      description: "Queue grows ahead of St2, empty behind. Line throughput = 0.33 parts/min (dictated by slowest station). Investment: add parallel St2 to increase capacity",
      entities: {
        station1: { position: 15, label: "St1: IDLE", color: "lightgray", status: "Excess capacity" },
        station2: { position: 50, label: "St2: Q=4", color: "darkred", status: "SATURATED" },
        station3: { position: 85, label: "St3: IDLE", color: "lightgray", status: "Excess capacity" }
      }
    },
    {
      time: 30,
      name: "Mitigation strategies shown",
      description: "Option 1: Add parallel St2 (split load). Option 2: Upgrade St2 (faster process). Option 3: Redesign (skip Station 2). Throughput ceiling = system constraint",
      entities: {
        station1: { position: 15, label: "St1 + St1' (faster)", color: "blue", status: "Parallel" },
        station2: { position: 50, label: "St2 + St2' (share load)", color: "blue", status: "Doubled" },
        station3: { position: 85, label: "St3: Fully utilized", color: "green", status: "Throughput ↑" }
      }
    }
  ]
};

// ============================================================================
// WEEK 12: Repairman Model - 1 vs 2 Repairmen Comparison
// ============================================================================
export const repairmanScenario: TimelineScenario = {
  title: "Repairman Model: 1 vs 2 Repairmen (System Availability)",
  description: "Machines fail randomly. Repairs queue up with 1 repairman (high wait, low cost) vs 2 repairmen (low wait, higher cost). Trade-off analysis",
  totalTime: 40,
  speed: 200,
  states: [
    {
      time: 0,
      name: "System starts: 1 repairman",
      description: "10 machines, 1 repairman. Machine fail rate λ=1/8 hours (avg 1 failure per 8 hours). Repair time μ=1 hour (exponential)",
      entities: {
        repairman1: { position: 20, label: "Repairman 1: IDLE", color: "green", status: "Ready" },
        repairman2: { position: 80, label: "Repairman 2: N/A", color: "gray", status: "Not hired" },
        queue: { position: 50, label: "Repair queue: 0", color: "gray", status: "None" }
      }
    },
    {
      time: 5,
      name: "First failure (1 repairman scenario)",
      description: "Machine 1 fails. Repairman 1 starts repair (1 hour). Machine 5 fails (enters queue). ρ₁ = λ/μ = 1/8 = 0.125 (low utilization, but backlog possible)",
      entities: {
        repairman1: { position: 20, label: "R1: Fixing M1 (1h)", color: "red", status: "Busy" },
        repairman2: { position: 80, label: "R2: N/A", color: "gray", status: "Not hired" },
        queue: { position: 50, label: "Queue: M5 waiting", color: "orange", status: "1 in queue" }
      }
    },
    {
      time: 10,
      name: "Queue grows (1 repairman)",
      description: "More failures accumulate (M7, M3 fail). R1 still busy. Queue = 3. Mean wait time W_q grows. System availability drops",
      entities: {
        repairman1: { position: 20, label: "R1: Fixing M3 (now)", color: "red", status: "Busy" },
        repairman2: { position: 80, label: "R2: N/A", color: "gray", status: "Not hired" },
        queue: { position: 50, label: "Queue: M5,M7 waiting", color: "darkorange", status: "2 in queue" }
      }
    },
    {
      time: 20,
      name: "High queue with 1 repairman",
      description: "During peak, queue reaches 4-5 machines. Mean waiting time W_q = ρ/(μ-λ) = 0.125/(1-0.125) ≈ 0.14 hours (short) but peak bursts cause frustration",
      entities: {
        repairman1: { position: 20, label: "R1: Continuous work", color: "darkred", status: "Saturated" },
        repairman2: { position: 80, label: "R2: HIRE?", color: "yellow", status: "Consider" },
        queue: { position: 50, label: "Queue: 4-5 machines", color: "red", status: "CONGESTION" }
      }
    },
    {
      time: 30,
      name: "Add 2nd repairman (scenario B)",
      description: "With 2 repairmen: queue reduced, parallel repairs. ρ₂ = λ/2μ = 0.0625. Wait time drops significantly. Cost trade-off: +1 salary vs +uptime",
      entities: {
        repairman1: { position: 20, label: "R1: M1 fixed", color: "green", status: "Active" },
        repairman2: { position: 80, label: "R2: M5 fixed", color: "green", status: "Active" },
        queue: { position: 50, label: "Queue: ~1 avg", color: "lightgreen", status: "Reduced" }
      }
    },
    {
      time: 40,
      name: "Decision: 2 repairmen optimal",
      description: "With 2R: System availability ≈95%, avg queue≈1, wait time cut by 50%. Cost of 2nd repairman justified by uptime gain. Production loss avoided",
      entities: {
        repairman1: { position: 20, label: "R1 + R2", color: "darkgreen", status: "Team" },
        repairman2: { position: 80, label: "Availability: 95%", color: "darkgreen", status: "High" },
        queue: { position: 50, label: "Optimal staffing", color: "darkgreen", status: "Decision made" }
      }
    }
  ]
};

/**
 * EXPORT SCENARIO MAP FOR CURRICULUM INTEGRATION
 * Maps week IDs to their demo scenarios for EnhancedCurriculumView integration
 */
export const demoScenarioMap: Record<string, TimelineScenario> = {
  w2: rnGenerationScenario,
  w3: monteCarloScenario,
  w4: accidentScenario,
  w6: eventVsPeriodicScenario,
  w7: pumpQueueScenario,
  w9: inventoryScenario,
  w11: assemblyLineScenario,
  w12: repairmanScenario
};

export default demoScenarioMap;
