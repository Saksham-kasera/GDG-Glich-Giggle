/**
 * STREE ACOUSTICS™ - Chaotic Physics Engine
 * Agent: Prof. Isaac "Zero-Friction" Newton (Principal Physics of Agony Engineer)
 * 
 * Implements:
 * 1. Frictionless DVD-Screensaver Slider with momentum and elastic collision.
 * 2. Ballistic Slingshot Canvas with trajectory, wind drift, targets, and orbital hoops.
 * 3. Evasive Vector Repulsion for buttons that flee from the user's cursor.
 */

class PhysicsModule {
  constructor() {
    this.slingshotCanvas = null;
    this.slingshotCtx = null;
    this.slingshotAnimId = null;

    // Slingshot State
    this.slingshot = {
      anchorX: 70,
      anchorY: 180,
      ballX: 70,
      ballY: 180,
      ballRadius: 14,
      isDragging: false,
      isFlying: false,
      vx: 0,
      vy: 0,
      gravity: 0.35,
      wind: 0.05,
      drag: 0.992
    };

    // Slingshot Targets (Floating decibel bubbles)
    this.targets = [
      { x: 340, y: 70, r: 24, val: 25, label: "+25%", color: "#10b981", vy: 1.2 },
      { x: 440, y: 150, r: 28, val: 50, label: "+50%", color: "#3b82f6", vy: -1.5 },
      { x: 360, y: 230, r: 20, val: 5, label: "+5%", color: "#f59e0b", vy: 1.8 },
      { x: 480, y: 80, r: 22, val: -30, label: "-30%", color: "#ef4444", vy: -1.0 },
      { x: 260, y: 120, r: 16, val: 100, label: "💥 100%", color: "#ec4899", vy: 2.2 } // Hazardous jackpot
    ];

    // Bouncy Slider State
    this.bouncy = {
      pos: 42, // percent 0 to 100
      vel: 1.4, // speed
      running: true,
      lastLocked: 42
    };
  }

  // --- 1. BOUNCY SLIDER LOGIC ---
  updateBouncySlider(trackWidth) {
    if (!this.bouncy.running) return this.bouncy.pos;

    this.bouncy.pos += this.bouncy.vel;

    // Elastic bounce off ends with slight random speed variation
    if (this.bouncy.pos >= 99) {
      this.bouncy.pos = 99;
      this.bouncy.vel = -Math.abs(this.bouncy.vel) - (Math.random() * 0.4 - 0.2);
      if (window.soundEngine) window.soundEngine.playBoing();
    } else if (this.bouncy.pos <= 1) {
      this.bouncy.pos = 1;
      this.bouncy.vel = Math.abs(this.bouncy.vel) + (Math.random() * 0.4 - 0.2);
      if (window.soundEngine) window.soundEngine.playBoing();
    }

    // Keep velocity bounded
    if (Math.abs(this.bouncy.vel) < 0.8) this.bouncy.vel = 1.2 * Math.sign(this.bouncy.vel || 1);
    if (Math.abs(this.bouncy.vel) > 3.0) this.bouncy.vel = 2.0 * Math.sign(this.bouncy.vel);

    return this.bouncy.pos;
  }

  lockBouncySlider() {
    this.bouncy.running = false;
    this.bouncy.lastLocked = Math.round(this.bouncy.pos);
    return this.bouncy.lastLocked;
  }

  resumeBouncySlider() {
    this.bouncy.running = true;
    this.bouncy.vel = (Math.random() > 0.5 ? 1.5 : -1.5) * (1 + Math.random() * 0.8);
  }

