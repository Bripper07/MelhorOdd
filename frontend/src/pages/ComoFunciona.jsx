export default function ComoFunciona() {
  const sections = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill="rgba(74,222,128,0.12)" />
          <path d="M7 11.5l2.8 2.8 5.2-5.6" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'O que é o MelhorOdd',
      body: (
        <p>
          O <strong style={{ color: '#e5e7eb' }}>MelhorOdd</strong> é um comparador de odds
          esportivas. Reunimos as cotações de várias casas de apostas em um único lugar para que
          você possa ver rapidamente onde está a melhor odd para cada resultado — sem precisar
          abrir dezenas de sites.
        </p>
      ),
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill="rgba(74,222,128,0.12)" />
          <path d="M7 15V10m3 5V7m3 8V12" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      title: 'Como as odds funcionam',
      body: (
        <>
          <p>
            Uma odd decimal representa o retorno total por real apostado. Por exemplo, uma odd de{' '}
            <span style={{ color: '#4ade80', fontWeight: 600 }}>3.50</span> significa que, para cada
            R$1 apostado, você recebe R$3,50 de volta em caso de acerto — incluindo o valor apostado.
          </p>
          <p className="mt-3">
            Quanto maior a odd, maior o risco estimado pelas casas de apostas — e maior o retorno
            potencial. Comparar odds entre diferentes casas pode fazer uma grande diferença no
            retorno a longo prazo.
          </p>
        </>
      ),
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill="rgba(74,222,128,0.12)" />
          <path d="M8 11h6m-3-3v6" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      title: 'Apenas informativo — não somos uma casa de apostas',
      body: (
        <p>
          O MelhorOdd <strong style={{ color: '#e5e7eb' }}>não aceita apostas</strong> e{' '}
          <strong style={{ color: '#e5e7eb' }}>não tem vínculo financeiro</strong> com nenhuma casa
          de apostas. Somos um agregador independente que apenas exibe e compara dados públicos de
          odds. Para apostar, você precisará acessar diretamente o site da casa de apostas escolhida.
          Aposte com responsabilidade.
        </p>
      ),
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="11" fill="rgba(74,222,128,0.12)" />
          <path d="M7 9h8M7 12h5" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      title: 'Como usar o MelhorOdd',
      body: (
        <ol className="list-none space-y-3 mt-1">
          {[
            ['Home', 'Escolha uma liga no seletor de ligas e veja todas as partidas disponíveis. Para cada jogo, a tabela mostra as odds de cada casa de apostas, com a melhor marcada em verde.'],
            ['Melhores Odds', 'Acesse a página "Melhores Odds" para ver o ranking das maiores cotações disponíveis no momento, em todas as ligas e todas as casas de apostas.'],
            ['Compare e decida', 'Use os dados para identificar qual casa oferece a melhor odd para o resultado que você acha mais provável.'],
          ].map(([step, desc], i) => (
            <li key={i} className="flex gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}
              >
                {i + 1}
              </span>
              <span>
                <strong style={{ color: '#e5e7eb' }}>{step}:</strong>{' '}
                {desc}
              </span>
            </li>
          ))}
        </ol>
      ),
    },
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Como Funciona</h1>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          Tudo o que você precisa saber para aproveitar o MelhorOdd.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {sections.map((section, i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{
              background: 'linear-gradient(145deg, #161b27 0%, #111827 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {section.icon}
              <h2 className="text-base font-semibold text-white">{section.title}</h2>
            </div>
            <div className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>
              {section.body}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
