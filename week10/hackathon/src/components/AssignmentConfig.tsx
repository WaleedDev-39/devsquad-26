"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldAlert, Target } from "lucide-react";

export type EvaluationMode = "strict" | "loose";

interface Props {
  onNext: (topic: string, mode: EvaluationMode, maxScore: number) => void;
}

export default function AssignmentConfig({ onNext }: Props) {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<EvaluationMode>("loose");
  const [maxScore, setMaxScore] = useState<number>(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onNext(topic, mode, maxScore);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-8 rounded-2xl max-w-2xl w-full mx-auto shadow-xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <Sparkles className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Assignment Setup</h2>
          <p className="text-slate-400 text-sm mt-1">Define the grading criteria for the AI.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Assignment Topic & Instructions
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            rows={4}
            placeholder="e.g. Write an essay on mental health, 500 words. Must include an introduction, 3 body paragraphs, and a conclusion."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Maximum Score
          </label>
          <input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            min={1}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-4">
            Evaluation Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setMode("loose")}
              className={`p-4 rounded-xl border flex flex-col gap-2 items-start transition-all ${
                mode === "loose"
                  ? "bg-blue-500/10 border-blue-500 ring-1 ring-blue-500"
                  : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <Target className="w-5 h-5" />
                Loose Marking
              </div>
              <p className="text-sm text-slate-400 text-left">
                Flexible grading. Rewards effort, partial credit for attempting requirements.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode("strict")}
              className={`p-4 rounded-xl border flex flex-col gap-2 items-start transition-all ${
                mode === "strict"
                  ? "bg-red-500/10 border-red-500 ring-1 ring-red-500"
                  : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <ShieldAlert className="w-5 h-5" />
                Strict Marking
              </div>
              <p className="text-sm text-slate-400 text-left">
                Penalizes off-topic, missing sections, and not meeting strict limits.
              </p>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!topic.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Upload Submissions
        </button>
      </form>
    </motion.div>
  );
}