  // --- 2. EVASIVE BUTTON REPULSION (High-Velocity Panic Repulsion) ---
  applyEvasion(buttonElement, cursorX, cursorY, threshold = 175, maxPush = 260) {
    if (!buttonElement) return;
    const rect = buttonElement.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = cursorX - btnCenterX;
    const dy = cursorY - btnCenterY;
    const dist = Math.hypot(dx, dy);

    if (dist < threshold) {
      // Repel vector away from cursor
      let angle = Math.atan2(dy, dx);
      let pushFactor = (1 - dist / threshold) * maxPush;

      // Close-range panic response: If cursor gets within 75px, fling away with boost!
      if (dist < 75) {
        pushFactor *= 1.45;
        angle += (Math.random() - 0.5) * 0.8; // erratic sideways evasion
        const moveX = -Math.cos(angle) * pushFactor;
        const moveY = -Math.sin(angle) * pushFactor;
        const rot = (Math.random() - 0.5) * 16;
        buttonElement.style.transform = `translate(${moveX}px, ${moveY}px) scale(0.92) rotate(${rot}deg)`;
        buttonElement.style.transition = 'transform 0.05s cubic-bezier(0.1, 0.9, 0.2, 1)';
        return true;
      }
      
      // Calculate standard repulsive offset
      const moveX = -Math.cos(angle) * pushFactor;
      const moveY = -Math.sin(angle) * pushFactor;

      buttonElement.style.transform = `translate(${moveX}px, ${moveY}px) scale(0.96)`;
      buttonElement.style.transition = 'transform 0.06s ease-out';
      return true;
    } else {
      // Return gently
      buttonElement.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
      buttonElement.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
      return false;
    }
  }

  // Fling button away violently when click is ignored!
  forcePanicDodge(buttonElement) {
    if (!buttonElement) return;
    const randAngle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 80;
    const randX = Math.cos(randAngle) * distance;
    const randY = Math.sin(randAngle) * distance;
    const randRot = (Math.random() - 0.5) * 30;

    buttonElement.style.transform = `translate(${randX}px, ${randY}px) scale(0.88) rotate(${randRot}deg)`;
    buttonElement.style.transition = 'transform 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }

  // --- 3. SLINGSHOT CANVAS LOGIC ---
  initSlingshot(canvas, onTargetHit, onMiss) {
    this.slingshotCanvas = canvas;
    this.slingshotCtx = canvas.getContext('2d');
    this.onTargetHit = onTargetHit;
    this.onMiss = onMiss;

    // Reset ball
    this.resetSlingshotBall();

    // Event listeners
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const onStart = (e) => {
      if (this.slingshot.isFlying) return;
      const p = getPos(e);
      const d = Math.hypot(p.x - this.slingshot.ballX, p.y - this.slingshot.ballY);
      if (d < this.slingshot.ballRadius * 2.5) {
        this.slingshot.isDragging = true;
      }
    };

    const onMove = (e) => {
      if (!this.slingshot.isDragging) return;
      const p = getPos(e);
      // Limit drag distance
      const dx = p.x - this.slingshot.anchorX;
      const dy = p.y - this.slingshot.anchorY;
      const dist = Math.hypot(dx, dy);
      const maxDrag = 90;

      if (dist > maxDrag) {
        const angle = Math.atan2(dy, dx);
        this.slingshot.ballX = this.slingshot.anchorX + Math.cos(angle) * maxDrag;
        this.slingshot.ballY = this.slingshot.anchorY + Math.sin(angle) * maxDrag;
      } else {
        this.slingshot.ballX = p.x;
        this.slingshot.ballY = p.y;
      }
    };

    const onEnd = () => {
      if (!this.slingshot.isDragging) return;
      this.slingshot.isDragging = false;
      const dx = this.slingshot.anchorX - this.slingshot.ballX;
      const dy = this.slingshot.anchorY - this.slingshot.ballY;
      const power = Math.hypot(dx, dy);

      if (power > 12) {
        this.slingshot.isFlying = true;
        this.slingshot.vx = dx * 0.24;
        this.slingshot.vy = dy * 0.24;
        // Random gust of crosswind
        this.slingshot.wind = (Math.random() - 0.48) * 0.2;
        if (window.soundEngine) window.soundEngine.playTwang();
      } else {
        this.resetSlingshotBall();
      }
    };

    canvas.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    canvas.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    this.startSlingshotLoop();
  }

  resetSlingshotBall() {
    this.slingshot.ballX = this.slingshot.anchorX;
    this.slingshot.ballY = this.slingshot.anchorY;
    this.slingshot.vx = 0;
    this.slingshot.vy = 0;
    this.slingshot.isFlying = false;
    this.slingshot.isDragging = false;
  }

  startSlingshotLoop() {
    if (this.slingshotAnimId) cancelAnimationFrame(this.slingshotAnimId);

    const render = () => {
      this.updateSlingshot();
      this.drawSlingshot();
      this.slingshotAnimId = requestAnimationFrame(render);
    };
    render();
  }

  updateSlingshot() {
    const s = this.slingshot;
    const c = this.slingshotCanvas;
    if (!c) return;

    // Update targets floating up & down
    this.targets.forEach(t => {
      t.y += t.vy;
      if (t.y < 45 || t.y > c.height - 45) {
        t.vy *= -1;
      }
    });

    // Flying physics
    if (s.isFlying) {
      s.vx += s.wind;
      s.vy += s.gravity;
      s.vx *= s.drag;
      s.vy *= s.drag;

      s.ballX += s.vx;
      s.ballY += s.vy;

      // Check collision with targets
      for (let t of this.targets) {
        const dist = Math.hypot(s.ballX - t.x, s.ballY - t.y);
        if (dist < s.ballRadius + t.r) {
          // HIT!
          if (this.onTargetHit) this.onTargetHit(t.val, t.label);
          this.resetSlingshotBall();
          return;
        }
      }

      // Check bounds / miss
      if (s.ballX > c.width + 40 || s.ballY > c.height + 40 || s.ballX < -40) {
        // Missed!
        if (this.onMiss) this.onMiss();
        this.resetSlingshotBall();
      }
    }
  }

  drawSlingshot() {
    const ctx = this.slingshotCtx;
    const c = this.slingshotCanvas;
    if (!ctx || !c) return;
    const s = this.slingshot;

    ctx.clearRect(0, 0, c.width, c.height);

    // Draw backdrop grid / radar circles
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x < c.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, c.height);
      ctx.stroke();
    }
    for (let y = 0; y < c.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(c.width, y);
      ctx.stroke();
    }

