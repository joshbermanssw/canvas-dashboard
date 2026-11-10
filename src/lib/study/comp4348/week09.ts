import type { PracticeQuestion, Topic } from '../types';

/** Sources: w09.txt (slides), extra/w09-lec-notes.txt, extra/w10-tut.txt and extra/w10-tut-ans.txt (Week 10 tutorial, Q2-Q4). */
export const week09: Topic = {
  week: 9,
  title: 'Availability',
  summary:
    'How to define, measure and calculate availability (nines, MTTF, MTTR, series and parallel arrangements), how faults turn into failures, and the engineering techniques that keep a service up: redundancy, spare capacity, safe retries and tested recovery.',
  concepts: [
    {
      term: 'Reliability',
      definition:
        'Correct service over a stated interval: the system performs its intended operations without a failure. It answers "will it keep working for the next N hours?".',
    },
    {
      term: 'Availability',
      definition:
        'Readiness to provide service when needed: the service can accept and complete the required operations. A service that fails often but recovers quickly can still be highly available.',
    },
    {
      term: 'Service window and success criterion',
      definition:
        'The agreed period over which availability is promised (all day, business hours, etc.) and the statement of what counts as success. An availability percentage means nothing without both.',
    },
    {
      term: 'Fault, error and failure',
      definition:
        'A fault is the cause (a defect, possibly dormant). An error is the incorrect internal state it produces when activated. A failure is when the delivered service deviates from its specification. Example: a bug in stock-decrement logic (fault) makes stored stock −1 (error), and a customer orders stock that does not exist (failure).',
    },
    {
      term: 'Fail-stop',
      definition:
        'A component that not only stops when it fails but whose stop other components can reliably detect. A server that is merely unreachable is not fail-stop, because a timeout could also mean a slow network.',
    },
    {
      term: 'Bohrbug and Heisenbug',
      definition:
        'A Bohrbug reproduces under the same controlled conditions, so a stable test case isolates it. A Heisenbug changes between executions or under observation, typically because of concurrency, scheduling or the environment.',
    },
    {
      term: 'Failure rate (λ) and AFR',
      definition:
        'λ is failures divided by total operating time, in units such as failures per device-year. The annualised failure rate (AFR) is λ expressed per year. A rate can exceed 1 per year (a repaired device can fail again); a probability cannot.',
    },
    {
      term: 'Memoryless failure model',
      definition:
        'A constant failure rate, so the chance of surviving the next interval does not depend on how long the component has already survived. It fits the middle of a component life, not the start or end.',
    },
    {
      term: 'Bathtub curve',
      definition:
        'The hardware failure-rate curve over age: high early (construction faults), roughly constant during useful life, and rising again late (physical wear-out). Software does not wear out; its risk changes with workload, dependencies and configuration.',
    },
    {
      term: 'MTTF',
      definition:
        'Mean time to failure. It equals 1 ÷ λ only under a constant (exponential) failure rate. It is a mean for a population, not a guarantee: an MTTF of 100 years does not mean a device fails at age 100.',
    },
    {
      term: 'MTTR',
      definition:
        'Mean time from failure until correct service resumes. It covers the whole unavailable interval: detection, diagnosis, repair, restart and state recovery.',
    },
    {
      term: 'Single point of failure',
      definition: 'A component whose failure alone stops the service. High availability starts by replicating these, including the dependencies replicas share.',
    },
    {
      term: 'Failure domain',
      definition:
        'A set of components that a single cause can take out together, such as one rack, power feed, network switch or data centre. Replicas in the same domain do not fail independently.',
    },
    {
      term: 'Hot and warm standby',
      definition:
        'A hot standby is kept ready and changes over quickly. A warm standby needs more recovery work before it can take over. The readier the standby, the more it costs.',
    },
    {
      term: 'N-plex redundancy',
      definition:
        'Running several copies of a component so another can take over when one fails, while the failed copy is repaired. It only helps if enough healthy copies with enough capacity remain.',
    },
    {
      term: 'Idempotence',
      definition:
        'Repeating one logical operation preserves its intended effect: write(5) is idempotent, add(2) is not. It is what makes a retry safe, although a late replay can still overwrite a newer result unless versions or preconditions protect it.',
    },
    {
      term: 'Backward and forward recovery',
      definition:
        'Backward recovery restores a known valid checkpoint or backup and replays operations from a durable log. Forward recovery applies corrective or compensating operations (e.g. a refund) to reach a new acceptable state.',
    },
    {
      term: 'Risk register',
      definition:
        'A living list of what could go wrong, with likelihood, severity, an owner, a planned response and evidence the response was tested. It is updated whenever the architecture or operating conditions change.',
    },
    {
      term: 'Two mistakes high',
      definition:
        'Keep enough spare capacity to survive two problems at once, such as one node down for an upgrade plus one node failing, and still carry the full load.',
    },
  ],
  frameworks: [
    {
      name: 'Four strategies for high availability',
      source: 'Lecture 9 slides',
      points: [
        'Remove single points of failure: replicate critical components and the dependencies they share.',
        'Detect and recover: health checks, automated restart and a tested failover path reduce the interruption.',
        'Provide spare capacity at every level: disks, channels, processors, power, cooling, memory, applications and databases.',
        'Choose standby readiness: hot standby changes over quickly, warm standby needs more recovery work.',
        'Redundancy helps only when the surviving resources can actually deliver the service.',
      ],
    },
    {
      name: 'Classifying failures: behaviour versus persistence',
      source: 'Lecture 9 slides',
      points: [
        'Behaviour: crash or stop (the component stops doing work), wrong output (it responds with an incorrect value), timing (a correct response arrives too late).',
        'Persistence: permanent (the cause remains until repair), transient (a short-lived disturbance), intermittent (a cause that keeps re-activating).',
        'What can fail: hardware, software (OS, DBMS, runtimes, network stacks), environment (power, cooling, network) and the application, its configuration and even the repair action.',
        'Causes can be deliberate (an attacker denying service or corrupting state) or accidental (defects, overload, configuration and process errors), and several often combine.',
        'Root-cause analysis with the five whys: keep asking why until you reach something a process change can prevent, and validate each causal link.',
      ],
    },
    {
      name: 'Failover and the in-flight request',
      source: 'Lecture 9 slides and notes',
      points: [
        'After a component fails: detect the fault and reroute traffic, let a surviving replica handle new work, and repair the failed component while service continues.',
        'A request in flight at the moment of failure may have aborted, committed or be uncertain. Routing can move traffic quickly but cannot tell you the outcome of an unknown transaction.',
        'A timeout leaves the outcome uncertain: "request never arrived" and "charge committed but reply lost" look identical to the client.',
        'So the caller needs a defined retry policy, and recovery must restore a consistent state.',
      ],
    },
    {
      name: 'Durable idempotency record (safe retry after a timeout)',
      source: 'Lecture 9 slides and notes',
      points: [
        '1. Identify the operation: the client reuses one key for every retry of the same logical request.',
        '2. Commit once: the service records the key, the effect and the result atomically.',
        '3. Return the recorded result: a duplicate key returns the earlier outcome instead of repeating the effect.',
        '4. Preserve the contract: check the payload matches, decide how long keys are kept, and handle concurrency and ordering.',
        'The record must be durable, and one key identifies one operation; reusing it for a different operation is an error.',
        'Timestamps alone do not guarantee deduplication or correct ordering.',
      ],
    },
    {
      name: 'Series versus parallel arrangements',
      source: 'Lecture 9 slides and notes',
      points: [
        'Series (every component required): multiply the availabilities. The service is less available than its weakest component, so keep dependency paths short.',
        'Parallel (any one of n identical, independent copies is enough): availability = 1 − (1 − A)ⁿ. Two copies at 99% give 99.99% on paper.',
        'A shared required dependency sits in series with the redundant group and dominates: 0.999 × 0.9999 = 99.89%. Improving the replicas cannot remove it.',
        'Both calculations assume independent failures. Replicas in one rack share power, network and cooling, so the real figure is lower.',
        'Multiplying availabilities (long-run fraction of time up) and adding failure rates (time to the first failure) answer different questions.',
        'If k healthy nodes are needed for capacity, it is a k-out-of-n requirement and the any-one-of-n parallel formula does not apply.',
      ],
    },
    {
      name: 'Reduce MTTR or raise MTTF?',
      source: 'Lecture 9 slides and notes',
      points: [
        'A = MTTF ÷ (MTTF + MTTR), so availability rises if you fail less often or recover faster.',
        'With 1,000 h between failures, cutting restore time from 1 h to 6 min lifts availability from 99.9001% to 99.9900%: the same failure frequency with about ten times less downtime.',
        'Faster detection, automated restart and rehearsed failover are usually cheaper than making components fail less often.',
        'In a redundant pair, MTTR is in the denominator of the pair MTTF, so halving repair time doubles the pair lifetime.',
      ],
    },
    {
      name: 'Fail-fast components and partial service',
      source: 'Lecture 9 slides',
      points: [
        'Clear failure: expose an unambiguous error when a component cannot meet its contract.',
        'Bounded waiting: put deadlines and timeouts on calls to dependencies.',
        'Containment: avoid repeatedly calling a failed dependency; retry with limits and backoff.',
        'Partial service: provide a defined fallback while repair proceeds, e.g. a static popular-products list when product search is down.',
      ],
    },
    {
      name: 'Risk management and testing mitigations',
      source: 'Lecture 9 slides',
      points: [
        'Five areas of availability engineering: failure-aware design, scaling, risk mitigation, monitoring and a defined (automated, repeatable) response.',
        'Risk register entry: failure scenario, likelihood and severity, proposed response, a test question, plus an owner.',
        'Test mitigations as experiments: state a hypothesis (which user-visible function should survive), run a controlled experiment with limited scope and duration, define an abort threshold and recovery owner, then measure detection time, recovery time and correctness.',
        'Game Days and Chaos Monkey are examples of deliberately testing resilience and error recovery.',
        'Logs that support recovery: record time, component, event, request or trace ID, result, latency, version and error details; store them durably and independently, redact secrets, control access and keep clocks consistent.',
      ],
    },
    {
      name: 'Spare capacity and rolling upgrades',
      source: 'Lecture 9 slides and notes',
      points: [
        'Nodes needed for the load = ceiling(load ÷ capacity per node).',
        'Add one node for each simultaneous loss you must tolerate (a failure, an upgrade).',
        'Rolling upgrade: upgrade one replica at a time and return it to service; to everything else, a node under maintenance looks like a failed node.',
        'Leave headroom for a failure during maintenance and for skewed traffic.',
        'Lecture example: 1,000 req/s at 300 req/s per node needs 4 nodes to carry the load, 5 to survive one failure and 6 to survive an upgrade plus a failure.',
      ],
    },
  ],
  formulas: [
    {
      name: 'Availability (definition)',
      formula: 'availability = usable required time ÷ total required time',
      note: 'Measured over the agreed service window. Scheduled maintenance counts as downtime when it interrupts that window.',
    },
    {
      name: 'Downtime from an availability target',
      formula: 'downtime = (1 − A) × period',
      note: 'A = availability as a fraction. Example: 99.9% over a year = 0.001 × 525,600 min = 525.6 min ≈ 8.76 h.',
    },
    {
      name: 'Time constants (365-day year)',
      formula: '1 year = 8,760 hours = 525,600 minutes = 31,536,000 seconds; 30-day month = 43,200 minutes',
      note: 'Use these to convert between availability and downtime.',
    },
    {
      name: 'Downtime table for the nines',
      formula: '99% = 7 h 12 min/month, 3 d 15 h 36 min/year; 99.9% = 43 min 12 s/month, 8 h 45 min 36 s/year; 99.99% = 4 min 19 s/month, 52 min 34 s/year; 99.999% = 25.9 s/month, 5 min 15 s/year',
      note: 'Month = 30 days, year = 365 days. Each extra nine cuts the downtime budget by ten.',
    },
    {
      name: 'Availability from MTTF and MTTR',
      formula: 'A = MTTF ÷ (MTTF + MTTR)',
      note: 'MTTF = mean time to failure (mean up time); MTTR = mean time to restore service. Both must be in the same time unit. Example: 1,000 ÷ (1,000 + 1) = 99.9001%.',
    },
    {
      name: 'Survival probability (constant failure rate)',
      formula: 'R(t) = exp(−λt)',
      note: 'R(t) = probability of surviving beyond time t; λ = constant failure rate. Example: λ = 0.1 per year gives 90.5% after 1 year and 36.8% after 10 years.',
    },
    {
      name: 'Memoryless property',
      formula: 'P(T > s + t given T > s) = P(T > t)',
      note: 'T = time to failure. Having survived s tells you nothing about the next t.',
    },
    {
      name: 'Estimated failure rate',
      formula: 'λ = failures ÷ total operating time',
      note: 'Units: failures per device-year or per hour. Expressed per year, it is the AFR.',
    },
    {
      name: 'Expected number of failures',
      formula: 'E[failures] ≈ N × λ × t',
      note: 'N = number of devices; λ = failure rate; t = time. Example: 100,000 devices × 0.01 per year × 1 year ≈ 1,000 failures.',
    },
    {
      name: 'Probability of at least one failure in time t',
      formula: 'p = 1 − exp(−λt)',
      note: 'From the lecture notes. For small λt this is close to λt (0.02 per year gives 1.98%); a rate of 1.0 per year gives 63.2%, not 100%.',
    },
    {
      name: 'Mean time to failure',
      formula: 'MTTF = 1 ÷ λ',
      note: 'Valid only for a constant (exponential) failure rate. Example: λ = 0.01 per year gives MTTF = 100 years.',
    },
    {
      name: 'Annualised failure rate from fleet data',
      formula: 'AFR = failures × 365 ÷ total drive-days',
      note: 'Normalises by exposure. Backblaze example: 4,805 × 365 ÷ 104,231,470 = 0.01683 = 1.68% per year.',
    },
    {
      name: 'Series availability',
      formula: 'A(system) = A₁ × A₂ × … × Aₖ',
      note: 'All k components are required and their up/down states are independent. Example: 0.999³ = 0.997003 = 99.7003%, about 26.3 hours down per year.',
    },
    {
      name: 'Series failure rate',
      formula: 'λ(system) = λ₁ + λ₂ + … + λₖ',
      note: 'For independent exponential lifetimes; describes the time until the first required component fails. Overall MTTF = 1 ÷ λ(system).',
    },
    {
      name: 'Parallel availability (any one of n copies)',
      formula: 'A(n copies) = 1 − (1 − A)ⁿ',
      note: 'A = availability of one copy. Assumes identical, independent replicas, any one sufficient, ideal failover. Example: 1 − 0.01² = 99.99%.',
    },
    {
      name: 'Redundant group with a shared dependency',
      formula: 'A(service) = A(shared) × (1 − (1 − A)ⁿ)',
      note: 'The shared component is in series with the replicas. Example: 0.999 × 0.9999 = 99.89001%.',
    },
    {
      name: 'MTTF of n redundant copies with repair',
      formula: 'MTTFₙ ≈ MTTFⁿ ÷ (n × MTTRⁿ⁻¹)',
      note: 'Fast-repair approximation: independent exponential failures and repairs, MTTR much smaller than MTTF. For a pair: MTTF² ÷ (2 × MTTR), e.g. 1,000² ÷ (2 × 1) = 500,000 h ≈ 57 years.',
    },
    {
      name: 'Nodes needed for capacity',
      formula: 'installed nodes = ceiling(load ÷ capacity per node) + simultaneous losses to tolerate',
      note: 'Example: ceiling(1,000 ÷ 300) = 4 working nodes; 5 survive one failure; 6 survive one upgrade plus one failure.',
    },
    {
      name: 'Request-based availability',
      formula: 'availability = successful requests ÷ total requests',
      note: 'From the lecture notes: an alternative to the time-based figure. The two can differ, e.g. an outage at 3 a.m. costs much time but few requests.',
    },
  ],
  examples: [
    'Three checkout scenarios: a running service that charges the wrong total (uptime misses correctness), a service down for maintenance in the required window, and a replica failure with a brief interruption (recovery time affects availability).',
    'Simple available system: web clients, a load-balanced web server farm, load-balanced app servers and a clustered high-availability database, split across two failure domains with a primary and a standby database.',
    'Payment timeout: the client sends "charge $100", the charge commits but the reply is lost. Retrying with the same idempotency key (e.g. K42) returns the saved result instead of charging twice.',
    'Five whys for a car that will not start: dead battery, alternator not working, alternator belt broken, belt past its useful life and never replaced, maintenance schedule not followed.',
    'Backblaze fleet data (20 Apr 2013 to 31 Dec 2018): 4,805 failures over 104,231,470 drive-days gives an AFR of 1.68%. It is a historical fleet rate, not a guarantee for one drive.',
    'Faster restoration: 1,000 h up with 1 h restore is 99.9001%; with 0.1 h (6 min) restore it is 99.9900%.',
    'Three-tier service: web, application and database at 99.9% each give 0.999³ = 99.7003%, about 26.3 hours down per year.',
    'Risk register entry: the identity service is unavailable so the front end cannot authenticate users (low likelihood, high impact); response is to cache suitable identity data for a limited period; test which operations can safely use stale data and for how long.',
    'Database risk: stateless replicas share one database; RAID protects disks but the database service is still a failure point, so add a hot standby and test detection, routing and state recovery.',
    'Week 10 tutorial analogy: a mortality rate of about 98 per 100,000 per year for 20-25 year olds behaves like an annual failure rate, and a car with five failure modes behaves like a series system.',
  ],
};

