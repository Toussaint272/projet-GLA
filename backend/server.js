const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/etudiants', require('./routes/etudiants'));
app.use('/api/formateurs', require('./routes/formateurs'));
app.use('/api/formations', require('./routes/formations'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/inscriptions', require('./routes/inscriptions'));
app.use('/api/stats', require('./routes/stats'));

app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API centre de formation démarrée sur http://localhost:${PORT}`);
});
