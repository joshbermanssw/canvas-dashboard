import type { PracticeQuestion, Topic } from '../types';

/** Sources: w08.txt (slides), extra/w10-tut.txt and extra/w10-tut-ans.txt (Week 10 tutorial, Q1). */
export const week08: Topic = {
  week: 8,
  title: 'Predicting performance and queues',
  summary:
    'How to predict throughput and response time with back-of-the-envelope maths: operational laws that link each device to the whole system, low-load and high-load bounds for a closed system, and the M/M/1 queue. The numbers point to the bottleneck and justify a redesign.',
  concepts: [
    {
      term: 'Extrapolation',
      definition:
        'Measure performance at a few parameter values (e.g. 10, 20, 30 clients), fit a curve and read off other values. Interpolation works well, but extrapolation does not, because performance changes radically once the system reaches capacity.',
    },
    {
      term: 'Simulation',
      definition:
        'Build a computer model with tasks, resources and events driven by randomised values, run it and watch what happens (e.g. do queues build up?). The problems: coding a reasonable model is hard and slow, and key parameters are hard to get.',
    },
    {
      term: 'Analytical (queueing) model',
      definition:
        'A mathematical model with resources, queues and probabilities, solved for steady-state behaviour exactly or by iteration. It is less precise than simulation but usually far easier, provided the random values follow one of a few easy distributions.',
    },
    {
      term: 'Operational laws',
      definition:
        'Simple results that can be worked out on the back of an envelope without knowing the exact distribution of the random values. They are the focus of this unit.',
    },
    {
      term: 'Closed system',
      definition:
        'A system with a fixed number of clients N. Each client submits a job, waits for the response, thinks for time Z, then submits another, so N is also the number of jobs that are either in the system or "thinking".',
    },
    {
      term: 'Open system',
      definition: 'A system where jobs arrive from outside at an arrival rate of λ jobs per second, regardless of how many are already inside.',
    },
    {
      term: 'Think time (Z)',
      definition: 'The time between a job completing and the same client submitting its next job.',
    },
    {
      term: 'Throughput (X)',
      definition: 'The average number of jobs completed per second. Xᵢ is the throughput of device i in visits per second.',
    },
    {
      term: 'Response time (R)',
      definition: 'The average time from submitting a job until it is completed.',
    },
    {
      term: 'Service demand (Dᵢ)',
      definition:
        'The total service time one job needs from device i on average: visits per job times service time per visit. It says how much of device i one completed job consumes.',
    },
    {
      term: 'Utilisation (Uᵢ)',
      definition: 'The fraction of time device i is busy. It can never exceed 1 (100%).',
    },
    {
      term: 'Bottleneck',
      definition:
        'The device with the largest service demand (Dmax). It reaches 100% utilisation first and caps system throughput at 1 ÷ Dmax, even while other devices still have spare capacity.',
    },
    {
      term: 'Saturation',
      definition:
        'The point where the bottleneck is fully busy. Before it, extra clients mainly raise throughput; after it, extra clients mainly raise waiting and queues build up badly.',
    },
    {
      term: 'M/M/1 queue',
      definition:
        'A single server with one queue where jobs arrive by a Poisson process (exponential gaps, average rate λ) and service times are exponential (average rate μ). Its behaviour depends on the load ρ = λ ÷ μ.',
    },
    {
      term: 'Exponential distribution',
      definition:
        'A one-parameter (λ) distribution for the time between events, with expected value 1 ÷ λ. It is memoryless: the past has no effect on the future.',
    },
    {
      term: 'Poisson distribution',
      definition:
        'The number of occurrences of an event whose inter-event gaps are exponential. Its expected value is λ. The probability formula is marked non-examinable.',
    },
    {
      term: 'Heavy-tailed distribution',
      definition:
        'A distribution spread far from its average, such as a power law. Wider spread means longer queues and worse response times, and a few extremely big jobs can clog the system for every job.',
    },
  ],
  frameworks: [
    {
      name: 'Three approaches to performance prediction',
      source: 'Lecture 8 slides',
      points: [
        'Extrapolation: measure, fit a curve, predict. Cheap, but fails near capacity where behaviour changes sharply.',
        'Simulation: model tasks, resources and events with random values and run it. Precise, but the model is hard to build and its parameters are hard to obtain.',
        'Analytical (queueing) model: solve equations for steady state. Less precise than simulation but far easier when the distributions are simple.',
        'Operational laws are the simplest analytical results: they need only measured averages, not the shape of the distribution.',
      ],
    },
    {
      name: 'Standard analysis of a closed system with N clients',
      source: 'Lecture 8 summary slide',
      points: [
        'Identify the resources (devices) where work from different jobs can be done concurrently.',
        'Work out Dᵢ for each resource (Vᵢ × Sᵢ, or busy time ÷ completed jobs), then D = ΣDᵢ and Dmax.',
        'The bottleneck is the resource with Dmax.',
        'Low-load bounds: R ≥ D and X ≤ N ÷ (D + Z).',
        'High-load bounds: X ≤ 1 ÷ Dmax and R ≥ N × Dmax − Z.',
        'If you have a measured throughput, get the actual response time from the interactive response-time law R = N ÷ X − Z.',
      ],
    },
    {
      name: 'Planning for scale: how many clients can we support?',
      source: 'Lecture 8 slides',
      points: [
        'Typical question: how far can the workload grow while the average response time stays below a given limit?',
        'Inputs: current measurements, Dᵢ for each resource, think time Z and the response-time target.',
        'Use the high-load bound R ≥ N × Dmax − Z and solve N × Dmax − Z ≤ target for the largest whole N.',
        'Lecture example: Dmax = 0.06 s, Z = 5 s, target 2 s gives N × 0.06 − 5 ≤ 2, so N ≤ 116.7, i.e. about 116 clients.',
        'The result is a planning bound or estimate, not a guarantee.',
      ],
    },
    {
      name: 'System redesign methodology',
      source: 'Lecture 8 slides',
      points: [
        'The only way to get more throughput than 1 ÷ Dmax is to change the design so that Dmax changes.',
        'Move work away from the bottleneck: add new devices to share the load, or re-arrange processing so some visits go to other existing devices.',
        'Or make each request need less service time at the bottleneck, e.g. swap in a faster disk.',
        'After the redesign there is still a bottleneck, perhaps on a different device, so recompute every Dᵢ and find the new Dmax.',
        'Warning: do not reuse a quantity that has changed. A higher N keeps Dᵢ the same but changes Xᵢ and Uᵢ; a change in the mix of job types changes the average Dᵢ.',
      ],
    },
    {
      name: 'Low load versus high load behaviour',
      source: 'Lecture 8 slides',
      points: [
        'Low load: almost no queueing, so response time is close to the total service demand D.',
        'Throughput at low load grows roughly in proportion to N, following N ÷ (D + Z).',
        'High load: the bottleneck is saturated, throughput flattens at 1 ÷ Dmax and response time climbs along N × Dmax − Z.',
        'Both bounds always hold; the actual curve stays below both throughput bounds and above both response-time bounds.',
      ],
    },
    {
      name: 'Impact of queues and the 80% rule',
      source: 'Lecture 8 slides',
      points: [
        'When λ is close to μ the queue grows long and every job is delayed a long time; response time rises sharply near saturation.',
        'Contrast: with exactly periodic arrivals and exactly equal service times there is never a queue as long as λ is below μ. Randomness is what creates the queue.',
        'Design rule: keep the load ρ at the bottleneck below about 0.8 so that no resource gets saturated.',
        'With μ = 10 jobs/s, average time in system goes 0.2 s at 50% load, 0.5 s at 80%, 1 s at 90% and 2 s at 95%.',
        'The more a distribution is spread from its average (heavy tails, power laws), the longer the queues and the worse the response times.',
      ],
    },
  ],
  formulas: [
    {
      name: 'Service demand',
      formula: 'Dᵢ = Vᵢ × Sᵢ',
      note: 'Vᵢ = average visits to device i per job; Sᵢ = average service time per visit; Dᵢ = service demand per job at device i (seconds). From measurements, Dᵢ = busy time of device i ÷ jobs completed (as used in the Week 10 tutorial answers).',
    },
    {
      name: 'Service rate of a device',
      formula: 'μᵢ = 1 ÷ Sᵢ',
      note: 'μᵢ = visits device i could complete per second if kept continually busy; Sᵢ = service time per visit.',
    },
    {
      name: 'Throughput from an observation',
      formula: 'X = jobs completed ÷ observation time',
      note: 'Convert the observation period to seconds (30 min = 1,800 s). Used in the Week 10 tutorial: 1,600 ÷ 1,800 = 0.89 jobs/s.',
    },
    {
      name: 'Total service demand',
      formula: 'D = ΣDᵢ, Dmax = largest Dᵢ',
      note: 'D = total service time one job needs across all devices; the device with Dmax is the bottleneck.',
    },
    {
      name: "Little's Law",
      formula: 'N = λ × T',
      note: 'N = average number of jobs in the system; λ = average arrival (or departure) rate; T = average time in the system. Holds for any steady-state system or any part of one, whatever the distributions.',
    },
    {
      name: 'Interactive response-time law',
      formula: 'N = X × (R + Z), so R = N ÷ X − Z',
      note: "N = number of clients; X = system throughput (jobs/s); R = response time; Z = think time. It is Little's Law applied to the closed system plus its clients.",
    },
    {
      name: 'Forced Flow Law',
      formula: 'Xᵢ = Vᵢ × X',
      note: 'Xᵢ = throughput of device i (visits/s); Vᵢ = visits to device i per job; X = system throughput (jobs/s).',
    },
    {
      name: 'Service Demand Law (Bottleneck Law)',
      formula: 'Uᵢ = Dᵢ × X',
      note: 'Uᵢ = utilisation of device i (0 to 1); Dᵢ = service demand; X = system throughput. Example: Dᵢ = 0.06 s at X = 10 jobs/s gives 60% utilisation.',
    },
    {
      name: 'High-load bound on throughput',
      formula: 'X ≤ 1 ÷ Dmax',
      note: 'Follows from Uᵢ = Dᵢ × X ≤ 1 for every device. Example: Dmax = 0.06 s gives X ≤ 16.67 jobs/s.',
    },
    {
      name: 'High-load bound on response time',
      formula: 'R ≥ N × Dmax − Z',
      note: 'N = number of clients; Z = think time. Obtained by putting X ≤ 1 ÷ Dmax into R = N ÷ X − Z.',
    },
    {
      name: 'Low-load bound on response time',
      formula: 'R ≥ D',
      note: 'D = ΣDᵢ. Even with no queueing, the actual service work still takes time.',
    },
    {
      name: 'Low-load bound on throughput',
      formula: 'X ≤ N ÷ (D + Z)',
      note: 'N = number of clients; D = total service demand; Z = think time.',
    },
    {
      name: 'Maximum clients for a response-time target',
      formula: 'N × Dmax − Z ≤ R(target), so N ≤ (R(target) + Z) ÷ Dmax',
      note: 'Rearranged high-load bound; round N down to a whole number. If the question says "below" the target, N must be strictly less than the limit.',
    },
    {
      name: 'M/M/1 load',
      formula: 'ρ = λ ÷ μ',
      note: 'λ = average arrivals per second; μ = average services possible per second (1 ÷ μ is the average service time). The slides write the load as p. Needs ρ < 1.',
    },
    {
      name: 'M/M/1 average number of jobs in the system',
      formula: 'N = ρ ÷ (1 − ρ)',
      note: 'Counts jobs waiting in the queue plus the one being served.',
    },
    {
      name: 'M/M/1 average number of jobs waiting in the queue',
      formula: 'Nwait = ρ² ÷ (1 − ρ)',
      note: 'Jobs in the queue only, not the one in service.',
    },
    {
      name: 'M/M/1 average time in the system',
      formula: 'T = 1 ÷ (μ × (1 − ρ))',
      note: 'Waiting plus service. Example: μ = 10, λ = 8 gives ρ = 0.8 and T = 1 ÷ (10 × 0.2) = 0.5 s.',
    },
    {
      name: 'M/M/1 average waiting time in the queue',
      formula: 'Twait = ρ ÷ (μ × (1 − ρ))',
      note: 'Queue delay only. Proofs are not needed, but the four M/M/1 results must be known.',
    },
    {
      name: 'Inequality rules',
      formula: 'A < B and B < C ⇒ A < C; A < B ⇒ A + X < B + X; A < B and C < D ⇒ A + C < B + D; A < B and X > 0 ⇒ A × X < B × X; 0 < A < B ⇒ 1 ÷ B < 1 ÷ A',
      note: 'Used to derive the bounds. Note the last rule: taking reciprocals flips the inequality.',
    },
    {
      name: 'Basic probability rules',
      formula: 'P(not A) = 1 − P(A); P(A and B) = P(A) × P(B) if independent; P(A or B) = P(A) + P(B) − P(A and B)',
      note: 'P(A) is between 0 and 1. If A and B are independent and both rare, P(A or B) ≈ P(A) + P(B).',
    },
    {
      name: 'Expected value',
      formula: 'E(X) = Σ X(case i) × P(case i)',
      note: 'The probability-weighted average of a random variable over all cases.',
    },
    {
      name: 'Exponential distribution',
      formula: 'pdf(x) = λ × exp(−λx), expected value = 1 ÷ λ',
      note: 'λ = rate of events. Memoryless. The matching Poisson count has expected value λ.',
    },
  ],
  examples: [
    'Running example: a job makes 2 CPU visits of 20 ms (D = 0.04 s) and 3 database visits of 20 ms (D = 0.06 s); think time Z = 5 s. The database has the largest demand, so it is the bottleneck.',
    'Running example at 20 clients: measured X = 3.92 jobs/s, so R = 20 ÷ 3.92 − 5 ≈ 0.10 s, which equals D = 0.04 + 0.06. Low load means almost no queueing.',
    'Running example utilisation: at X = 10 jobs/s the CPU is 40% busy and the database 60%. At 16.7 jobs/s the database hits 100% while the CPU is still below 70%, and the system cannot go faster.',
    'Running example planning: to keep R below 2 s, N × 0.06 − 5 ≤ 2 gives N ≤ 116.7, so roughly 116 clients as an upper planning estimate.',
    'M/M/1 with μ = 10 requests/s (0.1 s service time): λ = 5, 8, 9, 9.5 per second gives ρ = 50%, 80%, 90%, 95% and T = 0.20, 0.50, 1.00, 2.00 s.',
    'Coin tossing: with 20 tosses, one exact sequence has probability 1 ÷ 2²⁰; "fourth toss is heads" has probability 0.5; "first head is at toss 4" has probability 0.0625.',
    'Week 10 tutorial system: 12 terminals with a CPU, a fast disk and a slow disk; doubling the CPU speed moves the bottleneck from the CPU to the slow disk.',
  ],
};

