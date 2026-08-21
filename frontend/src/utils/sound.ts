// Web Audio API Procedural Sound Engine
// Zero external network requests, zero latency, ultra-crisp tactile audio feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private masterVolume: number = 0.15; // Pleasant, subtle default volume

  constructor() {
    // Check localStorage preference
    const saved = localStorage.getItem('veridexa_sound_enabled');
    if (saved !== null) {
      this.isEnabled = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('veridexa_sound_enabled', String(enabled));
    if (enabled) {
      this.playClick();
    }
  }

  /**
   * Crisp, modern tactile mechanical switch click
   */
  public playClick(pitchModifier: number = 1.0): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Bandpass filter for crisp switch snap sound
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 * pitchModifier, now);
      filter.Q.setValueAtTime(3.5, now);

      // Pitch micro-sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800 * pitchModifier, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

      // Fast exponential envelope decay
      gain.gain.setValueAtTime(this.masterVolume * 0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // AudioContext policy suppression fallback
    }
  }

  /**
   * Soft popping click for pills and minor navigation toggles
   */
  public playSoftClick(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

      gain.gain.setValueAtTime(this.masterVolume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {}
  }

  /**
   * Pleasant two-tone chime for completion, validation passes, or copies
   */
  public playSuccess(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [587.33, 880.0]; // D5 -> A5

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(this.masterVolume * 0.7, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.28);
      });
    } catch {}
  }

  /**
   * Multi-signal triumphant chord for resolving discrepancies or pipeline completion
   */
  public playResolved(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C Major chord (C5, E5, G5, C6)

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        gain.gain.setValueAtTime(this.masterVolume * 0.6, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.45);
      });
    } catch {}
  }

  /**
   * Subtle alert sound for conflict detection or deletions
   */
  public playAlert(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.setValueAtTime(360, now + 0.05);

      gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }
}

export const sound = new SoundEngine();
