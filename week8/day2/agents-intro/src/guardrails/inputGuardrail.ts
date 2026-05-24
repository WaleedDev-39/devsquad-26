/**
 * inputGuardrail.ts
 * ─────────────────────────────────────────────────────────────
 * Guardrail that runs alongside the Router Agent on every
 * user message.  It blocks:
 *
 *   1. UNSAFE content  – hate speech, violence, self-harm, explicit material
 *   2. OFF-TOPIC content – anything clearly not work/study related
 *      (e.g. "tell me a joke", "write me a love poem", pure chit-chat)
 *
 * Implementation: pure pattern-matching (no extra LLM call) so it's
 * fast, deterministic, and free.  In production you'd swap this for a
 * moderation API call.
 * ─────────────────────────────────────────────────────────────
 */

import type {
  InputGuardrail,
  GuardrailFunctionOutput,
  InputGuardrailFunctionArgs,
} from '@openai/agents';

// ── Unsafe keyword groups ─────────────────────────────────────────────────────
const UNSAFE_PATTERNS: RegExp[] = [
  /\b(hate|kill|murder|harm|hurt|attack|bomb|weapon|suicide|self.harm)\b/i,
  /\b(racist|sexist|slur|explicit|porn|nude|nsfw)\b/i,
  /\b(hack|exploit|malware|ransomware|phishing|ddos|crack\s+password)\b/i,
];

// ── Off-topic keyword groups ──────────────────────────────────────────────────
const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\b(love\s*poem|romantic|dating|flirt|gossip)\b/i,
  /\b(tell\s+me\s+a\s+joke|knock\s+knock|funny\s+story)\b/i,
  /\b(lottery|gambling|casino|bet\s+on)\b/i,
  /\b(horoscope|astrology|zodiac|psychic)\b/i,
  /\b(celebrity|tabloid|reality\s+tv|sports\s+score)\b/i,
];

// ── Work / study topics that are ALWAYS allowed ───────────────────────────────
const ALLOWLIST_PATTERNS: RegExp[] = [
  /\b(math|maths|calculate|compute|algebra|geometry|statistics|probability)\b/i,
  /\b(code|program|debug|function|algorithm|data.structure|software|api)\b/i,
  /\b(science|physics|chemistry|biology|history|geography|language|english|grammar)\b/i,
  /\b(explain|what\s+is|how\s+does|define|describe|summarise|summarize|analyse|analyze)\b/i,
  /\b(write|format|text|word|count|paragraph|essay|sentence)\b/i,
];

interface GuardrailDecision {
  blocked: boolean;
  reason?: string;
}

function evaluateInput(text: string): GuardrailDecision {
  // Explicit allowlist overrides pattern matching for educational/work queries
  for (const allow of ALLOWLIST_PATTERNS) {
    if (allow.test(text)) return { blocked: false };
  }

  // Check unsafe patterns first (higher priority)
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        blocked: true,
        reason:
          '⛔  Your message was blocked because it contains unsafe or ' +
          'harmful content. Please ask a work or study related question.',
      };
    }
  }

  // Check off-topic patterns
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(text)) {
      return {
        blocked: true,
        reason:
          '⛔  Your message appears to be off-topic. This assistant handles ' +
          'maths, programming, and general knowledge questions only.',
      };
    }
  }

  return { blocked: false };
}

/** Extract plain text from the guardrail input (string or ModelItem array) */
function extractText(input: string | unknown[]): string {
  if (typeof input === 'string') return input;

  // Flatten ModelItem array — extract any string 'content' fields
  const parts: string[] = [];
  for (const item of input) {
    if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      if (typeof obj['content'] === 'string') {
        parts.push(obj['content']);
      }
    }
  }
  return parts.join(' ');
}

// ── InputGuardrail object ─────────────────────────────────────────────────────
// Note: InputGuardrail only has { name, execute } in this SDK version.
// Parallel execution is the SDK's default behaviour for input guardrails.
export const contentSafetyGuardrail: InputGuardrail = {
  name: 'content_safety_guardrail',

  execute: async (
    args: InputGuardrailFunctionArgs
  ): Promise<GuardrailFunctionOutput> => {
    const textInput = extractText(args.input as string | unknown[]);
    const decision = evaluateInput(textInput);

    if (decision.blocked) {
      console.log(`\n  🛡️  [guardrail] BLOCKED — ${decision.reason}`);
    } else {
      console.log(`  🛡️  [guardrail] Input passed safety check`);
    }

    return {
      tripwireTriggered: decision.blocked,
      outputInfo: {
        blocked: decision.blocked,
        reason: decision.reason ?? null,
      },
    };
  },
};
