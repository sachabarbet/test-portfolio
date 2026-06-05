import { Input } from './input.js';
import { Camera } from './camera.js';
import { Particles } from './particles.js';
import { Player } from './player.js';
import { World } from './world.js';
import { UI } from './ui.js';
import { AudioFX } from './audio.js';
import { COLORS, WORLD } from './config.js';

// --- Canvas (haute densité + échelle « design height ») ----------------------
// On affiche toujours DESIGN_H unités-monde en hauteur : le perso garde une
// taille cohérente quelle que soit la fenêtre, et le défilement horizontal
// s'adapte. viewW / viewH sont exprimés en UNITÉS-MONDE.
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const DESIGN_H = 560;
let viewW = 0;
let viewH = 0;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const scale = (h / DESIGN_H) * dpr; // unités-monde -> pixels device
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  viewW = (w * dpr) / scale;
  viewH = (h * dpr) / scale; // == DESIGN_H
}
addEventListener('resize', resize);
resize();

// --- Acteurs -----------------------------------------------------------------
const input = new Input();
const world = new World();
const player = new Player(120, WORLD.groundY - 60);
const camera = new Camera();
const particles = new Particles(world.width);
const audio = new AudioFX();

const TOTAL_ZONES = world.zones.length;
let state = 'intro'; // 'intro' | 'playing' | 'panel'
let score = 0;
let allDoneShown = false;

const discoveredCount = () => world.zones.filter((z) => z.discovered).length;

const ui = new UI({
  onStart() {
    audio.unlock();
    state = 'playing';
    ui.showHint('Avance vers le portail ◈ Projets');
  },
  onPanelClose() {
    if (state === 'panel') state = 'playing';
    if (!allDoneShown && discoveredCount() === TOTAL_ZONES) {
      allDoneShown = true;
      ui.showHint('✦ Bravo — tu as exploré tout le portfolio !');
    }
  },
  onMuteToggle: () => audio.toggleMute(),
});
ui.setStats(0, TOTAL_ZONES, 0);
if (ui.touchEls) input.bindTouch(ui.touchEls);

// --- Logique de jeu ----------------------------------------------------------
function openPanelFor(zone) {
  if (!zone.discovered) {
    zone.discovered = true;
    audio.zone();
    particles.burst(zone.x, WORLD.groundY - 80, zone.color, 24);
  }
  ui.setStats(discoveredCount(), TOTAL_ZONES, score);
  ui.openPanel(zone.id);
  state = 'panel';
}

function checkTriggers() {
  // Orbes
  for (const o of world.orbs) {
    if (o.collected) continue;
    const dx = player.cx - o.x;
    const dy = player.cy - o.y;
    if (dx * dx + dy * dy < (o.r + 18) * (o.r + 18)) {
      o.collected = true;
      score++;
      audio.collect();
      particles.burst(o.x, o.y, COLORS.yellow, 14);
      ui.setStats(discoveredCount(), TOTAL_ZONES, score);
    }
  }
  // Zones (ouverture sur l'entrée dans le déclencheur)
  for (const z of world.zones) {
    const inside = overlapRect(player, z.trigger);
    if (inside && !z.inside) openPanelFor(z);
    z.inside = inside;
  }
}

// --- Boucle ------------------------------------------------------------------
let last = performance.now();
let clock = 0;

function frame(now) {
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 1 / 30) dt = 1 / 30; // clamp (onglet inactif)
  clock += dt;

  particles.update(dt, clock);
  if (state === 'playing') {
    player.update(dt, input, world.platforms, () => audio.jump());
    checkTriggers();
  }
  camera.follow(player, viewW, viewH, world.width);
  input.endFrame();

  render();
  requestAnimationFrame(frame);
}

function render() {
  world.drawBackground(ctx, camera, viewW, viewH, clock);
  particles.drawMotes(ctx, camera, clock);
  world.drawTerrain(ctx, camera, viewW, viewH);
  world.drawZones(ctx, camera, clock);
  world.drawOrbs(ctx, camera, clock);
  player.draw(ctx, camera);
  particles.drawBursts(ctx, camera);
}

requestAnimationFrame(frame);

// --- Utilitaires -------------------------------------------------------------
function overlapRect(a, r) {
  return a.x < r.x + r.w && a.x + a.w > r.x && a.y < r.y + r.h && a.y + a.h > r.y;
}
