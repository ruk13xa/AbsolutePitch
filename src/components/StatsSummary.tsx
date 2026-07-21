import StatBadges from "@/components/StatBadges";
import { GAME_LABELS, type GameKey, type GameStats } from "@/lib/storage";

const GAMES: GameKey[] = ["note", "interval", "chord"];

export default function StatsSummary({
  statsMap,
  onReset,
}: {
  statsMap: Record<GameKey, GameStats>;
  onReset?: (game: GameKey) => void;
}) {
  const totalAttempts = GAMES.reduce((sum, g) => sum + statsMap[g].attempts, 0);
  const totalCorrect = GAMES.reduce((sum, g) => sum + statsMap[g].correct, 0);
  const overallAccuracy = totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100);

  return (
    <div className="flex flex-col gap-6">
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
              {onReset && (
                <button
                  onClick={() => onReset(game)}
                  className="text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  초기화
                </button>
              )}
            </div>
            <StatBadges stats={statsMap[game]} />
          </div>
        ))}
      </div>
    </div>
  );
}
