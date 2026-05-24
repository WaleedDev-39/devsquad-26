/**
 * codeFormatterTool.ts
 * ─────────────────────────────────────────────────────────────
 * Wraps a snippet of code in a formatted markdown code-block,
 * detects language, normalises indentation, strips trailing
 * whitespace, and counts lines / tokens.
 *
 * This is a REAL formatting tool — the Programming Agent uses it
 * to present clean code output to the user.
 * ─────────────────────────────────────────────────────────────
 */

import { tool } from '@openai/agents';
import { z } from 'zod';

/** Very lightweight language detection based on common syntax markers */
function detectLanguage(code: string): string {
  if (/^\s*import\s+\w|from\s+['"]|const\s+\w+\s*=\s*require/.test(code))
    return 'javascript';
  if (/:\s*(int|str|float|bool|list|dict|None)\b|def\s+\w+\(|print\(/.test(code))
    return 'python';
  if (/\bpublic\s+class\b|\bSystem\.out\.println\b/.test(code)) return 'java';
  if (/#include\s*<|int\s+main\s*\(/.test(code)) return 'cpp';
  if (/^\s*<[a-zA-Z]/.test(code)) return 'html';
  if (/^\s*\{[\s\S]*:\s*/.test(code)) return 'json';
  if (/SELECT|INSERT|UPDATE|DELETE|FROM|WHERE/i.test(code)) return 'sql';
  if (/\bfn\s+\w+|let\s+mut\b/.test(code)) return 'rust';
  if (/\bfunc\s+\w+|:=\s*/.test(code)) return 'go';
  return 'text';
}

/** Normalise indentation: detect tab vs space, convert tabs to 2 spaces */
function normaliseIndentation(code: string): string {
  const hasTabs = /\t/.test(code);
  return hasTabs ? code.replace(/\t/g, '  ') : code;
}

/** Remove trailing whitespace from every line */
function stripTrailingWhitespace(code: string): string {
  return code
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
}

/** Rough token estimate (splits on whitespace + punctuation) */
function estimateTokens(code: string): number {
  return (code.match(/\S+/g) ?? []).length;
}

// ── Tool definition ───────────────────────────────────────────────────────────
export const codeFormatterTool = tool({
  name: 'code_formatter',
  description:
    'Formats a code snippet: auto-detects language, normalises indentation, ' +
    'strips trailing whitespace, and wraps it in a markdown code block with ' +
    'line count and token estimate. Always call this tool before presenting ' +
    'code to the user — never return raw unformatted snippets.',
  parameters: z.object({
    code: z.string().describe('The raw code snippet to format'),
    language: z
      .string()
      .nullable()
      .describe(
        'Optional: override the detected language (e.g. "python", "typescript"). Pass null to auto-detect.'
      ),
  }),
  execute: async ({ code, language }) => {
    const detectedLang = language ?? detectLanguage(code);
    const formatted = stripTrailingWhitespace(normaliseIndentation(code));
    const lineCount = formatted.split('\n').length;
    const tokenEstimate = estimateTokens(formatted);

    console.log(
      `  🔧  [code_formatter] lang=${detectedLang}, ` +
      `lines=${lineCount}, ~tokens=${tokenEstimate}`
    );

    return (
      `🖥️ **Formatted Code** (${detectedLang} · ${lineCount} lines · ~${tokenEstimate} tokens)\n\n` +
      `\`\`\`${detectedLang}\n${formatted}\n\`\`\``
    );
  },
});
