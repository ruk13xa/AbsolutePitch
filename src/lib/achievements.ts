import { loadPracticePressCount, loadStats, type GameKey } from "@/lib/storage";
import { loadStreak } from "@/lib/streak";

const GAMES: GameKey[] = ["note", "interval", "chord"];
const UNLOCKED_KEY = "absolutepitch:achievements";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  isUnlocked: (data: AchievementData) => boolean;
}

export interface AchievementData {
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  bestStreakAny: number;
  playedAllGames: boolean;
  chordAttempts: number;
  dailyStreakBest: number;
  practicePresses: number;
}

export function collectAchievementData(): AchievementData {
  const statsByGame = GAMES.map((game) => loadStats(game));
  const totalAttempts = statsByGame.reduce((sum, s) => sum + s.attempts, 0);
  const totalCorrect = statsByGame.reduce((sum, s) => sum + s.correct, 0);
  const bestStreakAny = Math.max(0, ...statsByGame.map((s) => s.bestStreak));
  const playedAllGames = statsByGame.every((s) => s.attempts > 0);
  const chordAttempts = loadStats("chord").attempts;
  const streak = loadStreak();

  return {
    totalAttempts,
    totalCorrect,
    overallAccuracy: totalAttempts === 0 ? 0 : (totalCorrect / totalAttempts) * 100,
    bestStreakAny,
    playedAllGames,
    chordAttempts,
    dailyStreakBest: streak.bestStreak,
    practicePresses: loadPracticePressCount(),
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    emoji: "🎯",
    title: "첫 걸음",
    description: "아무 훈련이나 1번 완료하기",
    isUnlocked: (d) => d.totalAttempts >= 1,
  },
  {
    id: "correct-10",
    emoji: "✅",
    title: "정답 10개",
    description: "전체 정답 10개 달성",
    isUnlocked: (d) => d.totalCorrect >= 10,
  },
  {
    id: "correct-50",
    emoji: "🌟",
    title: "정답 50개",
    description: "전체 정답 50개 달성",
    isUnlocked: (d) => d.totalCorrect >= 50,
  },
  {
    id: "correct-100",
    emoji: "🏆",
    title: "정답 100개",
    description: "전체 정답 100개 달성",
    isUnlocked: (d) => d.totalCorrect >= 100,
  },
  {
    id: "streak-10",
    emoji: "🔥",
    title: "연속 정답 10",
    description: "한 게임에서 10문제 연속 정답 맞히기",
    isUnlocked: (d) => d.bestStreakAny >= 10,
  },
  {
    id: "accuracy-master",
    emoji: "🧠",
    title: "정확도 마스터",
    description: "20문제 이상 풀고 정확도 90% 이상 달성",
    isUnlocked: (d) => d.totalAttempts >= 20 && d.overallAccuracy >= 90,
  },
  {
    id: "all-games",
    emoji: "🎮",
    title: "올라운더",
    description: "음/인터벌/코드 훈련을 모두 한 번씩 플레이",
    isUnlocked: (d) => d.playedAllGames,
  },
  {
    id: "chord-master",
    emoji: "🎼",
    title: "코드 마스터",
    description: "코드 맞추기 20회 이상 도전",
    isUnlocked: (d) => d.chordAttempts >= 20,
  },
  {
    id: "daily-3",
    emoji: "📅",
    title: "3일 연속 훈련",
    description: "3일 연속으로 훈련하기",
    isUnlocked: (d) => d.dailyStreakBest >= 3,
  },
  {
    id: "daily-7",
    emoji: "🗓️",
    title: "일주일 개근",
    description: "7일 연속으로 훈련하기",
    isUnlocked: (d) => d.dailyStreakBest >= 7,
  },
  {
    id: "daily-30",
    emoji: "📆",
    title: "한 달 개근",
    description: "30일 연속으로 훈련하기",
    isUnlocked: (d) => d.dailyStreakBest >= 30,
  },
  {
    id: "practice-50",
    emoji: "🎹",
    title: "건반 탐험가",
    description: "건반 연습에서 건반을 50번 눌러보기",
    isUnlocked: (d) => d.practicePresses >= 50,
  },
];

export type UnlockedMap = Record<string, string>; // achievement id -> unlocked-at ISO string

export function loadUnlockedAchievements(): UnlockedMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(UNLOCKED_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveUnlockedAchievements(map: UnlockedMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UNLOCKED_KEY, JSON.stringify(map));
}

/** Re-evaluates all achievements against current stats, persisting any newly unlocked ones. */
export function checkAchievements(): { newlyUnlocked: Achievement[]; unlocked: UnlockedMap } {
  const data = collectAchievementData();
  const unlocked = loadUnlockedAchievements();
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked[achievement.id] && achievement.isUnlocked(data)) {
      unlocked[achievement.id] = new Date().toISOString();
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievements(unlocked);
  }

  return { newlyUnlocked, unlocked };
}
