import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Db } from 'mongodb';
import { MONGO_DB } from '../database/database.module';
import { buildCricketGraph } from './langgraph/graph';
import { defaultState, ConversationTurn } from './langgraph/state';

@Injectable()
export class CricketService implements OnModuleInit {
  private graph: any;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {}

  onModuleInit() {
    this.graph = buildCricketGraph(this.db);
    console.log('🏏 LangGraph cricket workflow with memory initialized (7 nodes)');
  }

  async ask(
    userId: string,
    chatId: string,
    question: string,
  ): Promise<{
    answer: string;
    type: 'text' | 'table';
    memoryTrace: string[];
  }> {
    const result = await this.graph.invoke({
      ...defaultState,
      userId,
      chatId,
      question,
    });

    return {
      answer: result.formattedAnswer || 'No answer available.',
      type: result.answerType || 'text',
      memoryTrace: result.memoryTrace || [],
    };
  }

  async getHistory(chatId: string): Promise<ConversationTurn[]> {
    const turns = await this.db
      .collection('conversations')
      .find({ $or: [{ chatId }, { userId: chatId, chatId: { $exists: false } }] })
      .sort({ timestamp: 1 })
      .toArray();

    return turns.map(({ _id, ...rest }) => rest) as unknown as ConversationTurn[];
  }

  async getSummary(chatId: string): Promise<{ summary: string | null }> {
    const doc = await this.db
      .collection('summaries')
      .findOne(
        { $or: [{ chatId }, { userId: chatId, chatId: { $exists: false } }] },
        { sort: { updatedAt: -1 } }
      );

    return { summary: doc?.summary || null };
  }

  async clearHistory(chatId: string): Promise<{ deleted: number }> {
    const query = { $or: [{ chatId }, { userId: chatId, chatId: { $exists: false } }] };
    const convResult = await this.db
      .collection('conversations')
      .deleteMany(query);
    await this.db.collection('summaries').deleteMany(query);

    console.log(`🗑️  Cleared memory for chat session ${chatId}`);
    return { deleted: convResult.deletedCount };
  }

  async getSessions(userId: string): Promise<{ chatId: string; title: string; lastActive: Date }[]> {
    const sessions = await this.db
      .collection('conversations')
      .aggregate([
        { $match: { userId } },
        { $sort: { timestamp: 1 } },
        {
          $group: {
            _id: { $ifNull: ['$chatId', '$userId'] },
            title: { $first: '$question' },
            lastActive: { $last: '$timestamp' },
          },
        },
        { $sort: { lastActive: -1 } },
      ])
      .toArray();

    return sessions.map((s) => ({
      chatId: s._id,
      title: s.title || 'Untitled Chat',
      lastActive: s.lastActive,
    }));
  }
}
