"use client";

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatInterface, { ConversationTurn } from '../components/ChatInterface';
import HistorySidebar, { ChatSession } from '../components/HistorySidebar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const [userId, setUserId] = useState<string>('');
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Generate or restore userId from localStorage
  useEffect(() => {
    let id = localStorage.getItem('cricket_user_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('cricket_user_id', id);
    }
    setUserId(id);
  }, []);

  // Fetch session list
  const loadSessions = useCallback(async (uId: string, selectNewest = false) => {
    try {
      const res = await fetch(`${API}/sessions/${uId}`);
      if (res.ok) {
        const d = await res.json();
        const loadedSessions = d.sessions || [];
        setSessions(loadedSessions);

        if (loadedSessions.length > 0) {
          if (selectNewest || !activeChatId) {
            // Select the most recent session
            setActiveChatId(loadedSessions[0].chatId);
          }
        } else if (!activeChatId) {
          // If no sessions exist, generate one
          const newId = uuidv4();
          setActiveChatId(newId);
        }
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
      if (!activeChatId) {
        const newId = uuidv4();
        setActiveChatId(newId);
      }
    }
  }, [activeChatId]);

  // Load sessions on mount once userId is set
  useEffect(() => {
    if (userId) {
      loadSessions(userId, true);
    }
  }, [userId]);

  // Load history + summary when activeChatId changes
  useEffect(() => {
    if (!activeChatId) return;
    const loadChatData = async () => {
      try {
        const [histRes, sumRes] = await Promise.all([
          fetch(`${API}/history/${activeChatId}`),
          fetch(`${API}/summary/${activeChatId}`),
        ]);
        if (histRes.ok) {
          const d = await histRes.json();
          setHistory(d.history || []);
        } else {
          setHistory([]);
        }
        if (sumRes.ok) {
          const d = await sumRes.json();
          setSummary(d.summary || null);
        } else {
          setSummary(null);
        }
      } catch (err) {
        // Backend not running/unreachable — fail silently
      }
    };
    loadChatData();
  }, [activeChatId, refreshTrigger]);

  const handleHistoryUpdate = useCallback((h: ConversationTurn[]) => {
    setHistory(h);
  }, []);

  const handleSummaryUpdate = useCallback((s: string | null) => {
    setSummary(s);
  }, []);

  const handleNewChat = useCallback(() => {
    const newId = uuidv4();
    setActiveChatId(newId);
  }, []);

  const handleSelectSession = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const handleDeleteSession = useCallback(async (chatId: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await fetch(`${API}/history/${chatId}`, { method: 'DELETE' });
      
      // Remove from list and pick another active session if needed
      setSessions((prev) => {
        const nextSessions = prev.filter((s) => s.chatId !== chatId);
        if (chatId === activeChatId) {
          if (nextSessions.length > 0) {
            setActiveChatId(nextSessions[0].chatId);
          } else {
            setActiveChatId(uuidv4());
          }
        }
        return nextSessions;
      });
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, isLoading]);

  const handleClearMemory = async () => {
    if (!activeChatId || isLoading) return;
    setIsLoading(true);
    try {
      await fetch(`${API}/history/${activeChatId}`, { method: 'DELETE' });
      setHistory([]);
      setSummary(null);
      setRefreshTrigger((n) => n + 1);
      if (userId) {
        loadSessions(userId);
      }
    } catch (err) {
      console.error('Failed to clear memory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionNeedsRefresh = useCallback(() => {
    if (userId) {
      loadSessions(userId);
    }
  }, [userId, loadSessions]);

  if (!userId || !activeChatId) return null; // Wait for initial load

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <div className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        {sidebarOpen && (
          <HistorySidebar
            userId={userId}
            activeChatId={activeChatId}
            sessions={sessions}
            history={history}
            summary={summary}
            isLoading={isLoading}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            onClearMemory={handleClearMemory}
          />
        )}
      </div>

      {/* ── Main Panel ── */}
      <div className="main-panel">
        {/* Header */}
        <header className="header">
          <button
            id="sidebar-toggle"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            title={sidebarOpen ? 'Hide memory panel' : 'Show memory panel'}
          >
            {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>

          <div className="header-logo">
            <span className="header-logo-icon">🏏</span>
            <span className="header-logo-text">
              Cricket<span>Bot</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            {/* Memory counter badge */}
            {(history.length > 0 || summary) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                color: 'var(--gold)',
                background: 'var(--gold-dim)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '20px',
                padding: '0.2rem 0.65rem',
                fontWeight: 600,
              }}>
                🧠 {history.length} turn{history.length !== 1 ? 's' : ''} in memory
                {summary ? ' · summarised' : ''}
              </div>
            )}

            <div className="status-pill">
              <span className="status-dot" />
              Live
            </div>
          </div>
        </header>

        {/* Chat + Input */}
        <ChatInterface
          userId={userId}
          chatId={activeChatId}
          onHistoryUpdate={handleHistoryUpdate}
          onSummaryUpdate={handleSummaryUpdate}
          refreshTrigger={refreshTrigger}
          onSessionNeedsRefresh={handleSessionNeedsRefresh}
        />
      </div>
    </div>
  );
}
