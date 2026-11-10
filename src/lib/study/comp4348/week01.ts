import type { PracticeQuestion, Topic } from '../types';

/** Sources: w01.txt / w01.pdf (lecture 1 slides), extra/w01-tut.txt, extra/w01-tut-ans.txt. */
export const week01: Topic = {
  week: 1,
  title: 'Introduction: software architecture and quality attributes',
  summary:
    'What software architecture is (structure, component communication, non-functional requirements, views) and the quality attributes an architect must make measurable and trade off against each other.',
  concepts: [
    {
      term: 'Enterprise system',
      definition:
        'The IT of an organisation: thousands of integrated applications, terabytes of data and millions of lines of code, some old and some new. It is not built from scratch as a whole; it evolves constantly and glues many existing systems together with off-the-shelf middleware, databases and frameworks.',
    },
    {
      term: 'Software architecture',
      definition:
        'The fundamental organisation of a system: its components (software elements), their externally visible properties, their relationships to each other and to the environment, and the principles that guide its design and evolution (IEEE 1471 and SEI definitions).',
    },
    {
      term: 'Application architecture (structure, behaviour, allocation)',
      definition:
        'Each application should have an architecture you can understand: what components exist (structure), when and how they call each other (behaviour), and where they are deployed (allocation).',
    },
    {
      term: 'Architecture pattern (style)',
      definition:
        'A proven, reusable structure that supports a certain kind of component communication, such as client-server, message bus or message broker. Each pattern has known characteristics that suit particular requirements, and large systems combine several.',
    },
    {
      term: 'Layering',
      definition:
        'Splitting a system into stacked parts with separate responsibilities. The lecture example has a client tier (browser + React), an application tier (Spring Boot: controller, service/business and repository/data-access layers) and a data tier (PostgreSQL).',
    },
    {
      term: 'Non-functional requirement (NFR)',
      definition:
        'A requirement about how well the system works rather than what it does. NFRs are also called architecture requirements, are rarely written in the functional requirements, and must be elicited by the architect. They cover technical constraints, business constraints and quality attributes.',
    },
    {
      term: 'Quality attribute',
      definition:
        'An "-ility" such as availability, portability, scalability or performance: the part of the NFRs that says how well the system achieves its functions. A system can meet every functional requirement and still be useless.',
    },
    {
      term: 'Response time',
      definition:
        'The latency of processing one request, usually in seconds or milliseconds. You must say whether the target is guaranteed or an average, for example 95% of responses under 4 seconds and 99.9% within 10 seconds.',
    },
    {
      term: 'Throughput',
      definition:
        'The amount of work done per unit of time, for example transactions per second or messages per minute. You must say whether the required figure is the average or the peak; many systems have a low average but a high peak.',
    },
    {
      term: 'Maximum sustainable throughput (MST)',
      definition:
        'The highest throughput a system can keep up, measured in the lecture example as messages per second for a message queuing system.',
    },
    {
      term: 'Scalability',
      definition:
        'How well a system keeps working when the workload or size increases. The four common dimensions are request load, connections, data size and deployments.',
    },
    {
      term: 'Scale-up',
      definition: 'Running a single application instance on a bigger, multiprocessor machine.',
    },
    {
      term: 'Scale-out',
      definition: 'Replicating the application on several different machines.',
    },
    {
      term: 'Modifiability',
      definition:
        'How easy the system is to change or evolve during its lifetime, since changes are a fact of life (new features, replacing a vendor component, porting to another platform, moving to the cloud).',
    },
    {
      term: 'Availability',
      definition:
        'The proportion of the required time that the system is usable, for example 99.99% of the time with no more than 1 hour a month of scheduled maintenance.',
    },
    {
      term: 'Non-repudiation',
      definition:
        'A security property: the sender has proof of delivery and the receiver is sure of the sender identity, so neither side can later deny taking part in the message exchange.',
    },
    {
      term: 'Design trade-off',
      definition:
        'Quality attributes are rarely independent; improving one often hurts another, so the architect must make sensible compromises because not every competing requirement can be fully satisfied.',
    },
  ],
  frameworks: [
    {
      name: 'What an architecture defines',
      points: [
        'Component parts: how the overall function is split across components (decomposition into modules).',
        'Component interfaces: what a component can do and how to ask it.',
        'Component communication and dependencies: how components ask or tell each other things.',
        'Component responsibilities: exactly what a component does when asked.',
        'Communication has two sides. Data passing mechanism: function call, remote method invocation or asynchronous message. Control flow: sequential, concurrent/parallel, and synchronisation.',
      ],
    },
    {
      name: '4+1 view model',
      source: 'Philippe Kruchten',
      points: [
        'An architecture is a complex design, so it is shown through several views, like the floor plan, electrical and plumbing drawings of a building.',
        'Logical view: the architecturally significant elements and the relationships between them.',
        'Process view: the concurrency and communication elements.',
        'Physical view: how the main processes and components map onto the hardware.',
        'Development view: the internal organisation of the software components, for example as held in a configuration management tool.',
        'Architecture use cases (the +1): capture the requirements for the architecture and relate to more than one view.',
      ],
    },
    {
      name: 'Making a quality attribute precise',
      points: [
        '"The application must be scalable" is too imprecise to be of any use.',
        'Restate each quality attribute as something measurable for the specific system design.',
        'Scalability example: scale the deployment from 100 geographically dispersed desktops to 10,000 with no increase in installation and configuration effort or cost.',
        'Availability example: available to end users 99.99% of the time, with at most 1 hour a month of scheduled maintenance.',
        'Performance example: prefer a percentile target (99th percentile latency) over an average such as "3 seconds average latency", which is not precise; "averages are evil".',
      ],
    },
    {
      name: 'Scalability: four dimensions and scale-up versus scale-out',
      points: [
        'Request load: handle more requests by adding hardware, either scale-up (one instance on a multiprocessor machine) or scale-out (replicas on different machines).',
        'Connections: ask whether each simultaneous connection consumes resources and whether a maximum can be exceeded (fixed table sizes, search algorithms).',
        'Data size: ask how the application behaves as data grows (message size doubles, table grows from 1 million to 20 million rows, images grow from 1 MB to 100 MB). The complexity of your code and of the code you use, O(1), O(N) or O(N²), has real impact.',
        'Deployment: ask how installation effort grows with more users and servers. Client side is solved with automatic download and installation; server side with redundancy and workload partitioning.',
      ],
    },
    {
      name: 'Security: five facets',
      points: [
        'Authentication: verify the identity of users and of other applications.',
        'Authorisation: authenticated users and applications have defined access rights to resources.',
        'Encryption: messages to and from the application are encrypted.',
        'Integrity: message contents are not altered in transit.',
        'Non-repudiation: proof of delivery for the sender and assured sender identity for the receiver, so neither can deny the exchange.',
      ],
    },
    {
      name: 'Availability: what causes downtime and how to reduce it',
      points: [
        'Length of an outage = time to detect the failure + time to correct it + time to restart the application.',
        'Strategy 1: eliminate single points of failure.',
        'Strategy 2: replication and failover.',
        'Strategy 3: automatic failure detection and restart.',
        'Typical targets: 100% during business hours, no more than 2 hours of scheduled downtime per week, or 24x7x52. Full 100% availability is difficult to achieve.',
      ],
    },
    {
      name: 'Quality attribute trade-offs',
      points: [
        'Quality attributes interact, so they are rarely orthogonal.',
        'A highly secure system may be difficult to integrate with others.',
        'A high-performance application may be tied to one platform and so not be easily portable.',
        'The architect must satisfy all stakeholder needs with sensible compromises and prepare for an unknown future.',
        'Other attributes to weigh: portability (runs on a different platform), testability (ease of testing), supportability (ease of support after deployment) and integration (ease of fitting into a broader application context).',
      ],
    },
  ],
  formulas: [
    {
      name: 'Availability',
      formula: 'Availability = time the system is usable ÷ time it is required to be usable',
      note: 'Expressed as a percentage, for example 99.99%. The slides state it in words only ("the proportion of the required time it is usable").',
    },
    {
      name: 'Period of lost availability',
      formula: 'Downtime per failure = time to detect + time to correct + time to restart',
      note: 'The three times are for one failure: detecting it, fixing it, and restarting the application.',
    },
  ],
  examples: [
    'Throughput graph for a message queuing system: MST rises from about 80 messages per second at 1 receiving thread to a peak of about 260 at 10 threads, then falls slightly at 15 threads while CPU use keeps climbing. The flattening curve shows resource contention.',
    'ISP connection scalability failure: every user connection spawned a new process, virtual memory on each server ran out at 2000 users, but hundreds of thousands of users had to be supported.',
    'Modifiability scenarios: add features for self-service checkout kiosks; replace a COTS speech recognition component after the vendor goes out of business; port from Linux to Windows; adopt a new web framework by corporate edict; move the application to the cloud.',
    'Performance requirements: 3 second average latency (imprecise), 99th percentile latency, 1000 transactions per second.',
    'Layering example: browser + React (client tier), Spring Boot with controller, service and repository layers (application tier), PostgreSQL (data tier).',
    'Tutorial Book Store: a React front end calling a Spring Boot back end that stores books in PostgreSQL, described in the tutorial as a Model-View-Controller architecture.',
  ],
};

