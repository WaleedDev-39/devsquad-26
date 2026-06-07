# Agentic AI: Multi-Agent Research & Report System

This project is a multi-agent AI system built using the **OpenAI Agents SDK** in TypeScript. It is designed to research a real-world topic, reason over it, and produce a structured final report.

The system orchestrates three specialized agents: a **Manager Agent (Orchestrator)**, a **Research Agent (Factual Searcher)**, and a **Writer Agent (Report Synthesizer)**. It utilizes the **Tavily Search API** for factual web research with strict search limit controls.

---

## 🧩 System Architecture & Flow

The conversation flows sequentially to maintain clean separation of concerns:

```
User Query
   │
   ▼
[ Manager Agent (Orchestrator) ]  ◄── (Analyzes query & breaks it into subtasks)
   │
   ▼ (Handoff)
[ Research Agent (Factual Searcher) ]  ◄── (Executes Tavily searches, max 3-5 times)
   │
   ▼ (Handoff)
[ Writer Agent (Synthesizer) ]  ◄── (Organizes, structures, & formats markdown report)
   │
   ▼
Final Report Output (.md file + console)
```

### Agent Responsibilities

1. **Manager Agent (Orchestrator)**:
   - Understands the user's query and breaks it down into logical research subtasks (e.g. pricing, regional support, pros/cons, alternatives).
   - Delegates these subtasks to the Research Agent by handing off.
   - *Rule*: Never calls tools directly, writes reports, or expresses opinions.

2. **Research Agent (Factual Searcher)**:
   - Performs objective, factual research using the `tavilySearch` tool (3–5 searches).
   - Consolidates findings with source links and hands off to the Writer Agent.
   - *Rule*: Expresses no opinions and never generates the final user-facing response.

3. **Writer Agent (Report Synthesizer)**:
   - Takes the consolidated facts and source URLs from the conversation.
   - Normalizes, processes, and structures the final response.
   - *Rule*: Cannot call Tavily, cannot invent facts, must format output strictly according to the specified report structure.

---

## 🚀 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (Node package manager)

### Installation Steps

1. Install the required dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Note: The `--legacy-peer-deps` flag is recommended due to peer dependency requirements between `@openai/agents` and `zod` v3/v4).*

2. Configure your API keys. Copy the `.env.example` template to a new `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and fill in your API keys:
   ```env
   # OpenAI API Key (Standard)
   OPENAI_API_KEY=your_openai_api_key_here

   # Alternatively, if you wish to use Groq:
   GROQ_API_KEY=your_groq_api_key_here

   # Tavily Search API Key (Required for live web search)
   TAVILY_API_KEY=your_tavily_search_api_key_here
   ```
   *Note: If the system detects a Groq key (starting with `gsk_`), it will automatically configure the base URL to use the Groq API endpoint (`https://api.groq.com/openai/v1`) and default to a Groq model (`llama-3.3-70b-versatile`).*

---

## 🏃 How to Run

To run the system with the default comparison query ("Compare Stripe vs Razorpay for a SaaS in Pakistan"):
```bash
npm start
```

To run the system with a custom query, pass the query as arguments to the script:
```bash
npm start "Compare Stripe vs Razorpay vs Safepay for a SaaS in Pakistan"
```

The system will:
1. Initialize configurations and select the appropriate LLM provider.
2. Coordinate agent handoffs.
3. Stream execution logs (showing tool calls and active agent transitions).
4. Print the final synthesized markdown report to the console.
5. Save the report to `dist/report.md`.

---

## 🛠 Tavily Search Limits & Fallbacks

- **Usage Limit**: The `tavilySearch` tool enforces a strict limit of **5 searches per run**. If the agent attempts more, the tool returns a warning, forcing the agent to proceed with existing data.
- **Mock/Simulated Data Fallback**: If the `TAVILY_API_KEY` is not provided or set to a placeholder, the tool gracefully falls back to mock factual results for Stripe/Razorpay/Pakistan SaaS queries, allowing the system to run and produce highly realistic reports without crashing.
