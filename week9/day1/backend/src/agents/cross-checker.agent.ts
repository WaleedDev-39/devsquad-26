import { Injectable, Logger } from '@nestjs/common';
import { SummarizerResult, DocumentSummary } from './summarizer.agent';

export interface Contradiction {
  claim1: string;
  claim2: string;
  source1: string;
  source2: string;
  topic: string;
  conflictType: string;
}

export interface CrossCheckerResult {
  contradictions: Contradiction[];
  agreements: Array<{ claim: string; sources: string[] }>;
  checkedPairs: number;
  summary: string;
}

@Injectable()
export class CrossCheckerAgent {
  private readonly logger = new Logger(CrossCheckerAgent.name);

  // Contradiction patterns: pairs of semantically opposing claims
  private readonly contradictionPatterns: Array<{
    termA: string[];
    termB: string[];
    label: string;
  }> = [
    // Scaling
    { termA: ['sql scales', 'sql can scale', 'sql is scalable', 'relational scales'], termB: ['nosql scales', 'nosql is more scalable', 'nosql scales better', 'nosql outscales'], label: 'Scalability: SQL vs NoSQL' },
    { termA: ['scales vertically', 'vertical scaling'], termB: ['scales horizontally', 'horizontal scaling'], label: 'Scaling Direction' },
    // Performance
    { termA: ['sql is faster', 'sql performs better', 'relational faster'], termB: ['nosql is faster', 'nosql performs better', 'nosql faster'], label: 'Performance: SQL vs NoSQL' },
    { termA: ['rest is faster', 'rest performs better'], termB: ['graphql is faster', 'graphql performs better

    // Find shared key phrases (3+ word sequences)
    const phrasesA = this.extractPhrases(textA);
    for (const phrase of phrasesA) {
      if (phrase.length > 15 && textB.includes(phrase)) {
        agreements.push({
          claim: this.capitalize(phrase),
          sources: [docA.title, docB.title],
        });
      }
    }

    return agreements.slice(0, 3); // Limit to 3 agreements per pair
  }

  private extractPhrases(text: string): string[] {
    const words = text.split(/\s+/);
    const phrases: string[] = [];
    for (let i = 0; i < words.length - 3; i++) {
      phrases.push(words.slice(i, i + 4).join(' '));
    }
    return phrases;
  }

  private deduplicateContradictions(contradictions: Contradiction[]): Contradiction[] {
    const seen = new Set<string>();
    return contradictions.filter(c => {
      const key = c.conflictType;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private buildSummary(contradictions: Contradiction[], agreements: Array<{ claim: string; sources: string[] }>, docCount: number): string {
    if (contradictions.length === 0) {
      return `Cross-checked ${docCount} documents. No significant contradictions detected. Sources appear to be generally consistent.`;
    }

    const types = contradictions.map(c => c.conflictType).join(', ');
    return `Cross-checked ${docCount} documents. Found ${contradictions.length} contradiction(s) across sources: ${types}. These conflicts reflect differing perspectives and should be considered context-dependent.`;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