export const week01Practice: PracticeQuestion[] = [
  {
    title: 'Week 1: Spring Boot annotations',
    scenario: 'The tutorial Book Store back end is a Spring Boot application with a BookController class.',
    parts: [
      'What is the purpose of the @RestController annotation?',
      'What is the purpose of the @Autowired annotation?',
    ],
    weeks: [1],
    answer: [
      '@RestController is a specialised version of @Controller. It marks a class as one that provides RESTful web services in a Spring application.',
      '@Autowired is used for dependency injection. Spring resolves the collaborating beans a class needs and injects them into it.',
    ],
  },
  {
    title: 'Week 1: repository method with no implementation',
    scenario:
      'The Book Store repository interface declares a method findByTitleContaining but nobody wrote any code for it, and it still works.',
    parts: ['Explain why the method can be used without an implementation.'],
    weeks: [1],
    answer: [
      'It is a Spring Data JPA query method. You only declare the method signature in the repository interface; Spring Data JPA parses the method name, builds the matching query and generates the implementation automatically.',
    ],
  },
  {
    title: 'Week 1: adding a price to the Book Store',
    scenario: 'The Book Store cannot store a price for each book. The project sets spring.jpa.hibernate.ddl-auto=update.',
    parts: [
      'What must change in the back end, and why is no SQL needed?',
      'What must change in the front end?',
    ],
    weeks: [1],
    answer: [
      'Add a price field to the Book entity class (and to its constructor if wanted). Because ddl-auto is set to update, Hibernate adds the new price column to the books table automatically when the application restarts.',
      'Add a price input to the add-book component (a new state field, a change handler, and price included in the object that is saved) and the same in the book component used for editing; optionally show the price in the book list. The book service needs no change because it only passes JSON through.',
    ],
  },
];
