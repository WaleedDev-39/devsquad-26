'use client';

import { ChatMessage } from '@/types';
import { ProductCard } from './ProductCard';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="system-message">
        <span>{message.content}</span>
      </div>
    );
  }

  // Parse markdown bold for the message content
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`message-wrapper ${isUser ? 'message-user' : 'message-assistant'}`}>
      {!isUser && (
        <div className="avatar avatar-bot">
          <svg viewBox="0 0 24 24" fill="none" className="bot-icon">
            <path
              d="M12 2a2 2 0 012 2v1h3a2 2 0 012 2v2h1a1 1 0 010 2h-1v4a2 2 0 01-2 2H7a2 2 0 01-2-2V9H4a1 1 0 010-2h1V7a2 2 0 012-2h3V4a2 2 0 012-2z"
              fill="currentColor"
            />
            <circle cx="9" cy="11" r="1.5" fill="white" />
            <circle cx="15" cy="11" r="1.5" fill="white" />
          </svg>
        </div>
      )}

      <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        {message.isLoading ? (
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        ) : (
          <>
            <p className="bubble-text">{renderContent(message.content)}</p>

            {/* Detected symptoms tags */}
            {message.detectedSymptoms && message.detectedSymptoms.length > 0 && (
              <div className="symptom-tags">
                <span className="tags-label">Detected symptoms:</span>
                {message.detectedSymptoms.map((s, i) => (
                  <span key={i} className="symptom-tag">{s}</span>
                ))}
              </div>
            )}

            {/* Confidence score */}
            {message.confidenceScore !== undefined && (
              <div className="confidence-bar-wrapper">
                <span className="confidence-label">
                  AI Confidence: {Math.round(message.confidenceScore * 100)}%
                </span>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${message.confidenceScore * 100}%`,
                      backgroundColor:
                        message.confidenceScore > 0.75
                          ? '#10b981'
                          : message.confidenceScore > 0.5
                          ? '#f59e0b'
                          : '#ef4444',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Follow-up question */}
            {message.needsFollowUp && message.followUpQuestion && (
              <div className="follow-up-box">
                <span className="follow-up-icon">💬</span>
                <span>{message.followUpQuestion}</span>
              </div>
            )}

            {/* Product cards */}
            {message.products && message.products.length > 0 && (
              <div className="products-grid">
                {message.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            <span className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </>
        )}
      </div>

      {isUser && (
        <div className="avatar avatar-user">
          <svg viewBox="0 0 24 24" fill="none" className="user-icon">
            <circle cx="12" cy="8" r="4" fill="currentColor" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
