import type { PracticeQuestion, Topic } from '../types';

/** Sources: w06.txt / w06.pdf (slides 41, 61 rendered), extra/w06-lec-notes.txt, extra/w06-tut.txt, extra/w06-tut-notes.txt. */
export const week06: Topic = {
  week: 6,
  title: 'Message-oriented middleware and asynchronous technologies',
  summary:
    'Why synchronous calls hurt availability and how asynchronous messaging avoids that: message queues and their transactions, publish/subscribe, and message brokers for integrating enterprise systems. The week ends by comparing the messaging, publish-subscribe and broker patterns on availability, failure handling, modifiability, performance and scalability.',
  concepts: [
    {
      term: 'Synchronous communication',
      definition:
        'The caller sends a request and waits until the reply is received, as with a remote procedure call. Both parties must be online at the same time; if the destination is unavailable the caller blocks and the whole application is unavailable.',
    },
    {
      term: 'Asynchronous interaction',
      definition:
        'The caller sends a message that is stored somewhere until the receiver reads it, and the response comes back the same way. Its two attributes are non-blocking calls (the call returns immediately without waiting for a response) and persistent queues (request and response are stored until they are accessed).',
    },
    {
      term: 'Message-oriented middleware (MOM)',
      definition:
        'Middleware that provides asynchronous communication between processes, applications and systems (sender and receiver are decoupled in time), send-and-forget delivery despite failures, transactional messaging (deliver all messages in a transaction or none), and persistence (messages are logged at the server and survive server failure).',
    },
    {
      term: 'Message queue',
      definition:
        'Each destination has a queue for arriving messages. Send puts a message onto the queue and receive gets a message from it. Sending does not depend on the state of the receiving application at that time.',
    },
    {
      term: 'Persistent queue',
      definition:
        'A queue where receipt of a message means it is written to a disk log, and removal deletes it from the log. Messages survive node failure but the queue is possibly slower. A non-persistent queue is faster (no disk I/O) but loses messages if the node fails before the recipient reads them.',
    },
    {
      term: 'Deferred exception',
      definition:
        'A failed asynchronous request that is only discovered hours or days later, instead of at the time of the call. The sender must be able to recover the state from the time of the request to handle the error. This is why queuing is not guaranteed delivery.',
    },
    {
      term: 'Point-to-point (peer-to-peer) messaging',
      definition:
        'The fundamental messaging model: messages pass directly from a sending queue on the sending system to a receiving queue on the receiving system and then to the application. No intermediaries or message server; every participant runs embedded queue server code.',
    },
    {
      term: 'Centralised messaging',
      definition:
        'A central message server holds the queues for many destinations and clients reach it using remote procedure calls. It introduces a single point of failure and couples every client tightly to the server, so participants are no longer autonomous.',
    },
    {
      term: 'Dead-letter queue',
      definition:
        'A queue on the sender where messages that cannot be delivered (for example their time-to-live expired) are moved, so they can be retrieved later for a post-mortem.',
    },
    {
      term: 'Poison message',
      definition:
        'A message that makes the receiving code abort its transaction every time it is read, so it keeps being put back on the queue. Once a retry limit is exceeded it is moved to a poison queue, where it can be viewed for diagnosis.',
    },
    {
      term: 'JMS (Java Message Service)',
      definition:
        'An API to messaging infrastructure, available for most messaging products. It is only an API, not a protocol: it says how sender and receiver are coded but not what messages look like on the wire, so applications are not guaranteed to interoperate unless they use the same MOM product.',
    },
    {
      term: 'Publish/subscribe',
      definition:
        'A service publishes messages to logical subjects (topics) and clients subscribe to the topics they care about; the system forwards each published message to every subscriber of its topic. It supports 1-to-N, N-to-1 and N-to-N communication and decouples sender and receiver in design: they do not need to know each other.',
    },
    {
      term: 'Topic (subject)',
      definition:
        'The logical name that messages are published to. Names are usually hierarchical (Sydney/DevGroup/Information/work) and subscriptions can use wildcards; the system filters to decide whether to forward each new publication.',
    },
    {
      term: 'Message broker',
      definition:
        'Middleware that adds logic to the queues at the level of the messaging infrastructure: message transformation, intelligent routing based on content, a rules engine, and adapters. Developed for enterprise application integration (EAI) and usually built on top of a MOM layer.',
    },
    {
      term: 'Adapter',
      definition:
        'A component between the message broker and a source or target system that hides the complexity of that system behind an abstraction layer. Thin adapters are simple wrappers; thick adapters are programmable. Centralised adapters sit with the broker; distributed adapters run in their own process, possibly with the end system.',
    },
    {
      term: 'Enterprise data model (EDM)',
      definition:
        'One common message format agreed for the whole enterprise. The source sends the common format as the payload and the target transforms it into its own local representation, giving 2 × N transformations with no broker. Getting agreement on the model is the hard part.',
    },
    {
      term: 'Hub-and-spoke architecture',
      definition:
        'The broker pattern layout: the broker is the messaging hub that does transformation, routing and rules processing, and senders and receivers connect to it as spokes through input and output ports.',
    },
  ],
  frameworks: [
    {
      name: 'Synchronous versus asynchronous interaction',
      source: 'Slides 7 to 11',
      points: [
        'Synchronous request/response is simple and intuitive and resembles normal programming, but it tightly couples caller and called and requires both to be alive at the same time.',
        'Its disadvantages: the caller waits idle, connection overhead, a higher probability of failures, failures that are hard to identify and react to, and a one-to-one shape that is not practical for nested calls and complex interactions.',
        'Fix 1, enhance the synchronous model: transactional interaction (exactly-once execution) plus service replication and load balancing. Recovery at the client side is still the client\'s problem.',
        'Fix 2, asynchronous interaction: non-blocking calls and persistent queues, which can improve availability and performance.',
        'Reliable queuing also suits modular design (request and response code can live in different modules or machines), makes distribution modes such as multicast and replication easier, and is a natural way to connect heterogeneous systems.',
        'Asynchronous mechanisms are still built from remote procedure calls: put and get are calls to a queue, queues transfer to each other by calls, and publish and deliver are calls to the publish/subscribe system.',
      ],
    },
    {
      name: 'Request and reply over MOM is three transactions',
      source: 'Slides 21 to 24',
      points: [
        'Queue operations can be inside a transaction with database work: the sender updates a database record and puts a message on a queue; the receiver gets a message and updates a database record.',
        'Sender and receiver do not share a transaction. A rollback on the receiver does not affect the sender, which has already committed, so a "synchronous" operation built this way is not atomic.',
        'T1: the sender updates its database and puts the request on the request queue.',
        'T2: the receiver gets the request, updates its database and puts the response on the response queue.',
        'T3: the sender gets the response and updates its database.',
        'Each send and receive that combines a database and a queue is coordinated by 2PC. The lecture notes point out the overall shape is a saga: no end-to-end atomicity or isolation, so later failures need compensation and handlers should be idempotent.',
      ],
    },
    {
      name: 'Where the queues live: peer-to-peer, centralised, clustered',
      source: 'Slides 18 to 20',
      points: [
        'Peer-to-peer: queues on every participating system talking by a queue protocol. Participants stay autonomous; no message server is needed.',
        'Centralised: one message server holds all queues and clients call it remotely. More common recently, but a single point of failure with all clients tightly coupled to it.',
        'Clustered: because a central server hurts availability, one logical MOM server is distributed among the nodes of a cluster, and each message is allocated to one instance.',
        'Danger of clustering: messages can get out of order by sitting in different instances.',
      ],
    },
    {
      name: 'Publish/subscribe: how it works and what it costs',
      source: 'Slides 32 to 39',
      points: [
        'Publishers create and publish to a subject; subscribers register with it; the system looks up a table of subscriptions and forwards each event to interested clients, usually by putting the message into a queue for that client.',
        'The system builds a tree recording, for each topic, on which nodes and via which paths subscribers are found, and forwards each publication on every path that leads to a possible subscriber, using network multicast where possible.',
        'Wildcards: Sydney/*/Information matches both Sydney/DevGroup/Information and Sydney/SupportGroup/Information; Sydney/DevGroup/*/* matches Sydney/DevGroup/Information/work and Sydney/DevGroup/Information/gossip.',
        'TIBCO example: a message is written to the network once using multicast or broadcast, all participating systems receive it at about the same time, and filtering is done on the receiving system. A daemon on each node handles this on a local network; a routing daemon forwards between local networks because wide-area multicast is not assumed.',
        'Strength: highly decoupled. Publishers do not know subscribers, subscribers do not know publishers, and both can appear and disappear dynamically.',
        'Issues: reliability, transactions, security and performance are all harder.',
      ],
    },
    {
      name: 'Integration options: point-to-point, broker, enterprise data model',
      source: 'Slides 41 to 53',
      points: [
        'Point-to-point: each system holds its own transformation code for every other system. This grows into a spaghetti architecture with potentially N² − N interfaces that is hard to modify (what if the common format, a legacy API or a transformation changes?).',
        'Broker: transformations move into the broker, endpoints are simplified, and the web component is decoupled from the legacy components.',
        'No free lunch: a broker "just relocates the spaghetti" into the broker.',
        'Enterprise data model: every source sends one common format and every target transforms it locally, giving 2 × N transformations and no broker, but agreement on the model is the tough bit.',
        'Brokers work well when messages are not too big and the mapping from business process to queues is well understood and documented.',
        'Broker weaknesses: enqueue and dequeue are still remote calls not made for large objects, embedded transformation and routing can get complex, brokers must be replicated to scale, they are lightweight and rarely designed to recover from failure, and the technology is often proprietary (open source such as Mule now exists).',
      ],
    },
    {
      name: 'Messaging, publish-subscribe and broker patterns compared',
      source: 'Slides 55 to 60',
      points: [
        'Availability: messaging replicates physical queues with the same logical name across server instances; publish-subscribe replicates topics across a server cluster; brokers must be replicated using similar clustering.',
        'Failure handling: a client whose queue fails finds a replica queue and posts there; a publisher whose server fails sends to a live replica; brokers have typed input ports so they validate and discard wrongly formatted messages, and senders fail over to a live broker.',
        'Modifiability: messaging and publish-subscribe are loosely coupled (no direct binding), and new publishers and subscribers can be added without changing the architecture, but a change of message format can force receiver changes (self-describing formats reduce this). Brokers separate transformation and routing logic from senders and receivers, so that logic changes without touching them.',
        'Performance: queues and publish-subscribe can deliver thousands of messages per second, and non-reliable messaging is faster than reliable. With multicast or broadcast, publish-subscribe delivery time is more uniform across subscribers. A broker can become a bottleneck under high volume and complex transformation; its throughput is typically lower than simple reliable messaging.',
        'Scalability: queues can be hosted on the endpoints or replicated across clusters (highly scalable); topic clusters scale to very high volumes and multicast scales better than point-to-point; broker instances can be clustered to handle high request loads.',
        'Choosing (lecture notes): use messaging to decouple in time and share work, where each message goes to one server; use publish-subscribe to tell a changing set of parties about an event, where every subscriber gets a copy; use a broker to connect systems with different formats, trading throughput for modifiability.',
      ],
    },
    {
      name: 'Handling messages that fail',
      source: 'Slides 17 and 25',
      points: [
        'Queuing does not guarantee delivery: the receiving system may never accept the message or may reject it.',
        'The failure of the call still has to be handled, but hours or days later, when it is harder than at the time of the call.',
        'Undeliverable messages (time-to-live expired or other delivery failures) are moved to a dead-letter queue on the sender for post-mortems.',
        'If the receiver aborts its transaction, the message is put back on the queue to be read again. This is reasonable because the failure may be transient, such as a deadlock exception.',
        'If the same message keeps crashing the receiver, the retry limit is exceeded and the message is moved to a poison queue for diagnosis and administration.',
      ],
    },
  ],
  formulas: [
    {
      name: 'Point-to-point integration interfaces',
      formula: 'interfaces = N² − N',
      note: 'N = number of systems integrated directly with each other. This is the potential maximum. Example: 5 systems give 25 − 5 = 20 interfaces (the slide shows 1 business process = 4 interfaces and 5 business processes = 20).',
    },
    {
      name: 'Enterprise data model transformations',
      formula: 'transformations = 2 × N',
      note: 'N = number of systems. Each system converts to and from the one common format. Example: 5 systems need 10; 10 systems need 20, against 90 point-to-point interfaces.',
    },
    {
      name: 'Availability of a synchronous chain',
      formula: 'chain availability = a₁ × a₂ × … × aₙ; for equal services = aⁿ',
      note: 'aᵢ = availability of service i (0 to 1), assuming independent failures; n = number of services called synchronously. From the lecture notes, not the slides. Example: 0.99³ = 0.9703 (97.03%); 0.99⁵ = 0.9510.',
    },
    {
      name: 'Downtime from availability',
      formula: 'downtime in a period = (1 − availability) × length of the period',
      note: 'Example from the lecture notes with a 30-day month (720 hours): 99% gives 7.2 hours; 97.03% gives 21.4 hours; 95.10% gives 35.3 hours.',
    },
    {
      name: 'Throughput limit of persistent messaging',
      formula: 'maximum messages per second = messages per forced write ÷ forced-write latency',
      note: 'Latency in seconds. Illustration from the lecture notes: 1 message per 5 ms write = 200 per second; 1 per 0.1 ms write = 10,000 per second; 50 messages batched per 5 ms write = 10,000 per second.',
    },
  ],
  examples: [
    'Broker motivation: a web component sends one In-format message that four legacy systems must each read from a queue, transform to their own format (L1 to L4) and pass to their API. Moving the four transformations into a broker simplifies the endpoints.',
    'Topic hierarchy: Sydney has DevGroup and SupportGroup, each with Information, each with work and gossip, giving names such as Sydney/SupportGroup/Information/gossip.',
    'IBM MQ Series: point-to-point queues managed by queue managers, persistent or non-persistent messages, message priority, and transactional queue access through the XA standard so queues are transactional resources.',
    'Microsoft MSMQ: point-to-point, persistent, transactional queuing included in Windows, very similar to MQ Series, plus IP multicast (one put into many queues).',
    'TIBCO publish/subscribe: each node runs a daemon ("rvd") that sends and receives messages using multicast on the local network; a routing daemon ("rvrd") forwards between local networks.',
    'Broker products: IBM WebSphere MQ Integrator and the Microsoft BizTalk mapping tool; Mule as an open-source, standards-based option.',
    'Tutorial: a producer publishes Gold, Silver and Platinum unit prices as JSON every 10 seconds to a queue stored in a PostgreSQL table; a consumer polls the table once per second and saves the prices to the database.',
    'Tutorial demonstration: stop the consumer and the producer keeps running while rows pile up in the queue table (about 6 after a minute); restart the consumer and it clears the backlog with nothing lost. A failure became a delay.',
  ],
};

