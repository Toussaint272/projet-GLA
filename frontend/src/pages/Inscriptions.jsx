import { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

export default function Inscriptions() {
  const [list, setList] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState({ etudiant_id: '', session_id: '' });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.get('/inscriptions').then(setList).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    api.get('/etudiants').then(setEtudiants);
    api.get('/sessions').then(setSessions);
  }, []);

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    try {
      await api.post('/inscriptions', form);
      setShowModal(false);
      setForm({ etudiant_id: '', session_id: '' });
      load();
    } catch (e) { setError(e.message); }
  };

  const updateStatut = async (id, statut_paiement) => {
    try { await api.put(`/inscriptions/${id}`, { statut_paiement }); load(); } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Annuler cette inscription ?')) return;
    try { await api.del(`/inscriptions/${id}`); load(); } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Inscriptions</h1>
          <p className="page-sub">{list.length} inscription(s)</p>
        </div>
        <button className="btn primary" onClick={() => setShowModal(true)}>+ Nouvelle inscription</button>
      </header>

      {error && <div className="alert error">{error}</div>}

      <table className="table">
        <thead>
          <tr><th>Étudiant</th><th>Formation</th><th>Début</th><th>Paiement</th><th></th></tr>
        </thead>
        <tbody>
          {list.map((i) => (
            <tr key={i.id}>
              <td>{i.etudiant_nom}</td>
              <td>{i.formation_titre}</td>
              <td>{new Date(i.date_debut).toLocaleDateString('fr-FR')}</td>
              <td>
                <select value={i.statut_paiement} onChange={(e) => updateStatut(i.id, e.target.value)} className="inline-select">
                  <option>Non payé</option>
                  <option>Partiel</option>
                  <option>Payé</option>
                </select>
              </td>
              <td className="row-actions">
                <button className="btn small danger" onClick={() => remove(i.id)}>Annuler</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="5" className="empty-cell">Aucune inscription.</td></tr>}
        </tbody>
      </table>

      {showModal && (
        <Modal title="Nouvelle inscription" onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="form-grid">
            <label className="span-2">Étudiant
              <select required value={form.etudiant_id} onChange={(e) => setForm({ ...form, etudiant_id: e.target.value })}>
                <option value="">— Choisir —</option>
                {etudiants.map((e) => <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>)}
              </select>
            </label>
            <label className="span-2">Session
              <select required value={form.session_id} onChange={(e) => setForm({ ...form, session_id: e.target.value })}>
                <option value="">— Choisir —</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.formation_titre} ({new Date(s.date_debut).toLocaleDateString('fr-FR')}) — {s.nb_inscrits}/{s.capacite_max}
                  </option>
                ))}
              </select>
            </label>
            {error && <div className="alert error span-2">{error}</div>}
            <div className="modal-actions span-2">
              <button type="button" className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button type="submit" className="btn primary">Inscrire</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
