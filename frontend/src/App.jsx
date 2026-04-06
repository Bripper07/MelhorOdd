import { useState, useEffect, useRef } from 'react';
import LeagueSelector from './components/LeagueSelector';
import MatchCard from './components/MatchCard';

const LEAGUES = [
  { key: 'soccer_brazil_campeonato', label: 'Brasileirão Série A' },
  { key: 'soccer_brazil_campeonato_b', label: 'Brasileirão Série B' },
  { key: 'soccer_conmebol_libertadores', label: 'Copa Libertadores' },
  { key: 'soccer_epl', label: 'Premier League' },
  { key: 'soccer_spain_la_liga', label: 'La Liga' },
  { key: 'soccer_uefa_champs_league', label: 'Champions League' },
];

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{
        background: 'linear-gradient(145deg, #161b27 0%, #111827 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        height: 180,
      }}
    />
  );
}

export default function App() {
  const [league, setLeague] = useState(LEAGUES[0].key);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listKey, setListKey] = useState(0);
  const abortRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const apiBase = import.meta.env.VITE_API_URL ?? '';
    fetch(`${apiBase}/api/odds/${league}?regions=eu&markets=h2h&oddsFormat=decimal`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Erro ${r.status}: verifique sua ODDS_API_KEY no backend.`);
        return r.json();
      })
      .then((data) => {
        setMatches(data);
        setListKey((k) => k + 1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });
  }, [league]);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(22,163,74,0.08) 0%, transparent 60%), linear-gradient(180deg, #0b0f1a 0%, #0d1117 100%)',
      }}
    >
      {/* Header */}
      <header
        style={{
          background: 'rgba(11,15,26,0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="rgba(22,163,74,0.15)" />
              <path d="M9 14.5l3.5 3.5 6.5-7" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-extrabold ml-1.5 tracking-tight">
              <span style={{ color: '#4ade80' }}>Melhor</span>
              <span className="text-white">Odd</span>
            </span>
          </div>

          <p className="text-xs hidden sm:block" style={{ color: '#4b5563' }}>
            Compare odds • encontre a melhor
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* League selector */}
        <div className="mb-7">
          <LeagueSelector leagues={LEAGUES} selected={league} onChange={setLeague} />
        </div>

        {/* Content area */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && (
          <div
            className="rounded-2xl p-4 my-6 text-sm"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-20" style={{ color: '#374151' }}>
            <div className="text-4xl mb-3">🏟️</div>
            <p className="text-base font-medium">Nenhuma partida disponível</p>
            <p className="text-sm mt-1">Tente outra liga ou volte mais tarde.</p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div key={listKey} className="flex flex-col gap-4 stagger-children">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-xs" style={{ color: '#1f2937' }}>
        Odds fornecidas por The Odds API · Apenas para fins informativos · Aposte com responsabilidade.
      </footer>
    </div>
  );
}
