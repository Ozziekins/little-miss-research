/**
 * Background music engine: synthesises the loop from src/lib/music.ts with Web Audio.
 * No audio files, so no licensing and nothing to download.
 */
import {
  BARS_DATA,
  DRUMS,
  LOOP_STEPS,
  MELODY,
  STEPS_PER_BAR,
  melodyOn,
  midiToFreq,
  stepDuration,
  stepOffset,
} from '@/lib/music';

const LOOKAHEAD = 0.2;
const TICK_MS = 50;
const VOLUME = 0.32;

export class Music {
  private ctx?: AudioContext;
  private out!: GainNode;
  private bus!: GainNode;
  private wobble!: GainNode;
  private noise!: AudioBuffer;
  private crackle?: AudioBufferSourceNode;
  private timer?: number;
  private step = 0;
  private start = 0;

  get playing(): boolean {
    return this.timer !== undefined;
  }

  /** Must be called from a user gesture the first time (browser autoplay rules). */
  async play(): Promise<void> {
    if (this.playing) return;
    const ctx = this.ctx ?? this.setup();
    await ctx.resume();
    this.out.gain.cancelScheduledValues(ctx.currentTime);
    this.out.gain.setValueAtTime(this.out.gain.value, ctx.currentTime);
    this.out.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 1.5);
    this.step = 0;
    this.start = ctx.currentTime + 0.1;
    this.startCrackle();
    this.timer = window.setInterval(() => this.schedule(), TICK_MS);
    this.schedule();
  }

  stop(): void {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;
    clearInterval(this.timer);
    this.timer = undefined;
    this.out.gain.cancelScheduledValues(ctx.currentTime);
    this.out.gain.setValueAtTime(this.out.gain.value, ctx.currentTime);
    this.out.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    const crackle = this.crackle;
    this.crackle = undefined;
    setTimeout(() => {
      crackle?.stop();
      if (!this.playing) void ctx.suspend();
    }, 500);
  }

  /** Pause the clock while the tab is hidden (timers get throttled there anyway). */
  setHidden(hidden: boolean): void {
    if (!this.ctx || !this.playing) return;
    if (hidden) void this.ctx.suspend();
    else void this.ctx.resume();
  }

  private setup(): AudioContext {
    const ctx = new AudioContext();
    this.ctx = ctx;

    // Warm, slightly dusty master chain: bus → lowpass → compressor → out.
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 2600;
    this.bus = ctx.createGain();
    this.bus.connect(tone).connect(comp).connect(this.out).connect(ctx.destination);

    // Tape wobble: a slow LFO nudging every oscillator's pitch by a few cents.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.35;
    this.wobble = ctx.createGain();
    this.wobble.gain.value = 6;
    lfo.connect(this.wobble);
    lfo.start();

    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    document.addEventListener('visibilitychange', () => this.setHidden(document.hidden));
    return ctx;
  }

  private schedule(): void {
    const ctx = this.ctx!;
    const bar = stepDuration() * STEPS_PER_BAR;
    while (true) {
      const s = this.step;
      const time = this.start + Math.floor(s / STEPS_PER_BAR) * bar + stepOffset(s % STEPS_PER_BAR);
      if (time > ctx.currentTime + LOOKAHEAD) break;
      if (time >= ctx.currentTime - 0.05) this.playStep(s, time);
      this.step++;
    }
  }

  private playStep(s: number, t: number): void {
    const loopStep = s % LOOP_STEPS;
    const inBar = loopStep % STEPS_PER_BAR;
    const bar = BARS_DATA[Math.floor(loopStep / STEPS_PER_BAR)]!;
    const barLen = stepDuration() * STEPS_PER_BAR;

    if (inBar === 0) bar.chord.forEach((n) => this.rhodes(n, t, barLen * 0.95, 0.05));
    if (inBar === 10) bar.chord.slice(1).forEach((n) => this.rhodes(n, t, barLen * 0.3, 0.025));
    for (const hit of bar.bass) if (hit.step === inBar) this.bass(hit.note, t);

    if (melodyOn(Math.floor(s / LOOP_STEPS))) {
      for (const hit of MELODY) if (hit.step === loopStep) this.vibes(hit.note, t);
    }

    const k = DRUMS.kick[inBar];
    if (k) this.kick(t, k);
    const sn = DRUMS.snare[inBar];
    if (sn) this.snare(t, sn);
    const h = DRUMS.hat[inBar];
    if (h) this.hat(t, h * (0.8 + Math.random() * 0.4));
  }

  private osc(type: OscillatorType, freq: number, t: number, end: number, dest: AudioNode, detune = 0) {
    const o = this.ctx!.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    this.wobble.connect(o.detune);
    o.connect(dest);
    o.start(t);
    o.stop(end);
    o.onended = () => this.wobble.disconnect(o.detune);
    return o;
  }

  private env(t: number, peak: number, attack: number, length: number): GainNode {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);
    g.connect(this.bus);
    return g;
  }

  /** Electric-piano-ish: two soft sines, a touch detuned. */
  private rhodes(note: number, t: number, length: number, vol: number) {
    const f = midiToFreq(note);
    const g = this.env(t, vol, 0.03, length);
    this.osc('sine', f, t, t + length, g, -4);
    this.osc('triangle', f, t, t + length, g, 5);
  }

  private bass(note: number, t: number) {
    const g = this.env(t, 0.22, 0.01, 0.45);
    this.osc('triangle', midiToFreq(note), t, t + 0.5, g);
  }

  /** Vibraphone: a sine plus a bell-like 4th harmonic that fades quickly, with a soft echo. */
  private vibes(note: number, t: number) {
    const f = midiToFreq(note);
    for (const [delay, level] of [
      [0, 0.06],
      [stepDuration() * 3, 0.02],
    ] as const) {
      const at = t + delay;
      this.osc('sine', f, at, at + 0.9, this.env(at, level, 0.005, 0.85));
      this.osc('sine', f * 4, at, at + 0.2, this.env(at, level * 0.25, 0.002, 0.15));
    }
  }

  private kick(t: number, vel: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    o.connect(this.env(t, 0.45 * vel, 0.003, 0.3));
    o.start(t);
    o.stop(t + 0.32);
  }

  private noiseHit(t: number, vol: number, length: number, type: BiquadFilterType, freq: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    src.connect(f).connect(this.env(t, vol, 0.002, length));
    src.start(t, Math.random());
    src.stop(t + length + 0.02);
  }

  /** Brushed snare. */
  private snare(t: number, vel: number) {
    this.noiseHit(t, 0.12 * vel, 0.18, 'bandpass', 1800);
  }

  private hat(t: number, vel: number) {
    this.noiseHit(t, 0.035 * vel, 0.04, 'highpass', 7000);
  }

  /** Quiet vinyl crackle under everything. */
  private startCrackle() {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() < 0.0006 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.01;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 1200;
    const g = ctx.createGain();
    g.gain.value = 0.12;
    src.connect(f).connect(g).connect(this.bus);
    src.start();
    this.crackle = src;
  }
}
