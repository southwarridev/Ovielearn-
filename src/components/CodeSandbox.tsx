import React, { useState, useEffect } from "react";
import { Lesson } from "../types";
import {
  Play,
  Sparkles,
  RotateCcw,
  Terminal,
  Activity,
  FileCode,
  GraduationCap,
  Scale
} from "lucide-react";

interface CodeSandboxProps {
  lesson: Lesson;
  onCodeRunStatus: (success: boolean) => void;
}

export default function CodeSandbox({
  lesson,
  onCodeRunStatus,
}: CodeSandboxProps) {
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<"terminal" | "compiler" | "tutor">("terminal");
  const [running, setRunning] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [stdout, setStdout] = useState("");
  const [logs, setLogs] = useState("");
  const [tutorFeedback, setTutorFeedback] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  // Initialize lesson code boilerplate
  useEffect(() => {
    setCode(lesson.codeBoilerplate);
    setStdout("");
    setLogs("");
    setTutorFeedback("");
    setErrorStatus(false);
  }, [lesson]);

  // Count lines for editor line-numbers sidebar
  const getLineNumbers = () => {
    const lines = code.split("\n");
    return Array.from({ length: Math.max(lines.length, 1) }, (_, i) => i + 1);
  };

  // Compile code via post request
  const handleRunCompiler = async (triggerAi: boolean = false) => {
    if (triggerAi) {
      setAiAnalyzing(true);
      setActiveTab("tutor");
    } else {
      setRunning(true);
      setActiveTab("terminal");
    }

    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, lessonId: lesson.id }),
      });
      const data = await res.json();

      setErrorStatus(!data.success);
      setStdout(data.stdout || "");
      setLogs(data.compilationLogs || "");
      onCodeRunStatus(data.success);

      if (data.feedback) {
        setTutorFeedback(data.feedback);
      }

      // If they ran the compiler (non-AI), print a short log at the top of terminal
      if (!triggerAi) {
        setLogs(prev => `[Running Local Sandbox Simulator]\n${prev}`);
      }
    } catch (err) {
      console.error("Compilation error:", err);
      setStdout("");
      setErrorStatus(true);
      setLogs("[Error] Failed to connect to Ovie compilation server. Please try again.");
      setTutorFeedback("The compiler backend is offline or unreachable. Check your server connection.");
    } finally {
      setRunning(false);
      setAiAnalyzing(false);
    }
  };

  // Reset core code
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your code helper to default class templates?")) {
      setCode(lesson.codeBoilerplate);
      setErrorStatus(false);
      setStdout("");
      setLogs("");
      setTutorFeedback("");
    }
  };

  // Format tutor markdown paragraphs
  const renderTutorFeedbackHTML = (markdown: string) => {
    if (!markdown) return <p className="text-slate-400 text-xs italic">Compile code or click 'Ask Gemini Coach' to get smart feedback.</p>;
    const paragraphs = markdown.split("\n");

    return paragraphs.map((par, i) => {
      if (par.startsWith("### ")) {
        return <h4 key={i} className="text-slate-100 text-xs font-bold mt-4 mb-2 first:mt-0">{par.replace("### ", "")}</h4>;
      }
      if (par.startsWith("- ") || par.startsWith("* ")) {
        return <li key={i} className="text-[11px] text-slate-300 ml-3 list-disc py-0.5 leading-relaxed">{par.substring(2)}</li>;
      }
      if (par.trim() === "") return <div key={i} className="h-1.5" />;
      return <p key={i} className="text-[11px] text-slate-350 leading-relaxed">{par}</p>;
    });
  };

  return (
    <div className="bg-slate-950 flex flex-col h-full overflow-hidden select-none">
      
      {/* Sandbox header bar with controllers */}
      <div className="bg-slate-950 border-b border-slate-850 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode size={14} className="text-amber-500" />
          <span className="text-[11px] font-semibold text-slate-200">main.ovie</span>
          <span className="text-[9px] font-mono text-slate-500 bg-slate-900 border border-slate-850 px-1 py-0.5 rounded leading-none select-none">
            MODULE: MAIN
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Code */}
          <button
            onClick={handleReset}
            title="Reset code template"
            className="p-1.5 hover:bg-slate-900 rounded text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-850/60 transition-all active:scale-95"
          >
            <RotateCcw size={13} />
          </button>

          {/* Ask Gemini Coach */}
          <button
            disabled={aiAnalyzing || running}
            onClick={() => handleRunCompiler(true)}
            className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 active:bg-yellow-500/30 text-[11px] font-semibold text-yellow-500 px-3 py-1.5 rounded-lg border border-yellow-500/30 hover:border-yellow-500/50 transition-all disabled:opacity-40"
            title="Run Ovie's intelligent code analyzer"
          >
            <Sparkles size={11} className={aiAnalyzing ? "animate-spin text-yellow-500" : "text-yellow-500"} />
            {aiAnalyzing ? "Aproko Analyzing..." : "Run Aproko Analyze"}
          </button>

          {/* Play / Compile */}
          <button
            disabled={running || aiAnalyzing}
            onClick={() => handleRunCompiler(false)}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 active:bg-green-600 text-[11px] font-bold text-slate-950 px-3.5 py-1.5 rounded-lg transition-all disabled:opacity-50 shadow-md shadow-green-950/30"
          >
            <Play size={11} className={`fill-slate-950 ${running ? "animate-pulse" : ""}`} />
            {running ? "Compiling..." : "Run Code"}
          </button>
        </div>
      </div>

      {/* Editor Main Canvas Body */}
      <div className="flex-1 min-h-[220px] flex overflow-hidden font-mono text-[11.5px] leading-relaxed relative bg-slate-980">
        
        {/* Sidebar Line Numbers */}
        <div className="border-r border-slate-900 bg-slate-955 px-2.5 py-4 text-right text-slate-600 text-[10px] select-none text-right flex flex-col tracking-tight leading-loose shrink-0 select-none">
          {getLineNumbers().map((num) => (
            <div key={num} className="h-5">
              {num}
            </div>
          ))}
        </div>

        {/* Text Area Code Inputs */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-slate-950 px-4 py-4 text-slate-300 focus:outline-none resize-none font-mono text-[11.5px] leading-loose focus:ring-0 overflow-y-auto z-10 select-text"
          placeholder="// Type your Ovie code here..."
        />
      </div>

      {/* Compiler Output tab controls */}
      <div className="bg-slate-950 border-t border-slate-850 flex items-center justify-between px-3 shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab("terminal")}
            id="tab-terminal-output"
            className={`py-2 px-3 text-[10.5px] font-medium border-b-2 text-center transition-all flex items-center gap-1.5 ${
              activeTab === "terminal"
                ? "border-green-500 text-green-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal size={11} />
            Terminal Console
          </button>
          <button
            onClick={() => setActiveTab("compiler")}
            id="tab-compiler-logs"
            className={`py-2 px-3 text-[10.5px] font-medium border-b-2 text-center transition-all flex items-center gap-1.5 ${
              activeTab === "compiler"
                ? "border-amber-500 text-amber-400 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity size={11} />
            Compiler Diagnostics
          </button>
          <button
            onClick={() => setActiveTab("tutor")}
            id="tab-gemini-tutor"
            className={`py-2 px-3 text-[10.5px] font-medium border-b-2 text-center transition-all flex items-center gap-1.5 ${
              activeTab === "tutor"
                ? "border-yellow-500 text-yellow-450 font-semibold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap size={11} className="text-yellow-500" />
            Aproko Analyzer AI
          </button>
        </div>
      </div>

      {/* Tab Panel Body (Scrollable display blocks) */}
      <div className="h-36 bg-slate-950 border-t border-slate-900 overflow-y-auto px-4 py-3.5 select-text font-mono">
        {activeTab === "terminal" && (
          <div className="space-y-1">
            {running ? (
              <p className="text-yellow-500 text-[10.5px] animate-pulse">Running compilation checks on server...</p>
            ) : stdout ? (
              <pre className="text-green-400 text-[11px] leading-relaxed whitespace-pre-wrap">{stdout}</pre>
            ) : errorStatus ? (
              <pre className="text-red-400 text-[11px] leading-relaxed whitespace-pre-wrap">[Error] Build was aborted. Check diagnostics log tab for precise warnings.</pre>
            ) : (
              <p className="text-slate-600 text-[10.5px] italic leading-normal">
                No active execution found. Write some Ovie code and click "Run Code" above.
              </p>
            )}
          </div>
        )}

        {activeTab === "compiler" && (
          <div className="space-y-1">
            {logs ? (
              <pre className={`text-[10px] leading-relaxed whitespace-pre-wrap font-mono ${errorStatus ? "text-red-400/90" : "text-slate-400"}`}>
                {logs}
              </pre>
            ) : (
              <p className="text-slate-600 text-[10.5px] italic leading-normal">
                Diagnostics logs are generated automatically after each compilation cycle.
              </p>
            )}
          </div>
        )}

        {activeTab === "tutor" && (
          <div className="font-sans space-y-2 select-text">
            {aiAnalyzing ? (
              <div className="flex items-center gap-2 text-yellow-500 text-xs animate-pulse font-mono">
                <Sparkles size={12} className="animate-spin text-yellow-500" />
                Aproko Code Analyzer is inspecting memory buffers, safety regulations, and syntax...
              </div>
            ) : (
              <div className="space-y-2 leading-relaxed">
                {renderTutorFeedbackHTML(tutorFeedback)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
