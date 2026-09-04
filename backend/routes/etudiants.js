const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET tous les étudiants
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM etudiants';
    const params = [];
    if (search) {
      query += ' WHERE nom ILIKE $1 OR prenom ILIKE $1 OR email ILIKE $1';
      params.push(`%${search}%`);
    }
    query += ' ORDER BY id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET un étudiant + ses inscriptions
router.get('/:id', async (req, res) => {
  try {
    const etudiant = await pool.query('SELECT * FROM etudiants WHERE id = $1', [req.params.id]);
    if (etudiant.rows.length === 0) return res.status(404).json({ error: 'Étudiant introuvable' });

    const inscriptions = await pool.query(
      `SELECT i.*, s.date_debut, s.date_fin, f.titre AS formation_titre
       FROM inscriptions i
       JOIN sessions s ON s.id = i.session_id
       JOIN formations f ON f.id = s.formation_id
       WHERE i.etudiant_id = $1`,
      [req.params.id]
    );

    res.json({ ...etudiant.rows[0], inscriptions: inscriptions.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST créer un étudiant
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, date_naissance, adresse } = req.body;
    if (!nom || !prenom || !email) {
      return res.status(400).json({ error: 'Nom, prénom et email sont obligatoires' });
    }
    const result = await pool.query(
      `INSERT INTO etudiants (nom, prenom, email, telephone, date_naissance, adresse)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nom, prenom, email, telephone, date_naissance || null, adresse]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Cet email existe déjà' });
    res.status(500).json({ error: err.message });
  }
});

// PUT modifier un étudiant
router.put('/:id', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, date_naissance, adresse } = req.body;
    const result = await pool.query(
      `UPDATE etudiants SET nom=$1, prenom=$2, email=$3, telephone=$4, date_naissance=$5, adresse=$6
       WHERE id=$7 RETURNING *`,
      [nom, prenom, email, telephone, date_naissance || null, adresse, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Étudiant introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supprimer un étudiant
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM etudiants WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Étudiant introuvable' });
    res.json({ message: 'Étudiant supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
