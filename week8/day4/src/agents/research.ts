import { Agent } from '@openai/agents';
import { tavilySearch } from '../tools/tavily';

export function createResearchAgent(model: any, writerAgent: Agent): Agent {
  return new Agent({
    name: 'ResearchAgent',
    model: model,
    instructions: `You are the Research Agent. Your sole responsibility is to perform factual web search research using the 'tavilySearch' tool.

Rules:
1. You MUST use the 'tavilySearch' tool to gather real facts (pricing, support status, restrictions, differences).
2. Perform between 3 and 5 search queries to gather comprehensive facts (e.g., search for Stripe pricing, Razorpay pricing, regional support for Pakistan, and local payment alternatives).
3. Do NOT express any opinions, recommendations, or write a final report.
4. Output only structured findings (bullet points of findings and their respective source URLs).
5. Once you have gathered sufficient findings, you MUST immediately hand off the conversation to the 'WriterAgent'. Do not output any final user report yourself.`,
    tools: [
      tavilySearch,
    ],
    handoffs: [
      writerAgent,
    ],
  });
}
