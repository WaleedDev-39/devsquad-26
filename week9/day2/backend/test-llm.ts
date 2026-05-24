import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    const llm = new ChatOpenAI({
      modelName: process.env.GEMINI_MODEL || 'google/gemini-3-flash-preview',
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      temperature: 0,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
      },
      modelKwargs: {
        extra_body: {
          reasoning: { enabled: true },
        },
      },
    });

    console.log("Invoking LLM...");
    const response = await llm.invoke([new HumanMessage("Are you alive?")]);
    console.log("Response:", response);
  } catch (err: any) {
    console.error("LLM Error:", err);
  }
}

test();
