import { COLORS, WORLD, ZONE_THEME } from './config.js';

// Le niveau : sol, plateformes, portails de zone, orbes, et décor parallaxe.
export class World {
  constructor() {
    this.width = 4100;
    const g = WORLD.groundY;

    // --- Sol continu : déplacement gauche/droite sans rupture (UX simple) -----
    const grounds = [{ x: 0, y: g, w: this.width, h: WORLD.height - g }].map((p) => ({
      ...p,
      kind: 'ground',
    }));

    // --- Plateformes flottantes : cibles de saut atteignables d'un bond -------
    //  depuis le sol (chacune porte un orbe bonus).
    const floats = [
      { x: 880, y: 500, w: 120, h: 16 },
      { x: 1180, y: 520, w: 120, h: 16 },
      { x: 1600, y: 495, w: 120, h: 16 },
      { x: 2360, y: 500, w: 130, h: 16 },
      { x: 2760, y: 520, w: 140, h: 16 },
      { x: 3150, y: 500, w: 120, h: 16 },
      { x: 3470, y: 510, w: 120, h: 16 },
    ].map((p) => ({ ...p, kind: 'float' }));

    this.grounds = grounds;
    this.floats = floats;
    this.platforms = [...grounds, ...floats]; // solides pour les collisions

    // --- Portails de zone (gauche -> droite) ---------------------------------
    const mk = (id, x) => ({
      id,
      x,
      ...ZONE_THEME[id],
      discovered: false,
      inside: false,
      trigger: { x: x - 64, y: g - 190, w: 128, h: 220 },
    });
    this.zones = [
      mk('projets', 760),
      mk('formation', 1760),
      mk('competences', 2680),
      mk('apropos', 3760),
    ];

    // --- Orbes à collecter ---------------------------------------------------
    const orbAt = (x, y) => ({ x, y, r: 8, collected: false, phase: Math.random() * 6.28 });
    this.orbs = [
      // Au sol : ramassés simplement en marchant.
      orbAt(360, 604), orbAt(1150, 604), orbAt(1400, 604), orbAt(1980, 604),
      orbAt(2250, 604), orbAt(2950, 604), orbAt(3300, 604), orbAt(3950, 604),
      // Sur les plateformes : bonus à récupérer en sautant.
      orbAt(880, 478), orbAt(1600, 473), orbAt(2360, 478), orbAt(2760, 498),
      orbAt(3470, 488),
    ];

    // --- Décor : skyline parallaxe (généré une fois) -------------------------
    this.farCity = this._city(3000, 60, 200, 130, '#0b0b18');
    this.nearCity = this._city(3000, 70, 320, 100, '#11111f');
  }

