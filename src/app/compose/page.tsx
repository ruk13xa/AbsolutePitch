"use client";

import { useEffect, useState } from "react";
import { playNote } from "@/lib/audio";
import {
  generateMelody,
  PROGRESSIONS,
  SCALES,
  type ProgressionPreset,
  type ScaleType,
} from "@/lib/composer";
import { deleteMelody, loadSavedMelodies, saveMelody, type SavedMelody } from "@/lib/savedMelodies";
import { recordDailyActivity } from "@/lib/streak";
import { midiToLabel, midiToNoteName, NOTE_NAMES, SOLFEGE, type NoteName } from "@/lib/theory";

const NOTE_LENGTH_OPTIONS = [8, 12, 16];

function playMelodyNotes(notes: number[], onIndex: (i: number | null) => void) {
  const noteDuration = 0.45;
  notes.forEach((midi, i) => {
    window.setTimeout(() => {
      playNote(midi, noteDuration);
      onIndex(i);
      if (i === notes.length - 1) {
        window.setTimeout(() => onIndex(null), noteDuration * 1000);
      }
    }, i * noteDuration * 1000);
  });
}

export default function ComposePage() {
  const [rootName, setRootName] = useState<NoteName>("C");
  const [scaleType, setScaleType] = useState<ScaleType>("major");
  const [progressionIndex, setProgressionIndex] = useState<number | null>(0);
  const [totalNotes, setTotalNotes] = useState(8);
  const [melody, setMelody] = useState<number[] | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [saved, setSaved] = useState<SavedMelody[]>([]);
  const [playingSavedId, setPlayingSavedId] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadSavedMelodies());
  }, []);

  const scale = SCALES[scaleType];
  const progression: ProgressionPreset | null =
    scale.hasTriads && progressionIndex !== null ? PROGRESSIONS[progressionIndex] : null;

  const generate = () => {
    const rootMidi = 60 + NOTE_NAMES.indexOf(rootName);
    const next = generateMelody({ rootMidi, scaleType, progression, totalNotes });
    setMelody(next);
    setPlayingIndex(null);
    setJustSaved(false);
    recordDailyActivity();
  };

  const play = () => {
    if (!melody || melody.length === 0) return;
    playMelodyNotes(melody, setPlayingIndex);
  };

  const handleSave = () => {
    if (!melody) return;
    const label = `${SOLFEGE[rootName]}(${rootName}) ${scale.label}${
      progression ? ` · ${progression.label}` : ""
    }`;
    setSaved(saveMelody(melody, label));
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  };

  const playSaved = (item: SavedMelody) => {
    setPlayingSavedId(item.id);
    playMelodyNotes(item.notes, (i) => {
      if (i === null) setPlayingSavedId(null);
    });
  };

  const removeSaved = (id: string) => {
    setSaved(deleteMelody(id));
  };

  const melodyText = melody?.map((midi) => midiToLabel(midi)).join(" - ") ?? "";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">작곡 도우미</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          키와 스케일, 코드 진행을 고르면 그에 어울리는 멜로디를 무작위로 만들어 들려줘요.
          마음에 드는 멜로디는 저장해두고 나중에 다시 들어볼 수 있어요.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/80 p-4 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70 sm:p-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">키(조성)</span>
          <div className="flex flex-wrap gap-2">
            {NOTE_NAMES.map((name) => (
              <button
                key={name}
                onClick={() => setRootName(name)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  rootName === name
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {SOLFEGE[name]} ({name})
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">스케일</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SCALES) as ScaleType[]).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setScaleType(type);
                  if (!SCALES[type].hasTriads) setProgressionIndex(null);
                  else if (progressionIndex === null) setProgressionIndex(0);
                }}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  scaleType === type
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {SCALES[type].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            코드 진행 {!scale.hasTriads && "(펜타토닉은 코드 진행 없이 자유롭게 생성돼요)"}
          </span>
          <div className="flex flex-wrap gap-2">
            {scale.hasTriads ? (
              PROGRESSIONS.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setProgressionIndex(i)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    progressionIndex === i
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  {p.label}
                </button>
              ))
            ) : (
              <span className="text-sm text-zinc-400 dark:text-zinc-500">해당 없음</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">멜로디 길이</span>
          <div className="flex flex-wrap gap-2">
            {NOTE_LENGTH_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setTotalNotes(n)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                  totalNotes === n
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {n}음
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          className="mt-2 rounded-full bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-indigo-500"
        >
          {melody ? "다시 생성하기" : "멜로디 생성하기"}
        </button>
      </div>

      {melody && (
        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/80 p-4 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {melody.map((midi, i) => (
              <span
                key={i}
                className={`rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                  playingIndex === i
                    ? "border-indigo-500 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                }`}
              >
                {SOLFEGE[midiToNoteName(midi)]}
                <span className="ml-1 text-xs text-zinc-400">{midiToLabel(midi)}</span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={play}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
            >
              ▶ 재생
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              {justSaved ? "저장됨!" : "💾 저장하기"}
            </button>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{melodyText}</span>
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">저장한 멜로디</h2>
          {saved.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-white/80 p-4 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/70 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {item.label}
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500">
                  {new Date(item.createdAt).toLocaleString("ko-KR")}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => playSaved(item)}
                  disabled={playingSavedId === item.id}
                  className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-60"
                >
                  {playingSavedId === item.id ? "재생 중..." : "▶ 재생"}
                </button>
                <button
                  onClick={() => removeSaved(item.id)}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-red-100 hover:text-red-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-red-950 dark:hover:text-red-400"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
