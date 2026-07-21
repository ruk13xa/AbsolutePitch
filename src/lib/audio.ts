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

function playTone(freq: number, startAt: number, duration: number, gainValue: number) {
  const audio = getContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "triangle";
  osc.frequency.value = freq;

  const attack = 0.01;
  const release = 0.15;

  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(gainValue, startAt + attack);
  gain.gain.setValueAtTime(gainValue, startAt + duration - release);
  gain.gain.linearRampToValueAtTime(0, startAt + duration);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

/** Play a single MIDI note. */
export function playNote(midi: number, duration = 1.2): void {
  const audio = getContext();
  playTone(midiToFreq(midi), audio.currentTime, duration, 0.25);
}

/** Play several MIDI notes together (a chord). */
export function playChord(midiNotes: number[], duration = 1.6): void {
  const audio = getContext();
  const now = audio.currentTime;
  midiNotes.forEach((midi) => playTone(midiToFreq(midi), now, duration, 0.18));
}

/** Play a sequence of MIDI notes one after another (a melodic interval). */
export function playSequence(midiNotes: number[], noteDuration = 0.9, gap = 0.05): void {
  const audio = getContext();
  let t = audio.currentTime;
  midiNotes.forEach((midi) => {
    playTone(midiToFreq(midi), t, noteDuration, 0.25);
    t += noteDuration + gap;
  });
}
