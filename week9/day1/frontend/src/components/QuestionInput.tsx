'use client';

import { useState } from 'react';

const EXAMPLE_QUESTIONS = [
  'Compare SQL vs NoSQL databases',
  'REST API vs GraphQL: which is better?',
  'Monolithic vs Microservices architecture',
  'How does SSR differ from CSR in Next.js?',
  'WebSockets vs HTTP Polling for real-time apps',
];

interface Props {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export default function QuestionInput({ onSubmit, isLoading }: Props) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 3 || isLoading) return;
    onSubmit(question.trim());
  };

  const handleChip = (q: string) => {
    setQuestion(q);
    if (!isLoading) onSubmit(q);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '9999px', padding: '6px 18px', marginBottom: '20px',
        }}>
          <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, letterSpacing: '0.08em' }}>
            ✦ MULTI-AGENT RESEARCH ASSISTANT
          </span>
        </div>

        <h1
            >
              <span style={{ opacity: 0.6 }}>→</span> {q}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline preview */}
      {!isLoading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', flexWrap: 'wrap', marginTop: '4px',
        }}>
          {['🧩 Split', '🔍 Find', '📊 Rank', '✍️ Summarize', '⚖️ Check', '💡 Answer'].map((step, i, arr) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500,
              }}>{step}</span>
              {i < arr.length - 1 && (
                <span style={{ color: 'var(--border-default)', fontSize: '0.7rem' }}>→</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Loading progress */}
      {isLoading && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 'var(--radius-full)', padding: '10px 20px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#f59e0b', animation: 'pulse-dot 1s ease-in-out infinite',
            }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Agents are working on your question...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
