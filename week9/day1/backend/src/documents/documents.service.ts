import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDocument, DocumentDocument } from '../schemas/document.schema';
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(ResearchDocument.name)
    private readonly docModel: Model<DocumentDocument>,
  ) {}

  async create(dto: CreateDocumentDto): Promise<ResearchDocument> {
    const wordCount = dto.content.split(/\s+/).length;
    const doc = new this.docModel({
      ...dto,
      wordCount,
      createdAt: new Date().toISOString().split('T')[0],
    });
    return doc.save();
  }

  async findAll(): Promise<ResearchDocument[]> {
    return this.docModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async findById(id: string): Promise<ResearchDocument | null> {
    return this.docModel.findById(id).lean().exec();
  }

  async findByTopic(topic: string): Promise<ResearchDocument[]> {
    return this.docModel
      .find({ topic: { $regex: topic, $options: 'i' } })
      .lean()
      .exec();
  }

  async search(query: string): Promise<ResearchDocument[]> {
    try {
      return this.docModel
        .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(10)
        .lean()
        .exec();
    } catch {
      return this.docModel
        .find({
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { content: { $regex: query, $options: 'i' } },
          ],
        })
        .limit(10)
        .lean()
        .exec();
    }
  }

  async getStats() {
    const total = await this.docModel.countDocuments();
    const byTopic = await this.docModel.aggregate([
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return { total, byTopic };
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.docModel.findByIdAndDelete(id);
    return !!result;
  }
}
