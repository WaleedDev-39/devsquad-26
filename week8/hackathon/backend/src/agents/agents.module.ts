import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [DocumentsModule],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
