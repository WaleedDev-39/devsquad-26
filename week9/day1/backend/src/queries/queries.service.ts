import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchQuery, QueryDocument } from '../schemas/query.schema';
import { ExecutionTrace, TraceDocument } from '../schemas/trace.schema';

@Injectable()
export class QueriesService {
  constructor(
    @InjectModel(ResearchQuery.name)
    private readonly queryModel: Model<QueryDocument>,

    @InjectModel(ExecutionTrace.name)
    private readonly traceModel: Model<TraceDocument>,
  ) {}

  async findAll(): Promise<ResearchQuery[]> {
    return this.queryModel.find().sort({ createdAt: -1 }).limit(50).lean().exec();
  }

  async findById(id: string): Promise<ResearchQuery | null> {
    return this.queryModel.findById(id).lean().exec();
  }

  async findTraceById(traceId: string): Promise<ExecutionTrace | null> {
    return this.traceModel.findById(traceId).lean().exec();
  }

  async findTraceByQueryId(queryId: string): Promise<ExecutionTrace | null> {
    return this.traceModel.findOne({ queryId }).lean().exec();
  }

  async getRecentQueries(limit = 10): Promise<ResearchQuery[]> {
    return this.queryModel.find().sort({ createdAt: -1 }).limit(limit).lean().exec();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.queryModel.findByIdAndDelete(id);
    return !!result;
  }
}
