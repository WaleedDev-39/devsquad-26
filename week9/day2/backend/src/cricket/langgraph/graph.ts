import { StateGraph, END, START } from '@langchain/langgraph';
import { Db } from 'mongodb';
import { AgentState } from './state';
import {
  relevancyChecker,
  queryGenerator,
  queryExecutor,
  answerFormatter,
  finalResponse,
} from './nodes';

export function buildCricketGraph(db: Db) {
  // ── Define channels (one reducer per state key) ──────────────────────────
  const channels = {
    question:        { value: (_: any, y: any) => y ?? _, default: () => '' },
    isRelevant:      { value: (_: any, y: any) => y ?? _, default: () => false },
    queryConfig:     { value: (_: any, y: any) => y ?? _, default: () => null },
    rawResults:      { value: (_: any, y: any) => y ?? _, default: () => [] },
    formattedAnswer: { value: (_: any, y: any) => y ?? _, default: () => '' },
    answerType:      { value: (_: any, y: any) => y ?? _, default: () => 'text' },
    error:           { value: (_: any, y: any) => y ?? _, default: () => null },
  };

  const graph: any = new StateGraph<AgentState>({ channels } as any);

  // ── Add 5 nodes ──────────────────────────────────────────────────────────
  graph.addNode('relevancyChecker', (s: AgentState) => relevancyChecker(s));
  graph.addNode('queryGenerator',   (s: AgentState) => queryGenerator(s));
  graph.addNode('queryExecutor',    (s: AgentState) => queryExecutor(s, db));
  graph.addNode('answerFormatter',  (s: AgentState) => answerFormatter(s));
  graph.addNode('finalResponse',    (s: AgentState) => finalResponse(s));

  // ── Set entry point ──────────────────────────────────────────────────────
  graph.addEdge(START, 'relevancyChecker');

  // ── Node 1 → conditional routing ────────────────────────────────────────
  graph.addConditionalEdges(
    'relevancyChecker',
    (state: AgentState) => (state.isRelevant ? 'queryGenerator' : 'finalResponse'),
    {
      queryGenerator: 'queryGenerator',
      finalResponse:  'finalResponse',
    },
  );

  // ── Node 2 → conditional routing (handle query gen errors) ──────────────
  graph.addConditionalEdges(
    'queryGenerator',
    (state: AgentState) => (state.error ? 'finalResponse' : 'queryExecutor'),
    {
      queryExecutor: 'queryExecutor',
      finalResponse: 'finalResponse',
    },
  );

  // ── Remaining linear edges ───────────────────────────────────────────────
  graph.addEdge('queryExecutor',   'answerFormatter');
  graph.addEdge('answerFormatter', 'finalResponse');
  graph.addEdge('finalResponse',   END);

  return graph.compile();
}
