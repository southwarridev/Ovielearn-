import React from "react";
import { Chapter, Lesson } from "../types";
import {
  CheckCircle,
  Circle,
  Menu,
  ChevronRight,
  BookOpen,
  DollarSign,
  Heart,
  Sparkles
} from "lucide-react";

// Ovie Cap Icon: A beautiful traditional Nigerian red cap (coral detailing + eagle feather)
export function OvieCapIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Eagle feather */}
      <path
        d="M62 10 C 65 25, 55 45, 45 52 C 48 40, 55 25, 62 10 Z"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1"
      />
      <path d="M45 52 L58 20" stroke="#CBD5E1" strokeWidth="1" />
      
      {/* Traditional Ovie Red Cap shape */}
      <path
        d="M20 70 C20 40, 30 35, 50 35 C70 35, 80 40, 80 70 C80 75, 75 78, 50 78 C25 78, 20 75, 20 70 Z"
        fill="#DC2626" /* Main traditional red cap */
        stroke="#991B1B"
        strokeWidth="2.5"
      />
      
      {/* Golden royal band (Traditional Yellow representing royalty) */}
      <path
        d="M20 70 C25 74, 38 76, 50 76 C62 76, 75 74, 80 70 C79 73, 73 75, 50 75 C27 75, 21 73, 20 70 Z"
        fill="#F59E0B" /* Ovie traditional yellow gold */
      />
      
      {/* Decorative Golden Ornaments (beads or patterns on the cap) */}
      <circle cx="50" cy="50" r="3" fill="#F59E0B" />
      <circle cx="40" cy="53" r="2.5" fill="#F59E0B" />
      <circle cx="60" cy="53" r="2.5" fill="#F59E0B" />
      <circle cx="32" cy="58" r="2" fill="#F59E0B" />
      <circle cx="68" cy="58" r="2" fill="#F59E0B" />
      
      {/* Coral beads band at the bottom */}
      <rect x="25" y="70" width="50" height="4" rx="2" fill="#F97316" stroke="#EA580C" strokeWidth="0.5" />
    </svg>
  );
}

interface SidebarProps {
  theme?: "dark" | "light";
  chapters: Chapter[];
  currentLesson: Lesson;
  setCurrentLesson: (lesson: Lesson) => void;
  unlockedPremiumLessons: string[];
  quizCompletedLessons: string[];
  onUnlockPremiumLesson: (lessonId: string) => void;
  onToggleAdMob: () => void;
  isAdMobOpen: boolean;
  activeMobileMenu: boolean;
  setActiveMobileMenu: (open: boolean) => void;
  onSupportWithAd: () => void;
  supportCount: number;
}

