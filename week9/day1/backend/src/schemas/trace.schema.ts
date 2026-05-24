import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface TraceStep {
  stepName: string;
  stepIndex: number;
  input: any;
  output: any;
  durationMs: number;
  docsUsed: string[];
  contradictions: Array<{ claim1: string; claim2: string; source1: string; source2: string }>;
  status: 'success' | 'error';
  error?: string;
}

export type TraceDocument = ExecutionTrace & Document;

@Schema({ timestamps: true })
export class ExecutionTrace {
  @Prop({ required: true })
  queryId: string;

  @Prop({ required: true })
  question: string;

  @Prop({ type: [Object], default: [] })
  steps: TraceStep[];

  @Prop({ default: 0 })
  totalDurationMs: number;

  @Prop({ type: [String], default: [] })
  allDocsUsed: string[];

  @Prop({ default: 0 })
  totalContradictions: number;

  @Prop({ default: 'pending' })
  status: 'pending' | 'running' | 'completed' | 'error';
}

export const ExecutionTraceSchema = SchemaFactory.createForClass(ExecutionTrace);
