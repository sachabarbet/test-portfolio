import { PHYSICS, WORLD, COLORS } from './config.js';

// Le joueur : un petit robot néon. Physique de plateforme + rendu vectoriel.
export class Player {
  constructor(x, y) {
    this.spawnX = x;
    this.spawnY = y;
    this.w = 30;
    this.h = 42;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.grounded = false;
    this.animT = 0;
    this.squash = 1; // étirement vertical (saut/atterrissage)

    this._coyote = 0;
    this._buffer = 0;
    this.lastSafe = { x, y };
  }

  get cx() {
    return this.x + this.w / 2;
  }
  get cy() {
    return this.y + this.h / 2;
  }

  respawn() {
    this.x = this.lastSafe.x;
    this.y = this.lastSafe.y - 4;
    this.vx = 0;
    this.vy = 0;
  }

  update(dt, input, platforms, onJump) {
    // --- Horizontal : accélération vers la vitesse cible ---------------------
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const target = dir * PHYSICS.moveSpeed;
    const k = 1 - Math.exp(-PHYSICS.accelK * dt);
    this.vx += (target - this.vx) * k;
    if (dir !== 0) this.facing = dir;

    // --- Saut : coyote time + buffer + saut variable -------------------------
    this._coyote = this.grounded ? PHYSICS.coyoteTime : Math.max(0, this._coyote - dt);
    if (input.jumpJustPressed) this._buffer = PHYSICS.jumpBuffer;
    else this._buffer = Math.max(0, this._buffer - dt);

    if (this._buffer > 0 && this._coyote > 0) {
      this.vy = -PHYSICS.jumpVelocity;
      this._buffer = 0;
      this._coyote = 0;
      this.grounded = false;
      this.squash = 0.7; // étirement vertical au décollage
      if (onJump) onJump();
    }
    // Relâcher tôt coupe la montée (saut court).
    if (!input.jump && this.vy < 0) this.vy *= 1 - (1 - PHYSICS.jumpCutMultiplier) * Math.min(1, dt * 18);

    // --- Gravité -------------------------------------------------------------
    this.vy += PHYSICS.gravity * dt;
    if (this.vy > PHYSICS.maxFallSpeed) this.vy = PHYSICS.maxFallSpeed;

    // --- Déplacement + collisions (résolution par axe) -----------------------
    this.x += this.vx * dt;
    this._collide(platforms, 'x');
    this.y += this.vy * dt;
    const wasAir = !this.grounded;
    this._collide(platforms, 'y');
    if (this.grounded && wasAir) this.squash = 1.35; // écrasement à l'atterrissage

    // Mémorise une position sûre quand on est posé.
    if (this.grounded) this.lastSafe = { x: this.x, y: this.y };

    // Chute hors du monde -> respawn.
    if (this.y > WORLD.deathY) this.respawn();

    // --- Animation -----------------------------------------------------------
    this.animT += dt * (1 + Math.abs(this.vx) / 120);
    this.squash += (1 - this.squash) * Math.min(1, dt * 12); // retour au repos
  }

  _collide(platforms, axis) {
    if (axis === 'y') this.grounded = false;
    for (const p of platforms) {
      if (!aabb(this, p)) continue;
      if (axis === 'x') {
        if (this.vx > 0) this.x = p.x - this.w;
        else if (this.vx < 0) this.x = p.x + p.w;
        this.vx = 0;
      } else {
        if (this.vy > 0) {
          this.y = p.y - this.h;
          this.grounded = true;
        } else if (this.vy < 0) {
          this.y = p.y + p.h;
        }
        this.vy = 0;
      }
    }
  }

  draw(ctx, cam) {
    const x = this.x - cam.x;
    const y = this.y - cam.y;
    const sq = this.squash;
    const w = this.w / sq;
    const h = this.h * sq;
    const cx = x + this.w / 2;
    const feet = y + this.h;
    const bob = this.grounded ? Math.sin(this.animT * 9) * 1.2 : 0;
    const run = this.grounded ? Math.sin(this.animT * 14) : 0;
    const moving = Math.abs(this.vx) > 20;

    ctx.save();
    ctx.translate(cx, feet);
    ctx.scale(this.facing, 1);

    // Ombre au sol
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 2, this.w * 0.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyTop = -h + bob;

    // Jambes
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.shadowColor = COLORS.cyan;
    ctx.shadowBlur = 8;
    const legSwing = moving ? run * 6 : 0;
    ctx.beginPath();
    ctx.moveTo(-5, -8);
    ctx.lineTo(-5 - legSwing, 0);
    ctx.moveTo(5, -8);
    ctx.lineTo(5 + legSwing, 0);
    ctx.stroke();

    // Corps (capsule arrondie)
    const bw = w * 0.74;
    ctx.fillStyle = '#10131f';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2.5;
    roundRect(ctx, -bw / 2, bodyTop + 8, bw, h - 16, 9);
    ctx.fill();
    ctx.stroke();

    // Visière (regard) orientée vers l'avant
    ctx.shadowBlur = 14;
    ctx.fillStyle = COLORS.cyan;
    roundRect(ctx, -bw / 2 + 4, bodyTop + 14, bw - 6, 9, 4);
    ctx.fill();

    // Antenne avec pointe lumineuse
    ctx.shadowBlur = 10;
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, bodyTop + 8);
    ctx.lineTo(3, bodyTop - 2);
    ctx.stroke();
    ctx.fillStyle = COLORS.yellow;
    ctx.shadowColor = COLORS.yellow;
    ctx.beginPath();
    ctx.arc(3, bodyTop - 3, 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
