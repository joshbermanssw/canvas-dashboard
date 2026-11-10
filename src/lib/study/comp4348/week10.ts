import type { PracticeQuestion, Topic } from '../types';

/** Sources: w10.txt / w10.pdf (Lecture 10 slides; slides 15-17 read as rendered images). */
export const week10: Topic = {
  week: 10,
  title: 'Cloud computing',
  summary:
    'The cloud is renting capacity on someone else\'s computers; each step from VMs to containers to PaaS to serverless raises the abstraction and hands more of the stack to the provider. Choosing where to sit on that ladder, and how tightly to couple to one provider, is an architecture decision.',
  concepts: [
    {
      term: 'Cloud computing',
      definition:
        'Running workloads on a provider\'s shared servers and paying for what you use. The lecture names three advantages: economies of scale in infrastructure and operations, possibly better scalability at reduced cost, and focus on the app rather than infrastructure.',
    },
    {
      term: 'Server sprawl',
      definition:
        'The result of giving every workload its own cheap server: failures and resource hogs stay contained, but you end up with racks of mostly idle machines and high operations and maintenance cost.',
    },
    {
      term: 'Virtualisation and the hypervisor',
      definition:
        'Each workload runs in its own virtual machine with its own guest OS; the hypervisor allocates CPU, memory and I/O to each VM on one large physical server. This consolidates underutilised servers while keeping isolation.',
    },
    {
      term: 'Elastic capacity',
      definition:
        'Capacity that follows demand and is paid for as you go, in contrast to fixed capacity sized for the peak. Achieved by resizing VMs (small off-peak, large at peak) and dynamic scale-out.',
    },
    {
      term: 'Data sovereignty',
      definition:
        'A legal limit on the cloud: it may be illegal to ship data off-shore for processing. Listed with latency and bandwidth ("the speed of light does not change") as remaining cultural, legal and practical issues.',
    },
    {
      term: 'Geography, region and availability zone',
      definition:
        'Azure\'s hierarchy. A geography is a discrete market (e.g. Australia), usually with 2+ regions, and is the data-residency boundary; a region is a set of datacentres in a metropolitan area on a dedicated low-latency network; an availability zone is physically separate datacentre(s) with independent power, cooling and networking.',
    },
    {
      term: 'IaaS (Infrastructure as a Service)',
      definition:
        'Computing infrastructure provisioned and managed over the Internet. The provider manages datacentre, hardware and virtualisation and gives you VMs; you install and manage the OS, middleware, scaling, data and applications. Examples: Amazon EC2, Azure Virtual Machines, Google Compute Engine.',
    },
    {
      term: 'PaaS (Platform as a Service)',
      definition:
        'A complete development, deployment and production environment in the cloud: infrastructure plus middleware, development tools, database management, app management, BI and monitoring. You manage only application code and data. Examples: Heroku, Azure App Service, AWS Elastic Beanstalk, Google App Engine.',
    },
    {
      term: 'SaaS (Software as a Service)',
      definition:
        'Users connect to a finished cloud application over the Internet and pay by use, with nothing to buy, configure or maintain locally. Examples: Microsoft 365, Google Workspace, Salesforce, SAP.',
    },
    {
      term: 'Multi-tenant application',
      definition:
        'One shared application instance (and shared database) serving many customers, with each customer\'s data kept separate. The original SaaS model.',
    },
    {
      term: 'Serverless / FaaS (Functions as a Service)',
      definition:
        'You upload just a function; the platform runs it when an event occurs, scales instances to demand (even to zero) and charges per invocation and execution time. Examples: AWS Lambda, Azure Functions, Google Cloud Run functions.',
    },
    {
      term: 'Container',
      definition:
        'A lightweight virtual environment: app code, software stack and configuration packaged as one deployable unit, running on a single OS instance with a shared kernel. Starts in seconds, packs densely, and is directly addressable on its own IP address and ports.',
    },
    {
      term: 'Container image',
      definition:
        'The packaged form of a container: read-only, layered and versioned. Lower layers (base OS userland, runtime) are shared by all containers; each running container adds its own isolated writable layer.',
    },
    {
      term: 'Docker and the registry',
      definition:
        'Docker is the most popular container system. A Dockerfile (base image plus your app) is built into an image, pushed to a registry (Docker Hub, ECR, ACR, Artifact Registry) and run as containers anywhere with a container runtime.',
    },
    {
      term: 'Kubernetes',
      definition:
        'A container orchestrator that manages pools of containers, grouped in pods, across a cluster of machines. You declare the desired state in YAML and it schedules workloads, scales them and replaces failed instances.',
    },
    {
      term: 'Desired state',
      definition:
        'The declared target for a Kubernetes workload (e.g. replicas: 3), stored in etcd. Scaling is just changing that number, by hand or by an autoscaler.',
    },
    {
      term: 'Cold start',
      definition:
        'The slower first start of a function instance: functions start in milliseconds when warm but can take seconds when cold, which hurts tight latency budgets.',
    },
    {
      term: 'Lock-in',
      definition:
        'Dependence on one provider\'s managed services, triggers and APIs. How tightly you couple to them is a design decision that trades productivity against lock-in.',
    },
  ],
  frameworks: [
    {
      name: 'The evolution from isolation to abstraction',
      source: 'Lecture 10, summary slide',
      points: [
        '1. Isolate apps on their own machines: less interference, better isolation, but server sprawl.',
        '2. Move them to VMs: lower cost through consolidation and still isolated.',
        '3. VMs hosted by the first cloud providers, using assets built for the biggest Internet apps: the start of IaaS.',
        '4. VMs are wasteful, so containers plus container management (orchestration) tools.',
        '5. Abstracted services such as storage and orchestration: PaaS.',
        '6. Serverless discards the last traces of physical machines: event-driven functions and orchestration patterns.',
        'The ideas are old ones at bigger scale: time sharing and OS isolation became VMs and containers; TP monitors with short stateless transactions became serverless functions.',
      ],
    },
    {
      name: 'Who manages what: on-premises vs IaaS vs PaaS vs serverless vs SaaS',
      source: 'Lecture 10, XaaS responsibility matrix',
      points: [
        'Stack layers, top to bottom: application code, data, capacity and scaling, runtime and middleware, operating system, virtualisation, servers/storage/network, datacentre (power, cooling).',
        'On-premises: you manage every layer.',
        'IaaS: provider manages datacentre, hardware and virtualisation; you manage the OS and everything above it, including capacity and scaling.',
        'PaaS: you manage application code and data; capacity and scaling is shared; the provider manages runtime and below.',
        'Serverless: you manage application code and data only; the provider also owns capacity and scaling.',
        'SaaS: you manage only your data; the provider manages the application and everything below.',
      ],
    },
    {
      name: 'One shared server vs one server per workload vs VMs',
      points: [
        'One shared server: works, but workloads interfere (a processor or storage hog hurts the others) and the whole enterprise stops if the server fails.',
        'One server per workload: failures have limited impact and performance is more predictable, but utilisation is mostly idle and operations cost is high (server sprawl).',
        'VMs on a large server: virtual resource allocations solve contention, failures stay inside a VM, and each VM can run a different OS and stack.',
        'Why consolidation pays: workloads peak at different times, so the peak of the sum is far below the sum of the peaks.',
        'Limit: hardware cost falls through better utilisation, but software and admin costs are unchanged.',
      ],
    },
    {
      name: 'VMs vs containers vs functions',
      source: 'Lecture 10, serverless comparison table',
      points: [
        'You deploy: a whole OS image (VM); an app plus its dependencies (container); just your code (function).',
        'Starts in: tens of seconds to minutes (VM); seconds (container); milliseconds warm to seconds cold (function).',
        'Scales by: adding VMs; adding containers; the platform, per request.',
        'You pay for: provisioned VM time; provisioned capacity; invocations plus execution time.',
        'VM drawbacks: every VM boots a full OS from scratch, and memory and storage are duplicated across VM images.',
        'Compute trades control for convenience: VMs give the most control, then containers, then PaaS, then functions, where the provider does the most.',
      ],
    },
    {
      name: 'Kubernetes control loop (declare, observe, compare, act)',
      points: [
        'Declare: write the desired state in a YAML Deployment (e.g. replicas: 3) and submit it with kubectl apply; it is stored in etcd.',
        'Observe: the controller watches how many pods are actually running.',
        'Compare: if observed differs from desired (2 ≠ 3), that is drift.',
        'Act: schedule a new pod on a healthy node; no human is involved.',
        'Control plane parts: API server, etcd (cluster state), scheduler, controller manager; it is managed for you in EKS, AKS and GKE. Each worker node runs kubelet, kube-proxy and a container runtime hosting pods.',
        'Also provides rolling updates and rollbacks for CI/CD, and handles stateless (Deployments) and stateful (StatefulSets) workloads.',
      ],
    },
    {
      name: 'Serverless: fit, limits and orchestration patterns',
      points: [
        'Model: stateless functions triggered by events (HTTP request, database update, file or blob update, queue message, timer); state lives elsewhere in storage, databases and queues.',
        'Good fit: spiky or unpredictable load, event processing and glue code, scheduled jobs, prototypes.',
        'Poor fit: long-running or stateful work, steady high load (often cheaper on VMs or containers), tight latency budgets hit by cold starts.',
        'Still hard: composability, consistency and atomicity; cold starts and per-invocation time limits (15 min on standard AWS Lambda); lock-in to one provider\'s triggers and services.',
        'Orchestration patterns (e.g. Azure Durable Functions): chaining with compensation (undo completed steps on failure); fan-out / fan-in (parallel work, then aggregate); async HTTP API (start long work, client polls a status endpoint); human interaction (wait for an approval event, with a timeout).',
      ],
    },
    {
      name: 'Choosing an Azure messaging service: what you get and what you give up',
      source: 'Lecture 10, adapted from Microsoft\'s messaging overview',
      points: [
        'Storage Queues (simple queuing): communication within an app, individual messages, polling queue semantics, simple, pay as you go. Gives up message ordering and instantaneous consistency.',
        'Event Grid (eventing and pub/sub): communication between apps or organisations, individual events, push semantics, filtering and routing, fan-out. Gives up message ordering and instantaneous consistency.',
        'Event Hubs (big data streaming): many messages in a stream, low cost, fan-in, strict ordering per partition, Kafka-compatible endpoint. Gives up a server-side cursor and only-once delivery.',
        'Service Bus (enterprise messaging): instantaneous consistency, strict ordering (sessions), JMS support, security and non-repudiation, geo-replication, de-duplication, scheduling, transactions. Gives up low cost and simplicity.',
        'General rule: choosing among compute, data and messaging services means weighing quality attributes (performance, availability, consistency) against cost and operational effort.',
      ],
    },
    {
      name: 'Running the cloud platform on-premises (hybrid)',
      points: [
        'Cloud platforms are "just" software stacks, so they can run on your own or provider-supplied hardware: Azure Local, AWS Outposts, Google Distributed Cloud.',
        'Same APIs, tools and management on both sides, so you can burst to a public region for peaks.',
        'Reasons: legal, cultural, contractual or security constraints.',
        'Reasons: poor or no network connectivity at isolated sites.',
        'Reasons: use cloud resources only for scaling and peaks, or leverage investment in a cloud platform without moving to the cloud.',
      ],
    },
  ],
  examples: [
    'Accounts, Sales and Warehouse workloads: on one shared server the Warehouse "hog" slows the others; on separate servers each sits mostly idle; as three VMs on one large server they are consolidated yet isolated.',
    'Demand-versus-capacity chart over one day: fixed capacity is sized for the peak and idle the rest of the day, while elastic capacity tracks demand.',
    'Azure layout: zones in a region are linked by a fast network with a round trip under about 2 ms; zones tolerate a datacentre failure and paired regions replicate to tolerate a whole-region failure. AWS (Regions → Availability Zones) and Google Cloud (regions → zones) use the same pattern.',
    'Market share of cloud infrastructure services, Q2 2026: Amazon 28%, Microsoft 20%, Google 15%, all others 37%.',
    'Same building block, different names: functions are AWS Lambda / Azure Functions / Cloud Run functions; message queues are Amazon SQS / Service Bus or Queue Storage / Pub/Sub; workflow orchestration is Step Functions / Logic Apps or Durable Functions / Workflows.',
    'Inside Azure: Portal, CLI and SDKs all call Resource Manager, which authenticates and authorises each request (RBAC) and passes it to the resource provider for that service; the Fabric Controller places VMs on servers, monitors their health and recovers failures.',
    'Dockerfile for a Java orders service: start FROM a JRE base image, copy in the jar, expose port 8080, set the entry point; then docker build, docker push to a registry, docker run.',
    'Containers as bricks: web on :443, api on :8080, queue on :5672 and cache on :6379, each directly addressable on its own ports.',
  ],
};

export const week10Practice: PracticeQuestion[] = [
  {
    title: 'Week 10: Kubernetes recovers from a node failure',
    scenario:
      'An orders-service Deployment declares replicas: 3 and is applied with kubectl apply. One of the worker nodes then fails, taking one replica with it.',
    parts: [
      'Where is the desired state held, and what does the control loop observe after the failure?',
      'What does the controller do, and who has to intervene?',
      'How would you scale the service to handle more load?',
    ],
    weeks: [10],
    answer: [
      'The desired state (replicas: 3) is stored in etcd in the control plane. After the node fails the loop observes only 2 pods running.',
      'It compares observed with desired, finds 2 ≠ 3 (drift), and acts by scheduling a replacement pod on a healthy node. No human is involved.',
      'Change the desired number of replicas (or let an autoscaler change it); the same loop then starts pods until observed matches desired.',
    ],
  },
];
