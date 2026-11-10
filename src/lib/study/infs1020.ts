import type { StudyGuide } from './types';

/**
 * INFS1020 final exam guide. Built from the Week 13 lecture, the Week 13
 * practice questions, the Week 2–12 lecture slides and the exam's Canvas site.
 * Reading takeaways marked "From the reading" come from the article itself,
 * not the slides.
 */
export const infs1020: StudyGuide = {
  slug: 'infs1020',
  courseCode: 'INFS1020',
  courseName: 'Working in Digital Ecosystems',
  canvasCourseId: 75546,

  exam: {
    startsAt: '2026-11-25T17:00:00+11:00',
    arriveBy: '4:30 pm',
    durationMinutes: 130,
    readingMinutes: 10,
    weight: 40,
    mode: 'Written BYOD exam in Respondus LockDown Browser, sat in an exam venue',
    venue: 'Check your exam timetable',
    sections: [
      { name: 'Section 1: mini case study', questions: 3, points: 10, recommendedMinutes: 35 },
      { name: 'Section 2: mini case study', questions: 4, points: 20, recommendedMinutes: 50 },
      { name: 'Section 3: mini case study', questions: 3, points: 10, recommendedMinutes: 35 },
    ],
    conditions: [
      'Closed book. No notes, textbooks or websites.',
      'You may bring a physical bilingual dictionary. Online dictionaries are not allowed.',
      'One sheet of blank scratch paper is provided, and more on request.',
      'Laptop or computer only, not a phone or tablet. You need your Unikey, password and MFA app to log in.',
      'Do the BYOD practice quiz on the "Taking BYOD exams" Canvas site before the day. It tests your setup, not the INFS1020 format.',
    ],
  },

  expectations: [
    'Select, use and engage with appropriate and relevant concepts from INFS1020.',
    'Show critical thinking and the ability to reflect critically on what you studied this semester.',
    'Reason clearly and logically, with examples and evidence, and without logical inconsistencies or fallacies.',
    'Propose recommendations and strategies that are realistic, feasible and clearly defined.',
    'Write clearly.',
  ],

  notAsked: [
    'Technical details of large language models, such as how the transformer architecture works.',
    'The historical trajectory of any technology.',
    'A reference list or in-text citations.',
    'Specific software tools for your solutions.',
  ],

  advice: [
    {
      title: 'Understand the expectations',
      detail:
        'Each question asks you to either explain a concept or analyse a scenario and propose strategies. You are rewarded for using concepts and examples from the lectures and the mandatory readings and viewings.',
    },
    {
      title: 'Apply, do not recite',
      detail:
        'The lecturer frames the exam as "can you think critically and apply your knowledge?", not "can you remember the facts?". Tie every concept back to the scenario in the question.',
    },
    {
      title: 'Write like a job interview',
      detail: 'Professional without rambling, honest and direct, and showing that you know the material.',
    },
    {
      title: 'Timebox each section',
      detail:
        'The exam site recommends 35, 50 and 35 minutes. Section 2 is worth half the marks, so do not let Section 1 run over.',
    },
    {
      title: 'Underline the key terms',
      detail: 'Underline the frameworks, readings and key terms you use so the marker can follow your answer.',
    },
  ],

  frameworksHeading: 'Frameworks',
  examplesHeading: 'Examples to quote',
  topicsNote:
    'Each week is split the way the lecturer says to revise: concepts to explain, frameworks to apply, challenges to assess a situation with, and strategies to respond.',

  topics: [
    {
      week: 2,
      title: 'Literacy and knowledge',
      summary:
        'What digital literacy is, how organisations create knowledge, and how we judge whether knowledge is valid.',
      concepts: [
        {
          term: 'Literacy',
          definition:
            'Traditionally the ability to read and write. More widely, competence in a specified area. UNESCO (2024) describes it as identification, understanding, interpretation, creation and communication in an increasingly digital, information-rich and fast-changing world.',
        },
        {
          term: 'Digital literacy',
          definition:
            'The ability to search and navigate, create, communicate and collaborate, think critically, analyse information, and address safety and wellbeing using a variety of digital technologies (Australian Government draft framework, 2020). It needs technical, cognitive and social-emotional skills.',
        },
        {
          term: 'Technology literacy',
          definition:
            'The ability to use, manage and evaluate technology proficiently. It is narrower than digital literacy and sits inside it.',
        },
        {
          term: 'Explicit knowledge',
          definition: 'Everything that can be codified: put into text, figures, reports and files.',
        },
        {
          term: 'Tacit knowledge',
          definition: 'Knowledge embodied in the mind that cannot easily be written down, such as skills and intuition.',
        },
        {
          term: 'Paradigm shift',
          definition:
            'A major change that replaces the way we think about concepts and practices (Kuhn, 1962). Science moves from normal science, to a crisis as anomalies build up, to a scientific revolution where a new paradigm that solves those anomalies replaces the old one. Example: the Earth-centred universe giving way to the Sun-centred one.',
        },
      ],
      frameworks: [
        {
          name: 'SECI model of knowledge creation',
          source: 'Nonaka and Takeuchi (1995)',
          points: [
            'Socialisation (tacit to tacit): knowledge passes through shared experience, such as an apprentice watching and imitating a master.',
            'Externalisation (tacit to explicit): the person puts what they know into words, concepts or specifications. The reading calls this stage "articulation".',
            'Combination (explicit to explicit): separate pieces of written knowledge are combined into something new, such as a manual or a product design.',
            'Internalisation (explicit to tacit): people use the written knowledge until it becomes part of their own skill.',
            'Figurative language helps "express the inexpressible". It moves from metaphors, to analogies, to models.',
          ],
        },
        {
          name: 'DIKW pyramid',
          points: [
            'Data: raw records, such as individual sales transactions.',
            'Information: data given meaning, such as "the top category in Zone 24 was fruit and vegetables".',
            'Knowledge: patterns found in the information, such as "panic buying is driving sales at high prices".',
            'Wisdom: a judgement about what to do, such as "Australia needs more resilient agricultural supply chains".',
            'Measurement sits underneath the pyramid. The quality of the measurement decides the quality of the data.',
          ],
        },
        {
          name: 'Digital literacy frameworks',
          points: [
            'They give a common language for the areas of digital literacy and indicators for assessing skill level.',
            'Australian Digital Literacy Skills Framework (draft 2020): digital technologies and systems; connect, communicate and collaborate; create, organise, present and problem solve; digital identity and safety.',
            'European Commission DigComp 2.2 is the other example used in the lecture.',
            'Proficiency levels: foundation, intermediate, advanced, highly specialised. The test is whether you can use digital tools independently and guide others.',
          ],
        },
        {
          name: 'Validity of knowledge',
          points: [
            'Concept 1: we cannot be 100% sure of anything (Descartes: "I think therefore I am").',
            'Concept 2: we can be almost certain of some things on the basis of overwhelming evidence.',
            'Scientific method tests: replicability, precision, falsifiability and parsimony. Seeing one black swan disproves "all swans are white".',
            'Historical method tests: corroboration, eyewitness testimony and archaeological evidence.',
            'Concept 3: all knowledge is therefore provisional, and should change when the facts change.',
          ],
        },
      ],
      reading: {
        kind: 'reading',
        citation:
          'Nonaka, I., & Takeuchi, H. (2007). The knowledge-creating company. Harvard Business Review, 85(7), 162–171.',
        takeaways: [
          'From the reading: new knowledge starts with individuals, and the company\'s job is to make that personal knowledge available to everyone.',
          'From the reading: at Matsushita, a developer learned how to knead dough by apprenticing with a hotel baker (socialisation), turned that into product specifications (articulation), and the team built it into a home bread-making machine (combination).',
          'From the reading: Honda used the metaphor "Theory of Automobile Evolution" and Canon used a beer can as an analogy for a copier drum. These show metaphor and analogy turning tacit ideas into explicit ones.',
        ],
      },
    },
    {
      week: 3,
      title: 'Research and search',
      summary:
        'Why false information spreads, how people are persuaded, how arguments go wrong, and where to find credible sources.',
      concepts: [
        {
          term: 'Infodemic',
          definition:
            'Too much information, including false or misleading information, in digital and physical environments during a disease outbreak. It causes confusion and risk-taking that can harm health, builds mistrust in health authorities and undermines the public health response.',
        },
        {
          term: 'Misinformation',
          definition:
            'False information spread through ignorance, error or mistake, without the intent to deceive (Australian Electoral Commission).',
        },
        {
          term: 'Disinformation',
          definition:
            'Knowingly false information designed to deliberately mislead and influence public opinion or obscure the truth for malicious or deceptive purposes (Australian Electoral Commission). Inauthentic behaviour such as fake social media accounts is common.',
        },
        {
          term: 'Circular reporting',
          definition:
            'One source publishes a claim, a second republishes it, and the first then cites the second. The claim looks like it comes from several independent sources, so it seems credible. User-generated content is a common contributor.',
        },
        {
          term: 'Heuristics',
          definition: 'Mental shortcuts people use to judge information quickly instead of analysing it.',
        },
        {
          term: 'Logical fallacy',
          definition:
            'A mistake in an argument where the premises do not sufficiently support the conclusion. A factual error in a premise is not, by itself, a fallacy.',
        },
        {
          term: 'Structured vs unstructured querying',
          definition:
            'Unstructured querying is freeform web search with mixed quality results. Structured querying searches a database organised by metadata (data that describes other data), is usually specialist, and returns higher quality results.',
        },
      ],
      frameworks: [
        {
          name: 'Types of disinformation',
          source: 'Kapantai et al. (2021)',
          points: [
            'Fabricated: stories with no factual base, written in the style of news so readers believe them.',
            'Conspiracy theories: explain important events as secret plots by powerful people. Evidence against them is treated as more proof of the conspiracy.',
            'Hoaxes: large, complex fabrications presented as legitimate facts, also called half-truths.',
            'Rumours: stories whose truth is ambiguous or never confirmed.',
            'Trolling: deliberately posting offensive or inflammatory content to provoke readers or disrupt conversation.',
          ],
        },
        {
          name: 'Dimensions for identifying disinformation',
          source: 'Kapantai et al. (2021)',
          points: [
            'Motivation: financial, ideological or psychological.',
            'Facticity: the degree to which the content relies on facts.',
            'Verifiability: the extent to which the information can be verified.',
            'Content origin and genuineness.',
          ],
        },
        {
          name: 'Dual-process theory',
          source: 'Kahneman (2011)',
          points: [
            'System 1 is intuitive thinking: automatic and effortless.',
            'System 2 is deliberate thinking: effortful and needs conscious attention.',
          ],
        },
        {
          name: 'Elaboration Likelihood Model',
          source: 'Petty and Cacioppo (1986)',
          points: [
            'Central route: persuasion through careful consideration of the arguments. It uses logic and analysis and is mentally demanding.',
            'Peripheral route: persuasion through superficial cues instead of argument strength. It relies on heuristics, emotion and context, and is prone to bias and error.',
            'What decides the route: motivation (personal relevance, interest), ability (time, knowledge, cognitive capacity), message characteristics (complexity, clarity, emotion) and source characteristics (credibility, attractiveness).',
          ],
        },
        {
          name: 'Distortions and fallacies to watch for',
          points: [
            'Sampling bias, including survivorship bias: drawing conclusions only from the cases that made it through.',
            'Base rate fallacy: ignoring how large each group is. Example: "more vaccinated than unvaccinated people are in hospital, so the vaccine does not work".',
            'Spurious correlations: two things move together by coincidence.',
            'Post hoc ergo propter hoc: assuming that because B followed A, A caused B.',
            'Neglecting control variables: averages hide the bigger picture (Simpson\'s paradox).',
            'Misrepresentation or decontextualisation: the same stock looks different on a one-day chart and a one-year chart.',
          ],
        },
      ],
      challenges: [
        'Easy-to-read content is perceived as more believable because it takes less effort.',
        'More likes, comments and shares are read as a sign that content is popular and endorsed.',
        'Emotionally charged words trigger anger or fear and bypass critical reasoning.',
      ],
      strategies: [
        'Take the central route: hold yourself to a higher standard before believing or sharing.',
        'Ask for the citation, and check claims with fact-checking.',
        'Identify logical fallacies and distortions in the argument.',
        'Use structured, quality-controlled sources and credible journals (for example the FT50 list and the AIS Senior Scholars\' list) over general web search.',
      ],
      reading: {
        kind: 'reading',
        citation:
          'Kapantai, E., Christopoulou, A., Berberidis, C., & Peristeras, V. (2021). A systematic literature review on disinformation: Toward a unified taxonomical framework. New Media & Society, 23(5), 1301–1326.',
        takeaways: [
          'Guiding question: what terms are used for spreading inaccurate information?',
          'Guiding question: what are governments, organisations and academia doing to combat disinformation?',
          'Guiding question: what are the consequences of disinformation?',
          'Guiding question: what are the types and the dimensions of disinformation? (See the two frameworks above.)',
        ],
      },
    },
    {
      week: 4,
      title: 'Social media profile building',
      summary:
        'How social media works as a set of building blocks, how identity is built online, and how to plan a personal social media strategy.',
      concepts: [
        {
          term: 'Social media',
          definition:
            'Online platforms and applications that let users create, share and interact with content and each other.',
        },
        {
          term: 'Social networking',
          definition: 'A subset of social media focused on building and maintaining relationships.',
        },
        {
          term: 'Online communities',
          definition: 'Online spaces where people with shared interests, goals or backgrounds interact and collaborate.',
        },
        {
          term: 'Identity',
          definition:
            'The answer to "who am I?" and "what am I like?". People hold multiple identities across social contexts, cultural norms enable and constrain them, and people actively manage the impression they give (Goffman, 1963).',
        },
        {
          term: 'Small-world phenomenon',
          definition:
            'Six degrees of separation (Milgram, 1967): everyone is separated by about six other people. Social media can shorten this further.',
        },
        {
          term: 'Strength of weak ties',
          definition:
            'More distant relationships give access to new information and opportunities (Granovetter, 1973), and help people find new jobs (Rajkumar et al., 2022).',
        },
        {
          term: 'Enterprise social network (ESN)',
          definition:
            'A social network for internal use only, for connecting people at scale. It works like a market for information and ideas, not a tool for a predefined task (Mäntymäki & Riemer, 2016). Example: Microsoft Viva Engage.',
        },
        {
          term: 'Content production approaches',
          definition:
            'Content creation (making new content), content curation (gathering and resharing from trusted sources) and peer production (creating collaboratively in a self-organising community, such as Wikipedia).',
        },
        {
          term: 'Virtue signalling',
          definition:
            'Posting opinions or content you do not truly believe, such as support for a cause, to gain popularity or serve yourself.',
        },
        {
          term: 'Tone-deaf posts',
          definition:
            'Insensitive posts or advertising that harm the consumer\'s experience and the reputation of the person or company.',
        },
      ],
      frameworks: [
        {
          name: 'Seven functional building blocks of social media',
          source: 'Kietzmann et al. (2011)',
          points: ['Identity', 'Relationships', 'Conversations', 'Sharing', 'Presence', 'Reputation', 'Groups'],
        },
        {
          name: 'Identity construction on social media',
          source: 'Schultze (2015)',
          points: [
            'Discourses are built into social media technologies and shape which identities and actions are possible.',
            'Market: identity as producer and consumer.',
            'Play: identity is performative.',
            'Sociality: identity is defined by the social group you are part of.',
          ],
        },
        {
          name: 'Four types of capital',
          points: [
            'Economic capital: accumulated wealth that can generate more wealth.',
            'Social capital: accumulated perceptions of reciprocity and trustworthiness in a relationship or community (Putnam).',
            'Cultural capital: accumulated knowledge about your culture, which signals status (Bourdieu).',
            'Network capital: accumulated relationships that may open access to the other kinds of capital (Huggins).',
          ],
        },
        {
          name: 'Personal social media strategy',
          points: [
            'A strategy joins your understanding of the world with how you will use it to your benefit. It has a goal, and tactics or plans to reach it.',
            'Content consumption: how you read, view or listen to what others produce.',
            'Content production: creation, curation or peer production.',
            'Target audience: focused (a specific group, by demography, geography or behaviour) or general.',
            'Content factors: format, platform and device.',
          ],
        },
      ],
      challenges: [
        'ESN: privacy and security.',
        'ESN: adoption and training.',
        'ESN: integration with existing organisational systems and workflows.',
        'Personal brand: virtue signalling and tone-deaf posts damage reputation.',
      ],
      strategies: [
        'Build an authentic personal brand through self-reflection, authentic communication, self-promotion, awareness of risks and constant control of your digital footprint (Trang et al., 2023).',
        'Effective communication for remote teams is frequent, transparent, two-way, easy to navigate and consistent (Sull et al., 2020).',
        'Learn from influencers but adapt their strategies to your own case. Copying them as-is is not innovation.',
      ],
      reading: {
        kind: 'viewing',
        citation: 'Schultze, U. (2015). How social media shapes identity. TED talk.',
        takeaways: [
          'Identity is not only in people\'s minds. It also sits in the social context and in the technologies they use.',
          'The three discourses (market, play, sociality) each create a different reality and a different set of possible actions.',
        ],
      },
    },
    {
      week: 5,
      title: 'Social media implications and cybersecurity',
      summary:
        'How platform design and algorithms affect people and society, the common types of cyber attack, and how organisations build cyber resilience.',
      concepts: [
        {
          term: 'Algorithmic news feed',
          definition:
            'A feed curated by the platform instead of shown in time order. Facebook moved to this in 2009. Eli Pariser calls it "invisible algorithmic editing".',
        },
        {
          term: 'Filter bubble',
          definition:
            '"A unique universe of information for each of us" (Pariser, 2011). A state of intellectual isolation caused mainly by ranking and personalisation algorithms.',
        },
        {
          term: 'Echo chamber',
          definition:
            'A bounded, enclosed media space that can magnify the messages inside it and insulate them from rebuttal (Jamieson & Cappella, 2008). It can be a conscious choice, and the user has control over it.',
        },
        {
          term: 'Polarisation',
          definition:
            'Communities link to and discuss mostly their own side. Adamic and Glance (2005) found liberal and conservative blogs mostly linked within their own community.',
        },
        {
          term: 'Cyberbullying',
          definition:
            'An aggressive act carried out by electronic means, repeatedly and over time, against a victim who cannot easily defend themselves (Smith et al., 2008). It leads to stress, depression and anxiety.',
        },
        {
          term: 'Cyber attack',
          definition:
            'Any malicious activity that attempts to collect, disrupt, deny, degrade or destroy information system resources or the information itself (NIST). The Australian Cyber Security Centre adds that it is a deliberate act. A software bug or an accidental email is not an attack because there is no malicious intent.',
        },
        {
          term: 'Malware',
          definition:
            'Malicious software that breaches a network through a vulnerability. It can block access, monitor activity or send data to a third party (spyware).',
        },
        {
          term: 'Ransomware',
          definition:
            'A type of malware that locks or encrypts files and systems, or threatens to disclose data, until a ransom is paid. Its explicit goal is extortion.',
        },
        {
          term: 'Phishing (social engineering)',
          definition:
            'Attackers pretend to be a trusted source to trick people into giving up confidential information. Channels include email, SMS (smishing), phone (vishing), QR codes (qshing) and social apps. AI enables deepfake scams and automated scam generation.',
        },
        {
          term: 'Denial-of-service attack',
          definition: 'Flooding a system with traffic so it runs out of resources and cannot serve legitimate requests.',
        },
        {
          term: 'Man-in-the-middle attack',
          definition:
            'An attacker intercepts communication between two parties and reads or changes it without either knowing. Examples: email hijacking and IP spoofing.',
        },
        {
          term: 'Insider threat',
          definition:
            'A user with legitimate access who causes harm. They can be malicious, negligent or compromised.',
        },
        {
          term: 'Crown jewels',
          definition: 'The subset of assets that warrant specific protection from cybersecurity risks.',
        },
      ],
      frameworks: [
        {
          name: 'Addictive platform design elements',
          source: 'Bhargava and Velasquez (2020)',
          points: [
            'Intermittent variable rewards: pull-to-refresh works like a slot machine, because you do not know what you will get.',
            'Social validation and reciprocity: features such as the like button.',
            'Eroding natural stopping cues: infinite scroll removes the end of the page, which used to prompt a decision to stop.',
            'The motive is advertising: more time on screen means more ads shown.',
          ],
        },
        {
          name: 'Criteria for safer digital public spaces',
          source: 'Masullo, Wilner and Stroud (2022)',
          points: [
            'Welcome: invites participation, ensures safety, encourages humanisation, keeps information secure.',
            'Connect: cultivates belonging, builds bridges, strengthens local ties, makes power accessible.',
            'Understand: elevates shared concerns, shows reliable information, fosters civic competence, promotes thoughtful conversation.',
            'Act: boosts community resilience, supports civic action.',
          ],
        },
        {
          name: 'CIA triad',
          points: [
            'Confidentiality: keeping sensitive information private through access controls.',
            'Integrity: keeping data complete and accurate, and protected from corruption.',
            'Availability: being able to access information when it is needed.',
          ],
        },
        {
          name: 'Four elements of organisational resilience to cyber attack',
          source: 'Hepfer and Powell (2020)',
          points: [
            'Before, inside the company — protecting the business: design key business processes to minimise vulnerability. Do not focus only on IT infrastructure.',
            'Before, outside the company — broadening awareness: understand current threats and build a way to gather intelligence on them.',
            'After, inside the company — responding and recovering: know your capability to act, your business continuity plan, your crisis team and your weaknesses.',
            'After, outside the company — managing the consequences: plan for the effect on customers, suppliers, financial markets and reputation.',
          ],
        },
        {
          name: 'What an organisation is protecting',
          points: [
            'Business services, business processes, systems, data, people and vendors.',
            'Reasons to invest: protection of sensitive data, financial security, reputation management, regulatory compliance and business continuity.',
          ],
        },
      ],
      challenges: [
        'Filter bubbles and echo chambers reinforce existing views and remove exposure to contradicting ones.',
        'Platforms are designed to be addictive, and excessive internet use is treated as a public health concern.',
        'The global average cost of a data breach in 2025 was USD 4.4 million (IBM).',
      ],
      strategies: [
        'Cyberbullying: awareness and education about online ethics for young people and parents, the value of empathy, removing anonymity from online spaces, designing for digital publics, and counselling.',
        'Cybersecurity: treat it as a top-level strategic priority and build all four Hepfer and Powell capabilities.',
      ],
      examples: [
        'April 2025, Australian superannuation funds: credential stuffing with stolen login details. About $500,000 was stolen and thousands of members\' data was compromised.',
        'July 2025, Qantas: the group "Scattered Spider" used social engineering, phoning a contact centre to reset the password of a privileged account. About 6 million customers were affected.',
        'Optus data breach, 2022.',
      ],
      reading: {
        kind: 'reading',
        citation:
          'Datta, P., & Acton, T. (2025). Promises and perils of generative AI in cybersecurity. MIS Quarterly Executive, 24(2), 5.',
        takeaways: [
          'The lecture links this reading to the role of AI in new attacks, such as deepfake scams and automated scam generation.',
          'Re-read it for both sides: how generative AI helps defenders and how it helps attackers.',
        ],
      },
    },
    {
      week: 6,
      title: 'Agile methods',
      summary: 'What a project is, the traditional Waterfall approach, Scrum as the main agile method, and scaling agile.',
      concepts: [
        {
          term: 'Project',
          definition:
            'A temporary endeavour undertaken to create a unique product, service or result (PMBOK, 2013). Operations, by contrast, are ongoing "business as usual".',
        },
        {
          term: 'Scope creep',
          definition: 'Continuous or uncontrolled growth in project scope.',
        },
        {
          term: 'Requirement',
          definition:
            'A condition or capability that a system, product or service must meet. Requirements are functional (what the system does) or non-functional (speed, usability). They are catalogued in a Requirements Traceability Matrix.',
        },
        {
          term: 'Work Breakdown Structure',
          definition:
            'The work decomposed into smaller units, assigned to resources (usually people) and scheduled into a timeline, usually shown as a Gantt chart.',
        },
        {
          term: 'User story',
          definition:
            'A backlog item written from the user\'s side: "As a customer, I want to add items to a shopping cart, so that I can buy several items in one transaction."',
        },
        {
          term: 'Sprint',
          definition:
            'A timeboxed work period of 2–4 weeks. The length stays fixed for the whole project and requirements are frozen during the sprint. It ends with a potentially shippable product increment.',
        },
        {
          term: 'Kanban board',
          definition: 'A board with To do, Doing and Done columns that shows the state of the work.',
        },
      ],
      frameworks: [
        {
          name: 'Triple constraint',
          points: [
            'Scope: features and functionality.',
            'Time: scheduling and planning.',
            'Cost: resources and budget.',
            'Changing one puts pressure on the other two.',
          ],
        },
        {
          name: 'RACI matrix',
          points: [
            'Responsible: you do the work.',
            'Accountable: you make sure the work is done on time and to the right quality.',
            'Consulted: you are a subject matter expert or stakeholder whose view must be considered.',
            'Informed: you are kept up to date.',
          ],
        },
        {
          name: 'Waterfall model',
          points: [
            'Analysis: gather requirements from stakeholders into a comprehensive document.',
            'Design: create the blueprint for the project.',
            'Implementation: build according to the design.',
            'Testing: find and fix gaps between the output and the requirements.',
            'Maintenance: keep the result working and relevant.',
            'The steps are sequential, each hands its result to the next, and each is often done by a different team. Lecture example: the Sydney Harbour Bridge.',
          ],
        },
        {
          name: 'Scrum roles',
          points: [
            'Product owner: provides requirements, creates the product backlog of user stories, sets release dates, represents the customer and reviews the product at the sprint review.',
            'Scrum master: manages project activities, resolves bottlenecks, helps the team finish tasks and protects the team.',
            'The team: a self-organising, cross-functional group of 7 ± 2 people who create the sprint backlog, assign tasks among themselves and do the daily work.',
          ],
        },
        {
          name: 'Scrum process',
          points: [
            'Product backlog → sprint planning → sprint backlog → sprint → sprint review → sprint retrospective.',
            'Daily scrum: timeboxed to about 15 minutes, traditionally standing. Each person answers: what did you do yesterday, what will you do today, and is anything blocking you?',
          ],
        },
        {
          name: 'Scaled Agile Framework (SAFe)',
          points: [
            'A structured approach for managing large projects with many teams.',
            'It integrates the team level with the program and portfolio levels.',
          ],
        },
      ],
      challenges: [
        'Why projects fail: poor alignment with organisational vision, poor planning, poor communication, lack of resources, changing priorities or objectives, and poor change management.',
        'Why Waterfall struggles with knowledge work: digital products can be rearranged quickly, the process is no longer linear, and clients are not good at stating their needs ("that\'s what I said but not what I meant").',
      ],
      reading: {
        kind: 'reading',
        citation: 'Rigby, D. K., Sutherland, J., & Noble, A. (2018). Agile at scale. Harvard Business Review, 96(3), 88–96.',
        takeaways: [
          'From the reading: scaling agile means going from a few agile teams to hundreds, and leaders must decide which parts of the business should be agile and which should not.',
          'From the reading: leaders should work as an agile team themselves and roll agile out in sequenced steps, not all at once.',
          'From the reading: routine operations can stay in traditional structures. Agile suits innovation work where the problem is complex and the solution is unknown.',
        ],
      },
    },
    {
      week: 7,
      title: 'Digital productivity',
      summary: 'Lean thinking and its tools for organisations, and a model for managing your own productivity.',
      concepts: [
        {
          term: 'Lean',
          definition:
            'A way of designing a solution with fewer resources and less waste. It comes from Ford and Toyota manufacturing. Work in small batches to reduce risk.',
        },
        {
          term: 'Lean startup',
          definition:
            'Lean applied to technology companies (Ries, 2011). Treat every startup as an experiment, ask "should we build it?" instead of "can we build it?", and use the build–measure–learn feedback loop.',
        },
        {
          term: 'Minimum viable product (MVP)',
          definition:
            'A product with just enough features to satisfy early customers and gather feedback for future development. Example: the 2008 Airbnb website.',
        },
        {
          term: 'Pivot',
          definition:
            'A structured change to part of the business model, based on customer feedback, to test a new hypothesis. It is not a failure, and it stays within the larger vision.',
        },
        {
          term: 'A/B testing',
          definition:
            'Showing two versions of something to users at random and using statistical tests to decide which performs better. Also called split testing.',
        },
        {
          term: '5 Whys',
          definition: 'Asking "why" repeatedly, at least five times, to find the root cause of a problem.',
        },
        {
          term: 'Ishikawa (fishbone) diagram',
          definition:
            'A visual tool for root cause analysis that organises the possible causes of a problem in a system, process or product.',
        },
      ],
      frameworks: [
        {
          name: 'Lean software development principles',
          source: 'Poppendieck and Poppendieck (2003)',
          points: [
            'Eliminate waste',
            'Build quality in',
            'Create knowledge',
            'Defer commitment',
            'Deliver fast',
            'Respect people',
            'Optimise the whole',
          ],
        },
        {
          name: 'MoSCoW prioritisation',
          points: [
            'Must have: essential. Without it the project fails. This is the MVP.',
            'Should have: adds direct value but could be dropped to save the project.',
            'Could have: can be left out without much trouble.',
            'Won\'t have: out of scope for now, possibly a future extension.',
            'Lecture example, a law firm case-tracking website: registration and authentication are Must, email notifications Should, a custom theme Could, paid advertising Won\'t.',
          ],
        },
        {
          name: 'Business Model Canvas',
          source: 'Osterwalder and Pigneur (2010)',
          points: ['A strategic management tool for describing and designing business models.'],
        },
        {
          name: 'Controlling your attention',
          source: 'Nir Eyal (2019)',
          points: [
            'Master internal triggers.',
            'Make time for traction.',
            'Hack back external triggers.',
            'Prevent distractions with pacts.',
          ],
        },
        {
          name: 'Four-part productivity model',
          source: 'Schlagwein (2018)',
          points: [
            'Valuing — why am I here? Decide your values first. They guide the long term.',
            'Prioritising — which projects should I work on? Use the Eisenhower matrix and work on what is important, not only what is urgent.',
            'Structuring — how do I move projects to completion? Getting Things Done: capture, clarify, organise, review, engage.',
            'Working — what should I do right now? The Pomodoro technique for focus and against procrastination.',
          ],
        },
      ],
      reading: {
        kind: 'viewing',
        citation: 'Eyal, N. Indistractable: How to control your attention and choose your life. Talk.',
        takeaways: [
          'The four parts of the model above are the content to know.',
          'Link it to Week 5: platforms are designed to capture attention, and this is the individual\'s response.',
        ],
      },
    },
    {
      week: 8,
      title: 'Big data, analytics and artificial intelligence',
      summary:
        'What big data is, the four types of analytics, how the kinds of AI relate to each other, and how to implement AI responsibly.',
      concepts: [
        {
          term: 'Big data (the Vs)',
          definition:
            'Classically volume (petabytes), variety (unstructured and semi-structured) and velocity (new data in milliseconds). Some add veracity, value and variability.',
        },
        {
          term: 'Small vs big data',
          definition:
            'Small data has a specific goal, one location, high structure, the same people preparing and using it, and a limited life. Big data often has unexpected uses, many locations, little structure, different people preparing and using it, and is kept in perpetuity.',
        },
        {
          term: 'Artificial intelligence',
          definition:
            'There is no single accepted definition. Russell and Norvig (2022): computer systems that perceive their environment, learn from data or experience, reason, and act autonomously or semi-autonomously to achieve goals that normally need human intelligence.',
        },
        {
          term: 'Machine learning',
          definition:
            'A subset of AI that uses algorithms to detect patterns in large data sets so machines learn and adapt. Supervised learning trains on labelled data (classification, regression), unsupervised learning on unlabelled data (clustering), and reinforcement learning by acting and receiving feedback.',
        },
        {
          term: 'Deep learning',
          definition:
            'A subset of machine learning that uses neural networks with three or more layers. Nobody programs the rules. The network works them out from data.',
        },
        {
          term: 'Generative AI',
          definition:
            'AI that creates new content such as text, images, music or code by learning patterns from large amounts of existing data. Earlier AI classifies, predicts or recommends. Generative AI makes something that did not exist before.',
        },
        {
          term: 'Large language models and diffusion models',
          definition:
            'Large language models generate text and are trained on very large datasets from the internet. Diffusion models mainly generate images by learning to reverse added noise.',
        },
        {
          term: 'Agentic AI',
          definition:
            'Autonomous, decision-making systems that perform tasks and solve problems with minimal human intervention.',
        },
      ],
      frameworks: [
        {
          name: 'Four types of analytics',
          points: [
            'Descriptive: uses current and historical data to identify trends. What happened?',
            'Diagnostic: finds the causes of trends and correlations between variables. Why did it happen? Example: HelloFresh investigating a spike in fish recipe orders.',
            'Predictive: uses historical data to predict future trends and events. Example: supply chain forecasting.',
            'Prescriptive: recommends the best course of action. Examples: an algorithmic news feed and product recommendations.',
          ],
        },
        {
          name: 'How the kinds of AI nest',
          points: [
            'Artificial intelligence contains machine learning, which contains deep learning, which contains generative AI.',
            'Use this to answer "how does generative AI differ from AI before it?": earlier AI recognises patterns to classify, predict and recommend, while generative AI produces new content from a prompt.',
          ],
        },
        {
          name: 'AI ethics principles',
          source: 'CSIRO Data61 (Dawson et al., 2019)',
          points: [
            'Generate net benefits',
            'Do no harm',
            'Regulatory and legal compliance',
            'Privacy protection',
            'Fairness',
            'Transparency and explainability',
            'Contestability',
            'Accountability',
          ],
        },
        {
          name: 'AI explanation capability',
          source: 'Someh et al. (2022)',
          points: [
            'Decision tracing: an understandable link between a model\'s inputs and outputs. It answers model opacity and supports compliance.',
            'Bias remediation: revealing and fixing biases, unfairness, errors and flaws. It answers model drifting and supports representative models.',
            'Boundary setting: explaining a model\'s limits and the constraints on acting on its outputs. It answers mindless actions and supports safe application.',
            'Value formulation: explaining how model outcomes change decisions and processes, and how that produces value. It answers the unproven nature of AI.',
          ],
        },
      ],
      challenges: [
        'Model opacity: lack of clarity about how models work.',
        'Model drifting: models learn from their training data, so they are highly susceptible to technical and functional bias.',
        'Mindless actions: models make decisions without understanding their limits or the consequences.',
        'Unproven nature of AI: when, how and for whom AI creates value is unclear and short-lived, so it needs constant management.',
        'Fake personas: "Katie Jones", a LinkedIn profile with an AI-generated face, did not exist.',
      ],
      strategies: [
        'Include and engage the whole organisation in building AI explanation capability.',
        'Look beyond the AI team for the expertise needed.',
        'Document current practices for decision tracing, bias remediation, boundary setting and value formulation.',
        'Consolidate the capability in a central group that builds expertise over time and shares it at scale.',
      ],
      reading: {
        kind: 'reading',
        citation:
          'Someh, I., Wixom, B. H., Beath, C. M., & Zutavern, A. (2022). Building an artificial intelligence explanation capability. MIS Quarterly Executive, 21(2), 143–163.',
        takeaways: [
          'Know the four challenges and the dimension that answers each one.',
          'Know the four recommendations for building the capability.',
        ],
      },
    },
    {
      week: 9,
      title: 'Agentic AI and business applications',
      summary:
        'Guest lecture by Accenture: what AI agents are, how multi-agent systems are designed, and what organisations need in place to use AI well.',
      concepts: [
        {
          term: 'AI agent',
          definition:
            'A software program that uses AI to perceive its environment, create a plan and take actions. Agents are goal-oriented, reason and plan, have long-term memory and reflection, and can communicate.',
        },
        {
          term: 'Orchestrator agent',
          definition:
            'A high-level agent that coordinates other agents: it decomposes tasks, assigns work, tracks progress and summarises results.',
        },
        {
          term: 'Utility agent',
          definition: 'An agent that handles one specific, repeatable task, such as data retrieval.',
        },
        {
          term: 'Context window',
          definition:
            'Everything the AI has been given and has produced in a conversation. Too much context causes errors. The start and end carry the most weight ("lost in the middle"), which leads to hallucinations.',
        },
        {
          term: 'Human in the loop',
          definition: 'A person routes the hand-offs between agents and approves the final decision.',
        },
      ],
      frameworks: [
        {
          name: 'Traditional AI vs generative AI vs agentic AI',
          points: [
            'Role: traditional AI recognises patterns and automates routine tasks. Generative AI creates content from a prompt. Agentic AI interprets intent and acts autonomously.',
            'Autonomy: low and reactive, then medium and prompt-driven, then high, proactive and goal-oriented.',
            'Human oversight: high, then moderate, then low once deployed.',
            'Output: predefined responses, then drafted content such as emails and summaries, then actions, decisions and follow-ups.',
            'Limitations: traditional AI is narrow and inflexible. Generative AI may hallucinate or miss context. Agentic AI has complex governance and is at an early stage of maturity.',
          ],
        },
        {
          name: 'Designing a multi-agent system',
          points: [
            'Use one when a single outcome needs different kinds of work, such as analysis, planning and policy review, that can be handed from role to role.',
            'Start with the goal, then decide for each agent: what it should do, what information it can use, what it must not decide, and what it must hand on.',
            'Pros: stronger analysis, built-in validation, work at scale.',
            'Cons: more complexity, more hand-offs, more chances of inconsistent or duplicated work.',
            'Humans still own the decision. Agents analyse, draft and plan. People remain responsible for risk and final approval.',
          ],
        },
        {
          name: 'Accenture AI reinvention imperatives',
          points: [
            'Lead with value: prioritise use cases by value and complexity. High value and low complexity goes first.',
            'Secure the digital core: AI depends on connected, governed, trusted enterprise data.',
            'Reinvent talent and ways of working: the future workforce mixes human work, automation, generative AI co-pilots and autonomous agents.',
            'AI governance: design, deploy and use AI to create value while actively reducing risk.',
            'Drive continuous reinvention: AI is not "set and forget".',
          ],
        },
        {
          name: 'Responsible AI risk areas and controls',
          points: [
            'Fairness (biased or harmful outputs): human in the loop, clear accountability, content moderation.',
            'Transparency, explainability and accuracy (incomplete or unreliable outputs): quality scoring, audits and monitoring.',
            'Confidentiality, privacy and cybersecurity (breaches, fraud): data-leak and jailbreak protection, access protocols.',
            'Liability, compliance and sustainability (illegal or non-compliant outputs): legal review, intellectual property management, vendor assessment.',
          ],
        },
      ],
      examples: [
        'Project SafeShelf: a supermarket had 31 allergy reports across four salad batches and 36 hours to decide on a recall. One agent analysed the reports, one checked the plan against recall policy, and an orchestrator proposed the plan. New supplier data widened the recall from one batch to three, and a person approved the final decision.',
        'Bank case: an audit agent reviews website content against ACCC guidelines to flag possible greenwashing before it causes fines or reputational damage.',
      ],
    },
    {
      week: 10,
      title: 'Blockchain foundations',
      summary: 'Why blockchain exists, its five components, how smart contracts work, and where it can be applied.',
      concepts: [
        {
          term: 'The trust problem',
          definition:
            'How do you know your vote was counted, the fruit is organic, or the car was serviced? Ordinary databases can be tampered with, so we rely on intermediaries, which cost time and money and can breach trust.',
        },
        {
          term: 'Blockchain',
          definition:
            'A persistent, distributed, tamper-resistant, cryptographically secure database with no central authority. Once something is entered it stays there, and it is very hard to censor.',
        },
        {
          term: 'Distributed ledger',
          definition:
            'A database shared and synchronised by consensus across many sites. Every participant can hold an identical copy, and transactions have public "witnesses", which makes attacks harder.',
        },
        {
          term: 'Peer-to-peer model',
          definition:
            'Peers communicate directly with no central server, unlike the client–server model used by Facebook or Google. Without a central authority, consensus is needed.',
        },
        {
          term: 'Hash function',
          definition: 'A one-way cryptographic function: easy to compute and hard to reverse. SHA-256 is used in Bitcoin.',
        },
        {
          term: 'Immutability',
          definition: 'Blocks are append-only and each is linked to the next, so past records are hard to change.',
        },
        {
          term: 'Consensus mechanism',
          definition:
            'The way validator nodes agree that the data on the blockchain is valid, without a central authority. Validator nodes append and validate blocks. Non-validator nodes can only read blocks and propose transactions.',
        },
        {
          term: 'Smart contract',
          definition:
            'A computer protocol that runs on a blockchain and automatically executes the terms of an agreement when pre-programmed conditions are met, with no trusted third party. Humans write them, so errors are common.',
        },
      ],
      frameworks: [
        {
          name: 'Five components of blockchain',
          points: ['Distributed ledger', 'Cryptography', 'Immutability', 'Consensus mechanism', 'Smart contracts'],
        },
        {
          name: 'Types of blockchain network',
          source: 'Beck, Müller-Bloch and King (2018)',
          points: [
            'Public permissionless: anyone can read, submit and validate transactions.',
            'Public permissioned: anyone can read and submit, but only authorised agents can validate.',
            'Private permissioned: only authorised agents can read, submit and validate.',
          ],
        },
        {
          name: 'Framework for blockchain adoption',
          source: 'Iansiti and Lakhani (2017)',
          points: [
            'Two axes: degree of novelty, and amount of complexity and coordination.',
            'Single use (low novelty, low coordination): bitcoin payments.',
            'Localisation (high novelty, low coordination): private online ledgers for processing financial transactions.',
            'Substitution (low novelty, high coordination): retailer gift cards based on bitcoin.',
            'Transformation (high novelty, high coordination): self-executing smart contracts.',
          ],
        },
        {
          name: 'Traditional vs smart contract',
          points: [
            'A traditional contract is a lawful agreement entered into voluntarily by two or more parties.',
            'A smart contract is a protocol that facilitates, verifies or enforces the contract.',
            'Lecture example: Kickstarter is a centralised third party holding the money. A smart contract removes that third party.',
          ],
        },
      ],
      examples: [
        'Supply chain: transparency and traceability of goods from origin to destination.',
        'Finance: cheaper, faster cross-border transactions.',
        'Healthcare: protecting patient data while giving authorised users access.',
        'Also voting, identity verification, intellectual property, insurance claims, land registries and charity donations.',
      ],
      reading: {
        kind: 'reading',
        citation: 'Iansiti, M., & Lakhani, K. R. (2017). The truth about blockchain. Harvard Business Review, 95(1), 118–127.',
        takeaways: [
          'From the reading: blockchain is a foundational technology, not a disruptive one. It can create new foundations for economic and social systems, but adoption will be gradual and take years or decades.',
          'From the reading: the authors compare it to how TCP/IP was adopted, moving through the four quadrants of the framework above.',
        ],
      },
    },
    {
      week: 11,
      title: 'Blockchain implications',
      summary:
        'Cryptocurrency, NFTs and enterprise smart contracts in practice, and the benefits, challenges and risks of blockchain for business and society.',
      concepts: [
        {
          term: 'Cryptocurrency',
          definition:
            'Digital currency that uses cryptography for secure transactions. It solves the double-spending problem, where a digital token could be copied and spent more than once.',
        },
        {
          term: 'Mining',
          definition:
            'Creating cryptocurrency by completing blocks of verified transactions. Miners are rewarded with coins. It needs sophisticated hardware and a lot of computing power.',
        },
        {
          term: 'Exchanges and wallets',
          definition:
            'Exchanges are platforms for buying, selling and trading cryptocurrency. Wallets store and manage digital assets.',
        },
        {
          term: 'Non-fungible token (NFT)',
          definition:
            'A digital asset that represents ownership or proof of authenticity of a unique item. Each has a unique token ID, and smart contracts embed rules such as royalties. Ownership history can be traced (provenance).',
        },
        {
          term: '51% attack',
          definition: 'Whoever controls more than half of the hash power can take over the whole blockchain.',
        },
        {
          term: 'Private key loss or theft',
          definition: 'Whoever holds the private keys controls the assets, and lost keys cannot be recovered.',
        },
      ],
      frameworks: [
        {
          name: 'Banks vs decentralised systems',
          points: [
            'Centralisation: banks are trusted intermediaries. Cryptocurrency has no central authority and uses consensus among nodes.',
            'Ledgers: banks keep private ledgers. A blockchain is a public ledger that everyone can see but nobody can alter without consensus.',
            'Verification: banks use clearing houses between institutions. Nodes verify transactions by checking the blockchain.',
            'Trade-off: the central system brings delays, fees and possible account freezes. The decentralised system is faster across borders, cheaper and resists censorship.',
          ],
        },
        {
          name: 'Cryptocurrency: advantages and disadvantages',
          points: [
            'Advantages: no third party, transparency, security, lower transaction costs, financial inclusion, fast global transactions.',
            'Disadvantages: volatility, lack of regulation and consumer protection, irreversible transactions, technological barriers, security threats, environmental concerns (Bitcoin\'s electricity use).',
          ],
        },
        {
          name: 'NFTs: advantages and disadvantages',
          points: [
            'Advantages: digital ownership, provenance and authenticity, royalties for creators.',
            'Disadvantages: lack of regulation, environmental concerns, works only for digital ownership, potential fraud and counterfeits.',
          ],
        },
        {
          name: 'Business benefits of blockchain',
          points: [
            'Disintermediation: no need for a trusted third party.',
            'Control: less opportunistic behaviour and risk.',
            'Reconciliation: matching information between parties becomes cheaper.',
          ],
        },
        {
          name: 'Blockchain risk management',
          source: 'Santhana and Biswas (Deloitte, 2017)',
          points: [
            'Strategic: be a first mover or wait, choose the right network, and accept the limits of the chosen blockchain.',
            'Business continuity: processes built on blockchain can still fail, and they run faster, so incident response must be faster.',
            'Reputational: it must work with legacy infrastructure, and failures hurt client experience.',
            'Regulatory: requirements are uncertain and differ by use case, and cross-border privacy rules apply.',
            'Operational: existing policies and processes may not fit, and scalability is a concern.',
            'Security: 51% attacks and private key theft or loss.',
            'Supplier and contractual: reliance on external vendors, and service-level agreements between nodes and the network administrator.',
          ],
        },
      ],
      challenges: [
        'Business benefits can take years or decades to appear.',
        'Limited privacy, because transactions are publicly visible.',
        'Limited scalability and performance, because validating blocks is computationally expensive.',
        'Security threats.',
        'Difficulty preventing illegal activity, with possible reputation loss.',
      ],
      strategies: [
        'MediLedger: use a "benevolent dictator" and base governance on consensus through collaboration.',
        'MediLedger: store proof that transactions were verified on the ledger, not the transactions themselves.',
        'MediLedger: use zero-knowledge proofs to verify authenticity while keeping data private.',
        'MediLedger: use blockchain for what traditional technology cannot do, to fix ineffective information systems.',
        'Before adopting, ask whether you need a blockchain at all, and if so which type.',
      ],
      examples: [
        'MediLedger (Mattke et al., 2019): about 10% of global pharmaceuticals are counterfeit, and the US supply chain had no single system to track and verify drugs. MediLedger is a private permissioned Enterprise Ethereum blockchain using proof of authority. It gives a "single source of truth" and lets competitors work together without sharing business intelligence.',
        'Beeple\'s digital artwork sold as an NFT for $69 million. NFTs let artists earn from secondary sales.',
      ],
      reading: {
        kind: 'reading',
        citation:
          'Mattke, J., Hund, A., Maier, C., & Weitzel, T. (2019). How an enterprise blockchain application in the US pharmaceuticals supply chain is saving lives. MIS Quarterly Executive, 18(4).',
        takeaways: [
          'Guiding question: what problem is blockchain applied to? Counterfeit drugs and no shared verification system.',
          'Guiding question: what are the supply chain challenges? No interoperable system, slow paper-based verification, unwillingness to share sensitive data, frequent ownership changes and outdated manufacturer information.',
          'Guiding question: compare the two types of blockchain the project evaluated.',
          'Guiding question: what practices are recommended? See the MediLedger strategies above.',
        ],
      },
    },
    {
      week: 12,
      title: 'Digital ecosystems',
      summary:
        'How platforms and ecosystems differ, what makes ecosystems grow, and how digital work is changing.',
      concepts: [
        {
          term: 'Digital platform',
          definition:
            'A technology-enabled network of entities held together by a platform sponsor through formal contracting or mutual dependency to create joint value for consumers (Tan et al., 2022). The focus is the technological foundation. Examples: Uber, Amazon Marketplace.',
        },
        {
          term: 'Digital ecosystem',
          definition:
            'A technology-enabled community of individual, organisational and networked entities that contribute toward a focal value proposition (Tan et al., 2022). The focus is the business model. Example: Apple\'s ecosystem of iOS, the App Store, iCloud, developers and users.',
        },
        {
          term: 'Ecosystem structure',
          definition:
            'A set of actors with complementarities between them that is not fully hierarchically controlled (Jacobides et al., 2018).',
        },
        {
          term: 'Direct network effects',
          definition:
            'The benefit of a product increases with the number of other users of the same product. Examples: railroad and phone networks.',
        },
        {
          term: 'Indirect network effects',
          definition:
            'The benefit of a product increases with the number of compatible, complementary products. Examples: apps on iOS and Android, games on consoles.',
        },
        {
          term: 'Installed base and complementary goods',
          definition:
            'A large installed base attracts developers of complementary goods, and more complementary goods attract more users. The cycle reinforces itself (Schilling, 1999).',
        },
        {
          term: 'Openness',
          definition:
            'More open means more participants, and more participants means more opportunities for innovation. Forms include open standards and open source.',
        },
        {
          term: 'Dominant platform',
          definition:
            'Industries tend to settle on one or a few dominant designs. The winner is not always the best product but the best platform strategy, based on value proposition, complementarity and openness.',
        },
        {
          term: 'Digital Taylorism',
          definition:
            'Applying Taylor\'s rules with digital tools: break complex jobs into simple ones, measure everything workers do, and link pay to performance.',
        },
        {
          term: 'Human-in-the-loop work',
          definition:
            'Human work is not discontinued but repurposed to provide the ground truth that automation needs to keep learning (Grønsund & Aanestad, 2020).',
        },
        {
          term: 'Digital nomadism',
          definition:
            'A lifestyle that uses remote work to travel and live in varying, often affordable, locations (Eckhardt & Atanasova, 2024).',
        },
      ],
      frameworks: [
        {
          name: 'Digital partnering',
          source: 'Sebastian, Weill and Woerner (2020)',
          points: [
            'Principle 1, digital readiness: being distinctive, digitally organised and open.',
            'Principle 2, curation: joint goals, sharing benefits and sharing information.',
          ],
        },
        {
          name: 'Core capabilities for ecosystem growth',
          points: ['Analytics', 'Agile', 'Governance', 'Platforms', 'Talent', 'Partnership'],
        },
        {
          name: 'What digital technologies enable',
          points: [
            'Digital technologies are the building blocks of ecosystems, alongside users.',
            'They enable digital transformation: redesigned business processes, new business models and new customer experiences.',
            'The unit\'s technologies: social media, cybersecurity, big data and analytics, AI and blockchain.',
          ],
        },
      ],
      reading: {
        kind: 'reading',
        citation:
          'Sebastian, I. M., Weill, P., & Woerner, S. L. (2020). Driving growth in digital ecosystems. MIT Sloan Management Review.',
        takeaways: [
          'Guiding question: what are the two principles of digital partnering? Digital readiness and curation.',
          'Guiding question: what are the dimensions of each? See the framework above.',
        ],
      },
    },
  ],

  practiceNote:
    'The real exam has three questions, each with two to four sub-questions. There are no predetermined correct answers. Answers are marked on the depth and feasibility of the ideas and on logical, critical thinking, and must go beyond general statements.',

  practiceQuestions: [
    {
      title: 'Practice question 1: SECI model',
      parts: [
        'Explain the four stages of the SECI model (Socialisation, Externalisation, Combination, Internalisation). Provide examples to support your explanation.',
        'Considering the use of metaphors during the stages of SECI, do you think the SECI model works well in highly diverse organisations (organisations made up of people from different cultural backgrounds)? Justify your answer.',
      ],
      weeks: [2],
      drawOn: [
        'The four conversions between tacit and explicit knowledge, each with its own example.',
        'The role of figurative language: metaphors, then analogies, then models.',
        'For part (b), take a position and argue it. A metaphor only works if people share the background that gives it meaning, which is harder across cultures. Against that, diverse teams bring more tacit knowledge to share.',
      ],
    },
    {
      title: 'Practice question 2: MediHealth Clinic',
      scenario:
        'MediHealth Clinic wants to use AI tools that analyse clinical images to detect skin diseases such as melanoma early. You are a junior consultant assessing feasibility and ethics.',
      parts: [
        'How does Generative AI differ from other types of AI (AI before GenAI)? Provide examples to support your explanation.',
        'Propose two AI ideas that MediHealth Clinic can use in diagnosing dermatological diseases.',
        'Identify two potential risks associated with your proposed ideas.',
      ],
      weeks: [8, 9],
      drawOn: [
        'Earlier AI classifies, predicts and recommends. Generative AI creates new content.',
        'Supervised learning for image classification, and the four types of analytics.',
        'Risks: the four AI challenges (model opacity, model drifting, mindless actions, unproven value) and the CSIRO principles such as privacy, fairness and accountability.',
        'Controls: human in the loop, and decision tracing so a clinician can see why the model flagged an image.',
      ],
    },
    {
      title: 'Practice question 3: ConservWild',
      scenario:
        'ConservWild, a wildlife conservation nonprofit, is considering AI-driven drones and camera traps to monitor endangered species and prevent poaching. There are concerns about the effect on animal behaviour.',
      parts: [
        'How can you apply AI in monitoring endangered species? Propose two AI ideas.',
        'Discuss two ecological and ethical implications of implementing your AI ideas in wildlife conservation.',
        'Discuss two potential regulatory implications that may affect implementing your AI ideas.',
      ],
      weeks: [5, 8, 9],
      drawOn: [
        'Predictive and prescriptive analytics, image classification, and big data from sensors.',
        'CSIRO principles: generate net benefits, do no harm, privacy protection, regulatory and legal compliance.',
        'Cybersecurity: location data on endangered animals is a "crown jewel" that poachers would want, so confidentiality matters.',
        'Agentic AI: decide what the system must not decide alone, and keep a human responsible for the final call.',
      ],
    },
    {
      title: 'Practice question 4: Global Health Watch',
      scenario:
        'Global Health Watch, a public health nonprofit, has seen a sharp rise in health misinformation on social media that is harming public health responses. You are on a task force to analyse it and respond.',
      parts: [
        'Describe the difference between misinformation and disinformation. Provide examples to support your explanation.',
        'Discuss two potential implications of health-related misinformation on public behaviour.',
        'Propose two strategies that Global Health Watch can implement to combat misinformation effectively.',
      ],
      weeks: [3, 5],
      drawOn: [
        'The difference is intent to deceive.',
        'Infodemic effects: confusion, risk-taking that harms health, and mistrust in health authorities.',
        'Why it spreads: the peripheral route and heuristics (easy to read, lots of likes, emotional wording), plus filter bubbles and echo chambers.',
        'Strategies: help people take the central route, fact-checking and "citation needed", teaching people to spot fallacies, and the Kapantai types and dimensions for classifying what you find.',
      ],
    },
    {
      title: 'Practice question 5: Social media debates',
      parts: [
        'Outline two common controversies or debates discussed in relation to social media.',
        'For each issue, describe both sides of the controversy or debate and outline a fair summary of each side\'s perspective.',
        'Identify your own opinion or intellectual position and justify why you take that position.',
      ],
      weeks: [4, 5],
      drawOn: [
        'Addictive design (variable rewards, like buttons, infinite scroll) against the advertising business model that funds free platforms.',
        'Personalisation: relevant content against filter bubbles, echo chambers and polarisation.',
        'Removing anonymity to reduce cyberbullying against privacy and free expression.',
        'Personal branding: career benefit and weak ties against virtue signalling and inauthenticity.',
        'The Week 4 tutorial researched social media controversies. Revisit it.',
      ],
    },
    {
      title: 'Practice question 6: Blockchain debates',
      parts: [
        'Outline two common controversies or debates discussed in relation to blockchain.',
        'For each issue, describe both sides of the controversy or debate and outline a fair summary of each side\'s perspective.',
        'Identify your own opinion or intellectual position and justify why you take that position.',
      ],
      weeks: [10, 11],
      drawOn: [
        'Decentralisation: no intermediaries, lower cost and censorship resistance against lack of regulation and consumer protection.',
        'Security through mining against its environmental cost.',
        'Immutability and transparency against irreversible transactions and limited privacy.',
        'NFTs: digital ownership and creator royalties against fraud, counterfeits and no regulation.',
        'Long-term promise as a foundational technology against benefits that take years or decades.',
      ],
    },
  ],

  sources: [
    'INFS1020 Lecture Week 13: Unit review and exam preparation',
    'INFS1020 Final Exam – Practice Questions',
    'INFS1020 lecture slides, Weeks 2–12',
    '"Final Exam for: INFS1020" Canvas site',
  ],
};
