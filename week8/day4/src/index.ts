import { Runner, setTracingDisabled } from '@openai/agents';
import { initializeConfig } from './config';
import { createManagerAgent } from './agents/manager';
import { createResearchAgent } from './agents/research';
import { createWriterAgent } from './agents/writer';
import fs from 'fs';
import path from 'path';
import { resetSearchCount, getSearchCount } from './tools/tavily';

// Disable OpenAI tracing (prevents non-fatal 401 errors when using Groq / non-OpenAI keys)
setTracingDisabled(true);

async function main() {
  // 1. Initialize configuration (loads .env and sets up default client)
  const config = initializeConfig();

  // Get user query from command line arguments, or use a default one
  const args = process.argv.slice(2);
  const query = args.length > 0 ? args.join(' ') : 'Compare Stripe vs Razorpay for a SaaS in Pakistan';

  console.log(`\n🚀 Starting Multi-Agent Research System`);
  console.log(`📌 Query: "${query}"`);
  console.log(`🤖 Model: ${config.defaultModel}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  // Reset search count for this run
  resetSearchCount();

  try {
    // 2. Instantiate agents using the explicit modelInstance (supports custom base URLs and Groq)
    const writer = createWriterAgent(config.modelInstance);
    const research = createResearchAgent(config.modelInstance, writer);
    const manager = createManagerAgent(config.modelInstance, research);

    // 3. Initialize the Runner
    const runner = new Runner({
      model: config.modelInstance,
    });

    // 4. Execute the agent run starting with ManagerAgent
    console.log(`🔄 Initiating ManagerAgent (Orchestrator)...`);
    const result = await runner.run(manager, query, {
      maxTurns: 15, // Safeguard against infinite agent loop
    });

    // 5. Output the orchestration trace
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 ORCHESTRATION TRACE SUMMARY`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    const items = result.newItems || [];
    for (const item of items) {
      const it = item as any;
      const itemType = it.type || '';
      
      if (itemType === 'message') {
        const role = it.role;
        const sender = it.sender?.name || it.sender || it.agent || 'Assistant';
        const content = it.content;
        
        if (role === 'assistant' && content) {
          console.log(`\n👤 [Agent: ${sender}]`);
          console.log(`   ${content.replace(/\n/g, '\n   ')}`);
        } else if (role === 'user' && content) {
          console.log(`\n👤 [User]:`);
          console.log(`   ${content.replace(/\n/g, '\n   ')}`);
        }
      } else if (itemType === 'tool-call') {
        console.log(`   🛠  Calling Tool: "${it.name}" with args: ${JSON.stringify(it.arguments)}`);
      } else if (itemType === 'tool-output') {
        console.log(`   📥  Tool Output ("${it.name}") received.`);
      }
    }

    console.log(`\n📈 Stats: Total Tavily Search queries run: ${getSearchCount()}/5`);

    // 6. Output the final report
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📝 FINAL RESEARCH REPORT`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    if (result.finalOutput) {
      console.log(result.finalOutput);

      // Save report to file
      const outputDir = path.join(__dirname, '../dist');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const reportPath = path.join(outputDir, 'report.md');
      fs.writeFileSync(reportPath, result.finalOutput as string);
      console.log(`\n💾 Report saved successfully to: ${reportPath}`);
    } else {
      console.error('❌ Error: The agent run completed, but no final output was returned.');
    }

  } catch (error: any) {
    console.error(`\n❌ Execution failed:`, error.message || error);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

main();
