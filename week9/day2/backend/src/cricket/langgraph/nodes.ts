import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { Db } from 'mongodb';
import { AgentState, QueryConfig } from './state';

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
    modelName: process.env.GEMINI_MODEL || 'google/gemini-3-flash-preview',
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    temperature: 0,
    maxTokens: 1000,
    configuration: {
      baseURL: 'https://openrouter.ai/api/v1',
    },
    modelKwargs: {
      extra_body: {
        reasoning: { enabled: true },
      },
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
        : 'Sorry, I can only answer cricket-related questions.',
      answerType: 'text',
    };
  } catch (err) {
    return { isRelevant: false, error: String(err), formattedAnswer: 'Error checking relevancy.', answerType: 'text' };
  }
}

// ── Node 2: Query Generator ─────────────────────────────────────────────────
export async function queryGenerator(
  state: AgentState,
): Promise<Partial<AgentState>> {
  const llm = getLLM();
  const prompt = `${SCHEMA}

Convert this cricket question into a MongoDB aggregation pipeline query.
Return ONLY a valid JSON object — no explanation, no markdown, no code fences.

The JSON must have exactly this shape:
{
  "collection": "test" | "odi" | "t20",
  "pipeline": [ ...aggregation stages... ]
}

Rules:
- Always use aggregation pipeline (not find).
- To get player totals (e.g. total runs), group by player_name and sum runs.
- Always project/include player_name and country in output.
- Use $limit to restrict to top N results when asked.
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

// ── Node 3: Query Executor ──────────────────────────────────────────────────
export async function queryExecutor(
  state: AgentState,
  db: Db,
): Promise<Partial<AgentState>> {
  if (!state.queryConfig || state.error) {
    return { rawResults: [] };
  }

  const { collection, pipeline } = state.queryConfig;

  // Validate collection name
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
      // Fallback: simple find
      const { filter = {}, sort = {}, limit = 10, projection = {} } =
        state.queryConfig as any;
      const cursor = col
        .find(filter, { projection })
        .sort(sort)
        .limit(limit);
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

// ── Node 4: Answer Formatter ────────────────────────────────────────────────
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
    // Single record, multiple fields → check if it's a simple answer
    if (keys.length <= 3) {
      const llm = getLLM();
      const prompt = `Given this cricket query result: ${JSON.stringify(results[0])}
And the original question: "${state.question}"
Write a single, clear sentence answering the question. Be concise.`;
      try {
        const res = await llm.invoke([new HumanMessage(prompt)]);
        return { formattedAnswer: res.content.toString().trim(), answerType: 'text' };
      } catch {
        return { formattedAnswer: JSON.stringify(results[0]), answerType: 'text' };
      }
    }
  }

  // Multiple results → return as JSON for table rendering
  return {
    formattedAnswer: JSON.stringify(results),
    answerType: 'table',
  };
}

// ── Node 5: Final Response ──────────────────────────────────────────────────
export async function finalResponse(
  state: AgentState,
): Promise<Partial<AgentState>> {
  // This node is a pass-through — the answer is already set
  return {
    formattedAnswer: state.formattedAnswer,
    answerType: state.answerType,
  };
}
