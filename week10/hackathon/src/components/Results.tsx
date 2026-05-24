"use client";

import { motion } from "framer-motion";
import { Download, CheckCircle, AlertTriangle, User } from "lucide-react";
import Papa from "papaparse";

export interface EvaluationResult {
  fileName: string;
  studentName: string;
  rollNumber: string;
  score: number;
  remarks: string;
  status: "success" | "error";
  errorMessage?: string;
}

interface Props {
  results: EvaluationResult[];
  maxScore: number;
  onReset: () => void;
}

export default function Results({ results, maxScore, onReset }: Props) {
  const handleExport = () => {
    const csvData = results.map((r) => ({
      "File Name": r.fileName,
      "Student Name": r.studentName || "Unknown",
      "Roll Number": r.rollNumber || "Unknown",
      Score: r.status === "success" ? `${r.score}/${maxScore}` : "N/A",
      Remarks: r.status === "success" ? r.remarks : r.errorMessage,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "assignment_marks_sheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-8 rounded-2xl w-full max-w-5xl mx-auto shadow-xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Evaluation Results</h2>
          <p className="text-slate-400 text-sm mt-1">
            {results.length} submissions processed.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            Start New
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-300 text-sm border-b border-slate-700">
              <th className="p-4 font-semibold">Student Info</th>
              <th className="p-4 font-semibold">Score</th>
              <th className="p-4 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 bg-slate-900/30">
            {results.map((res, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-slate-800/30 transition-colors"
              >
                <td className="p-4 align-top">
                  {res.status === "error" ? (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{res.fileName}</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-slate-800 p-2 rounded-lg">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">
                          {res.studentName || "Not Found"}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Roll No: {res.rollNumber || "Not Found"}
                        </div>
                        <div className="text-xs text-slate-600 mt-1 truncate max-w-[150px]">
                          {res.fileName}
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="p-4 align-top">
                  {res.status === "success" ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold border border-blue-500/20">
                      {res.score} <span className="text-blue-500/50">/ {maxScore}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-sm">Failed</span>
                  )}
                </td>
                <td className="p-4 align-top">
                  {res.status === "success" ? (
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {res.remarks}
                    </p>
                  ) : (
                    <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                      {res.errorMessage}
                    </p>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
