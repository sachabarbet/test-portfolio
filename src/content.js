// =============================================================================
//  ✏️  CONTENU DU PORTFOLIO  —  C'EST ICI QUE TU MODIFIES TES INFOS
// -----------------------------------------------------------------------------
//  Tout le texte affiché dans le jeu vient de ce fichier.
//  Remplace les valeurs « placeholder » par tes vraies informations.
//  Les chaînes sont en français (langue du produit). Garde la structure.
// =============================================================================

export const CONTENT = {
  // --- Identité (affichée dans le HUD et l'écran-titre) ----------------------
  identity: {
    name: 'Sacha Barbet',
    role: 'Développeur Mobile · Web · IoT',
    tagline: 'Je conçois des applications soignées, sécurisées et bien finies.',
    // Petit texte de l'écran-titre
    intro:
      'Explore le niveau, approche-toi des portails néon et découvre mon ' +
      'parcours, mes projets et mes compétences.',
  },

  // --- Zone PROJETS ----------------------------------------------------------
  projets: {
    label: 'Projets',
    intro: 'Une sélection de réalisations mobile, web et IoT.',
    items: [
      {
        title: 'Realm Guard',
        type: 'Mobile · Flutter',
        description:
          'Gestionnaire de mots de passe offline-first chiffré (SQLCipher + ' +
          'Argon2id). Déverrouillage biométrique, UX épurée.',
        stack: ['Flutter', 'Dart', 'Drift', 'SQLCipher'],
        links: { code: 'https://github.com/nexus-realm/realm-guard-mobile', demo: '' },
      },
      {
        title: 'Aurora Dashboard',
        type: 'Web · React',
        description:
          'Tableau de bord temps réel pour le suivi de capteurs : graphes ' +
          'animés, websockets, thème sombre.',
        stack: ['React', 'TypeScript', 'D3', 'WebSocket'],
        links: { code: '', demo: 'https://example.com' },
      },
      {
        title: 'HomeMesh',
        type: 'IoT · ESP32',
        description:
          'Réseau domotique maison : capteurs ESP32, passerelle MQTT et ' +
          'application de contrôle mobile.',
        stack: ['ESP32', 'C++', 'MQTT', 'Node.js'],
        links: { code: '', demo: '' },
      },
      {
        title: 'Pulse API',
        type: 'Backend · Node',
        description:
          'API REST + GraphQL conteneurisée, authentification JWT, tests et ' +
          'CI/CD complète.',
        stack: ['Node.js', 'GraphQL', 'PostgreSQL', 'Docker'],
        links: { code: '', demo: '' },
      },
    ],
  },

  // --- Zone FORMATION / PARCOURS ---------------------------------------------
  formation: {
    label: 'Formation',
    intro: 'Mon parcours, du diplôme aux expériences marquantes.',
    items: [
      {
        period: '2024 — Aujourd’hui',
        title: 'Développeur Mobile Freelance',
        place: 'Indépendant',
        description:
          'Conception et développement d’applications Flutter pour des ' +
          'clients variés, de la maquette au déploiement.',
      },
      {
        period: '2022 — 2024',
        title: 'Master Ingénierie Logicielle',
        place: 'Université / École',
        description:
          'Spécialisation systèmes mobiles et embarqués, sécurité applicative.',
      },
      {
        period: '2021 — 2022',
        title: 'Développeur Full-Stack — Alternance',
        place: 'Entreprise XYZ',
        description:
          'Développement web (React / Node), mise en place de CI/CD et de tests.',
      },
      {
        period: '2019 — 2021',
        title: 'Licence Informatique',
        place: 'Université',
        description: 'Fondamentaux : algorithmique, réseaux, bases de données.',
      },
    ],
  },

  // --- Zone COMPÉTENCES / STACK ----------------------------------------------
  competences: {
    label: 'Compétences',
    intro: 'Les technologies que je manie au quotidien.',
    groups: [
      {
        name: 'Mobile',
        items: [
          { name: 'Flutter / Dart', level: 92 },
          { name: 'Android (Kotlin)', level: 70 },
          { name: 'React Native', level: 64 },
        ],
      },
      {
        name: 'Web',
        items: [
          { name: 'React / TypeScript', level: 85 },
          { name: 'Node.js', level: 80 },
          { name: 'HTML / CSS', level: 90 },
        ],
      },
      {
        name: 'IoT / Embarqué',
        items: [
          { name: 'ESP32 / Arduino', level: 72 },
          { name: 'MQTT', level: 68 },
          { name: 'C / C++', level: 60 },
        ],
      },
      {
        name: 'Outils',
        items: [
          { name: 'Git / CI-CD', level: 88 },
          { name: 'Docker', level: 70 },
          { name: 'Figma', level: 65 },
        ],
      },
    ],
  },

  // --- Zone À PROPOS + CONTACT (fin de niveau) -------------------------------
  apropos: {
    label: 'À propos',
    intro: 'Qui suis-je, et comment me joindre.',
    bio:
      'Développeur passionné par les produits bien faits, j’aime construire ' +
      'des expériences fluides côté mobile et web, et bidouiller des objets ' +
      'connectés. J’accorde une grande importance à la sécurité, au détail ' +
      'et à une UX simple.',
    contact: {
      email: 'sacha@example.com',
      github: 'https://github.com/sachabarbet',
      linkedin: 'https://www.linkedin.com/in/ton-profil',
      site: 'https://ton-site.dev',
    },
  },
};
