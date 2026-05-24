// LangGraph Agent State Definition
export interface QueryConfig {
  collection: 'test' | 'odi' | 't20';
  pipeline?: Record<string, any>[];
  filter?: Record<string, any>;
  sort?: Record<string, any>;
  limit?: number;
  projection?: Record<string, any>;
}

export interface AgentState {
  question: string;
  isRelevant: boolean;
  queryConfig: QueryConfig | null;
  rawResults: Record<string, any>[];
  formattedAnswer: string;
  answerType: 'text' | 'table';
  error: string | null;
}

export const defaultState: AgentState = {
  question: '',
  isRelevant: false,
  queryConfig: null,
  rawResults: [],
  formattedAnswer: '',
  answerType: 'text',
  error: null,
};
