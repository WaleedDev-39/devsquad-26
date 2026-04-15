import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetMatchesQuery, matchApi } from "../services/matchApi";
import socket from "../socket";
import MatchCard from "./MatchCard";

export default function MatchList() {
  const dispatch = useDispatch();
  const { data: matches, isLoading, isError, error } = useGetMatchesQuery();
  const [filter, setFilter] = useState("all");

  // Listen for real-time score updates and patch RTK Query cache
  useEffect(() => {
    const handleScoreUpdate = (update) => {
      dispatch(
        matchApi.util.updateQueryData("getMatches", undefined, (draft) => {
          const match = draft.find((m) => m.id === update.matchId);
          if (match) {
            match.score1 = update.score1;
            match.score2 = update.score2;
            if (update.minute !== undefined) match.minute = update.minute;
            if (update.over !== undefined) match.over = update.over;
            if (update.quarter !== undefined) match.quarter = update.quarter;
          }
        }),
      );
    };

    socket.on("scoreUpdate", handleScoreUpdate);
    return () => socket.off("scoreUpdate", handleScoreUpdate);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mb-3"></div>
          <p className="text-slate-400">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
          <p className="text-red-400 font-medium mb-1">
            Failed to load matches
          </p>
          <p className="text-sm text-slate-400">
            {error?.error ||
              "Make sure the backend server is running on port 4000"}
          </p>
        </div>
      </div>
    );
  }

  const filters = [
    { label: "All", value: "all" },
    { label: "🔴 Live", value: "live" },
    { label: "⚽ Football", value: "Football" },
    { label: "🏏 Cricket", value: "Cricket" },
    { label: "🏀 Basketball", value: "Basketball" },
  ];

  const filteredMatches = matches?.filter((match) => {
    if (filter === "all") return true;
    if (filter === "live") return match.status === "live";
    return match.sport === filter;
  });

  return (
    <div className="max-w-7xl mx-auto py-10 md:py-12 px-6">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer border ${
              filter === f.value
                ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] transform scale-105"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-500 hover:shadow-lg"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Matches count */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-slate-200">Live Matches</h2>
        <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
          {filteredMatches?.length || 0}
        </span>
      </div>

      {/* Match grid */}
      {filteredMatches?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-slate-800/20 rounded-3xl border border-slate-800 border-dashed">
          <span className="text-5xl mb-4 opacity-50">🏟️</span>
          <p className="text-lg font-medium">
            No matches found for this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredMatches?.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
