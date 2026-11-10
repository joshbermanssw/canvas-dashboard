import type { PracticeQuestion, Topic } from '../types';

/** Sources: w05.txt / w05.pdf, extra/w05-lec-notes.txt, extra/w05-tut.txt, extra/w05-tut-ans.txt, extra/w05-tut-notes.txt. */
export const week05: Topic = {
  week: 5,
  title: 'Performance',
  summary:
    'What performance means (load, throughput, response time, figures of merit), how to measure it so the number can be trusted, and the principles that explain why systems slow down: concurrency, saturation, queues, bottlenecks, caching and scaling out. This is the calculation week: unit conversion, cost, utilisation, cache access time and disk read time.',
  concepts: [
    {
      term: 'Load (workload)',
      definition:
        'How much work the system is asked to do: how many job requests arrive per unit time, and how much work each request involves. Performance always depends on the load.',
    },
    {
      term: 'Job class',
      definition:
        'A type of job in the load, for example a small read by primary key, a large range read, or an update. Load is described by the relative amount of each type or, equivalently, by the separate arrival rate of each type.',
    },
    {
      term: 'Open system',
      definition:
        'Jobs are generated at some rate, and each leaves the system once processed. A sensible model for web requests. Load is potentially unbounded, so access control is needed.',
    },
    {
      term: 'Closed system',
      definition:
        'A fixed number of clients each generate a job and only generate the next one after the previous one finishes. A sensible model for a fixed network of sales points. Load is potentially bounded because of this feedback loop.',
    },
    {
      term: 'Think time',
      definition:
        'In a closed system, how long a client waits between the end of one job and the start of its next job.',
    },
    {
      term: 'Throughput',
      definition:
        'The amount of work done in a given time, for example jobs completed per second. Measured at the server or by adding up information from all clients. High is good.',
    },
    {
      term: 'Response time',
      definition:
        'The time from when a request is submitted until the response is received, usually measured at the client so it includes overheads and latency. When the answer comes back in stages, it runs until the first part of the response arrives. Low is good.',
    },
    {
      term: 'Runtime',
      definition:
        'For answers that come back in stages, the time from the request until all of the response has been received.',
    },
    {
      term: 'Figure of merit',
      definition:
        'The measure of performance chosen to judge a system: throughput, response time, work done per dollar, or work done per joule. You must also know whether a high or a low value is good.',
    },
    {
      term: 'Multiprogramming level (MPL)',
      definition:
        'The number of clients in a closed system. Because each client gives a roughly constant load, it is the independent variable when graphing how performance varies with load.',
    },
    {
      term: 'Speed-up',
      definition:
        'A scalability measurement: keep the type of work unchanged, add resources such as CPUs, and see how throughput changes. Ideally throughput rises in proportion and response time is unaffected; in practice throughput rises less and response time increases, because of resource contention and queueing.',
    },
    {
      term: 'Timer precision',
      definition:
        'How a timer value is reported, for example in milliseconds, microseconds, nanoseconds or double-precision seconds.',
    },
    {
      term: 'Timer resolution',
      definition:
        'How much the timer value jumps from one reading to the next. A clock with 10 ms resolution stays the same for a while and then increases by 10 ms. A value cannot be trusted by more than the resolution, even if the precision looks high.',
    },
    {
      term: 'Saturation',
      definition:
        'The point where, as more jobs are added, some resource becomes fully used and there is no way to get more work done. Performance actually starts to degrade with more concurrent requests.',
    },
    {
      term: 'Admission control',
      definition:
        'Limiting the number of jobs allowed into a system (or part of it) at the same time. Requests above the limit are dropped or queued. It stops queues growing indefinitely and prevents thrashing.',
    },
    {
      term: 'Thrashing',
      definition:
        'The downward spiral in the non-linear range: more load makes things slower, which reduces system capacity, which makes things slower again.',
    },
    {
      term: 'Bottleneck',
      definition:
        'The resource that reaches saturation first. Adding resources anywhere else has no impact on performance; adding resources to the bottleneck has a significant impact, until some other bottleneck appears.',
    },
    {
      term: 'Utilisation',
      definition:
        'For one resource, busy time divided by the length of the period (for example 218 ms of CPU work per second is 21.8%). It is calculated per resource and never added across resources.',
    },
    {
      term: 'Hit rate',
      definition:
        'The fraction of accesses that are served from the cache. It must be high for caching to be effective, which requires frequently accessing the same or physically close data (locality).',
    },
    {
      term: 'System under test (SUT)',
      definition:
        'The system being evaluated in a performance experiment. It can be arbitrarily complex, for example clustered servers or a multi-tier architecture. A client emulator on a separate machine generates the load and measures response time and throughput.',
    },
    {
      term: 'Scale out',
      definition:
        'Adding more boxes when a resource is fully used, and spreading load across them with load balancing at every level. Easy for stateless web and application servers, trickier for stateful database servers.',
    },
  ],
  frameworks: [
    {
      name: 'Measurement principles',
      source: 'Slide 14',
      points: [
        'Always include units, and convert for prefixes. Storage is historically measured differently (1 km = 1000 m but 1 KB = 1024 B); in calculation questions for this unit assume 1 KB = 1000 B.',
        'Watch bytes versus bits: 1 B = 8 b.',
        'Check dimensions: the units of the final expression must be the units asked for.',
        'Respect significant figures (resolution): a time stored as a double but incremented every 10 ms is only good to 10 ms.',
        'Report an average together with its variance: "averages are evil".',
        'Across job classes use a weighted average, where the weight is the number of occurrences of each job class.',
      ],
    },
    {
      name: 'How to run a trustworthy performance experiment',
      source: 'Slides 24, 25 and 30',
      points: [
        'Measure many times in different executions and present the result as the average plus or minus a range from statistics. A narrow range needs many samples, and you will not get a narrow range for latency once you are in the non-linear part of the performance curve.',
        'Run the client emulator on a separate machine from the server. Often one multithreaded client emulates n concurrent clients. Response time and throughput are measured at the client.',
        'Record data per thread and merge the per-thread tables under lock protection at the end, instead of sharing one table that threads contend for.',
        'Defer writing output until the experiment is finished (buffering helps) to avoid contention on the file system. Do not measure your test harness; voluminous output is not a good idea.',
        'Keep metadata and document what you did, including all parameter settings, so the result is reproducible.',
        'Use standard benchmarks (for example TPC-C and TPC-E for transaction processing, TPC-H and TPC-DS for decision support) to make results comparable. Downsides: some specifications are not free and designing good benchmarks is hard.',
      ],
    },
    {
      name: 'From concurrency to saturation to admission control',
      source: 'Slides 34 to 38',
      points: [
        'Concurrency helps at first: a job uses different resources at different times (CPU, then I/O, then CPU), so overlapping jobs gets more done. One job takes 3 time units; two overlapped jobs take 4.',
        'Saturation: add enough jobs and some resource becomes fully used, which sets an upper bound on the throughput of the whole system. You can roughly calculate this load per resource.',
        'Rule of thumb: plan for about 80% utilisation. This is average utilisation, not peak, so remember how the resource behaves when overloaded.',
        'Queues: when a resource is in use, requests wait in a queue (first-in-first-out, priority-based or efficiency-based). Waiting time lengthens response time. Queues even out peaks but capacity still cannot be exceeded.',
        'Variability matters as well as the average: jobs arriving exactly every 1.3 s that each take 1 s never queue; arrivals averaging one per 1.3 s with a normal distribution sometimes make a job wait, and that delay can pass on to the next job.',
        'Admission control stops queues growing indefinitely. A closed system has a built-in feedback loop (a waiting client cannot issue more requests); an open system must reject requests once fully loaded. Setting the limit is "often a black art".',
      ],
    },
    {
      name: 'Finding and fixing the bottleneck',
      source: 'Slide 39, lecture notes sections 20 and 23',
      points: [
        'For each resource (CPU, disk, network) work out the demand per request and the utilisation at the current arrival rate.',
        'The resource with the highest utilisation saturates first as load grows; it is the bottleneck and sets the ceiling for the whole system.',
        'Saturation arrival rate for a resource = current rate ÷ its utilisation (equivalently 1 ÷ demand per request).',
        'Adding resources elsewhere is useless. Add resources to the bottleneck, measure again, and expect a different resource to become the new bottleneck.',
        'Stateless resources are easy to scale; stateful resources are harder.',
        "The slide names Amdahl's Law here: the part of the work that cannot be sped up caps the overall gain.",
      ],
    },
    {
      name: 'Read caching and write caching',
      source: 'Slides 40 to 44',
      points: [
        'Read caching relies on uneven access patterns: the cache tries to hold the hot spots of a much larger dataset.',
        'Algorithm for a request: return the data from the cache if it is present; otherwise evict older data (least recently used), load from slow storage, and return it. Caches usually load larger chunks than requested (lines, pages).',
        'With a high hit rate the average access time is close to that of the fast cache. With poor locality requests go to slow storage with extra overhead.',
        'Write caching leaves updates in the cache instead of flushing them. It reduces write traffic for hot spots and sequential writes, absorbs peaks, and gives fast write latency. Trade-off: it may need power-fail backup so writes are not lost.',
        'Middle-tier database caching puts a front-end database next to each application server, kept consistent with the back-end master by lazy (asynchronous) replication with no syncing between caches. Trade-off: cached copies can be stale.',
        'Measured example: an internal cache hit was about 23 times faster than back-end database access and about 5 times faster than the middle-tier database cache. Real systems have caches at many layers (browser, web caches, web servers, application servers, database).',
      ],
    },
    {
      name: 'Scaling out and scaling state stores',
      source: 'Slides 45 to 48',
      points: [
        'Scale out: add boxes at any level (web servers for the user interface, application servers for stateless business logic, database servers) and balance load across them. It can improve robustness as well as performance, at a cost to application design and operations.',
        'Scaling stateless logic is easy; state stores are the hard part.',
        'Option 1, a bigger and faster box: may not help at all if the limit is lock contention or I/O.',
        'Option 2, replication: multiple copies of shared data, with applications using their own local copy. Changes made anywhere must be sent to everyone else, which is not simple.',
        'Option 3, partitioning: several servers each look after part of the state (customers A to M and N to Z, or districts 1 to 10 and 11 to 20), preferably transparent to applications.',
        'Real systems combine these. Typical layout: web server farm (network load balancing), application farm (load balancing), database servers (cluster services and partitioning).',
      ],
    },
    {
      name: 'Choosing a figure of merit',
      source: 'Slides 13, 15 and 49',
      points: [
        'Good throughput is high and good response time is low, and the two can disagree: a saturated system may show good throughput but poor response time.',
        'An average response time can look fine while the variance is poor.',
        'A common aim is maximum throughput while keeping response time within a bound, but state which response time: the average, a 99% bound, or the average plus or minus one standard deviation.',
        'Work done per dollar decides between options that differ in cost: in the tutorial the fastest configuration was not the best value.',
        'At cloud scale, people costs are small and data centre costs are dominated by power and cooling, so systems are optimised for work done per watt and for utilisation and availability, not raw performance.',
      ],
    },
  ],
  formulas: [
    {
      name: 'Data size prefixes (decimal, as used in this unit)',
      formula: '1 KB = 1,000 B; 1 MB = 1,000 KB = 10⁶ B; 1 GB = 1,000 MB = 10⁹ B; MB = bytes ÷ 1,000,000',
      note: 'B = byte. The lecture says to assume 1 KB = 1000 B in calculation questions, even though storage has historically used 1 KB = 1024 B (properly called 1 KiB).',
    },
    {
      name: 'Bits and bytes',
      formula: '1 B = 8 b; 1 MBps = 8 Mbps; MBps = Mbps ÷ 8',
      note: 'Lowercase b = bit, uppercase B = byte. Network speeds are quoted in bits per second, storage speeds in bytes per second. Example: a 100 Mbps link moves 100 ÷ 8 = 12.5 MB per second.',
    },
    {
      name: 'Time unit ladder',
      formula: '1 s = 10³ ms = 10⁶ µs = 10⁹ ns',
      note: 's = second, ms = millisecond, µs = microsecond, ns = nanosecond. Typical scales: disk seek in ms, SSD set-up in µs, CPU cycle and cache access in ns.',
    },
    {
      name: 'Clock speed to cycle time',
      formula: 'time per cycle = 1 ÷ clock speed; 1 GHz = 10⁹ cycles per second, so 2 GHz gives 0.5 ns per cycle',
      note: 'Hz = cycles per second; 1 MHz = 10⁶ Hz; 1 GHz = 10⁹ Hz.',
    },
    {
      name: 'CPU time per request',
      formula: 'CPU time = (instructions × cycles per instruction) ÷ clock speed',
      note: 'Clock speed in cycles per second. Example: 2,000,000 instructions × 2 cycles = 4,000,000 cycles; ÷ 2 × 10⁹ = 0.002 s = 2 ms. The cycles per instruction must be given; it cannot be derived from GHz.',
    },
    {
      name: 'Instruction rate (MIPS)',
      formula: 'instructions per second = clock speed ÷ cycles per instruction; MIPS = instructions per second ÷ 10⁶',
      note: 'MIPS = millions of instructions per second. Example: 2 GHz at 1 cycle per instruction = 2,000 MIPS; at 4 cycles per instruction = 500 MIPS.',
    },
    {
      name: 'Arrival rate from inter-arrival time',
      formula: 'λ = 1 ÷ time between requests; rate of class i = share of class i × λ',
      note: 'λ = arrival rate in requests per second. Example: one request every 100 ms gives λ = 10 per second; a 90%/10% mix gives 9 type A and 1 type B per second.',
    },
    {
      name: 'Utilisation of a resource',
      formula: 'ρ = busy time in a period ÷ length of the period = Σ (rate of class i × demand of class i on this resource)',
      note: 'ρ = utilisation (0 to 1) of one resource. Rates in requests per second, demand in seconds per request. Compute separately for each resource; never add across resources.',
    },
    {
      name: 'Saturation point of a resource',
      formula: 'saturation rate = current arrival rate ÷ ρ = 1 ÷ average demand per request; headroom factor = 1 ÷ ρ',
      note: 'ρ = current utilisation of that resource with the job mix unchanged. Example: ρ = 0.218 at 10 requests per second gives 1 ÷ 0.218 ≈ 4.6 times the current rate ≈ 46 requests per second. Plan to about 80% of this as a rule of thumb.',
    },
    {
      name: 'Weighted average',
      formula: 'weighted average = Σ (wᵢ × cᵢ) ÷ Σ wᵢ',
      note: 'cᵢ = value for job class i (for example its response time or cost); wᵢ = number of occurrences of job class i over a common period, not the interval between occurrences. Example: 90% at 20 ms and 10% at 200 ms gives (0.9 × 20 + 0.1 × 200) ÷ 1 = 38 ms, not the unweighted 110 ms.',
    },
    {
      name: 'Total cost over a period',
      formula: 'total cost = Σ (cost per operation × number of operations in the period) + storage cost for the period',
      note: 'A total is a sum, not an average. Count every operation over the same period (for example 4 per minute = 240 per hour).',
    },
    {
      name: 'Cost of one operation (usage-priced service)',
      formula: 'cost per operation = (requests × price per request) + (MB sent × price per MB)',
      note: 'Multiply by a rate, never divide by it: MB × ($ per MB) = $. Convert bytes to MB first.',
    },
    {
      name: 'Storage cost',
      formula: 'storage cost per day = MB stored × price per MB per day; per hour = per day ÷ 24',
      note: 'Match the time base before adding to other costs. Example: 465 MB × $1.60 = $744 per day = $31 per hour.',
    },
    {
      name: 'Average memory access time with a cache',
      formula: 'average access time = h × t_cache + (1 − h) × t_mem',
      note: 'h = hit rate (0 to 1); t_cache = cache access time; t_mem = slow memory access time. In the official tutorial answer a miss costs t_mem only (70 ns), not t_cache + t_mem; state which model you use.',
    },
    {
      name: 'Time per instruction including memory access',
      formula: 'time per instruction = (cycles per instruction × time per cycle) + average access time ÷ N',
      note: 'N = number of instructions per load/store (1 load/store per 10 instructions means N = 10). Forgetting to divide by N overstates the memory cost N times.',
    },
    {
      name: 'Performance and performance per dollar',
      formula: 'performance (instructions per second) = 1 ÷ time per instruction; performance per dollar = performance ÷ cost',
      note: 'Time per instruction in seconds (1 ns = 10⁻⁹ s), cost in dollars. Example: 1 ÷ 5 ns = 0.2 × 10⁹ instructions per second.',
    },
    {
      name: 'Time for one I/O operation',
      formula: 'time per operation = set-up latency + bytes ÷ bandwidth',
      note: 'Set-up latency = fixed delay paid on every operation (seek and similar); bandwidth = sustained transfer rate, in the same byte units as the data. Example: 5 ms + 1,000 MB ÷ 250 MB/s = 4.005 s.',
    },
    {
      name: 'Total time to read a file in blocks',
      formula: 'number of operations = file size ÷ block size; total time = number of operations × time per operation',
      note: 'Sequential read = 1 operation. Reading 1 GB in 1 KB blocks = 10⁹ ÷ 10³ = 1,000,000 operations, each paying its own set-up latency.',
    },
    {
      name: "Amdahl's Law",
      formula: 'speed-up(N) = 1 ÷ (s + (1 − s) ÷ N); maximum speed-up as N grows = 1 ÷ s',
      note: 's = fraction of the work that is serial; N = number of processors. The slides only name the law; this formula is from the lecture notes. Example: s = 0.05, N = 16 gives 1 ÷ (0.05 + 0.059375) = 1 ÷ 0.109375 ≈ 9.1; the limit is 1 ÷ 0.05 = 20.',
    },
    {
      name: 'Response time breakdown',
      formula: 'response time = processor time + I/O time + wait time for shared resources',
      note: 'Processor time covers application, system services and database. I/O time is mostly storage reads and writes (large database caches reduce it). Wait time covers locks, shared structures and queues.',
    },
  ],
  examples: [
    'Job classes: type A reads 1 record from each of 3 tables by primary key; type B reads all records in a range by one attribute; type C does the type A lookups and then modifies one record.',
    'Timer resolution of System.currentTimeMillis(): 1 ms on Linux and Mac OS X, 10 ms on Windows. System.nanoTime() uses the best precision available but guarantees no resolution.',
    'Concurrency: one job that needs CPU, then I/O, then CPU takes 3 time units; two such jobs overlapped finish in 4 time units.',
    'Variability: jobs arriving exactly every 1.3 s that take 1 s each never queue; the same average with normally distributed arrivals sometimes queues.',
    'Tutorial Q1 result: storage costs $31 per hour but the three-request query costs $361.33 per hour, so the per-request charge (not storage or data volume) dominates the $392.91 hourly bill.',
    'Tutorial Q2 result: the CPU is 21.8% used and the disk 9%, so the CPU is the bottleneck and saturates at about 46 requests per second.',
    'Tutorial Q3 result: configuration Z is fastest (0.5 × 10⁹ instructions per second) but configuration Y is the best value (about 290,000 instructions per second per dollar).',
    'Tutorial Q4 result: the same 1 GB file takes 4.005 s read sequentially from a hard disk but 5,004 s as random 1 KB blocks, because one million 5 ms set-ups dominate.',
    'Lecture notes cost example: 50,000 records × 200 B = 10 MB; at $1.60 per MB per day that is $16.00 per day, or $16 ÷ 24 ≈ $0.667 per hour.',
    'Lecture notes utilisation example: 1,000,000 instructions × 2 cycles on a 2 GHz CPU = 1 ms per request; at 200 requests per second the CPU is 20% used; it saturates at 1,000 requests per second (plan for 800 at the 80% rule).',
    'Lecture notes I/O example: a 100 MB file at 200 MB/s with 5 ms set-up takes 505 ms sequentially, but 100,000 random 1 KB blocks take 100,000 × 5.005 ms = 500.5 s.',
  ],
};

