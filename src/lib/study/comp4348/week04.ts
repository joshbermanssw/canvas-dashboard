import type { PracticeQuestion, Topic } from '../types';

/** Sources: w04.txt / w04.pdf (slides 24, 25 rendered), extra/w04-lec-notes.txt, extra/w04-tut.txt, extra/w04-tut-ans.txt, extra/w04-tut-notes.txt. */
export const week04: Topic = {
  week: 4,
  title: 'Distributed transactions',
  summary:
    'How one unit of work stays atomic when it updates data on several machines that fail and recover independently: two-phase commit (2PC) run by a transaction manager, what locks and 2PC cost in performance and availability, and sagas with compensation as the looser alternative.',
  concepts: [
    {
      term: 'Transaction',
      definition:
        'A collection of one or more operations on one or more data resources that reflects one discrete unit of work: in the real world it either happened completely or did not happen at all. It can be read-only but usually modifies data (transfer money, purchase a group of products).',
    },
    {
      term: 'ACID',
      definition:
        'Atomic, Consistent, Isolated, Durable. Mostly used for local transactions that are short and run between trusted participants. In practice atomicity uses locks and logs in each resource manager, isolation uses locks, durability uses logs, and 2PC coordinates them across resource managers.',
    },
    {
      term: 'Distributed transaction',
      definition:
        'A single transaction that uses resources on several computer systems (geographically dispersed, multiple application servers, multiple database servers) while still keeping full ACID properties. The hard part is that the systems can fail and recover independently.',
    },
    {
      term: 'Resource manager (RM)',
      definition:
        'The component that manages one transactional resource, typically a database but also a message queue or transactional file system. It does the local work, votes yes or no in phase 1, and commits or abandons its changes in phase 2. In 2PC it is the participant.',
    },
    {
      term: 'Transaction manager (TM)',
      definition:
        'The coordinator that keeps track of a transaction and coordinates the changes of all resource managers using 2PC. It can be part of the database software, part of a transaction monitor (CICS, Tuxedo, a J2EE app server), stand-alone (MS DTC, X/Open model), or internal to the run-time (a lightweight TM for one process and one durable resource).',
    },
    {
      term: 'Two-phase commit (2PC)',
      definition:
        'The protocol a transaction manager uses to make updates on several systems atomic. Phase 1 asks everyone to prepare to commit; phase 2 asks everyone to commit (or to abandon if anyone said no). Significant state transitions are written to durable logs so the transaction can be recovered and continued after any participant fails.',
    },
    {
      term: 'Transaction tree',
      definition:
        'The structure formed when there is one TM per node, each looking after its local resource managers and coordinating the TMs below it. There is one root TM (where the transaction started), and a new branch appears whenever the application invokes code or accesses a resource on a new node.',
    },
    {
      term: 'Transactional context',
      definition:
        'The identifying information for the global transaction that is passed down to each new node when it is enlisted, so the work done there is known to belong to that transaction.',
    },
    {
      term: 'Stateless transaction versus session',
      definition:
        'A stateless server answers a request without needing to know about previous requests (a simple web page request). A session has state, so the outcome of a transaction may depend on earlier transactions (booking systems, shopping carts).',
    },
    {
      term: 'Request integrity',
      definition:
        'Protecting the request itself, not just the data. Transactions only ensure data integrity, so an unprocessed request sitting in a queue can be lost in a failure unless requests are saved to disk and the fetch-request operation is made part of the transaction.',
    },
    {
      term: 'Idempotency',
      definition:
        'An operation is idempotent if repeating it results in the same state change as doing it once. This makes retries safe when a client cannot tell whether its earlier request succeeded.',
    },
    {
      term: 'Nested transaction',
      definition:
        'A transaction inside another transaction, for example a transfer built from a withdraw transaction and a deposit transaction. Rarely implemented in commercial products; just-in-time server-side transactions are used instead.',
    },
    {
      term: 'Just-in-time (JIT) transaction',
      definition:
        'A declarative model where a transaction is created whenever one is needed and the method enlists in an existing transaction if possible. The method attribute "requires" means join the existing transaction or start one; "requires new" means always start a new independent transaction.',
    },
    {
      term: 'Hot spot',
      definition:
        'Frequently used shared data that many transactions lock, such as next-entry counters, summary information and end-of-file pointers. Hot spots make concurrent transactions wait for the same resource and so run one at a time.',
    },
    {
      term: 'Path length',
      definition:
        'The number of statements run while locks are held. Reducing it shortens the time other transactions are blocked.',
    },
    {
      term: 'Heuristic decision',
      definition:
        'When the coordinator fails at the wrong time and participants are stuck not knowing the outcome, in practice someone decides to commit or abort anyway and any resulting inconsistency is fixed later, manually.',
    },
    {
      term: 'Saga',
      definition:
        'An extended transaction model that gives atomicity only. A long operation is defined as a series of smaller ACID transactions, each with a compensator; on failure the compensators of completed steps are run in reverse order.',
    },
    {
      term: 'Compensator',
      definition:
        'A semantic undo for an operation that has already committed, such as cancel the order or put the goods back on the shelf. It is a new business operation, not a database rollback, and the model assumes it never fails.',
    },
  ],
  frameworks: [
    {
      name: 'Two-phase commit, step by step',
      source: 'Slides 21 to 25',
      points: [
        'Phase 1 (prepare): the TM asks every participating RM to prepare to commit. Each RM saves its intended changes and answers yes only if it can promise to commit; any RM can answer no. No RM actually commits yet.',
        'Decision: if all RMs said yes the TM goes to phase 2; if any RM said no the TM tells everyone to abandon their intended changes.',
        'Phase 2 (commit): the TM asks all participating RMs to go ahead and commit their changes.',
        'Message sequence for success: Prepare, Prepared, Commit, Done. Message sequence for failure: Prepare, No, Abort, Done.',
        'Logging: the coordinator logs begin_commit before sending prepare, then logs commit or abort before sending the global decision; a participant logs ready before voting to commit (or logs abort and votes abort), then logs commit or abort when the decision arrives.',
        'Recovery: after a failure an RM knows which transactions were questionable at the point of failure and the TM knows whether each one succeeded or failed, so the outcome can be completed.',
      ],
    },
    {
      name: 'Costs of locks and how to reduce them',
      source: 'Slides 42 and 43',
      points: [
        'Locks block other transactions, so transactions must be short, and participants must be highly trusted not to hold locks for long.',
        'Waiting does not get faster with better hardware: "all computers wait at the same speed", so a 10 ms wait always takes 10 ms.',
        'Concurrent transactions waiting for the same resource end up serialised (effectively single-threaded). This is an application design problem.',
        'Locks introduce deadlocks.',
        'Fixes: remove hot spots or avoid them altogether; cache high-contention data outside the database (then you must serialise access and handle consistency yourself); reduce path length.',
      ],
    },
    {
      name: 'Impact of 2PC on performance and availability',
      source: 'Slides 44 and 45',
      points: [
        'Commit takes a long time: at least 4 cross-network messages pass between the time a lock is taken and the time the outcome is known and the lock is released.',
        'Other transactions are blocked for that whole time.',
        'Participants must trust the coordinator to be prompt and to abort if other participants are delaying.',
        '2PC has been called an "unavailability protocol": if the coordinator fails at the wrong time, participants that voted yes are unsure of the outcome and can stay blocked indefinitely.',
        'The practical escape is a heuristic decision that is fixed up manually afterwards.',
      ],
    },
    {
      name: 'When to use ACID with 2PC, and when not to',
      source: 'Slide 46',
      points: [
        'ACID transactions suit closely coupled systems only: the systems trust one another, and communication is fairly fast and very reliable.',
        'Typical fit: inside one organisation, or among closely collaborating industry partners.',
        'Otherwise use extended transaction models such as sagas.',
        'Or carefully build "enough consistency" from ACID components, accepting and handling publishing latency, stale data and recovery. This is hard work but is done for some of the largest web-scale applications.',
        'Transactions make programming simpler and make reliability and correctness easier; the price is paid in performance and availability.',
      ],
    },
    {
      name: '2PC versus saga',
      source: 'Slides 47 to 50, lecture notes section 5.6, tutorial notes slide 11',
      points: [
        'Core idea: 2PC prepares all participants first and then makes one global decision; a saga lets each step commit immediately and compensates later if a later step fails.',
        'Guarantees: 2PC keeps full ACID including isolation; a saga gives atomicity only (all steps done, or the completed ones compensated) and no isolation.',
        'Locks: 2PC holds locks across the whole global transaction, so it suits short transactions; a saga holds locks only inside each small local transaction, so it suits long-running work and avoids long-duration locks and malevolent lockers.',
        'Coupling: 2PC needs tightly coupled, trusted systems on a fast reliable network; sagas work for loosely coupled autonomous applications, possibly across organisational borders.',
        'Saga risks: committed data is visible to other transactions before the saga finishes, which can cause corruption and compensator failures; compensators are assumed never to fail and are hard to write because they have no isolation either.',
        'Where the complexity sits: with 2PC it is in the infrastructure (TM and RMs); with a saga it moves into application code (the compensators).',
      ],
    },
    {
      name: 'Transaction API models',
      source: 'Slides 32, 37 to 39',
      points: [
        'Client-side transaction control: the code explicitly begins the transaction and explicitly commits or aborts it (tx_begin, call withdraw, call deposit, insert audit row, tx_commit).',
        'Server-side transaction control: each call performs one complete business transaction. It is declarative: being transactional is an attribute of the method and needs no coding.',
        'Attribute "requires": run in the existing transaction if there is one, otherwise start a new one. A transfer marked this way that calls withdraw and deposit (also marked "requires") runs as one transaction.',
        'Attribute "requires new": start a new independent transaction even if already inside one. Use it when you may not want a sub-transaction backed out if its parent fails.',
        'Nested transaction version of the same transfer: transfer, withdraw and deposit each run their own tx_start and tx_commit, with the inner ones inside the outer one.',
      ],
    },
    {
      name: 'Request integrity and resources beyond databases',
      source: 'Slides 30, 31, 35 and 36',
      points: [
        'Resources include ATMs, printers and responses to customers, not just databases. Cash should only be issued, or a cheque printed, if the transaction succeeds.',
        'Older transaction processing systems let the application write output normally while the operating system deferred the real output until commit; this needed close linkage between the operating system and the transaction system.',
        'Today it is the application that must solve this: write to a database for a background application to act on, use transactional message queues, or use a transactional file system.',
        'To protect requests: save incoming requests to disk and recover them from the log on restart, and include the fetch-request operation in the transaction so a failure undoes it and re-queues the request.',
        'Re-queuing gives easy recovery from transient application errors, but failure loops must be avoided (a request that fails every time it is retried).',
        'Make operations idempotent so a repeated request results in the same state change.',
      ],
    },
  ],
  examples: [
    'Without distributed transactions: Sydney withdraws $100 and commits, Melbourne is meant to deposit $100 but its system fails. The update is lost and the data is inconsistent.',
    'ATM, dispense inside the transaction: begin, update account, dispense cash, crash before commit. The account update is undone but the cash is gone, so the bank loses money.',
    'ATM, dispense after commit: begin, update account, commit, crash before dispensing. The account is debited but no cash comes out, so you lose money. The code is faulty either way.',
    'Concurrency conflict over a shared resource: the same airline seat cannot be sold twice.',
    'Saga figure: transactions T1 to T5 each have a compensator. If T1 and T2 have completed when a failure happens, the current transaction is aborted and the compensators run in reverse order: undo T2, then undo T1.',
    'Tutorial system: a Central Bank (coordinator) transfers $50 from Account 1 at Bank 1 to Account 2 at Bank 2 (participants) using prepare, commit and rollback calls over gRPC.',
    'Tutorial code detail: prepare never touches the balance, it only writes a PENDING record; commit applies the amount and sets the record to SUCCESS; rollback marks the record FAILURE.',
    'History: SABRE airline reservations in the 1960s (300,000 devices); CICS on mainframes in the 1970s; teleprocessing monitors such as Tuxedo, TopEnd and Encina on UNIX in the 1980s.',
  ],
};

