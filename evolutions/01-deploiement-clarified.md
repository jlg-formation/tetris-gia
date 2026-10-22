# Déploiement du Tetris sur GitHub Pages

## Contexte

Le Tetris navigateur du projet est déjà développé (logique, rendu, boucle de jeu, tests). Il s'agit ici de le mettre en ligne pour que les stagiaires de la formation de l'auteur puissent y jouer. Le besoin concerne la publication, pas le développement de nouvelles fonctionnalités.

## Objectif

Rendre le jeu accessible par un lien public sur GitHub Pages, utilisable pendant une session de formation ponctuelle, avec une mise à jour automatique à chaque push.

## Périmètre fonctionnel

- Publication du jeu actuel (`index.html`, `styles.css`, `src/`) sur GitHub Pages.
- Lien public accessible à tous, sans authentification.
- Mise à jour automatique du site via GitHub Actions à chaque push sur la branche de publication.
- Aucune page d'accueil ni instructions ajoutées : le jeu seul est publié.

## Hors périmètre

- Modification des règles de jeu, de la logique ou de l'esthétique.
- Suivi des visites, statistiques ou collecte de retours des stagiaires.
- Page d'accueil, documentation utilisateur ou tutoriel intégré.
- Accès restreint par comptes GitHub.
- Maintien du site au-delà de la session de formation (pas d'exigence de disponibilité durable).

## Utilisateurs cibles

- Stagiaires de la formation de l'auteur, qui jouent sur ordinateur.
- L'auteur, qui publie et met à jour le site.

## Contraintes techniques

- Le projet est en HTML, CSS et JavaScript vanilla, sans build ni dépendance npm : il doit rester publiable tel quel en site statique.
- Le site est publié à partir du dépôt existant du projet (dossier `gh-pages` ou branche dédiée).
- L'auteur dispose sur son ordinateur de la commande `gh` (GitHub CLI) pour gérer le dépôt et GitHub Pages en ligne de commande.
- Le dépôt se nomme `tetris-gia` et est créé dans l'organisation « jlg-formation ».
- Le code source peut rester public.
- Le jeu doit fonctionner sur Chrome et Edge.
- Usage prévu uniquement sur ordinateur (pas d'exigence responsive mobile ou tablette).
- Les tests existants (`node --test`) doivent continuer de passer avant la mise en ligne.

## Critères de succès

- Le lien public GitHub Pages ouvre le jeu sans erreur dans Chrome et Edge.
- Une partie complète est jouable (déplacement, rotation, chute, score, hold).
- Un push sur la branche de publication met le site à jour automatiquement via GitHub Actions.
- Le lien peut être communiqué aux stagiaires sans autre manipulation de leur part.
- La mise en ligne est effectuée dès que possible, sans date limite imposée.