export const week09Practice: PracticeQuestion[] = [
  {
    title: 'Week 9: mortality rate as a failure rate',
    scenario:
      'The mortality rate for people aged 20 to 25 is about 98 per 100,000 per year (0.098%). Treat it like an annual failure rate.',
    parts: [
      'In a city with 100,000 22-year-olds, how many are expected to die in a year, and in one week?',
      'What is the probability that someone turning 22 survives to 23?',
      'In a club of 100 such people, what is the probability of at least one death in the coming year?',
      'In a club of 100 such people, what is the probability that at least one member is still alive after one year?',
      'In a city of 5,000,000 people of all ages with an overall mortality rate of 825 per 100,000 per year, how many are expected to die in a week?',
    ],
    weeks: [9],
    answer: [
      'Expected deaths per year = 100,000 × 0.098% = 98. Per week = 98 ÷ 52 ≈ 1.88, about 2. "Expected" is the mean of a random variable; it does not mean exactly 98 will die.',
      'P(survive) = 1 − 0.00098 = 0.99902 ≈ 99.9%.',
      'P(no deaths among 100) = 0.99902¹⁰⁰ ≈ 0.907. P(at least one death) = 1 − 0.907 = 0.093.',
      'P(all 100 die) = 0.00098¹⁰⁰, which is about 10⁻³⁰⁰. P(at least one alive) = 1 − that ≈ 1.',
      'Deaths per week = 0.825% × 5,000,000 ÷ 52 = 41,250 ÷ 52 ≈ 793.',
    ],
  },
  {
    title: 'Week 9: car with five failure modes',
    scenario:
      'A car has five failure modes, given as (MTTF; MTTR): wreck (20 years; 2 weeks), mechanical (1 year; 3 weeks), electrical (3 years; 1 day), flat tyre (3 years; 1 hour), out of gas (3 years; 5 hours).',
    parts: [
      'What is the overall MTTF of the car?',
      'What is the overall availability of the car?',
      'A warning system completely prevents running out of gas. What happens to the overall MTTF and availability?',
    ],
    weeks: [9],
    answer: [
      'Add the failure rates (failures per year): 1/20 + 1 + 1/3 + 1/3 + 1/3 = 0.05 + 1 + 1 = 2.05 per year, so the AFR is 2.05. Overall MTTF = 1 ÷ 2.05 ≈ 0.49 years, about 6 months.',
      'Availability of each mode = MTTF ÷ (MTTF + MTTR) in years: wreck 20 ÷ (20 + 2/52) ≈ 0.998; mechanical 1 ÷ (1 + 3/52) ≈ 0.945; electrical 3 ÷ (3 + 1/365) ≈ 0.999; flat tyre 3 ÷ (3 + 1/(24 × 365)) ≈ 0.99996; out of gas 3 ÷ (3 + 5/(24 × 365)) ≈ 0.9998. The modes are in series, so multiply: ≈ 0.94.',
      'Rate without out-of-gas = 0.05 + 1 + 1/3 + 1/3 ≈ 1.72 per year, so MTTF = 1 ÷ 1.72 ≈ 0.58 years (up from 0.49). Availability = 0.998 × 0.945 × 0.999 × 0.99996 ≈ 0.94, essentially unchanged, because out-of-gas repairs are short and the mechanical mode (3 weeks per year) dominates the downtime.',
    ],
  },
  {
    title: 'Week 9: is a redundant 2-plex worth buying?',
    scenario:
      'A computer system costs $10,000 and has an AFR of 5% (0.05 failures per year). It runs a job that takes 1 hour. Each successful job earns $1 profit; if the system fails during a job, $100 compensation is paid to the user. Assume the system runs jobs around the clock and that MTTR is 1 week (about 0.02 years).',
    parts: [
      'What is the expected yearly return from one system?',
      'Is it financially sensible to buy a second system and run a redundant 2-plex?',
      'How could the parameters change to reverse that conclusion?',
    ],
    weeks: [9],
    answer: [
      'MTTF = 1 ÷ 0.05 = 20 years; availability = 20 ÷ (20 + 0.02) ≈ 0.999. Reason over 100 systems for a year: 24 × 365 × 100 = 876,000 job slots; expected failures = 0.05 × 100 = 5; jobs lost to repair = 5 × 7 × 24 = 840; successful jobs = 876,000 − 5 − 840 = 875,155. Net profit = 875,155 × $1 − 5 × $100 = $874,655 on a $1,000,000 outlay. Per system: about $8,747 a year on $10,000, roughly an 87% return.',
      '2-plex availability = 1 − (1 − 0.999)² = 0.999999. MTTF(2-plex) ≈ MTTF² ÷ (2 × MTTR) = 20² ÷ (2 × 0.02) = 10,000 years, so AFR = 0.0001. Profit ≈ 0.999999 × 8,760 ≈ $8,760; expected compensation = 0.0001 × $100 = $0.01; net ≈ $8,760. The second $10,000 system raises the return by only about $13 a year, so it is not a good investment. Using the second machine to run more jobs would earn far more.',
      'Redundancy pays when a failure is much more costly. If each failure cost $200,000 in compensation, a single system would expect 0.05 × $200,000 = $10,000 a year in compensation, more than its profit (a net loss), while the 2-plex would expect only 0.0001 × $200,000 = $20.',
    ],
  },
  {
    title: 'Week 9: lecture availability arithmetic',
    scenario:
      'Work through the worked examples from the availability lecture.',
    parts: [
      'A component is up for 1,000 h on average. Compare its availability with a 1 h restore time and with a 6 min restore time.',
      'Web, application and database tiers are each 99.9% available and all are required. What is the service availability and yearly downtime?',
      'Two replicas are each 99% available and either can deliver the full service. They both need one shared component that is 99.9% available. What is the availability of the pair, and of the whole service?',
      'Load is 1,000 req/s and each healthy node supports 300 req/s. How many nodes are needed to carry the load, to survive one failure, and to survive one upgrade plus one failure?',
    ],
    weeks: [9],
    answer: [
      'A = MTTF ÷ (MTTF + MTTR). With 1 h: 1,000 ÷ 1,001 = 99.9001%. With 0.1 h: 1,000 ÷ 1,000.1 = 99.9900%. Same failure frequency, about ten times less downtime, so faster recovery gains a nine.',
      'Series: 0.999 × 0.999 × 0.999 = 0.997003 = 99.7003%. Downtime = (1 − 0.997003) × 8,760 h ≈ 26.3 hours per year, worse than any single tier (8.76 h each).',
      'Pair: 1 − (1 − 0.99)² = 1 − 0.0001 = 99.99%. Whole service: 0.999 × 0.9999 = 0.9989001 = 99.89%. The shared dependency dominates, so improve or replicate it first.',
      'Working nodes = ceiling(1,000 ÷ 300) = 4 (4 × 300 = 1,200 req/s). With 4 installed, one failure leaves 3 × 300 = 900 req/s, which is not enough, so 5 nodes survive one failure. 6 nodes survive one upgrade plus one failure (4 healthy nodes remain). This is a 4-out-of-n requirement, so the any-one-of-n parallel formula does not apply.',
    ],
  },
];
