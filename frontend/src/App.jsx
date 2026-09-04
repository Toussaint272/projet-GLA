import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Etudiants from './pages/Etudiants';
import Formateurs from './pages/Formateurs';
import Formations from './pages/Formations';
import Sessions from './pages/Sessions';
import Inscriptions from './pages/Inscriptions';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="etudiants" element={<Etudiants />} />
        <Route path="formateurs" element={<Formateurs />} />
        <Route path="formations" element={<Formations />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="inscriptions" element={<Inscriptions />} />
      </Route>
    </Routes>
  );
}
