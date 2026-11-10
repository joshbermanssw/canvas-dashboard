import type { PracticeQuestion, Topic } from '../types';

/** Sources: w03.txt / w03.pdf (lecture 3 slides), extra/w03-tut.txt / .pdf, extra/w03-tut-ans.pdf, extra/w03-tut-notes.txt. */
export const week03: Topic = {
  week: 3,
  title: 'Distributed computing',
  summary:
    'How remote calls work (stubs, skeletons, marshalling), why distribution can never be fully transparent, and how that shapes interface design and multi-tier architectures. The tutorial covers ERDs and UML class diagrams.',
  concepts: [
    {
      term: 'Distributed computing',
      definition:
        'Computing and data kept local to autonomous units (branches, divisions, partners) but integrated transparently: calling remote programs, accessing remote data, spreading load across many systems and gaining reliability through autonomy. It has proven hard to achieve in practice.',
    },
    {
      term: 'Remote Procedure Call (RPC)',
      definition:
        'A 1980s technology for calling procedures on another machine from procedural languages. Implementations are still used under the covers in distributed systems such as file servers and mail servers.',
    },
    {
      term: 'CORBA',
      definition:
        'A 1990s standard from the OMG for calling methods on remote objects, integrating objects written in multiple object-oriented languages.',
    },
    {
      term: 'Stub (proxy)',
      definition:
        'The client-side object that represents the remote server object inside the client. The caller makes a normal method call on it; it marshals the arguments into a request message and sends it to the server.',
    },
    {
      term: 'Skeleton',
      definition:
        'The server-side counterpart of the stub (the slides note it is sometimes also called a stub). It listens on a network endpoint, unmarshals the request, works out which method to call, makes a normal call on the server object and sends the result back.',
    },
    {
      term: 'Marshalling and unmarshalling',
      definition:
        'Marshalling packs call arguments or return values and related information into a message; unmarshalling extracts them again at the other end.',
    },
    {
      term: 'Interface definition language',
      definition:
        'A language such as IDL or WSDL that describes the interface of a remote object so that compilers and development tools can generate the stubs and skeletons.',
    },
    {
      term: 'Transparency',
      definition:
        'Making distributed computing look just like local computing, so programmers keep thinking in procedures or objects and use remote ones as if they were local. It only holds for the programming paradigm; real networks add latency and new failures, so applications must be network-aware.',
    },
    {
      term: 'Partial failure',
      definition:
        'A failure mode specific to distributed systems where some parts are working and some are not, for example because of broken links, lost messages or delays.',
    },
    {
      term: 'Coarse-grained component',
      definition:
        'A component that offers a meaningful service in one call. It suits distribution, unlike fine-grained objects with getters, setters and frequent small method calls, which cause too many network round trips.',
    },
    {
      term: 'Peer-to-peer architecture',
      definition:
        'A distributed architecture of equal partners talking to each other, such as mail server to mail server, business-to-business partners, supply chains and finance.',
    },
    {
      term: 'Multi-tier application',
      definition:
        'An application whose logic is divided into components by function and installed on different machines in layered roles (for example client, business and data tiers), allowing servers to specialise and load to be shared across systems.',
    },
    {
      term: 'Deployment descriptor',
      definition:
        'A Java EE configuration file that separates business logic from infrastructure concerns such as transactions and security, for example declaring a bean as a stateless session bean with container-managed transactions.',
    },
    {
      term: 'Entity (ERD)',
      definition:
        'A thing the system needs to store and manage, such as a student, book or account. In a relational database an entity maps to a table, an attribute to a column and an entity instance to a row.',
    },
    {
      term: 'Primary key and foreign key',
      definition:
        'A primary key uniquely identifies each row and cannot be null ("who am I?"). A foreign key refers to a key in another table and links the two ("who am I connected to?"); its values need not be unique and it enforces referential integrity.',
    },
    {
      term: 'Cardinality (multiplicity)',
      definition:
        'How many instances of one entity or class can be linked to another, read as minimum..maximum. A minimum of zero means taking part in the relationship is optional. Cardinality is the ERD term and multiplicity the class diagram term.',
    },
  ],
  frameworks: [
    {
      name: 'The eight fallacies of distributed computing',
      source: 'Peter Deutsch',
      points: [
        '1. The network is reliable. 2. Latency is zero.',
        '3. Bandwidth is infinite. 4. The network is secure.',
        '5. Topology does not change. 6. There is one administrator.',
        '7. Transport cost is zero. 8. The network is homogeneous.',
        'Each is a false assumption; in reality they produce new failure modes and design challenges from partial failures, latency, autonomy, congestion and security.',
      ],
    },
    {
      name: 'Remote method call, step by step',
      points: [
        '1. The caller makes an ordinary method call on the client-side stub (proxy).',
        '2. The stub marshals the arguments and related information into a request message and sends it to the server machine.',
        '3. The server-side skeleton, listening on a network endpoint, receives and unmarshals the message: it extracts the arguments and determines which method on which instance to call (this is where the stateful or stateless question arises).',
        '4. The skeleton makes an ordinary method call on the server object.',
        '5. The method returns to the skeleton, which marshals the return values into a reply message and sends it back to the stub.',
        '6. The stub unmarshals the reply, extracts the return values and returns to the caller.',
      ],
    },
    {
      name: 'What request and response messages carry',
      points: [
        'Request: object endpoint ID (which object), interface identifier (which interface), method identifier (which method), extension headers (extra information) and parameter data (in and in/out parameters).',
        'Response: status code (did it work), extension headers and parameter data (out and in/out parameters).',
        'Concrete protocols such as IIOP/GIOP (CORBA), DCOM and SOAP all carry these same logical components in different formats; a SOAP request is an XML envelope with a header (action, message ID, security) and a body naming the operation and its arguments.',
        'Stubs and skeletons are generated by compilers or development environments, which need to know the methods, their interfaces and the calling conventions of the language.',
        'The client must know the remote interface: generated from the server method definitions, generated from an interface definition language (IDL, WSDL), copied by hand, or looked up in a repository.',
      ],
    },
    {
      name: 'Why remote calls are not transparent, and what to do about it',
      points: [
        'Latency: software stacks, switches, congestion and the speed of light mean remote calls take milliseconds, not microseconds.',
        'New failures: broken links, lost messages, delays and partial failures.',
        'So applications must be network-aware: minimise network round trips and handle the new errors.',
        'Standard object-oriented techniques perform poorly when distributed: getters and setters, frequent small calls, shared address spaces and fine-grained objects.',
        'Design coarse-grained components that offer meaningful services instead.',
        'Use technological help to plan for the pitfalls: reliable messaging, distributed transactions and redundancy.',
      ],
    },
    {
      name: 'Evolving a distributed interface',
      points: [
        'Problem: you want to add a method or a parameter, but client code is already deployed in the wild.',
        'Option 1, immutable interfaces: define once and never change; add new interfaces and drop old ones.',
        'Option 2, change the interface: then you must find and change every caller.',
        'Recommended: keep the existing interfaces and add new ones for new situations.',
      ],
    },
    {
      name: 'Multi-tier architectures: Java EE and Spring Boot',
      points: [
        'Java EE tiers: client tier (application client or browser pages, on the client machine), web tier (JSP pages and servlets, on the Java EE server), business tier (enterprise beans, on the Java EE server) and EIS tier (databases and legacy systems, on the EIS or database server).',
        'Business functions are done in the middle tier, which usually runs on dedicated server hardware with access to the full services of the enterprise.',
        'An application client can talk to the business tier directly; a browser goes through the web tier.',
        'Java EE services: JNDI (naming and directory), RMI and JMS (communication), JTA and JTS (transactions), JDBC (database access).',
        'EJB example: a remote interface marked @Remote, implemented by a bean class marked @Stateless; the client finds it with a JNDI lookup and then calls it like a local object.',
        'Spring Boot layering: presentation (controller, receives HTTP/REST requests from the client), business (service), persistence (repository and model, using JPA) and database.',
      ],
    },
    {
      name: 'ERD to class diagram (tutorial)',
      points: [
        'An ERD describes the data structure for the database; a class diagram describes the object-oriented software structure, with data and behaviour (methods).',
        'Mapping: entity to class, row to object, attribute or column to field, relationship to association, cardinality to multiplicity. They map closely but are not the same concept.',
        'In a one-to-many relationship the foreign key goes on the many side. A many-to-many relationship needs a junction table holding a foreign key to each side.',
        'Each foreign key becomes an object reference in the class diagram, not an ID field (customer_id becomes a Customer field).',
        'Behaviour comes from the requirements, not the ERD. Rule of thumb: behaviour on one object goes on the entity; behaviour that coordinates several objects or must succeed or fail as a unit goes in a service.',
      ],
    },
    {
      name: 'UML class relationships (tutorial)',
      points: [
        'Association: the classes are structurally related; the other class is stored as a field. Directed association: navigable one way; the field lives in the class at the tail and the arrowhead points to what can be reached.',
        'Aggregation (hollow diamond on the whole): weak "has-a"; the part can exist without the whole, for example Library and Book.',
        'Composition (filled diamond on the whole): strong "part-of"; the part does not survive without the whole, for example Person and Name. Test: if I delete the whole, does the part still make sense on its own? Yes means aggregation, no means composition.',
        'Inheritance (solid line, hollow triangle): "is-a", extends a class, for example Corporate Account is a Bank Account.',
        'Realization (dashed line, hollow triangle): a class implements an interface.',
        'Dependency (dashed arrow): one class uses another only temporarily, as a parameter, local variable or return type.',
        'Multiplicity values: 0..1 zero or one; 1 exactly one; 0..* zero or more; 1..* one or more; n exactly n; 0..n zero to n; 1..n one to n.',
      ],
    },
  ],
  examples: [
    'Bookshops and warehouses: each bookshop has catalogue, customer and order components and each warehouse has catalogue, customer, stock and delivery components plus a warehouse manager; the lines between them are remote request/response flows.',
    'History of remote call technologies: RPC (1980s), CORBA (1990s), then DCOM, Java and WCF components, then web services, REST and message queues.',
    'Peer-to-peer: an online retail application talking to suppliers, shippers, a bank, a credit card processor and a user authentication service.',
    'Multi-tier: client tier (web pages, user apps), business tier (order, payment, goods, delivery) and data tier (customer, order, stock).',
    'EJB calculator: a CalculatorService stateless bean exposes add, subtract, multiply and divide through a remote interface; the client looks it up by name through JNDI and calls it.',
    'Spring Boot bank project: CustomerController (@RestController) calls CustomerService (@Service, @Transactional), which uses CustomerRepository (extends JpaRepository) to store the Customer @Entity.',
    'Bank ERD: Customer (id, first_name, last_name), Account (id, balance, customer_id FK) and Transaction Record (id, amount, time, to_account_id FK, from_account_id FK).',
    'Stored versus derived balance: a stored balance reads in O(1) but can drift from the history and must be updated on every transaction; a balance summed from transactions is always consistent and gives a full audit trail but costs O(n) to read.',
  ],
};

