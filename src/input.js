// Entrées clavier (AZERTY + QWERTY) et tactile.
export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this._prevJump = false;
    this.anyPressed = false; // a-t-on appuyé au moins une fois (pour masquer un indice)

    addEventListener('keydown', (e) => this._onKey(e, true), { passive: false });
    addEventListener('keyup', (e) => this._onKey(e, false));
  }

  _onKey(e, down) {
    const k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a' || k === 'q') this.left = down;
    else if (k === 'arrowright' || k === 'd') this.right = down;
    else if (k === ' ' || k === 'arrowup' || k === 'w' || k === 'z') {
      this.jump = down;
      if (down) e.preventDefault(); // évite le scroll sur Espace
    } else return;
    if (down) this.anyPressed = true;
  }

  // true uniquement la frame où le saut vient d'être pressé.
  get jumpJustPressed() {
    return this.jump && !this._prevJump;
  }

  // À appeler en fin de frame.
  endFrame() {
    this._prevJump = this.jump;
  }

  // Branche les boutons tactiles (#btnLeft, #btnRight, #btnJump).
  bindTouch(els) {
    const hold = (el, set) => {
      const on = (e) => {
        e.preventDefault();
        set(true);
        this.anyPressed = true;
      };
      const off = (e) => {
        e.preventDefault();
        set(false);
      };
      el.addEventListener('touchstart', on, { passive: false });
      el.addEventListener('touchend', off, { passive: false });
      el.addEventListener('touchcancel', off, { passive: false });
      // Support souris (test desktop des boutons)
      el.addEventListener('mousedown', on);
      addEventListener('mouseup', off);
      el.addEventListener('mouseleave', off);
    };
    hold(els.left, (v) => (this.left = v));
    hold(els.right, (v) => (this.right = v));
    hold(els.jump, (v) => (this.jump = v));
  }
}
