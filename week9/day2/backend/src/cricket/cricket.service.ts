import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Db } from 'mongodb';
import { MONGO_DB } from '../database/database.module';
import { buildCricketGraph } from './langgraph/graph';
import { defaultState } from './langgraph/state';

@Injectable()
export class CricketService implements OnModuleInit {
  private graph: any;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  onModuleInit() {
    // Build the LangGraph workflow once on startup
    this.graph = buildCricketGraph(this.db);
    console.log('🏏 LangGraph cricket workflow initialized');
  }

  async ask(question: string): Promise<{ answer: string; type: 'text' | 'table' }> {
    const result = await this.graph.invoke({
      ...defaultState,
      question,
    });

    return {
      answer: result.formattedAnswer || 'No answer available.',
      type: result.answerType || 'text',
    };
  }
}
