import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SymptomQuery, SymptomQueryDocument } from './schemas/symptom-query.schema';

interface SaveQueryDto {
  symptomText: string;
  detectedSymptoms: string[];
  suggestedCategories: string[];
  productIds: string[];
  aiReasoning: string;
  confidenceScore: number;
  hadFollowUp: boolean;
  sessionId: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(SymptomQuery.name)
    private symptomQueryModel: Model<SymptomQueryDocument>,
  ) {}

  async saveQuery(data: SaveQueryDto): Promise<void> {
    await this.symptomQueryModel.create(data);
  }

  async getTopSymptoms(limit = 10) {
    return this.symptomQueryModel.aggregate([
      { $unwind: '$detectedSymptoms' },
      { $group: { _id: '$detectedSymptoms', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  }

  async getTopCategories(limit = 10) {
    return this.symptomQueryModel.aggregate([
      { $unwind: '$suggestedCategories' },
      { $group: { _id: '$suggestedCategories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
  }

  async getTotalQueries() {
    return this.symptomQueryModel.countDocuments();
  }

  async getRecentQueries(limit = 20) {
    return this.symptomQueryModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
