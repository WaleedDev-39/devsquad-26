import 'dotenv/config';
import { setDefaultOpenAIClient, setOpenAIAPI } from '@openai/agents';
import OpenAI from 'openai';

export const MODEL_NAME = process.env.MODEL_NAME ?? 'gemini-1.5-flash';
export const TRACING_DISABLED = process.env.TRACING_DISABLED !== 'false';

function resolveClient(): OpenAI {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    // Ensure no trailing slash for Gemini's OpenAI endpoint
    let baseURL = process.env.OPENAI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
    if (baseURL.endsWith('/')) {
      baseURL = baseURL.slice(0, -1);
    }
    
    console.log(`🔑  Connecting to: ${baseURL}`);
    return new OpenAI({
      apiKey: geminiKey,
      baseURL: baseURL,
    });
  }

  if (openaiKey) {
    console.log('🔑  Using OpenAI API');
    return new OpenAI({ apiKey: openaiKey });
  }

  throw new Error('❌ No API key found. Please set GEMINI_API_KEY or OPENAI_API_KEY in .env');
}

export function bootstrapSDK(): void {
  const client = resolveClient();
  setDefaultOpenAIClient(client);
  
  // Force chat_completions mode for compatibility
  setOpenAIAPI('chat_completions');

  console.log(`🤖  Model: ${MODEL_NAME}`);
  console.log(`📊  Tracing: ${TRACING_DISABLED ? 'DISABLED' : 'ENABLED'}\n`);
}
