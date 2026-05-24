'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types';
import { checkSymptoms } from '@/lib/api';
import { MessageBubble } from './MessageBubble';
import { VoiceInput } from './VoiceInput';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "👋 Hello! I'm your AI Health Assistant. Describe your symptoms and I'll suggest the best supplements for you.\n\nFor example, try: \"I feel tired and weak\" or \"I'm losing hair\" or \"My bones are fragile\"",
  timestamp: new Date(),
};

const QUICK_PROMPTS = [
  { label: '😴 Tired & Weak', text: 'I feel tired and weak all the time' },
  { label: '💇 Hair Loss', text: "I'm losing hair and my nails are brittle" },
  { label: '🦴 Weak Bones', text: 'My bones feel fragile and I have joint pain' },
  { label: '😰 Stressed', text: 'I feel stressed and anxious and cannot sleep' },
  { label: '🤒 Low Immunity', text: 'I keep getting colds and feel my immunity is low' },
  { label: '😵 Dizzy', text: "I often feel dizzy and lightheaded" },
];

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      const loadingMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await checkSymptoms(text.trim(), sessionId);

        const aiMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
          products: response.products,
          detectedSymptoms: response.detectedSymptoms,
          confidenceScore: response.confidenceScore,
          needsFollowUp: response.needsFollowUp,
          followUpQuestion: response.followUpQuestion,
        };

        setMessages((prev) => {
          const withoutLoading = prev.filter((m) => !m.isLoading);
          return [...withoutLoading, aiMessage];
        });
      } catch (error) {
        const errMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content:
            '⚠️ Sorry, I encountered an issue connecting to the AI service. Please make sure the backend is running and your OpenAI API key is configured.',
          timestamp: new Date(),
        };
        setMessages((prev) => {
          const withoutLoading = prev.filter((m) => !m.isLoading);
          return [...withoutLoading, errMessage];
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
    inputRef.current?.focus();
  };

  const handleQuickPrompt = (text: string) => {
    sendMessage(text);
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <div className="header-left">
          <div className="bot-avatar-large">
            <svg viewBox="0 0 40 40" fill="none" className="bot-svg">
              <rect width="40" height="40" rx="12" fill="url(#grad)" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M20 8a4 4 0 014 4v2h4a2 2 0 012 2v10a2 2 0 01-2 2H12a2 2 0 01-2-2V16a2 2 0 012-2h4v-2a4 4 0 014-4z" fill="white" opacity="0.9" />
              <circle cx="16" cy="19" r="2" fill="#6366f1" />
              <circle cx="24" cy="19" r="2" fill="#6366f1" />
              <rect x="17" y="24" width="6" height="1.5" rx="0.75" fill="#6366f1" />
            </svg>
          </div>
          <div>
            <h1 className="header-title">AI Symptom Checker</h1>
            <p className="header-subtitle">Powered by OpenAI · Health Supplement Assistant</p>
          </div>
        </div>
        <div className="header-right">
          <div className="online-indicator">
            <span className="online-dot"></span>
            <span>Online</span>
          </div>
          <button onClick={clearChat} className="btn-clear" title="Clear chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="icon-sm">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="quick-prompts">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            className="quick-prompt-btn"
            onClick={() => handleQuickPrompt(prompt.text)}
            disabled={isLoading}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="messages-area" id="messages-area">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            id="symptom-input"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms... (e.g. I feel tired and have hair fall)"
            rows={1}
            disabled={isLoading}
            aria-label="Type your symptoms"
          />
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
          <button
            type="submit"
            className="btn-send"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            id="send-button"
          >
            {isLoading ? (
              <svg viewBox="0 0 24 24" className="icon-spin icon-sm" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeDasharray="31" strokeDashoffset="10" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="icon-sm">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            )}
          </button>
        </div>
        <p className="input-hint">Press Enter to send · Shift+Enter for new line · 🎤 for voice</p>
      </form>
    </div>
  );
}
