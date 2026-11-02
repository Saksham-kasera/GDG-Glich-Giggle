/**
 * STREE ACOUSTICS™ - Procedural Audio Engine
 * Agent: Maestro Decibel (Chief Audio Synthesis & Acoustic Torture Officer)
 * 
 * Uses Web Audio API to synthesize:
 * - Real live background music (Chill elevator lounge chords that distort with volume)
 * - Hilarious sound effects: Slingshot twangs, ice shatter, rubber boing, error buzzer, airhorn, stamp thud
 * - Live Master Gain control that reflects the user's tortured volume percentage
 */

class DecibelAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.currentVolume = 0.42; // default 42%
    this.chordStep = 0;
    
    // Smooth, pretentious elevator-music chord progression (Fmaj7 -> G6 -> Em7 -> Am7)
    this.chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00], // G6
      [164.81, 196.00, 246.94, 329.63], // Em7
      [220.00, 261.63, 329.63, 392.00]  // Am7
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // BGM Gain
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.bgmGain.connect(this.masterGain);

    // SFX Gain
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(volPercent) {
    this.currentVolume = Math.max(0, Math.min(100, volPercent)) / 100;
    if (this.masterGain && this.ctx) {
      // Exponential ramp for realistic ear-splitting or whisper behavior
      const safeGain = Math.max(0.0001, this.currentVolume);
      this.masterGain.gain.setTargetAtTime(safeGain, this.ctx.currentTime, 0.05);
    }
  }

  toggleMusic() {
    this.ensureContext();
    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  startMusic() {
    this.ensureContext();
    this.isPlayingMusic = true;
    this.playNextChord();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  playNextChord() {
    if (!this.isPlayingMusic || !this.ctx) return;
    const chord = this.chords[this.chordStep % this.chords.length];
    this.chordStep++;

    const now = this.ctx.currentTime;
    const duration = 2.4;

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      
      // Lush Rhodes / FM-like synth pad
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle detune for that pretentious high-end Cupertino café aesthetic
      osc.detune.setValueAtTime((idx - 1.5) * 6, now);

      // Volume envelope
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });

    // Add a soft electric bass pluck
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'sawtooth';
    const rootFreq = chord[0] / 2;
    bassOsc.frequency.setValueAtTime(rootFreq, now);

    // Filter to make it mellow
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.15, now + 0.05);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    bassOsc.connect(filter);
    filter.connect(bassGain);
    bassGain.connect(this.bgmGain);

    bassOsc.start(now);
    bassOsc.stop(now + 1.3);

    this.musicTimer = setTimeout(() => {
      this.playNextChord();
    }, 2200);
  }

  // --- SOUND EFFECTS ---

  playTwang() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playIceShatter() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    // Glass/ice shatter: Burst of bandpassed noise + high chime oscillators
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000 + Math.random() * 3000, now + i * 0.03);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.2 + i * 0.03);

      gain.gain.setValueAtTime(0.15, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25 + i * 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.03);
      osc.stop(now + 0.3 + i * 0.03);
    }
  }

  playBoing() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
    osc.frequency.linearRampToValueAtTime(300, now + 0.28);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.31);
  }

  playBuzzer() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.setValueAtTime(95, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playAirhorn() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const freqs = [466.16, 466.16, 622.25]; // Stadium airhorn triad
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq + (idx === 1 ? 5 : 0), now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.55);
    });
  }

  playWaterDrip() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(1800 + Math.random() * 500, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  playCashRegister() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    // "Ka-ching!"
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(now);
    osc1.stop(now + 0.11);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
    gain2.gain.setValueAtTime(0.3, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.45);
  }
}

window.soundEngine = new DecibelAudioEngine();

