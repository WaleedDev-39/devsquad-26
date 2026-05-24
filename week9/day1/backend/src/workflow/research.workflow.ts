import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { QuestionSplitterAgent, SplitterResult } from '../agents/question-splitter.agent';
import { DocumentFinderAgent, FinderResult } from '../agents/document-finder.agent';
import { RankerAgent, RankerResult } from '../agents/ranker.agent';
import { SummarizerAgent, SummarizerResult } from '../agents/summarizer.agent';
import { CrossCheckerAgent, CrossCheckerResult } from '../agents/cross-checker.agent';
import { AnswerMakerAgent, FinalAnswer } from '../agents/answer-maker.agent';
import { TraceStep } from '../schemas/trace.schema';

import { ExecutionTrace, TraceDocument } from '../schemas/trace.schema';
import { ResearchQuery, QueryDocument } from '../schemas/query.schema';

export interface WorkflowState {
  question: string;
  splitterResult?: SplitterResult;
  finderResults?: FinderResult[];
  rankerResults?: RankerResult[];
  summarizerResults?: SummarizerResult[];
  crossCheckerResult?: CrossCheckerResult;
  finalAnswer?: FinalAnswer;
  trace?: ExecutionTrace;
  traceId?: string;
  queryId?: string;
  startTime?: number;
}

export interface WorkflowOutput {
  queryId: string;
  traceId: string;
  question: string;
  finalAnswer: FinalAnswer;
  totalDurationMs: number;
  steps: TraceStep[];
  contradictionsFound: number;
}

@Injectable()
export clas

      return {
        output,
        traceStep: {
          stepName,
          stepIndex,
          input,
          output: this.sanitizeForTrace(output),
          durationMs,
          docsUsed: this.extractDocTitles(output),
          contradictions: this.extractContradictions(output),
          status: 'success',
        },
      };
    } catch (err) {
      const durationMs = Date.now() - start;
      this.logger.error(`✗ Step ${stepIndex}: ${stepName} failed: ${err.message}`);

      return {
        output: null as T,
        traceStep: {
          stepName,
          stepIndex,
          input,
          output: null,
          durationMs,
          docsUsed: [],
          contradictions: [],
          status: 'error',
          error: err.message,
        },
      };
    }
  }

  /** Trim large outputs for trace storage safely without breaking JSON structure */
  private sanitizeForTrace(output: any): any {
    if (!output) return output;

    const truncate = (val: any, depth = 0): any => {
      if (depth > 6) return '[Max Depth Reached]';
      if (typeof val === 'string') {
        return val.length > 1000 ? val.slice(0, 1000) + '...' : val;
      }
      if (Array.isArray(val)) {
        return val.slice(0, 20).map(item => truncate(item, depth + 1));
      }
      if (val !== null && typeof val === 'object') {
        const cleaned: any = {};
        for (const key of Object.keys(val)) {
          cleaned[key] = truncate(val[key], depth + 1);
        }
        return cleaned;
      }
      return val;
    };

    try {
      return truncate(output);
    } catch {
      return '[Serialization Error]';
    }
  }

  private extractDocTitles(output: any): string[] {
    if (!output) return [];
    try {
      const json = JSON.stringify(output);
      const matches = json.match(/"title":"([^"]+)"/g) || [];
      return [...new Set(matches.map(m => m.replace(/"title":"/, '').replace('"', '')))];
    } catch {
      return [];
    }
  }

  private extractContradictions(output: any): any[] {
    if (!output) return [];
    if (output.contradictions && Array.isArray(output.contradictions)) {
      return output.contradictions;
    }
    return [];
  }
}
