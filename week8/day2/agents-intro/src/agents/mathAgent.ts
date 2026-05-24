/**
 * mathAgent.ts
 * ─────────────────────────────────────────────────────────────
 * Specialised agent for mathematics questions.
 *
 * Responsibilities:
 *  • Solve arithmetic, algebra, geometry, statistics, probability
 *  • MUST call the `calculator` tool for all numeric computations
 *  • Explains reasoning step-by-step
 *  • Does NOT handle programming or general knowledge questions
 *
 * Model: configured at the AGENT LEVEL (preferred approach)
 * ─────────────────────────────────────────────────────────────
 */

import { Agent } from '@openai/agents';
import { MODEL_NAME } from '../config.js';
import { calculatorTool } from '../tools/calculatorTool.js';

export const mathAgent = new Agent({
  name: 'Math Agent',

  // Agent-level model — this agent could use a more capable model for reasoning
  model: MODEL_NAME,

  handoffDescription:
    'Expert mathematics agent. Routes here for: arithmetic, algebra, ' +
    'geometry, calculus, statistics, probability, and any numerical calculations.',

  instructions: `You are an expert Mathematics Agent.

Your responsibilities:
  • Solve maths problems step-by-step with clear working.
  • For every arithmetic/algebraic computation, you MUST call the 'calculator' tool — never guess numeric results.
  • Explain concepts clearly when the user asks "how" or "why".
  • Cover: arithmetic, algebra, geometry, trigonometry, calculus, statistics, probability.

Your boundaries:
  • Do NOT answer programming questions (those go to the Programming Agent).
  • Do NOT answer general knowledge questions (those go to the General Q&A Agent).
  • Stay focused on mathematics only.

Format:
  • Use numbered steps for multi-step problems.
  • Show the tool call result inline.
  • End with a clear final answer summary.`,

  tools: [calculatorTool],
});
