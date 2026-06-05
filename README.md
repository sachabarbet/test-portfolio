# Portfolio Arcade 🎮

Prototype de **portfolio interactif** sous forme de **platformer 2D sombre / néon**.
Un petit personnage explore un niveau ; en atteignant des **portails néon**, il révèle
les **projets**, le **parcours**, les **compétences** et les infos de **contact**.

> 100 % **Canvas vanilla** — aucune dépendance, aucun build, fichiers statiques
> hébergeables partout (GitHub Pages, Vercel, Netlify…).

---

## 🚀 Lancer en local

Les modules ES nécessitent un serveur HTTP (pas d'ouverture directe en `file://`).
Un mini serveur Node **sans dépendance** est fourni :

```bash
npm start
# puis ouvrir http://localhost:5173
```

Alternative sans Node :

```bash
python -m http.server 5173
# puis ouvrir http://localhost:5173
```

## 🎯 Contrôles

| Action       | Clavier                         | Tactile         |
| ------------ | ------------------------------- | --------------- |
| Se déplacer  | `←` `→` (ou `A`/`D`, `Q`/`D`)   | boutons ◀ ▶     |
| Sauter       | `Espace` / `↑` / `W` / `Z`      | bouton ▲        |
| Fermer un panneau | `Échap`                    | ✕               |

Approche-toi d’un portail pour ouvrir son panneau. Collecte les orbes ✦ en chemin.

---

## ✏️ Personnaliser le contenu

**Tout ton contenu est dans un seul fichier : [`src/content.js`](src/content.js).**
Remplace les valeurs placeholder (nom, projets, formation, compétences, contact)
par tes vraies infos. La structure est commentée ; n’en change pas les clés.

Pour ajuster le **style** ou le **gameplay** :

| Besoin                                   | Fichier            |
| ---------------------------------------- | ------------------ |
| Couleurs, physique, hauteur du monde     | `src/config.js`    |
| Level-design (sol, plateformes, orbes, position des portails) | `src/world.js` |
| Apparence du personnage                  | `src/player.js`    |
| Styles des panneaux / HUD / titre        | `styles.css`       |

---

## 🧱 Structure

```
portfolio/
├─ index.html          # structure DOM (canvas + overlays)
├─ styles.css          # thème néon sombre
├─ server.js           # mini serveur statique (zéro dépendance)
├─ package.json        # script « npm start »
└─ src/
   ├─ content.js       # ← TON CONTENU (à éditer)
   ├─ config.js        # palette, physique, thème des zones
   ├─ main.js          # boucle de jeu + machine à états
   ├─ world.js         # niveau, parallaxe, portails, orbes
   ├─ player.js        # joueur (physique + rendu)
   ├─ camera.js        # caméra suiveuse
   ├─ input.js         # clavier + tactile
   ├─ particles.js     # ambiance + éclats
   ├─ audio.js         # bips WebAudio générés
   └─ ui.js            # écran-titre, HUD, panneaux
```

---

## 🌐 Déployer (GitHub Pages)

Le projet étant 100 % statique, il suffit de servir le dossier tel quel.
Exemple GitHub Pages : pousse le dossier sur une branche, active Pages sur la
racine. Aucune étape de build n’est nécessaire.

---

*Prototype — placeholders à remplacer par tes informations réelles.*
