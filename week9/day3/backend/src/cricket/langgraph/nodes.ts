import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { Db } from 'mongodb';
import { AgentState, ConversationTurn, QueryConfig } from './state';

// ── Schema description given to the LLM ────────────────────────────────────
const SCHEMA = `
You are a MongoDB expert for cricket statistics.

Database: cricket_db
Collections: "test" (Test matches), "odi" (ODI matches), "t20" (T20I matches)

Every document in all three collections has these fields:
- player_id       : number
- player_name     : string  (e.g. "Sachin Tendulkar")
- short_name      : string
- country         : string  (e.g. "India", "Australia")
- match_date      : string  (YYYY-MM-DD)
- team            : string
- opponent        : string
- venue           : string
- result          : string  ("Won" | "Lost" | "Draw" | "Tie" | "No Result")
- innings         : number  (1 or 2)
- dismissal       : string  ("Out" | "Not out")
- runs            : number  (runs scored in this match innings)
- balls_faced     : number
- fours           : number
- sixes           : number
- strike_rate     : number
- not_out         : number  (1 = not out)
- overs_bowled    : number
- maidens         : number
- runs_conceded   : number
- wickets         : number
- economy         : number
- best_bowling    : string
- year            : number
- fifty           : number  (1 = scored 50+)
- hundred         : number  (1 = scored 100+)
- duck            : number  (1 = scored 0)
- five_wicket     : number  (1 = took 5+ wickets)
- match_ref       : string
`;

function getLLM(): ChatOpenAI {
  return new ChatOpenAI({
    modelName: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    openAIApiKey: process.env.GROQ_API_KEY,
    temperature: 0,
    maxTokens: 1500,
    configuration: {
      baseURL: 'https://api.groq.com/openai/v1',
    },
  });
}

// ── Node 1: Relevancy Checker ───────────────────────────────────────────────
export async function relevancyChecker(
  state: AgentState,
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const prompt = `You are a cricket question classifier.
Determine if the following question is related to cricket (players, matches, stats, teams, formats like Test/ODI/T20, scores, wickets, etc.).
Reply with ONLY "yes" or "no".

Question: "${state.question}"`;

  try {
    const response = await llm.invoke([new HumanMessage(prompt)]);
    const answer = response.content.toString().trim().toLowerCase();
    const isRelevant = answer.startsWith('yes');
    return {
      isRelevant,
      formattedAnswer: isRelevant
        ? ''
        : 'Sorry, I can only answer cricket-related questions. Ask me about players, matches, scores, wickets, or cricket formats!',
      answerType: 'text',
    };
  } catch (err) {
    console.error('❌ relevancyChecker LLM error:', err);
    return {
      isRelevant: false,
      error: String(err),
      formattedAnswer: 'Error checking relevancy.',
      answerType: 'text',
    };
  }
}

// ── Node 2: Memory Retriever ─────────────────────────────────────────────────
export async function memoryRetriever(
  state: AgentState,
  db: Db,
): Promise<Partial<AgentState>> {
  const userId = state.userId;
  const chatId = state.chatId || userId;
  if (!chatId) {
    return { memoryContext: '', conversationHistory: [], hasSummary: false, memoryTrace: [] };
  }

  try {
    const threshold = parseInt(process.env.MEMORY_SUMMARY_THRESHOLD || '10', 10);
    const dbQuery = state.chatId ? { chatId } : { userId };

    // 1. Check for an existing summary
    const summaryDoc = await db
      .collection('summaries')
      .findOne(dbQuery, { sort: { updatedAt: -1 } });

    // 2. Fetch recent raw turns (last N)
    const recentTurns = (await db
      .collection('conversations')
      .find(dbQuery)
      .sort({ timestamp: -1 })
      .limit(threshold)
      .toArray()) as unknown as ConversationTurn[];

    recentTurns.reverse(); // chronological order

    // 3. Build the memory context string for the LLM
    let memoryContext = '';
    let hasSummary = false;

    if (summaryDoc?.summary) {
      hasSummary = true;
      memoryContext = `[Summarised Memory]\n${summaryDoc.summary}\n\n`;
    }

    if (recentTurns.length > 0) {
      const recentStr = recentTurns
        .map((t) => `Q: ${t.question}\nA: ${t.answer}`)
        .join('\n---\n');
      memoryContext += `[Recent Conversation]\n${recentStr}`;
    }

    // 4. Build memoryTrace (short snippets for UI badge)
    const memoryTrace = recentTurns.slice(-5).map((t) =>
      t.question.length > 60 ? t.question.slice(0, 57) + '…' : t.question,
    );

    return {
      memoryContext,
      conversationHistory: recentTurns,
      hasSummary,
      memoryTrace,
    };
  } catch (err) {
    console.error('Memory retrieval error:', err);
    return { memoryContext: '', conversationHistory: [], hasSummary: false, memoryTrace: [] };
  }
}

