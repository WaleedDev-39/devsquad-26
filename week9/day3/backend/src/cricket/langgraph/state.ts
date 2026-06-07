// ── LangGraph Agent State — Day 3 (with Memory) ──────────────────────────────

export interface QueryConfig {
  collection: 'test' | 'odi' | 't20';
  pipeline?: Record<string, any>[];
  filter?: Record<string, any>;
  sort?: Record<string, any>;
  limit?: number;
  projection?: Record<string, any>;
}

/** A single conversation turn stored in MongoDB */
export interface ConversationTurn {
  userId: string;
  chatId?: string;
  question: string;
  answer: string;
  answerType: 'text' | 'table';
  timestamp: Date;
}

export interface AgentState {
  // ── Input ──────────────────────────────────────────────────────────────────
  userId: string;
  chatId: string;
  question: string;

  // ── Relevancy ──────────────────────────────────────────────────────────────
  isRelevant: boolean;

  // ── Memory ────────────────────────────────────────────────────────────────
  /** Short string of context injected into query generator prompt */
  memoryContext: string;
  /** Raw recent turns fetched from DB (used for sidebar display) */
  conversationHistory: ConversationTurn[];
  /** Whether a summary already exists and was used */
  hasSummary: boolean;

  // ── Query ──────────────────────────────────────────────────────────────────
  queryConfig: QueryConfig | null;
  rawResults: Record<string, any>[];

  // ── Answer ─────────────────────────────────────────────────────────────────
  formattedAnswer: string;
  answerType: 'text' | 'table';

  // ── Trace ─────────────────────────────────────────────────────────────────
  /** Short list of recent question snippets shown in the UI memory badge */
  memoryTrace: string[];

  // ── Error ─────────────────────────────────────────────────────────────────
  error: string | null;
}

export const defaultState: Partial<AgentState> = {
  chatId: '',
  isRelevant: false,
  memoryContext: '',
  conversationHistory: [],
  hasSummary: false,
  queryConfig: null,
  rawResults: [],
  formattedAnswer: '',
  answerType: 'text',
  memoryTrace: [],
  error: null,
};
