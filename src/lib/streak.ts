const STREAK_KEY = "absolutepitch:daily-streak";

export interface DailyStreak {
  lastDate: string | null; // YYYY-MM-DD, local time
  currentStreak: number;
  bestStreak: number;
}

const DEFAULT_STREAK: DailyStreak = {
  lastDate: null,
  currentStreak: 0,
  bestStreak: 0,
};

function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime()) / msPerDay);
}

export function loadStreak(): DailyStreak {
  if (typeof window === "undefined") return { ...DEFAULT_STREAK };
  const raw = window.localStorage.getItem(STREAK_KEY);
  if (!raw) return { ...DEFAULT_STREAK };
  try {
    return { ...DEFAULT_STREAK, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STREAK };
  }
}

function saveStreak(streak: DailyStreak): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

/** Call whenever the user completes a training action. Bumps the daily streak at most once per day. */
export function recordDailyActivity(): DailyStreak {
  const streak = loadStreak();
  const today = todayKey();

  if (streak.lastDate === today) {
    return streak;
  }

  const gap = streak.lastDate ? daysBetween(streak.lastDate, today) : null;
  const nextCurrent = gap === 1 ? streak.currentStreak + 1 : 1;

  const updated: DailyStreak = {
    lastDate: today,
    currentStreak: nextCurrent,
    bestStreak: Math.max(streak.bestStreak, nextCurrent),
  };
  saveStreak(updated);
  return updated;
}

/** True if today's activity hasn't been recorded yet (streak would lapse without practicing today). */
export function isStreakAtRisk(streak: DailyStreak): boolean {
  return streak.lastDate !== todayKey() && streak.currentStreak > 0;
}

/**
 * Read-only view of the streak as it will resolve on next activity, without
 * writing anything. Unlike loadStreak(), this reports 0 once more than a day
 * has passed since lastDate, rather than showing a stale pre-break count.
 */
export function getEffectiveStreak(): DailyStreak {
  const streak = loadStreak();
  if (!streak.lastDate) return streak;

  const gap = daysBetween(streak.lastDate, todayKey());
  if (gap > 1) {
    return { ...streak, currentStreak: 0 };
  }
  return streak;
}
