import {
  Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { DocumentsService, CreateDocumentDto } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  async upload(@Body() dto: CreateDocumentDto) {
    const doc = await this.documentsService.create(dto);
    return { success: true, message: 'Document uploaded successfully', document: doc };
  }

  @Get()
  async findAll(@Query('topic') topic?: string, @Query('search') search?: string) {
    if (search) return this.documentsService.search(search);
    if (topic) return this.documentsService.findByTopic(topic);
    return this.documentsService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.documentsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.documentsService.findById(id);
    if (!doc) return { success: false, message: 'Document not found' };
    return doc;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.documentsService.deleteById(id);
    return { success: deleted, message: deleted ? 'Deleted' : 'Not found' };
  }
}
