import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Smartphone,
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Target,
  ToggleLeft,
  ToggleRight,
  Eye,
  MousePointerClick
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdMobStats, AdUnit } from "../types";

interface AdMobCenterProps {
  stats: AdMobStats;
  adUnits: AdUnit[];
  setStats: React.Dispatch<React.SetStateAction<AdMobStats>>;
  setAdUnits: React.Dispatch<React.SetStateAction<AdUnit[]>>;
  testMode: boolean;
  setTestMode: (mode: boolean) => void;
  onClose: () => void;
}

// Global controllers so we can trigger Interstitial or Rewarded ads from any component
let triggerGlobalInterstitial: ((onComplete: () => void) => void) | null = null;
let triggerGlobalRewarded: ((onComplete: (unlocked: boolean) => void) => void) | null = null;

export const showInterstitialAd = (onComplete: () => void) => {
  if (triggerGlobalInterstitial) {
    triggerGlobalInterstitial(onComplete);
  } else {
    onComplete();
  }
};

export const showRewardedAd = (onComplete: (unlocked: boolean) => void) => {
  if (triggerGlobalRewarded) {
    triggerGlobalRewarded(onComplete);
  } else {
    onComplete(true); // fall back to unlocked
  }
};

export default function AdMobCenter({
  stats,
  adUnits,
  setStats,
  setAdUnits,
  testMode,
  setTestMode,
  onClose,
}: AdMobCenterProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "ad_units" | "integration">("dashboard");

  // Format monetary sums
  const formatMoney = (val: number) => `$${val.toFixed(2)}`;

  return (
    <div className="bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col h-full w-full max-w-md select-none">
      {/* Dynamic Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-500 rounded text-slate-950 font-black text-xs">AdMob</div>
          <h2 className="font-semibold text-sm tracking-tight text-slate-100">Monetization Dashboard</h2>
        </div>
        <button
          onClick={onClose}
          id="close-admob-center"
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-slate-950 px-2 justify-around border-b border-slate-800">
        <button
          onClick={() => setActiveTab("dashboard")}
          id="admob-tab-dashboard"
          className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === "dashboard"
              ? "border-yellow-500 text-yellow-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab("ad_units")}
          id="admob-tab-ad_units"
          className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === "ad_units"
              ? "border-yellow-500 text-yellow-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Ad Units ({adUnits.length})
        </button>
        <button
          onClick={() => setActiveTab("integration")}
          id="admob-tab-integration"
          className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === "integration"
              ? "border-yellow-500 text-yellow-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Developer SDK
        </button>
      </div>

      {/* Scrollable Stats Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/60 font-sans">
        {/* Toggle Test Mode */}
        <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>Google Test Ads Mode</span>
              <span className={`w-2 h-2 rounded-full ${testMode ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            </div>
            <p className="text-[10px] text-slate-400">Forces sandboxed ad elements inside the tutorial</p>
          </div>
          <button
            onClick={() => setTestMode(!testMode)}
            id="toggle-test-mode"
            className="text-slate-300 hover:text-white transition-colors"
          >
            {testMode ? (
              <ToggleRight className="text-green-500" size={36} />
            ) : (
              <ToggleLeft className="text-slate-500" size={36} />
            )}
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* Active AdMob App ID Indicator */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 space-y-1">
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                Active AdMob App ID (Production ready)
              </span>
              <p className="text-[11px] font-mono font-bold text-slate-100 select-all">
                ca-app-pub-3677451023005724~9721632727
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Status: Connected to SouthWarridev Open Source Monetization</span>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between h-20">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <DollarSign size={10} className="text-yellow-500" /> Est. Revenue
                </span>
                <span className="text-lg font-bold text-slate-50 font-mono">
                  {formatMoney(stats.estimatedEarnings + stats.unlockedRevenue)}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between h-20">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Eye size={10} className="text-blue-400" /> Impressions
                </span>
                <span className="text-lg font-semibold text-slate-50 font-mono">
                  {stats.impressions.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between h-20">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <TrendingUp size={10} className="text-green-400" /> Average eCPM
                </span>
                <span className="text-lg font-semibold text-slate-50 font-mono">
                  {formatMoney(stats.ecpm)}
                </span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 flex flex-col justify-between h-20">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MousePointerClick size={10} className="text-red-400" /> Ad Clicks
                </span>
                <span className="text-lg font-semibold text-slate-50 font-mono">
                  {stats.clicks}
                </span>
              </div>
            </div>

            {/* Simulated Live Earnings Chart */}
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <BarChart2 size={12} className="text-yellow-500" /> Hourly Activity (Simulated)
                </span>
                <span className="text-[10px] text-slate-400">Match rate: {stats.matchRate}%</span>
              </div>
              <div className="flex items-end justify-between h-16 pt-2 px-1">
                {[12, 18, 15, 28, 35, 42, 38, 55, 62, 75, 48, 60].map((val, i) => (
                  <div key={i} className="group relative flex flex-col items-center flex-1">
                    <div
                      style={{ height: `${(val / 75) * 100}%` }}
                      className="w-2.5 bg-yellow-500/80 hover:bg-yellow-400 rounded-t-sm transition-all duration-300"
                    />
                    <div className="absolute bottom-[-14px] text-[8px] text-slate-500 scale-90">
                      {i * 2}h
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Tip */}
            <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-800/60 flex gap-2">
              <Target size={18} className="text-yellow-500 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold text-yellow-500">Developer Retention Strategy</p>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Providing premium sections (like Advanced chapters) unlocked via **Rewarded Video Ads** is proven to increase AdMob eCPM rates up to 340% compared to standard banner static displays.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ad_units" && (
          <div className="space-y-3 font-sans">
            <p className="text-xs text-slate-400 leading-normal mb-1">
              Active developer placement units serving placeholder test cards in real-time. Click any test action to run the simulator modal.
            </p>
            {adUnits.map((unit) => (
              <div
                key={unit.id}
                className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex flex-col gap-2.5 transition-all hover:border-slate-700 hover:bg-slate-950"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-150">{unit.name}</span>
                      <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded leading-none font-mono font-semibold uppercase border border-amber-500/20">
                        {unit.type}
                      </span>
                    </div>
                    <p className="text-[8px] font-mono text-slate-500 select-all">{unit.adMobId}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold font-mono text-amber-400">
                      {formatMoney(unit.earnings)}
                    </div>
                    <div className="text-[9px] text-slate-400">{unit.impressions} imps</div>
                  </div>
                </div>

                {/* Tester triggers */}
                <div className="flex items-center gap-2 pt-1.5 border-t border-slate-900 select-none">
                  {unit.type === "Banner" ? (
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("simulate_banner_click"));
                      }}
                      className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded hover:bg-amber-500/25 transition-all text-center flex-1"
                    >
                      Simulate Banner Click (+eCPM)
                    </button>
                  ) : unit.type === "Interstitial" ? (
                    <button
                      onClick={() => {
                        showInterstitialAd(() => {
                          console.log("Interstitial test finalized via developer utility.");
                        });
                      }}
                      className="text-[9px] font-bold text-amber-400 bg-amber-505/10 border border-amber-500/20 px-2 py-1 rounded hover:bg-amber-500/25 transition-all text-center flex-1"
                    >
                      Run Interstitial Overlay Box
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        showRewardedAd((unlocked) => {
                          console.log("Rewarded test finalized via developer utility. Success:", unlocked);
                        });
                      }}
                      className="text-[9px] font-bold text-amber-400 bg-amber-505/10 border border-amber-500/20 px-2 py-1 rounded hover:bg-amber-500/25 transition-all text-center flex-1"
                    >
                      Run Rewarded Video Playback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "integration" && (
          <div className="space-y-4 font-sans">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-200">AdMob SDK Integration Guide</p>
              <p className="text-[10px] text-slate-404 leading-normal">
                To link these AdMob ad units to your official live Ovie educational application, follow the guidelines below for maximum developer revenue.
              </p>
            </div>

            {/* Code integration block */}
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-850 font-mono text-[9px] overflow-x-auto space-y-2">
              <div className="text-slate-500">// 1. Install Google Mobile Ads SDK</div>
              <div className="text-slate-300">npm install react-native-google-mobile-ads</div>
              <div className="text-slate-500">// 2. Configure in app.json or AndroidManifest.xml</div>
              <div className="text-amber-400 leading-relaxed bg-slate-950 p-2 border border-slate-900 rounded mb-2">
                {"\"react-native-google-mobile-ads\": {\n  \"android_app_id\": \"ca-app-pub-3677451023005724~9721632727\"\n}"}
              </div>
              <div className="text-slate-500">// 3. Initialize & request rewarded ad</div>
              <div className="text-yellow-400">
                {"const rewarded = RewardedAd.createForAdRequest(\"ca-app-pub-3677451023005724/3574361611\");"}
              </div>
              <div className="text-slate-500">// 4. Serve Rewarded Callback securely</div>
              <div className="text-slate-300">
                rewarded.addAdEventListener(AdEvent.EARNED_REWARD, (reward) =&gt; &#123;
              </div>
              <div className="text-green-400">
                &nbsp;&nbsp;console.log("Secure reward received. Action: Add community sponsor credentials");
              </div>
              <div className="text-slate-300">&#125;);</div>
            </div>

            {/* SECURITY BEST PRACTICES SECURE SSV */}
            <div className="bg-slate-950/80 rounded-lg p-3 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1 rounded uppercase tracking-wide">
                  Security
                </span>
                <span className="text-[10px] font-bold text-slate-200">Server-Side Verification (SSV)</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                To prevent malicious client-side state forging (click-bypass or reward fraud), configure AdMob's Server-Side Verification (SSV). AdMob will send an authentication token to your secure Node backend:
              </p>
              <div className="bg-slate-900 p-2.5 rounded font-mono text-[8.5px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-850">
                {"// Securely verify Google signature on backend\napp.get(\"/api/admob-ssv\", async (req, res) => {\n  const { user_id, signature, key_id } = req.query;\n  \n  // Verify query params with Google's public key\n  const verifier = crypto.createVerify(\"SHA256\");\n  verifier.update(verifiedDataQueryString);\n  \n  const isValid = verifier.verify(googlePublicKey, signature, \"base64\");\n  if (isValid) {\n    db.users.incrementSupportCount(user_id);\n    return res.sendStatus(200);\n  }\n  return res.sendStatus(403);\n});"}
              </div>
              <p className="text-[9px] text-slate-500 leading-normal">
                Avoid storing raw secret verification keys in the application client. Keep verification logic strictly separated on your back-office controllers.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Control info bottom footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 text-center font-mono uppercase tracking-wider">
        Google AdMob SDK Simulator v4.11
      </div>
    </div>
  );
}

// ----------------------------------------------------
// AD RENDER COMPONENT: SIMULATED BANNER AD (BOTTOM)
// ----------------------------------------------------
export function SimulatedBannerAd({
  testMode,
  onAdClicked,
}: {
  testMode: boolean;
  onAdClicked: () => void;
}) {
  const [adIndex, setAdIndex] = useState(0);

  const SPONSOR_ADS = [
    {
      title: "Deploy Ovie Securely",
      desc: "Nashedy Cloud Hosting starting at $2.99/mo. 1-click Ovie node installer.",
      cta: "Host Code",
    },
    {
      title: "Hire Elite Systems Coders",
      desc: "Need developer-friendly assembly compilation optimizations? Tap our engineering hub.",
      cta: "Hire Team",
    },
    {
      title: "Advanced Systems Tutorials",
      desc: "Go beyond Rust. Master direct memory layouts & stack modeling guides.",
      cta: "Learn Pro",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % SPONSOR_ADS.length);
    }, 10000); // cycle every 10 seconds
    return () => clearInterval(timer);
  }, []);

  const currentAd = SPONSOR_ADS[adIndex];

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-2 text-slate-200 select-none flex items-center justify-between">
      <div className="flex items-center gap-3 w-full">
        <div className="flex flex-col items-center shrink-0">
          <span className="text-[7.5px] bg-yellow-500 text-slate-950 font-bold px-1 rounded uppercase tracking-wide leading-normal">
            Ad
          </span>
          <span className="text-[7px] text-slate-500 font-mono tracking-tight lowercase">
            {testMode ? "test mode" : "admob server"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-semibold text-slate-100 truncate">{currentAd.title}</h4>
            {testMode && (
              <span className="text-[8px] border border-green-500/30 text-green-400 px-0.5 rounded text-[7px] tracking-tight leading-none">
                Demo
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 truncate leading-snug">{currentAd.desc}</p>
        </div>

        <button
          onClick={onAdClicked}
          className="shrink-0 text-[10px] bg-slate-800 hover:bg-slate-700 active:bg-slate-950 border border-slate-755 text-slate-200 font-medium px-2 py-1 rounded transition-all mr-2"
        >
          {currentAd.cta}
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// AD RENDER COMPONENT: SIMULATED INTERSTITIAL AD (FULL SCREEN POPUP)
// ----------------------------------------------------
export function SimulatedInterstitialAd() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(5);
  const [onFinish, setOnFinish] = useState<(() => void) | null>(null);

  useEffect(() => {
    triggerGlobalInterstitial = (onComplete: () => void) => {
      setSeconds(5);
      setOnFinish(() => onComplete);
      setActive(true);
    };
    return () => {
      triggerGlobalInterstitial = null;
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [seconds, active]);

  const handleDismiss = () => {
    setActive(false);
    if (onFinish) onFinish();
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-xl p-6 shadow-2xl relative text-center">
        {/* Countdown / Dismiss */}
        {seconds > 0 ? (
          <div className="absolute top-4 right-4 text-[10px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800/80 font-mono">
            Close in {seconds}s
          </div>
        ) : (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex flex-col items-center space-y-4 pt-4">
          <div className="flex items-center gap-1 bg-yellow-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded tracking-wider uppercase">
            <span>Interstitial Ad</span>
          </div>

          <Smartphone size={48} className="text-yellow-500 animate-bounce" />

          <div>
            <h3 className="text-base font-semibold text-slate-100">Ovie Professional Code Bundles</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Unlock enterprise-tier Ovie libraries containing high-performance socket layers, binary decoders, and custom hardware registries natively.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-left w-full">
            <div className="text-[10px] font-semibold text-slate-300">Simulated Google AdMob Unit</div>
            <p className="text-[9px] text-slate-500 mt-1">ca-app-pub-3677451023005724/4960321288</p>
          </div>

          <button
            disabled={seconds > 0}
            onClick={handleDismiss}
            className={`w-full text-xs py-2 rounded-lg font-bold transition-all ${
              seconds > 0
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-slate-950"
            }`}
          >
            {seconds > 0 ? `Skip Ad (${seconds}s)` : "Return to Ovie Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// AD RENDER COMPONENT: SIMULATED REWARDED VIDEO AD (POPUP WITH PROGRESS)
// ----------------------------------------------------
export function SimulatedRewardedAd({
  onRewardEarned,
}: {
  onRewardEarned: (earnings: number) => void;
}) {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const [playbackComplete, setPlaybackComplete] = useState(false);
  const [onFinish, setOnFinish] = useState<((unlocked: boolean) => void) | null>(null);

  useEffect(() => {
    triggerGlobalRewarded = (onComplete: (unlocked: boolean) => void) => {
      setSeconds(10);
      setPlaybackComplete(false);
      setOnFinish(() => onComplete);
      setActive(true);
    };
    return () => {
      triggerGlobalRewarded = null;
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    if (seconds <= 0) {
      setPlaybackComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [seconds, active]);

  const handleClaim = () => {
    setActive(false);
    onRewardEarned(0.15); // Add $0.15 to stats
    if (onFinish) onFinish(true); // Callback positive unlock state
  };

  const handleClosePrematurely = () => {
    setActive(false);
    if (onFinish) onFinish(false); // Refused to watch, do not unlock
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/98 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl relative text-left">
        {/* Ad Indicator Tag */}
        <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-850">
          <span className="text-[9px] bg-yellow-500 text-slate-950 font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
            Rewarded Video Ad (Test Module)
          </span>
          {playbackComplete ? (
            <button
              onClick={handleClaim}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition"
            >
              <X size={16} />
            </button>
          ) : (
            <button
              onClick={handleClosePrematurely}
              className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-full transition text-[9px] font-mono px-2"
            >
              Skip
            </button>
          )}
        </div>

        {/* Video Simulation Display Card */}
        <div className="h-44 bg-black flex flex-col items-center justify-center relative p-4 select-none">
          {/* Animated Sine Wave as audio video activity */}
          <div className="flex gap-1 items-end justify-center h-12 w-32 mb-2">
            {[4, 8, 12, 10, 6, 8, 14, 11, 5, 9, 7, 13, 8].map((val, idx) => (
              <motion.div
                key={idx}
                animate={{
                  height: [val, val * 2, val],
                }}
                transition={{
                  duration: 0.8 + idx * 0.05,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1 bg-yellow-500/80 rounded"
              />
            ))}
          </div>

          <span className="text-yellow-400 text-xs font-mono font-bold tracking-widest flex items-center gap-1.5">
            <Play size={12} className="fill-yellow-400 animate-ping" />
            SIMULATED SPONSOR MEDIA PLAYING
          </span>

          <span className="text-slate-500 text-[9px] font-mono mt-1 mt-3">
            Ovie Systems Compiler Sponsor • Match {seconds}s
          </span>

          {/* Progress Overlay bar */}
          <div className="absolute bottom-0 left-0 h-1.5 bg-yellow-500 transition-all duration-1000 ease-linear" style={{ width: `${((10 - seconds) / 10) * 100}%` }} />
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-100 leading-snug">
              Support Ovie Academy Community
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-normal font-sans">
              Thank you for supporting this Ovie programming reference tutorial. Watching this short sponsor video generates active ad revenue to maintain this open-source code compiler.
            </p>
            <div className="text-[8px] font-mono text-slate-500 mt-1.5 select-all bg-slate-950 px-2 py-0.5 rounded border border-slate-900 inline-block">
              Unit ID: ca-app-pub-3677451023005724/3574361611 (Active Reward)
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-850 p-2.5 rounded flex items-center gap-2">
            {playbackComplete ? (
              <CheckCircle2 size={20} className="text-amber-500 shrink-0 animate-pulse" />
            ) : (
              <AlertCircle size={20} className="text-amber-500 shrink-0" />
            )}
            <div>
              <p className="text-[10px] font-semibold text-slate-200 font-sans">
                {playbackComplete ? "Reward Claimable!" : "Playback Status"}
              </p>
              <p className="text-[9px] text-slate-400 font-sans leading-relaxed">
                {playbackComplete
                  ? "You have acquired community supporter credentials! High-eCPM credits assigned to @southwarridev."
                  : `Please watch for ${seconds} more seconds of community sponsor media.`}
              </p>
            </div>
          </div>

          {playbackComplete ? (
            <button
              onClick={handleClaim}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs py-2.5 rounded-lg font-bold transition-all shadow-lg text-center"
            >
              Claim Reward & Support Community
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-slate-800 text-slate-500 text-xs py-2.5 rounded-lg font-bold cursor-not-allowed text-center font-sans"
            >
              Support Community via sponsor play ({seconds}s)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
