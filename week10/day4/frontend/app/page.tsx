'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import { Message, Product } from '../components/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const WELCOME_CHIPS = [
  'I have a headache, what can help?',
  'Show me allergy tablets',
  'Best vitamins for immunity',
  'Something for heartburn?',
  'Probiotics for gut health',
  'Pain relief for muscle aches',
];

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [analytics, setAnalytics] = useState({ total: 0, voice: 0, text: 0 });

  // Init session
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`${API}/chat/session`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.sessionId);
      } catch {
        setSessionId(uuidv4());
      }
    };
    initSession();
  }, []);

  // Load analytics
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${API}/chat/analytics`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const sendMessage = async (text: string, source: 'voice' | 'text' = 'text') => {
    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      source,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId, source }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        products: data.products as Product[],
      };

      setMessages((prev) => [...prev, botMsg]);

      // TTS auto-speak in voice mode
      if (voiceMode && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.rate = 0.95;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(
          (v) => v.name.includes('Google UK') || v.name.includes('Samantha') || v.lang === 'en-GB'
        );
        if (preferred) utterance.voice = preferred;
        window.speechSynthesis.speak(utterance);
      }

      // Update analytics
      setAnalytics((prev) => ({
        ...prev,
        total: prev.total + 1,
        voice: source === 'voice' ? prev.voice + 1 : prev.voice,
        text: source === 'text' ? prev.text + 1 : prev.text,
      }));
    } catch (err) {
      const errMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '⚠️ Sorry, I had trouble connecting to the server. Please check that the backend is running on port 3001.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    setMessages([]);
    try {
      const res = await fetch(`${API}/chat/session`, { method: 'POST' });
      const data = await res.json();
      setSessionId(data.sessionId);
    } catch {
      setSessionId(uuidv4());
    }
  };

  const voicePct = analytics.total > 0
    ? Math.round((analytics.voice / analytics.total) * 100)
    : 0;

  return (
    <div className="app-shell">
      {/* ─── SIDEBAR ─── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">💊</div>
          <div>
            <div className="sidebar-logo-text">MediBot</div>
            <div className="sidebar-logo-sub">Healthcare Assistant</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        <span className="sidebar-section-title">Voice Settings</span>

        {/* Voice Mode Toggle */}
        <div
          className="voice-mode-toggle"
          onClick={() => setVoiceMode((v) => !v)}
          role="switch"
          aria-checked={voiceMode}
          id="voice-mode-toggle"
        >
          <span className="voice-mode-label">
            <span className="icon">🎙️</span>
            Voice Mode
          </span>
          <div className={`toggle-switch ${voiceMode ? 'active' : ''}`}>
            <div className="toggle-knob" />
          </div>
        </div>

        {voiceMode && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(56,189,248,0.07)',
            border: '1px solid rgba(56,189,248,0.2)',
            fontSize: '12px',
            color: 'var(--accent-primary)',
            lineHeight: 1.5,
          }}>
            🎙️ Voice Mode active — chatbot will auto-listen and speak responses.
          </div>
        )}

        <div className="sidebar-divider" />
        <span className="sidebar-section-title">Analytics</span>

        <div className="stats-card">
          <p className="stats-card-title">Query Statistics</p>
          <div className="stats-row">
            <span className="stats-label">Total Queries</span>
            <span className="stats-value">{analytics.total}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">🎤 Voice</span>
            <span className="stats-value voice">{analytics.voice}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">⌨️ Text</span>
            <span className="stats-value text">{analytics.text}</span>
          </div>
          {analytics.total > 0 && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Voice usage</span>
                <span style={{ fontSize: '11px', color: 'var(--accent-primary)' }}>{voicePct}%</span>
              </div>
              <div style={{ height: '4px', background: 'var(--bg-glass)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${voicePct}%`,
                  background: 'var(--gradient-primary)',
                  borderRadius: '2px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <button className="new-chat-btn" onClick={handleNewChat} id="new-chat-btn">
          ✨ New Conversation
        </button>
      </aside>

      {/* ─── MAIN CHAT ─── */}
      <main className="chat-main">
        <header className="chat-header">
          <div>
            <h1 className="chat-header-title">Healthcare Assistant</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Powered by Groq · {voiceMode ? '🎙️ Voice Mode' : '⌨️ Text Mode'}
            </p>
          </div>
          <div className="chat-header-status">
            <div className="status-dot" />
            Online
          </div>
        </header>

        <div className="chat-window">
          {messages.length === 0 && !isLoading ? (
            <div className="welcome-screen">
              <div className="welcome-icon">💊</div>
              <h2 className="welcome-title">Hello, I'm MediBot!</h2>
              <p className="welcome-subtitle">
                Your AI-powered healthcare assistant. Ask me about medications,
                supplements, or health products — by typing or using your voice.
              </p>
              <div className="welcome-chips">
                {WELCOME_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    className="welcome-chip"
                    onClick={() => sendMessage(chip, 'text')}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ChatWindow messages={messages} isTyping={isLoading} />
          )}
        </div>

        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          voiceMode={voiceMode}
        />
      </main>
    </div>
  );
}
