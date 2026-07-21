export const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

export function midiToNoteName(midi: number): NoteName {
  return NOTE_NAMES[((midi % 12) + 12) % 12];
}

export function midiToLabel(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${midiToNoteName(midi)}${octave}`;
}

export interface IntervalDef {
  semitones: number;
  name: string;
  short: string;
}

export const INTERVALS: IntervalDef[] = [
  { semitones: 1, name: "단2도", short: "m2" },
  { semitones: 2, name: "장2도", short: "M2" },
  { semitones: 3, name: "단3도", short: "m3" },
  { semitones: 4, name: "장3도", short: "M3" },
  { semitones: 5, name: "완전4도", short: "P4" },
  { semitones: 6, name: "증4도/감5도", short: "TT" },
  { semitones: 7, name: "완전5도", short: "P5" },
  { semitones: 8, name: "단6도", short: "m6" },
  { semitones: 9, name: "장6도", short: "M6" },
  { semitones: 10, name: "단7도", short: "m7" },
  { semitones: 11, name: "장7도", short: "M7" },
  { semitones: 12, name: "완전8도(옥타브)", short: "P8" },
];

export interface ChordDef {
  name: string;
  short: string;
  intervals: number[]; // semitone offsets from root
}

export const CHORDS: ChordDef[] = [
  { name: "장3화음", short: "Major", intervals: [0, 4, 7] },
  { name: "단3화음", short: "Minor", intervals: [0, 3, 7] },
  { name: "감3화음", short: "Diminished", intervals: [0, 3, 6] },
  { name: "증3화음", short: "Augmented", intervals: [0, 4, 8] },
  { name: "장7화음", short: "Major7", intervals: [0, 4, 7, 11] },
  { name: "단7화음", short: "Minor7", intervals: [0, 3, 7, 10] },
  { name: "속7화음", short: "Dominant7", intervals: [0, 4, 7, 10] },
];

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}
