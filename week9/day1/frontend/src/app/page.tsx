'use client';

import { useState, useEffect, useRef } from 'react';
import {
  askQuestion,
  fetchQueries,
  fetchTrace,
  WorkflowOutput,
  ResearchQuery,
  FinalAnswer,
  TraceStep
} from '@/lib/api';
import QuestionInput from '@/components/QuestionInput';
import AnswerDisplay from '@/components/AnswerDisplay';
import TracePanel from '@/components/TracePanel';
import DocumentUpload from '@/components/DocumentUpload';

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<{
    queryId: string;
    traceId: string;
    question: string;
    finalAnswer: FinalAnswer;
    totalDurationMs: number;
    steps: TraceStep[];
    contradictionsFound: number;
  } | null>(null);

  const [queriesHistory, setQueriesHistory] = useState<ResearchQuery[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref for the upload component to trigger lists reload if needed
  const uploadRef = useRef<{ loadDocuments: () => void } | null>(null);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
                  <div className="spinner-lg" />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>Orchestrator Executing Pipeline</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto' }}>
                      Initializing agent instances. Processing question splitting, vector ranking, contradiction verification, and summary synthesis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results display (Answer + Trace side-by-side or stacked) */}
            {currentResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fadeIn">
                <AnswerDisplay
                  answer={currentResult.finalAnswer}
                  totalDurationMs={currentResult.totalDurationMs}
                  queryId={currentResult.queryId}
                />
                
                <TracePanel
                  steps={currentResult.steps}
                  totalDurationMs={currentResult.totalDurationMs}
                  traceId={currentResult.traceId}
                  contradictionsFound={currentResult.contradictionsFound}
                />
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Responsive adjustments CSS */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
