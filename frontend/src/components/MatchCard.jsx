import { useState, useRef } from 'react';
import TeamCrest from './TeamCrest';
import BookmakerLogo from './BookmakerLogo';

const TOP_N = 3;

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isToday = d.toDateString() === today.toDateString();
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  const time = d.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Hoje · ${time}`;
  if (isTomorrow) return `Amanhã · ${time}`;
  return d.toLocaleString('pt-BR', {
    weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

function OddCell({ value, isBest }) {
  if (!value) return <td className="px-3 py-3 text-center text-gray-600">—</td>;

  if (isBest) {
    return (
      <td className="px-3 py-3 text-center">
        <div className="inline-flex flex-col items-center gap-0.5">
          <span className="text-green-400 font-bold text-sm">{value.toFixed(2)}</span>
          <span
            className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', letterSpacing: '0.12em' }}
          >
            MELHOR
          </span>
        </div>
      </td>
    );
  }

  return (
    <td className="px-3 py-3 text-center text-gray-400 text-sm">{value.toFixed(2)}</td>
  );
}

export default function MatchCard({ match }) {
  const { home_team, away_team, commence_time, bookmakers } = match;
  const [expanded, setExpanded] = useState(false);
  const extraRef = useRef(null);

  const books = bookmakers
    .map((b) => {
      const market = b.markets.find((m) => m.key === 'h2h');
      if (!market) return null;
      const home = market.outcomes.find((o) => o.name === home_team)?.price;
      const away = market.outcomes.find((o) => o.name === away_team)?.price;
      const draw = market.outcomes.find((o) => o.name === 'Draw')?.price;
      const vals = [home, draw, away].filter(Boolean);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return { key: b.key, title: b.title, home, draw, away, avg };
    })
    .filter(Boolean)
    .sort((a, b) => b.avg - a.avg);

  if (books.length === 0) return null;

  const bestHome = Math.max(...books.map((b) => b.home ?? 0));
  const bestDraw = Math.max(...books.map((b) => b.draw ?? 0));
  const bestAway = Math.max(...books.map((b) => b.away ?? 0));

  const topBooks = books.slice(0, TOP_N);
  const extraBooks = books.slice(TOP_N);
  const hasExtra = extraBooks.length > 0;

  function BookRow({ b, i, total }) {
    return (
      <tr
        className="transition-colors duration-150"
        style={{
          borderBottom: i < total - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <td className="px-5 py-3">
          <div className="flex items-center gap-2">
            <BookmakerLogo bookKey={b.key} title={b.title} />
            <span className="text-gray-400 text-xs font-medium">{b.title}</span>
          </div>
        </td>
        <OddCell value={b.home} isBest={b.home === bestHome} />
        <OddCell value={b.draw} isBest={b.draw === bestDraw} />
        <OddCell value={b.away} isBest={b.away === bestAway} />
      </tr>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'linear-gradient(145deg, #161b27 0%, #111827 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Match header */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <TeamCrest name={home_team} size={42} />
            <span className="font-semibold text-white text-sm leading-tight truncate">{home_team}</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}
            >
              VS
            </span>
            <span className="text-[11px] text-gray-500 whitespace-nowrap">{formatDate(commence_time)}</span>
          </div>
          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
            <span className="font-semibold text-white text-sm leading-tight truncate text-right">{away_team}</span>
            <TeamCrest name={away_team} size={42} />
          </div>
        </div>
      </div>

      {/* Odds table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#4b5563' }}>Casa</th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: '#4b5563' }}>1 · Casa</th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: '#4b5563' }}>X · Empate</th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-center" style={{ color: '#4b5563' }}>2 · Fora</th>
            </tr>
          </thead>
          <tbody>
            {topBooks.map((b, i) => (
              <BookRow key={b.key} b={b} i={i} total={expanded || !hasExtra ? books.length : topBooks.length} />
            ))}
          </tbody>
        </table>

        {/* Collapsible extra rows */}
        {hasExtra && (
          <div
            ref={extraRef}
            style={{
              overflow: 'hidden',
              maxHeight: expanded ? `${extraRef.current?.scrollHeight ?? 9999}px` : '0px',
              transition: 'max-height 0.3s ease',
            }}
          >
            <table className="w-full text-sm">
              <tbody>
                {extraBooks.map((b, i) => (
                  <BookRow key={b.key} b={b} i={i} total={extraBooks.length} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer strip */}
      <div
        className="px-5 py-2 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="text-[11px]" style={{ color: '#374151' }}>
          {books.length} casas de apostas
        </span>

        {hasExtra && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs font-medium flex items-center gap-1 transition-colors duration-150"
            style={{ color: '#4ade80', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#86efac')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#4ade80')}
          >
            {expanded ? (
              <>
                Ver menos
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            ) : (
              <>
                Ver todas as {books.length} casas
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
