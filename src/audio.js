// Effets sonores minimalistes générés via WebAudio (aucun fichier audio).
// L'AudioContext doit être créé/repris suite à un geste utilisateur.
export class AudioFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  // À appeler sur le premier clic (bouton « Commencer »).
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  _beep(freq, dur, type = 'square', gain = 0.05, slide = 0) {
    if (this.muted || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(freq + slide, t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
  }

  jump() {
    this._beep(360, 0.12, 'square', 0.04, 260);
  }
  collect() {
    this._beep(740, 0.08, 'triangle', 0.05, 480);
  }
  zone() {
    this._beep(300, 0.18, 'sawtooth', 0.04, 320);
    setTimeout(() => this._beep(520, 0.18, 'triangle', 0.04, 220), 90);
  }
}
