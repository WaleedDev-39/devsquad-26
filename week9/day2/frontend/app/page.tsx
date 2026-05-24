import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="container">
      <div className="header">
        <h1>🏏 Cricket <span>Data Agent</span></h1>
        <p>Ask me anything about Test, ODI, or T20 cricket statistics.</p>
      </div>
      <ChatInterface />
    </main>
  );
}
