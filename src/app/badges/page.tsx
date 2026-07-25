"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, checkAchievements, type UnlockedMap } from "@/lib/achievements";

export default function BadgesPage() {
  const [unlocked, setUnlocked] = useState<UnlockedMap | null>(null);

  useEffect(() => {
    // Re-evaluates in case stats changed since the last visit (e.g. imported
    // via a shared link elsewhere), not just newly-unlocked ones.
    const { unlocked: current } = checkAchievements();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlocked(current);
  }, []);

  if (!unlocked) return null;

  const unlockedCount = Object.keys(unlocked).length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">배지</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          훈련하면서 조건을 달성하면 배지가 열려요. {unlockedCount} / {ACHIEVEMENTS.length}개 획득
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => {
          const unlockedAt = unlocked[achievement.id];
          return (
            <div
              key={achievement.id}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center backdrop-blur-sm ${
                unlockedAt
                  ? "border-amber-200/80 bg-amber-50/80 dark:border-amber-900/80 dark:bg-amber-950/40"
                  : "border-zinc-200/80 bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-900/50"
              }`}
            >
              <span className={`text-3xl ${unlockedAt ? "" : "opacity-25 grayscale"}`}>
                {achievement.emoji}
              </span>
              <div
                className={`font-semibold ${
                  unlockedAt ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {achievement.title}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{achievement.description}</p>
              {unlockedAt && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  {new Date(unlockedAt).toLocaleDateString("ko-KR")} 획득
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
