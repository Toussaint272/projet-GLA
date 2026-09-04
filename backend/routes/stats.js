const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [etudiants, formateurs, formations, sessionsActives, revenus] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM etudiants'),
      pool.query('SELECT COUNT(*) FROM formateurs WHERE actif = TRUE'),
      pool.query('SELECT COUNT(*) FROM formations'),
      pool.query(`SELECT COUNT(*) FROM sessions WHERE statut IN ('Planifiée','En cours')`),
      pool.query('SELECT COALESCE(SUM(montant),0) AS total FROM paiements'),
    ]);

    const parCategorie = await pool.query(`
      SELECT categorie, COUNT(*) AS nb
      FROM formations
      GROUP BY categorie
      ORDER BY nb DESC
    `);

    res.json({
      nb_etudiants: Number(etudiants.rows[0].count),
      nb_formateurs: Number(formateurs.rows[0].count),
      nb_formations: Number(formations.rows[0].count),
      nb_sessions_actives: Number(sessionsActives.rows[0].count),
      revenu_total: Number(revenus.rows[0].total),
      par_categorie: parCategorie.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
