# Jeu de Tetris moderne (solo, navigateur)

## Contexte

Projet personnel d'apprentissage du développement de jeu vidéo. Le besoin initial est exprimé ainsi : « Je voudrais faire un jeu de Tetris. » _(source : "Je voudrais faire un jeu de Tetris")_

## Objectif

Réaliser un jeu de Tetris moderne, jouable en solo dans un navigateur, dont le code sert de support d'apprentissage.

## Périmètre fonctionnel

- Règles Tetris modernes : 7 tétrominos, rotation, suppression des lignes complètes, score, niveaux.
- Fonctionnalités modernes : fonction _hold_ (mise de côté d'une pièce), _ghost piece_ (aperçu de la position de chute), aperçu de la pièce suivante (_next_).
- Mode de jeu solo uniquement.
- Contrôles au clavier.
- Style visuel « bisounours » : palette rose bonbon, formes arrondies et douces, étoiles scintillantes, rendu très « fluffy ».

## Hors périmètre

- Multijoueur (local ou en ligne).
- Contrôles tactiles et manette.
- Versions mobile, desktop ou console.
- Publication sur une plateforme de distribution (Steam, App Store, etc.).
- Hébergement en ligne : le jeu est exécuté localement uniquement.

## Utilisateurs cibles

Un seul utilisateur : le porteur du projet, dans un cadre personnel et d'apprentissage.

## Contraintes techniques

- Stack : HTML, CSS et JavaScript vanilla, sans framework ni moteur de jeu.
- Plateforme : navigateur web, exécution en local.
- Tests : tests unitaires de la logique de jeu (rotation, collisions, suppression de lignes, score, hold).

## Critères de succès

- Le jeu se lance localement dans un navigateur sans installation supplémentaire.
- Les pièces tombent, tournent, se bloquent et les lignes complètes sont supprimées conformément aux règles.
- Les fonctions _hold_, _ghost piece_ et _next_ fonctionnent.
- Le score et les niveaux évoluent correctement.
- Les tests unitaires de la logique de jeu passent.
- Le rendu visuel correspond à l'esthétique bisounours rose et étoilée.

## Décisions de conception

Décisions prises par l'assistant à la demande de l'utilisateur.

### Esthétique

- Palette : fond rose pâle `#FFE4F1`, panneaux `#FFD1E8`, accent rose bonbon `#FF6EC7`, lilas `#C8A2FF`, menthe pastel `#B5F5E0`, jaune étoile `#FFF3A3`, texte violet `#7A3E9D`.
- Blocs : couleurs pastel par tétromino, coins très arrondis, reflet blanc en haut à gauche, contour blanc.
- Fond : dégradé rose vers lilas avec étoiles blanches qui scintillent (animation CSS).
- Disparition d'une ligne : flash blanc puis particules en forme d'étoiles.
- Typographie : Fredoka (Google Fonts), repli sur `Trebuchet MS`, sans-serif.

### Technique

- Tests unitaires : module natif `node:test` (commande `node --test`), sans aucune dépendance npm.
- Logique de jeu isolée dans des modules JavaScript purs (sans accès au DOM) pour être testable.
- Structure : `index.html`, `styles.css`, `src/` (logique et rendu), `tests/` (tests unitaires).