export const week06Practice: PracticeQuestion[] = [
  {
    title: 'Week 6: request and reply over a message queue',
    scenario:
      'A sender application updates its own database and sends a request through MOM. A receiver application processes the request, updates its own database, and replies. The sender then records the reply in its database. All queue operations are transactional.',
    parts: [
      'How many transactions is this, and what does each one contain?',
      'The receiver rolls back while processing the request. What happens to the sender\'s database change?',
      'Is the whole request and reply atomic? Why or why not?',
      'Why does the lecture diagram label each send and receive with "2PC"?',
    ],
    weeks: [6, 4],
    answer: [
      'Three. T1: the sender updates its database and puts the request on the request queue. T2: the receiver gets the request from the request queue, updates its database and puts the response on the response queue. T3: the sender gets the response from the response queue and updates its database.',
      'Nothing. The sender has already committed T1, and sender and receiver do not share a transaction, so a rollback on the receiver does not affect the sender. The request message goes back on the queue to be read again.',
      'No. Each of the three transactions commits on its own, so there is no single all-or-nothing outcome across sender and receiver even though the code looks like a synchronous request and response.',
      'Because each step combines a database update and a queue operation, and the queue is a transactional resource. Making the database and the queue commit or roll back together inside one step is coordinated with two-phase commit.',
    ],
  },
  {
    title: 'Week 6: counting integration interfaces',
    scenario:
      'An enterprise has 5 systems that all need to exchange data. The architects are comparing direct point-to-point integration, a message broker, and an enterprise data model. The same question is then asked for 10 systems.',
    parts: [
      'How many interfaces could point-to-point integration need for 5 systems, and for 10?',
      'How many transformations does an enterprise data model need for 5 systems, and for 10?',
      'Does a message broker remove the complexity of the point-to-point option?',
      'What is the catch with the enterprise data model?',
    ],
    weeks: [6],
    answer: [
      'Potentially N² − N. For 5 systems: 25 − 5 = 20 (the slide shows one business process needing 4 interfaces and five needing 20). For 10 systems: 100 − 10 = 90.',
      '2 × N, because each system only converts between its own format and the common format. For 5 systems: 10. For 10 systems: 20.',
      'No. Each system now connects only to the broker and the endpoints become simpler, but the lecture says there is no free lunch: the broker just relocates the spaghetti, because the transformations and routing rules now live inside the broker. The broker can also become a performance bottleneck.',
      'Getting everyone to agree on the common model is the tough bit.',
    ],
  },
  {
    title: 'Week 6: availability of a synchronous call chain',
    scenario:
      'Each service is available 99% of the time and failures are independent. A request must pass synchronously through a chain of services, so it only succeeds if every service in the chain is up. Use a 30-day month.',
    parts: [
      'What is the availability of a chain of 3 services, and how many hours per month is it unavailable?',
      'What is the availability of a chain of 5 services, and how many hours per month is it unavailable?',
      'How does messaging change this for the sender?',
    ],
    weeks: [6],
    answer: [
      'Availability = 0.99³ = 0.970299, about 97.03%. A 30-day month has 720 hours, so downtime = (1 − 0.970299) × 720 ≈ 21.4 hours (a single service would be down 0.01 × 720 = 7.2 hours).',
      'Availability = 0.99⁵ ≈ 0.95099, about 95.10%. Downtime = (1 − 0.95099) × 720 ≈ 35.3 hours.',
      'Every extra synchronous dependency makes the whole path less available than any single member. With asynchronous messaging the sender only needs its message to be stored safely in a queue, so the receiver being down no longer counts against the sender: the message waits and is processed when the receiver returns.',
    ],
  },
  {
    title: 'Week 6: how the tutorial PostgreSQL message queue works',
    scenario:
      'In the tutorial a producer application sends trade prices to a consumer application through a message queue that is implemented on PostgreSQL. Neither application contains any SQL: a messaging library (a JDBC channel message store with a PostgreSQL query provider) generates it. The queue is the table TRADEDATA_CHANNEL_MESSAGE.',
    parts: [
      'What is the architecture: how do messages get from producer to consumer?',
      'What do the columns GROUP_KEY, CREATED_DATE and MESSAGE_BYTES do?',
      'What SQL runs when the producer sends a message, and when the consumer receives one?',
      'What happens if the consumer is stopped for a minute while the producer keeps running, and what does that show?',
    ],
    weeks: [6],
    answer: [
      'The producer sends to a queue channel that is backed by the message store, which stores each message as one row in the queue table. The consumer polls that same table once per second. The two applications never call each other; the database table is the channel between them.',
      'GROUP_KEY identifies which queue a message belongs to (here "trade-queue"), so one table can hold several queues. CREATED_DATE gives the ordering, oldest first, so the queue is first-in-first-out. MESSAGE_BYTES holds the message content.',
      'Sending is an INSERT of one row into the queue table. Receiving is a single DELETE ... RETURNING statement that selects the oldest row for that GROUP_KEY (ORDER BY CREATED_DATE, LIMIT 1), removes it and returns its content, so reading and removing happen together and each message goes to only one consumer. The FOR UPDATE SKIP LOCKED clause lets several consumers share the queue without waiting on each other.',
      'The producer never fails and never notices: rows accumulate in the table (one every 10 seconds, about 6 after a minute). When the consumer restarts it processes the whole backlog and nothing is lost. With direct communication the producer would have failed immediately; with a queue the same event is only a delay. This is decoupling in time.',
    ],
  },
];
