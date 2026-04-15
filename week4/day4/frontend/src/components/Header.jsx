export default function Header() {
  return (
    <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 md:py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl drop-shadow-lg">⚡</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
              Live Sports Scores
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              Real-time updates via Socket.IO
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-300 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 shadow-inner">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          Connected
        </div>
      </div>
    </header>
  );
}
