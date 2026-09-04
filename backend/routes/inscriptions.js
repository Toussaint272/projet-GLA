const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET toutes les inscriptions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, CONCAT(e.prenom, ' ', e.nom) AS etudiant_nom,
             f.titre AS formation_titre, s.date_debut
      FROM inscriptions i
      JOIN etudiants e ON e.id = i.etudiant_id
      JOIN sessions s ON s.id = i.session_id
      JOIN formations f ON f.id = s.formation_id
      ORDER BY i.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST inscrire un étudiant à une session (vérifie la capacité)
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { etudiant_id, session_id } = req.body;
    if (!etudiant_id || !session_id) {
      return res.status(400).json({ error: 'etudiant_id et session_id sont obligatoires' });
    }

    await client.query('BEGIN');

    const session = await client.query(
      `SELECT capacite_max, (SELECT COUNT(*) FROM inscriptions WHERE session_id=$1) AS nb_inscrits
       FROM sessions WHERE id=$1`,
      [session_id]
    );
    if (session.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Session introuvable' });
    }
    if (Number(session.rows[0].nb_inscrits) >= session.rows[0].capacite_max) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Session complète' });
    }

    const result = await client.query(
      `INSERT INTO inscriptions (etudiant_id, session_id) VALUES ($1,$2) RETURNING *`,
      [etudiant_id, session_id]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') return res.status(409).json({ error: 'Étudiant déjà inscrit à cette session' });
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT modifier le statut de paiement / note
router.put('/:id', async (req, res) => {
  try {
    const { statut_paiement, note_finale } = req.body;
    const result = await pool.query(
      `UPDATE inscriptions SET statut_paiement=$1, note_finale=$2 WHERE id=$3 RETURNING *`,
      [statut_paiement, note_finale, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Inscription introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM inscriptions WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Inscription introuvable' });
    res.json({ message: 'Inscription supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST ajouter un paiement pour une inscription
router.post('/:id/paiements', async (req, res) => {
  try {
    const { montant, mode_paiement } = req.body;
    if (!montant) return res.status(400).json({ error: 'Le montant est obligatoire' });
    const result = await pool.query(
      `INSERT INTO paiements (inscription_id, montant, mode_paiement) VALUES ($1,$2,$3) RETURNING *`,
      [req.params.id, montant, mode_paiement || 'Espèces']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET historique des paiements d'une inscription
router.get('/:id/paiements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM paiements WHERE inscription_id=$1 ORDER BY date_paiement DESC', [req.params.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
