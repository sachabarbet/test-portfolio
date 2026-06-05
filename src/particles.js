// Système de particules : motes d'ambiance (parallaxe) + éclats de collecte.
export class Particles {
  constructor(worldW) {
    this.bursts = []; // particules temporaires
    this.motes = []; // motes d'ambiance persistantes
    for (let i = 0; i < 70; i++) {
      this.motes.push({
        x: Math.random() * worldW,
        y: Math.random() * 720,
        r: Math.random() * 1.8 + 0.4,
        depth: Math.random() * 0.6 + 0.2, // facteur de parallaxe
        drift: Math.random() * 14 + 4,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  burst(x, y, color, n = 16) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = Math.random() * 220 + 60;
      this.bursts.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 60,
        life: 1,
        decay: Math.random() * 1.6 + 1.1,
        r: Math.random() * 3 + 1.5,
        color,
      });
    }
  }

  update(dt, t) {
    for (const m of this.motes) {
      m.y += Math.sin(t * 0.5 + m.phase) * m.drift * dt;
    }
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const p = this.bursts[i];
      p.life -= p.decay * dt;
      if (p.life <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }
      p.vy += 520 * dt; // gravité légère
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  // Motes d'ambiance, dessinées avant le monde (en arrière-plan).
  drawMotes(ctx, cam, t) {
    ctx.save();
    for (const m of this.motes) {
      const px = m.x - cam.x * m.depth;
      const py = m.y - cam.y * m.depth;
      const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2 + m.phase));
      ctx.globalAlpha = m.depth * tw * 0.7;
      ctx.fillStyle = '#7a7ab0';
      ctx.beginPath();
      ctx.arc(px, py, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Éclats de collecte, dessinés au premier plan.
  drawBursts(ctx, cam) {
    ctx.save();
    for (const p of this.bursts) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x - cam.x, p.y - cam.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
