import { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { nom: '', prenom: '', email: '', telephone: '', date_naissance: '', adresse: '' };

export default function Etudiants() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    api.get(`/etudiants${q}`).then(setList).catch((e) => setError(e.message));
  };

  useEffect(load, [search]);

  const openCreate = () => { setForm(empty); setEditingId(null); setShowModal(true); };
  const openEdit = (e) => {
    setForm({ ...empty, ...e, date_naissance: e.date_naissance ? e.date_naissance.slice(0, 10) : '' });
    setEditingId(e.id);
    setShowModal(true);
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    try {
      if (editingId) await api.put(`/etudiants/${editingId}`, form);
      else await api.post('/etudiants', form);
      setShowModal(false);
      load();
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cet étudiant ?')) return;
    try { await api.del(`/etudiants/${id}`); load(); } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Étudiants</h1>
          <p className="page-sub">{list.length} étudiant(s) enregistré(s)</p>
        </div>
        <button className="btn primary" onClick={openCreate}>+ Ajouter un étudiant</button>
      </header>

      <input
        className="search-input"
        placeholder="Rechercher par nom, prénom ou email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <div className="alert error">{error}</div>}

      <table className="table">
        <thead>
          <tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Inscrit le</th><th></th></tr>
        </thead>
        <tbody>
          {list.map((e) => (
            <tr key={e.id}>
              <td>{e.prenom} {e.nom}</td>
              <td>{e.email}</td>
              <td>{e.telephone || '—'}</td>
              <td>{e.date_inscription ? new Date(e.date_inscription).toLocaleDateString('fr-FR') : '—'}</td>
              <td className="row-actions">
                <button className="btn small" onClick={() => openEdit(e)}>Modifier</button>
                <button className="btn small danger" onClick={() => remove(e.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
          {list.length === 0 && (
            <tr><td colSpan="5" className="empty-cell">Aucun étudiant trouvé.</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editingId ? 'Modifier l\'étudiant' : 'Nouvel étudiant'} onClose={() => setShowModal(false)}>
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
            <label>Date de naissance
              <input type="date" value={form.date_naissance} onChange={(e) => setForm({ ...form, date_naissance: e.target.value })} />
            </label>
            <label className="span-2">Adresse
              <textarea value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
            </label>
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
