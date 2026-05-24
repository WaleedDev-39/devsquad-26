'use client';

import { useState } from 'react';
import { FinalAnswer, Contradiction, formatDuration } from '@/lib/api';

interface Props {
  answer: FinalAnswer;
  totalDurationMs: number;
  queryId: string;
}

export default function AnswerDisplay({ answer, totalDurationMs, queryId }: Props) {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  return (
    <div className="glass-card animate-fadeIn" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>💡</span>
            <h2 style={{
              fontSize: '1.35rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #f1f5f9, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Research Answer
            </h2>
          </div>
          <p style={{
            fontSize: '0.85rem', color: 'var(--text-muted)',
            fontStyle: 'italic', lineHeight: 1.5,
          }}>
            "{answer.question}"
          </p>
        </div>

        {/* Meta badges */}
      
      </div>
    </div>
  );
}

function ContradictionCard({ contradiction }: { contradiction: Contradiction }) {
  return (
    <div className="contradiction-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1rem' }}>⚖️</span>
        <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#fb7185' }}>
          {contradiction.conflictType}
        </span>
        <span className="badge badge-slate" style={{ fontSize: '0.68rem' }}>
          {contradiction.topic}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'center' }}>
        <div style={{
          background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px 12px',
        }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            📄 {contradiction.source1}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            "{contradiction.claim1}"
          </p>
        </div>
        <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>⟺</span>
        <div style={{
          background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px 12px',
        }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            📄 {contradiction.source2}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            "{contradiction.claim2}"
          </p>
        </div>
      </div>
    </div>
  );
}
