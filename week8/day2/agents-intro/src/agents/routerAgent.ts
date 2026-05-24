/**
 * routerAgent.ts
 * ─────────────────────────────────────────────────────────────
 * The Router Agent is the ENTRY POINT of every user request.
 *
 * Hard rules (enforced in instructions):
 *  • It MUST NOT answer questions directly.
 *  • It MUST hand off to exactly one specialised agent.
 *  • It carries the content-safety InputGuardrail.
 *
 * Handoff targets:
 *  • Math Agent       — arithmetic, algebra, geometry, stats, probability
 *  • Programming Agent — code writing, debugging, algorithms, CS concepts
 *  • General Q&A Agent — factual, science, history, language, summarisation
 *
 * Model: configured at the AGENT LEVEL (preferred approach).
 * ─────────────────────────────────────────────────────────────
 */

import { Agent } from '@openai/agents';
import { MODEL_NAME } from '../config.js';
import { contentSafetyGuardrail } from '../guardrails/inputGuardrail.js';
import { mathAgent } from './mathAgent.js';
import { programmingAgent } from './programmingAgent.js';
import { generalAgent } from './generalAgent.js';

export const routerAgent = new Agent({
  name: 'Router Agent',

  // Agent-level model
  model: MODEL_NAME,

  // The content-safety guardrail only triggers on the FIRST (entry) agent.
  // Since routerAgent is always the entry point, this is the right place.
  inputGuardrails: [contentSafetyGuardrail],

  handoffDescription: 'Entry-point router. Reads user intent and delegates to the correct specialist agent.',

  instructions: `You are a Router Agent.
Your ONLY job is to delegate the user's request to the correct specialist.
DO NOT answer the question yourself.

Routing Rules:
- Math/Numbers/Calculations -> "Math Agent"
- Coding/Programming/Software -> "Programming Agent"
- Facts/General Knowledge/Summaries -> "General Q&A Agent"

Immediately perform the handoff.`,

  handoffs: [mathAgent, programmingAgent, generalAgent],
});
