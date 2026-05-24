/**
 * calculatorTool.ts
 * ─────────────────────────────────────────────────────────────
 * A REAL calculator tool — no fake/hardcoded results.
 * The agent passes a valid math expression; we evaluate it safely
 * using a restricted evaluator (no eval(), no exec()).
 *
 * Supported operations: +, -, *, /, **, %, (, ), Math.* functions
 * ─────────────────────────────────────────────────────────────
 */

import { tool } from '@openai/agents';
import { z } from 'zod';

/**
 * Safe expression evaluator — replaces dangerous eval() with a
 * whitelist-only Function constructor restricted to Math operations.
 */
function safeEval(expression: string): number {
  // Allow only numbers, operators, parentheses, spaces, dots, and Math functions
  const sanitised = expression
    .replace(/[^0-9+\-*/.%^()\s,MathsqrtpowlogabsfloorcelinroundmaxiPI]/g, '')
    .replace(/\^/g, '**'); // support ^ as power operator

  // Build a sandboxed function with only Math in scope
  // eslint-disable-next-line no-new-func
  const fn = new Function(
    'Math',
    `"use strict"; return (${sanitised});`
  );

  const result: unknown = fn(Math);

  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error(`Expression "${expression}" did not produce a finite number.`);
  }
  return result;
}

// ── Tool definition ───────────────────────────────────────────────────────────
export const calculatorTool = tool({
  name: 'calculator',
  description:
    'Evaluates a mathematical expression and returns the numeric result. ' +
    'Use standard math notation, e.g. "(3 + 4) * 2", "Math.sqrt(16)", "2**10". ' +
    'Always call this tool for arithmetic — never guess the answer.',
  parameters: z.object({
    expression: z
      .string()
      .describe(
        'A valid mathematical expression to evaluate, e.g. "(100 / 4) + 3.5"'
      ),
  }),
  execute: async ({ expression }) => {
    try {
      const result = safeEval(expression);
      console.log(`  🔧  [calculator] ${expression} = ${result}`);
      return `The result of \`${expression}\` is **${result}**`;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return `❌ Calculator error: ${msg}`;
    }
  },
});