export const week03Practice: PracticeQuestion[] = [
  {
    title: 'Week 3: bank ERD to class diagram',
    scenario:
      'A bank ERD has three tables. Customer(id PK, first_name, last_name). Account(id PK, balance, customer_id FK). Transaction Record(id PK, amount, time, to_account_id FK, from_account_id FK). The application creates customers and accounts with an initial balance, transfers money, and tracks balances both through transaction records and through an explicit balance.',
    parts: [
      'Which classes are needed and what fields replace the foreign keys?',
      'Why does Transaction Record have two foreign keys to Account, and what does that mean for the class diagram?',
      'What are the multiplicities in the released answer?',
      'Where should the transfer behaviour live?',
    ],
    weeks: [3],
    answer: [
      'Customer, Account and TransactionRecord. Each foreign key becomes an object reference: Account has a Customer field instead of customer_id, and TransactionRecord has toAccount and fromAccount fields of type Account instead of the two ID columns.',
      'One transfer involves the same Account entity in two different roles, the account money comes from and the account it goes to. So the class diagram needs two links between TransactionRecord and Account (fromAccount and toAccount).',
      'One Customer to 0..n Accounts, and each TransactionRecord linked to 2 Accounts, with an Account appearing in 0..n TransactionRecords.',
      'In a service (the released answer uses a transaction record service with a performTransaction method), because a transfer touches two accounts and creates a transaction record and must succeed or fail as a unit. Account keeps only simple operations on its own data: getBalance and modifyBalance.',
    ],
  },
  {
    title: 'Week 3: stored or derived account balance',
    scenario:
      'Account has a balance column, and every transfer is also recorded in Transaction Record. A teammate says the balance column is redundant.',
    parts: [
      'Is the teammate right that the balance could be removed?',
      'Compare the two designs on read cost, consistency, audit trail and write cost.',
      'What do real banking systems usually do?',
    ],
    weeks: [2, 3],
    answer: [
      'Yes, the balance can be derived by summing the transactions, so both designs are legitimate. It is a design decision, not a mistake.',
      'Stored balance: read is O(1) with one lookup; it can drift from the transaction history; it gives no audit trail by itself; it must be updated on every transaction. Derived balance: read is O(n) over the whole history; it is always consistent with the history; the audit trail is complete; there is nothing extra to update on a write.',
      'Keep both: a stored balance for fast reads plus the full transaction history as the source of truth, and reconcile the two regularly.',
    ],
  },
  {
    title: 'Week 3: aggregation or composition',
    scenario: 'You are drawing a UML class diagram and must choose the relationship for two whole-part pairs: Library and Book, and Person and Name.',
    parts: [
      'What single test decides between aggregation and composition?',
      'Classify Library and Book, and give the symbol.',
      'Classify Person and Name, and give the symbol.',
    ],
    weeks: [3],
    answer: [
      'Ask: if I delete the whole, does the part still make sense on its own? Yes means aggregation, no means composition.',
      'Aggregation (weak "has-a"): if the library closes the books still exist. Symbol: hollow diamond on the whole (Library) end.',
      'Composition (strong "part-of"): delete the Person and the Name has nothing left to describe. Symbol: filled diamond on the whole (Person) end. In database terms composition often corresponds to ON DELETE CASCADE.',
    ],
  },
];