export default function Sidebar({
  theme = "dark",
  chapters,
  currentLesson,
  setCurrentLesson,
  unlockedPremiumLessons,
  quizCompletedLessons,
  onUnlockPremiumLesson,
  onToggleAdMob,
  isAdMobOpen,
  activeMobileMenu,
  setActiveMobileMenu,
  onSupportWithAd,
  supportCount,
}: SidebarProps) {
  
  // Checks if a lesson is locked - everything is free so no locks!
  const isLessonLocked = (lesson: Lesson) => {
    return false;
  };

  // Triggers selection
  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setActiveMobileMenu(false); // Close mobile tray
  };

  return (
    <aside
      className={`border-r flex flex-col h-full shrink-0 transition-all duration-300 z-30 ${
        activeMobileMenu ? "fixed inset-y-0 left-0 w-72" : "hidden md:flex w-64"
      } ${theme === "light" ? "bg-white border-slate-350 bg-white border-slate-300" : "bg-slate-950 border-slate-800"}`}
    >
      {/* Brand Header */}
      <div className={`p-4 border-b flex items-center justify-between ${theme === "light" ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950"}`}>
        <div className="flex items-center gap-2.5">
          <OvieCapIcon className="w-8 h-8 drop-shadow-md" />
          <div>
            <h1 className={`text-xs font-bold leading-none tracking-tight font-sans uppercase ${theme === "light" ? "text-amber-600" : "text-amber-400"}`}>
              Ovie Academy
            </h1>
            <span className={`text-[9px] font-mono tracking-tighter block mt-0.5 ${theme === "light" ? "text-slate-500" : "text-slate-500"}`}>
              by @southwarridev • open source
            </span>
          </div>
        </div>
        <button
          onClick={() => setActiveMobileMenu(false)}
          className={`md:hidden p-1 rounded transition-colors ${theme === "light" ? "bg-slate-100 text-slate-600 hover:text-slate-900" : "bg-slate-900 text-slate-450 hover:text-slate-100"}`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Integration Shortcuts panel */}
      <div className={`p-3 space-y-2 select-none border-b ${theme === "light" ? "bg-slate-50/50 border-slate-200" : "bg-slate-905 bg-slate-900/60 border-slate-800/80"}`}>
        <button
          onClick={onToggleAdMob}
          id="toggle-admob-sidebar"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            isAdMobOpen
              ? "bg-amber-500/20 text-amber-500 border border-amber-500/50 shadow-inner"
              : theme === "light"
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-250"
                : "bg-slate-950 text-slate-300 hover:bg-slate-900 border border-slate-850"
          }`}
        >
          <span className="flex items-center gap-1.5 font-sans">
            <DollarSign size={13} className="text-amber-500" />
            AdMob Monetize Center
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              isAdMobOpen ? "bg-amber-500 animate-ping" : "bg-slate-500"
            }`}
          />
        </button>

        {/* Support Community reward ad trigger */}
        <button
          onClick={onSupportWithAd}
          id="trigger-sponsor-ad"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all shadow-sm ${
            theme === "light"
              ? "bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 border-amber-500/30"
              : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20"
          }`}
        >
          <span className="flex items-center gap-1.5 font-sans">
            <Sparkles size={13} className="text-amber-400 animate-pulse" />
            Watch Support Ad
          </span>
          <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300 font-mono font-semibold">
            {supportCount > 0 ? `Supporter x${supportCount}` : "Watch"}
          </span>
        </button>
      </div>

      {/* Chapters Explorer & Course syllabus list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="space-y-1.5">
            <h3 className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-1 select-none ${theme === "light" ? "text-slate-400" : "text-slate-500"}`}>
              {chapter.title}
            </h3>
            <div className="space-y-0.5">
              {chapter.lessons.map((lesson) => {
                const active = lesson.id === currentLesson.id;
                const quizPassed = quizCompletedLessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    id={`sidebar-lesson-${lesson.id}`}
                    className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium leading-normal tracking-wide transition-all border ${
                      active
                        ? "bg-amber-500/15 text-amber-600 border-amber-550/30 font-semibold"
                        : theme === "light"
                          ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent"
                          : "text-slate-400 hover:bg-slate-950/80 hover:text-slate-200 border-transparent"
                    }`}
                  >
                    {/* Visual Status Indicator Icon */}
                    <div className="shrink-0 mt-0.5">
                      {quizPassed ? (
                        <CheckCircle size={12} className="text-amber-500 fill-amber-950/40" />
                      ) : (
                        <Circle size={12} className="text-slate-500 hover:text-slate-200" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate block font-sans">{lesson.title}</span>
                        {lesson.isPremium && (
                          <span className="text-[7.5px] border border-amber-500/30 text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded leading-none scale-90 uppercase">
                            FREE
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 font-light truncate block mt-0.5">
                        {lesson.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Simple Sidebar footer */}
      <div className={`p-3 border-t text-center select-none shrink-0 flex items-center justify-center gap-1.5 ${theme === "light" ? "bg-slate-50 border-slate-205 border-slate-200" : "bg-slate-950 border-slate-900"}`}>
        <Heart size={11} className="text-amber-500 fill-amber-500/20" />
        <span className={`text-[9px] font-mono tracking-tight ${theme === "light" ? "text-slate-506 text-slate-500" : "text-slate-500"}`}>
          Ad-Supported Open Source project
        </span>
      </div>
    </aside>
  );
}
