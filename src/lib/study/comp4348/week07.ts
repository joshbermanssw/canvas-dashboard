import type { PracticeQuestion, Topic } from '../types';

/** Sources: w07.txt (slides), extra/w07-lec-notes.txt, extra/w08-tut.txt and extra/w08-tut-notes.txt (the Week 8 REST tutorial practises this lecture). */
export const week07: Topic = {
  week: 7,
  title: 'Service-oriented architecture and RESTful services',
  summary:
    'What a service is, and the two ways to build one: the contract-first WS-* stack (SOAP, WSDL, UDDI) and REST, which reuses HTTP verbs, URIs, status codes and links. Neither wins everywhere; you pick by the quality attributes you need.',
  concepts: [
    {
      term: 'Service',
      definition:
        'A logical representation of a repeatable business activity with a specified outcome (e.g. check customer credit). It is self-contained, may be composed of other services, and is a black box to its consumers. In practice: a coarse-grained chunk of business functionality that hides its implementation.',
    },
    {
      term: 'Service-oriented architecture (SOA)',
      definition:
        'An architecture where applications provide and consume services and share only standards, contracts and schemas. They share nothing else: not implementation technology, data or classes.',
    },
    {
      term: 'Web service (WS-*)',
      definition:
        'A component whose services are reached through messages that follow XML-based standards managed by W3C. The standards cover only what goes on the wire (no programming model or API), and the messages may travel over HTTP or another transport.',
    },
    {
      term: 'SOAP',
      definition:
        'Simple Object Access Protocol: an XML message format that began as RPC in XML and can also carry plain messages. A message is an Envelope (mandatory) holding an optional Header and a mandatory Body.',
    },
    {
      term: 'SOAP header',
      definition:
        'The optional part of a SOAP message for general information such as authentication and transaction management. It is the extensibility point: new header elements add new semantics without disturbing existing code.',
    },
    {
      term: 'Doc/literal encoding',
      definition:
        'The SOAP encoding style that puts XML matching a defined schema in the body. It works with common XML validators, is better for interoperability and was measured as much faster; the other style, RPC/encoded, is deprecated.',
    },
    {
      term: 'WSDL',
      definition:
        'Web Services Description Language: an XML description of a service (types, messages, port types, bindings) that tools generate and consume, for example to produce client stubs. It is an IDL for web services and covers request-response only; it cannot say in which order to send messages.',
    },
    {
      term: 'UDDI',
      definition:
        'Universal Description, Discovery and Integration: a directory of services that is itself a web service, with white pages (business contact info), yellow pages (services by industry taxonomy) and green pages (technical details: address, how to call, tModel). It never took off in practice; most systems use other repositories.',
    },
    {
      term: 'Intermediary and ultimate receiver',
      definition:
        'An intermediary is a receiver that sends the message onwards. The ultimate receiver is the one that actually provides the service and does not forward the message.',
    },
    {
      term: 'WS-Addressing',
      definition:
        'A standard that ships service addresses (extended URIs, as endpoint references) inside the message. Addresses are transport-neutral, so they are not tied to HTTP.',
    },
    {
      term: 'REST',
      definition:
        'REpresentational State Transfer: an architectural style (not a protocol or product) defined by Roy Fielding in his 2000 thesis. It takes the ideas that made the Web succeed and applies them to programs instead of human readers.',
    },
    {
      term: 'Resource',
      definition:
        'Anything "interesting" in the system that is given a URI: a spreadsheet cell, a blog post, a printer, even a transaction. Choosing the resources and their URIs is the central design decision of a RESTful service.',
    },
    {
      term: 'Representation',
      definition:
        'What clients actually exchange: a snapshot of a resource in some format such as XML or JSON ("pass-by-value"), never the resource itself. One resource can have several representations.',
    },
    {
      term: 'URI and URI template',
      definition:
        'A URI names a resource and has a scheme, authority, path and optional query. A URI template shows the structure with named slots, e.g. http://s3.amazon.com/{bucket-name}/{object-name}. Most HTTP stacks limit URI length (about 4 KB).',
    },
    {
      term: 'Uniform interface',
      definition:
        'Every resource supports the same small set of HTTP verbs with the same meaning: GET, PUT, POST, DELETE (plus HEAD and OPTIONS for metadata). Because the interface never changes, it is harder to break clients.',
    },
    {
      term: 'Safe and idempotent',
      definition:
        'Safe means the request does not change the resource (GET, HEAD, OPTIONS). Idempotent means doing it twice has the same effect as doing it once (GET, HEAD, OPTIONS, PUT, DELETE). POST is neither.',
    },
    {
      term: 'ETag and conditional GET',
      definition:
        'An ETag is an opaque identifier, like a checksum, for a representation. The client sends it back in If-None-Match, and the server answers 304 Not Modified with no body if the cached copy is still good.',
    },
    {
      term: 'Hypermedia (HATEOAS)',
      definition:
        'Hypermedia as the engine of application state: representations carry links to other resources, and each link is a state transition. The server tells the client what it may do next, and the links change as the state changes.',
    },
    {
      term: 'Richardson Maturity Model',
      definition:
        'A scale for how RESTful an API is. Level 0: one URI and one verb (RPC over HTTP, where SOAP sits). Level 1: many URIs. Level 2: proper verbs and status codes. Level 3: links in responses (HATEOAS).',
    },
    {
      term: 'POX',
      definition: 'Plain Old XML: XML sent over HTTP without the WS-* stack. It is the payload layer on the REST side of the REST versus WS-* stack diagram.',
    },
  ],
  frameworks: [
    {
      name: 'The four SOA tenets',
      source: 'Lecture 7 slides',
      points: [
        'Boundaries are explicit: services are external, and crossing a boundary has costs and implications (network, trust, maybe another company).',
        'Services are autonomous: they may be outside your control and can change, so your design has to survive that.',
        'Share schema and contract, not classes and implementations.',
        'Policy-based compatibility: requirements such as "must be encrypted" are stated in policies, not buried in code.',
        'Design principles that follow: coarse-grained but focused services, think about reliability and robustness, reduce dependencies, wrap legacy code instead of rewriting it, and keep everything (including integration technology) as simple as possible.',
      ],
    },
    {
      name: 'Distributed computing 101 and the WS-* answer to each step',
      source: 'Lecture 7 slides and notes',
      points: [
        'Find something (an object, component or service): UDDI, the registry.',
        'Find out how to call it (what it needs, where it is): WSDL, the contract.',
        'Ask it to do something: SOAP, the message.',
        'Add useful extras (transactions, security, reliability): the WS-* extension standards.',
        'Publish, find, bind: the provider publishes its WSDL to the registry, the requester finds it there, then binds to the provider and calls it with SOAP.',
        'The same four steps apply to CORBA, .NET and J2EE as well as web services.',
      ],
    },
    {
      name: 'SOAP on the wire versus REST on the wire',
      source: 'Lecture 7 slides and notes',
      points: [
        'SOAP: every operation is an HTTP POST to one endpoint URI. The operation name (e.g. GetLastTradePrice) sits inside the envelope body, where HTTP cannot see it.',
        'REST: many resource URIs and a fixed set of verbs. The meaning (GET /book/222, PUT /order/612) is visible to HTTP, so caches and proxies understand it.',
        'Nouns not verbs: requests go to URIs (nouns); the operations are always the same HTTP verbs. Write GET /orders/1234, not /getOrder?id=1234.',
        'In SOAP a new capability means a new operation in the contract. In REST it usually means a new resource.',
        'SOAP can run over SMTP, HTTP or message queues. REST uses HTTP only.',
      ],
    },
    {
      name: 'The four REST principles',
      source: 'Lecture 7 slides',
      points: [
        '1. Resources are identified through URIs.',
        '2. Uniform interface for all resources: GET (query state; idempotent; can be cached), PUT (modify or create; idempotent), POST (create, with the system choosing the identifier), DELETE (delete).',
        '3. Self-descriptive messages through metadata (method, URI, headers, media type). The server therefore keeps no conversation state between requests, which makes it easy to scale out.',
        '4. Hyperlinks define the application state.',
        'These four principles are what explain the success and scalability of HTTP and the human Web.',
      ],
    },
    {
      name: 'HTTP verbs and what each one promises',
      source: 'Lecture 7 slides and notes',
      points: [
        'GET: retrieve a representation. Safe, idempotent, cacheable. Never use GET to change state.',
        'HEAD: like GET but returns only metadata (e.g. Last-Modified, ETag). Useful for caching and performance.',
        'POST: create a new resource where the server chooses the URI. Not safe, not idempotent. The reply is 201 Created with a Location header.',
        'PUT: create a resource at a URI the client chooses, or update an existing one by overwriting it in place. Idempotent, so a retry does no harm; use PUT (not POST) for updates.',
        'DELETE: stop the resource being accessible (a logical delete, not necessarily physical). Idempotent but not safe.',
        'OPTIONS: ask which verbs the resource currently supports (returned in the Allow header). Handy for spotting read-only resources.',
      ],
    },
    {
      name: 'CRUD mapped to REST',
      source: 'Lecture 7 slides',
      points: [
        'Create: PUT (the user chooses the URI) or POST (the system chooses the URI). Initialises the state of a new resource.',
        'Read: GET. Retrieves the current state of a resource.',
        'Update: PUT. Modifies the state of a resource.',
        'Delete: DELETE. Clears the resource; afterwards the URI is no longer valid.',
      ],
    },
    {
      name: 'Status codes and headers to know',
      source: 'Lecture 7 slides and notes',
      points: [
        'Classes: 1xx metadata, 2xx everything is fine, 3xx redirection, 4xx the client did something wrong, 5xx the server did something bad.',
        'Success and redirect codes: 100 Continue, 200 OK, 201 Created, 301 Moved Permanently, 303 See Other, 304 Not Modified.',
        'Client error codes: 400 Bad Request, 401 Unauthorised, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 409 Conflict (the resource state has moved on).',
        'Server error code: 500 Internal Server Error.',
        'Headers: Content-Type (representation format), Authorization (credentials), Location (where a created or moved resource lives; used with 201 and 3xx), ETag with If-None-Match (conditional GET).',
      ],
    },
    {
      name: 'Links as state transitions (web-friendly workflow)',
      source: 'Lecture 7 slides, Starbucks case study by J. Webber',
      points: [
        'Model workflow stages as resources, state transitions as hyperlinks or URI templates, and events as following links and changing resource state.',
        'Think of resources as states in a state machine and links as the transitions. Following a link causes an action.',
        'Application (conversation) state is which state the client is in. Server state lives in the resources and their data stores.',
        'What the client may do depends on the resource state, and the server says so: the Allow list and the links change over time (the payment link disappears once you have paid).',
        'A client only needs to know in advance the entry URI, the media types and what the link names (rel values) mean. Everything else arrives at run time.',
      ],
    },
    {
      name: 'REST versus WS-*: strengths, weaknesses and when to choose each',
      source: 'Lecture 7 slides and notes',
      points: [
        'REST strengths: simplicity (immutable uniform interface), HTTP and plain XML are everywhere and pass through firewalls, stateless synchronous interaction, proven scalability (caching, clustered server farms), light infrastructure and easy adoption.',
        'REST weaknesses: more than four verbs in reality, inherently synchronous, cannot deliver all the enterprise "-ilities" (transactions, flexible security and transport, reliability, intermediaries), hard to identify and locate resources in every application, few standards, informal human-oriented descriptions, weak tool support for generating clients.',
        'WS-* strengths: widely supported standards, good tooling (WSDL and stubs generated automatically), designed for extensibility, transport flexibility, and standard answers for security, reliability, transactions and intermediaries.',
        'WS-* weaknesses: verbose XML messages (performance needs attention), messages are not human-friendly, WSDL cannot describe message ordering, and many people see the stack as too complex.',
        'Choose REST for web-facing and public APIs, browser and mobile clients, and where caching and scale matter. Choose SOAP/WS-* for enterprise or legacy integration that needs strict contracts, message-level security through intermediaries, reliable messaging, distributed transactions or a non-HTTP transport.',
        'Integration styles: REST sits in the remote-procedure-call (request-response) space; SOAP/WS-* spans both RPC and the message bus.',
      ],
    },
    {
      name: 'Evolving a live API without breaking clients',
      source: 'Week 8 tutorial (Part D) and tutorial notes',
      points: [
        'A live API is a published contract; you cannot make every client upgrade at once.',
        'Rule: adding is safe, removing or renaming is not. Safe: a new optional field, a new endpoint, a new optional query parameter. Breaking: removing or renaming a field, changing its type or meaning, making an optional field required.',
        'Expand: add the new fields next to the old ones and keep both populated.',
        'Migrate: backfill old data and move clients to the new fields one at a time.',
        'Contract: delete the old field once nobody reads it.',
        'Two compatibility problems to solve: the API (old clients still send and expect the old field) and the data (existing rows only have the old field).',
      ],
    },
  ],
  formulas: [
    {
      name: 'Speed-of-light delay',
      formula: 'one-way delay = distance ÷ speed of light in glass = 300,000 m ÷ (2 × 10⁸ m/s) = 1.5 ms',
      note: 'Sydney to Canberra is about 300 km of fibre; light in glass travels at about 2 × 10⁸ m/s. A round trip costs 3 ms, and every synchronous exchange pays it.',
    },
    {
      name: 'Average latency with a cache',
      formula: 'average = hit rate × hit latency + (1 − hit rate) × origin latency',
      note: 'Lecture notes illustration: 0.9 × 2 ms + 0.1 × 100 ms = 11.8 ms. Only safe (GET) responses can be cached this way.',
    },
  ],
  examples: [
    'Service-based online retail application: one business process touches a web server, user authentication, a credit card processor, a bank mainframe, two shippers and two suppliers, each on different technology (.NET, EJB, COM+, CICS, MQ, CORBA) and joined only by standard service protocols.',
    'SOAP stock quote: POST /StockQuote with a GetLastTradePrice element for symbol DIS in the body; the reply is 200 OK with a SOAP body returning 34.5.',
    'SOAP measurements: the best implementations were competitive with non-SOAP alternatives (4-20 ms against 1-15 ms), doc/literal was much faster, and products differed by a factor of 4-6.',
    'The basic idea of REST: GET /book/222 reads a book, POST /order creates an order and the server replies with the new location /order/612, PUT /order/612 updates it.',
    'Amazon S3 URI template: http://s3.amazon.com/{bucket-name}/{object-name}.',
    'POST a buy order to the server and get 201 Created with Location: /orders/jwebber/ABCD/2007-07-08-13-50-53; later PUT to that URI with a higher price to update it.',
    'Starbucks case study: POST the order, check OPTIONS, PUT to add a shot, get 409 Conflict if the barista has already started, POST the payment to the payment link, then GET the order and see the payment link gone.',
    'Starbucks behind the scenes: /orders is an Atom feed of drinks to make that only accepts GET and is not in the public API; payment records need HTTP Digest authentication (401 Unauthorized without credentials).',
    'Payroll service (Week 8 tutorial): /employees supports GET and POST, /employees/{id} supports GET, PUT and DELETE; later the name field is split into firstName and lastName without breaking old clients.',
  ],
};

