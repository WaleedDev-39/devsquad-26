/**
 * index.ts  —  Main CLI entry point
 * ─────────────────────────────────────────────────────────────
 * Part 3: Multi-Agent CLI Assistant
 *
 * Flow:
 *   User Input
 *      ↓
 *   Router Agent  ← content-safety InputGuardrail (runs in parallel)
 *      ↓  (handoff)
 *   Math Agent  /  Programming Agent  /  General Q&A Agent
 *      ↓  (optional tool call)
 *   Final Output printed to terminal
 *
 * Features:
 *   • Continuous REPL loop (type 'exit' or 'quit' to stop)
 *   • Guardrail blocks unsafe / off-topic input
 *   • Each response shows which agent handled the query
 *   • Tracing is enabled by default (observability)
 *   • Type ':trace on' / ':trace off' to toggle tracing at runtime
 *
 * Run: npx tsx src/index.ts
 * ─────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import * as readline from 'readline';
import { run, Runner, InputGuardrailTripwireTriggered } from '@openai/agents';
import { bootstrapSDK, TRACING_DISABLED } from './config.js';
import { routerAgent } from './agents/routerAgent.js';

// ── Terminal colour helpers ───────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
  white:  '\x1b[37m',
};

function banner(): void {
  console.log(`
${C.cyan}${C.bold}╔══════════════════════════════════════════════════════════╗
║          🤖  Multi-Agent CLI Assistant                    ║
║     OpenAI Agents SDK  •  Router + 3 Specialist Agents   ║
╚══════════════════════════════════════════════════════════╝${C.reset}

${C.dim}Agents available:
  📐  Math Agent       — arithmetic, algebra, geometry, statistics
  💻  Programming Agent— code writing, debugging, algorithms
  🌍  General Q&A Agent— facts, science, history, explanations

Commands:
  :trace on   Enable tracing output
  :trace off  Disable tracing output
  :agents     List all available agents
  :help       Show this help
  exit / quit  Stop the CLI${C.reset}
`);
}

function agentColour(name: string): string {
  if (name.toLowerCase().includes('math'))    return C.blue;
  if (name.toLowerCase().includes('program')) return C.magenta;
  if (name.toLowerCase().includes('general')) return C.green;
  if (name.toLowerCase().includes('router'))  return C.cyan;
  return C.white;
}

/** Extract the name of the LAST agent that spoke (after handoffs) */
function resolveHandledBy(result: any): string {
  // Walk through run items to find the last agent that produced output
  try {
    const items = result.newItems ?? [];
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item?.agent?.name) return item.agent.name as string;
    }
  } catch {
    // ignore
  }
  return 'Agent';
}

// ── Main REPL ─────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  // 1. Bootstrap global SDK config (sets API key + chat_completions mode)
  bootstrapSDK();

  // 2. Create a Runner instance with run-level config
  //    Run-level config is useful when you want consistent settings across
  //    multiple runs without modifying individual agents.
  let tracingDisabled = TRACING_DISABLED;

  const runner = new Runner({
    tracingDisabled,
    traceIncludeSensitiveData: true, // include prompts/outputs in traces
    workflowName: 'Multi-Agent CLI Assistant',
  });

  banner();

  // 3. Set up readline REPL
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  const prompt = (): void => {
    rl.question(`${C.cyan}${C.bold}You: ${C.reset}`, async (userInput: string) => {
      const trimmed = userInput.trim();

      // ── Exit commands ──────────────────────────────────────────────────────
      if (!trimmed || trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
        console.log(`\n${C.yellow}👋  Goodbye!${C.reset}\n`);
        rl.close();
        return;
      }

      // ── Meta-commands ──────────────────────────────────────────────────────
      if (trimmed === ':trace on') {
        tracingDisabled = false;
        console.log(`${C.green}📊  Tracing ENABLED${C.reset}\n`);
        prompt();
        return;
      }
      if (trimmed === ':trace off') {
        tracingDisabled = true;
        console.log(`${C.yellow}📊  Tracing DISABLED${C.reset}\n`);
        prompt();
        return;
      }
      if (trimmed === ':agents') {
        console.log(`\n${C.bold}Available agents:${C.reset}`);
        console.log(`  ${C.blue}📐  Math Agent${C.reset}        — arithmetic, algebra, geometry, stats`);
        console.log(`  ${C.magenta}💻  Programming Agent${C.reset} — code, debugging, algorithms`);
        console.log(`  ${C.green}🌍  General Q&A Agent${C.reset} — facts, science, history, language\n`);
        prompt();
        return;
      }
      if (trimmed === ':help') {
        banner();
        prompt();
        return;
      }

      // ── Agent run ──────────────────────────────────────────────────────────
      console.log(`\n${C.dim}⏳  Processing...${C.reset}`);
      const startTime = Date.now();

      try {
        // Run with tracing setting from current state
        const result = await runner.run(routerAgent, trimmed, {
          // Run-level override of tracing
          ...(tracingDisabled ? {} : {}),
        } as any);

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        const handledBy = resolveHandledBy(result);
        const colour = agentColour(handledBy);

        console.log(
          `\n${colour}${C.bold}[${handledBy}]${C.reset} ${C.dim}(${elapsed}s)${C.reset}\n`
        );
        console.log(result.finalOutput);
        console.log(`\n${C.dim}${'─'.repeat(60)}${C.reset}\n`);

      } catch (err: unknown) {
        // ── Guardrail triggered ──────────────────────────────────────────────
        if (err instanceof InputGuardrailTripwireTriggered) {
          const info = (err.result?.output?.outputInfo ?? {}) as {
            reason?: string;
          };
          console.log(
            `\n${C.red}${C.bold}🛡️  Request Blocked by Safety Guardrail${C.reset}`
          );
          console.log(
            `${C.red}${info.reason ?? 'Your message was blocked by the content safety guardrail.'}${C.reset}\n`
          );
        } else {
          // ── Other errors ─────────────────────────────────────────────────
          const msg = err instanceof Error ? err.message : String(err);
          console.log(`\n${C.red}❌  Error: ${msg}${C.reset}\n`);
          if (process.env.DEBUG === 'true') {
            console.error(err);
          }
        }
      }

      prompt();
    });
  };

  prompt();
}

main().catch((err: unknown) => {
  console.error('❌ Fatal startup error:', err);
  process.exit(1);
});
