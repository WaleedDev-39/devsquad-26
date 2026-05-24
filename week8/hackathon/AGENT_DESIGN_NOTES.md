# Agent Design Notes

## Why Agents Were Separated

Separation of concerns is a fundamental principle in both software engineering and LLM orchestration. By separating the agents into `Router`, `Analysis`, `Summary`, and `QnA`:
1. **Prompt Isolation**: We keep each agent's system prompt highly focused. A focused prompt reduces cognitive overload on the LLM, leading to more deterministic and accurate outputs.
2. **Tool Restriction**: The `Router` has no access to `extract_pdf_text` or `retrieve_chunks`. This guarantees that it cannot hallucinate an answer prematurely. It is forced to delegate. Similarly, the `Summary` agent cannot accidentally invoke `retrieve_chunks` and answer a specific user query.
3. **Guardrail Enforcement**: Guardrails are easier to enforce on specialized agents. The `QnA` agent has a strict prompt regarding hallucination. Applying this strictness to a general agent might prevent it from performing abstract analysis.

## What Breaks If Merged Into One Agent?

If we merged all responsibilities into a single monolithic agent with all tools:
- **Hallucinations**: The agent might attempt to answer a highly specific question by reading the entire document via `extract_pdf_text` instead of correctly using `retrieve_chunks`, leading to context window overflow or loss of specific details in the middle of a large text.
- **Routing Failure**: Without a dedicated Router, a single agent might try to summarize a document when the user merely asked for its document type.
- **System Fragility**: If the user sends a confusing prompt, a single agent might trigger multiple tools unpredictably (e.g., extracting text, chunking, and summarizing all at once) resulting in latency spikes and API cost blowouts.

## What Would Improve In Production

1. **True Vector Search**: Currently, the `retrieve_chunks` tool simulates semantic search using basic chunk filtering. In production, we would generate OpenAI Embeddings (`text-embedding-3-small`) for each chunk upon upload, store them in a vector database (like MongoDB Atlas Vector Search or Pinecone), and use cosine similarity to retrieve the most contextually relevant chunks.
2. **Streaming & Observability**: The Runner loop currently waits for the final output. In production, we should stream the intermediate steps (e.g., "Router is delegating...", "QnA agent is reading chunks...") to the frontend using Server-Sent Events (SSE) or WebSockets to improve UX. We would also integrate LangSmith or a similar tracing tool to monitor agent handoffs.
3. **Structured Outputs**: We would enforce `response_format: { type: "json_schema" }` for the Analysis agent to guarantee that the frontend always receives the themes and document type in a strictly parseable JSON object, rather than relying on standard text generation.
