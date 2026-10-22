# Tetris navigateur : consignes pour agents

Jeu de Tetris solo en HTML, CSS et JavaScript vanilla, sans framework ni dépendance npm. Projet d'apprentissage. Cahier des charges : [brief-clarified.md](brief-clarified.md). Le brief d'origine est dans [brief.md](brief.md). Évolutions prévues (déploiement GitHub Pages) : [evolutions/01-deploiement.md](evolutions/01-deploiement.md).

## Commandes

- Tests : `node --test` (Node 24 défini dans [mise.toml](mise.toml), module natif `node:test`).
- Lancement : ouvrir [index.html](index.html) dans un navigateur. Aucun serveur ni build.

## Architecture

- [src/logic.js](src/logic.js) : logique pure (plateau, collisions, rotation, score, hold). Aucun accès au DOM. Doit rester testable sous Node.
- [src/render.js](src/render.js) : rendu canvas.
- [src/main.js](src/main.js) : boucle de jeu, clavier, branchement logique vers rendu. Accède au DOM.
- [tests/logic.test.js](tests/logic.test.js) : tests unitaires de `logic.js`, via `require("../src/logic.js")`.

## Conventions

- Code et commentaires en français, comme le reste du projet.
- Toute règle de jeu va dans `logic.js` avec un test dans `tests/logic.test.js`. Ne pas y mettre de code DOM.
- Les fonctions de `logic.js` mutent `state` (ex. `moveLeft(game)`) ou renvoient un nouvel objet (ex. `lockPiece`, `clearLines`). Conserver ce modèle.
- Pas de dépendance npm : le projet doit rester utilisable en ouvrant `index.html` directement.
- L'esthétique est définie dans [styles.css](styles.css) et le cahier des charges (palette rose bonbon). Ne pas modifier les couleurs de pièces (`PIECE_DEFS`) sans demande.

## Pièges

- `logic.js` est chargé à la fois par le navigateur (variables globales utilisées par `main.js`) et par `node --test` (via `module.exports` en fin de fichier). Tout nouvel export doit être ajouté à `module.exports`.
- Les cellules avec `y < 0` ne provoquent pas de collision (apparition des pièces au-dessus du plateau).
- Les tests utilisent `zeroRng` pour rendre la file de pièces déterministe.
