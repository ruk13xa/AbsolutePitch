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

// Rough piano-like spectrum: a handful of harmonics with decaying amplitude,
// approximating the timbre of a struck string rather than a plain oscillator.
const HARMONICS = [1, 2, 3, 4, 5, 6, 8];
const HARMONIC_GAINS = [1, 0.55, 0.3, 0.18, 0.1, 0.07, 0.04];

function playTone(freq: number, startAt: number, duration: number, gainValue: number) {
  const audio = getContext();

  // Shared envelope + tone-brightening filter for this note ("voice").
  const voiceGain = audio.createGain();
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.7;
  filter.frequency.setValueAtTime(freq * 10, startAt);
  filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 2, 200), startAt + duration);

  const attack = 0.004;
  const decayTo = gainValue * 0.25;

  voiceGain.gain.setValueAtTime(0, startAt);
  voiceGain.gain.linearRampToValueAtTime(gainValue, startAt + attack);
  // Piano notes decay continuously rather than holding a sustain plateau.
  voiceGain.gain.setTargetAtTime(decayTo, startAt + attack, duration * 0.35);
  voiceGain.gain.setTargetAtTime(0, startAt + duration * 0.6, duration * 0.3);

  filter.connect(voiceGain);
  voiceGain.connect(audio.destination);

  HARMONICS.forEach((mult, i) => {
    const osc = audio.createOscillator();
    const harmonicGain = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = freq * mult;
    harmonicGain.gain.value = HARMONIC_GAINS[i];

    osc.connect(harmonicGain);
    harmonicGain.connect(filter);

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