export const week08Practice: PracticeQuestion[] = [
  {
    title: 'Week 8: response time and bounds from an observed closed system',
    scenario:
      'A closed system is observed for 30 minutes. 1,600 tasks complete, submitted from 12 terminals, each with a think time of 12 s. The system has a CPU, a fast disk and a slow disk. During the observation the CPU is busy for 1,080 s, the fast disk for 400 s and the slow disk for 600 s.',
    parts: [
      'What is the response time of the observed system?',
      'As a function of the number of terminals N, what are the high-load bounds on throughput and response time?',
      'As a function of N, what are the low-load bounds on throughput and response time?',
      'How many terminals can be supported while keeping response time below 3 s?',
    ],
    weeks: [8],
    answer: [
      'X = 1,600 ÷ 1,800 s = 0.889 jobs/s. Interactive response-time law: R = N ÷ X − Z = 12 ÷ 0.889 − 12 = 13.5 − 12 = 1.5 s.',
      'Service demands (busy time ÷ jobs): CPU = 1,080 ÷ 1,600 = 0.675 s, fast disk = 400 ÷ 1,600 = 0.25 s, slow disk = 600 ÷ 1,600 = 0.375 s. Dmax = 0.675 s (the CPU is the bottleneck). X ≤ 1 ÷ Dmax = 1 ÷ 0.675 ≈ 1.48 jobs/s. R ≥ N × Dmax − Z = 0.675N − 12 seconds. (The official answer rounds the demands to 0.68 and 0.38.)',
      'D = 0.675 + 0.25 + 0.375 = 1.3 s per job. X ≤ N ÷ (D + Z) = N ÷ 13.3 ≈ 0.075N jobs/s. R ≥ D = 1.3 s.',
      'Use the high-load bound: 0.675N − 12 < 3, so N < 15 ÷ 0.675 = 22.2. At most 22 terminals.',
    ],
  },
  {
    title: 'Week 8: redesigning around the bottleneck',
    scenario:
      'Same system as the previous question: per-job service demands are CPU 0.675 s, fast disk 0.25 s and slow disk 0.375 s, with think time 12 s. The fast disk delivers a block in half the time the slow disk takes.',
    parts: [
      'The CPU is replaced by one twice as fast. Estimate how many terminals can now be supported with response time below 3 s.',
      'What is the largest Dmax that allows 45 terminals with response time below 3 s?',
      'Propose a design that supports 45 terminals with response time below 3 s.',
    ],
    weeks: [8],
    answer: [
      'New CPU demand = 0.675 ÷ 2 = 0.3375 s. The demands are now 0.3375, 0.25 and 0.375, so the bottleneck moves to the slow disk: Dmax = 0.375 s and X ≤ 1 ÷ 0.375 ≈ 2.67 jobs/s (the official answer uses 0.38 and gets 2.63). R ≥ 0.375N − 12 < 3 gives N < 40, so the highest N is 39.',
      '45 × Dmax − 12 < 3, so Dmax < 15 ÷ 45 = 0.33 s. Every device must have a demand under 0.33 s.',
      'Two devices are over the limit, so fix both. CPU: 0.675 ÷ 0.33 ≈ 2.1, so make the CPU at least about 2.1 times faster. Slow disk (0.375 ÷ 0.33 ≈ 1.15): either replace it with a disk at least 1.15 times faster, or shift about a quarter of its files to the fast disk. Shifting a quarter cuts the slow-disk demand to about 0.28 s; the moved work (about 0.1 s) takes half as long on the fast disk, so the fast disk rises to 0.25 + 0.5 × 0.1 = 0.30 s. Finally check that every device demand is below 0.33 s.',
    ],
  },
  {
    title: 'Week 8: lecture running example (CPU and database)',
    scenario:
      'Each job makes 2 visits to the CPU and 3 visits to the database, and every visit takes 20 ms. Think time is 5 s. With 20 clients the measured throughput is 3.92 jobs/s.',
    parts: [
      'Find the service demand of each device and identify the bottleneck.',
      'What is the response time with 20 clients, and what does it tell you?',
      'What is the maximum throughput, and what are the device utilisations at 10 jobs/s?',
      'How many clients can be supported while keeping the average response time below 2 s?',
    ],
    weeks: [8],
    answer: [
      'D(CPU) = 2 × 0.02 = 0.04 s. D(database) = 3 × 0.02 = 0.06 s. The database has the largest demand, so it is the bottleneck.',
      'R = N ÷ X − Z = 20 ÷ 3.92 − 5 ≈ 0.10 s. That equals D = 0.04 + 0.06 = 0.10 s, the low-load bound, so at this load there is almost no queueing.',
      'X ≤ 1 ÷ Dmax = 1 ÷ 0.06 ≈ 16.67 jobs/s. At X = 10: U(CPU) = 0.04 × 10 = 40%, U(database) = 0.06 × 10 = 60%. At 16.7 jobs/s the database reaches 100% while the CPU is at about 67%.',
      'High-load bound: N × 0.06 − 5 ≤ 2, so N ≤ 7 ÷ 0.06 = 116.7. About 116 clients, as a planning estimate and not a guarantee.',
    ],
  },
  {
    title: 'Week 8: M/M/1 time in system as load rises',
    scenario:
      'A single server handles μ = 10 requests/s. Arrivals are Poisson and service times are exponential. The arrival rate λ is varied: 5, 8, 9 and 9.5 requests/s.',
    parts: [
      'What is the average service time?',
      'For each arrival rate, find the utilisation ρ and the average time in the system T.',
      'What design rule follows from these numbers?',
    ],
    weeks: [8],
    answer: [
      'Average service time = 1 ÷ μ = 1 ÷ 10 = 0.1 s.',
      'ρ = λ ÷ μ and T = 1 ÷ (μ × (1 − ρ)). λ = 5: ρ = 50%, T = 1 ÷ (10 × 0.5) = 0.20 s. λ = 8: ρ = 80%, T = 1 ÷ (10 × 0.2) = 0.50 s. λ = 9: ρ = 90%, T = 1 ÷ (10 × 0.1) = 1.00 s. λ = 9.5: ρ = 95%, T = 1 ÷ (10 × 0.05) = 2.00 s.',
      'Response time grows sharply near saturation: going from 80% to 95% load quadruples the time in system even though the service time is still 0.1 s. Keep the load at the bottleneck below about 0.8 so no resource gets saturated.',
    ],
  },
];
