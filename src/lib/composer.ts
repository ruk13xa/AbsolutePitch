import { randomInt } from "@/lib/theory";

export type ScaleType = "major" | "minor" | "majorPentatonic" | "minorPentatonic";

export const SCALES: Record<ScaleType, { label: string; intervals: number[]; hasTriads: boolean }> = {
  major: { label: "메이저(장조)", intervals: [0, 2, 4, 5, 7, 9, 11], hasTriads: true },
  minor: { label: "마이너(단조)", intervals: [0, 2, 3, 5, 7, 8, 10], hasTriads: true },
  majorPentatonic: { label: "메이저 펜타토닉", intervals: [0, 2, 4, 7, 9], hasTriads: false },
  minorPentatonic: { label: "마이너 펜타토닉", intervals: [0, 3, 5, 7, 10], hasTriads: false },
};

export interface ProgressionPreset {
  label: string;
  // 0-based scale degrees (0 = I, 1 = ii, ...)
  degrees: number[];
}

export const PROGRESSIONS: ProgressionPreset[] = [
  { label: "I - V - vi - IV", degrees: [0, 4, 5, 3] },
  { label: "I - IV - V - I", degrees: [0, 3, 4, 0] },
  { label: "vi - IV - I - V", degrees: [5, 3, 0, 4] },
  { label: "ii - V - I", degrees: [1, 4, 0] },
  { label: "I - vi - IV - V", degrees: [0, 5, 3, 4] },
];

/** Builds every scale-tone MIDI note across `octaves` octaves starting at rootMidi. */
function scaleNotes(rootMidi: number, intervals: number[], octaves: number): number[] {
  const notes: number[] = [];
  for (let o = 0; o < octaves; o++) {
    for (const interval of intervals) {
      notes.push(rootMidi + o * 12 + interval);
    }
  }
  return notes;
}

export interface GenerateMelodyOptions {
  rootMidi: number;
  scaleType: ScaleType;
  progression: ProgressionPreset | null;
  totalNotes: number;
}

/** Generates a melody as a list of MIDI notes, loosely following a chord progression when given. */
export function generateMelody({
  rootMidi,
  scaleType,
  progression,
  totalNotes,
}: GenerateMelodyOptions): number[] {
  const scale = SCALES[scaleType];
  const octaves = 3;
  const allTones = scaleNotes(rootMidi, scale.intervals, octaves);
  const scaleLen = scale.intervals.length;

  // Keep the melody within a comfortable one-and-a-bit octave range around
  // the root, indexed into allTones (which spans multiple octaves).
  const lowIndex = scaleLen; // start of the 2nd octave block
  const highIndex = scaleLen * 2 + Math.floor(scaleLen / 2);

  const melody: number[] = [];
  let prevIndex = lowIndex + Math.floor(scaleLen / 2);

  const segments = progression && scale.hasTriads ? progression.degrees : [0];
  const perSegment = Math.max(1, Math.round(totalNotes / segments.length));

  segments.forEach((degree) => {
    const chordToneIndices = scale.hasTriads
      ? [0, 2, 4].map((offset) => lowIndex + degree + offset)
      : [];

    for (let i = 0; i < perSegment; i++) {
      let nextIndex: number;

      if (i === 0 && chordToneIndices.length > 0) {
        // Land on whichever chord tone is closest to where the melody left off.
        nextIndex = chordToneIndices.reduce((closest, idx) =>
          Math.abs(idx - prevIndex) < Math.abs(closest - prevIndex) ? idx : closest,
        );
      } else if (chordToneIndices.length > 0 && Math.random() < 0.35) {
        nextIndex = chordToneIndices[randomInt(0, chordToneIndices.length - 1)];
      } else {
        const step = pickStep();
        nextIndex = prevIndex + step;
      }

      nextIndex = Math.max(lowIndex, Math.min(highIndex, nextIndex));
      melody.push(allTones[nextIndex]);
      prevIndex = nextIndex;
    }
  });

  return melody;
}

// Weighted toward small stepwise motion, occasionally a bigger leap.
function pickStep(): number {
  const weighted = [-2, -1, -1, -1, 1, 1, 1, 2, 0, -3, 3];
  return weighted[randomInt(0, weighted.length - 1)];
}
