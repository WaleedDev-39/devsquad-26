"use client";

import { useState } from "react";
import AssignmentConfig, { EvaluationMode } from "@/components/AssignmentConfig";
import Uploader from "@/components/Uploader";
import Results, { EvaluationResult } from "@/components/Results";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "config" | "upload" | "processing" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("config");
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<EvaluationMode>("loose");
  const [maxScore, setMaxScore] = useState<number>(100);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [progress, setProgress] = useState(0);

  const handleConfigNext = (
    newTopic: string,
    newMode: EvaluationMode,
    newMaxScore: number
  ) => {
    setTopic(newTopic);
    setMode(newMode);
    setMaxScore(newMaxScore);
    setStep("upload");
  };

  const handleFilesSelected = async (files: File[]) => {
    setStep("processing");
    setProgress(0);
    const newResults: EvaluationResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("topic", topic);
        formData.append("mode", mode);
        formData.append("maxScore", maxScore.toString());

        const response = await fetch("/api/evaluate", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Server error during evaluation");
        }

        const data = await response.json();
        newResults.push({ ...data, fileName: file.name, status: "success" });
      } catch (err: any) {
        newResults.push({
          fileName: file.name,
          studentName: "",
          rollNumber: "",
          score: 0,
          remarks: "",
          status: "error",
          errorMessage: err.message || "Failed to process PDF",
        });
      }

      setProgress(Math.round(((i + 1) / files.length) * 100));
    }

    setResults(newResults);
    setStep("results");
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            AI <span className="gradient-text">Assignment Checker</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Automate your grading process. Upload assignment guidelines and student PDF submissions,
            and let AI intelligently evaluate and generate a comprehensive marks sheet.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {step === "config" && (
            <motion.div key="config" exit={{ opacity: 0, y: -20 }}>
              <AssignmentConfig onNext={handleConfigNext} />
            </motion.div>
          )}

          {step === "upload" && (
            <motion.div key="upload" exit={{ opacity: 0, y: -20 }}>
              <Uploader
                onFilesSelected={handleFilesSelected}
                onBack={() => setStep("config")}
              />
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-300">
                    {progress}%
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mt-6">
                Evaluating Submissions
              </h3>
              <p className="text-slate-400 mt-2">
                Our AI is reading and grading each assignment...
              </p>
              <div className="w-64 h-2 bg-slate-800 rounded-full mt-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" exit={{ opacity: 0, y: -20 }}>
              <Results
                results={results}
                maxScore={maxScore}
                onReset={() => {
                  setStep("config");
                  setResults([]);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