export const week07Practice: PracticeQuestion[] = [
  {
    title: 'Week 7: design the payroll REST interface',
    scenario:
      'A payroll service manages the employees of a company. Users must be able to (1) view a list of employees, (2) view one employee by ID, (3) add a new employee, (4) update an existing employee by ID and (5) delete an employee by ID. The database assigns employee IDs.',
    parts: [
      'Identify the resources and give each a URI.',
      'For each of the five requirements, give the HTTP verb, the URI and the success status code.',
      'Why is a new employee POSTed to /employees and not sent to /employees/{id}?',
      'Why is the update a PUT on the individual employee and not on the collection?',
    ],
    weeks: [7],
    answer: [
      'Start from the nouns. There are two resources: the employee collection at /employees and an individual employee at /employees/{id}.',
      '(1) GET /employees, 200. (2) GET /employees/{id}, 200 (404 if no such employee). (3) POST /employees, 201 with a Location header. (4) PUT /employees/{id}, 200 (or 404). (5) DELETE /employees/{id}, 204 (or 404).',
      'The client does not know the ID yet because the database assigns it. POST asks the collection to admit a new member and the server chooses the URI.',
      'PUT means "make the resource at this URI equal to this representation", which only makes sense once you know which resource, i.e. you have the ID. PUT is also idempotent, so retrying an update is harmless.',
    ],
  },
  {
    title: 'Week 7: Starbucks order as a RESTful workflow',
    scenario:
      'A coffee shop exposes ordering as a RESTful service with a well-known order URI. A customer orders a latte, then wants to add an extra shot, then pays.',
    parts: [
      'Which request places the order, and what does the response contain?',
      'How does the client find out whether the order can still be changed, and which request changes it?',
      'The client is slow and the barista has started the drink. What happens to the update, and what does OPTIONS now return?',
      'How does the client know where and how to pay, and what does the order look like after payment?',
    ],
    weeks: [7],
    answer: [
      'POST the order to the well-known /order URI (POST because the server chooses the new URI). The reply is 201 Created with a Location header for the new order (order 1234) and a representation that includes a link with rel="payment".',
      'Send OPTIONS to the order URI. While the reply is Allow: GET, PUT the order can be updated, so PUT the whole order back with the extra shot and get 200 OK. PUT is idempotent, so a retry is safe.',
      'The PUT is rejected with 409 Conflict because the resource state changed without the client (someone else moved the order on). OPTIONS now returns Allow: GET only, so the order is read-only.',
      'The URI comes from the payment link inside the order representation, and OPTIONS confirms POST is allowed. The client POSTs the payment and gets 201 Created (a new payment resource). A later GET of the order no longer contains the payment link: the available actions changed because the state changed.',
    ],
  },
  {
    title: 'Week 7: latency of chatty calls and cached GETs',
    scenario:
      'A client in Sydney calls a service in Canberra over about 300 km of fibre. Light in glass travels at about 2 × 10⁸ m/s. Separately, a cacheable GET has an origin latency of 100 ms, a cache-hit latency of 2 ms and a 90% hit rate.',
    parts: [
      'What is the one-way and round-trip speed-of-light delay?',
      'How much delay do ten sequential synchronous round trips add before any work is done?',
      'What is the average latency of the cached GET?',
      'Why can a GET be cached, and what must you never do with GET?',
    ],
    weeks: [7],
    answer: [
      'One way: 300,000 m ÷ (2 × 10⁸ m/s) = 0.0015 s = 1.5 ms. Round trip: 2 × 1.5 = 3 ms.',
      '10 × 3 ms = 30 ms. This is a physical limit, so a chatty synchronous protocol pays it on every exchange.',
      'Average = 0.9 × 2 ms + 0.1 × 100 ms = 1.8 + 10 = 11.8 ms.',
      'GET is safe (it does not change the resource), so browsers, proxies and caches may store and reuse the response. Never use GET to change state (e.g. GET /deleteUser), because anything that follows the link would trigger the change.',
    ],
  },
  {
    title: 'Week 7: splitting a field on a live API',
    scenario:
      'The payroll service is live and used by many enterprises. A new requirement says the employee name must be split into firstName and lastName. Simply replacing the name field would force every existing system offline for the update.',
    parts: [
      'Why is renaming the field a breaking change?',
      'Which two compatibility problems must the solution handle?',
      'Describe a zero-downtime approach.',
    ],
    weeks: [7],
    answer: [
      'Existing clients still send name and read name from responses. Removing or renaming a field breaks them the moment it is deployed; only adding (optional fields, new endpoints) is safe.',
      'API compatibility: old clients still send and expect name. Data compatibility: rows already in the database have a name but no firstName or lastName, and a GET on them must still return something sensible.',
      'Expand, migrate, contract. Expand: add firstName and lastName alongside name, accept either shape on the way in and return both shapes on the way out. Migrate: backfill old rows and move clients across one at a time. Contract: remove name once nobody reads it. The tutorial solution does only the expand step and converts old rows when they are read.',
    ],
  },
];
