import type { Achievement } from "@/lib/achievements";

export default function AchievementToast({ achievement }: { achievement: Achievement | null }) {
  if (!achievement) return null;

  return (
    <div className="animate-toast-in fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 shadow-xl dark:border-amber-700 dark:bg-amber-950">
      <span className="text-2xl">{achievement.emoji}</span>
      <div>
        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
          🏅 새 배지 획득!
        </div>
        <div className="font-bold text-zinc-900 dark:text-zinc-50">{achievement.title}</div>
      </div>
    </div>
  );
}
