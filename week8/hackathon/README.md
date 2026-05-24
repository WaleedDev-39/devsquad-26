# Agentic AI: Smart Document Intelligence System

A true multi-agent system built with NestJS, Next.js, and the OpenAI SDK (using function-calling as a Runner architecture) to understand document intent and delegate tasks appropriately.

## Agent Architecture Explanation

This system relies on a **Runner Loop** pattern. Instead of using predefined static pipelines like LangChain or LangGraph, the execution relies on OpenAI's native function calling capabilities. The central orchestrator is the **Router Agent**, which decides which sub-agent is best suited to handle the user's query.

When the Router Agent decides on a handoff, it uses a specific "handoff tool". The Runner loop detects this, swaps the active agent (changing the system prompt and available tools), and appends the handoff context to the conversation.

## Responsibilities of Each Agent

1. **Router Agent (The orchestrator)**
   - **Responsibility**: Understand the user's request and delegate it to the appropriate specialized agent.
   - **Strict Rules**: It NEVER answers directly and NEVER uses standard tools. It ONLY uses handoff tools (`handoff_to_analysis`, `handoff_to_summary`, `handoff_to_qna`).
2. **Analysis Agent**
   - **Responsibility**: Determine document type (e.g., Research paper, Business report), extract high-level themes and sections.
   - **Tools**: `extract_pdf_text`, `count_words`.
3. **Summary Agent**
   - **Responsibility**: Provide an executive summary and bullet point highlights adapting to the document style.
   - **Tools**: `extract_pdf_text`, `count_words`.
4. **Q&A Agent**
   - **Responsibility**: Answer specific user questions using only the context found in the uploaded document.
   - **Tools**: `retrieve_chunks`.

## Tools Used and Why

- **`extract_pdf_text`**: Used by Analysis and Summary agents. Since they need a broad overview of the document, they pull the entire text.
- **`retrieve_chunks`**: Used by the Q&A Agent. To avoid token limits and increase precision, it searches for relevant text chunks via keywords/semantic matching.
- **`count_words`**: A helper tool allowing agents to measure document length or section sizes.
- **Handoff Tools (`handoff_to_*`)**: Explicit tools available only to the Router to trigger an agent swap.

## Guardrails Explanation

Guardrails are implemented natively in the agent prompts and the runner architecture:
1. **Delegation Guardrail**: The Router is explicitly instructed NOT to answer users, preventing generalized hallucination before context is retrieved.
2. **Grounded QA Guardrail**: The QnA Agent has strict rules: *If the information is not present in the document, you MUST clearly respond exactly with: "This information is not present in the document".*
3. **Out-of-Scope Guardrail**: The system rejects unrelated queries by reminding the user about its sole purpose (Document Intelligence).

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017`

### Backend
1. `cd backend`
2. `npm install`
3. Add your `OPENAI_API_KEY` to the `.env` file.
4. `npm run start` (Runs on `http://localhost:3001`)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Runs on `http://localhost:3000`)
