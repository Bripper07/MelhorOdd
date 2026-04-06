import { useState, useEffect } from 'react';

// Module-level cache: team name → logo URL or null (null = no logo found)
const logoCache = {};
// Track in-flight requests to avoid duplicate fetches
const inFlight = {};

const PALETTES = [
  { bg: '#1e3a5f', text: '#60a5fa' },
  { bg: '#1a3a2e', text: '#34d399' },
  { bg: '#3b1f3b', text: '#c084fc' },
  { bg: '#3b2a14', text: '#fbbf24' },
  { bg: '#3b1a1a', text: '#f87171' },
  { bg: '#1a2e3b', text: '#38bdf8' },
  { bg: '#2e2a14', text: '#facc15' },
  { bg: '#1a3b35', text: '#2dd4bf' },
];

function hashName(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function getInitials(name) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function Initials({ name, size }) {
  const palette = PALETTES[hashName(name) % PALETTES.length];
  const initials = getInitials(name);
  const fontSize = size * 0.36;
  return (
    <div
      style={{
        width: size, height: size, minWidth: size,
        borderRadius: '50%',
        background: palette.bg,
        border: `1.5px solid ${palette.text}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize, fontWeight: 700, color: palette.text,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        letterSpacing: '0.03em',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

async function fetchLogo(name) {
  if (name in logoCache) return logoCache[name];
  if (inFlight[name]) return inFlight[name];

  const promise = fetch(
    `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`
  )
    .then((r) => r.json())
    .then((data) => {
      const url = data?.teams?.[0]?.strBadge ?? null;
      logoCache[name] = url;
      delete inFlight[name];
      return url;
    })
    .catch(() => {
      logoCache[name] = null;
      delete inFlight[name];
      return null;
    });

  inFlight[name] = promise;
  return promise;
}

export default function TeamCrest({ name, size = 42 }) {
  // undefined = loading, null = no logo, string = URL
  const [logo, setLogo] = useState(() =>
    name in logoCache ? logoCache[name] : undefined
  );
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (name in logoCache) {
      setLogo(logoCache[name]);
      return;
    }
    let cancelled = false;
    fetchLogo(name).then((url) => {
      if (!cancelled) setLogo(url);
    });
    return () => { cancelled = true; };
  }, [name]);

  const showLogo = logo && !imgError;

  return (
    <div
      style={{
        width: size, height: size, minWidth: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {showLogo ? (
        <img
          src={logo}
          alt={name}
          width={size}
          height={size}
          style={{ width: size, height: size, objectFit: 'contain', borderRadius: '50%' }}
          onError={() => setImgError(true)}
        />
      ) : (
        <Initials name={name} size={size} />
      )}
    </div>
  );
}
