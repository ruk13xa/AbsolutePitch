"use client";

import { useCallback, useEffect, useState } from "react";
import AchievementToast from "@/components/AchievementToast";
import AnswerButton, { type AnswerState } from "@/components/AnswerButton";
import StatBadges from "@/components/StatBadges";
import { playChord } from "@/lib/audio";
import { loadStats, recordAnswer, resetStats, type GameStats } from "@/lib/storage";
import { CHORDS, randomInt, type ChordDef } from "@/lib/theory";
import { useAchievementToast } from "@/lib/useAchievementToast";

type Difficulty = "easy" | "hard";

const EASY_CHORD_NAMES = ["Major", "Minor", "Diminished", "Augmented"];

function choicesFor(difficulty: Difficulty): ChordDef[] {
  return difficulty === "easy"
    ? CHORDS.filter((c) => EASY_CHORD_NAMES.includes(c.short))
    : CHORDS;
}

export default function ChordTrainingPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [root, setRoot] = useState(60);
  const [target, setTarget] = useState<ChordDef | null>(null);
  const [selected, setSelected] = useState<ChordDef | null>(null);
  const [locked, setLocked] = useState(false);
  const [stats, setStats] = useState<GameStats | null>(null);
  const { toast, triggerCheck } = useAchievementToast();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats("chord"));
  }, []);

  const nextRound = useCallback((diff: Difficulty) => {
    const options = choicesFor(diff);
    const chord = options[randomInt(0, options.length - 1)];
    const baseRoot = randomInt(55, 64);
    setRoot(baseRoot);
    setTarget(chord);
    setSelected(null);
    setLocked(false);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    nextRound(difficulty);
  }, [difficulty]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const replay = () => {
    if (target !== null) playChord(target.intervals.map((offset) => root + offset));
  };

  const handleAnswer = (chord: ChordDef) => {
    if (locked || target === null) return;
    setLocked(true);
    setSelected(chord);
    const isCorrect = chord.short === target.short;
    const updated = recordAnswer("chord", isCorrect);
    setStats(updated);
    triggerCheck();
  };

  const choices = choicesFor(difficulty);

  const stateFor = (chord: ChordDef): AnswerState => {
    if (!locked) return "idle";
    if (chord.short === target?.short) {
      return chord.short === selected?.short ? "correct" : "reveal";
    }
    if (chord.short === selected?.short) return "wrong";
    return "idle";
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">코드 맞추기</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          동시에 재생되는 화음을 듣고 코드의 종류를 맞춰보세요.
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
            {d === "easy" ? "쉬움 (기본 4가지)" : "어려움 (7th 코드 포함)"}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-sm p-8 dark:border-zinc-800/80 dark:bg-zinc-900/70">
        <button
          onClick={replay}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="코드 재생"
        >
          ▶
        </button>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">클릭해서 다시 듣기</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {choices.map((chord) => (
          <AnswerButton
            key={chord.short}
            label={`${chord.name} (${chord.short})`}
            state={stateFor(chord)}
            disabled={locked}
            onClick={() => handleAnswer(chord)}
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
        onClick={() => setStats(resetStats("chord"))}
        className="self-start text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
      >
        통계 초기화
      </button>
      <AchievementToast achievement={toast} />
    </div>
  );
}
