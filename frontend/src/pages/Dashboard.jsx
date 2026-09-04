import { useEffect, useState } from 'react';
import { api } from '../api';

function formatAr(n) {
  return new Intl.NumberFormat('fr-MG').format(n) + ' Ar';
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/stats').then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert error">{error}</div>;
  if (!stats) return <div className="loading">Chargement…</div>;

  const cards = [
    { label: 'Étudiants inscrits', value: stats.nb_etudiants },
    { label: 'Formateurs actifs', value: stats.nb_formateurs },
    { label: 'Formations au catalogue', value: stats.nb_formations },
    { label: 'Sessions en cours / planifiées', value: stats.nb_sessions_actives },
  ];

  return (
    <div>
      <header className="page-header">
        <h1>Tableau de bord</h1>
        <p className="page-sub">Vue d'ensemble de l'activité du centre</p>
      </header>

      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
        <div className="stat-card highlight">
          <div className="stat-value">{formatAr(stats.revenu_total)}</div>
          <div className="stat-label">Revenus encaissés</div>
        </div>
      </div>

      <section className="panel">
        <h2>Formations par catégorie</h2>
        {stats.par_categorie.length === 0 ? (
          <p className="muted">Aucune formation enregistrée.</p>
        ) : (
          <div className="bar-list">
            {stats.par_categorie.map((c) => {
              const max = Math.max(...stats.par_categorie.map((x) => Number(x.nb)));
              const pct = (Number(c.nb) / max) * 100;
              return (
                <div className="bar-row" key={c.categorie || 'autre'}>
                  <span className="bar-label">{c.categorie || 'Non classée'}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="bar-value">{c.nb}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