// ── Node 3: Query Generator ─────────────────────────────────────────────────
export async function queryGenerator(
  state: AgentState,
): Promise<Partial<AgentState>> {
  const llm = getLLM();

  const memorySection = state.memoryContext
    ? `\n\n--- CONVERSATION MEMORY ---\n${state.memoryContext}\n--- END MEMORY ---\n`
    : '';

  const prompt = `${SCHEMA}${memorySection}
Convert this cricket question into a MongoDB aggregation pipeline query.
Return ONLY a valid JSON object — no explanation, no markdown, no code fences.

IMPORTANT: Use the conversation memory above to resolve follow-up questions.
Examples:
- If memory shows "Who has the highest score in ODI?" and user asks "And in Test?", generate a query for highest score in Test.
- If memory shows context about a specific player, keep that player in focus unless the user changes topic.

The JSON must have exactly this shape:
{
  "collection": "test" | "odi" | "t20",
  "pipeline": [ ...aggregation stages... ]
}

Rules:
- Always use aggregation pipeline (not find).
- To get player totals (e.g. total runs), group by player_name and sum runs.
- Always project/include player_name and country in output.
- Use $limit to restrict to top N results when asked (default 10).
- For "highest score" questions, sort by max runs descending.
- For "most wickets", group and sum wickets descending.
- For "batting average", compute avg of runs where dismissal != "Not out".
- Keep pipelines efficient (match early if possible).
- If question doesn't specify format (Test/ODI/T20), default to "odi".

Question: "${state.question}"`;

  try {
    const response = await llm.invoke([new HumanMessage(prompt)]);
    let raw = response.content.toString().trim();

    // Strip markdown code fences if LLM wraps output
    raw = raw.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();

    const parsed: QueryConfig = JSON.parse(raw);
    return { queryConfig: parsed };
  } catch (err) {
    return {
      queryConfig: null,
      error: `Query generation failed: ${String(err)}`,
      formattedAnswer: 'Sorry, I could not generate a query for that question.',
      answerType: 'text',
    };
  }
}

// ── Node 4: Query Executor ──────────────────────────────────────────────────
export async function queryExecutor(
  state: AgentState,
  db: Db,
): Promise<Partial<AgentState>> {
  if (!state.queryConfig || state.error) {
    return { rawResults: [] };
  }

  const { collection, pipeline } = state.queryConfig;

  const validCollections = ['test', 'odi', 't20'];
  if (!validCollections.includes(collection)) {
    return { rawResults: [], error: `Invalid collection: ${collection}` };
  }

  try {
    const col = db.collection(collection);
    let results: Record<string, any>[] = [];

    if (pipeline && pipeline.length > 0) {
      results = await col.aggregate(pipeline).toArray();
    } else {
      const { filter = {}, sort = {}, limit = 10, projection = {} } =
        state.queryConfig as any;
      const cursor = col.find(filter, { projection }).sort(sort).limit(limit);
      results = await cursor.toArray();
    }

    // Remove MongoDB _id from results
    results = results.map(({ _id, ...rest }) => rest);
    return { rawResults: results };
  } catch (err) {
    return {
      rawResults: [],
      error: `Query execution failed: ${String(err)}`,
      formattedAnswer: 'Sorry, I could not execute the query.',
      answerType: 'text',
    };
  }
}

