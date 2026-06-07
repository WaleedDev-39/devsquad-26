"use client";

import { useEffect, useRef } from 'react';
import { ConversationTurn } from './ChatInterface';
import { Trash2, Plus, MessageSquare, Clock, Brain, BookOpen } from 'lucide-react';

export interface ChatSession {
  chatId: string;
  title: string;
  lastActive: string | Date;
}

interface HistorySidebarProps {
  userId: string;
  activeChatId: string;
  sessions: ChatSession[];
  history: ConversationTurn[];
  summary: string | null;
  isLoading: boolean;
  onSelectSession: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (chatId: string) => void;
  onClearMemory: () => void;
}

function timeAgo(dateInput: Date | string): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (isNaN(seconds)) return 'unknown';
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function HistorySidebar({
  userId,
  activeChatId,
  sessions,
  history,
  summary,
  isLoading,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearMemory,
}: HistorySidebarProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <>
      {/* Header */}
      <div className="sidebar-header">
        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
          User ID: {userId.slice(0, 8)}…
        </div>
      </div>

      {/* Body: Session list + active summary */}
      <div className="sidebar-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Previous Chats Section */}
       
        <div className="session-section">
          {sessions.length === 0 ? (
            <div className="history-empty" style={{ padding: '1.5rem 0.5rem' }}>
              No chats yet.
            </div>
          ) : (
            <div className="session-list">
              {sessions.map((session) => {
                const isActive = session.chatId === activeChatId;
                return (
                  <div
                    key={session.chatId}
                    className={`session-item ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectSession(session.chatId)}
                  >
                    <div className="session-info">
                      <div className="session-title-text" title={session.title}>
                        {session.title}
                      </div>
                      <div className="session-meta-row">
                        <MessageSquare size={10} />
                        <span>Active {timeAgo(session.lastActive)}</span>
                      </div>
                    </div>
                    <button
                      className="session-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid triggering select
                        onDeleteSession(session.chatId);
                      }}
                      title="Delete this chat session"
                      aria-label="Delete chat"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Chat Memory Context (at the bottom) */}
        <div className="memory-section">
          <div className="sidebar-title">
            <span className="dot" />
            Chat Memory
            {history.length > 0 && (
              <span className="history-count-badge">{history.length}</span>
            )}
          </div>

          <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', margin: '0.1rem 0 0.25rem 0.25rem' }}>
            Chat ID: {activeChatId.slice(0, 8)}…
          </div>

          {/* Summarised Memory */}
          {summary ? (
            <div className="memory-summary-card" style={{ padding: '0.75rem', marginTop: '0.25rem' }}>
              <div className="memory-summary-label">
                <Brain size={11} />
                Compressed Summary
              </div>
              <div className="memory-summary-text" style={{ fontSize: '0.75rem' }}>{summary}</div>
            </div>
          ) : history.length > 0 ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.25rem' }}>
              Memory will be compressed after 10 messages.
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer — clear button */}
      <div className="sidebar-footer">
        <button
          id="clear-memory-btn"
          className="clear-memory-btn"
          onClick={onClearMemory}
          disabled={isLoading || (history.length === 0 && !summary)}
          title="Clear all messages and summaries for the active chat"
        >
          <Trash2 size={13} />
          Clear Active Chat
        </button>
      </div>
    </>
  );
}
