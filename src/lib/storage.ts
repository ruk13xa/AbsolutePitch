import { recordDailyActivity } from "@/lib/streak";

export type GameKey = "note" | "interval" | "chord";

export interface GameStats {
  attempts: number;
  correct: number;
  bestStreak: number;
  currentStreak: number;
  lastPlayedAt: string | null;
}

const DEFAULT_STATS: GameStats = {
  attempts: 0,
  correct: 0,
  bestStreak: 0,
  currentStreak: 0,
  lastPlayedAt: null,
};

function storageKey(game: GameKey): string {
  return `absolutepitch:stats:${game}`;
}

export function loadStats(game: GameKey): GameStats {
  if (typeof window === "undefined") return { ...DEFAULT_STATS };
  const raw = window.localStorage.getItem(storageKey(game));
  if (!raw) return { ...DEFAULT_STATS };
  try {
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(game: GameKey, stats: GameStats): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(game), JSON.stringify(stats));
}

export function recordAnswer(game: GameKey, isCorrect: boolean): GameStats {
  const stats = loadStats(game);
  stats.attempts += 1;
  if (isCorrect) {
    stats.correct += 1;
    stats.currentStreak += 1;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }
  stats.lastPlayedAt = new Date().toISOString();
  saveStats(game, stats);
  recordDailyActivity();
  return stats;
}

export function resetStats(game: GameKey): GameStats {
  const fresh = { ...DEFAULT_STATS };
  saveStats(game, fresh);
  return fresh;
}

export const GAME_LABELS: Record<GameKey, string> = {
  note: "음 맞추기",
  interval: "인터벌 맞추기",
  chord: "코드 맞추기",
};

const PRACTICE_PRESS_KEY = "absolutepitch:practice-presses";

export function loadPracticePressCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem(PRACTICE_PRESS_KEY)) || 0;
}

export function incrementPracticePressCount(): number {
  const count = loadPracticePressCount() + 1;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PRACTICE_PRESS_KEY, String(count));
  }
  return count;
}
