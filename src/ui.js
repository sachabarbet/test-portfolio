import { CONTENT } from './content.js';
import { ZONE_THEME } from './config.js';

// Couche DOM : écran-titre, HUD, indices, panneaux de contenu, tactile.
export class UI {
  constructor(cb) {
    this.cb = cb; // { onStart, onPanelClose, onMuteToggle }
    const $ = (id) => document.getElementById(id);

    this.intro = $('intro');
    this.hud = $('hud');
    this.hint = $('hint');
    this.panel = $('panel');
    this.panelBody = $('panelBody');
    this.zoneCount = $('zoneCount');
    this.scoreCount = $('scoreCount');
    this.muteBtn = $('muteBtn');

    // Remplit l'écran-titre + HUD depuis content.js
    const id = CONTENT.identity;
    $('hudName').textContent = id.name;
    $('hudRole').textContent = id.role;
    $('introName').textContent = id.name;
    $('introRole').textContent = id.role;
    $('introSub').textContent = id.intro;

    // Écran-titre -> démarrage
    $('startBtn').addEventListener('click', () => {
      this.intro.classList.add('hidden');
      this.hud.classList.remove('hidden');
      this.cb.onStart();
    });

    // Fermeture du panneau (bouton, Échap, clic sur le fond)
    $('panelClose').addEventListener('click', () => this.closePanel());
    this.panel.addEventListener('mousedown', (e) => {
      if (e.target === this.panel) this.closePanel();
    });
    addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.panel.classList.contains('hidden')) this.closePanel();
    });

    // Son
    this.muteBtn.addEventListener('click', () => {
      const muted = this.cb.onMuteToggle();
      this.setMuted(muted);
    });

    // Détection tactile
    this.touchEls = null;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('has-touch');
      this.touchEls = {
        left: $('btnLeft'),
        right: $('btnRight'),
        jump: $('btnJump'),
      };
    }
  }

  get isPanelOpen() {
    return !this.panel.classList.contains('hidden');
  }

  setStats(discovered, total, score) {
    this.zoneCount.textContent = `${discovered}/${total}`;
    this.scoreCount.textContent = score;
  }

  setMuted(muted) {
    this.muteBtn.textContent = muted ? '♪̸' : '♪';
    this.muteBtn.classList.toggle('muted', muted);
  }

  showHint(text) {
    this.hint.textContent = text;
    this.hint.classList.add('show');
    clearTimeout(this._hintT);
    this._hintT = setTimeout(() => this.hint.classList.remove('show'), 3200);
  }

  openPanel(zoneId) {
    const theme = ZONE_THEME[zoneId];
    this.panel.style.setProperty('--accent', theme.color);
    this.panelBody.innerHTML = BUILDERS[zoneId]();
    this.panel.classList.remove('hidden');
    // Anime les barres de compétences après affichage.
    requestAnimationFrame(() =>
      this.panelBody.querySelectorAll('.bar > i').forEach((el) => {
        el.style.width = el.dataset.level + '%';
      })
    );
  }

  closePanel() {
    if (!this.isPanelOpen) return;
    this.panel.classList.add('hidden');
    this.cb.onPanelClose();
  }
}

// --- Constructeurs de contenu HTML par zone ---------------------------------
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const head = (zoneId, title, intro) =>
  `<div class="p-head"><span class="p-badge">${ZONE_THEME[zoneId].icon}</span>` +
  `<h2 class="p-title" id="panelTitle">${esc(title)}</h2></div>` +
  `<p class="p-intro">${esc(intro)}</p>`;

const link = (href, label) =>
  href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${label}</a>` : '';

const BUILDERS = {
  projets() {
    const d = CONTENT.projets;
    const cards = d.items
      .map(
        (p) => `
      <article class="card">
        <div class="card-top">
          <span class="card-title">${esc(p.title)}</span>
          <span class="card-type">${esc(p.type)}</span>
        </div>
        <p class="card-desc">${esc(p.description)}</p>
        <div class="tags">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
        <div class="card-links">${link(p.links.code, 'Code ↗')}${link(p.links.demo, 'Démo ↗')}</div>
      </article>`
      )
      .join('');
    return head('projets', d.label, d.intro) + `<div class="cards">${cards}</div>`;
  },

  formation() {
    const d = CONTENT.formation;
    const items = d.items
      .map(
        (f) => `
      <div class="tl-item">
        <div class="tl-period">${esc(f.period)}</div>
        <div class="tl-title">${esc(f.title)}</div>
        <div class="tl-place">${esc(f.place)}</div>
        <p class="tl-desc">${esc(f.description)}</p>
      </div>`
      )
      .join('');
    return head('formation', d.label, d.intro) + `<div class="timeline">${items}</div>`;
  },

  competences() {
    const d = CONTENT.competences;
    const groups = d.groups
      .map(
        (g) => `
      <div class="skill-group">
        <h4>${esc(g.name)}</h4>
        ${g.items
          .map(
            (s) => `
          <div class="skill">
            <div class="skill-top"><span>${esc(s.name)}</span><span>${s.level}%</span></div>
            <div class="bar"><i data-level="${s.level}"></i></div>
          </div>`
          )
          .join('')}
      </div>`
      )
      .join('');
    return head('competences', d.label, d.intro) + groups;
  },

  apropos() {
    const d = CONTENT.apropos;
    const c = d.contact;
    const dot = '<span class="c-ico">●</span>';
    const links = [
      c.email ? `<a href="mailto:${esc(c.email)}">${dot}Email</a>` : '',
      link(c.github, dot + 'GitHub'),
      link(c.linkedin, dot + 'LinkedIn'),
      link(c.site, dot + 'Site web'),
    ].join('');
    return (
      head('apropos', d.label, d.intro) +
      `<p class="bio">${esc(d.bio)}</p>` +
      `<div class="contact-links">${links}</div>`
    );
  },
};
