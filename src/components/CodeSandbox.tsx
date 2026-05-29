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
  Scale,
  AlignLeft,
  Smartphone
} from "lucide-react";

interface CodeSandboxProps {
  theme?: "dark" | "light";
  lesson: Lesson;
  onCodeRunStatus: (success: boolean) => void;
}

export default function CodeSandbox({
  theme = "dark",
  lesson,
  onCodeRunStatus,
}: CodeSandboxProps) {
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<"terminal" | "compiler" | "tutor" | "phone">("terminal");
  const [running, setRunning] = useState(false);
  const [formatting, setFormatting] = useState(false);
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

  // Format code via Prettier or fallback systems indentation formatter
  const handleFormatCode = async () => {
    if (!code || formatting) return;
    setFormatting(true);
    try {
      const res = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.formatted) {
          setCode(data.formatted);
        }
      }
    } catch (err) {
      console.error("Format error:", err);
    } finally {
      setFormatting(false);
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
    <div className={`flex flex-col h-full overflow-hidden select-none transition-colors duration-300 ${theme === "light" ? "bg-white" : "bg-slate-950"}`}>
      
      {/* Sandbox header bar with controllers */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b transition-colors duration-300 ${theme === "light" ? "bg-white/80 border-slate-205 border-slate-200" : "bg-slate-950 border-slate-850"}`}>
        <div className="flex items-center gap-2">
          <FileCode size={14} className="text-amber-500" />
          <span className={`text-[11px] font-semibold transition-colors duration-300 ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>main.ovie</span>
          <span className={`text-[9px] font-mono border px-1 py-0.5 rounded leading-none select-none transition-colors duration-300 ${theme === "light" ? "text-slate-500 bg-slate-50 border-slate-250" : "text-slate-500 bg-slate-900 border-slate-850"}`}>
            MODULE: MAIN
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Code */}
          <button
            onClick={handleReset}
            title="Reset code template"
            className={`p-1.5 rounded border transition-all active:scale-95 ${theme === "light" ? "hover:bg-slate-150 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border-transparent hover:border-slate-300" : "hover:bg-slate-900 text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-850/60"}`}
          >
            <RotateCcw size={13} />
          </button>

          {/* Format Code */}
          <button
            onClick={handleFormatCode}
            disabled={formatting || running}
            title="Format Ovie Code (Prettier styles)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all active:scale-95 disabled:opacity-40 border ${theme === "light" ? "hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900" : "hover:bg-slate-900 border-slate-850 text-slate-300 hover:text-slate-100"}`}
          >
            <AlignLeft size={11} className={formatting ? "animate-spin text-amber-500" : "text-amber-500"} />
            <span>{formatting ? "Formatting..." : "Format Code"}</span>
          </button>

          {/* Ask Gemini Coach */}
          <button
            disabled={aiAnalyzing || running}
            onClick={() => handleRunCompiler(true)}
            className="flex items-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 active:bg-yellow-500/30 text-[11px] font-semibold text-yellow-600 px-3 py-1.5 rounded-lg border border-yellow-500/30 hover:border-yellow-500/50 transition-all disabled:opacity-40"
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
        <div className={`border-r px-2.5 py-4 text-right text-[10px] select-none flex flex-col tracking-tight leading-loose shrink-0 transition-all duration-300 ${theme === "light" ? "border-slate-200 bg-slate-50/50 text-slate-450 text-slate-400" : "border-slate-900 bg-slate-955 text-slate-600"}`}>
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
          className={`flex-1 px-4 py-4 focus:outline-none resize-none font-mono text-[11.5px] leading-loose focus:ring-0 overflow-y-auto z-10 select-text transition-all duration-300 ${theme === "light" ? "bg-white text-slate-900 placeholder:text-slate-400" : "bg-slate-950 text-slate-300 placeholder:text-slate-650 text-slate-600"}`}
          placeholder="// Type your Ovie code here..."
        />
      </div>

      {/* Compiler Output tab controls */}
      <div className={`border-t flex items-center justify-between px-3 shrink-0 transition-colors duration-300 ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-850"}`}>
        <div className="flex">
          <button
            onClick={() => setActiveTab("terminal")}
            id="tab-terminal-output"
            className={`py-2 px-3 text-[10.5px] font-medium border-b-2 text-center transition-all flex items-center gap-1.5 ${
              activeTab === "terminal"
                ? "border-green-500 text-green-600 font-bold"
                : theme === "light"
                  ? "border-transparent text-slate-550 hover:text-slate-800"
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
                ? "border-amber-500 text-amber-500 font-bold"
                : theme === "light"
                  ? "border-transparent text-slate-550 hover:text-slate-800"
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
                ? "border-yellow-500 text-yellow-600 font-bold"
                : theme === "light"
                  ? "border-transparent text-slate-550 hover:text-slate-800"
                  : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap size={11} className="text-yellow-600" />
            Aproko Analyzer AI
          </button>
          <button
            onClick={() => setActiveTab("phone")}
            id="tab-virtual-phone"
            className={`py-2 px-3 text-[10.5px] font-medium border-b-2 text-center transition-all flex items-center gap-1.5 ${
              activeTab === "phone"
                ? "border-amber-500 text-amber-500 font-bold"
                : theme === "light"
                  ? "border-transparent text-slate-550 hover:text-slate-800"
                  : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
            title="Preview Ovie .ov Mobile Framework layout"
          >
            <Smartphone size={11} className="text-amber-500 animate-pulse" />
            Virtual Device 📱
          </button>
        </div>
      </div>

      {/* Tab Panel Body (Scrollable display blocks) */}
      <div className={`border-t overflow-y-auto px-4 py-3 select-text font-mono transition-all duration-300 ${activeTab === 'phone' ? 'h-72' : 'h-36'} ${theme === "light" ? "bg-slate-50/50 border-slate-205 border-slate-200 text-slate-800" : "bg-slate-950 border-slate-900 text-white"}`}>
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

        {activeTab === "phone" && (
          <div className="flex flex-col md:flex-row items-center gap-6 justify-center h-full text-slate-100 font-sans p-1">
            {/* Informative Label side */}
            <div className="hidden md:block max-w-[240px] space-y-2 select-none">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">
                Kpalasa mobile Framework
              </span>
              <h4 className="text-xs font-semibold text-slate-200">Interactive live sandbox emulator</h4>
              <p className="text-[10.5px] text-slate-400 leading-normal">
                Ovie compiles layout stream directives directly into virtual representation tree nodes. Try editing <code className="text-slate-200 font-mono">makeText</code>, <code className="text-slate-200 font-mono">makeButton</code>, or <code className="text-slate-200 font-mono">makeInput</code> parameters!
              </p>
            </div>

            {/* Simulated Phone Chassis */}
            <div className="w-[200px] h-full bg-slate-900 rounded-3xl border-[5px] border-slate-750 shadow-2xl relative flex flex-col overflow-hidden shrink-0 select-none">
              {/* Camera Notch placeholder */}
              <div className="absolute top-0 left-12 right-12 h-3.5 bg-slate-750 rounded-b-xl z-30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-slate-800" />
              </div>

              {/* Status bar */}
              <div className="h-6 bg-slate-950 px-3 flex items-center justify-between text-[8px] font-sans text-slate-400 z-20 font-bold select-none">
                <span>15:10</span>
                <div className="flex items-center gap-1">
                  <span className="text-[7.5px] text-green-500">OVIE-NET</span>
                  <span className="w-3.5 h-2.5 border border-slate-600 rounded p-0.5 flex items-center leading-none">
                    <span className="w-1.5 h-1 bg-green-500 rounded-xs block" />
                  </span>
                </div>
              </div>

              {/* Live screen elements container */}
              <div className="flex-1 bg-slate-950 p-3 overflow-y-auto space-y-2 text-center flex flex-col justify-start">
                {(() => {
                  const parseMobileWidgets = (sourceCode: string): any[] => {
                    const widgets: any[] = [];
                    const lines = sourceCode.split("\n");
                    for (let line of lines) {
                      const trimmed = line.trim();
                      if (!trimmed || trimmed.startsWith("//")) continue;

                      if (trimmed.startsWith("makeText(")) {
                        const match = trimmed.match(/makeText\s*\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\)/);
                        if (match) {
                          widgets.push({ type: "text", text: match[1], color: match[2] });
                        } else {
                          const fallbackMatch = trimmed.match(/makeText\s*\(\s*["']([^"']+)["']\s*\)/);
                          if (fallbackMatch) {
                            widgets.push({ type: "text", text: fallbackMatch[1], color: "white" });
                          }
                        }
                      } else if (trimmed.startsWith("makeButton(")) {
                        const match = trimmed.match(/makeButton\s*\(\s*["']([^"']+)["']\s*\)/);
                        if (match) {
                          let actionText = "Tap recorded";
                          // Extract potential seeAm action
                          const actionMatch = trimmed.match(/seeAm\s+["']([^"']+)["']/);
                          if (actionMatch) {
                            actionText = actionMatch[1];
                          }
                          widgets.push({ type: "button", text: match[1], actionText });
                        }
                      } else if (trimmed.startsWith("makeInput(")) {
                        const match = trimmed.match(/makeInput\s*\(\s*["']([^"']+)["']\s*\)/);
                        if (match) {
                          widgets.push({ type: "input", placeholder: match[1] });
                        }
                      } else if (trimmed.includes("Active Balance:")) {
                        widgets.push({ type: "text", text: "Active Balance: $148.02 (💰 Wallet)", color: "gold" });
                      }
                    }

                    if (widgets.length === 0) {
                      widgets.push({ type: "text", text: "Kpalasa Native Screen 📱", color: "gold" });
                      widgets.push({ type: "text", text: "Choose 'Chapter 4: Mobile App Engine' in Syllabus to load full framework components templates!", color: "slate" });
                    }
                    return widgets;
                  };

                  return parseMobileWidgets(code).map((w, idx) => (
                    <div key={idx} className="space-y-1">
                      {w.type === "text" && (
                        <p className={`text-center leading-normal break-words ${
                          w.color === "emerald" ? "text-emerald-400 text-[11px] font-bold" :
                          w.color === "gold" ? "text-yellow-400 text-xs font-bold leading-tight" :
                          w.color === "slate" ? "text-slate-400 text-[9px] leading-snug" :
                          "text-slate-100 text-[10px]"
                        }`}>
                          {w.text}
                        </p>
                      )}
                      {w.type === "input" && (
                        <input
                          type="text"
                          disabled
                          placeholder={w.placeholder}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[8.5px] text-slate-300 placeholder-slate-600 outline-none select-none text-center"
                        />
                      )}
                      {w.type === "button" && (
                        <button
                          type="button"
                          onClick={() => {
                            setStdout(prev => `${prev}\n[Virtual Device Tap] '${w.text}' triggered!\n>>> Executing Ovie Kpalasa Action Thread...\n>>> Output: ${w.actionText || "Ovie framework compiled state OK"}`);
                            setActiveTab("terminal");
                          }}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 rounded py-1 text-[8.5px] font-extrabold transition-all text-center select-none shadow hover:shadow-emerald-500/10 cursor-pointer active:scale-95"
                        >
                          {w.text}
                        </button>
                      )}
                    </div>
                  ));
                })()}
              </div>

              {/* Physical gesture home pill */}
              <div className="h-2 bg-slate-950 flex items-center justify-center py-1">
                <div className="w-10 h-0.5 bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
