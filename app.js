/**
 * STREE ACOUSTICS™ - Master Application Controller
 * Team / Codename: STREE
 * Assigned Theme: Volume Control (Worst UI/UX Challenge)
 * 
 * Lead Designer: Sir Jony "Bravery" Ive-stein
 */

class StreeApp {
  constructor() {
    this.currentVolume = 42.0; // Starting volume: 42%
    this.modes = null;
    this.secrets = null;
    this.ticker = null;
    this.humidityTimer = null;
  }

  init() {
    // Initialize Subsystems
    this.initTicker();
    this.modes = new window.TortureModes(this);
    this.modes.init();

    this.secrets = new window.SecretOperations(this);
    this.secrets.init();

    this.initMasterControls();
    this.startMicroAtmosphericJitter();

    // Welcome Toast
    setTimeout(() => {
      this.toast("✨ Welcome to STREE Acoustics. Please do NOT touch the volume.", "warning");
    }, 800);
  }

  setMasterVolume(val, updateModes = true) {
    this.currentVolume = Math.max(0, Math.min(100, val));

    // Update real Web Audio output
    if (window.soundEngine) {
      window.soundEngine.setVolume(this.currentVolume);
    }

    // Update UI Elements
    const heroReadout = document.getElementById('hero-volume-readout');
    const heroFill = document.getElementById('hero-bar-fill');
    const heroVibe = document.getElementById('hero-vibe-tag');

    if (heroReadout) {
      heroReadout.innerText = `${this.currentVolume.toFixed(3)}%`;
    }
    if (heroFill) {
      heroFill.style.width = `${this.currentVolume}%`;
    }
    if (heroVibe) {
      if (this.currentVolume === 0) heroVibe.innerText = "🔇 ABYSSAL DEPRESSION (0 dB)";
      else if (this.currentVolume < 20) heroVibe.innerText = "🐭 SUB-CELLULAR WHISPER";
      else if (this.currentVolume < 60) heroVibe.innerText = "☕ PRETENTIOUS CUPERTINO LOUNGE";
      else if (this.currentVolume < 85) heroVibe.innerText = "📢 MUNICIPAL AIR RAID SIREN";
      else heroVibe.innerText = "🌋 TINNITUS INDUCING CATACLYSM (100 dB)";
    }
  }

  // Micro-fluctuation to annoy perfectionists (changes by ±0.003% continuously)
  startMicroAtmosphericJitter() {
    setInterval(() => {
      if (this.currentVolume > 0.05 && this.currentVolume < 99.95) {
        const jitter = (Math.random() - 0.5) * 0.006;
        this.currentVolume = Math.max(0, Math.min(100, this.currentVolume + jitter));
        const heroReadout = document.getElementById('hero-volume-readout');
        if (heroReadout) {
          heroReadout.innerText = `${this.currentVolume.toFixed(3)}%`;
        }
      }
    }, 450);
  }

  initMasterControls() {
    const musicBtn = document.getElementById('btn-toggle-soundstage');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        const playing = window.soundEngine.toggleMusic();
        musicBtn.innerText = playing ? "⏸️ Mute Soundstage Chords" : "▶️ Play Cupertino Soundstage";
        musicBtn.classList.toggle('active', playing);
        if (playing) {
          this.toast("🎶 Synthesizing lounge chords. Adjust volume to test auditory punishment!", "success");
        }
      });
    }

    // "Optimize Volume" AI button (Does the opposite of what user expects)
    const aiBtn = document.getElementById('btn-ai-optimize');
    if (aiBtn) {
      aiBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playBoing();
        // Sets volume to a completely absurd irrational number like 71.428%
        const chaoticPicks = [0.001, 99.999, 13.37, 69.42, 3.1415, 88.88];
        const chosen = chaoticPicks[Math.floor(Math.random() * chaoticPicks.length)];
        this.setMasterVolume(chosen, true);
        this.toast(`🤖 AI NEURAL OPTIMIZER: Volume recalibrated to ${chosen}% for your emotional balance.`, "alert");
      });
    }
  }

  initTicker() {
    const tickerText = document.getElementById('agent-ticker-text');
    const quotes = [
      "Sir Jony: 'Conventional sliders were a crutch for impatient listeners.'",
      "Dr. Malice: 'Our telemetry confirms that 99.4% of users gave up. A triumphant day for minimal UI.'",
      "Prof. Newton: 'The first law of acoustic motion: whatever volume you want, you shall not receive.'",
      "Agent STREE-X: 'Remember: In the dark, all sliders look equal. Look for the leak pipe.'",
      "Sir Jony: 'Notice the bespoke brushed chamfers on our rejection dialogs.'",
      "Maestro Decibel: 'True audiophiles enjoy the sound of administrative paperwork.'",
      "Dr. Malice: 'Have you filed your Form 27-B variance today?'"
    ];

    let quoteIdx = 0;
    this.ticker = {
      shout: (msg) => {
        if (tickerText) tickerText.innerText = msg;
      }
    };

    setInterval(() => {
      quoteIdx = (quoteIdx + 1) % quotes.length;
      if (tickerText) tickerText.innerText = quotes[quoteIdx];
    }, 7000);
  }

  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 4200);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new StreeApp();
  window.app.init();
});

