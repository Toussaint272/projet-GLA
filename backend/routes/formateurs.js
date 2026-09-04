const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formateurs ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formateurs WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Formateur introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, specialite, date_embauche } = req.body;
    if (!nom || !prenom || !email) {
      return res.status(400).json({ error: 'Nom, prénom et email sont obligatoires' });
    }
    const result = await pool.query(
      `INSERT INTO formateurs (nom, prenom, email, telephone, specialite, date_embauche)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [nom, prenom, email, telephone, specialite, date_embauche || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Cet email existe déjà' });
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, specialite, actif } = req.body;
    const result = await pool.query(
      `UPDATE formateurs SET nom=$1, prenom=$2, email=$3, telephone=$4, specialite=$5, actif=$6
       WHERE id=$7 RETURNING *`,
      [nom, prenom, email, telephone, specialite, actif, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Formateur introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM formateurs WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Formateur introuvable' });
    res.json({ message: 'Formateur supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
