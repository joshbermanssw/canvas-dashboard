import type { PracticeQuestion, Topic } from '../types';

/** Sources: w02.txt / w02.pdf (lecture 2 slides), extra/w02-tut.txt, extra/w02-tut-ans.txt and the images in extra/w02-tut-ans.docx. */
export const week02: Topic = {
  week: 2,
  title: 'State and concurrency',
  summary:
    'The kinds of state a system holds (resource, session, local computation), where state is kept, and how concurrent access to shared state is made safe with optimistic or pessimistic concurrency control and ACID transactions.',
  concepts: [
    {
      term: 'State',
      definition:
        'The data that programs access and alter. Different pieces of state differ in lifetime, visibility, how shared they are and how critical they are, and state may be centralised, distributed or replicated.',
    },
    {
      term: 'Resource state',
      definition:
        'Data that models the real world, such as bank accounts, stock holdings and customers. It is held in a database or similar store, is independent of any one application, lasts from creation until explicit deletion, and is usually shared by many sessions and applications.',
    },
    {
      term: 'Session',
      definition:
        'A series of related operations over time: the back-and-forth between a user and the application, such as log in, browse, order, pay, log out.',
    },
    {
      term: 'Session state',
      definition:
        'The state of one overall session, such as user identity and books ordered. It lasts from the start of the session to its completion, is used only within that session, could be lost on system failure, and can be kept on the client, the server or both.',
    },
    {
      term: 'Local computation state',
      definition:
        'Temporary data used while performing one operation, such as local variables and parameters. It is private, not shared between operations, and transient: it lasts only for that operation.',
    },
    {
      term: 'Derived state',
      definition:
        'State that can be computed from other state, such as an account balance that is the sum of all transactions. It is often stored or cached anyway because keeping a running total is cheaper than recomputing it.',
    },
    {
      term: 'Integrity constraint (invariant)',
      definition:
        'A rule about resource state that must always hold, for example money taken from one account must go somewhere else, or an employee cannot be assigned to a department that does not exist (referential integrity). Some are enforced by the state store; the rest are left to application programmers.',
    },
    {
      term: 'Stateful',
      definition:
        'Code that holds state between operations while waiting for the next request from the client, so the program instance is tied to one client session.',
    },
    {
      term: 'Stateless',
      definition:
        'Code that discards state when an operation completes and reloads what it needs for the next one, so program instances can be shared across clients.',
    },
    {
      term: 'Interleaving',
      definition:
        'Each program runs its own steps in sequence and is unaware of the others, but seen from outside the steps of concurrent programs are mixed together in time.',
    },
    {
      term: 'Lost update',
      definition:
        'A concurrency problem where two transactions read the same value and both write back, so the later write overwrites the earlier one and one change disappears.',
    },
    {
      term: 'Optimistic concurrency control',
      definition:
        'Always allow access, then detect whether something went wrong and repair or undo it. It can waste work on retries but often performs well when contention is low.',
    },
    {
      term: 'Pessimistic concurrency control',
      definition:
        'Detect and prevent potentially harmful concurrent access by making tasks obtain an exclusive lock on shared data before using it. Other tasks wait for the lock, which limits concurrency and performance.',
    },
    {
      term: 'Deadlock',
      definition:
        'Tasks that each hold a lock and wait for a lock held by the other, so they could wait forever. Example: T1 locks A then wants B, while T2 locks B then wants A.',
    },
    {
      term: 'Lock granularity',
      definition:
        'The size of the thing a lock covers: the whole database, a whole table or class, or an individual row or object. Databases typically have a built-in lock for each record in a table.',
    },
    {
      term: 'Transaction',
      definition:
        'A complete, indivisible business operation: a segment of code that is executed as a whole or not at all, such as booking a seat or transferring money. The infrastructure then protects it from failures and concurrency problems.',
    },
    {
      term: 'Isolation level',
      definition:
        'A choice offered by databases for how strongly transactions are isolated. Good performance under load usually needs a lower level, but a lower level does not prevent all interleaving problems.',
    },
  ],
  frameworks: [
    {
      name: 'Three types of state compared',
      points: [
        'Resource state: lifetime from creation to explicit deletion, across many sessions and applications; usually shared, possibly concurrently; the state store cares about durability and integrity.',
        'Session state: lifetime from session start to completion, across many operations; each instance is used by one session only and is not shared across sessions; could be lost on system failure.',
        'Local computation state: lifetime of one operation; not shared; inherently transient.',
        'A session can be migrated across multiple clients, and session state can itself be stored within resource state (a server-side persistent entity found with a key or token the client sends, for example a cookie).',
      ],
    },
    {
      name: 'Stateful versus stateless, and where state is kept',
      points: [
        'Running programs always contain state; the terms describe whether code holds state between operations.',
        'Stateful: instance tied to one client session. Stateless: instances can be shared across clients.',
        'Application code is usually stateless: find or restore the state from an external persistent store, perform the operation, then update or save the state. Session state works the same way using a session identifier passed from the client.',
        'Keeping state in a persistent store instead of in the code gives advantages for scalability, robustness and reduced complexity.',
        'Client side: local variables in desktop clients (stateful), or cookies and other local storage (stateless).',
        'Persistent state is reached through a data access layer or stored procedures, or by mapping tables and rows to classes and objects with an object-relational mapper.',
      ],
    },
    {
      name: 'When concurrency control is needed',
      points: [
        'Concurrency is the answer to speed and scale: doing more than one operation at a time, processing while waiting for I/O, and using multiple processors, systems and data centres.',
        'A mechanism is needed when three things are all true: two code segments can interleave, both access the same item of shared state, and at least one of them modifies it.',
        'The same rule applies to two instances of the same code segment.',
        'Read/read on a shared item is safe, and session state never conflicts between different sessions because each session has its own copy (tutorial).',
        'Do not try to argue that a particular case is safe; just use proper concurrency control.',
        'Without it: lost updates and violated integrity constraints, such as selling the same seat twice or losing money in transit.',
      ],
    },
    {
      name: 'Optimistic concurrency control with a modification count',
      points: [
        'It is programmed into the application rather than the infrastructure.',
        'Step 1: keep a modification count (version) in the object.',
        'Step 2: remember the count when you read the object.',
        'Step 3: when you later try to change the object, check that the count has not changed.',
        'Step 4: if it has changed, retry the operation.',
        'To prevent all conflicts you would also check the counts of every object you only read, at the end of the computation; this is rarely done in practice.',
      ],
    },
    {
      name: 'Optimistic versus pessimistic concurrency control',
      points: [
        'Optimistic: assumes harmful access does not happen often, does not block anyone, detects damage afterwards and fixes it. The performance impact can be minimal or major.',
        'Optimistic cost: wasted work and time on computations that have to be retried; best at low contention.',
        'Pessimistic: prevents the conflict up front with locks. Concurrent tasks wait for the lock before continuing.',
        'Pessimistic cost: holding locks limits concurrency and can severely hurt performance, and it introduces deadlocks. Keep lock scope and duration small.',
        'Both aim to allow harmless concurrency and stop harmful concurrency.',
      ],
    },
    {
      name: 'Deadlock handling and lock granularity',
      points: [
        'Deadlock arises when a task needs more than one lock and the next lock it wants is already held.',
        'Detect and break: lock timeouts or deadlock cycle detection, both surfaced to the application as exceptions.',
        'Avoid: impose a canonical locking order so every task takes locks in the same order.',
        'Fine-grained locks (rows or objects): better concurrency and performance, but more overhead and more chance of deadlock.',
        'Coarse-grained locks (tables or the whole database): simpler, less overhead and less chance of deadlock, but less parallelism because harmless concurrency may be blocked.',
        'Choosing the grain well depends on understanding the level of contention.',
      ],
    },
    {
      name: 'ACID properties of a transaction',
      points: [
        'Atomic: all or nothing, even across failure and recovery. A successful transaction commits and its changes become permanent; a failing one aborts (rolls back) and its changes are backed out as if they never happened.',
        'Consistent: the transaction moves the data from one consistent state to another, for example all money is accounted for. This is really the responsibility of the application program.',
        'Isolated: each transaction behaves as if it were running alone; concurrent transactions do not interfere and the result looks like they ran serially.',
        'Durable: once committed, changes are permanent even after failure and recovery; they are written to storage and the write is waited for.',
        'Explicit transactions: the program calls an API to begin, commit or roll back (JTA UserTransaction in Java, TransactionScope in .NET).',
        'Declarative transactions: an annotation makes a method always run as a transaction (@Transactional in Spring Boot).',
      ],
    },
  ],
  examples: [
    'Resource state examples: stock on hand for a SKU, customer details, bank account balance, bank account transactions.',
    'Session example: log in, browse, order, pay, log out; the session state holds the user identity and the books ordered.',
    'Derived state: a bank balance could be computed by summing all transactions but a running total is more efficient; the next order number could be derived from Orders at start-up and cached.',
    'Lost update: T1 adds 1 and T2 adds 2 to x = 10; both read 10, T2 writes 12, then T1 writes 11, so x ends at 11 instead of 13.',
    'Interleaving: two clients both check the balance before either withdraws, so both withdrawals go ahead on the same balance.',
    'Deadlock: T1 holds the lock on A and waits for B while T2 holds the lock on B and waits for A.',
    'Why concurrency is needed: banks have thousands of ATMs, stores have hundreds of POS terminals and web sites have many thousands of users, all expecting fast responses.',
    'Tutorial bank application: two accounts start at 50 and 20 and transfer money concurrently; the combined balance must stay at 70, which needs optimistic or pessimistic locking.',
  ],
};

