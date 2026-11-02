/**
 * STREE ACOUSTICS™ - Opening Policy Form & Molasses Scroll Engine
 * Agent: Dr. Malice "DarkPattern" Von UX & Sir Jony Ive
 * 
 * Implements:
 * 1. Agonizingly slow viscous scroll engine (only 4px per wheel click with hyper-damping).
 * 2. Velocity violation detector (punishes rapid scrolling by throwing user backward).
 * 3. Deceptive double-negative consent checkboxes.
 * 4. Comprehension rate calculator and worst UI audio legal clauses.
 */

class OpeningPolicyManager {
  constructor() {
    this.modal = null;
    this.scrollBox = null;
    this.progressBar = null;
    this.progressText = null;
    this.acceptBtn = null;
    this.scrollPos = 0;
    this.targetPos = 0;
    this.maxScroll = 1;
    this.isAnimRunning = false;
    this.scrollMultiplier = 5.0; // Molasses speed: 5px per notch!
    this.lastWheelTime = 0;
    this.rapidWheelCount = 0;
    this.isAccepted = false;
  }

  init() {
    this.modal = document.getElementById('opening-policy-modal');
    this.scrollBox = document.getElementById('policy-scroll-box');
    this.progressBar = document.getElementById('policy-progress-fill');
    this.progressText = document.getElementById('policy-progress-text');
    this.acceptBtn = document.getElementById('btn-policy-accept');

    if (!this.modal || !this.scrollBox) return;

    // Show modal immediately on open
    this.modal.style.display = 'flex';

    // Calculate max scroll once rendered
    setTimeout(() => {
      this.maxScroll = Math.max(1, this.scrollBox.scrollHeight - this.scrollBox.clientHeight);
    }, 200);

    this.bindScrollEvents();
    this.bindButtons();
    this.startScrollLoop();
  }

  bindScrollEvents() {
    // Intercept mouse wheel with extreme viscous damping
    this.scrollBox.addEventListener('wheel', (e) => {
      e.preventDefault();

      const now = Date.now();
      if (now - this.lastWheelTime < 80) {
        this.rapidWheelCount++;
      } else {
        this.rapidWheelCount = Math.max(0, this.rapidWheelCount - 1);
      }
      this.lastWheelTime = now;

      // Anti-Speeding Radar: If user furiously rolls mouse wheel, penalize them!
      if (this.rapidWheelCount > 8) {
        this.rapidWheelCount = 0;
        this.targetPos = Math.max(0, this.targetPos - 120); // Bounce back!
        this.showPenaltyToast("🚨 VELOCITY VIOLATION: Reading speed exceeded 1.2 words/sec! Penalty: -120px setback for legal contemplation.");
        if (window.soundEngine) window.soundEngine.playBuzzer();
        return;
      }

      // Molasses crawl: only 5px per wheel movement
      const direction = Math.sign(e.deltaY);
      this.targetPos = Math.max(0, Math.min(this.maxScroll, this.targetPos + direction * this.scrollMultiplier));
    }, { passive: false });

    // Custom dragging of the scroll track
    const thumb = document.getElementById('policy-custom-thumb');
    const track = document.getElementById('policy-custom-track');
    let isDraggingThumb = false;
    let startY = 0;
    let startTarget = 0;

    if (thumb && track) {
      thumb.addEventListener('mousedown', (e) => {
        isDraggingThumb = true;
        startY = e.clientY;
        startTarget = this.targetPos;
        thumb.classList.add('grabbing');
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDraggingThumb) return;
        const deltaY = e.clientY - startY;
        const trackHeight = track.clientHeight - thumb.clientHeight;
        const ratio = deltaY / Math.max(1, trackHeight);
        // Heavily damped dragging
        this.targetPos = Math.max(0, Math.min(this.maxScroll, startTarget + ratio * this.maxScroll * 0.4));
      });

      window.addEventListener('mouseup', () => {
        if (isDraggingThumb) {
          isDraggingThumb = false;
          thumb.classList.remove('grabbing');
        }
      });
    }

