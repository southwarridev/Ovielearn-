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
  theme?: "dark" | "light";
  lesson: Lesson;
  onPassedQuiz: (lessonId: string) => void;
  quizPassed: boolean;
}

export default function LessonContent({
  theme = "dark",
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
            <div key={idx} className={`rounded-lg p-3.5 border my-4 overflow-x-auto relative group transition-all duration-300 ${theme === "light" ? "bg-slate-100 border-slate-300 text-slate-800" : "bg-slate-950 border-slate-850 text-slate-300"}`}>
              <span className={`absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded font-mono uppercase select-none transition-all duration-300 ${theme === "light" ? "bg-slate-200 text-slate-600" : "bg-slate-800 text-slate-450"}`}>
                Ovie Source
              </span>
              <pre className={`font-mono text-[11px] leading-relaxed transition-all duration-300 ${theme === "light" ? "text-slate-900" : "text-slate-300"}`}>{completeCode}</pre>
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
          <h2 key={idx} className={`text-sm font-bold tracking-tight mt-6 mb-2 flex items-center gap-1.5 font-sans transition-all duration-300 ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
            {line.substring(4)}
          </h2>
        );
      }

      // Inline Lists
      if (line.trim().startsWith("- ")) {
        return (
          <li key={idx} className={`text-[11.5px] ml-4 list-disc marker:text-amber-500 leading-relaxed py-0.5 font-sans transition-all duration-305 ${theme === "light" ? "text-slate-800" : "text-slate-300"}`}>
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
        <p key={idx} className={`text-[11.5px] leading-relaxed font-sans transition-all duration-300 ${theme === "light" ? "text-slate-700" : "text-slate-350"}`}>
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
          <code key={i} className={`font-mono text-[10.5px] font-semibold px-1.5 py-0.5 border rounded mx-0.5 select-all transition-all duration-300 ${theme === "light" ? "bg-slate-100 border-slate-300 text-amber-700" : "bg-slate-950 border-slate-850 text-amber-400"}`}>
            {part}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={`overflow-y-auto h-full p-5 space-y-6 flex flex-col font-sans select-text border-r transition-colors duration-300 ${theme === "light" ? "bg-slate-50 border-slate-200 text-slate-850" : "bg-slate-900 border-slate-800/80 text-white"}`}>
      
      {/* Animated Lesson Container */}
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 flex flex-col space-y-5"
      >
        {/* Lesson Header title */}
        <div className={`space-y-1.5 border-b pb-4 shrink-0 transition-all duration-300 ${theme === "light" ? "border-slate-205 border-slate-200" : "border-slate-800/80"}`}>
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
          <h1 className={`text-lg font-bold tracking-tight leading-none ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
            {lesson.title}
          </h1>
          <p className={`text-[11px] leading-snug ${theme === "light" ? "text-slate-600 font-medium" : "text-slate-400"}`}>
            {lesson.description}
          </p>
        </div>

        {/* Course Core Documentation Theory content */}
        <div className="flex-1 space-y-3.5 pr-1 min-h-0 overflow-y-auto">
          {renderTheoryHTML(lesson.theory)}
        </div>

        {/* W3SCHOOS LEARN PATTERN CHALLENGE EXERCISE BLOCK */}
        <div className={`border rounded-xl p-4 space-y-4 shrink-0 transition-all duration-300 ${theme === "light" ? "bg-white border-slate-300 shadow-sm" : "bg-slate-950 border-slate-850"}`}>
          <div className={`flex items-center gap-2 pb-2 border-b select-none transition-all duration-300 ${theme === "light" ? "border-slate-205 border-slate-200" : "border-slate-850"}`}>
            <div className="p-1 bg-amber-500 rounded text-slate-950">
              <HelpCircle size={14} />
            </div>
            <div>
              <h3 className={`text-xs font-bold tracking-tight leading-none ${theme === "light" ? "text-slate-900" : "text-slate-100"}`}>
                Interactive Exercise
              </h3>
              <span className="text-[9px] text-slate-500 font-mono tracking-tight uppercase leading-normal">
                W3Schools Code Checker
              </span>
            </div>
          </div>

          <form onSubmit={handleCheckQuiz} className="space-y-4">
            <p className={`text-xs font-medium leading-relaxed ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
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
                  className={`px-3 py-2 rounded-lg text-xs border font-mono flex-1 transition-all placeholder:text-slate-405 ${theme === "light" ? "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:ring-1 focus:ring-amber-500" : "bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"}`}
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
                        ? "bg-amber-550/10 border-amber-500/60 text-amber-500 font-semibold"
                        : theme === "light"
                          ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-900/60 hover:text-slate-205 hover:text-slate-200"
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
                <div className="flex items-center gap-1 text-green-600 text-[11px] font-semibold">
                  <CheckCircle size={14} /> Correct! Exercise Passed.
                </div>
              ) : quizStatus === "incorrect" ? (
                <div className="flex items-center gap-1 text-red-500 text-[11px] font-semibold">
                  <XCircle size={14} /> Try again. Double-check your syntax!
                </div>
              ) : (
                <div className={`text-[10px] font-mono tracking-tight gap-1 flex items-center ${theme === "light" ? "text-slate-600" : "text-slate-500"}`}>
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
                  className={`text-[10px] flex items-center gap-1 font-mono hover:underline ${theme === "light" ? "text-slate-700 hover:text-slate-950" : "text-slate-500 hover:text-slate-350"}`}
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
