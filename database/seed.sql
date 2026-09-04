-- Données de démonstration

INSERT INTO formateurs (nom, prenom, email, telephone, specialite) VALUES
('Rakoto', 'Jean', 'jean.rakoto@centre.mg', '0341234567', 'Développement Web'),
('Rasoanaivo', 'Hery', 'hery.rasoanaivo@centre.mg', '0331234567', 'Réseaux & Sécurité'),
('Andria', 'Nirina', 'nirina.andria@centre.mg', '0321234567', 'Data & Intelligence Artificielle')
ON CONFLICT DO NOTHING;

INSERT INTO formations (titre, description, categorie, niveau, duree_heures, prix) VALUES
('Développement Web Full-Stack (Node/React)', 'Apprendre à construire des applications web modernes de A à Z.', 'Développement Web', 'Intermédiaire', 120, 950000),
('Administration Réseaux', 'Bases des réseaux, TCP/IP, configuration de routeurs et switchs.', 'Réseaux', 'Débutant', 80, 700000),
('Introduction à la Data Science', 'Python, statistiques et bases du Machine Learning.', 'Data', 'Débutant', 100, 850000),
('Cybersécurité Avancée', 'Pentest, sécurisation des systèmes et audit.', 'Sécurité', 'Avancé', 90, 1000000)
ON CONFLICT DO NOTHING;

INSERT INTO etudiants (nom, prenom, email, telephone) VALUES
('Randria', 'Fara', 'fara.randria@mail.com', '0341112233'),
('Rabe', 'Tiana', 'tiana.rabe@mail.com', '0331112233'),
('Ravel', 'Mendrika', 'mendrika.ravel@mail.com', '0321112233')
ON CONFLICT DO NOTHING;

INSERT INTO sessions (formation_id, formateur_id, date_debut, date_fin, salle, capacite_max) VALUES
(1, 1, '2026-09-15', '2026-11-15', 'Salle A', 20),
(2, 2, '2026-09-20', '2026-10-30', 'Salle B', 15),
(3, 3, '2026-10-01', '2026-11-20', 'Salle A', 18)
ON CONFLICT DO NOTHING;

INSERT INTO inscriptions (etudiant_id, session_id, statut_paiement) VALUES
(1, 1, 'Payé'),
(2, 1, 'Partiel'),
(3, 2, 'Non payé')
ON CONFLICT DO NOTHING;

INSERT INTO paiements (inscription_id, montant, mode_paiement) VALUES
(1, 950000, 'Virement'),
(2, 400000, 'Espèces');
