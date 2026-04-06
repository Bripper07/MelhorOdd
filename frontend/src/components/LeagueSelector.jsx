export default function LeagueSelector({ leagues, selected, onChange }) {
  return (
    <div
      className="flex flex-wrap gap-2 p-1.5 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {leagues.map((l) => {
        const isActive = selected === l.key;
        return (
          <button
            key={l.key}
            onClick={() => onChange(l.key)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative"
            style={
              isActive
                ? {
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#fff',
                    boxShadow: '0 0 16px rgba(22,163,74,0.35)',
                  }
                : {
                    background: 'transparent',
                    color: '#6b7280',
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = '#6b7280';
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
