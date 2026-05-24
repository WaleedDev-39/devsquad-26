import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { ResearchWorkflow } from '../workflow/research.workflow';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

class AskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  question: string;
}

@Controller()
export class QueriesController {
  constructor(
    private readonly queriesService: QueriesService,
    private readonly researchWorkflow: ResearchWorkflow,
  ) {}

  /** POST /ask – Run the full 6-agent workflow */
  @Post('ask')
  async ask(@Body() body: AskDto) {
    if (!body.question || body.question.trim().length < 3) {
      return { success: false, message: 'Question must be at least 3 characters.' };
    }
    const result = await this.researchWorkflow.run(body.question.trim());
    return { success: true, ...result };
  }

  /** GET /queries – List all past queries */
  @Get('queries')
  async findAll(@Query('limit') limit?: string) {
    const lim = parseInt(limit || '20', 10);
    return this.queriesService.getRecentQueries(lim);
  }

  /** GET /queries/:id – Get a specific query by ID */
  @Get('queries/:id')
  async findOne(@Param('id') id: string) {
    const query = await this.queriesService.findById(id);
    if (!query) return { success: false, message: 'Query not found' };
    return query;
  }

  /** GET /trace/:id – Get execution trace by trace ID */
  @Get('trace/:id')
  async getTrace(@Param('id') id: string) {
    const trace = await this.queriesService.findTraceById(id);
    if (!trace) return { success: false, message: 'Trace not found' };
    return trace;
  }

  /** GET /trace/query/:queryId – Get trace by query ID */
  @Get('trace/query/:queryId')
  async getTraceByQuery(@Param('queryId') queryId: string) {
    const trace = await this.queriesService.findTraceByQueryId(queryId);
    if (!trace) return { success: false, message: 'Trace not found for this query' };
    return trace;
  }

  /** DELETE /queries/:id – Delete a query */
  @Delete('queries/:id')
  async remove(@Param('id') id: string) {
    const deleted = await this.queriesService.deleteById(id);
    return { success: deleted, message: deleted ? 'Deleted' : 'Not found' };
  }
}
