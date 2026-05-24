# 🤖 agents-intro — Multi-Agent CLI Assistant

> Built with the **OpenAI Agents SDK** (JS/TS) · Router + 3 Specialist Agents · Tools · Handoffs · Guardrails

---

## 📑 Table of Contents

1. [Setup Instructions](#-setup-instructions)
2. [How to Run](#-how-to-run)
3. [Project Structure](#-project-structure)
4. [Agent Roles](#-agent-roles)
5. [Tools](#-tools)
6. [Handoff Flow](#-handoff-flow)
7. [Guardrails](#-guardrails)
8. [Tracing & Observability](#-tracing--observability)
9. [Notes — Agentic AI Theory](#-notes--agentic-ai-theory)
10. [LLM Configuration Levels](#-llm-configuration-levels)
11. [Prompt-Based vs Agent-Based Systems](#-prompt-based-llm-usage-vs-agent-based-systems)

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js **18 or later**
- An API key from **OpenAI** or **Google AI Studio** (Gemini via OpenAI-compatible endpoint)

### 1. Clone / Navigate to the project

```bash
cd agents-intro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your key:

```bash
cp .env.example .env
```

Then open `.env` and choose **one** of the three options:

# ── Option A: Use Gemini via OpenAI-compatible API ─────────────────────────────
# GEMINI_API_KEY=your-gemini-api-key-here
# OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
# MODEL_NAME=gemini-2.0-flash

# ── Option B: Use OpenRouter (Gemini via OpenRouter) ──────────────────────────
GEMINI_API_KEY=your-openrouter-key-here
OPENAI_BASE_URL=https://openrouter.ai/api/v1
MODEL_NAME=google/gemini-2.0-flash-001

# ── Option C: Use OpenAI directly ────────────────────────────────────────────
# OPENAI_API_KEY=your-openai-api-key-here
# MODEL_NAME=gpt-4o-mini

> **Where to get keys:**
> - Gemini: [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
> - OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## ▶️ How to Run

### Hello World (Part 2 — SDK Verification)

Runs a single-agent demo to confirm the SDK is installed and the API key works:

```bash
npm run hello
```

Expected output:

```
🔑  Using Gemini via OpenAI-compatible API
🤖  Model: gemini-2.0-flash

▶  Running "Assistant" agent...

✅  Agent response:
──────────────────────────────────────────────────
Hello! I'm Assistant, a helpful AI designed to
assist you with questions and tasks. How can I
help you today?
──────────────────────────────────────────────────

👋  Hello World demo complete!
```

### Multi-Agent CLI (Part 3 — Main Project)

```bash
npm run start
# or
npm run dev
```

Type your questions at the `You:` prompt. Examples to try:

```
You: What is 15% of 847?
You: Write a Python function to reverse a linked list
You: Explain the French Revolution in 3 bullets
You: Count the words in "The quick brown fox jumps over the lazy dog"
You: tell me a joke        ← blocked by guardrail
```

### CLI Commands (runtime)

| Command      | Effect                          |
|--------------|---------------------------------|
| `:trace on`  | Enable tracing output           |
| `:trace off` | Disable tracing output          |
| `:agents`    | List all available agents       |
| `:help`      | Show help banner                |
| `exit`/`quit`| Stop the CLI                    |

### Build (TypeScript → JavaScript)

```bash
npm run build
node dist/index.js
```

---

## 📁 Project Structure

```
agents-intro/
├── src/
│   ├── config.ts                   # Global SDK bootstrap (API key, model, tracing)
│   ├── hello-world.ts              # Part 2: Hello World agent demo
│   ├── index.ts                    # Part 3: Main CLI REPL entry point
│   │
│   ├── agents/
│   │   ├── routerAgent.ts          # Entry-point agent — routes via handoffs
│   │   ├── mathAgent.ts            # Math specialist — uses calculator tool
│   │   ├── programmingAgent.ts     # Programming specialist — uses formatter + counter tools
│   │   └── generalAgent.ts         # General Q&A — uses word_counter tool
│   │
│   ├── tools/
│   │   ├── calculatorTool.ts       # Real math evaluator (sandboxed, no eval)
│   │   ├── wordCounterTool.ts      # Text analyser (word/char/sentence count)
│   │   └── codeFormatterTool.ts    # Code formatter + language detector
│   │
│   └── guardrails/
│       └── inputGuardrail.ts       # Content safety + off-topic guard
│
├── .env                            # Your API keys (git-ignored)
├── .env.example                    # Template
├── tsconfig.json                   # TypeScript config
├── package.json
└── README.md
```

---

## 🕹️ Agent Roles

### 1. Router Agent (`src/agents/routerAgent.ts`)

**Role:** Entry point and traffic controller.

- **Never answers questions directly** — this is a hard rule enforced in its instructions.
- Reads the user's intent and immediately **hands off** to the correct specialist.
- Carries the **content-safety `InputGuardrail`** — only the first/entry agent runs input guardrails.
- Routing logic:
  - Maths/numbers/equations → **Math Agent**
  - Code/algorithms/debugging → **Programming Agent**
  - Facts/science/history/explanations → **General Q&A Agent**

### 2. Math Agent (`src/agents/mathAgent.ts`)

**Role:** Mathematics specialist.

- Handles arithmetic, algebra, geometry, trigonometry, calculus, statistics, probability.
- **Must call the `calculator` tool** for every numeric computation — never guesses results.
- Provides step-by-step working with clear final answers.
- Scope boundary: does **not** answer programming or general knowledge questions.

### 3. Programming Agent (`src/agents/programmingAgent.ts`)

**Role:** Software engineering specialist.

- Writes, explains, and debugs code in any programming language.
- **Must call the `code_formatter` tool** before presenting any code — ensures clean output.
- Uses `word_counter` tool when asked to analyse code or text length.
- Explains algorithms with time/space complexity.
- Scope boundary: does **not** answer pure maths or general knowledge questions.

### 4. General Q&A Agent (`src/agents/generalAgent.ts`)

**Role:** Factual knowledge and explanations.

- Answers science, history, geography, language, grammar, and conceptual questions.
- Summarises text when asked.
- Uses `word_counter` tool when asked to count or analyse text.
- Scope boundary: does **not** perform calculations or write code.

---

## 🔧 Tools

All tools are **real implementations** — no fake results, no hardcoded answers.

### `calculator` (used by Math Agent)

```typescript
// Expression → real numeric result via sandboxed Function constructor
calculator({ expression: "(15 / 100) * 847" })
// → "The result of `(15 / 100) * 847` is **127.05**"
```

- Supports: `+`, `-`, `*`, `/`, `**`, `%`, `Math.*` functions, parentheses
- Uses a whitelist-sanitised `new Function('Math', ...)` — no unsafe `eval()`

### `word_counter` (used by Programming + General agents)

```typescript
word_counter({ text: "The quick brown fox..." })
// → "Words: 9 | Characters: 45 | Sentences: 1 | Top words: ..."
```

- Returns: word count, character count (with/without spaces), sentence count, average word length, top-5 most frequent words (excluding stop-words)

### `code_formatter` (used by Programming Agent)

```typescript
code_formatter({ code: "def foo():\n\treturn 42" })
// → "```python\ndef foo():\n  return 42\n```  (python · 2 lines · ~4 tokens)"
```

- Auto-detects language (Python, JS/TS, Java, C++, HTML, JSON, SQL, Rust, Go)
- Normalises indentation (tabs → 2 spaces)
- Strips trailing whitespace
- Reports line count and token estimate

---

## 🔀 Handoff Flow

```
User Input
    │
    ▼
┌─────────────────────────────────────────┐
│          Router Agent                   │
│  • Reads intent                         │
│  • Runs InputGuardrail (in parallel)    │
│  • NEVER answers directly               │
│  • Selects target via handoff           │
└──────────┬──────────┬──────────┬────────┘
           │          │          │
     maths │   code / │  facts / │
           │  debug   │  explain │
           ▼          ▼          ▼
      ┌────────┐ ┌──────────┐ ┌──────────┐
      │ Math   │ │ Prog.    │ │ General  │
      │ Agent  │ │ Agent    │ │ Q&A Agent│
      └────┬───┘ └────┬─────┘ └────┬─────┘
           │          │             │
    ┌──────┘   ┌──────┴──────┐     └──────┐
    ▼          ▼             ▼            ▼
calculator  code_formatter  word_counter  word_counter
  (tool)       (tool)         (tool)       (tool)
    │          │                           │
    └──────────┴───────────────────────────┘
                      │
                      ▼
                Final Output
               (printed to CLI)
```

**Hard rules enforced:**
- Router agent **never** answers directly → always hands off
- At least **one handoff** happens per user message
- Specialist agents **must call tools** for their core tasks (never guess)

---

## 🛡️ Guardrails

### Input Guardrail (`src/guardrails/inputGuardrail.ts`)

Attached to the **Router Agent** (entry point). Runs **in parallel** with the agent by default (`runInParallel: true`) — this is more efficient since it doesn't block the LLM call.

**Blocks:**
- Unsafe content: hate speech, violence, self-harm, explicit material, hacking
- Off-topic content: romantic requests, jokes, gambling, astrology, celebrity gossip

**Allows (allowlist):**
- Any maths, programming, science, history, language, or educational query

**Mechanism:**
- Pattern-matching against regex rule sets (no extra LLM call = fast & free)
- When triggered: throws `InputGuardrailTripwireTriggered` — caught in CLI with a friendly message

```
You: tell me a joke
🛡️  Request Blocked by Safety Guardrail
⛔  Your message appears to be off-topic. This assistant handles
    maths, programming, and general knowledge questions only.
```

---

## 📊 Tracing & Observability

### What is Tracing?

Tracing records every step of an agent run as a structured span tree:

- Which agent was called, with what input
- Which tools were invoked, with what arguments and results
- Which handoffs occurred and when
- Timing information for each step
- Token usage per call

### How it helps debugging

| Without Tracing | With Tracing |
|-----------------|--------------|
| "The agent gave a wrong answer" | See exactly which tool was called with what args |
| "It's slow" | Pinpoint which step took the most time |
| "The handoff didn't work" | See the exact handoff decision and target agent |
| "Tool returned wrong data" | Inspect the raw tool input/output |

### Configuration in this project

```typescript
// Run-level tracing config (in Runner constructor)
const runner = new Runner({
  tracingDisabled: false,         // enabled by default
  traceIncludeSensitiveData: true,// include prompts & tool I/O in traces
  workflowName: 'Multi-Agent CLI Assistant',
});
```

Toggle at runtime with `:trace on` / `:trace off`.

### Observed Behaviour

During development, tracing revealed:
1. The Router Agent consistently hands off within 1 turn — it never attempts to answer directly.
2. The Math Agent always calls `calculator` before responding — guardrail against hallucinated numbers works.
3. The Programming Agent calls `code_formatter` on every code block — the tool chain is reliable.
4. Guardrail checks complete in <5ms (pattern-based, no LLM call) vs ~500ms for the LLM itself.

---

## 🧠 Notes — Agentic AI Theory

### Part 1.1 — What is Agentic AI?

#### Single-Prompt LLM vs Agent

| Dimension | Single-Prompt LLM | Agentic AI |
|-----------|------------------|------------|
| Interaction | One input → one output | Multi-step, iterative loop |
| State | Stateless (no memory between calls) | Stateful (tracks progress, context, history) |
| Goals | No goal — just complete the prompt | Goal-driven (works until objective met) |
| Tools | None | Can call functions, APIs, databases |
| Decision-making | None | Chooses which action to take next |
| Autonomy | Zero | High — can plan and self-correct |

#### Why Agents are Stateful, Goal-Driven, and Tool-Using

**Stateful:** Agents maintain a run context — they remember what they did in previous turns, what tools returned, and what the current goal is. A pure LLM forgets everything between calls.

**Goal-driven:** An agent is given an objective (e.g., "answer the user's maths question") and runs in a loop until it achieves that goal — calling tools, processing results, and retrying if needed.

**Tool-using:** Real tasks require real data. Agents call tools to:
- Fetch live information (APIs, databases)
- Perform reliable computations (calculators)
- Take actions (send email, run code, write files)

#### Real-World Examples

- **POS Assistant:** Routes "refund item", "check inventory", "apply discount" to specialist agents with access to POS database tools.
- **Support Bot:** Reads tickets, searches knowledge base (tool), escalates to human (handoff) if unresolved.
- **Planner Agent:** Breaks a goal like "book a trip" into sub-tasks: search flights (tool) → book hotel (tool) → add to calendar (tool).
- **Code Review Agent:** Reads PR diff, runs linter (tool), posts review comments (tool).

---

### Part 1.2 — Core Concepts in the OpenAI Agents SDK

#### Agent

The central primitive. An `Agent` is an LLM configured with:

```typescript
new Agent({
  name: 'Math Agent',
  instructions: 'You are a maths expert...',  // system prompt
  model: 'gemini-2.0-flash',                  // agent-level model
  tools: [calculatorTool],                    // available tools
  handoffs: [otherAgent],                     // delegation targets
  inputGuardrails: [safetyGuardrail],         // safety checks
})
```

- **Instructions** = the system prompt. Defines the agent's identity, role, constraints, and behaviour. This is the most important field.
- **Role and responsibility** = what the agent is for and what it must never do. Clear role separation prevents overlap and confusion.

#### Tool

A typed, executable function that the agent can call to take real-world actions or fetch data.

```typescript
tool({
  name: 'calculator',
  description: 'Evaluates a math expression...',
  parameters: z.object({ expression: z.string() }),
  execute: async ({ expression }) => { /* real computation */ }
})
```

**Why agents must not hallucinate tool calls:**
- The model decides *when* to call a tool and *what arguments to pass*.
- If the tool call is fake (hardcoded result, no real execution), the agent lies to the user.
- Real tools ensure the output is grounded in actual computation or data.

#### Handoff

A mechanism for one agent to delegate the conversation to another agent.

```typescript
new Agent({
  name: 'Router Agent',
  handoffs: [mathAgent, programmingAgent, generalAgent],
})
```

**Why multiple agents are needed:**
- Separation of concerns: each agent has a clear, focused role.
- Specialisation: different agents can use different models, tools, and instructions.
- Scalability: add new domains without rewriting existing agents.

**When to hand off:**
- When the query is outside the current agent's scope.
- When a sub-task requires specialised knowledge or tools.
- When the Router identifies the correct target from the user's intent.

#### Guardrail

A validation layer that runs alongside or before/after agent execution.

**Input Guardrail** — checks the user's message before the agent processes it:
```typescript
{ name: 'safety', execute: async (args) => ({ tripwireTriggered: true, outputInfo: {...} }) }
```

**Output Guardrail** — checks the agent's final response before returning it to the user.

**Why guardrails matter:**
- Safety: block harmful, hateful, or dangerous queries.
- Constraint enforcement: keep agents on-topic (work/study only in this project).
- Quality: reject responses that don't meet format or content requirements.

#### Runner

The execution engine that orchestrates agent runs:

```typescript
const runner = new Runner({ tracingDisabled: false, workflowName: 'My Workflow' });
const result = await runner.run(routerAgent, userInput);
// or use the module-level shortcut:
const result = await run(agent, userInput);
```

- Manages the turn loop (LLM → tool calls → LLM again → until final output or handoff)
- Applies `RunConfig` settings (model override, tracing, guardrails)
- Handles errors, max-turns limits, and streaming

**Sync vs Async:**
- `run()` is always **async** in the JS/TS SDK — it returns a `Promise<RunResult>`.
- Streaming mode (`stream: true`) returns a `StreamedRunResult` you can iterate over for incremental output.

#### Tracing

Built-in observability that records every agent action as a structured span.

- **Why observability matters:** Without it, you're flying blind. You can't tell why an agent made a decision, which tool it called, or where it got stuck.
- **How tracing helps:** Each span shows agent name, tool call args & results, handoff events, timing, and token usage. This makes debugging from "it gave a wrong answer" to "it called calculator with the wrong expression" possible.

---

### Part 1.3 — LLM Configuration Levels

The OpenAI Agents SDK supports three levels of LLM configuration, each with a different scope:

#### Global-Level Configuration

Set once at startup, applies to **every agent** unless overridden.

```typescript
// Sets the API client globally
setDefaultOpenAIClient(new OpenAI({ apiKey: '...', baseURL: '...' }));
setOpenAIAPI('chat_completions');
```

**When to use:** When all agents share the same provider/endpoint (e.g., all use Gemini). Good for initial setup.

**Example use case:** A startup using Gemini for all agents because of cost — set globally, no per-agent config needed.

#### Agent-Level Configuration

Set on each `Agent` instance. **PREFERRED approach.**

```typescript
new Agent({
  name: 'Math Agent',
  model: 'gemini-2.0-flash',     // agent-level model
  modelSettings: { temperature: 0.1 }, // deterministic for maths
})
```

**Why preferred:**
- Each agent can use the **best model for its job** (e.g., a reasoning model for maths, a fast model for routing).
- Changes to one agent don't affect others.
- Makes the system composable and maintainable.

**Example use case:** Router uses `gemini-flash` (fast, cheap) while Math Agent uses `gemini-pro` (more accurate for complex calculations).

#### Run-Level Configuration

Set in `RunConfig` passed to `runner.run()` or the `Runner` constructor. Overrides agent-level config for that specific run.

```typescript
const runner = new Runner({
  tracingDisabled: true,
  workflowName: 'Batch Processing',
  model: 'gpt-4o',  // override all agents for this run
});
```

**When to use:** One-off overrides without changing agent definitions. Useful for A/B testing, batch jobs, or per-request model routing.

**Example use case:** A nightly batch job that uses a cheaper model (`gpt-4o-mini`) for all agents via run-level override, while interactive sessions use the default agent-level models.

---

## ⚡ Prompt-Based LLM Usage vs Agent-Based Systems

| Dimension | Prompt-Based LLM | Agent-Based System |
|-----------|-----------------|-------------------|
| **Interaction model** | Request → Response (one shot) | Loop: Plan → Act → Observe → Repeat |
| **State** | None between calls | Persistent run context + history |
| **Tools** | None | Full tool ecosystem (APIs, code, files) |
| **Decision-making** | None — you decide everything | Agent decides which tool/action to use |
| **Error handling** | Manual retry logic | Built-in retry, fallback, guardrails |
| **Multi-agent** | Manual orchestration code | First-class handoffs |
| **Observability** | Custom logging | Built-in tracing |
| **Scalability** | One giant prompt grows unwieldy | Add specialist agents independently |
| **Reliability** | Prone to hallucination on facts | Tool grounding prevents hallucination |
| **Best for** | Simple Q&A, text generation | Complex tasks, workflows, automation |

**In short:** Calling an LLM gives you a smart autocomplete. Designing an agent system gives you an autonomous collaborator that can plan, act, verify, and deliver — reliably and at scale.

---

## 📚 References

- [OpenAI Agents JS SDK Documentation](https://openai.github.io/openai-agents-js)
- [Google AI Studio (Gemini API Keys)](https://aistudio.google.com/apikey)
- [OpenAI Platform (API Keys)](https://platform.openai.com/api-keys)
- [Zod — TypeScript Schema Validation](https://zod.dev)
