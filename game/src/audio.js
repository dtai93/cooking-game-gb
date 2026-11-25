// Synthesized stall sounds. Nothing is fetched; the tune is a short pentatonic loop.

let ctx = null;
let muted = false;
let armed = false;
let master = null;
let tuneTime = 0;
let nextNote = 0;

const MELODY = [0, 3, 5, 7, 5, 3, 2, 3, 0, 2, 3, 7, 5, 3, 2, 0];
const ROOT = 220;

export function armAudio() {
  armed = true;
}

function audioCtx() {
  if (muted || !armed) return null;
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) return null;
  try {
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, dur, type, gain) {
  const ac = audioCtx();
  if (!ac) return;
  try {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(gain || 0.2, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    o.connect(g);
    g.connect(master);
    o.start();
    o.stop(ac.currentTime + dur + 0.02);
  } catch {
    /* headless or a suspended context */
  }
}

function noise(dur, gain, freq) {
  const ac = audioCtx();
  if (!ac) return;
  try {
  const n = Math.floor(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, n, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = freq || 800;
  const g = ac.createGain();
  g.gain.value = gain || 0.2;
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start();
  } catch {
    /* headless or a suspended context */
  }
}

export function setMuted(flag) {
  muted = flag;
  if (master) master.gain.value = flag ? 0 : 0.18;
}

export function playChop() { noise(0.05, 0.35, 420); tone(160, 0.05, 'square', 0.08); }
export function playSizzle() { noise(0.18, 0.22, 1400); }
export function playDing() { tone(660, 0.12, 'sine', 0.2); tone(990, 0.18, 'sine', 0.12); }
export function playCash() { tone(880, 0.08, 'square', 0.1); tone(1320, 0.14, 'square', 0.08); }
export function playBurn() { tone(90, 0.25, 'sawtooth', 0.08); }
export function playThud() { tone(110, 0.06, 'triangle', 0.12); }

export function updateTune(dt) {
  if (muted) return;
  tuneTime += dt;
  if (tuneTime < nextNote) return;
  const step = Math.floor(nextNote / 0.28) % MELODY.length;
  const freq = ROOT * (2 ** (MELODY[step] / 12));
  tone(freq, 0.22, 'triangle', 0.05);
  nextNote += 0.28;
}
