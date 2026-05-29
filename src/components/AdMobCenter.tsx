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
  MousePointerClick,
  Link2,
  Globe,
  HelpCircle,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdMobStats, AdUnit } from "../types";

interface AdMobCenterProps {
  theme?: "dark" | "light";
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
  theme = "dark",
  stats,
  adUnits,
  setStats,
  setAdUnits,
  testMode,
  setTestMode,
  onClose,
}: AdMobCenterProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "ad_units" | "integration" | "link_account">("dashboard");

  // Custom Google Account configuration states
  const [isLinked, setIsLinked] = useState(false);
  const [appId, setAppId] = useState("ca-app-pub-3677451023005724~9721632727");
  const [adsenseId, setAdsenseId] = useState("ca-pub-3677451023005724");
  const [bannerId, setBannerId] = useState("ca-app-pub-3677451023005724/1839210455");
  const [interstitialId, setInterstitialId] = useState("ca-app-pub-3677451023005724/4960321288");
  const [rewardedId, setRewardedId] = useState("ca-app-pub-3677451023005724/3574361611");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load configuration from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ovie_custom_admob_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        setIsLinked(parsed.isLinked ?? false);
        if (parsed.appId) setAppId(parsed.appId);
        if (parsed.adsenseId) setAdsenseId(parsed.adsenseId);
        if (parsed.bannerId) setBannerId(parsed.bannerId);
        if (parsed.interstitialId) setInterstitialId(parsed.interstitialId);
        if (parsed.rewardedId) setRewardedId(parsed.rewardedId);
      }
    } catch (err) {
      console.error("Failed to load custom AdMob configurations:", err);
    }
  }, []);

  // Save changes and update main state
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      isLinked,
      appId: appId.trim(),
      adsenseId: adsenseId.trim(),
      bannerId: bannerId.trim(),
      interstitialId: interstitialId.trim(),
      rewardedId: rewardedId.trim()
    };
    
    localStorage.setItem("ovie_custom_admob_config", JSON.stringify(config));

    // Update parent's state
    setAdUnits((prev) =>
      prev.map((unit) => {
        if (unit.type === "Banner") {
          return { ...unit, adMobId: isLinked ? config.bannerId : "ca-app-pub-3677451023005724/1839210455" };
        }
        if (unit.type === "Interstitial") {
          return { ...unit, adMobId: isLinked ? config.interstitialId : "ca-app-pub-3677451023005724/4960321288" };
        }
        if (unit.type === "Rewarded") {
          return { ...unit, adMobId: isLinked ? config.rewardedId : "ca-app-pub-3677451023005724/3574361611" };
        }
        return unit;
      })
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Format monetary sums
  const formatMoney = (val: number) => `$${val.toFixed(2)}`;

  return (
    <div className={`flex flex-col h-full w-full max-w-md select-none transition-all duration-300 ${theme === "light" ? "bg-white text-slate-900 border-l border-slate-200" : "bg-slate-900 border-l border-slate-800 text-slate-100"}`}>
      {/* Dynamic Header */}
      <div className={`p-4 border-b flex items-center justify-between transition-colors duration-300 ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-500 rounded text-slate-950 font-black text-xs">AdMob</div>
          <h2 className={`font-semibold text-sm tracking-tight transition-colors duration-300 ${theme === "light" ? "text-slate-800" : "text-slate-100"}`}>Monetization Dashboard</h2>
        </div>
        <button
          onClick={onClose}
          id="close-admob-center"
          className={`p-1 rounded transition-colors ${theme === "light" ? "hover:bg-slate-200 text-slate-500 hover:text-slate-800" : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"}`}
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`flex px-2 justify-around border-b transition-colors duration-300 ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950 border-slate-800"}`}>
        <button
          onClick={() => setActiveTab("dashboard")}
          id="admob-tab-dashboard"
          className={`py-2.5 px-2 text-[11px] font-medium border-b-2 transition-all ${
            activeTab === "dashboard"
              ? "border-yellow-500 text-yellow-600 font-extrabold"
              : theme === "light"
                ? "border-transparent text-slate-500 hover:text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setActiveTab("ad_units")}
          id="admob-tab-ad_units"
          className={`py-2.5 px-2 text-[11px] font-medium border-b-2 transition-all ${
            activeTab === "ad_units"
              ? "border-yellow-500 text-yellow-600 font-extrabold"
              : theme === "light"
                ? "border-transparent text-slate-550 hover:text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Ad Units
        </button>
        <button
          onClick={() => setActiveTab("integration")}
          id="admob-tab-integration"
          className={`py-2.5 px-2 text-[11px] font-medium border-b-2 transition-all ${
            activeTab === "integration"
              ? "border-yellow-500 text-yellow-600 font-extrabold"
              : theme === "light"
                ? "border-transparent text-slate-550 hover:text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          SDK Guide
        </button>
        <button
          onClick={() => setActiveTab("link_account")}
          id="admob-tab-link_account"
          className={`py-2.5 px-2 text-[11px] font-medium border-b-2 transition-all ${
            activeTab === "link_account"
              ? "border-yellow-500 text-yellow-600 font-extrabold"
              : theme === "light"
                ? "border-transparent text-slate-550 hover:text-slate-800"
                : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Link Account
        </button>
      </div>

      {/* Scrollable Stats Panel */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 font-sans transition-colors duration-300 ${theme === "light" ? "bg-white text-slate-800" : "bg-slate-900/60 text-slate-300"}`}>
        {/* Toggle Test Mode */}
        <div className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-950/80 border-slate-850"}`}>
          <div>
            <div className={`text-xs font-bold flex items-center gap-1.5 ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}>
              <span>Google Test Ads Mode</span>
              <span className={`w-2 h-2 rounded-full ${testMode ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            </div>
            <p className={`text-[10px] ${theme === "light" ? "text-slate-550 text-slate-500" : "text-slate-400"}`}>Forces sandboxed ad elements inside the tutorial</p>
          </div>
          <button
            onClick={() => setTestMode(!testMode)}
            id="toggle-test-mode"
            className={`transition-colors ${theme === "light" ? "text-slate-650 hover:text-slate-900" : "text-slate-300 hover:text-white"}`}
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
            <div className={`border rounded-lg p-3 space-y-1 ${isLinked ? "bg-green-500/10 border-green-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
              <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isLinked ? "text-green-400" : "text-amber-400"}`}>
                {isLinked ? "Linked Google AdMob App ID" : "Active AdMob App ID (Playground)"}
              </span>
              <p className="text-[11px] font-mono font-bold text-slate-100 select-all">
                {isLinked ? appId : "ca-app-pub-3677451023005724~9721632727"}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 leading-none">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLinked ? "bg-green-500" : "bg-amber-500"}`} />
                <span>Status: {isLinked ? "Connected to Custom Publisher Stream" : "Connected to SouthWarridev Open Source Monetization"}</span>
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

        {activeTab === "link_account" && (
          <form onSubmit={handleSaveConfig} className="space-y-4 font-sans text-slate-200 pb-6">
            <div className="space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-850">
              <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 leading-none">
                <Link2 size={13} className="text-yellow-500" />
                <span>Configure Live Google Ads Stream</span>
              </h3>
              <p className="text-[10px] text-slate-400 leading-normal mt-1">
                Customize references to direct ad revenue generated in the Ovie compiler sandbox straight to your personal Google publisher ledger.
              </p>
            </div>

            {/* Enable/Disable toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-850">
              <div className="space-y-0.5">
                <label className="text-xs font-bold text-slate-200 block">Custom Stream Active</label>
                <span className="text-[9px] text-slate-500 block">Use custom IDs in ad units and guides</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLinked(!isLinked)}
                className="text-slate-300 hover:text-white transition-all pointer-events-auto"
              >
                {isLinked ? (
                  <ToggleRight className="text-green-500" size={32} />
                ) : (
                  <ToggleLeft className="text-slate-600" size={32} />
                )}
              </button>
            </div>

            {/* Custom Inputs */}
            <div className={`space-y-2.5 transition-all ${isLinked ? "opacity-100 pointer-events-auto" : "opacity-40 pointer-events-none"}`}>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wide">
                  1. Google AdSense Publisher Client ID (Web ads client)
                </label>
                <div className="relative">
                  <Globe className="absolute left-2.5 top-2.5 text-slate-650" size={13} />
                  <input
                    type="text"
                    value={adsenseId}
                    onChange={(e) => setAdsenseId(e.target.value)}
                    placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-lg pl-8 p-2 text-[11px] font-mono font-semibold text-slate-100 outline-none transition-all"
                  />
                </div>
                <p className="text-[9px] text-slate-500 leading-none">Format: <code className="text-slate-400">ca-pub-XXXXXXXXXXXXX</code> (Find in AdSense Account &gt; Settings)</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wide">
                  2. Google AdMob App ID (Mobile app client)
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-2.5 top-2.5 text-slate-650" size={13} />
                  <input
                    type="text"
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-lg pl-8 p-2 text-[11px] font-mono font-semibold text-slate-100 outline-none transition-all"
                  />
                </div>
                <p className="text-[9px] text-slate-500 leading-none">Format: <code className="text-slate-400">ca-app-pub-XXXXX~XXXXX</code> (Find in AdMob Console &gt; Apps)</p>
              </div>

              {/* Units config */}
              <div className="p-3 bg-slate-950/45 rounded-lg border border-slate-850 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wide">
                  <Target size={11} className="text-amber-500" /> AdMob Unit Identifiers
                </span>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-slate-450 block">Banner Slot ID</label>
                  <input
                    type="text"
                    value={bannerId}
                    onChange={(e) => setBannerId(e.target.value)}
                    placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-md p-1.5 text-[10.5px] font-mono text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-slate-450 block">Interstitial Dialog ID</label>
                  <input
                    type="text"
                    value={interstitialId}
                    onChange={(e) => setInterstitialId(e.target.value)}
                    placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-md p-1.5 text-[10.5px] font-mono text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-slate-450 block">Rewarded Video ID</label>
                  <input
                    type="text"
                    value={rewardedId}
                    onChange={(e) => setRewardedId(e.target.value)}
                    placeholder="ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-md p-1.5 text-[10.5px] font-mono text-slate-100 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save trigger */}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs py-2 rounded-lg font-bold transition-all shadow hover:shadow-yellow-500/20 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer pointer-events-auto"
            >
              {saveSuccess ? (
                <>
                  <Check size={14} className="stroke-[3]" />
                  <span>Linked & Saved Successfully!</span>
                </>
              ) : (
                <span>Save & Apply Custom IDs</span>
              )}
            </button>

            {/* Step by step helpful guidance documentation */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-850 space-y-2">
              <span className="text-[9.5px] font-semibold text-slate-200 flex items-center gap-1">
                <HelpCircle size={11} className="text-yellow-500" />
                <span>How to find your Publisher credential lines:</span>
              </span>
              <ul className="text-[9.5px] text-slate-400 space-y-1.5 list-disc pl-3 leading-relaxed">
                <li>
                  <strong className="text-slate-350">Google AdSense (for Websites)</strong>: Access your AdSense account dashboard, select <strong className="text-slate-350">Account info</strong> to grab your <em className="text-slate-300">Publisher ID</em> (labeled e.g., <em className="text-slate-300">ca-pub-XXXXXXXXXXXXX</em>).
                </li>
                <li>
                  <strong className="text-slate-350">Google AdMob (for Mobile Apps)</strong>: Go to <strong className="text-slate-350">Apps &gt; View all apps</strong> to create your active app profile and obtain the <em className="text-slate-300">App ID</em>, then configure matching individual Banner, Interstitial, and Rewarded video units.
                </li>
              </ul>
            </div>
          </form>
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
