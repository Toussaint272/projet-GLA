const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formations ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formations WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Formation introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { titre, description, categorie, niveau, duree_heures, prix } = req.body;
    if (!titre) return res.status(400).json({ error: 'Le titre est obligatoire' });
    const result = await pool.query(
      `INSERT INTO formations (titre, description, categorie, niveau, duree_heures, prix)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [titre, description, categorie, niveau || 'Débutant', duree_heures || 0, prix || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { titre, description, categorie, niveau, duree_heures, prix } = req.body;
    const result = await pool.query(
      `UPDATE formations SET titre=$1, description=$2, categorie=$3, niveau=$4, duree_heures=$5, prix=$6
       WHERE id=$7 RETURNING *`,
      [titre, description, categorie, niveau, duree_heures, prix, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Formation introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM formations WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Formation introuvable' });
    res.json({ message: 'Formation supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
