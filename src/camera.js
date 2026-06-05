import { WORLD } from './config.js';

// Caméra qui suit le joueur en douceur, bornée au monde.
export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  follow(target, viewW, viewH, worldW) {
    const targetX = target.x + target.w / 2 - viewW / 2;
    // On garde le sol visible : on vise un point un peu au-dessus du joueur.
    const targetY = target.y + target.h / 2 - viewH * 0.64;

    // Lissage exponentiel.
    this.x += (targetX - this.x) * 0.12;
    this.y += (targetY - this.y) * 0.12;

    // Bornes horizontales.
    this.x = clamp(this.x, 0, Math.max(0, worldW - viewW));
    // Bornes verticales : on ne descend pas sous le bas du monde,
    // et si la vue est plus haute que le monde on cale en bas.
    const maxY = WORLD.height - viewH;
    if (maxY <= 0) this.y = maxY; // vue plus grande que le monde -> cale en bas
    else this.y = clamp(this.y, -40, maxY);
  }
}

function clamp(v, a, b) {
  return v < a ? a : v > b ? b : v;
}
