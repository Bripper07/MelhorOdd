import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/melhores-odds', label: 'Melhores Odds' },
  { to: '/como-funciona', label: 'Como Funciona' },
];

export default function NavBar() {
  return (
    <header
      style={{
        background: 'rgba(11,15,26,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-6 flex-wrap">
        {/* Logo */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill="rgba(22,163,74,0.15)" />
            <path d="M9 14.5l3.5 3.5 6.5-7" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-extrabold ml-1.5 tracking-tight">
            <span style={{ color: '#4ade80' }}>Melhor</span>
            <span className="text-white">Odd</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#4ade80' : '#9ca3af',
                background: isActive ? 'rgba(74,222,128,0.1)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes('0.1')) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                  e.currentTarget.style.background = isActive ? 'rgba(74,222,128,0.1)' : 'transparent';
                  e.currentTarget.style.color = isActive ? '#4ade80' : '#9ca3af';
                }
              }}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
