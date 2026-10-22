# Tetris Bisounours

**[Jouer en ligne](https://jlg-formation.github.io/tetris-gia/)**

Un jeu de Tetris solo, jouable directement dans le navigateur. Le projet est écrit en HTML, CSS et JavaScript vanilla, sans framework ni dépendance npm. Il sert de support d'apprentissage du développement de jeu vidéo.

Pour le jouer en local, ouvrez simplement [index.html](index.html) dans votre navigateur.

## Commandes

| Touche                 | Action                         |
| ---------------------- | ------------------------------ |
| Flèche gauche / droite | Déplacer la pièce              |
| Flèche haut / `X`      | Tourner la pièce à droite      |
| `Z`                    | Tourner la pièce à gauche      |
| Flèche bas             | Descendre d'une case           |
| Espace                 | Chute immédiate                |
| `C`                    | Mettre la pièce de côté (hold) |
| `P`                    | Pause / reprise                |
| `R`                    | Recommencer une partie         |

## Fonctionnalités

- Les 7 tétrominos avec rotation.
- Suppression des lignes complètes, avec score, lignes et niveaux.
- Fonction _hold_ : mise de côté d'une pièce pour l'utiliser plus tard.
- Aperçu de la pièce suivante (_next_).
- Mode solo uniquement, au clavier.

## Structure du projet

- [index.html](index.html) : page du jeu.
- [styles.css](styles.css) : styles et palette visuelle.
- [src/logic.js](src/logic.js) : logique de jeu pure (plateau, collisions, rotation, score, hold), sans accès au DOM.
- [src/render.js](src/render.js) : rendu sur canvas.
- [src/main.js](src/main.js) : boucle de jeu, clavier et branchement entre logique et rendu.
- [tests/logic.test.js](tests/logic.test.js) : tests unitaires de la logique.

## Tests

Les tests utilisent le module natif `node:test`, sans dépendance à installer. Il faut Node.js 24, défini dans [mise.toml](mise.toml) pour ceux qui utilisent [mise](https://mise.jdx.dev/).

```bash
node --test
```

## Documentation

- [brief-clarified.md](brief-clarified.md) : cahier des charges du projet.
- [evolutions/01-deploiement.md](evolutions/01-deploiement.md) : évolution prévue, le déploiement sur GitHub Pages.
- [AGENTS.md](AGENTS.md) : conventions de développement pour les agents et contributeurs.

## Limites

Le jeu ne gère ni le multijoueur, ni les contrôles tactiles ou la manette.
