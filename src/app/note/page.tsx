"use client";

import { useCallback, useEffect, useState } from "react";
import AnswerButton, { type AnswerState } from "@/components/AnswerButton";
import StatBadges from "@/components/StatBadges";
import { playNote } from "@/lib/audio";
import { loadStats, recordAnswer, resetStats, type GameStats } from "@/lib/storage";
import { midiToNoteName, NOTE_NAMES, randomInt, type NoteName } from "@/lib/theory";

const WHITE_KEY_NAMES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];

type Difficulty = "easy" | "hard";

const OCTAVE_RANGE: Record<Difficulty, [number, number]> = {
  easy: [4, 4],
  hard: [3, 5],
};

function pickNote(difficulty: Difficulty): number {
  const [minOct, maxOct] = OCTAVE_RANGE[difficulty];
  const octave = randomInt(minOct, maxOct);
  const names = difficulty === "easy" ? WHITE_KEY_NAMES : NOTE_NAMES;
  const name = names[randomInt(0, names.length - 1)];
  const pitchClass = NOTE_NAMES.indexOf(name);
  return (octave + 1) * 12 + pitchClass;
}

export default function NoteTrainingPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [target, setTarget] = useState<number | null>(null);
  const [selected, setSelected] = useState<NoteName | null>(null);
  const [locked, setLocked] = useState(false);
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats(loadStats("note"));
  }, []);

  const nextRound = useCallback(
    (diff: Difficulty) => {
      const midi = pickNote(diff);
      setTarget(midi);
      setSelected(null);
      setLocked(false);
    },
    [],
  );

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    nextRound(difficulty);
  }, [difficulty]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const replay = () => {
    if (target !== null) playNote(target);
  };

  const handleAnswer = (name: NoteName) => {
    if (locked || target === null) return;
    setLocked(true);
    setSelected(name);
    const isCorrect = midiToNoteName(target) === name;
    const updated = recordAnswer("note", isCorrect);
    setStats(updated);
  };

  const noteChoices = difficulty === "easy" ? WHITE_KEY_NAMES : NOTE_NAMES;
  const correctName = target !== null ? midiToNoteName(target) : null;

  const stateFor = (name: NoteName): AnswerState => {
    if (!locked) return "idle";
    if (name === correctName) return name === selected ? "correct" : "reveal";
    if (name === selected) return "wrong";
    return "idle";
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">음 맞추기</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          재생되는 음을 듣고 어떤 음인지 맞춰보세요.
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
            {d === "easy" ? "쉬움 (흰 건반, 4옥타브)" : "어려움 (모든 반음, 3~5옥타브)"}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-sm p-8 dark:border-zinc-800/80 dark:bg-zinc-900/70">
        <button
          onClick={replay}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="음 재생"
        >
          ▶
        </button>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">클릭해서 다시 듣기</span>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {noteChoices.map((name) => (
          <AnswerButton
            key={name}
            label={name}
            state={stateFor(name)}
            disabled={locked}
            onClick={() => handleAnswer(name)}
          />
        ))}
      </div>

      {locked && (
        <div className="flex items-center justify-between rounded-xl bg-zinc-100 px-4 py-3 text-sm dark:bg-zinc-800">
          <span>
            정답: <strong>{correctName}</strong>
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
        onClick={() => setStats(resetStats("note"))}
        className="self-start text-xs text-zinc-400 underline hover:text-zinc-600 dark:hover:text-zinc-300"
      >
        통계 초기화
      </button>
    </div>
  );
}
