/**
 * UNNATURAL ORDER // UO_OS v0.93 — Procedural Retro-Industrial Sound Engine
 * Pure Web Audio API synthesis (zero external assets). Muted by default until
 * enabled by the user via the Taskbar System Tray or ABYSS.CMD (`sound on`).
 */

export class RetroSoundEngine {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.droneOsc = null;
    this.droneGain = null;
  }

  _ensureCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setEnabled(on) {
    this.enabled = Boolean(on);
    if (this.enabled) {
      this._ensureCtx();
      this.playBootChime();
    } else {
      this.stopFractureDrone();
    }
    return this.enabled;
  }

  toggle() {
    return this.setEnabled(!this.enabled);
  }

  // Crisp mechanical 90s UI click
  playClick() {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1120, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.025);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  // Faint hard-drive seek tick when dragging windows or moving sliders
  playSeekTick() {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180 + Math.random() * 140, now);
    gain.gain.setValueAtTime(0.022, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.014);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.018);
  }

  // Corrupted detuned Win95-inspired boot triad
  playBootChime() {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [220, 261.63, 311.13, 146.83]; // A minor / dark diminished resolve
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 3 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.075);
      osc.frequency.linearRampToValueAtTime(freq * 0.985, now + i * 0.075 + 0.35);
      gain.gain.setValueAtTime(0.0001, now + i * 0.075);
      gain.gain.linearRampToValueAtTime(0.045, now + i * 0.075 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + i * 0.075 + 0.42);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.075);
      osc.stop(now + i * 0.075 + 0.45);
    });
  }

  // Harsh classic OS fatal exception alert chord
  playError() {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [155.56, 146.83].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    });
  }

  // Window open metallic chirp
  playWindowOpen() {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.setValueAtTime(510, now + 0.035);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Low-tuned industrial fracture drone while holding OVERTHROW
  startFractureDrone() {
    if (!this.enabled || this.droneOsc) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, now); // Drop A1 industrial growl
    osc.frequency.linearRampToValueAtTime(41.2, now + 1.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);
    filter.frequency.linearRampToValueAtTime(1100, now + 1.4);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.085, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);

    this.droneOsc = osc;
    this.droneGain = gain;
  }

  stopFractureDrone() {
    if (!this.droneOsc || !this.ctx) return;
    const now = this.ctx.currentTime;
    try {
      this.droneGain.gain.cancelScheduledValues(now);
      this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.14);
      this.droneOsc.stop(now + 0.16);
    } catch (_) {
      // ignore already stopped
    }
    this.droneOsc = null;
    this.droneGain = null;
  }
}
