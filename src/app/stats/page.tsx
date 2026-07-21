"use client";

import { useEffect, useState } from "react";
import StatBadges from "@/components/StatBadges";
import { GAME_LABELS, loadStats, resetStats, type GameKey, type GameStats } from "@/lib/storage";

const GAMES: GameKey[] = ["note", "interval", "chord"];

export default function StatsPage() {
  const [statsMap, setStatsMap] = useState<Record<GameKey, GameStats> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatsMap({
      note: loadStats("note"),
      interval: loadStats("interval"),
      chord: loadStats("chord"),
    });
  }, []);

  if (!statsMap) return null;

  const totalAttempts = GAMES.reduce((sum, g) => sum + statsMap[g].attempts, 0);
  const totalCorrect = GAMES.reduce((sum, g) => sum + statsMap[g].correct, 0);
  const overallAccuracy = totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">통계</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          전체 훈련 진행도를 확인하세요. (브라우저에 로컬로 저장됩니다)
        </p>
      </div>

      <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/80 backdrop-blur-sm p-5 dark:border-indigo-900/80 dark:bg-indigo-950/40">
        <div className="text-sm text-indigo-600 dark:text-indigo-300">전체 정확도</div>
        <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-200">
          {overallAccuracy}%
        </div>
        <div className="mt-1 text-xs text-indigo-500 dark:text-indigo-400">
          {totalCorrect} / {totalAttempts} 문제 정답
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {GAMES.map((game) => (
          <div
            key={game}
            className="rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-sm p-5 dark:border-zinc-800/80 dark:bg-zinc-900/70"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {GAME_LABELS[game]}
              </h2>
              <button
                onClick={() =>
                  setStatsMap((prev) => (prev ? { ...prev, [game]: resetStats(game) } : prev))
                }
                className="text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                초기화
              </button>
            </div>
            <StatBadges stats={statsMap[game]} />
          </div>
        ))}
      </div>
    </div>
  );
}
