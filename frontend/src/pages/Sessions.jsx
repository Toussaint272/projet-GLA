import { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { formation_id: '', formateur_id: '', date_debut: '', date_fin: '', salle: '', capacite_max: 20, statut: 'Planifiée' };

export default function Sessions() {
  const [list, setList] = useState([]);
  const [formations, setFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.get('/sessions').then(setList).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    api.get('/formations').then(setFormations);
    api.get('/formateurs').then(setFormateurs);
  }, []);

  const openCreate = () => { setForm(empty); setEditingId(null); setShowModal(true); };
  const openEdit = (s) => {
    setForm({
      ...empty, ...s,
      formation_id: s.formation_id, formateur_id: s.formateur_id || '',
      date_debut: s.date_debut.slice(0, 10), date_fin: s.date_fin.slice(0, 10),
    });
    setEditingId(s.id);
    setShowModal(true);
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    try {
      const payload = { ...form, formateur_id: form.formateur_id || null, capacite_max: Number(form.capacite_max) };
      if (editingId) await api.put(`/sessions/${editingId}`, payload);
      else await api.post('/sessions', payload);
      setShowModal(false);
      load();
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette session ?')) return;
    try { await api.del(`/sessions/${id}`); load(); } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Sessions</h1>
          <p className="page-sub">{list.length} session(s) planifiée(s)</p>
        </div>
        <button className="btn primary" onClick={openCreate}>+ Planifier une session</button>
      </header>

      {error && <div className="alert error">{error}</div>}

      <table className="table">
        <thead>
          <tr><th>Formation</th><th>Formateur</th><th>Période</th><th>Salle</th><th>Inscrits</th><th>Statut</th><th></th></tr>
        </thead>
        <tbody>
          {list.map((s) => (
            <tr key={s.id}>
              <td>{s.formation_titre}</td>
              <td>{s.formateur_nom || '—'}</td>
              <td>{new Date(s.date_debut).toLocaleDateString('fr-FR')} → {new Date(s.date_fin).toLocaleDateString('fr-FR')}</td>
              <td>{s.salle || '—'}</td>
              <td>{s.nb_inscrits} / {s.capacite_max}</td>
              <td><span className={`badge ${s.statut === 'Terminée' ? 'off' : 'ok'}`}>{s.statut}</span></td>
              <td className="row-actions">
                <button className="btn small" onClick={() => openEdit(s)}>Modifier</button>
                <button className="btn small danger" onClick={() => remove(s.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="7" className="empty-cell">Aucune session.</td></tr>}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editingId ? 'Modifier la session' : 'Nouvelle session'} onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="form-grid">
            <label className="span-2">Formation
              <select required value={form.formation_id} onChange={(e) => setForm({ ...form, formation_id: e.target.value })}>
                <option value="">— Choisir —</option>
                {formations.map((f) => <option key={f.id} value={f.id}>{f.titre}</option>)}
              </select>
            </label>
            <label className="span-2">Formateur
              <select value={form.formateur_id} onChange={(e) => setForm({ ...form, formateur_id: e.target.value })}>
                <option value="">— Non assigné —</option>
                {formateurs.map((f) => <option key={f.id} value={f.id}>{f.prenom} {f.nom}</option>)}
              </select>
            </label>
            <label>Date de début
              <input required type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })} />
            </label>
            <label>Date de fin
              <input required type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })} />
            </label>
            <label>Salle
              <input value={form.salle} onChange={(e) => setForm({ ...form, salle: e.target.value })} />
            </label>
            <label>Capacité max
              <input type="number" min="1" value={form.capacite_max} onChange={(e) => setForm({ ...form, capacite_max: e.target.value })} />
            </label>
            {editingId && (
              <label className="span-2">Statut
                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                  <option>Planifiée</option>
                  <option>En cours</option>
                  <option>Terminée</option>
                  <option>Annulée</option>
                </select>
              </label>
            )}
            {error && <div className="alert error span-2">{error}</div>}
            <div className="modal-actions span-2">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button type="submit" className="btn primary">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
