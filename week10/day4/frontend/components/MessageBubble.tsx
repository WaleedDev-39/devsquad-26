'use client';

import { useState } from 'react';
import { Message } from './types';
import ProductCard from './ProductCard';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [speaking, setSpeaking] = useState(false);
  const isUser = message.role === 'user';

  const formatTime = (d: Date) => {
    const date = new Date(d);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTTS = () => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Pick a pleasant voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.name.includes('Google UK') || v.name.includes('Samantha') || v.lang === 'en-GB'
      );
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`message-row ${isUser ? 'user' : ''}`}>
      <div className={`message-avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? '👤' : '🤖'}
      </div>

      <div className="message-content">
        <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>
          {message.content}
        </div>

        <div className="message-meta">
          <span className="message-time">{formatTime(message.timestamp)}</span>

          {message.source === 'voice' && (
            <span className="message-source-badge">
              🎤 Voice
            </span>
          )}

          {!isUser && (
            <button
              className={`tts-btn ${speaking ? 'speaking' : ''}`}
              onClick={handleTTS}
              title={speaking ? 'Stop speaking' : 'Read aloud'}
              id={`tts-${message.id}`}
            >
              {speaking ? '🔇' : '🔊'}
            </button>
          )}
        </div>

        {!isUser && message.products && message.products.length > 0 && (
          <div className="products-section">
            <p className="products-section-title">💊 Suggested Products</p>
            <div className="products-grid">
              {message.products.map((product) => (
                <ProductCard key={product._id || product.name} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