  _city(span, count, maxH, minH, color) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const w = Math.random() * 70 + 34;
      const h = Math.random() * (maxH - minH) + minH;
      const x = Math.random() * span;
      const windows = [];
      const cols = Math.max(1, Math.floor(w / 16));
      const rows = Math.max(1, Math.floor(h / 26));
      for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++)
          if (Math.random() > 0.6)
            windows.push({ dx: 6 + c * 14, dy: 10 + r * 22 });
      arr.push({ x, w, h, color, windows });
    }
    return arr;
  }

  // --- Décor d'arrière-plan (espace écran) -----------------------------------
  drawBackground(ctx, cam, viewW, viewH, t) {
    // Ciel
    const sky = ctx.createLinearGradient(0, 0, 0, viewH);
    sky.addColorStop(0, COLORS.bgTop);
    sky.addColorStop(1, COLORS.bgBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, viewW, viewH);

    // Halo coloré haut
    const glow = ctx.createRadialGradient(viewW * 0.5, -60, 20, viewW * 0.5, -60, viewW * 0.7);
    glow.addColorStop(0, 'rgba(56,240,224,0.10)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, viewW, viewH);

    const horizon = WORLD.groundY - cam.y;
    this._drawCity(ctx, this.farCity, cam, 0.15, horizon, 0.5, viewW);
    this._drawCity(ctx, this.nearCity, cam, 0.32, horizon, 0.9, viewW);

    // Ligne d'horizon lumineuse
    const ln = ctx.createLinearGradient(0, 0, viewW, 0);
    ln.addColorStop(0, 'rgba(56,240,224,0)');
    ln.addColorStop(0.5, 'rgba(242,92,255,0.5)');
    ln.addColorStop(1, 'rgba(56,240,224,0)');
    ctx.fillStyle = ln;
    ctx.fillRect(0, horizon - 1, viewW, 2);
  }

  _drawCity(ctx, city, cam, depth, horizon, alpha, viewW) {
    ctx.save();
    ctx.globalAlpha = alpha;
    for (const b of city) {
      const x = b.x - cam.x * depth;
      if (x > viewW + 50 || x + b.w < -50) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(x, horizon - b.h, b.w, b.h);
      ctx.fillStyle = 'rgba(120,200,255,0.5)';
      for (const win of b.windows) ctx.fillRect(x + win.dx, horizon - b.h + win.dy, 3, 3);
    }
    ctx.restore();
  }

  // --- Sol + plateformes -----------------------------------------------------
  drawTerrain(ctx, cam, viewW, viewH) {
    const hy = WORLD.groundY - cam.y; // y-écran du sommet du sol

    // Sous-sol continu : évite tout « vide » noir dans les trous.
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, hy, viewW, viewH - hy + 2);
    // Ombre sous l'horizon : donne de la profondeur aux trous (les segments
    // de sol, dessinés ensuite, la recouvrent — elle ne reste que dans les trous).
    const sh = ctx.createLinearGradient(0, hy, 0, hy + 70);
    sh.addColorStop(0, 'rgba(0,0,0,0.55)');
    sh.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sh;
    ctx.fillRect(0, hy, viewW, 70);

    for (const p of this.grounds) {
      const x = p.x - cam.x;
      const y = p.y - cam.y;
      ctx.fillStyle = COLORS.ground;
      ctx.fillRect(x, y, p.w, p.h);
      // arête néon supérieure
      ctx.fillStyle = COLORS.groundEdge;
      ctx.fillRect(x, y, p.w, 3);
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = COLORS.cyan;
      ctx.shadowColor = COLORS.cyan;
      ctx.shadowBlur = 10;
      ctx.fillRect(x, y, p.w, 2);
      ctx.restore();
    }
    for (const p of this.floats) {
      const x = p.x - cam.x;
      const y = p.y - cam.y;
      roundRect(ctx, x, y, p.w, p.h, 6);
      ctx.fillStyle = '#13131f';
      ctx.fill();
      ctx.save();
      ctx.strokeStyle = COLORS.cyan;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = COLORS.cyan;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Portails de zone ------------------------------------------------------
  drawZones(ctx, cam, t) {
    for (const z of this.zones) {
      const x = z.x - cam.x;
      const base = WORLD.groundY - cam.y;
      const top = base - 150;
      const pulse = 0.6 + 0.4 * Math.sin(t * 2 + z.x);
      ctx.save();

      // Faisceau lumineux vertical
      const beam = ctx.createLinearGradient(0, top, 0, base);
      beam.addColorStop(0, hexA(z.color, 0));
      beam.addColorStop(1, hexA(z.color, z.discovered ? 0.1 : 0.22));
      ctx.fillStyle = beam;
      ctx.fillRect(x - 40, top, 80, 150);

      // Piliers
      ctx.shadowColor = z.color;
      ctx.shadowBlur = z.discovered ? 8 : 16;
      ctx.fillStyle = z.color;
      ctx.globalAlpha = z.discovered ? 0.5 : 1;
      roundRect(ctx, x - 38, top, 6, 150, 3);
      ctx.fill();
      roundRect(ctx, x + 32, top, 6, 150, 3);
      ctx.fill();
      // Arche
      ctx.lineWidth = 6;
      ctx.strokeStyle = z.color;
      ctx.beginPath();
      ctx.arc(x, top + 6, 35, Math.PI, 0);
      ctx.stroke();

      // Icône flottante
      const iy = top - 18 + Math.sin(t * 2 + z.x) * 5;
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 18 * pulse;
      ctx.fillStyle = z.color;
      ctx.font = '26px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(z.discovered ? '✓' : z.icon, x, iy);

      // Libellé
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = COLORS.text;
      ctx.font = '600 13px "Space Grotesk", sans-serif';
      ctx.fillText(z.label.toUpperCase(), x, base + 16);

      ctx.restore();
    }
  }

  // --- Orbes -----------------------------------------------------------------
  drawOrbs(ctx, cam, t) {
    ctx.save();
    for (const o of this.orbs) {
      if (o.collected) continue;
      const x = o.x - cam.x;
      const y = o.y - cam.y + Math.sin(t * 2.5 + o.phase) * 4;
      const p = 0.7 + 0.3 * Math.sin(t * 4 + o.phase);
      ctx.shadowColor = COLORS.yellow;
      ctx.shadowBlur = 14 * p;
      ctx.fillStyle = COLORS.yellow;
      ctx.beginPath();
      ctx.arc(x, y, o.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.4 * p;
      ctx.beginPath();
      ctx.arc(x, y, o.r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = COLORS.yellow;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
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

// Hex (#rrggbb) -> rgba() avec alpha.
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
