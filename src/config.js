// =============================================================================
//  CONFIG  —  constantes globales : palette, physique, thème des zones.
//  (Le contenu textuel est dans content.js ; le level-design dans world.js.)
// =============================================================================

// --- Palette néon ------------------------------------------------------------
// Gardée en phase avec les variables CSS de styles.css (:root).
export const COLORS = {
  bgTop: '#0a0a14',
  bgBottom: '#05050b',
  ground: '#13131f',
  groundEdge: '#1d1d2e',
  platform: '#15152340',
  platformEdge: '#2a2a44',
  star: '#3a3a5c',
  text: '#e8e8f4',
  cyan: '#38f0e0',
  magenta: '#f25cff',
  yellow: '#eaff3a',
  green: '#5cff9d',
  orange: '#ff9f43',
  white: '#ffffff',
};

// --- Physique (unités : pixels, secondes) ------------------------------------
export const PHYSICS = {
  gravity: 2600,
  moveSpeed: 360, // vitesse horizontale cible
  accelK: 16, // réactivité de l'accélération (plus haut = plus sec)
  jumpVelocity: 920, // impulsion verticale (vers le haut)
  jumpCutMultiplier: 0.45, // saut variable : relâcher coupe la montée
  maxFallSpeed: 1500,
  coyoteTime: 0.1, // tolérance de saut après avoir quitté le sol
  jumpBuffer: 0.12, // tolérance de saut avant de toucher le sol
};

// --- Dimensions du monde -----------------------------------------------------
export const WORLD = {
  height: 800, // hauteur logique du niveau
  groundY: 640, // sommet du sol
  deathY: 1100, // au-delà : on respawn
};

// --- Thème de chaque zone (couleur + libellé) --------------------------------
//  Les ids correspondent aux clés de content.js et aux zones de world.js.
export const ZONE_THEME = {
  projets: { color: COLORS.cyan, label: 'Projets', icon: '◈' },
  formation: { color: COLORS.magenta, label: 'Formation', icon: '✦' },
  competences: { color: COLORS.yellow, label: 'Compétences', icon: '⬡' },
  apropos: { color: COLORS.green, label: 'À propos', icon: '✧' },
};

export const ZONE_ORDER = ['projets', 'formation', 'competences', 'apropos'];
