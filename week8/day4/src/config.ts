import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { setDefaultOpenAIClient, OpenAIChatCompletionsModel } from '@openai/agents';

dotenv.config();

export interface SystemConfig {
  apiKey: string;
  tavilyKey: string;
  defaultModel: string;
  modelInstance: any;
}

export function initializeConfig(): SystemConfig {
  // Read OPENAI_API_KEY first — it can hold a Groq key (gsk_...) which is auto-detected and routed to Groq.
  // Fallback to GROQ_API_KEY if OPENAI_API_KEY is not set.
  const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY || '';

  if (!apiKey || apiKey.includes('change-me') || apiKey.includes('placeholder') || apiKey.includes('your_')) {
    console.error('❌ Error: Please set OPENAI_API_KEY to your Groq API key (starts with gsk_) in your .env file.');
    process.exit(1);
  }

  let client: OpenAI;
  let defaultModel: string;

  if (apiKey.startsWith('gsk_')) {
    console.log('⚡ Detected Groq API Key. Configuring client for Groq API...');
    client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    defaultModel = 'llama-3.3-70b-versatile';
  } else {
    console.log('✨ Detected OpenAI API Key. Configuring client for OpenAI API...');
    client = new OpenAI({
      apiKey: apiKey,
    });
    defaultModel = 'gpt-4o-mini';
  }

  // Register client as default for @openai/agents
  setDefaultOpenAIClient(client as any);

  // Explicitly instantiate a standard Chat Completions model
  const modelInstance = new OpenAIChatCompletionsModel(client as any, defaultModel);

  return {
    apiKey,
    tavilyKey,
    defaultModel,
    modelInstance,
  };
}
