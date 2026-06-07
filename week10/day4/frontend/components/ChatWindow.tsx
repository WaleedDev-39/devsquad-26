'use client';

import { useRef, useEffect } from 'react';
import { Message } from './types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
}

export default function ChatWindow({ messages, isTyping }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    return null; // parent renders welcome screen
  }

  return (
    <>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isTyping && (
        <div className="message-row">
          <div className="message-avatar bot">🤖</div>
          <div className="message-content">
            <div className="message-bubble bot">
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </>
  );
}
