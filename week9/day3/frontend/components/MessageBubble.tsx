"use client";

import TableRenderer from './TableRenderer';
import { Zap } from 'lucide-react';

export type Message = {
  id: string;
  role: 'user' | 'agent';
  content: string;
  type?: 'text' | 'table';
  memoryTrace?: string[];
};

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasMemory = !isUser && message.memoryTrace && message.memoryTrace.length > 0;

  // Try to parse table data
  let tableData: Record<string, any>[] | null = null;
  if (message.type === 'table' && message.content) {
    try {
      tableData = JSON.parse(message.content);
    } catch {
      // fallback to text
    }
  }

  return (
    <div className={`message-row ${isUser ? 'user' : 'agent'}`}>
      {/* Avatar */}
      <div className={`avatar ${isUser ? 'user' : 'agent'}`}>
        {isUser ? '👤' : '🏏'}
      </div>

      {/* Content */}
      <div className="bubble-wrapper">
        {/* Memory badge (only for agent messages with memory) */}
        {hasMemory && (
          <div className="memory-badge">
            <Zap size={9} />
            Using memory · {message.memoryTrace!.length} past question{message.memoryTrace!.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Bubble */}
        <div className={`bubble ${isUser ? 'user' : 'agent'}`}>
          {tableData ? (
            <TableRenderer data={tableData} />
          ) : (
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
          )}
        </div>
      </div>
    </div>
  );
}
