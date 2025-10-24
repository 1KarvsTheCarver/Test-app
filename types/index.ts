// Type definitions for the app

export type StruggleType = 'porn' | 'social_media' | 'gaming' | 'phone_overuse';
export type FaithPath = 'christian' | 'muslim' | 'secular';
export type GoalType = 'abstinence' | 'moderation';
export type CheckInStatus = 'clean' | 'struggled' | 'slip' | 'relapse';

export interface AnchorVerse {
  text: string;
  reference: string;
  type: FaithPath;
  arabic?: string;
  rating?: number;
}

export interface Goal {
  type: GoalType;
  limits?: Record<string, any>;
}

export interface User {
  uid: string;
  email: string;
  createdAt: Date;
  struggle: StruggleType;
  faithPath: FaithPath;
  anchorVerse: AnchorVerse;
  goal: Goal;
  subscription: {
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: 'active' | 'canceled';
    currentPeriodEnd: Date;
    priceId: string;
  };
  coachId: string;
  streakCount: number;
  lastCheckInDate: string;
  totalCheckIns: number;
}

export interface DailyCheckIn {
  uid: string;
  date: string; // YYYY-MM-DD
  status: CheckInStatus;
  trigger?: string;
  timestamp: Date;
}

export interface AppUsage {
  name: string;
  bundleId: string;
  timeSpent: number; // minutes
  opens: number;
}

export interface UsageData {
  uid: string;
  date: string; // YYYY-MM-DD
  apps: AppUsage[];
  totalScreenTime: number; // minutes
  timestamp: Date;
}

export interface ScoreBreakdown {
  goalAchievement: number; // /40
  engagement: number; // /30
  behavior: number; // /20
  bonus: number; // /10
}

export interface CoachReview {
  uid: string;
  weekStartDate: string; // YYYY-MM-DD
  weekEndDate: string;
  coachId: string;
  reviewText: string; // 150-300 words
  score: number; // 0-100
  scoreBreakdown: ScoreBreakdown;
  createdAt: Date;
  readAt: Date | null;
}
