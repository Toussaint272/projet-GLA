import { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const empty = { titre: '', description: '', categorie: '', niveau: 'Débutant', duree_heures: '', prix: '' };

function formatAr(n) {
  return new Intl.NumberFormat('fr-MG').format(n) + ' Ar';
}

export default function Formations() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const load = () => api.get('/formations').then(setList).catch((e) => setError(e.message));
  useEffect(load, []);

  const openCreate = () => { setForm(empty); setEditingId(null); setShowModal(true); };
  const openEdit = (f) => { setForm({ ...empty, ...f }); setEditingId(f.id); setShowModal(true); };

  const submit = async (ev) => {
    ev.preventDefault();
    setError('');
    try {
      const payload = { ...form, duree_heures: Number(form.duree_heures), prix: Number(form.prix) };
      if (editingId) await api.put(`/formations/${editingId}`, payload);
      else await api.post('/formations', payload);
      setShowModal(false);
      load();
    } catch (e) { setError(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer cette formation ?')) return;
    try { await api.del(`/formations/${id}`); load(); } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <h1>Catalogue de formations</h1>
          <p className="page-sub">{list.length} formation(s) au catalogue</p>
        </div>
        <button className="btn primary" onClick={openCreate}>+ Ajouter une formation</button>
      </header>

      {error && <div className="alert error">{error}</div>}

      <div className="card-grid">
        {list.map((f) => (
          <div className="course-card" key={f.id}>
            <div className="course-top">
              <span className="tag">{f.categorie || 'Non classée'}</span>
              <span className="tag muted-tag">{f.niveau}</span>
            </div>
            <h3>{f.titre}</h3>
            <p className="course-desc">{f.description || 'Pas de description.'}</p>
            <div className="course-meta">
              <span>{f.duree_heures} h</span>
              <span>{formatAr(f.prix)}</span>
            </div>
            <div className="row-actions">
              <button className="btn small" onClick={() => openEdit(f)}>Modifier</button>
              <button className="btn small danger" onClick={() => remove(f.id)}>Supprimer</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="muted">Aucune formation au catalogue.</p>}
      </div>

      {showModal && (
        <Modal title={editingId ? 'Modifier la formation' : 'Nouvelle formation'} onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="form-grid">
            <label className="span-2">Titre
              <input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} />
            </label>
            <label className="span-2">Description
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>
            <label>Catégorie
              <input value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })} />
            </label>
            <label>Niveau
              <select value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })}>
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Avancé</option>
              </select>
            </label>
            <label>Durée (heures)
              <input required type="number" min="0" value={form.duree_heures} onChange={(e) => setForm({ ...form, duree_heures: e.target.value })} />
            </label>
            <label>Prix (Ar)
              <input required type="number" min="0" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} />
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