    // Draw wind indicator (High Clarity)
    ctx.fillStyle = "#ffee00";
    ctx.font = "bold 13px Consolas, monospace";
    ctx.fillText(`Crosswind Drift: ${(s.wind * 100).toFixed(1)} kt ${s.wind > 0 ? "→" : "←"}`, 20, 26);

    // Trajectory Aim Guide when dragging (Makes UI clear & engaging)
    if (s.isDragging) {
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(255, 238, 0, 0.6)";
      ctx.lineWidth = 2;
      const aimDx = (s.anchorX - s.ballX) * 3;
      const aimDy = (s.anchorY - s.ballY) * 3;
      ctx.moveTo(s.ballX, s.ballY);
      ctx.lineTo(s.ballX + aimDx, s.ballY + aimDy);
      ctx.stroke();
      ctx.setLineDash([]); // reset
    }

    // Draw slingshot slings / rubber bands (Hazard Yellow)
    ctx.beginPath();
    ctx.strokeStyle = "#ffee00";
    ctx.lineWidth = 6;
    ctx.moveTo(s.anchorX - 10, s.anchorY - 20);
    ctx.lineTo(s.ballX, s.ballY);
    ctx.lineTo(s.anchorX + 10, s.anchorY + 20);
    ctx.stroke();

    // Draw base post
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(s.anchorX - 6, s.anchorY - 25, 12, 50);

    // Draw targets
    this.targets.forEach(t => {
      // Outer border
      ctx.shadowBlur = 10;
      ctx.shadowColor = t.color;
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.fill();

      // Sharp black outline for ultimate clarity
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      ctx.stroke();

      // Bold, legible label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px 'Trebuchet MS', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t.label, t.x, t.y);
    });

    // Draw ball (The Toxic Decibel Pellet)
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ff66";
    ctx.fillStyle = "#00ff66";
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, s.ballRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#000000";
    ctx.font = "bold 11px 'Trebuchet MS', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("dB", s.ballX, s.ballY);
  }
}

window.physicsEngine = new PhysicsModule();