// ── Node 5: Answer Formatter ────────────────────────────────────────────────
export async function answerFormatter(
  state: AgentState,
): Promise<Partial<AgentState>> {
  if (state.error || state.rawResults.length === 0) {
    const msg =
      state.rawResults.length === 0
        ? 'No results found for your query.'
        : state.formattedAnswer || 'An error occurred.';
    return { formattedAnswer: msg, answerType: 'text' };
  }

  const results = state.rawResults;

  // Single result with one field → plain text
  if (results.length === 1) {
    const keys = Object.keys(results[0]);
    if (keys.length === 1) {
      return {
        formattedAnswer: `${results[0][keys[0]]}`,
        answerType: 'text',
      };
    }
    // Single record, ≤3 fields → LLM sentence
    if (keys.length <= 3) {
      const llm = getLLM();
      const prompt = `Given this cricket query result: ${JSON.stringify(results[0])}
And the original question: "${state.question}"
Write a single, clear sentence answering the question. Be concise and friendly.`;
      try {
        const res = await llm.invoke([new HumanMessage(prompt)]);
        return { formattedAnswer: res.content.toString().trim(), answerType: 'text' };
      } catch {
        return { formattedAnswer: JSON.stringify(results[0]), answerType: 'text' };
      }
    }
  }

  // Multiple results → JSON for table rendering
  return {
    formattedAnswer: JSON.stringify(results),
    answerType: 'table',
  };
}

// ── Node 6: Memory Saver ────────────────────────────────────────────────────
export async function memorySaver(
  state: AgentState,
  db: Db,
): Promise<Partial<AgentState>> {
  const userId = state.userId;
  const chatId = state.chatId || userId;
  if (!userId || !state.formattedAnswer) return {};

  try {
    const threshold = parseInt(process.env.MEMORY_SUMMARY_THRESHOLD || '10', 10);
    const dbQuery = state.chatId ? { chatId } : { userId };

    // 1. Insert this turn into conversations
    // Store the full answer (including raw JSON for tables) so the frontend
    // can always re-render the table correctly when loading history.
    await db.collection('conversations').insertOne({
      userId,
      chatId,
      question: state.question,
      answer: state.formattedAnswer,  // full JSON kept for table re-render
      answerType: state.answerType,
      timestamp: new Date(),
    });

    // 2. Count total turns for this chat
    const totalTurns = await db
      .collection('conversations')
      .countDocuments(dbQuery);

    // 3. If over threshold, summarise and replace old history
    if (totalTurns >= threshold) {
      const allTurns = (await db
        .collection('conversations')
        .find(dbQuery)
        .sort({ timestamp: 1 })
        .toArray()) as unknown as ConversationTurn[];

      const historyText = allTurns
        .map((t) => {
          // Use a compact placeholder for table answers in the LLM prompt
          // (avoids sending huge JSON blobs to the summarisation model)
          const answerText =
            t.answerType === 'table'
              ? (() => { try { return `[Table with ${JSON.parse(t.answer).length} rows]`; } catch { return '[Table result]'; } })()
              : t.answer;
          return `Q: ${t.question}\nA: ${answerText}`;
        })
        .join('\n---\n');

      const llm = getLLM();
      const summaryPrompt = `You are summarising a cricket chatbot conversation for long-term memory.
Create a concise summary (3-6 bullet points) capturing the key topics discussed, players mentioned, and formats queried.
This summary will be shown to the LLM in future turns to provide context.

Conversation:
${historyText}

Output only the bullet-point summary, no other text.`;

      try {
        const summaryRes = await llm.invoke([new HumanMessage(summaryPrompt)]);
        const summary = summaryRes.content.toString().trim();

        // Upsert summary
        await db.collection('summaries').updateOne(
          dbQuery,
          { $set: { userId, chatId, summary, updatedAt: new Date() } },
          { upsert: true },
        );

        // Delete old raw conversations (keep last 5 as recent context)
        const keepIds = allTurns
          .slice(-5)
          .map((t: any) => t._id)
          .filter(Boolean);
        await db.collection('conversations').deleteMany({
          ...dbQuery,
          _id: { $nin: keepIds },
        });

        console.log(`🧠 Memory summarised for user ${userId} (${totalTurns} turns → summary)`);
      } catch (summaryErr) {
        console.error('Summarisation failed:', summaryErr);
      }
    }
  } catch (err) {
    console.error('Memory save error:', err);
  }

  return {};
}

// ── Node 7: Final Response ──────────────────────────────────────────────────
export async function finalResponse(
  state: AgentState,
): Promise<Partial<AgentState>> {
  return {
    formattedAnswer: state.formattedAnswer,
    answerType: state.answerType,
    memoryTrace: state.memoryTrace || [],
  };
}