export const week04Practice: PracticeQuestion[] = [
  {
    title: 'Week 4: rollback in the tutorial 2PC bank system',
    scenario:
      'A Central Bank coordinates a $50 transfer from Account 1 at Bank 1 to Account 2 at Bank 2. Each bank exposes prepare and commit over gRPC. Prepare writes a transaction record with status PENDING and does not change the balance. Commit applies the amount to the balance and sets the record to SUCCESS. The provided code only handles the case where everything succeeds.',
    parts: [
      'In which situations must the Central Bank send a rollback, and to whom?',
      'What has to be added to the gRPC contract so that the Central Bank can ask for a rollback?',
      'When a bank receives rollback for a transaction id, what should it do for each possible state of its transaction record (not found, FAILURE, PENDING, SUCCESS)?',
      'Why is it useful that a second rollback for the same transaction returns success?',
    ],
    weeks: [4],
    answer: [
      'If the prepare phase returns false (any bank voted no), or if the commit phase fails. The Central Bank sends rollback with the transaction id to both banks, in the same way that prepare and commit are sent to both.',
      'A Rollback remote procedure in bank.proto that takes a request carrying the transaction id and returns a response carrying a success flag. The stub and server-side code are then regenerated from the contract.',
      'Record or account not found: return success = false. Status FAILURE: it was already rolled back, so return success = true and change nothing. Status PENDING: it was prepared but not committed, so the balance never changed; just mark the record FAILURE. Status SUCCESS: it was already committed and the balance did change, so compensate by subtracting the recorded amount from the balance, then mark the record FAILURE.',
      'It makes rollback idempotent: repeating it results in the same state as doing it once, so the coordinator can safely retry a rollback when it is unsure whether the first one arrived.',
    ],
  },
  {
    title: 'Week 4: tracing 2PC for a two-site transfer',
    scenario:
      'A transfer withdraws $100 from an account held in Sydney and deposits $100 into an account held in Melbourne. Each site has its own database (resource manager).',
    parts: [
      'What goes wrong if each site simply runs and commits its own local transaction, and Melbourne fails after Sydney has committed?',
      'Describe the messages exchanged under two-phase commit when both sites can do their part.',
      'Describe the messages exchanged when Melbourne cannot accept the deposit.',
      'Give two costs of using 2PC here.',
    ],
    weeks: [4],
    answer: [
      'Sydney has withdrawn $100 and committed, but the deposit in Melbourne never happens. The update is lost and the data is inconsistent: $100 has left one account and arrived nowhere. The transaction was not atomic because the two systems fail and recover independently.',
      'Phase 1: the transaction manager sends Prepare to both resource managers; each saves its intended change and replies Prepared (yes) without committing. Phase 2: because all said yes, the transaction manager sends Commit to both, and each commits and replies Done. The significant transitions are written to durable logs along the way.',
      'Phase 1: the transaction manager sends Prepare to both; Sydney says yes but Melbourne says No. Because one resource manager said no, the transaction manager sends Abort to everyone, Sydney abandons its intended withdrawal, and both reply Done. No money moves.',
      'Commit is slow: at least 4 cross-network messages pass while locks are held, and other transactions are blocked for that time. Availability also suffers: if the coordinator fails after the sites have voted yes, they are unsure of the outcome and can stay blocked indefinitely until a heuristic decision is made and fixed up manually.',
    ],
  },
  {
    title: 'Week 4: where to put "dispense cash" in an ATM withdrawal',
    scenario:
      'An ATM withdrawal updates the account in a database and dispenses cash. A developer is deciding whether the dispense step goes inside the database transaction (before commit) or after it.',
    parts: [
      'The order is: begin, update account, dispense cash, commit. The system crashes after dispensing and before commit. Who loses money?',
      'The order is: begin, update account, commit, dispense cash. The system crashes after commit and before dispensing. Who loses money?',
      'What does this show, and what options does the lecture give for handling it?',
    ],
    weeks: [4],
    answer: [
      'The transaction never committed, so the account update is undone, but the cash has already been handed out. The bank loses money.',
      'The account update is committed, but the cash never comes out. The customer loses money.',
      'The code is faulty whether the dispense step is inside or outside the transaction, because resources are more than just databases and the cash dispenser does not take part in the database transaction. Older transaction systems deferred real output until commit; today the application must handle it, for example by writing to a database for a background application to act on, using transactional message queues, or using a transactional file system.',
    ],
  },
];
