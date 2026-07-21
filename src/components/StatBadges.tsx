import type { GameStats } from "@/lib/storage";

export default function StatBadges({ stats }: { stats: GameStats }) {
  const accuracy =
    stats.attempts === 0 ? 0 : Math.round((stats.correct / stats.attempts) * 100);

  const items = [
    { label: "시도", value: stats.attempts },
    { label: "정답", value: stats.correct },
    { label: "정확도", value: `${accuracy}%` },
    { label: "현재 연속", value: stats.currentStreak },
    { label: "최고 연속", value: stats.bestStreak },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-center dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</div>
          <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