    // Touch support for mobile/trackpad with molasses resistance
    let touchStartY = 0;
    this.scrollBox.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.scrollBox.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;
      this.targetPos = Math.max(0, Math.min(this.maxScroll, this.targetPos + deltaY * 0.25));
    }, { passive: false });
  }

  startScrollLoop() {
    this.maxScroll = Math.max(1, this.scrollBox.scrollHeight - this.scrollBox.clientHeight);

    const step = () => {
      if (!this.isAccepted) {
        // Ultra-sluggish lerp interpolation (0.035 coefficient = thick molasses)
        this.scrollPos += (this.targetPos - this.scrollPos) * 0.035;
        this.scrollBox.scrollTop = this.scrollPos;

        // Update progress bar
        const pct = Math.min(100, Math.max(0, (this.scrollPos / this.maxScroll) * 100));
        if (this.progressBar) this.progressBar.style.width = `${pct}%`;
        if (this.progressText) {
          this.progressText.innerText = `Legal Assimilation: ${pct.toFixed(2)}% (Clauses digested: ${Math.floor((pct / 100) * 48)} / 48)`;
        }

        // Update custom thumb
        const thumb = document.getElementById('policy-custom-thumb');
        const track = document.getElementById('policy-custom-track');
        if (thumb && track) {
          const avail = track.clientHeight - thumb.clientHeight;
          thumb.style.top = `${(pct / 100) * avail}px`;
        }

        // Unlock when reaching 99.5%
        if (pct >= 99.5 && this.acceptBtn && this.acceptBtn.disabled) {
          this.acceptBtn.disabled = false;
          this.acceptBtn.classList.add('ready-btn');
          this.acceptBtn.innerText = "👉 I SURRENDER ALL RIGHTS & ENTER 👈";
          if (window.soundEngine) window.soundEngine.playCashRegister();
        }
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  bindButtons() {
    // "Speed Up Scroll" Button trap: actually slows it down or reverses!
    const turboBtn = document.getElementById('btn-policy-turbo');
    if (turboBtn) {
      turboBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playBoing();
        this.scrollMultiplier = Math.max(0.8, this.scrollMultiplier * 0.65);
        this.targetPos = Math.max(0, this.targetPos - 40);
        this.showPenaltyToast("🐢 TURBO OVERHEAT: Due to bureaucratic friction, scroll speed reduced by 35%!");
      });
    }

    // Auto-Crawl button: moves at 1 pixel per second
    const crawlBtn = document.getElementById('btn-policy-crawl');
    let crawlInterval = null;
    if (crawlBtn) {
      crawlBtn.addEventListener('click', () => {
        if (crawlInterval) {
          clearInterval(crawlInterval);
          crawlInterval = null;
          crawlBtn.innerText = "▶️ Engage Snail Auto-Crawl (1px/sec)";
        } else {
          crawlBtn.innerText = "⏸️ Pause Snail Auto-Crawl";
          crawlInterval = setInterval(() => {
            if (this.isAccepted) return clearInterval(crawlInterval);
            this.targetPos = Math.min(this.maxScroll, this.targetPos + 1.2);
          }, 180);
          this.showPenaltyToast("🐌 Snail crawl engaged: Estimated completion time: 14 minutes.");
        }
      });
    }

    // Deceptive Checkboxes validation
    const check1 = document.getElementById('policy-check-1');
    const check2 = document.getElementById('policy-check-2');

    if (this.acceptBtn) {
      this.acceptBtn.addEventListener('click', () => {
        if (this.acceptBtn.disabled) return;

        // Check if user fell into the double-negative trap
        if (!check1.checked || check2.checked) {
          if (window.soundEngine) window.soundEngine.playBuzzer();
          alert(
            "❌ ADHERENCE REJECTED BY LEGAL AUDIT:\n\n" +
            "You failed the Cognitive Double-Negative Test!\n" +
            "• Checkbox 1 MUST be checked (agreeing not to disagree).\n" +
            "• Checkbox 2 MUST remain unchecked (declining the non-waiver).\n\n" +
            "Please re-calibrate your legal comprehension."
          );
          return;
        }

        // Acceptance final verification
        if (confirm("FINAL WARNING:\n\nYou are about to enter STREE Acoustics Studio.\nBy clicking OK, you confirm that your patience has been permanently degraded and you will not sue for acoustic irritation.\n\nProceed to the torture?")) {
          this.isAccepted = true;
          this.modal.classList.add('closing-modal');
          if (window.soundEngine) {
            window.soundEngine.playAirhorn();
          }
          setTimeout(() => {
            this.modal.style.display = 'none';
            if (window.app) {
              window.app.toast("🎉 WELCOME TO THE ABYSS: Policy accepted! Enjoy worst-in-class volume controls.", "success");
            }
          }, 700);
        }
      });
    }
  }

  showPenaltyToast(msg) {
    const box = document.getElementById('policy-penalty-box');
    if (!box) return;
    box.innerText = msg;
    box.style.display = 'block';
    box.classList.remove('shake');
    void box.offsetWidth;
    box.classList.add('shake');
    setTimeout(() => {
      box.style.display = 'none';
    }, 4500);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.policyManager = new OpeningPolicyManager();
  window.policyManager.init();
});

