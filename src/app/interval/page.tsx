"use client";

import { useCallback, useEffect, useState } from "react";
import AnswerButton, { type AnswerState } from "@/components/AnswerButton";
import StatBadges from "@/components/StatBadges";
import { playSequence } from "@/lib/audio";
import { loadStats, recordAnswer, resetStats, type GameStats } from "@/lib/storage";
import { INTERVALS, randomInt, type IntervalDef } from "@/lib/theory";

type Difficulty = "easy" | "hard";

const EASY_SEMITONES = [2, 4, 5, 7, 9, 12];

function choicesFor(difficulty: Difficulty): IntervalDef[] {
  return difficulty === "easy"
    ? INTERVALS.filter((i) => EASY_SEMITONES.includes(i.semitones))
    : INTERVALS;
}

export default function IntervalTrainingPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [root, setRoot] = useState(60);
  const [target, setTarget] = useState<IntervalDef | null>(null);
  const [selected, setSelected] = useState<IntervalDef | null>(null);
  const [locked, setLocked] = useState(false);
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats("interval"));
  }, []);

  const nextRound = useCallback((diff: Difficulty) => {
    const options = choicesFor(diff);
    const interval = options[randomInt(0, options.length - 1)];
    const baseRoot = randomInt(55, 67);
    setRoot(baseRoot);
    setTarget(interval);
    setSelected(null);
    setLocked(false);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    nextRound(difficulty);
  }, [difficulty]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const replay = () => {
    if (target !== null) playSequence([root, root + target.semitones]);
  };

  const handleAnswer = (interval: IntervalDef) => {
    if (locked || target === null) return;
    setLocked(true);
    setSelected(interval);
    const isCorrect = interval.semitones === target.semitones;
    const updated = recordAnswer("interval", isCorrect);
    setStats(updated);
  };

  const choices = choicesFor(difficulty);

  const stateFor = (interval: IntervalDef): AnswerState => {
    if (!locked) return "idle";
    if (interval.semitones === target?.semitones) {
      return interval.semitones === selected?.semitones ? "correct" : "reveal";
    }
    if (interval.semitones === selected?.semitones) return "wrong";
    return "idle";
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">인터벌 맞추기</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          연속으로 재생되는 두 음의 간격(인터벌)을 맞춰보세요.
        </p>
      </div>

      {stats && <StatBadges stats={stats} />}

      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">난이도</span>
        {(["easy", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`rounded-full px-3 py-1.5 font-medium ${
              difficulty === d
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {d === "easy" ? "쉬움 (기본 6가지)" : "어려움 (12가지 전체)"}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-sm p-8 dark:border-zinc-800/80 dark:bg-zinc-900/70">
        <button
          onClick={replay}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="인터벌 재생"
        >
          ▶
        </button>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">클릭해서 다시 듣기</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {choices.map((interval) => (
          <AnswerButton
            key={interval.semitones}
            label={`${interval.name} (${interval.short})`}
            state={stateFor(interval)}
            disabled={locked}
            onClick={() => handleAnswer(interval)}
          />
        ))}
      </div>

      {locked && (
        <div className="flex items-center justify-between rounded-xl bg-zinc-100 px-4 py-3 text-sm dark:bg-zinc-800">
          <span>
            정답: <strong>{target?.name}</strong>
          </span>
          <button
            onClick={() => nextRound(difficulty)}
            className="rounded-full bg-indigo-600 px-4 py-1.5 font-semibold text-white"
          >
            다음 문제
          </button>
        </div>
      )}

      <button
        onClick={() => setStats(resetStats("interval"))}
        className="self-start text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
      >
        통계 초기화
      </button>
    </div>
  );
}
