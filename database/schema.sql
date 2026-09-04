-- =========================================================
--  Base de données : centre_formation
--  Gestion d'un centre de formation informatique
-- =========================================================

CREATE TABLE IF NOT EXISTS formateurs (
    id              SERIAL PRIMARY KEY,
    nom             VARCHAR(100) NOT NULL,
    prenom          VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    telephone       VARCHAR(20),
    specialite      VARCHAR(150),
    date_embauche   DATE DEFAULT CURRENT_DATE,
    actif           BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS etudiants (
    id              SERIAL PRIMARY KEY,
    nom             VARCHAR(100) NOT NULL,
    prenom          VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    telephone       VARCHAR(20),
    date_naissance  DATE,
    adresse         TEXT,
    date_inscription DATE DEFAULT CURRENT_DATE,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS formations (
    id              SERIAL PRIMARY KEY,
    titre           VARCHAR(200) NOT NULL,
    description     TEXT,
    categorie       VARCHAR(100),          -- ex: Développement web, Réseaux, Data...
    niveau          VARCHAR(50) DEFAULT 'Débutant', -- Débutant / Intermédiaire / Avancé
    duree_heures    INTEGER NOT NULL DEFAULT 0,
    prix            NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Une "session" est une instance planifiée d'une formation
CREATE TABLE IF NOT EXISTS sessions (
    id              SERIAL PRIMARY KEY,
    formation_id    INTEGER NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    formateur_id    INTEGER REFERENCES formateurs(id) ON DELETE SET NULL,
    date_debut      DATE NOT NULL,
    date_fin        DATE NOT NULL,
    salle           VARCHAR(50),
    capacite_max    INTEGER NOT NULL DEFAULT 20,
    statut          VARCHAR(30) DEFAULT 'Planifiée', -- Planifiée / En cours / Terminée / Annulée
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inscriptions (
    id              SERIAL PRIMARY KEY,
    etudiant_id     INTEGER NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
    session_id      INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    date_inscription DATE DEFAULT CURRENT_DATE,
    statut_paiement VARCHAR(30) DEFAULT 'Non payé', -- Non payé / Partiel / Payé
    note_finale     NUMERIC(4,2),
    UNIQUE (etudiant_id, session_id)
);

CREATE TABLE IF NOT EXISTS paiements (
    id              SERIAL PRIMARY KEY,
    inscription_id  INTEGER NOT NULL REFERENCES inscriptions(id) ON DELETE CASCADE,
    montant         NUMERIC(10,2) NOT NULL,
    date_paiement   DATE DEFAULT CURRENT_DATE,
    mode_paiement   VARCHAR(50) DEFAULT 'Espèces' -- Espèces / Carte / Virement / Mobile Money
);

-- Index utiles
CREATE INDEX IF NOT EXISTS idx_sessions_formation ON sessions(formation_id);
CREATE INDEX IF NOT EXISTS idx_sessions_formateur ON sessions(formateur_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_etudiant ON inscriptions(etudiant_id);
CREATE INDEX IF NOT EXISTS idx_inscriptions_session ON inscriptions(session_id);
CREATE INDEX IF NOT EXISTS idx_paiements_inscription ON paiements(inscription_id);
