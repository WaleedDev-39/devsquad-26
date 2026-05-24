'use client';

import { useState } from 'react';
import { TraceStep, formatDuration } from '@/lib/api';
import AgentStep from './AgentStep';

interface Props {
  steps: TraceStep[];
  totalDurationMs: number;
  traceId: string;
  contradictionsFound: number;
}

export default function TracePanel({ steps, totalDurationMs, traceId, contradictionsFound }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const successSteps = steps.filter(s => s.status === 'success').length;
  const totalDocs = [...new Set(steps.flatMap(s => s.docsUsed))].length;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px',
        borderBottom: collapsed ? 'none' : '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
            border: '1px solid rgba(99,102,241,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
          }}>
            🗺️
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontS
            {steps.map((step, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  height: '4px', width: '100%', borderRadius: '2px',
                  background: step.status === 'success'
                    ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                    : step.status === 'error'
                    ? '#f43f5e'
                    : 'var(--border-subtle)',
                  transition: 'background 0.5s ease',
                }} />
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  Step {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps list */}
      {!collapsed && (
        <div
          className="panel-scroll stagger-children"
          style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px' }}
        >
          {steps.map((step, i) => (
            <AgentStep key={i} step={step} index={i} />
          ))}
        </div>
      )}

      {/* Collapsed summary */}
      {collapsed && (
        <div style={{
          padding: '12px 20px',
          display: 'flex', gap: '12px', flexWrap: 'wrap',
          color: 'var(--text-muted)', fontSize: '0.8rem',
        }}>
          {steps.map((s, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className={`status-dot status-dot-${s.status}`} />
              {s.stepName}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
