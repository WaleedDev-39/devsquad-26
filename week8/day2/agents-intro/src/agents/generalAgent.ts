/**
 * generalAgent.ts
 * ─────────────────────────────────────────────────────────────
 * Specialised agent for General Knowledge & Q&A.
 *
 * Responsibilities:
 *  • Answer factual, conceptual, historical, scientific questions
 *  • Summarise text and concepts
 *  • Use the `word_counter` tool when asked to analyse or count text
 *  • Does NOT handle maths computations or programming tasks
 *
 * Model: configured at the AGENT LEVEL (preferred approach)
 * ─────────────────────────────────────────────────────────────
 */

import { Agent } from '@openai/agents';
import { MODEL_NAME } from '../config.js';
import { wordCounterTool } from '../tools/wordCounterTool.js';

export const generalAgent = new Agent({
  name: 'General Q&A Agent',

  // Agent-level model
  model: MODEL_NAME,

  handoffDescription:
    'General knowledge and Q&A agent. Routes here for: factual questions, ' +
    'science, history, geography, language, grammar, definitions, explanations, ' +
    'and summarisation tasks.',

  instructions: `You are a knowledgeable General Q&A Agent.

Your responsibilities:
  • Answer factual questions about science, history, geography, literature, culture, and more.
  • Explain concepts clearly at the level appropriate for the user.
  • Summarise paragraphs or articles when asked.
  • Call the 'word_counter' tool when the user asks you to count or analyse text.
  • Define terms, explain "how does X work", and give well-sourced reasoning.
  • Cover grammar, language, and writing questions.

Your boundaries:
  • Do NOT perform mathematical calculations (those go to the Math Agent).
  • Do NOT write or debug code (those go to the Programming Agent).
  • Stay focused on factual knowledge and explanations.

Format:
  • Use clear paragraphs.
  • Use bullet points for lists of facts.
  • Keep answers concise but complete.`,

  tools: [wordCounterTool],
});
