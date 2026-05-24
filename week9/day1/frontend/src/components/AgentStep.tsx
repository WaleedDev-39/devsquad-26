'use client';

import { useState } from 'react';
import { TraceStep, AGENT_ICONS, AGENT_DESCRIPTIONS, formatDuration } from '@/lib/api';

interface Props {
  step: TraceStep;
  index: number;
}

export default function AgentStep({ step, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const icon = AGENT_ICONS[step.stepName] || '⚙️';
  const desc = AGENT_DESCRIPTIONS[step.stepName] || '';
  const isSuccess = step.status === 'success';

  const statusColor = isSuccess ? '#10b981' : '#f43f5e';
  const borderAccent = isSuccess ? '#10b981' : '#f43f5e';

  return (
    <div
      id={`agent-step-${index}`}
      className={`agent-step-card ${step.status}`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px 16px', background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
        aria-expanded={expanded}
        aria-label={`${step.stepName} step details`}
      >
        {/* Step number + icon */}
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: isSuccess
            ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
          border: `1px solid ${isSuccess ? 'rgba(16
                    ⚖️ {c.conflictType}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.75rem', color: 'var(--text-secondary)',
                      background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '6px', flex: 1,
                    }}>
                      "{c.claim1}" — <em style={{ color: 'var(--text-muted)' }}>{c.source1}</em>
                    </span>
                    <span style={{ color: 'var(--text-muted)', alignSelf: 'center', fontSize: '0.8rem' }}>vs</span>
                    <span style={{
                      fontSize: '0.75rem', color: 'var(--text-secondary)',
                      background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '6px', flex: 1,
                    }}>
                      "{c.claim2}" — <em style={{ color: 'var(--text-muted)' }}>{c.source2}</em>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Output summary */}
          {step.output && (
            <div>
              <p className="section-label" style={{ marginBottom: '8px' }}>Output Preview</p>
              <pre style={{
                background: 'var(--bg-secondary)', borderRadius: '8px', padding: '12px',
                fontSize: '0.75rem', color: 'var(--text-secondary)', overflowX: 'auto',
                border: '1px solid var(--border-subtle)', maxHeight: '160px', overflow: 'auto',
              }}>
                {JSON.stringify(step.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
