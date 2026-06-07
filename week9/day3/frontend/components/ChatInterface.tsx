"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble, { Message } from './MessageBubble';
import { Send, Loader2 } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ConversationTurn {
  userId: string;
  question: string;
  answer: string;
  answerType: 'text' | 'table';
  timestamp: string;
}

interface ChatInterfaceProps {
  userId: string;
  chatId: string;
  onHistoryUpdate: (history: ConversationTurn[]) => void;
  onSummaryUpdate: (summary: string | null) => void;
  refreshTrigger: number;
  onSessionNeedsRefresh?: () => void;
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'agent',
  content:
    'Hello! 🏏 I\'m your Memory-Powered Cricket AI.\n\nI remember our past conversations, so you can ask follow-up questions like:\n• "Who has the most sixes in T20?"\n• "And in ODI?" ← I\'ll understand the context!\n\nAsk me anything about Test, ODI, or T20 cricket stats.',
  type: 'text',
};

export default function ChatInterface({
  userId,
  chatId,
  onHistoryUpdate,
  onSummaryUpdate,
  refreshTrigger,
  onSessionNeedsRefresh,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history when chatId changes
  useEffect(() => {
    if (!chatId) return;

    const loadChatHistory = async () => {
      try {
        const response = await fetch(`${API}/history/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          const historyTurns: ConversationTurn[] = data.history || [];

          // Map history turns to Message structures
          const historyMessages: Message[] = historyTurns.flatMap((turn, index) => {
            const userMsg: Message = {
              id: `hist-user-${index}-${turn.timestamp}`,
              role: 'user',
              content: turn.question,
            };
            const agentMsg: Message = {
              id: `hist-agent-${index}-${turn.timestamp}`,
              role: 'agent',
              content: turn.answer,
              type: turn.answerType,
              memoryTrace: [],
            };
            return [userMsg, agentMsg];
          });

          setMessages([WELCOME, ...historyMessages]);
          onHistoryUpdate(historyTurns);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadChatHistory();
  }, [chatId, refreshTrigger, onHistoryUpdate]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // Fetch updated history + summary from backend
  const refreshMemory = useCallback(async () => {
    if (!chatId) return;
    try {
      const [histRes, sumRes] = await Promise.all([
        fetch(`${API}/history/${chatId}`),
        fetch(`${API}/summary/${chatId}`),
      ]);
      if (histRes.ok) {
        const histData = await histRes.json();
        onHistoryUpdate(histData.history || []);
      }
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        onSummaryUpdate(sumData.summary || null);
      }
    } catch {
      // silent fail — memory sidebar is non-critical
    }
  }, [chatId, onHistoryUpdate, onSummaryUpdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    try {
      const response = await fetch(`${API}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, chatId, question }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: data.answer,
        type: data.type,
        memoryTrace: data.memoryTrace || [],
      };

      setMessages((prev) => [...prev, agentMessage]);

      // Refresh sidebar after answer
      await refreshMemory();
      if (onSessionNeedsRefresh) onSessionNeedsRefresh();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: '⚠️ Sorry, I couldn\'t connect to the server. Make sure the backend is running on port 3001.',
          type: 'text',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit on Enter (not Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <>
      {/* Messages */}
      <div className="chat-area">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="typing-indicator">
            <div className="avatar agent" style={{ width: 34, height: 34 }}>🏏</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div className="typing-dots">
                <span /><span /><span />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Querying cricket data…
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-area">
        <form className="input-form" onSubmit={handleSubmit} id="chat-form">
          <textarea
            ref={inputRef}
            id="question-input"
            className="input-field"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about cricket stats… (Enter to send, Shift+Enter for newline)"
            disabled={isLoading}
            rows={1}
          />
          <button
            id="send-btn"
            type="submit"
            className="send-btn"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
        <div className="input-hint">
          Memory-powered · Test · ODI · T20 · {userId.slice(0, 8)}
        </div>
      </div>
    </>
  );
}
