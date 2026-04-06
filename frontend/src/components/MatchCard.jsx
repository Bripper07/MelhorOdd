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

function calcMargin(home, draw, away) {
  const vals = [home, draw, away].filter(Boolean);
  if (vals.length < 2) return null;
  return (vals.reduce((sum, v) => sum + 1 / v, 0) - 1) * 100;
}

function marginColor(m) {
  if (m < 5) return '#4ade80';   // green
  if (m < 8) return '#facc15';   // yellow
  return '#f87171';              // red
}

function marginBg(m) {
  if (m < 5) return 'rgba(74,222,128,0.1)';
  if (m < 8) return 'rgba(250,204,21,0.1)';
  return 'rgba(248,113,113,0.1)';
}

function MarginBadge({ margin }) {
  if (margin === null) return null;
  const color = marginColor(margin);
  const bg = marginBg(margin);
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
      style={{ color, background: bg, whiteSpace: 'nowrap' }}
    >
      {margin.toFixed(1)}%
    </span>
  );
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

function MarginTooltip() {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);

  function show() {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.top - 8, left: r.left + r.width / 2 });
  }
  function hide() { setPos(null); }

  return (
    <span className="inline-flex items-center" style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}
        aria-label="O que é margem?"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ color: '#4b5563', display: 'block' }}>
          <circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6.5 5.5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="6.5" cy="3.8" r="0.7" fill="currentColor" />
        </svg>
      </button>
      {pos && (
        <span
          className="text-xs rounded-xl px-3 py-2 pointer-events-none"
          style={{
            position: 'fixed',
            zIndex: 9999,
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, -100%)',
            background: '#1e2535',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#d1d5db',
            width: 200,
            lineHeight: 1.5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          <strong style={{ color: '#e5e7eb' }}>Margem da casa</strong>
          <br />
          Quanto menor a margem, melhor para o apostador. Abaixo de 5% é ótimo.
        </span>
      )}
    </span>
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
      const avg = vals.length ? vals.reduce((a, c) => a + c, 0) / vals.length : 0;
      const margin = calcMargin(home, draw, away);
      return { key: b.key, title: b.title, home, draw, away, avg, margin };
    })
    .filter(Boolean)
    .sort((a, b) => b.avg - a.avg);

  if (books.length === 0) return null;

  const bestHome = Math.max(...books.map((b) => b.home ?? 0));
  const bestDraw = Math.max(...books.map((b) => b.draw ?? 0));
  const bestAway = Math.max(...books.map((b) => b.away ?? 0));

  const marginsWithValue = books.map((b) => b.margin).filter((m) => m !== null);
  const avgMargin = marginsWithValue.length
    ? marginsWithValue.reduce((a, m) => a + m, 0) / marginsWithValue.length
    : null;

  const topBooks = books.slice(0, TOP_N);
  const extraBooks = books.slice(TOP_N);
  const hasExtra = extraBooks.length > 0;

  function BookRow({ b, i, total }) {
    return (
      <tr
        className="transition-colors duration-150"
        style={{ borderBottom: i < total - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <td className="px-5 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <BookmakerLogo bookKey={b.key} title={b.title} />
            <span className="text-gray-400 text-xs font-medium">{b.title}</span>
            <MarginBadge margin={b.margin} />
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

        {/* Average margin summary */}
        {avgMargin !== null && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px]" style={{ color: '#4b5563' }}>Margem média:</span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ color: marginColor(avgMargin), background: marginBg(avgMargin) }}
            >
              {avgMargin.toFixed(1)}%
            </span>
            <span className="text-[10px]" style={{ color: '#374151' }}>
              {avgMargin < 5 ? '· ótimo para o apostador' : avgMargin < 8 ? '· margem média' : '· margem alta'}
            </span>
          </div>
        )}
      </div>

      {/* Odds table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th className="text-left px-5 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#4b5563' }}>
                <span className="flex items-center gap-1.5">
                  Casa · Margem <MarginTooltip />
                </span>
              </th>
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
