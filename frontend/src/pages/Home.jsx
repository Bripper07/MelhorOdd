import { useState, useEffect, useRef } from 'react';
import LeagueSelector from '../components/LeagueSelector';
import MatchCard from '../components/MatchCard';

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

export default function Home() {
  const [league, setLeague] = useState(LEAGUES[0].key);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listKey, setListKey] = useState(0);
  const [search, setSearch] = useState('');
  const abortRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setSearch('');

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

  const filtered = search.trim()
    ? matches.filter((m) => {
        const q = search.trim().toLowerCase();
        return m.home_team.toLowerCase().includes(q) || m.away_team.toLowerCase().includes(q);
      })
    : matches;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="mb-5 relative">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ color: '#4b5563' }}
          >
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar time..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              caretColor: '#4ade80',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(74,222,128,0.4)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-150"
              style={{ color: '#6b7280', background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e5e7eb')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
              aria-label="Limpar busca"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* League selector */}
      <div className="mb-7">
        <LeagueSelector leagues={LEAGUES} selected={league} onChange={setLeague} />
      </div>

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

      {!loading && !error && matches.length > 0 && filtered.length === 0 && (
        <div className="text-center py-20" style={{ color: '#374151' }}>
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-base font-medium">Nenhuma partida encontrada para sua busca</p>
          <p className="text-sm mt-1">Tente outro nome de time.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div key={listKey} className="flex flex-col gap-4 stagger-children">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </main>
  );
}
