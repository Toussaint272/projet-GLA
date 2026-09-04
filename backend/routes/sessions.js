const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET toutes les sessions avec infos formation + formateur + nb inscrits
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, f.titre AS formation_titre, f.prix,
             CONCAT(fo.prenom, ' ', fo.nom) AS formateur_nom,
             (SELECT COUNT(*) FROM inscriptions i WHERE i.session_id = s.id) AS nb_inscrits
      FROM sessions s
      JOIN formations f ON f.id = s.formation_id
      LEFT JOIN formateurs fo ON fo.id = s.formateur_id
      ORDER BY s.date_debut DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await pool.query(`
      SELECT s.*, f.titre AS formation_titre, f.prix,
             CONCAT(fo.prenom, ' ', fo.nom) AS formateur_nom
      FROM sessions s
      JOIN formations f ON f.id = s.formation_id
      LEFT JOIN formateurs fo ON fo.id = s.formateur_id
      WHERE s.id = $1
    `, [req.params.id]);
    if (session.rows.length === 0) return res.status(404).json({ error: 'Session introuvable' });

    const inscrits = await pool.query(`
      SELECT i.*, CONCAT(e.prenom, ' ', e.nom) AS etudiant_nom, e.email
      FROM inscriptions i
      JOIN etudiants e ON e.id = i.etudiant_id
      WHERE i.session_id = $1
    `, [req.params.id]);

    res.json({ ...session.rows[0], etudiants: inscrits.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { formation_id, formateur_id, date_debut, date_fin, salle, capacite_max } = req.body;
    if (!formation_id || !date_debut || !date_fin) {
      return res.status(400).json({ error: 'formation_id, date_debut et date_fin sont obligatoires' });
    }
    const result = await pool.query(
      `INSERT INTO sessions (formation_id, formateur_id, date_debut, date_fin, salle, capacite_max)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [formation_id, formateur_id || null, date_debut, date_fin, salle, capacite_max || 20]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { formation_id, formateur_id, date_debut, date_fin, salle, capacite_max, statut } = req.body;
    const result = await pool.query(
      `UPDATE sessions SET formation_id=$1, formateur_id=$2, date_debut=$3, date_fin=$4,
       salle=$5, capacite_max=$6, statut=$7 WHERE id=$8 RETURNING *`,
      [formation_id, formateur_id || null, date_debut, date_fin, salle, capacite_max, statut, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Session introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM sessions WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Session introuvable' });
    res.json({ message: 'Session supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
