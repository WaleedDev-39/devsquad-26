import { useState, useEffect } from "react";

const sportColors = {
  Football: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  Cricket: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
  Basketball: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};

const sportIcons = {
  Football: "⚽",
  Cricket: "🏏",
  Basketball: "🏀",
};

export default function MatchCard({ match }) {
  const [flash, setFlash] = useState(false);
  const [prevScores, setPrevScores] = useState({
    score1: match.score1,
    score2: match.score2,
  });

  const colors = sportColors[match.sport] || sportColors.Football;
  const icon = sportIcons[match.sport] || "🎯";

  useEffect(() => {
    if (
      match.score1 !== prevScores.score1 ||
      match.score2 !== prevScores.score2
    ) {
      setFlash(true);
      setPrevScores({ score1: match.score1, score2: match.score2 });
      const timer = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(timer);
    }
  }, [match.score1, match.score2]);

  const getStatusBadge = () => {
    switch (match.status) {
      case "live":
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/15 px-2.5 py-1 rounded-full">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse-live"></span>
            LIVE
          </span>
        );
      case "finished":
        return (
          <span className="text-xs font-semibold text-slate-400 bg-slate-700/50 px-2.5 py-1 rounded-full">
            Finished
          </span>
        );
      case "upcoming":
        return (
          <span className="text-xs font-semibold text-blue-400 bg-blue-500/15 px-2.5 py-1 rounded-full">
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  const getMatchInfo = () => {
    if (match.sport === "Football" && match.minute) {
      return `${match.minute}'`;
    }
    if (match.sport === "Cricket" && match.over) {
      return `Over ${match.over}`;
    }
    if (match.sport === "Basketball" && match.quarter) {
      return `Q${match.quarter}`;
    }
    if (match.status === "upcoming") {
      const time = new Date(match.startTime);
      return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return "";
  };

  return (
    <div
      className={`relative rounded-2xl border ${
        match.status === "live"
          ? "border-slate-600/70 bg-gradient-to-br from-slate-800/90 to-slate-900/90 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
          : "border-slate-700/40 bg-slate-800/60"
      } p-6 md:p-8 transition-all duration-300 hover:border-slate-500/80 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm`}
    >
      {/* Top row: sport badge + status */}
      <div className="flex items-center justify-between mb-8">
        <span
          className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}
        >
          <span className="text-sm">{icon}</span> {match.sport}
        </span>
        {getStatusBadge()}
      </div>

      {/* Scoreboard */}
      <div className="flex items-center justify-between gap-4">
        {/* Team 1 */}
        <div className="flex-1 text-center group cursor-default">
          <div className="text-4xl md:text-3xl mb-3 drop-shadow-md transition-transform group-hover:scale-110 duration-300">{match.team1.logo}</div>
          <p className="text-base md:text-lg font-bold text-slate-100 truncate tracking-tight">
            {match.team1.name}
          </p>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center px-2 min-w-[120px]">
          <div
            className={`text-4xl md:text-2xl font-black tracking-widest ${
              flash ? "score-flash" : "text-white"
            } drop-shadow-lg`}
          >
            {match.score1}{" "}
            <span className="text-slate-500/50 font-light mx-1">-</span>{" "}
            {match.score2}
          </div>
          {getMatchInfo() && (
            <span className="text-sm text-slate-400 mt-2 font-semibold tracking-wide bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
              {getMatchInfo()}
            </span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex-1 text-center group cursor-default">
          <div className="text-4xl md:text-3xl mb-3 drop-shadow-md transition-transform group-hover:scale-110 duration-300">{match.team2.logo}</div>
          <p className="text-base md:text-lg font-bold text-slate-100 truncate tracking-tight">
            {match.team2.name}
          </p>
        </div>
      </div>
    </div>
  );
}
