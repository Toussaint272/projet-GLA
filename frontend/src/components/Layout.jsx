import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Tableau de bord', icon: '◆', end: true },
  { to: '/etudiants', label: 'Étudiants', icon: '◍' },
  { to: '/formateurs', label: 'Formateurs', icon: '◎' },
  { to: '/formations', label: 'Formations', icon: '▤' },
  { to: '/sessions', label: 'Sessions', icon: '▦' },
  { to: '/inscriptions', label: 'Inscriptions', icon: '✎' },
];

export default function Layout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">CF</span>
          <div>
            <div className="brand-title">Centre Formation</div>
            <div className="brand-sub">Informatique</div>
          </div>
        </div>
        <nav className="nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              <span className="nav-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">Gestion de centre de formation v1.0</div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
