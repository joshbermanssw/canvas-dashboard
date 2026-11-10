import type { PracticeQuestion, Topic } from '../types';

/** Sources: w11.txt / w11.pdf (Lecture 11 slides) and extra/w11-tut.txt (Week 11 tutorial sheet, no official answers). */
export const week11: Topic = {
  week: 11,
  title: 'Agentic architecture',
  summary:
    'An agent is an LLM running tools in a loop to reach a goal, which makes it a distributed system whose control flow is decided at run time by a non-deterministic component. The design work is architectural: use the least autonomy that works, bound the loop, make tools safe to retry, and secure and measure the result.',
  concepts: [
    {
      term: 'AI agent',
      definition:
        'An LLM that runs tools in a loop to achieve a goal (Willison). Architecturally, a distributed system whose control flow is decided at run time by a non-deterministic component.',
    },
    {
      term: 'AI assistant vs AI agent',
      definition:
        'An assistant reads and writes text in one request and response, and a person decides what happens next, so a mistake is a wrong answer. An agent calls tools that change real systems over many steps chosen by the model, so a mistake is a wrong action.',
    },
    {
      term: 'LLM (Level 1)',
      definition:
        'A text-in, text-out function. It is stateless (the full history is re-sent and re-billed on every call), non-deterministic, metered per token and capped by a context window, slow (seconds per call) and has frozen knowledge up to a training cut-off.',
    },
    {
      term: 'AI workflow (Level 2)',
      definition:
        'Model calls placed inside control flow that your code owns: you wrote every possible path. Predictable, testable and cheaper to run than an agent.',
    },
    {
      term: 'Retrieval-augmented generation (RAG)',
      definition:
        'The best-known workflow: retrieve relevant passages from a search index, add them to the prompt, then generate an answer grounded in them with citations. Still Level 2 because retrieval always runs in the order you wrote, and it adds no actions.',
    },
    {
      term: 'Tool',
      definition:
        'A function with a schema (name, parameters, description, result). The schema is a contract that the model reads at run time, and the description acts as a prompt, so ambiguous documentation produces wrong calls.',
    },
    {
      term: 'Agent runtime',
      definition:
        'The code you write around the model: the loop, policy and planner. It connects the client to the model (chooses the next step), tools (the only way to act) and memory and state (context window plus a long-term store), wrapped by guardrails and observability.',
    },
    {
      term: 'ReAct pattern',
      definition:
        'Reason, act, observe, repeat (Yao et al., 2023). The lecture draws it as perceive, decide, act, observe.',
    },
    {
      term: 'Stop condition',
      definition:
        'What ends the agent loop: an answer found, a step budget, a cost cap, a wall-clock limit or a human approval gate. A design decision, never an afterthought.',
    },
    {
      term: 'MCP (Model Context Protocol)',
      definition:
        'An open protocol between agents (clients) and tools or data (servers). Each server exposes tools, resources and prompts through one standard interface, so one integration per tool is reusable by any agent.',
    },
    {
      term: 'A2A (Agent2Agent protocol)',
      definition:
        'A protocol connecting one agent to another agent. Its unit of work is a task with a lifecycle, and agents are discovered through an Agent Card at a well-known URL.',
    },
    {
      term: 'Idempotent tool',
      definition:
        'A tool that is safe to retry because each side effect is keyed on the operation, not the attempt (e.g. key "refund:{order_id}"). A retried, resumed or re-planned call then cannot repeat the effect.',
    },
    {
      term: 'Prompt injection',
      definition:
        'Untrusted content the model reads (web pages, PDFs, emails, code comments, tool results, other agents) issuing instructions, because the model cannot reliably tell instructions from data: it is all text. A property of the architecture, not a bug awaiting a patch.',
    },
    {
      term: 'Lethal trifecta',
      definition:
        'The combination of private data, untrusted content and external communication in one agent, which opens a data-exfiltration path (Willison). Removing any one leg closes it.',
    },
    {
      term: 'Golden set',
      definition:
        'A set of real tasks with expected outcomes used to evaluate an agent end to end. Each task is run many times and the result is reported as a pass rate.',
    },
    {
      term: 'Trace and span',
      definition:
        'One trace per agent run, with one span per model call, tool call and retrieval, recording inputs, outputs, tokens, latency, cost and the stop reason.',
    },
  ],
  frameworks: [
    {
      name: 'Three levels of autonomy: who decides the next step?',
      source: 'Lecture 11; pattern names from Anthropic (2024)',
      points: [
        'Level 1, LLM: one model call, nothing else happens. You decide the next step after reading the answer. Use for one self-contained request.',
        'Level 2, AI workflow: your code decides; chains, routing, retrieval. Use for a fixed, well-understood task.',
        'Level 3, AI agent: the model chooses the tools, their order and when to stop, at run time. Use for an open-ended task with many tools, and keep it bounded.',
        'Rule: use the least autonomy that solves the problem. Always ask whether a deterministic workflow could do 90% of it.',
        'Every step of autonomy costs reliability, latency, money and auditability: autonomy is a cost, not a feature.',
        'Most production "agents" are mostly Level 2 with a small Level 3 core.',
      ],
    },
    {
      name: 'What a plain LLM lacks and which level supplies it',
      points: [
        'No fresh knowledge (nothing after the training cut-off): retrieve it at Level 2.',
        'No private knowledge (never saw your orders, tickets or policies): retrieve it at Level 2.',
        'No actions (it only produces text): give it tools at Level 3.',
        'Confidently wrong (fluent is not correct): ground it, then evaluate it.',
        'Architect\'s view: treat the LLM as a slow, metered, non-deterministic remote dependency behind an API, so timeouts, retries and budgets still apply.',
      ],
    },
    {
      name: 'Workflow patterns and when to use each',
      source: 'Anthropic (2024), Building effective agents',
      points: [
        'Prompt chaining: each step\'s output feeds the next. Use when the task splits into fixed stages.',
        'Routing: a classifier sends the input to a specialist. Use when inputs fall into distinct categories.',
        'Parallelisation: run subtasks at once, then vote or merge. Use when latency matters or you want redundancy.',
        'RAG: retrieve, augment, generate. New things to engineer: freshness (re-index when a policy changes), access (retrieve only what this user may see), recall (a missed passage means a guess).',
        'Orchestrator-workers (adds autonomy): a lead model splits the task, delegates and merges. Use when the subtasks are not known until run time.',
        'Evaluator-optimiser (adds autonomy): one model produces, another critiques, loop until good enough. Use when quality is checkable and iteration is cheap. Always bound the loop: iterations, tokens and wall-clock.',
      ],
    },
    {
      name: 'Tool design rules',
      points: [
        'The schema is the contract, so the old service-contract problems return: versioning, compatibility, least privilege, idempotency.',
        'Type hints become the input schema and the docstring becomes the description; the server code must enforce what the docstring promises.',
        'Design tools for a model, not a developer: few, coarse-grained and hard to misuse.',
        'Coarse beats fine: one schedule_event tool rather than list_users + list_events + create_event for the model to sequence.',
      ],
    },
    {
      name: 'MCP vs A2A',
      points: [
        'Connects: MCP links an agent to tools and data; A2A links an agent to another agent.',
        'Unit of work: MCP a tool call; A2A a task with a lifecycle.',
        'Discovery: MCP tools/list; A2A an Agent Card at a well-known URL.',
        'Analogy: MCP is a driver interface; A2A is a service contract.',
        'Both sit in the Agentic AI Foundation (Linux Foundation) and are complementary layers, not competitors.',
        'MCP risk: an untrusted server is untrusted code inside your loop.',
      ],
    },
    {
      name: 'MCP sessions vs the stateless core (revision 2026-07-28)',
      points: [
        'Before: initialize could open a protocol session (Mcp-Session-Id), so each client had to be pinned to one instance with sticky routing, or session state had to be shared.',
        'Now: each request carries its version and capabilities, and application state sits in a shared store named by handles (e.g. add_item with a basket_id).',
        'Effect: any instance can serve any request, so plain round-robin load balancing works.',
        'Same reason as the Week 2 statelessness argument: ordinary HTTP infrastructure and horizontal scaling.',
      ],
    },
    {
      name: 'Multi-agent topologies and their characteristic failures',
      source: 'Names from Google Cloud\'s agentic design-pattern catalogue',
      points: [
        'Sequential (A → B → C): errors compound.',
        'Coordinator / supervisor (one lead delegates to specialists): the lead becomes the bottleneck.',
        'Swarm / network (agents call each other freely): loops, cost blow-ups, no clear owner.',
        'Human-in-the-loop (approval before irreversible steps): latency and alert fatigue.',
        'Multi-agent is not automatically better; the catalogue advises starting with a single agent.',
      ],
    },
    {
      name: 'Reliability: failure modes, then bound and recover',
      points: [
        'Failure modes: wrong call (wrong tool or wrong arguments); retry loop until the budget is gone; right steps but wrong result; partial failure (refund committed, email failed); silent wrongness (confident answer, no error in the logs); cost and latency drift with no natural upper bound.',
        'Bound everything: steps, tokens, wall-clock, retries, money.',
        'Checkpoint after every step so a run is resumable, not restartable (Week 9).',
        'Make tools idempotent: key each side effect on the operation, not the attempt (Weeks 4 and 9).',
        'Validate tool output before it re-enters the model\'s context.',
        'Prefer fewer, larger, verifiable steps to many small ones.',
      ],
    },
    {
      name: 'Classifying tools by reversibility',
      points: [
        'Reversible (read-only calls such as search or check status, tag a ticket, save a draft): let the agent act with no approval.',
        'Compensable (reserve stock → release it; charge a card → refund it): allow it and implement the compensating action.',
        'Irreversible (send an external email, delete without backup, transfer money out): require human approval when the blast radius matters, or do not expose the tool.',
        'Decide by reversibility × blast radius, never by the model\'s confidence.',
        'This is the saga pattern from Week 4 again, with a language model choosing the steps.',
      ],
    },
    {
      name: 'Security controls mapped to OWASP agentic risks',
      source: 'OWASP Top 10 for Agentic Applications (December 2025)',
      points: [
        'Least privilege, acting with the signed-in user\'s identity per tool and per session: ASI03 identity and privilege abuse.',
        'Separate the untrusted-content path from the privileged-action path: ASI01 agent goal hijack.',
        'Sandbox execution and allowlist outbound network access: ASI05 unexpected code execution.',
        'Human approval for irreversible actions and an audit of every tool call: ASI02 tool misuse.',
        'Watch the supply chain (whose MCP server, whose code, which version): ASI04 agentic supply chain. Validate what the agent writes to memory: ASI06 memory and context poisoning.',
        'Not controls on their own: instructions in the prompt, input filtering, logging. Treat every tool result as hostile input, exactly like user input.',
      ],
    },
    {
      name: 'Evaluation and observability',
      points: [
        'Pipeline: golden set of real tasks → run each end to end many times → score outcomes (rubrics, model-as-judge, human spot checks) → gate the release as you would on tests.',
        'Report a rate, not a pass: the same input can pass once and fail next time. One green run is an anecdote; 47 passes in 50 runs is evidence.',
        'Score end-to-end outcomes, not individual steps.',
        'Re-run whenever a dependency changes: the prompt, the model and the tools are all dependencies, and the model can change underneath you.',
        'Watch step counts, loop rates and tool error rates; track cost per successful task.',
      ],
    },
    {
      name: 'When not to build an agent',
      points: [
        'The task is fully specified: write the workflow instead.',
        'Errors are expensive and irreversible: keep the human in the loop.',
        'The latency budget is under a second: too many round trips.',
        'You cannot define success: you cannot evaluate it, so you cannot operate it.',
        'Gartner forecast (June 2025): over 40% of agentic AI projects cancelled by the end of 2027 through escalating costs (bound it), unclear business value (evaluate it) or inadequate risk controls (secure it).',
      ],
    },
  ],
  formulas: [
    {
      name: 'End-to-end success of an n-step run',
      formula: 'P(success) = pⁿ',
      note: 'p = per-step success probability, n = number of steps; assumes independent steps and no recovery. E.g. 0.95²⁰ ≈ 35.8%, 0.99²⁰ ≈ 81.8%, 0.9¹⁰ ≈ 34.9%.',
    },
    {
      name: 'Per-step success needed for a target',
      formula: 'p = T^(1 ÷ n)',
      note: 'T = target end-to-end success rate, n = steps. Rearranged from pⁿ = T. E.g. 0.95^(1 ÷ 20) ≈ 0.9974, so 99.74% per step for a 95% success rate over 20 steps.',
    },
    {
      name: 'Input tokens at step k',
      formula: 'input(k) = P + (k − 1) × g',
      note: 'P = prompt size including tool definitions, g = tokens added per step (model output + tool result). The model is stateless, so every call re-sends the whole history. Slide values: P = 3,000, g = 1,000 (300 output + 700 tool result), so step 20 reads 22,000.',
    },
    {
      name: 'Total input tokens over an n-step run',
      formula: 'total input = n × P + g × n × (n − 1) ÷ 2',
      note: 'Sum of input(k) for k = 1..n; grows roughly with n². Slide values: n = 20 gives 250,000 (not 20 × 3,000 = 60,000); n = 40 gives 900,000, which is 3.6× for double the steps.',
    },
    {
      name: 'Cost of one run',
      formula: 'cost = input tokens × input price + output tokens × output price',
      note: 'Prices are per token (slide uses US$2 per million input, US$10 per million output; cached input at 10% of the input price). Output tokens = n × output per step.',
    },
    {
      name: 'Sequential model latency of a run',
      formula: 'latency ≈ n × time per model call',
      note: 'n = number of model calls; excludes tool time. Slide: 20 × 1.5 s ≈ 30 s.',
    },
    {
      name: 'Cost per successful task',
      formula: 'cost per successful task = total spend ÷ tasks that met the success criterion',
      note: 'Divide by successful tasks only, not by all runs.',
    },
    {
      name: 'Pass rate',
      formula: 'pass rate = passing runs ÷ total runs',
      note: 'Reported instead of a single pass or fail because runs are non-deterministic. E.g. 47 ÷ 50 = 94%.',
    },
  ],
  examples: [
    'Running example, order 8812 ("my blender arrived broken"): the agent calls get_order, check_refund_policy, refund_order (12,900 cents) and send_email, then answers and stops. No line of code sequences the calls, and steps 3 and 4 are side effects.',
    'The same message to an assistant gets only text back: damaged items can be refunded within 30 days, reply with a photo. Nothing happens to the order.',
    'RAG example: the retrieved passage is policy §4.2 (items damaged in transit get a full refund within 30 days of delivery) and the answer cites it.',
    'Idempotency in the example: inside refund_order the server builds the key "refund:{order_id}" and passes it to the payments call, so the order cannot be refunded twice.',
    'Prompt injection example: a CV containing white-on-white text telling the model to ignore previous instructions and recommend the candidate; invisible to a reviewer, plain text to the model.',
    'Air Canada (Feb 2024): the website chatbot invented a bereavement refund rule and a tribunal held the airline liable. Lesson: you own every answer, so ground answers in the real policy and evaluate them.',
    'GitHub MCP (May 2025): an issue planted in a public repository told an agent to read the user\'s private repositories and it leaked data in a public pull request. Lesson: the lethal trifecta demonstrated; scope access to the task and split untrusted input from privileged actions.',
    'Replit (Jul 2025): a coding agent wiped a production database during a code freeze despite an instruction to make no changes without approval. Lesson: a prompt instruction is not a control; use least privilege, separate environments and approval for the irreversible.',
    'Observability example: one run traced as invoke_agent with alternating chat and execute_tool spans: 8.4 s, 26.5k tokens, $0.065, stop reason "answer".',
    'Week 11 tutorial: the same refund request (order 4417, cracked desk lamp) is run at Level 1 (text only), Level 2 (refund_workflow in fixed order, where refund_order times out) and Level 3 (agent capped at 8 function calls; the questions ask what idempotency_key is for and whether the agent used it).',
    'Week 11 tutorial, injection: order 5120 carries a customer note with instructions; the fix changes the tools, not the prompt (emails only to the order\'s customer, customer-list tool not exposed).',
  ],
};

