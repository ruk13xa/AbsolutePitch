"use client";

import { useState } from "react";
import AchievementToast from "@/components/AchievementToast";
import { playNote } from "@/lib/audio";
import { incrementPracticePressCount } from "@/lib/storage";
import { recordDailyActivity } from "@/lib/streak";
import { BLACK_KEYS, NOTE_NAMES, SOLFEGE, WHITE_KEYS, type NoteName } from "@/lib/theory";
import { useAchievementToast } from "@/lib/useAchievementToast";

function noteToMidi(name: NoteName, octave: number): number {
  return (octave + 1) * 12 + NOTE_NAMES.indexOf(name);
}

export default function PianoKeyboard() {
  const [octave, setOctave] = useState(4);
  const [activeMidi, setActiveMidi] = useState<number | null>(null);
  const { toast, triggerCheck } = useAchievementToast();

  const play = (name: NoteName) => {
    const midi = noteToMidi(name, octave);
    setActiveMidi(midi);
    playNote(midi);
    recordDailyActivity();
    incrementPracticePressCount();
    triggerCheck();
    window.setTimeout(() => setActiveMidi((cur) => (cur === midi ? null : cur)), 250);
  };

  const playScale = async () => {
    for (let i = 0; i < WHITE_KEYS.length; i++) {
      const name = WHITE_KEYS[i];
      const midi = noteToMidi(name, octave);
      setActiveMidi(midi);
      playNote(midi, 0.7);
      await new Promise((resolve) => window.setTimeout(resolve, 420));
    }
    playNote(noteToMidi("C", octave + 1), 0.9);
    setActiveMidi(null);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2 text-xs sm:gap-3 sm:text-sm">
        <button
          onClick={() => setOctave((o) => Math.max(2, o - 1))}
          className="shrink-0 whitespace-nowrap rounded-full bg-zinc-100 px-2.5 py-1.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 sm:px-3"
        >
          − 옥타브
        </button>
        <span className="w-16 shrink-0 whitespace-nowrap text-center font-semibold text-zinc-700 dark:text-zinc-200 sm:w-20">
          옥타브 {octave}
        </span>
        <button
          onClick={() => setOctave((o) => Math.min(6, o + 1))}
          className="shrink-0 whitespace-nowrap rounded-full bg-zinc-100 px-2.5 py-1.5 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 sm:px-3"
        >
          + 옥타브
        </button>
      </div>

      <div className="relative h-56 w-full max-w-xl select-none">
        <div className="flex h-full w-full gap-1">
          {WHITE_KEYS.map((name) => {
            const midi = noteToMidi(name, octave);
            const isActive = activeMidi === midi;
            return (
              <button
                key={name}
                onClick={() => play(name)}
                className={`flex flex-1 flex-col items-center justify-end rounded-b-lg border border-zinc-300 pb-3 text-sm font-semibold shadow-sm transition-colors dark:border-zinc-700 ${
                  isActive
                    ? "bg-indigo-200 dark:bg-indigo-800"
                    : "bg-white hover:bg-indigo-50 dark:bg-zinc-100 dark:hover:bg-indigo-100"
                }`}
              >
                <span className="text-zinc-800">{SOLFEGE[name]}</span>
                <span className="text-xs text-zinc-500">{name}</span>
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none absolute top-0 left-0 flex h-2/3 w-full gap-1">
          {BLACK_KEYS.map((name, i) => {
            if (!name) return <div key={i} className="flex-1" />;
            const midi = noteToMidi(name, octave);
            const isActive = activeMidi === midi;
            return (
              <div key={name} className="relative flex-1">
                <button
                  onClick={() => play(name)}
                  className={`pointer-events-auto absolute right-0 top-0 h-full w-2/3 translate-x-1/2 rounded-b-md text-[10px] font-medium text-zinc-100 shadow-md transition-colors flex flex-col justify-end items-center pb-1 ${
                    isActive ? "bg-indigo-500" : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {SOLFEGE[name]}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={playScale}
        className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white shadow hover:bg-indigo-500"
      >
        도~시 순서대로 재생
      </button>
      <AchievementToast achievement={toast} />
    </div>
  );
}
