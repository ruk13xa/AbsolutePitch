"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StatsSummary from "@/components/StatsSummary";
import { loadStats, resetStats, type GameKey, type GameStats } from "@/lib/storage";

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

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">통계</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            전체 훈련 진행도를 확인하세요. (브라우저에 로컬로 저장됩니다)
          </p>
        </div>
        <Link
          href="/stats/share"
          className="shrink-0 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
        >
          공유하기
        </Link>
      </div>

      <StatsSummary
        statsMap={statsMap}
        onReset={(game) => setStatsMap((prev) => (prev ? { ...prev, [game]: resetStats(game) } : prev))}
      />
    </div>
  );
}
