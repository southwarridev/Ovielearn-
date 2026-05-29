import React, { useState, useEffect } from "react";
import Sidebar, { OvieCapIcon } from "./components/Sidebar";
import LessonContent from "./components/LessonContent";
import CodeSandbox from "./components/CodeSandbox";
import AdMobCenter, {
  SimulatedBannerAd,
  SimulatedInterstitialAd,
  SimulatedRewardedAd,
  showRewardedAd,
  showInterstitialAd
} from "./components/AdMobCenter";
import BottomMenu from "./components/BottomMenu";
import { CHAPTERS_DATA } from "./data";
import { Chapter, Lesson, AdMobStats, AdUnit } from "./types";
import {
  Menu,
  Sparkles,
  Smartphone,
  Lock,
  Monitor,
  Lightbulb,
  Cpu,
  Info,
  DollarSign,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [chapters] = useState<Chapter[]>(CHAPTERS_DATA);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(CHAPTERS_DATA[0].lessons[0]);
  const [unlockedPremiumLessons, setUnlockedPremiumLessons] = useState<string[]>([]);
  const [quizCompletedLessons, setQuizCompletedLessons] = useState<string[]>([]);
  const [isAdMobOpen, setIsAdMobOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const [testMode, setTestMode] = useState(true);

  // Theme selection state with localStorage persistence
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      const savedTheme = localStorage.getItem("ovie_theme");
      return (savedTheme === "light" || savedTheme === "dark") ? savedTheme : "dark";
    } catch {
      return "dark";
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("ovie_theme", nextTheme);
    } catch (err) {
      console.error("Failed to save theme choice:", err);
    }
  };

  // Locked chapter pending unlock flow state
  const [pendingUnlockId, setPendingUnlockId] = useState<string | null>(null);
  const [supportCount, setSupportCount] = useState<number>(0);

  // AdMob stats state
  const [stats, setStats] = useState<AdMobStats>({
    estimatedEarnings: 4.82,
    unlockedRevenue: 0.0,
    impressions: 1142,
    ecpm: 3.52,
    clicks: 18,
    matchRate: 98.6,
  });

  // Active Placement IDs List
  const [adUnits, setAdUnits] = useState<AdUnit[]>([
    {
      id: "banner_01",
      name: "Standard Footer Banner",
      type: "Banner",
      adMobId: "ca-app-pub-3677451023005724/1839210455",
      impressions: 742,
      earnings: 2.15,
    },
    {
      id: "interstitial_01",
      name: "Interstitial Splash Trigger",
      type: "Interstitial",
      adMobId: "ca-app-pub-3677451023005724/4960321288",
      impressions: 48,
      earnings: 1.62,
    },
    {
      id: "rewarded_01",
      name: "Community Support Reward Ad",
      type: "Rewarded",
      adMobId: "ca-app-pub-3677451023005724/3574361611",
      impressions: 8,
      earnings: 1.05,
    },
  ]);

  // Load user progress from localStorage on boot
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem("ovie_unlocked_premium");
      const savedQuiz = localStorage.getItem("ovie_quiz_completed");
      const savedAdMob = localStorage.getItem("ovie_admob_revenue");
      const savedSupport = localStorage.getItem("ovie_support_count");
      const savedCustomAdMob = localStorage.getItem("ovie_custom_admob_config");

      if (savedUnlocked) setUnlockedPremiumLessons(JSON.parse(savedUnlocked));
      if (savedQuiz) setQuizCompletedLessons(JSON.parse(savedQuiz));
      if (savedSupport) setSupportCount(parseInt(savedSupport, 10));
      
      // Load custom AdMob/AdSense setup if active
      if (savedCustomAdMob) {
        const config = JSON.parse(savedCustomAdMob);
        if (config.isLinked) {
          setAdUnits((prev) =>
            prev.map((unit) => {
              if (unit.type === "Banner" && config.bannerId) {
                return { ...unit, adMobId: config.bannerId };
              }
              if (unit.type === "Interstitial" && config.interstitialId) {
                return { ...unit, adMobId: config.interstitialId };
              }
              if (unit.type === "Rewarded" && config.rewardedId) {
                return { ...unit, adMobId: config.rewardedId };
              }
              return unit;
            })
          );
        }
      }

      if (savedAdMob) {
        const parsed = JSON.parse(savedAdMob);
        setStats((prev) => ({
          ...prev,
          unlockedRevenue: parsed.unlockedRevenue || 0.0,
          impressions: parsed.impressions || prev.impressions,
          clicks: parsed.clicks || prev.clicks,
        }));
      }
    } catch (err) {
      console.error("Failed to recover localStorage logs:", err);
    }
  }, []);

  // Save states back to localStorage
  const saveAdMobProgress = (updatedStats: AdMobStats) => {
    localStorage.setItem(
      "ovie_admob_revenue",
      JSON.stringify({
        unlockedRevenue: updatedStats.unlockedRevenue,
        impressions: updatedStats.impressions,
        clicks: updatedStats.clicks,
      })
    );
  };

  // Increment impression and estimate tiny revenues on active key changes
  const handleTriggerImpression = (isClick: boolean = false) => {
    setStats((prev) => {
      const addedRevenue = isClick ? 0.35 : 0.005; // clicks pay way more
      const nextStats = {
        ...prev,
        impressions: prev.impressions + (isClick ? 0 : 1),
        clicks: prev.clicks + (isClick ? 1 : 0),
        estimatedEarnings: prev.estimatedEarnings + addedRevenue,
      };

      // update units
      setAdUnits((units) =>
        units.map((unit) => {
          if (isClick && unit.type === "Banner") {
            return {
              ...unit,
              earnings: unit.earnings + addedRevenue,
            };
          }
          if (!isClick && unit.type === "Banner") {
            return {
              ...unit,
              impressions: unit.impressions + 1,
              earnings: unit.earnings + addedRevenue,
            };
          }
          return unit;
        })
      );

      saveAdMobProgress(nextStats);
      return nextStats;
    });
  };

  // Callback when user passes interactive checker (W3s pattern)
  const handlePassedQuiz = (lessonId: string) => {
    if (!quizCompletedLessons.includes(lessonId)) {
      const nextQuizList = [...quizCompletedLessons, lessonId];
      setQuizCompletedLessons(nextQuizList);
      localStorage.setItem("ovie_quiz_completed", JSON.stringify(nextQuizList));

      // Little reward! Add standard click-through earnings bonus
      handleTriggerImpression(false);
    }
  };

  // Callback when code compiled correctly in sandbox
  const handleCodeRunStatus = (success: boolean) => {
    if (success) {
      // Small cash incentive on success compilation logs
      setStats((prev) => {
        const nextStats = {
          ...prev,
          impressions: prev.impressions + 1,
          estimatedEarnings: prev.estimatedEarnings + 0.015,
        };
        saveAdMobProgress(nextStats);
        return nextStats;
      });
    }
  };

  // Triggering the Rewarded Ad modal
  const handleUnlockPremiumLesson = (lessonId: string) => {
    setPendingUnlockId(lessonId);

    showRewardedAd((unlocked) => {
      if (unlocked) {
        // Unlock lesson
        setUnlockedPremiumLessons((prev) => {
          const next = [...prev, lessonId];
          localStorage.setItem("ovie_unlocked_premium", JSON.stringify(next));
          return next;
        });

        // Award AdMob developers monetization simulated cash
        setStats((prev) => {
          const nextStats = {
            ...prev,
            unlockedRevenue: prev.unlockedRevenue + 0.15,
            impressions: prev.impressions + 1,
          };

          // Increment of Rewarded ad units tracking
          setAdUnits((units) =>
            units.map((u) => {
              if (u.type === "Rewarded") {
                return {
                  ...u,
                  impressions: u.impressions + 1,
                  earnings: u.earnings + 0.15,
                };
              }
              return u;
            })
          );

          saveAdMobProgress(nextStats);
          return nextStats;
        });

        // Transition immediately to lesson
        const matchedLesson = chapters
          .flatMap((c) => c.lessons)
          .find((l) => l.id === lessonId);
        if (matchedLesson) {
          setCurrentLesson(matchedLesson);
        }
      }
      setPendingUnlockId(null);
    });
  };

  // Handle ad banner clicks
  const handleBannerAdClick = () => {
    handleTriggerImpression(true);
    alert("Simulated Google AdMob redirect block opened. eCPM credits assigned on developer dashboard!");
  };

  // Listen to banner click simulation event
  useEffect(() => {
    const handleSimulateBanner = () => {
      handleBannerAdClick();
    };
    window.addEventListener("simulate_banner_click", handleSimulateBanner);
    return () => {
      window.removeEventListener("simulate_banner_click", handleSimulateBanner);
    };
  }, []);

  const handleSupportWithAd = () => {
    showRewardedAd((unlocked) => {
      if (unlocked) {
        setSupportCount((prev) => {
          const next = prev + 1;
          localStorage.setItem("ovie_support_count", String(next));
          return next;
        });

        // Award AdMob developer stats
        setStats((prev) => {
          const nextStats = {
            ...prev,
            unlockedRevenue: prev.unlockedRevenue + 0.15,
            impressions: prev.impressions + 1,
          };

          setAdUnits((units) =>
            units.map((u) => {
              if (u.type === "Rewarded") {
                return {
                  ...u,
                  impressions: u.impressions + 1,
                  earnings: u.earnings + 0.15,
                };
              }
              return u;
            })
          );

          saveAdMobProgress(nextStats);
          return nextStats;
        });
      }
    });
  };

  // Force simulation of interstitial popup when shifting lessons occasionally
  const handleTransitionLesson = (lesson: Lesson) => {
    // 30% chance to trigger an Interstitial ad on lessons shifting, to demonstrate monetization
    if (Math.random() < 0.35) {
      showInterstitialAd(() => {
        // Increment of interstitial statistics
        setStats((prev) => {
          const nextStats = {
            ...prev,
            impressions: prev.impressions + 1,
            estimatedEarnings: prev.estimatedEarnings + 0.08,
          };

          setAdUnits((units) =>
            units.map((u) => {
              if (u.type === "Interstitial") {
                return {
                  ...u,
                  impressions: u.impressions + 1,
                  earnings: u.earnings + 0.08,
                };
              }
              return u;
            })
          );

          saveAdMobProgress(nextStats);
          return nextStats;
        });

        setCurrentLesson(lesson);
        handleTriggerImpression(false);
      });
    } else {
      setCurrentLesson(lesson);
      handleTriggerImpression(false);
    }
  };

  return (
    <div className={`h-screen max-h-screen flex flex-col overflow-hidden font-sans transition-colors duration-300 ${theme === "light" ? "bg-slate-50 text-slate-900" : "bg-slate-900 text-slate-100"}`}>
      
      {/* Upper Navigation Bar */}
      <header className={`border-b px-4 py-3 flex items-center justify-between shrink-0 select-none transition-all duration-300 ${theme === "light" ? "bg-white border-slate-300 text-slate-900" : "bg-slate-950 border-slate-800 text-slate-100"}`}>
        <div className="flex items-center gap-3">
          {/* Mobile Hamburguer drawer */}
          <button
            onClick={() => setActiveMobileMenu(!activeMobileMenu)}
            id="mobile-menu-trigger"
            className={`md:hidden p-1 border rounded transition-colors duration-300 ${theme === "light" ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200" : "bg-slate-900 border-slate-800 text-slate-350 hover:text-slate-100"}`}
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <OvieCapIcon className="w-7 h-7 drop-shadow" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-black tracking-wider uppercase ${theme === "light" ? "text-amber-600" : "text-amber-500"}`}>
                  Ovie Systems
                </span>
                <span className={`text-[10px] px-1 rounded leading-normal border ${theme === "light" ? "bg-amber-100 text-amber-800 border-amber-300/40" : "bg-amber-900/30 text-amber-400 border-amber-800/30"}`}>
                  v2.3
                </span>
              </div>
              <p className={`text-[9px] leading-none ${theme === "light" ? "text-slate-500 font-medium" : "text-slate-400"}`}>
                Interactive Learning Academy
              </p>
            </div>
          </div>
        </div>

        {/* Global info controls */}
        <div className="flex items-center gap-3">
          
          {/* Highlight simulated AdMob Revenue right inside the top bar header for maximum feedback */}
          <div className={`border rounded-lg px-2.5 py-1 flex items-center gap-1.5 transition-all duration-300 ${theme === "light" ? "bg-slate-100 border-slate-300 text-slate-800" : "bg-slate-900 border-slate-800 text-slate-200"}`}>
            <DollarSign size={11} className="text-yellow-500 shrink-0" />
            <span className={`text-[9px] font-semibold font-sans tracking-wide ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>
              Est. Ad Revenue:
            </span>
            <span className="text-[11px] font-bold font-mono text-yellow-500">
              ${(stats.estimatedEarnings + stats.unlockedRevenue).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => setIsAdMobOpen(!isAdMobOpen)}
            id="toggle-admob-navbar"
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 ${
              isAdMobOpen
                ? "bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow shadow-yellow-500/20"
                : theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                  : "bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800"
            }`}
          >
            <span className="shrink-0 font-sans">AdMob Debugger</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAdMobOpen ? "bg-slate-950 animate-ping" : "bg-slate-500"
              }`}
            />
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            id="toggle-app-theme"
            className={`p-1.5 rounded-lg border transition-all duration-300 active:scale-95 ${
              theme === "light"
                ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600"
                : "bg-slate-900 hover:bg-slate-850 border-slate-800 text-yellow-400"
            }`}
            title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
          >
            {theme === "light" ? (
              <Moon size={14} className="fill-amber-600/10" />
            ) : (
              <Sun size={14} className="fill-yellow-400/10" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Layout area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Course Sidebar */}
        <Sidebar
          theme={theme}
          chapters={chapters}
          currentLesson={currentLesson}
          setCurrentLesson={handleTransitionLesson}
          unlockedPremiumLessons={unlockedPremiumLessons}
          quizCompletedLessons={quizCompletedLessons}
          onUnlockPremiumLesson={handleUnlockPremiumLesson}
          onToggleAdMob={() => setIsAdMobOpen(!isAdMobOpen)}
          isAdMobOpen={isAdMobOpen}
          activeMobileMenu={activeMobileMenu}
          setActiveMobileMenu={setActiveMobileMenu}
          onSupportWithAd={handleSupportWithAd}
          supportCount={supportCount}
        />

        {/* Triple Panel System: Lesson Content | Sandbox Code Playground | AdMob overlays */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-w-0">
          
          {/* Half Panel 1: Lesson Instructions */}
          <div className="flex-1 min-w-[280px] h-full overflow-hidden">
            <LessonContent
              theme={theme}
              lesson={currentLesson}
              onPassedQuiz={handlePassedQuiz}
              quizPassed={quizCompletedLessons.includes(currentLesson.id)}
            />
          </div>

          {/* Half Panel 2: Code Editor Sandbox Playground */}
          <div className={`flex-1 min-w-[280px] h-full overflow-hidden border-t md:border-t-0 md:border-l transition-all duration-300 ${theme === "light" ? "border-slate-300" : "border-slate-800/80"}`}>
            <CodeSandbox
              theme={theme}
              lesson={currentLesson}
              onCodeRunStatus={handleCodeRunStatus}
            />
          </div>
        </main>

        {/* overlay simulated AdMob Stats Control Center */}
        <AnimatePresence>
          {isAdMobOpen && (
            <div className="fixed inset-0 z-40 pointer-events-none select-none">
              <div 
                className="absolute inset-0 md:hidden bg-black/60 pointer-events-auto" 
                onClick={() => setIsAdMobOpen(false)} 
              />
              <motion.div
                drag
                dragMomentum={false}
                dragElastic={0.05}
                initial={{ opacity: 0, scale: 0.95, x: 200 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 200 }}
                className={`absolute right-4 bottom-16 md:bottom-20 pointer-events-auto w-full max-w-sm border rounded-xl overflow-hidden shadow-2xl flex flex-col h-[525px] transition-all duration-300 ${theme === "light" ? "border-slate-300 bg-white" : "border-slate-800 bg-slate-900"}`}
              >
                <div className={`p-2 text-[10px] font-mono font-black text-center flex items-center justify-center gap-1 cursor-grab active:cursor-grabbing select-none border-b leading-none shrink-0 animate-pulse ${theme === "light" ? "bg-slate-100 text-amber-700 border-slate-200" : "bg-slate-950 text-amber-500 border-slate-900"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                  <span>✥ Drag Panel Anywhere • Click Close to Dismiss</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <AdMobCenter
                    theme={theme}
                    stats={stats}
                    adUnits={adUnits}
                    setStats={setStats}
                    setAdUnits={setAdUnits}
                    testMode={testMode}
                    setTestMode={setTestMode}
                    onClose={() => setIsAdMobOpen(false)}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Menu & Sandbox Testing Center connected to GitHub */}
      <BottomMenu
        theme={theme}
        testMode={testMode}
        supportCount={supportCount}
        onRunTestAd={(type) => {
          if (type === "interstitial") {
            showInterstitialAd(() => console.log("AdMob manual interstitial debug validated of active viewport."));
          } else if (type === "rewarded") {
            handleSupportWithAd();
          } else {
            handleBannerAdClick();
          }
        }}
      />

      {/* Simulated Bottom Banner Ad Block placement for monetization feedback */}
      <SimulatedBannerAd testMode={testMode} onAdClicked={handleBannerAdClick} />

      {/* Embedded Global Interstital and Rewarded Active player overlay nodes */}
      <SimulatedInterstitialAd />
      <SimulatedRewardedAd onRewardEarned={(val) => {
        // This callback is already handled inside triggers, but we can verify here if needed
        console.log("Rewarded clip success. Cash increments confirmed: +$0.15");
      }} />

    </div>
  );
}
