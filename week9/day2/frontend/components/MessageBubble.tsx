import { Message } from './ChatInterface';
import TableRenderer from './TableRenderer';

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: isUser ? '80%' : '100%',
      backgroundColor: isUser ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
      color: isUser ? 'white' : 'var(--text-main)',
      padding: '1rem',
      borderRadius: '12px',
      borderBottomRightRadius: isUser ? '4px' : '12px',
      borderBottomLeftRadius: isUser ? '12px' : '4px',
      lineHeight: '1.5'
    }}>
      {message.type === 'table' ? (
        <TableRenderer data={message.content} />
      ) : (
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
      )}
    </div>
  );
}
