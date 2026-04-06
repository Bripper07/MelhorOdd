import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import MelhoresOdds from './pages/MelhoresOdds';
import ComoFunciona from './pages/ComoFunciona';

export default function App() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(22,163,74,0.08) 0%, transparent 60%), linear-gradient(180deg, #0b0f1a 0%, #0d1117 100%)',
      }}
    >
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/melhores-odds" element={<MelhoresOdds />} />
        <Route path="/como-funciona" element={<ComoFunciona />} />
      </Routes>

      <footer className="text-center py-8 text-xs" style={{ color: '#1f2937' }}>
        Odds fornecidas por The Odds API · Apenas para fins informativos · Aposte com responsabilidade.
      </footer>
    </div>
  );
}
