# Gestion de Centre de Formation Informatique

Application complète de gestion pour un centre de formation informatique :
étudiants, formateurs, catalogue de formations, sessions planifiées,
inscriptions et suivi des paiements.

**Stack** : React (Vite) + Node.js / Express + PostgreSQL

---

## 1. Structure du projet

```
centre-formation/
├── backend/            # API REST Express
│   ├── config/db.js    # connexion PostgreSQL (pg)
│   ├── routes/         # etudiants, formateurs, formations, sessions, inscriptions, stats
│   ├── server.js
│   └── .env.example
├── frontend/            # Application React (Vite)
│   └── src/
│       ├── pages/       # Dashboard, Etudiants, Formateurs, Formations, Sessions, Inscriptions
│       ├── components/  # Layout, Modal
│       ├── api.js
│       └── styles.css
└── database/
    ├── schema.sql       # création des tables
    └── seed.sql         # données de démonstration
```

## 2. Base de données PostgreSQL

Créer la base puis exécuter le schéma :

```bash
createdb centre_formation
psql -d centre_formation -f database/schema.sql
psql -d centre_formation -f database/seed.sql   # optionnel : données de démo
```

### Modèle de données

| Table         | Rôle                                                        |
|---------------|---------------------------------------------------------------|
| `etudiants`   | Fiches des apprenants                                        |
| `formateurs`  | Fiches des formateurs                                        |
| `formations`  | Catalogue des cours proposés (titre, durée, prix, niveau)     |
| `sessions`    | Instances planifiées d'une formation (dates, salle, formateur)|
| `inscriptions`| Lien étudiant ↔ session, statut de paiement, note finale      |
| `paiements`   | Historique des paiements liés à une inscription               |

## 3. Backend (API)

```bash
cd backend
cp .env.example .env      # renseigner les identifiants PostgreSQL
npm install
npm run dev                # ou "npm start"
```

L'API démarre sur `http://localhost:5000`. Endpoints principaux :

```
GET/POST/PUT/DELETE   /api/etudiants
GET/POST/PUT/DELETE   /api/formateurs
GET/POST/PUT/DELETE   /api/formations
GET/POST/PUT/DELETE   /api/sessions
GET/POST/PUT/DELETE   /api/inscriptions
POST                   /api/inscriptions/:id/paiements
GET                     /api/stats
```

## 4. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173` et proxifie automatiquement
les appels `/api/*` vers `http://localhost:5000` (voir `vite.config.js`).

## 5. Fonctionnalités incluses

- Tableau de bord avec statistiques (étudiants, formateurs, sessions actives, revenus)
- Gestion complète (CRUD) des étudiants, formateurs et formations
- Planification de sessions avec contrôle de capacité maximale
- Inscriptions avec vérification de place disponible et suivi du statut de paiement
- Recherche d'étudiants par nom/prénom/email

## 6. Pistes d'évolution

- Authentification (JWT) et rôles (admin / secrétariat / formateur)
- Génération de reçus/factures PDF
- Emplois du temps / calendrier des sessions
- Notifications par email (confirmation d'inscription, rappels de paiement)
