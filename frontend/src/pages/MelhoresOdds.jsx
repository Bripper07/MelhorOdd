import { useState, useEffect } from 'react';
import BookmakerLogo from '../components/BookmakerLogo';

const LEAGUES = [
  { key: 'soccer_brazil_campeonato', label: 'Brasileirão Série A' },
  { key: 'soccer_brazil_campeonato_b', label: 'Brasileirão Série B' },
  { key: 'soccer_conmebol_libertadores', label: 'Copa Libertadores' },
  { key: 'soccer_epl', label: 'Premier League' },
  { key: 'soccer_spain_la_liga', label: 'La Liga' },
  { key: 'soccer_uefa_champs_league', label: 'Champions League' },
];

function extractTopOdds(matches, leagueLabel) {
  const entries = [];
  for (const match of matches) {
    const { home_team, away_team } = match;
    for (const bookmaker of match.bookmakers) {
      const market = bookmaker.markets.find((m) => m.key === 'h2h');
      if (!market) continue;
      for (const outcome of market.outcomes) {
        entries.push({
          id: `${match.id}-${bookmaker.key}-${outcome.name}`,
          homeTeam: home_team,
          awayTeam: away_team,
          outcomeName: outcome.name,
          odd: outcome.price,
          bookmakerKey: bookmaker.key,
          bookmakerTitle: bookmaker.title,
          league: leagueLabel,
        });
      }
    }
  }
  return entries;
}

function outcomeLabel(name, homeTeam, awayTeam) {
  if (name === 'Draw') return 'Empate';
  if (name === homeTeam) return `${name} (Casa)`;
  if (name === awayTeam) return `${name} (Fora)`;
  return name;
}

function SkeletonRow() {
  return (
    <div
      className="rounded-2xl animate-pulse"
      style={{
        background: 'linear-gradient(145deg, #161b27 0%, #111827 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        height: 80,
      }}
    />
  );
}

export default function MelhoresOdds() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL ?? '';
    let cancelled = false;

    setLoading(true);
    setErrors([]);
    setEntries([]);

    const fetches = LEAGUES.map(({ key, label }) =>
      fetch(`${apiBase}/api/odds/${key}?regions=eu&markets=h2h&oddsFormat=decimal`)
        .then((r) => {
          if (!r.ok) throw new Error(`${label}: erro ${r.status}`);
          return r.json();
        })
        .then((data) => ({ data, label }))
        .catch((err) => ({ error: err.message, label }))
    );

    Promise.all(fetches).then((results) => {
      if (cancelled) return;
      const allEntries = [];
      const errs = [];
      for (const result of results) {
        if (result.error) {
          errs.push(result.error);
        } else {
          allEntries.push(...extractTopOdds(result.data, result.label));
        }
      }
      allEntries.sort((a, b) => b.odd - a.odd);
      setEntries(allEntries.slice(0, 50));
      setErrors(errs);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white mb-1">Melhores Odds</h1>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          As 50 maiores odds disponíveis agora, em todas as ligas.
        </p>
      </div>

      {errors.length > 0 && (
        <div
          className="rounded-2xl p-4 mb-6 text-xs"
          style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.18)',
            color: '#fca5a5',
          }}
        >
          {errors.join(' · ')}
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-3">
          {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-20" style={{ color: '#374151' }}>
          <div className="text-4xl mb-3">📊</div>
          <p className="text-base font-medium">Nenhuma odd disponível agora</p>
          <p className="text-sm mt-1">Tente novamente mais tarde.</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className="flex flex-col gap-3 stagger-children">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className="rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(145deg, #161b27 0%, #111827 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              {/* Rank */}
              <span
                className="text-sm font-bold w-7 text-center flex-shrink-0"
                style={{ color: idx < 3 ? '#4ade80' : '#374151' }}
              >
                #{idx + 1}
              </span>

              {/* Match info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {entry.homeTeam} <span style={{ color: '#4b5563' }}>vs</span> {entry.awayTeam}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#6b7280' }}>
                  {outcomeLabel(entry.outcomeName, entry.homeTeam, entry.awayTeam)}
                  <span className="mx-1.5">·</span>
                  {entry.league}
                </p>
              </div>

              {/* Bookmaker */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <BookmakerLogo bookKey={entry.bookmakerKey} title={entry.bookmakerTitle} />
                <span className="text-xs hidden sm:block" style={{ color: '#6b7280' }}>
                  {entry.bookmakerTitle}
                </span>
              </div>

              {/* Odd value */}
              <div
                className="flex-shrink-0 text-right min-w-[52px] px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(74,222,128,0.1)' }}
              >
                <span className="text-green-400 font-bold text-base">
                  {entry.odd.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
