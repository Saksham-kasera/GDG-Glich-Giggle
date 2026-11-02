/**
 * STREE ACOUSTICS™ - Dark Patterns, Easter Eggs & Unknown Moves
 * Agent: Agent STREE-X (Black Ops & Easter Egg Specialist)
 */

class SecretOperations {
  constructor(app) {
    this.app = app;
    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    this.konamiIndex = 0;
    this.logoClicks = 0;
    this.loanAmount = 0;
    this.loanInterestInterval = null;
    this.leakInterval = null;
    this.valveTightness = 100;
  }

  init() {
    this.initKonamiCode();
    this.initFakeMute();
    this.initVolumeLeakPipe();
    this.initDecibelLoanShark();
    this.initRunawayComplaintBox();
    this.initSecretLogoClicks();
    this.initTosReverseModal();
    this.initHeroReadoutTroll();
    this.initStreeHorrorEffect();
  }

  // 7. Hero Readout Flip Troll
  initHeroReadoutTroll() {
    const readout = document.getElementById('hero-volume-readout');
    if (!readout) return;

    let isFlipped = false;
    readout.addEventListener('dblclick', () => {
      isFlipped = !isFlipped;
      readout.style.transform = isFlipped ? 'rotate(180deg) scale(0.9)' : 'none';
      readout.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
      if (window.soundEngine) window.soundEngine.playBoing();
      this.app.toast(isFlipped ? "🙃 GRAVITY INVERTED: Volume numbers are now Australian!" : "🔄 Gravity restored.", "warning");
    });
  }

  // 0. Reverse-Scroll Terms of Service Modal
  initTosReverseModal() {
    const openBtn = document.getElementById('btn-open-tos');
    const modal = document.getElementById('modal-tos');
    const scrollBox = document.getElementById('tos-scroll-box');
    const scrollPercent = document.getElementById('tos-scroll-percent');
    const acceptBtn = document.getElementById('btn-accept-tos');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    }

