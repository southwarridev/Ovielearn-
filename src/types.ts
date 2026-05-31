/**
 * Types defining interactive courses, lessons, and simulated AdMob values.
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  theory: string;
  codeBoilerplate: string;
  interactiveChallenge: {
    question: string;
    type: "fill_in_the_blank" | "multiple_choice";
    choices?: string[];
    correctAnswer: string;
    placeholder?: string;
  };
  isPremium?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface AdMobStats {
  estimatedEarnings: number;
  unlockedRevenue: number;
  impressions: number;
  ecpm: number;
  clicks: number;
  matchRate: number;
  hourlyActivity?: number[];
}

export interface AdUnit {
  id: string;
  name: string;
  type: "Banner" | "Interstitial" | "Rewarded";
  adMobId: string;
  impressions: number;
  earnings: number;
}
