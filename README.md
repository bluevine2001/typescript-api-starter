# Template pour une api express, typescript, mongodb

Voici une template pour commencer à coder sans avoir à gérer l'authentifications des users en backend.
J'utilise l'ORM Mongoose, les JWT, express js et typescript pour une architecture d'api clean.

## Installation

```bash
$ pnpm i
```

Créer un fichier .env avec la variable `JWT_SECRET` contenant un hash pour les tokens

Pour lancer l'api en local :

```bash
$ pnpm run dev
```

build:

```bash
$ pnpm run build
```

Pour lancer l'api en prod :

```bash
$ pnpm run start
```