export const week05Practice: PracticeQuestion[] = [
  {
    title: 'Week 5: hourly cost of a cloud-hosted inventory service',
    scenario:
      'A retailer keeps inventory data at a cloud facility: 100,000 customer records (120 B each), 300,000 order records (1.5 KB each) and 10,000 product records (300 B each). Once per hour a reporting operation makes one request that returns 100 products. Four times per minute, on average, a query operation runs as three separate requests: 1 customer, then 1 order, then on average 2 products. Charges: $0.50 per request received, $2.50 per MB transmitted to the client, and $1.60 per day for each MB stored. Use 1 KB = 1000 B.',
    parts: [
      'What is the storage cost per hour?',
      'What does one reporting operation cost, and what is its cost per hour?',
      'What does one query operation cost, and what is the query cost per hour?',
      'What is the total cost per hour, and which charge dominates?',
      'A colleague wrote: storage per hour = 465 ÷ 1.60 = $290.625; reporting sends 100 × 1.5 = 150 B and costs 0.50 + 2.50 ÷ 150; a query sends 120 + 1.5 + 2 × 300 = 721.5 B and costs 1.50 + 2.50 ÷ 721.5; the hourly cost is storage plus the average (3600 × 0.5167 + 15 × 1.5035) ÷ 3615. Identify the errors.',
    ],
    weeks: [5],
    answer: [
      'Customers: 100,000 × 120 B = 12,000,000 B = 12 MB. Orders: 300,000 × 1.5 KB = 450,000 KB = 450 MB. Products: 10,000 × 300 B = 3,000,000 B = 3 MB. Total 465 MB. Cost = 465 × $1.60 = $744 per day = $744 ÷ 24 = $31 per hour.',
      'Requests: 1 × $0.50 = $0.50. Data: 100 × 300 B = 30,000 B = 0.03 MB; 0.03 × $2.50 = $0.075. One operation = $0.575, and it runs once per hour, so $0.575 per hour.',
      'Requests: 3 × $0.50 = $1.50. Data: 120 B + 1,500 B + 2 × 300 B = 2,220 B = 0.00222 MB; 0.00222 × $2.50 = $0.00555. One query = $1.50555. Frequency: 4 per minute = 240 per hour, so 240 × $1.50555 = $361.332 per hour.',
      'Total = $31 + $0.575 + $361.332 = $392.907, about $392.91 per hour. The $0.50 per-request charge on the query dominates: 240 × $1.50 = $360 of the bill. The design lesson from the tutorial notes: returning customer, order and products in one request would cut that to 240 × $0.50 = $120 per hour.',
      '(1) Storage is divided by the price instead of multiplied: it should be 465 × 1.60. (2) The storage price is per day but was labelled per hour: divide $744 by 24. (3) Reporting used the wrong record size: it returns products at 300 B each (30,000 B), not 1.5, and the 1.5 KB order size was also treated as 1.5 B in the query. (4) The transmission charge is divided instead of multiplied, and applied to bytes although the price is per MB. (5) The total averages the two operations instead of adding cost × count for each, and it weights by the interval between operations (3600 s and 15 s) instead of by how many occur per hour (1 and 240).',
    ],
  },
  {
    title: 'Week 5: CPU and disk load, and which saturates first',
    scenario:
      'Requests arrive every 100 ms. 90% are type A: 2 million instructions at an average of 2 cycles each, plus 10 ms of disk activity. 10% are type B: 100 million instructions at an average of 4 cycles each, and no I/O. The CPU runs at 2 GHz.',
    parts: [
      'How much CPU time does one request of each type need?',
      'What load (utilisation) do these requests place on the CPU?',
      'What load do they place on the disk?',
      'If the arrival rate rises with the same mix, when and why does saturation occur?',
      'Why can response times get worse before that point, and what design change does the tutorial suggest?',
    ],
    weeks: [5],
    answer: [
      'Type A: 2,000,000 × 2 = 4,000,000 cycles; ÷ 2 × 10⁹ cycles per second = 0.002 s = 2 ms. Type B: 100,000,000 × 4 = 400,000,000 cycles; ÷ 2 × 10⁹ = 0.2 s = 200 ms.',
      'Arrival rate = 1 ÷ 0.1 s = 10 requests per second: 9 type A and 1 type B. CPU work per second = 9 × 2 ms + 1 × 200 ms = 218 ms, so utilisation = 218 ÷ 1000 = 21.8%.',
      'Only type A uses the disk: 9 × 10 ms = 90 ms per second, so utilisation = 9%.',
      'The CPU is the more heavily used resource, so it saturates first: at 1 ÷ 0.218 ≈ 4.6 times the current rate, about 46 requests per second (one request roughly every 22 ms). The disk would only saturate at 1 ÷ 0.09 ≈ 11 times the current rate, about 111 requests per second.',
      'Because of queueing: each type B request holds the CPU for 200 ms while requests keep arriving every 100 ms, so requests that arrive behind it must wait even though average utilisation is only 21.8%. The tutorial notes suggest putting type B on its own queue or worker pool so the slow requests cannot block the cheap type A requests.',
    ],
  },
  {
    title: 'Week 5: cache hit rate and performance per dollar',
    scenario:
      'Three configurations all have a 2 GHz CPU and 2 GB of slow memory. X has 128 kB of cache, costs $1,250, and gets a 50% hit rate. Y has 3 MB of cache, costs $1,500, and gets a 95% hit rate. Z has 64 MB of cache, costs $6,000, and gets a 100% hit rate. Excluding load/store time each instruction takes 2 cycles. Cache access takes 10 ns and slow memory access takes 70 ns. The workload does 1 load/store per 10 instructions.',
    parts: [
      'What is the instruction execution time, excluding memory access?',
      'What is the average memory access time for each configuration?',
      'What is the total time per instruction and the performance in instructions per second for each?',
      'What is the performance per dollar for each, and which configuration would you buy?',
    ],
    weeks: [5],
    answer: [
      'Time per cycle = 1 ÷ 2 GHz = 0.5 ns. Two cycles per instruction = 1 ns per instruction, the same for all three.',
      'Average access time = hit rate × 10 ns + miss rate × 70 ns. X: 0.5 × 10 + 0.5 × 70 = 40 ns. Y: 0.95 × 10 + 0.05 × 70 = 9.5 + 3.5 = 13 ns. Z: 1 × 10 + 0 × 70 = 10 ns.',
      'Only 1 instruction in 10 accesses memory, so time per instruction = 1 ns + access time ÷ 10. X: 1 + 4 = 5 ns, so 1 ÷ 5 ns = 0.2 × 10⁹ instructions per second. Y: 1 + 1.3 = 2.3 ns, so about 0.435 × 10⁹. Z: 1 + 1 = 2 ns, so 0.5 × 10⁹.',
      'X: 0.2 × 10⁹ ÷ 1,250 = 160,000 instructions per second per dollar. Y: 0.435 × 10⁹ ÷ 1,500 = 290,000. Z: 0.5 × 10⁹ ÷ 6,000 ≈ 83,333. Z is the fastest, but Y is the best value: going from Y to Z costs four times as much for about 15% more speed. Buy Y unless there is a hard requirement that only Z meets.',
    ],
  },
  {
    title: 'Week 5: sequential versus random reads on HDD and SSD',
    scenario:
      'A 1 GB file sits on an external hard disk (HDD) with a sequential read bandwidth of 250 MB/s and a set-up time of 5 ms per operation (disk seek and similar). Use 1 GB = 1000 MB and 1 MB = 1000 KB.',
    parts: [
      'How long does it take to read the whole file sequentially in one operation?',
      'How long does it take to read every block if the file is read as separate 1 KB blocks in random order, each needing its own set-up?',
      'The HDD is replaced by an SSD with 2 GB/s sequential bandwidth and 5 µs set-up latency. What are the two times now?',
      'What does the comparison show about where the time goes?',
    ],
    weeks: [5],
    answer: [
      'Transfer = 1,000 MB ÷ 250 MB/s = 4 s. Add one set-up of 0.005 s: 4.005 s.',
      'Number of blocks = 1 GB ÷ 1 KB = 1,000,000. One block: 0.001 MB ÷ 250 MB/s = 0.000004 s, plus 0.005 s set-up = 0.005004 s. All blocks: 1,000,000 × 0.005004 = 5,004 s (about 83 minutes).',
      'Sequential: 1,000 MB ÷ 2,000 MB/s = 0.5 s, plus 0.000005 s = 0.500005 s. Random: one block = 0.001 ÷ 2,000 = 0.0000005 s, plus 0.000005 s = 0.0000055 s; × 1,000,000 = 5.5 s.',
      'On the HDD the transfer time is 4 s either way; the extra 5,000 s in the random case is one million set-ups at 5 ms each, so set-up latency dominates small random operations and bandwidth is almost irrelevant. The SSD improves the sequential read by 8 times (the bandwidth ratio) but the random read by about 910 times, because its set-up cost is 1,000 times smaller. The general rule: when per-operation cost dominates, do fewer and bigger operations.',
    ],
  },
];
