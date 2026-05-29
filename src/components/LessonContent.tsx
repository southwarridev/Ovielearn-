import React, { useState, useEffect } from "react";
import { Lesson } from "../types";
import { motion } from "motion/react";
import {
  Lightbulb,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw
} from "lucide-react";

interface LessonContentProps {
  lesson: Lesson;
  onPassedQuiz: (lessonId: string) => void;
  quizPassed: boolean;
}

export default function LessonContent({
  lesson,
  onPassedQuiz,
  quizPassed,
}: LessonContentProps) {
  const [blankAnswer, setBlankAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState("");
  const [quizStatus, setQuizStatus] = useState<"unanswered" | "correct" | "incorrect">("unanswered");

  // Reset quiz states when lesson changes
  useEffect(() => {
    setBlankAnswer("");
    setSelectedChoice("");
    setQuizStatus(quizPassed ? "correct" : "unanswered");
  }, [lesson, quizPassed]);

  // Handle quiz checklist validations
  const handleCheckQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const challenge = lesson.interactiveChallenge;
    const isCorrect =
      challenge.type === "fill_in_the_blank"
        ? blankAnswer.trim().toLowerCase() === challenge.correctAnswer.toLowerCase()
        : selectedChoice === challenge.correctAnswer;

    if (isCorrect) {
      setQuizStatus("correct");
      onPassedQuiz(lesson.id);
    } else {
      setQuizStatus("incorrect");
    }
  };

  // Safe manual parsed layout render for Ovie documentation markdown
  const renderTheoryHTML = (rawText: string) => {
    const lines = rawText.split("\n");
    let isCodeBlock = false;
    let codeBuffer: string[] = [];

    return lines.map((line, idx) => {
      // Check for code block segments
      if (line.trim().startsWith("```")) {
        if (isCodeBlock) {
          isCodeBlock = false;
          const completeCode = codeBuffer.join("\n");
          codeBuffer = [];
          
          return (
            <div key={idx} className="bg-slate-950 rounded-lg p-3.5 border border-slate-850 my-4 overflow-x-auto relative group">
              <span className="absolute top-2 right-2 text-[8px] bg-slate-800 text-slate-450 px-1.5 py-0.5 rounded font-mono uppercase select-none">
                Ovie Source
              </span>
              <pre className="font-mono text-[11px] text-slate-300 leading-relaxed">{completeCode}</pre>
            </div>
          );
        } else {
          isCodeBlock = true;
          return null;
        }
      }

      if (isCodeBlock) {
        codeBuffer.push(line);
        return null;
      }

      // Large Titles
      if (line.startsWith("### ")) {
        return (
          <h2 key={idx} className="text-sm font-bold text-slate-100 tracking-tight mt-6 mb-2 flex items-center gap-1.5 font-sans">
            {line.substring(4)}
          </h2>
        );
      }

      // Inline Lists
      if (line.trim().startsWith("- ")) {
        return (
          <li key={idx} className="text-[11.5px] text-slate-300 ml-4 list-disc marker:text-amber-500 leading-relaxed py-0.5 font-sans">
            {formatInlineCode(line.trim().substring(2))}
          </li>
        );
      }

      // Empty Lines
      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      // Default formatted Paragraph
      return (
        <p key={idx} className="text-[11.5px] text-slate-350 leading-relaxed font-sans">
          {formatInlineCode(line)}
        </p>
      );
    });
  };

  // Format backticks into styled elements
  const formatInlineCode = (text: string) => {
    if (!text.includes("`")) return text;
    const parts = text.split("`");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <code key={i} className="bg-slate-950 font-mono text-[10.5px] text-amber-400 font-semibold px-1.5 py-0.5 border border-slate-850 rounded mx-0.5 select-all">
            {part}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-slate-900 overflow-y-auto h-full p-5 space-y-6 flex flex-col font-sans select-text border-r border-slate-800/80">
      
      {/* Animated Lesson Container */}
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 flex flex-col space-y-5"
      >
        {/* Lesson Header title */}
        <div className="space-y-1.5 border-b border-slate-800/80 pb-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono tracking-widest text-amber-400 bg-amber-950/45 border border-amber-900/30 px-1.5 py-0.5 uppercase rounded">
              Interactive Lesson
            </span>
            {lesson.isPremium && (
              <span className="text-[10px] font-mono tracking-wider text-amber-500 bg-amber-950/20 border border-amber-900/40 px-1.5 py-0.5 uppercase rounded font-semibold">
                Open Source Chapter
              </span>
            )}
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
            {lesson.title}
          </h1>
          <p className="text-[11px] text-slate-400 leading-snug">
            {lesson.description}
          </p>
        </div>

        {/* Course Core Documentation Theory content */}
        <div className="flex-1 space-y-3.5 pr-1 min-h-0 overflow-y-auto">
          {renderTheoryHTML(lesson.theory)}
        </div>

        {/* W3SCHOOS LEARN PATTERN CHALLENGE EXERCISE BLOCK */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-4 shrink-0">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-850 select-none">
            <div className="p-1 bg-amber-500 rounded text-slate-950">
              <HelpCircle size={14} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 tracking-tight leading-none">
                Interactive Exercise
              </h3>
              <span className="text-[9px] text-slate-550 font-mono tracking-tight uppercase leading-normal">
                W3Schools Code Checker
              </span>
            </div>
          </div>

          <form onSubmit={handleCheckQuiz} className="space-y-4">
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {lesson.interactiveChallenge.question}
            </p>

            {/* Render Fill in the blank format */}
            {lesson.interactiveChallenge.type === "fill_in_the_blank" ? (
              <div className="flex items-center gap-2 max-w-sm select-none">
                <input
                  type="text"
                  value={blankAnswer}
                  onChange={(e) => setBlankAnswer(e.target.value)}
                  disabled={quizStatus === "correct"}
                  placeholder={lesson.interactiveChallenge.placeholder || "Type answer here..."}
                  className="bg-slate-900 px-3 py-2 rounded-lg text-xs border border-slate-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono flex-1 transition-all placeholder:text-slate-600"
                />
              </div>
            ) : (
              /* Render Multiple choice format */
              <div className="space-y-1.5 select-none">
                {lesson.interactiveChallenge.choices?.map((choice) => (
                  <label
                    key={choice}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      selectedChoice === choice
                        ? "bg-amber-550/10 border-amber-500/60 text-amber-400"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="lesson_quiz_choices"
                      value={choice}
                      checked={selectedChoice === choice}
                      disabled={quizStatus === "correct"}
                      onChange={() => setSelectedChoice(choice)}
                      className="mt-0.5 accent-amber-500"
                    />
                    <span className="leading-snug">{choice}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Feedback & Actions */}
            <div className="flex items-center justify-between pt-2 select-none">
              {quizStatus === "correct" ? (
                <div className="flex items-center gap-1 text-green-500 text-[11px] font-semibold">
                  <CheckCircle size={14} /> Correct! Exercise Passed.
                </div>
              ) : quizStatus === "incorrect" ? (
                <div className="flex items-center gap-1 text-red-400 text-[11px] font-semibold">
                  <XCircle size={14} /> Try again. Double-check your syntax!
                </div>
              ) : (
                <div className="text-[10px] text-slate-500 font-mono tracking-tight gap-1 flex items-center">
                  <Lightbulb size={11} className="text-yellow-600 shrink-0" /> Answer the interactive exercise to proceed.
                </div>
              )}

              {quizStatus !== "correct" ? (
                <button
                  type="submit"
                  id="submit-quiz"
                  className="bg-amber-550 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-slate-950/40"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setQuizStatus("unanswered");
                    setBlankAnswer("");
                    setSelectedChoice("");
                  }}
                  className="text-slate-500 hover:text-slate-350 text-[10px] flex items-center gap-1 font-mono hover:underline"
                >
                  <RotateCcw size={10} /> Reset Exercise
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
