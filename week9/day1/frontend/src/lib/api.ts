const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface TraceStep {
  stepName: string;
  stepIndex: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  durationMs: number;
  docsUsed: string[];
  contradictions: Contradiction[];
  status: 'success' | 'error';
  error?: string;
}

export interface Contradiction {
  claim1: string;
  claim2: string;
  source1: string;
  source2: string;
  topic: string;
  conflictType: string;
}

export interface AnswerSection {
  subQuestion: string;
  content: string;
  keyPoints: string[];
  sources: string[];
}

export interface FinalAnswer {
  question: string;
  introduction: string;
  sections: AnswerSection[];
  contradictions: Contradiction[];
  conclusion: string;
  allSourcesUsed: string[];
  totalDocsAnalyzed: number;
}

export interface WorkflowOutput {
  success: boolean;
  queryId: string;
  traceId: string;
  question: string;
  finalAnswer: FinalAnswer;
  totalDurationMs: number;
  steps: TraceStep[];
  contradictionsFound: number;
}

export interface ResearchDocument {
  _id: string;
  title: string;
  topic: string;
  total: number;
  byTopic: Array<{ _id: string; count: number }>;
}> {
  const res = await fetch(`${API_BASE}/documents/stats`);
  if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchTrace(traceId: string): Promise<ExecutionTrace> {
  const res = await fetch(`${API_BASE}/trace/${traceId}`);
  if (!res.ok) throw new Error(`Trace fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchQueries(limit = 10): Promise<ResearchQuery[]> {
  const res = await fetch(`${API_BASE}/queries?limit=${limit}`);
  if (!res.ok) throw new Error(`Queries fetch failed: ${res.status}`);
  return res.json();
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export const AGENT_ICONS: Record<string, string> = {
  QuestionSplitter: '🧩',
  DocumentFinder: '🔍',
  Ranker: '📊',
  Summarizer: '✍️',
  CrossChecker: '⚖️',
  AnswerMaker: '💡',
};

export const AGENT_DESCRIPTIONS: Record<string, string> = {
  QuestionSplitter: 'Breaks the question into focused sub-questions',
  DocumentFinder: 'Retrieves relevant documents from MongoDB',
  Ranker: 'Scores documents using TF-IDF & cosine similarity',
  Summarizer: 'Extracts key sentences using TextRank algorithm',
  CrossChecker: 'Detects contradictions between source documents',
  AnswerMaker: 'Synthesizes all findings into a final answer',
};
