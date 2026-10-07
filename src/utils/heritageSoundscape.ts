// Native Web Audio API Soundscape Generator
// Creates an authentic, resonant Indian Tanpura meditative drone with 4-string plucking cycle and sacred temple bell harmonics.
// 100% offline, zero external audio assets, zero bandwidth!

class HeritageSoundscape {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private loopInterval: number | null = null;
  private pendingTimeoutIds: number[] = [];
  private baseVolume: number = 0.06; // Soft, ambient whisper level (non-intrusive)
  private isDucked: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft sacred temple brass bell with rich warm harmonics
  public playTempleChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Sacred brass chime harmonic frequencies: D4 chord (293.66Hz, 587.33Hz, 880Hz, 1174Hz, 1760Hz)
      const freqs = [293.66, 587.33, 880.0, 1174.66, 1760.0];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle, soft chime strike and decay (low initial gain)
        const initialGain = 0.025 / (idx + 1);
        gain.gain.setValueAtTime(initialGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.6);
      });
    } catch {
      // AudioContext policy fallback
    }
  }

  // Pluck an individual Tanpura string with authentic gentle jawari overtone
  private pluckString(freq: number, duration: number = 4.0, stringGain: number = 0.08) {
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator(); // Fundamental
      const osc2 = this.ctx.createOscillator(); // Jawari 2nd harmonic (warm)
      const osc3 = this.ctx.createOscillator(); // Jawari 3rd harmonic (gentle overtone)
      const stringGainNode = this.ctx.createGain();

      osc1.type = 'triangle'; // Smoother than sawtooth to avoid harsh mid frequencies
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, now);

      // Acoustic warm lowpass filter - keeps sound in low warmth zone, completely freeing voice frequencies (300Hz-3500Hz)
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + duration);

      // Gentle attack and quiet sustained decay
      const targetGain = this.isDucked ? (stringGain * 0.35) : stringGain;
      stringGainNode.gain.setValueAtTime(0.0005, now);
      stringGainNode.gain.linearRampToValueAtTime(targetGain * this.baseVolume, now + 0.12);
      stringGainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(stringGainNode);
      stringGainNode.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration + 0.1);
      osc2.stop(now + duration + 0.1);
      osc3.stop(now + duration + 0.1);
    } catch {
      // Ignore
    }
  }

  // Start continuous Indian Tanpura 4-string strumming cycle (Pa - Sa - Sa - Sa)
  public startAmbientDrone(volume: number = 0.06) {
    if (this.isRunning) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      this.baseVolume = Math.max(0.01, Math.min(0.20, volume));
      this.masterGain = this.ctx.createGain();
      const currentTargetGain = this.isDucked ? 0.35 : 1.0;
      this.masterGain.gain.setValueAtTime(currentTargetGain, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.isRunning = true;

      // Traditional Tanpura tuning in C (C3 / C4):
      // 1st String: Pa (Pancham) = 196.00 Hz (G3)
      // 2nd String: Jodi Sa = 261.63 Hz (C4)
      // 3rd String: Jodi Sa = 261.63 Hz (C4)
      // 4th String: Kharja Sa (Low) = 130.81 Hz (C3)
      const strings = [
        { freq: 196.00, gain: 0.08, delay: 0 },     // String 1: Pa
        { freq: 261.63, gain: 0.07, delay: 1500 },  // String 2: Sa
        { freq: 261.63, gain: 0.07, delay: 3000 },  // String 3: Sa
        { freq: 130.81, gain: 0.09, delay: 4500 }   // String 4: Kharja Sa (Deep warm base)
      ];

      const playCycle = () => {
        if (!this.isRunning) return;
        strings.forEach((s) => {
          const tid = window.setTimeout(() => {
            if (this.isRunning) {
              this.pluckString(s.freq, 4.2, s.gain);
            }
          }, s.delay);
          this.pendingTimeoutIds.push(tid);
        });
      };

      // Play immediate first cycle
      playCycle();

      // Loop every 6.0 seconds (relaxing, slow continuous 4-string cycle)
      this.loopInterval = window.setInterval(playCycle, 6000);
    } catch {
      this.isRunning = false;
    }
  }

  // Auto-Ducking: lowers Tanpura to whisper level (~0.02) during audio voice narration
  public duckVolume(duck: boolean) {
    this.isDucked = duck;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      const targetGain = duck ? 0.30 : 1.0;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.25);
    }
  }

  public setDroneVolume(volume: number) {
    this.baseVolume = Math.max(0.01, Math.min(0.20, volume));
    if (this.masterGain && this.ctx) {
      const target = this.isDucked ? 0.30 : 1.0;
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.1);
    }
  }

  public stopAmbientDrone() {
    this.isRunning = false;
    this.isDucked = false;

    if (this.loopInterval !== null) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }

    this.pendingTimeoutIds.forEach((id) => clearTimeout(id));
    this.pendingTimeoutIds = [];

    try {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      }
    } catch {
      // Ignore
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public getCurrentVolume(): number {
    return this.baseVolume;
  }
}

export const heritageSoundscape = new HeritageSoundscape();
