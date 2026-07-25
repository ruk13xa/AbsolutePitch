let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

// MIDI note number -> frequency (A4 = 69 = 440Hz)
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// A handful of fixed-ratio harmonics with the fundamental clearly dominant,
// for a mild piano-like character without ever competing with the
// fundamental for perceived pitch. No time-varying filter here — a shifting
// timbre makes the pitch itself sound unstable, which defeats the point of
// an ear-training tool.
const HARMONICS = [1, 2, 3, 4];
const HARMONIC_GAINS = [1, 0.28, 0.12, 0.06];

function playTone(freq: number, startAt: number, duration: number, gainValue: number) {
  const audio = getContext();

  const voiceGain = audio.createGain();
  voiceGain.connect(audio.destination);

  const attack = 0.004;
  const decayTo = gainValue * 0.3;

  voiceGain.gain.setValueAtTime(0, startAt);
  voiceGain.gain.linearRampToValueAtTime(gainValue, startAt + attack);
  // Piano notes decay continuously rather than holding a sustain plateau.
  voiceGain.gain.setTargetAtTime(decayTo, startAt + attack, duration * 0.35);
  voiceGain.gain.setTargetAtTime(0, startAt + duration * 0.6, duration * 0.3);

  HARMONICS.forEach((mult, i) => {
    const osc = audio.createOscillator();
    const harmonicGain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq * mult;
    harmonicGain.gain.value = HARMONIC_GAINS[i];

    osc.connect(harmonicGain);
    harmonicGain.connect(voiceGain);

    osc.start(startAt);
    osc.stop(startAt + duration + 0.3);
  });
}

/** Play a single MIDI note. */
export function playNote(midi: number, duration = 1.5): void {
  const audio = getContext();
  playTone(midiToFreq(midi), audio.currentTime, duration, 0.3);
}

/** Play several MIDI notes together (a chord). */
export function playChord(midiNotes: number[], duration = 2): void {
  const audio = getContext();
  const now = audio.currentTime;
  midiNotes.forEach((midi) => playTone(midiToFreq(midi), now, duration, 0.22));
}

/** Play a sequence of MIDI notes one after another (a melodic interval). */
export function playSequence(midiNotes: number[], noteDuration = 1.1, gap = 0.05): void {
  const audio = getContext();
  let t = audio.currentTime;
  midiNotes.forEach((midi) => {
    playTone(midiToFreq(midi), t, noteDuration, 0.3);
    t += noteDuration + gap;
  });
}
