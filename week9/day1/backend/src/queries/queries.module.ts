import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueriesController } from './queries.controller';
import { QueriesService } from './queries.service';
import { ResearchQuery, ResearchQuerySchema } from '../schemas/query.schema';
import { ExecutionTrace, ExecutionTraceSchema } from '../schemas/trace.schema';
import { ResearchWorkflow } from '../workflow/research.workflow';
import { QuestionSplitterAgent } from '../agents/question-splitter.agent';
import { DocumentFinderAgent } from '../agents/document-finder.agent';
import { RankerAgent } from '../agents/ranker.agent';
import { SummarizerAgent } from '../agents/summarizer.agent';
import { CrossCheckerAgent } from '../agents/cross-checker.agent';
import { AnswerMakerAgent } from '../agents/answer-maker.agent';
import { ResearchDocument, ResearchDocumentSchema } from '../schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResearchQuery.name, schema: ResearchQuerySchema },
      { name: ExecutionTrace.name, schema: ExecutionTraceSchema },
      { name: ResearchDocument.name, schema: ResearchDocumentSchema },
    ]),
  ],
  controllers: [QueriesController],
  providers: [
    QueriesService,
    ResearchWorkflow,
    QuestionSplitterAgent,
    DocumentFinderAgent,
    RankerAgent,
    SummarizerAgent,
    CrossCheckerAgent,
    AnswerMakerAgent,
  ],
  exports: [QueriesService],
})
export class QueriesModule {}
