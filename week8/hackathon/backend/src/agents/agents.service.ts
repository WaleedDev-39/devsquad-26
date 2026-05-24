import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { DocumentsService } from '../documents/documents.service';
import {
  extractPdfTextTool,
  retrieveChunksTool,
  countDocumentWordsTool,
  handoffToAnalysisTool,
  handoffToSummaryTool,
  handoffToQnATool,
} from './tools';

type AgentName = 'Router' | 'Analysis' | 'Summary' | 'QnA';

interface Agent {
  name: AgentName;
  systemPrompt: string;
  tools: OpenAI.Chat.Completions.ChatCompletionTool[];
}

@Injectable()
export class AgentsService {
  private openai: OpenAI;
  private readonly logger = new Logger(AgentsService.name);

  // Define Agents
  private readonly agents: Record<AgentName, Agent> = {
    Router: {
      name: 'Router',
      systemPrompt: `You are the Router Agent. Your sole responsibility is to understand the user's intent and delegate the request to the correct specialized agent using the provided handoff tools.
RULES:
1. You MUST NOT answer the user's question directly.
2. You MUST NOT call any tools other than the handoff tools.
3. If the user asks for a summary, handoff to Summary.
4. If the user asks for analysis, themes, or document type, handoff to Analysis.
5. If the user asks a specific question about the document's content, handoff to QnA.`,
      tools: [handoffToAnalysisTool, handoffToSummaryTool, handoffToQnATool],
    },
    Analysis: {
      name: 'Analysis',
      systemPrompt: `You are the Document Analysis Agent.
Your job is to analyze uploaded PDF content, identify the document type (e.g., Research paper, Business report, Legal/policy, Manual/guide), and extract themes and sections.
Use the 'extract_pdf_text' tool to read the document.
You must return a structured analysis to the user based ONLY on the document provided.`,
      tools: [extractPdfTextTool, countDocumentWordsTool],
    },
    Summary: {
      name: 'Summary',
      systemPrompt: `You are the Summary Agent.
Your job is to generate an executive summary and bullet highlights of the document.
Your summary style must adapt to the document type.
Use the 'extract_pdf_text' tool to read the document.`,
      tools: [extractPdfTextTool, countDocumentWordsTool],
    },
    QnA: {
      name: 'QnA',
      systemPrompt: `You are the Q&A Agent.
Your job is to answer user questions strictly using the context from the uploaded document.
Use the 'retrieve_chunks' tool to find relevant parts of the document.
GUARDRAILS:
1. You must answer strictly from the document context.
2. If the information is not present in the document, you MUST clearly respond exactly with: "This information is not present in the document".
3. Do not hallucinate or use external knowledge.
4. If the user asks an unrelated or unsafe question, refuse to answer and remind them you only answer questions about the document.`,
      tools: [retrieveChunksTool],
    },
  };

  constructor(
    private configService: ConfigService,
    private documentsService: DocumentsService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY') || 'dummy-key-for-now',
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  // The main Runner Loop
  async processRequest(documentId: string, userMessage: string): Promise<string> {
    let currentAgent = this.agents.Router;
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: currentAgent.systemPrompt },
      { role: 'user', content: userMessage },
    ];

    const maxIterations = 10;
    let iterations = 0;

    while (iterations < maxIterations) {
      iterations++;
      this.logger.log(`[Iteration ${iterations}] Current Agent: ${currentAgent.name}`);

      try {
        const response = await this.openai.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: messages.map(m => ({
            role: m.role,
            content: m.content || null,
            ...(m.role === 'assistant' && m.tool_calls ? { tool_calls: m.tool_calls } : {}),
            ...(m.role === 'tool' ? { tool_call_id: (m as any).tool_call_id } : {}),
          })) as any,
          tools: currentAgent.tools,
        });

        const message = response.choices[0].message;
        messages.push(message);

        // If no tool calls, the agent has produced a final response
        if (!message.tool_calls || message.tool_calls.length === 0) {
          return message.content || '';
        }

        // Handle tool calls
        for (const toolCall of message.tool_calls) {
          const functionName = (toolCall as any).function?.name;
          const argsText = (toolCall as any).function?.arguments || '{}';
          let args: any = {};
          
          try {
            args = JSON.parse(argsText);
          } catch (e) {
            this.logger.error(`Failed to parse tool arguments: ${argsText}`);
          }

          this.logger.log(`Tool Called: ${functionName} by ${currentAgent.name}`);

          // Handoff Handlers
          if (functionName === 'handoff_to_analysis') {
            currentAgent = this.agents.Analysis;
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: `Transferred to Analysis agent. Reason: ${args.reason || 'N/A'}`,
            } as any);
            // Update system prompt at the top to keep it valid for all providers
            messages[0] = { role: 'system', content: currentAgent.systemPrompt };
            continue;
          } else if (functionName === 'handoff_to_summary') {
            currentAgent = this.agents.Summary;
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: `Transferred to Summary agent. Reason: ${args.reason || 'N/A'}`,
            } as any);
            messages[0] = { role: 'system', content: currentAgent.systemPrompt };
            continue;
          } else if (functionName === 'handoff_to_qna') {
            currentAgent = this.agents.QnA;
            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: `Transferred to QnA agent. Reason: ${args.reason || 'N/A'}`,
            } as any);
            messages[0] = { role: 'system', content: currentAgent.systemPrompt };
            continue;
          }

        // Standard Tools
        let toolResult = '';
        if (functionName === 'extract_pdf_text') {
          const doc = await this.documentsService.getDocument(documentId);
          toolResult = doc ? doc.textContent : 'Document not found.';
        } else if (functionName === 'retrieve_chunks') {
          const doc = await this.documentsService.getDocument(documentId);
          if (!doc) {
            toolResult = 'Document not found.';
          } else {
            const query = (args.query || '').toLowerCase();
            if (!query) {
              toolResult = 'Please provide a search query.';
            } else {
              // Basic semantic search simulation via keyword matching in chunks
              const relevantChunks = doc.chunks.filter(c => c.toLowerCase().includes(query)).slice(0, 3);
              if (relevantChunks.length === 0) {
                toolResult = 'No relevant chunks found.';
              } else {
                toolResult = relevantChunks.join('\n\n---\n\n');
              }
            }
          }
        } else if (functionName === 'count_document_words') {
          const doc = await this.documentsService.getDocument(documentId);
          const words = doc ? doc.textContent.trim().split(/\s+/).length : 0;
          toolResult = `Total document word count: ${words}`;
        } else {
          toolResult = 'Unknown tool.';
        }

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: toolResult,
          } as any);
        }
      } catch (error) {
        this.logger.error(`Error in agent loop: ${error.message}`, error.stack);
        throw error;
      }
    }

    return 'Error: Agent loop exceeded maximum iterations.';
  }
}
