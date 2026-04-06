import { useState } from 'react';

const DOMAINS = {
  bet365: 'bet365.com',
  betano: 'betano.com.br',
  sportingbet: 'sportingbet.com',
  unibet: 'unibet.com',
  betfair: 'betfair.com',
  betfair_ex_eu: 'betfair.com',
  pinnacle: 'pinnacle.com',
  williamhill: 'williamhill.com',
  draftkings: 'draftkings.com',
  fanduel: 'fanduel.com',
  mybookieag: 'mybookie.ag',
  bovada: 'bovada.lv',
  betonlineag: 'betonline.ag',
  lowvig: 'lowvig.ag',
  superbook: 'superbook.com',
  pointsbetus: 'pointsbet.com',
  betrivers: 'betrivers.com',
  barstool: 'barstoolsportsbook.com',
  caesars: 'caesars.com',
  fliff: 'getfliff.com',
  novig: 'novig.com',
  betmgm: 'betmgm.com',
  hardrockbet: 'hardrockbet.com',
  espnbet: 'espnbet.com',
};

export default function BookmakerLogo({ bookKey, title }) {
  const [failed, setFailed] = useState(false);
  const domain = DOMAINS[bookKey];

  if (!domain || failed) {
    return (
      <span className="w-4 h-4 rounded-sm bg-gray-700 inline-block flex-shrink-0" />
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      alt={title}
      width={16}
      height={16}
      className="rounded-sm flex-shrink-0"
      onError={() => setFailed(true)}
    />
  );
}
