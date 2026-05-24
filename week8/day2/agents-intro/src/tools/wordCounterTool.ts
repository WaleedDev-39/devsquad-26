/**
 * wordCounterTool.ts
 * ─────────────────────────────────────────────────────────────
 * Analyses a piece of text and returns:
 *   • word count
 *   • character count (with / without spaces)
 *   • sentence count
 *   • average word length
 *   • top-5 most frequent words
 * ─────────────────────────────────────────────────────────────
 */

import { tool } from '@openai/agents';
import { z } from 'zod';

// Common English stop-words to exclude from top-word analysis
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','being','have','has','had','do','does',
  'did','will','would','could','should','may','might','shall','can','not',
  'no','nor','so','yet','both','either','neither','this','that','these','those',
  'i','you','he','she','it','we','they','me','him','her','us','them',
  'my','your','his','its','our','their','what','which','who','when','where','how',
]);

interface TextStats {
  wordCount: number;
  charCountWithSpaces: number;
  charCountWithoutSpaces: number;
  sentenceCount: number;
  avgWordLength: number;
  topWords: { word: string; count: number }[];
}

function analyseText(text: string): TextStats {
  const words = text
    .toLowerCase()
    .match(/\b[a-z']+\b/g) ?? [];

  const charCountWithSpaces = text.length;
  const charCountWithoutSpaces = text.replace(/\s/g, '').length;
  const sentenceCount = (text.match(/[.!?]+/g) ?? []).length || 1;

  const avgWordLength =
    words.length === 0
      ? 0
      : Math.round(
          (words.reduce((sum, w) => sum + w.length, 0) / words.length) * 100
        ) / 100;

  // Frequency map excluding stop-words
  const freq: Record<string, number> = {};
  for (const word of words) {
    if (!STOP_WORDS.has(word) && word.length > 1) {
      freq[word] = (freq[word] ?? 0) + 1;
    }
  }

  const topWords = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    wordCount: words.length,
    charCountWithSpaces,
    charCountWithoutSpaces,
    sentenceCount,
    avgWordLength,
    topWords,
  };
}

// ── Tool definition ───────────────────────────────────────────────────────────
export const wordCounterTool = tool({
  name: 'word_counter',
  description:
    'Analyses a block of text and returns detailed statistics: word count, ' +
    'character counts, sentence count, average word length, and the top-5 ' +
    'most frequent non-stop words. Always use this tool when asked to count or ' +
    'analyse text — never estimate.',
  parameters: z.object({
    text: z.string().describe('The text to analyse'),
  }),
  execute: async ({ text }) => {
    const stats = analyseText(text);
    console.log(`  🔧  [word_counter] analysed ${stats.wordCount} words`);

    const topWordsStr = stats.topWords
      .map(({ word, count }) => `"${word}" (×${count})`)
      .join(', ');

    return (
      `📊 **Text Analysis Results**\n` +
      `• Words: **${stats.wordCount}**\n` +
      `• Characters (with spaces): ${stats.charCountWithSpaces}\n` +
      `• Characters (without spaces): ${stats.charCountWithoutSpaces}\n` +
      `• Sentences: ${stats.sentenceCount}\n` +
      `• Average word length: ${stats.avgWordLength} chars\n` +
      `• Top words: ${topWordsStr || 'N/A'}`
    );
  },
});
