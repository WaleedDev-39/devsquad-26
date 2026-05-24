import { Chatbot } from '@/components/Chatbot';

export default function HomePage() {
  return (
    <main className="app-shell">
      {/* Background decorative elements */}
      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-3" aria-hidden="true"></div>

      <div className="app-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="10" fill="url(#brandGrad)" />
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <path d="M16 7a4 4 0 014 4v1h2a2 2 0 012 2v7a2 2 0 01-2 2H10a2 2 0 01-2-2v-7a2 2 0 012-2h2v-1a4 4 0 014-4z" fill="white" opacity="0.9"/>
                <circle cx="13" cy="15" r="1.5" fill="#6366f1"/>
                <circle cx="19" cy="15" r="1.5" fill="#6366f1"/>
              </svg>
            </div>
            <div>
              <h2 className="brand-name">HealthBot</h2>
              <p className="brand-tagline">AI Supplement Advisor</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <p className="nav-section-title">Features</p>
            <a href="#" className="nav-item nav-item-active">
              <span className="nav-icon">🤖</span>
              Symptom Checker
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">💊</span>
              Products Catalog
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">📊</span>
              Analytics
            </a>
            <a href="#" className="nav-item">
              <span className="nav-icon">📜</span>
              Chat History
            </a>
          </nav>

          <div className="sidebar-info-card">
            <h3>How it works</h3>
            <ol className="how-list">
              <li>
                <span className="how-num">1</span>
                <span>Describe your symptoms in natural language</span>
              </li>
              <li>
                <span className="how-num">2</span>
                <span>AI analyzes and maps to supplements</span>
              </li>
              <li>
                <span className="how-num">3</span>
                <span>Browse recommended products</span>
              </li>
            </ol>
          </div>

          <div className="sidebar-symptoms">
            <p className="symptoms-title">Common Symptoms</p>
            {[
              'Fatigue & Low Energy',
              'Hair Fall',
              'Weak Bones',
              'Stress & Anxiety',
              'Low Immunity',
              'Poor Sleep',
            ].map((s) => (
              <div key={s} className="symptom-chip">
                <span className="chip-dot"></span>
                {s}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <p>Powered by</p>
            <div className="powered-by">
              <span className="powered-badge">OpenAI GPT</span>
              <span className="powered-badge">LangChain</span>
              <span className="powered-badge">MongoDB</span>
            </div>
          </div>
        </aside>

        {/* Main chat area */}
        <div className="main-content">
          <Chatbot />
        </div>
      </div>
    </main>
  );
}
