import { StateGraph, END, START } from '@langchain/langgraph';
import { Db } from 'mongodb';
import { AgentState } from './state';
import {
  relevancyChecker,
  memoryRetriever,
  queryGenerator,
  queryExecutor,
  answerFormatter,
  memorySaver,
  finalResponse,
} from './nodes';

export function buildCricketGraph(db: Db) {
  // ── Define channels (one reducer per state key) ──────────────────────────
  const channels = {
    userId:              { value: (_: any, y: any) => y ?? _, default: () => '' },
    question:            { value: (_: any, y: any) => y ?? _, default: () => '' },
    isRelevant:          { value: (_: any, y: any) => y ?? _, default: () => false },
    memoryContext:       { value: (_: any, y: any) => y ?? _, default: () => '' },
    conversationHistory: { value: (_: any, y: any) => y ?? _, default: () => [] },
    hasSummary:          { value: (_: any, y: any) => y ?? _, default: () => false },
    queryConfig:         { value: (_: any, y: any) => y ?? _, default: () => null },
    rawResults:          { value: (_: any, y: any) => y ?? _, default: () => [] },
    formattedAnswer:     { value: (_: any, y: any) => y ?? _, default: () => '' },
    answerType:          { value: (_: any, y: any) => y ?? _, default: () => 'text' },
    memoryTrace:         { value: (_: any, y: any) => y ?? _, default: () => [] },
    error:               { value: (_: any, y: any) => y ?? _, default: () => null },
  };

  const graph: any = new StateGraph<AgentState>({ channels } as any);

  // ── Add 7 nodes ──────────────────────────────────────────────────────────
  graph.addNode('relevancyChecker', (s: AgentState) => relevancyChecker(s));
  graph.addNode('memoryRetriever',  (s: AgentState) => memoryRetriever(s, db));
  graph.addNode('queryGenerator',   (s: AgentState) => queryGenerator(s));
  graph.addNode('queryExecutor',    (s: AgentState) => queryExecutor(s, db));
  graph.addNode('answerFormatter',  (s: AgentState) => answerFormatter(s));
  graph.addNode('memorySaver',      (s: AgentState) => memorySaver(s, db));
  graph.addNode('finalResponse',    (s: AgentState) => finalResponse(s));

  // ── Entry point ──────────────────────────────────────────────────────────
  graph.addEdge(START, 'relevancyChecker');

  // ── Node 1 → conditional: relevant? ─────────────────────────────────────
  graph.addConditionalEdges(
    'relevancyChecker',
    (state: AgentState) => (state.isRelevant ? 'memoryRetriever' : 'memorySaver'),
    {
      memoryRetriever: 'memoryRetriever',
      memorySaver:     'memorySaver',
    },
  );

  // ── Node 2 → Node 3 (always) ─────────────────────────────────────────────
  graph.addEdge('memoryRetriever', 'queryGenerator');

  // ── Node 3 → conditional: error? ────────────────────────────────────────
  graph.addConditionalEdges(
    'queryGenerator',
    (state: AgentState) => (state.error ? 'memorySaver' : 'queryExecutor'),
    {
      queryExecutor: 'queryExecutor',
      memorySaver:   'memorySaver',
    },
  );

  // ── Remaining linear edges ───────────────────────────────────────────────
  graph.addEdge('queryExecutor',   'answerFormatter');
  graph.addEdge('answerFormatter', 'memorySaver');
  graph.addEdge('memorySaver',     'finalResponse');
  graph.addEdge('finalResponse',   END);

  return graph.compile();
}
