/**
 * hello-world.ts
 * ─────────────────────────────────────────────────────────────
 * Part 2 — Hello World Agent
 *
 * The simplest possible demonstration of the OpenAI Agents SDK:
 *   1. Bootstrap the global SDK client (API key + model)
 *   2. Create an Agent with a name and instructions
 *   3. Run it with a string input using the top-level `run()` function
 *   4. Print the final output
 *
 * This verifies:
 *   ✅ SDK is installed and importable
 *   ✅ Agent creation works
 *   ✅ Runner executes and returns a result
 *   ✅ API credentials are valid
 *
 * Run: npx tsx src/hello-world.ts
 * ─────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import { Agent, run } from '@openai/agents';
import { bootstrapSDK, MODEL_NAME, TRACING_DISABLED } from './config.js';

async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║       Hello World — OpenAI Agents SDK        ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // ── 1. Bootstrap global-level SDK config ──────────────────────────────────
  bootstrapSDK();

  // ── 2. Create a minimal "Hello World" agent ───────────────────────────────
  const helloAgent = new Agent({
    name: 'Assistant',
    model: MODEL_NAME,          // Agent-level model config
    instructions: 'You are a helpful assistant.',
  });

  // ── 3. Run the agent using the module-level run() function ─────────────────
  console.log('▶  Running "Assistant" agent...\n');

  const result = await run(
    helloAgent,
    'Say hello and briefly introduce yourself in 2 sentences.',
    {
      // Run-level config: disable tracing for this simple hello-world test
      // In production you would keep tracing enabled for observability.
      runConfig: {
        tracingDisabled: TRACING_DISABLED || true, // always off for hello-world
        workflowName: 'Hello World Demo',
      },
    } as any,
  );

  // ── 4. Print the final output ─────────────────────────────────────────────
  console.log('✅  Agent response:\n');
  console.log('─'.repeat(50));
  console.log(result.finalOutput);
  console.log('─'.repeat(50));
  console.log('\n👋  Hello World demo complete!');
}

main().catch((err: unknown) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
