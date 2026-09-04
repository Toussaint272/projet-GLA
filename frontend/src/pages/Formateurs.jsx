import { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { nom: '', prenom: '', email: '', telephone: '', specialite: '', actif: true };

export default function Formateurs() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.get('/formateurs').then(setList).catch((e) => setError(e.message));
  useEffect(load, []);

  const openCreate = () => { setForm(empty); setEditingId(null); setShowModal(true); };
  const openEdit = (f) => { setForm({ ...empty, ...f }); setEditingId(f.id); setShowModal(true); };

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    try {
      if (editingId) await api.put(`/formateurs/${editingId}`, form);
      else await api.post('/formateurs', form);
      setShowModal(false);
      load();
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer ce formateur ?')) return;
    try { await api.del(`/formateurs/${id}`); load(); } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Formateurs</h1>
          <p className="page-sub">{list.length} formateur(s)</p>
        </div>
        <button className="btn primary" onClick={openCreate}>+ Ajouter un formateur</button>
      </header>

      {error && <div className="alert error">{error}</div>}

      <table className="table">
        <thead>
          <tr><th>Nom</th><th>Spécialité</th><th>Email</th><th>Statut</th><th></th></tr>
        </thead>
        <tbody>
          {list.map((f) => (
            <tr key={f.id}>
              <td>{f.prenom} {f.nom}</td>
              <td>{f.specialite || '—'}</td>
              <td>{f.email}</td>
              <td><span className={`badge ${f.actif ? 'ok' : 'off'}`}>{f.actif ? 'Actif' : 'Inactif'}</span></td>
              <td className="row-actions">
                <button className="btn small" onClick={() => openEdit(f)}>Modifier</button>
                <button className="btn small danger" onClick={() => remove(f.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan="5" className="empty-cell">Aucun formateur.</td></tr>}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editingId ? 'Modifier le formateur' : 'Nouveau formateur'} onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="form-grid">
            <label>Nom
              <input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </label>
            <label>Prénom
              <input required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
            </label>
            <label>Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>Téléphone
              <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </label>
            <label className="span-2">Spécialité
              <input value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} />
            </label>
            {editingId && (
              <label className="checkbox-row">
                <input type="checkbox" checked={form.actif} onChange={(e) => setForm({ ...form, actif: e.target.checked })} />
                Formateur actif
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
