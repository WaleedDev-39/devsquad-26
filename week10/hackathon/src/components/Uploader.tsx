"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, X } from "lucide-react";

interface Props {
  onFilesSelected: (files: File[]) => void;
  onBack: () => void;
}

export default function Uploader({ onFilesSelected, onBack }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf"
    );
    if (files.length) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        (f) => f.type === "application/pdf"
      );
      if (files.length) {
        setSelectedFiles((prev) => [...prev, ...files]);
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 rounded-2xl max-w-3xl w-full mx-auto shadow-xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Upload Submissions</h2>
        <p className="text-slate-400 text-sm mt-2">
          Upload student assignment PDFs. The AI expects names and roll numbers inside the files.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-600 bg-slate-800/30 hover:bg-slate-800/50"
        }`}
      >
        <UploadCloud className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <p className="text-slate-300 font-medium mb-2">
          Drag & drop PDF files here, or
        </p>
        <label className="inline-block cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          Browse Files
          <input
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {selectedFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-sm text-slate-200 truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedFiles.length === 0}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start AI Evaluation
        </button>
      </div>
    </motion.div>
  );
}