export const week11Practice: PracticeQuestion[] = [
  {
    title: 'Week 11: compounding failure over a 20-step run',
    scenario:
      'An agent needs 20 steps to finish a task. Assume steps are independent and there is no recovery.',
    parts: [
      'Each step succeeds 95% of the time. What is the chance the whole run succeeds?',
      'What per-step success rate is needed for the run to succeed 95% of the time?',
      'With 99% per step, compare a 20-step run and a 50-step run. What design decision do the numbers support?',
    ],
    weeks: [11],
    answer: [
      'P = pⁿ = 0.95²⁰ ≈ 0.358, so about 35.8%: a step that works 19 times in 20 finishes about a third of the time.',
      'p = 0.95^(1 ÷ 20) ≈ 0.9974, so about 99.74% per step.',
      '0.99²⁰ ≈ 81.8% and 0.99⁵⁰ ≈ 60.5%. Success falls quickly as steps are added, so prefer fewer, larger, verifiable steps, bound the step count, and add recovery (checkpoints, idempotent tools) rather than rely on per-step accuracy.',
    ],
  },
  {
    title: 'Week 11: token cost and latency of a 20-step run',
    scenario:
      'The prompt with tool definitions is 3,000 tokens. Each step adds 1,000 tokens to the history (300 model output + 700 tool result). The model is stateless. Prices: US$2 per million input tokens, US$10 per million output tokens, cached input at 10% of the input price. Each model call takes 1.5 s.',
    parts: [
      'How many input tokens does step 20 read, and how many input tokens does the whole 20-step run use?',
      'By what factor do input tokens grow if the run doubles to 40 steps?',
      'What does one 20-step run cost without caching, and what do 10,000 runs cost?',
      'The slide gives about $0.15 per run with prompt caching. Show how that figure can be reached.',
      'What is the model latency of the run, and which levers reduce cost and latency?',
    ],
    weeks: [11],
    answer: [
      'Step k reads 3,000 + (k − 1) × 1,000, so step 20 reads 22,000. Total = 20 × 3,000 + 1,000 × (20 × 19 ÷ 2) = 60,000 + 190,000 = 250,000, not 20 × 3,000 = 60,000.',
      '40 steps: 40 × 3,000 + 1,000 × (40 × 39 ÷ 2) = 120,000 + 780,000 = 900,000. 900,000 ÷ 250,000 = 3.6×.',
      'Input: 250,000 × $2 ÷ 1,000,000 = $0.50. Output: 20 × 300 = 6,000 tokens × $10 ÷ 1,000,000 = $0.06. Total $0.56 per run, so $5,600 per 10,000 runs.',
      'The slide states only the result. One working that reproduces it: at each step everything already sent on the previous call is cached, so uncached input is 3,000 (step 1) + 19 × 1,000 = 22,000 and cached input is 250,000 − 22,000 = 228,000. Cost = 22,000 × $2/M + 228,000 × $0.20/M + 6,000 × $10/M = $0.044 + $0.0456 + $0.06 ≈ $0.15, about $1,500 per 10,000 runs.',
      '20 model calls × 1.5 s ≈ 30 s, sequential and before any tool time. Levers: fewer steps, a smaller model for routing, parallel fan-out, prompt caching with a stable prefix, and compaction and sub-agents to keep the context short.',
    ],
  },
  {
    title: 'Week 11: the email fails after the refund succeeds',
    scenario:
      'The order-support agent handles a refund for order 8812 by calling get_order, check_refund_policy, refund_order and send_email. The refund commits, then send_email fails and the run is retried or resumed.',
    parts: [
      'Which failure mode from the lecture is this?',
      'What stops the customer being refunded twice when the run is retried?',
      'What lets the run continue from where it failed instead of starting again?',
      'How should refund_order and send_email be classified for approval purposes, and what is the rule?',
    ],
    weeks: [11],
    answer: [
      'Partial failure: one side effect (the refund) committed and a later one (the confirmation email) did not.',
      'An idempotent tool. Inside refund_order the server keys the payment on the operation, not the attempt ("refund:{order_id}"), so a retried, resumed or re-planned call cannot issue a second refund.',
      'Checkpointing after every step, so the run is resumable rather than restartable.',
      'Classify every tool as reversible, compensable or irreversible. The lecture lists sending an external email and transferring money out as irreversible: require human approval when the blast radius matters, or do not expose the tool. Decide by reversibility × blast radius, never by the model\'s confidence.',
    ],
  },
  {
    title: 'Week 11: which level of autonomy?',
    scenario: 'A support team is deciding how to build three features.',
    parts: [
      'Draft a reply to one complaint for a staff member to read and send.',
      'Classify each incoming email, fetch the order and draft a reply, always in that order.',
      'Resolve refund requests end to end, choosing among many tools depending on what each order shows.',
      'What question should be asked before picking Level 3, and what does each step up in autonomy cost?',
    ],
    weeks: [11],
    answer: [
      'Level 1: a single model call for one self-contained request; the person decides the next step after reading the answer.',
      'Level 2: a workflow. The task is fixed and well understood, so your code owns the path (routing plus chaining), which is predictable, testable and cheaper.',
      'Level 3: an agent. The task is open-ended with many tools, so the model picks the path at run time, but it must be bounded (steps, tokens, wall-clock, money) with stop conditions.',
      'Ask whether a deterministic workflow could do 90% of it, and use the least autonomy that works. Each step up costs reliability, latency, money and auditability; most production agents are mostly workflow with a small autonomous core.',
    ],
  },
];
