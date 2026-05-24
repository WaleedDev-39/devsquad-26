import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document, DocumentDocument } from './schemas/document.schema';
// pdf-parse v2 ships CJS-only; cast to any so TS is happy
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require('pdf-parse') as { PDFParse: any };

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocumentDocument>,
  ) {}

  async processAndSavePdf(file: Express.Multer.File): Promise<DocumentDocument> {
    try {
      const parser = new PDFParse({ data: new Uint8Array(file.buffer) });
      const result = await parser.getText();
      const textContent: string = result.text;
      const chunks = this.chunkText(textContent, 1000);

      const newDoc = new this.documentModel({
        filename: `${Date.now()}-${file.originalname}`,
        originalName: file.originalname,
        textContent,
        chunks,
      });

      return await newDoc.save();
    } catch (error) {
      this.logger.error(`Error processing PDF: ${error.message}`);
      throw error;
    }
  }

  async getDocument(id: string): Promise<DocumentDocument | null> {
    return this.documentModel.findById(id).exec();
  }

  async getAllDocuments(): Promise<DocumentDocument[]> {
    // Exclude large text content for listing
    return this.documentModel.find().select('-textContent -chunks').exec();
  }

  async updateDocument(id: string, updateData: Partial<Document>): Promise<DocumentDocument | null> {
    return this.documentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  private chunkText(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    let currentIndex = 0;
    while (currentIndex < text.length) {
      chunks.push(text.substring(currentIndex, currentIndex + chunkSize));
      currentIndex += chunkSize;
    }
    return chunks;
  }
}