    if (scrollBox) {
      // Invert mousewheel scroll!
      scrollBox.addEventListener('wheel', (e) => {
        e.preventDefault();
        // Inverted: deltaY > 0 (down) scrolls UP! deltaY < 0 (up) scrolls DOWN!
        scrollBox.scrollTop -= e.deltaY * 0.8;

        const maxScroll = scrollBox.scrollHeight - scrollBox.clientHeight;
        const current = scrollBox.scrollTop;
        const pct = Math.min(100, Math.max(0, Math.round((current / maxScroll) * 100)));

        if (scrollPercent) scrollPercent.innerText = `Scrolled: ${pct}%`;

        if (pct >= 95 && acceptBtn) {
          acceptBtn.disabled = false;
          acceptBtn.style.opacity = '1';
          acceptBtn.style.cursor = 'pointer';
          acceptBtn.innerText = "I SURRENDER & AGREE";
        }
      }, { passive: false });
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        if (!acceptBtn.disabled) {
          modal.style.display = 'none';
          if (window.soundEngine) window.soundEngine.playCashRegister();
          this.app.toast("📜 Acoustic terms accepted. Your soul is now collateral.", "success");
        }
      });
    }
  }

  // 1. Secret Konami Code
  initKonamiCode() {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const targetKey = this.konamiSequence[this.konamiIndex].toLowerCase();

      if (key === targetKey) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiSequence.length) {
          this.activateAestheticMeltdown();
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  }

  activateAestheticMeltdown() {
    if (window.soundEngine) {
      window.soundEngine.playAirhorn();
      window.soundEngine.startMusic();
    }
    document.body.classList.toggle('meltdown-mode');
    this.app.toast("☣️ KONAMI PROTOCOL ENGAGED: REALITY INVERTED & SOUND OVERDRIVE!", "alert");
    this.app.setMasterVolume(100, true);
  }

  // 2. The Fake Mute Button Trap
  initFakeMute() {
    const muteBtn = document.getElementById('btn-fake-mute');
    if (!muteBtn) return;

    muteBtn.addEventListener('click', () => {
      const answers = [
        "Are you sure? Audio will feel neglected and unloved.",
        "Muting violates Section 4 of our Acoustic Loyalty Agreement.",
        "Mute request denied: Silicon transistors require constant acoustic excitation."
      ];
      const randomPrompt = answers[Math.floor(Math.random() * answers.length)];

      if (confirm(`🔇 ${randomPrompt}\n\nForce mute anyway?`)) {
        // Punish with 100% volume and airhorn!
        if (window.soundEngine) {
          window.soundEngine.playAirhorn();
        }
        this.app.setMasterVolume(100, true);
        this.app.toast("🚨 COURAGE OVERRIDE: We muted the silence! Volume maxed out to 100%!", "alert");
      } else {
        this.app.toast("✨ Thank you for respecting the artist's acoustic dignity.", "success");
      }
    });
  }

  // 3. The Leaking Volume Pipe
  initVolumeLeakPipe() {
    const valveBtn = document.getElementById('btn-tighten-valve');
    const dripVisual = document.getElementById('faucet-drip');
    const leakLevel = document.getElementById('leak-meter');

    this.leakInterval = setInterval(() => {
      // Every 3.5 seconds, decibel drops by 1% due to leak
      if (this.app.currentVolume > 0) {
        this.app.setMasterVolume(Math.max(0, this.app.currentVolume - 1), false);
        if (window.soundEngine) window.soundEngine.playWaterDrip();
        
        // Visual drip animation
        if (dripVisual) {
          dripVisual.classList.remove('dripping');
          void dripVisual.offsetWidth; // trigger reflow
          dripVisual.classList.add('dripping');
        }
      }
    }, 3800);

    if (valveBtn) {
      valveBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playTwang();
        this.valveTightness += 20;

        if (this.valveTightness > 160) {
          // Over-tightened! Pipe explodes!
          if (window.soundEngine) window.soundEngine.playBuzzer();
          this.app.setMasterVolume(0, true);
          this.app.toast("💥 VALVE STRIPPED! Decibel pipe burst! Volume drained to 0%!", "alert");
          this.valveTightness = 40;
        } else {
          this.app.toast("🔧 Valve tightened by 2.4 Newtons (leak slowed down temporarily).", "success");
        }
      });
    }
  }

  // 4. Decibel Loan Shark
  initDecibelLoanShark() {
    const borrowBtn = document.getElementById('btn-borrow-db');
    const loanStatus = document.getElementById('loan-status');

    if (borrowBtn) {
      borrowBtn.addEventListener('click', () => {
        this.loanAmount += 35;
        this.app.setMasterVolume(Math.min(100, this.app.currentVolume + 35), true);
        if (window.soundEngine) window.soundEngine.playCashRegister();
        this.app.toast("💰 LOAN APPROVED: +35 dB credited. (Warning: 300% compound APR applies)", "success");
        if (loanStatus) {
          loanStatus.innerText = `Debt: ${this.loanAmount} dB`;
        }

        // Start debt collector interval if not running
        if (!this.loanInterestInterval) {
          this.loanInterestInterval = setInterval(() => {
            if (this.loanAmount > 0) {
              const interest = 3;
              this.loanAmount += interest;
              const repossessed = Math.min(this.app.currentVolume, 4);
              this.app.setMasterVolume(this.app.currentVolume - repossessed, true);
              if (loanStatus) loanStatus.innerText = `Debt: ${this.loanAmount} dB`;

              this.app.toast(`📉 DEBT COLLECTOR: Repossessed ${repossessed.toFixed(1)} dB! Total owed: ${this.loanAmount} dB`, "warning");

              if (this.app.currentVolume <= 0 && this.loanAmount > 50) {
                document.body.style.filter = "grayscale(100%)";
                this.app.toast("⚖️ FORECLOSURE: Screen color saturation repossessed due to decibel insolvency!", "alert");
              }
            }
          }, 6500);
        }
      });
    }
  }

  // 5. Runaway Complaints Box
  initRunawayComplaintBox() {
    const openBtn = document.getElementById('btn-open-complaints');
    const modal = document.getElementById('modal-complaints');
    const closeBtn = document.getElementById('btn-close-complaints');
    const submitBtn = document.getElementById('btn-submit-complaint');
    const textArea = document.getElementById('complaint-text');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    // Convert typed text to sarcastic audio buzzwords
    if (textArea) {
      textArea.addEventListener('input', (e) => {
        const sarcasm = ["I love acoustic friction! ", "Thank you Jony Ive! ", "More complexity please! ", "Sliders are obsolete! "];
        const val = textArea.value;
        if (val.length % 12 === 0 && val.length > 0) {
          textArea.value += sarcasm[Math.floor(Math.random() * sarcasm.length)];
        }
      });
    }

    // Submit button that flees on hover!
    if (submitBtn) {
      modal.addEventListener('mousemove', (e) => {
        window.physicsEngine.applyEvasion(submitBtn, e.clientX, e.clientY, 90, 160);
      });

      submitBtn.addEventListener('click', () => {
        alert("Grievance discarded. Reason: Sound should be endured, not enjoyed.");
        modal.style.display = 'none';
      });
    }
  }

  // 6. Secret Logo Clicks
  initSecretLogoClicks() {
    const logo = document.getElementById('stree-logo');
    if (!logo) return;

    logo.addEventListener('click', () => {
      this.logoClicks++;
      if (this.logoClicks === 5) {
        if (window.soundEngine) window.soundEngine.playAirhorn();
        alert(
          "✦ THE JONY IVE MEMORANDUM (CONFIDENTIAL) ✦\n\n" +
          "\"To the user who seeks easy decibel adjustment:\n" +
          "If you cannot calibrate a kinetic puck, maintain cryogenic thermal friction,\n" +
          "ballistically propel decibel orbs, and draft a 92% circular notarized permit...\n" +
          "then perhaps you simply do not deserve to listen to music at all.\"\n\n" +
          "— Sir Jony Ive, Chief Design Tormentor"
        );
        this.logoClicks = 0;
      }
    });
  }

  // 8. Horror of Stree Hover Effect (Blood Leaks & Horror Animation)
  initStreeHorrorEffect() {
    const logo = document.getElementById('stree-logo');
    const warning = document.getElementById('horror-stree-warning');
    const bloodContainer = document.getElementById('blood-drip-container');
    if (!logo) return;

    let dripInterval = null;
    let fadeTimeout = null;

    const startHorror = () => {
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
        fadeTimeout = null;
      }

      document.body.classList.add('stree-horror-active');
      logo.classList.add('bleeding-heading');
      if (warning) warning.style.display = 'block';

      if (window.soundEngine && typeof window.soundEngine.startHorrorSound === 'function') {
        window.soundEngine.startHorrorSound();
      }

      if (window.app && !this.horrorToastShown) {
        this.app.toast("🩸 THE CURSE OF STREE AWAKENS: Blood is leaking into the volume coils!", "alert");
        this.horrorToastShown = true;
      }

      // Continuously spawn blood drips while cursor is over STREE
      if (!dripInterval) {
        // Spawn an initial burst of drips
        for (let i = 0; i < 6; i++) {
          this.spawnBloodDrip(logo, bloodContainer);
        }
        dripInterval = setInterval(() => {
          this.spawnBloodDrip(logo, bloodContainer);
        }, 110);
      }
    };

    const stopHorror = () => {
      if (dripInterval) {
        clearInterval(dripInterval);
        dripInterval = null;
      }

      // Linger effect for 1.6s so blood drips continue their drop
      fadeTimeout = setTimeout(() => {
        document.body.classList.remove('stree-horror-active');
        logo.classList.remove('bleeding-heading');
        if (warning) warning.style.display = 'none';
        if (window.soundEngine && typeof window.soundEngine.stopHorrorSound === 'function') {
          window.soundEngine.stopHorrorSound();
        }
        this.horrorToastShown = false;
      }, 1600);
    };

    logo.addEventListener('mouseenter', startHorror);
    logo.addEventListener('mouseleave', stopHorror);
  }

  spawnBloodDrip(logo, container) {
    if (!container) return;
    const rect = logo.getBoundingClientRect();
    const drop = document.createElement('div');
    drop.className = 'blood-drop';

    // Position along the heading width
    const randomX = Math.random() * (rect.width - 30) + 15;
    drop.style.left = `${randomX}px`;
    drop.style.top = `38px`;

    // Vary drip thickness and stream length
    const width = Math.random() * 8 + 4;
    const maxHeight = Math.random() * 220 + 80;
    const duration = Math.random() * 1.0 + 1.2;

    drop.style.width = `${width}px`;
    drop.style.setProperty('--target-height', `${maxHeight}px`);
    drop.style.animationDuration = `${duration}s`;

    container.appendChild(drop);

    setTimeout(() => {
      drop.remove();
    }, duration * 1000 + 200);
  }
}

window.SecretOperations = SecretOperations;
