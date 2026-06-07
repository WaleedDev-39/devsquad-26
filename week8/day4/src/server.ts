import express from 'express';
import path from 'path';
import { setTracingDisabled } from '@openai/agents';
import { initializeConfig } from './config';
import { createManagerAgent } from './agents/manager';
import { createResearchAgent } from './agents/research';
import { createWriterAgent } from './agents/writer';
import { resetSearchCount, getSearchCount, setEventEmitter } from './tools/tavily';
import { Runner } from '@openai/agents';

setTracingDisabled(true);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, '../public')));

// SSE Research endpoint
app.get('/research', async (req, res) => {
  const query = (req.query.query as string) || 'Compare Stripe vs Razorpay for a SaaS in Pakistan';

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (event: string, data: string) => {
    // JSON.stringify escapes newlines (\n → \\n) so multi-line markdown
    // doesn't break the SSE event (blank lines = event delimiter in SSE spec).
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const config = initializeConfig();

    // Hook into Tavily tool to forward search events to SSE
    setEventEmitter((query: string, count: number) => {
      send('search', `[Tavily Search ${count}/5] Query: "${query}"`);
    });

    resetSearchCount();

    const writer   = createWriterAgent(config.modelInstance);
    const research = createResearchAgent(config.modelInstance, writer);
    const manager  = createManagerAgent(config.modelInstance, research);

    const runner = new Runner({ model: config.modelInstance });

    const resultStream = await runner.run(manager, query, {
      maxTurns: 15,
      stream: true,
    });

    for await (const event of resultStream) {
      if (event.type === 'agent_updated_stream_event') {
        const agentName = event.agent.name;
        send('agent', `Agent switched to: ${agentName}`);
      } else if (event.type === 'run_item_stream_event') {
        const name = event.name;
        const item = event.item as any;
        if (name === 'tool_called') {
          send('agent', `🛠️ Calling tool: ${item.name || 'unknown'} with arguments: ${JSON.stringify(item.arguments || {})}`);
        } else if (name === 'tool_output') {
          send('agent', `📥 Tool output received for ${item.name || 'unknown'}`);
        } else if (name === 'handoff_occurred') {
          send('agent', `🔄 Handoff to ${item.handoff?.name || 'next agent'}`);
        } else if (name === 'message_output_created') {
          if (item.role === 'assistant' && item.content) {
            const sender = item.sender?.name || item.sender || 'Agent';
            const preview = item.content.length > 150 ? item.content.slice(0, 150) + '...' : item.content;
            send('agent', `👤 [${sender}] thought: "${preview.replace(/\n/g, ' ')}"`);
          }
        }
      }
    }

    send('stat', `Total Tavily searches used: ${getSearchCount()}/5`);

    if (resultStream.finalOutput) {
      send('done', resultStream.finalOutput as string);
    } else {
      send('error_msg', 'Agent completed but produced no output. Please try again.');
    }
  } catch (err: any) {
    send('error_msg', err.message || 'An unexpected error occurred.');
  } finally {
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Multi-Agent Research System`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🌐 Web UI:  http://localhost:${PORT}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Press Ctrl+C to stop.\n`);
});
