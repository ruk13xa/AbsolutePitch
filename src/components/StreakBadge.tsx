"use client";

import { useEffect, useState } from "react";
import { getEffectiveStreak, isStreakAtRisk, type DailyStreak } from "@/lib/streak";

export default function StreakBadge() {
  const [streak, setStreak] = useState<DailyStreak | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStreak(getEffectiveStreak());
  }, []);

  if (!streak || streak.currentStreak === 0) return null;

  const atRisk = isStreakAtRisk(streak);

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-4 backdrop-blur-sm ${
        atRisk
          ? "border-amber-200/80 bg-amber-50/80 dark:border-amber-900/80 dark:bg-amber-950/40"
          : "border-orange-200/80 bg-orange-50/80 dark:border-orange-900/80 dark:bg-orange-950/40"
      }`}
    >
      <span className="text-3xl">🔥</span>
      <div>
        <div className="font-bold text-zinc-900 dark:text-zinc-50">
          {streak.currentStreak}일 연속 훈련 중
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {atRisk
            ? "오늘 아직 훈련 전이에요 — 지금 연습하면 기록이 이어져요!"
            : `최고 기록 ${streak.bestStreak}일`}
        </div>
      </div>
    </div>
  );
}