export const week02Practice: PracticeQuestion[] = [
  {
    title: 'Week 2: conflict matrix for three functionalities',
    scenario:
      'An application has resource state variables S, T and U and a session state variable V. Functionality A: read S, read U, read V, write V. Functionality B: read S, read U, read V, write S. Functionality C: read S, read T, read U, write T. There is no concurrency control. Two threads run in different sessions.',
    parts: [
      'A running concurrently with A: which variable(s) can conflict?',
      'A running concurrently with B?',
      'A running concurrently with C?',
      'B running concurrently with B?',
      'B running concurrently with C?',
      'C running concurrently with C?',
    ],
    weeks: [2],
    answer: [
      'None. The only write is to V, which is session state; each session has its own copy, so it is not shared.',
      'S. B writes S while A reads it.',
      'None. C only writes T, and A never touches T; S and U are only read by both.',
      'S. Both instances read and write S (a lost update is possible).',
      'S. B writes S while C reads it. T is written by C but B never touches it.',
      'T. Both instances read and write T (a lost update is possible).',
      'Rule used: a conflict needs the same shared resource variable accessed by both, with at least one write. Read/read is always safe and session state never conflicts across sessions.',
    ],
  },
  {
    title: 'Week 2: lost update trace',
    scenario:
      'x starts at 10. Transaction T1 wants to increase x by 1 and T2 wants to increase x by 2. There is no concurrency control and the steps interleave: T1 reads x, T2 reads x, T2 writes, T1 writes.',
    parts: [
      'What is the final value of x, and what should it be?',
      'Name the problem and say what is needed to prevent it.',
    ],
    weeks: [2],
    answer: [
      'T1 reads 10. T2 reads 10. T2 writes 10 + 2 = 12. T1 writes 10 + 1 = 11. Final x = 11 because T1 finished last. The correct result is 10 + 1 + 2 = 13, so x went up by 1 instead of 3.',
      'It is a lost update: the update by T2 was overwritten. Two code segments interleave on the same shared item and at least one writes, so a concurrency control mechanism is needed: optimistic (check a modification count and retry), pessimistic (take an exclusive lock before reading), or run each update as a transaction.',
    ],
  },
  {
    title: 'Week 2: client-server and layering in the Book Store',
    scenario: 'The Week 1 Book Store application follows the client-server pattern and is built in layers.',
    parts: [
      'Give the benefits of the client-server pattern.',
      'Why is separating the software into layers important?',
    ],
    weeks: [1, 2],
    answer: [
      'Low coupling: connections are set up dynamically and the server has no prior knowledge of its clients, and clients are not coupled to each other. The number of clients scales easily, limited only by server capacity, and the server can be scaled too. Clients and servers can evolve independently. Common services are shared among many clients. User interaction is isolated in the client.',
      'Layers divide the system so that modules can be developed and evolved separately with little interaction between the parts (separation of concerns). Each layer is a group of modules offering a cohesive set of services. This supports portability, modifiability and reuse.',
    ],
  },
];
