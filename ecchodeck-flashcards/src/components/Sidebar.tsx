import React from 'react';

const LogoFull = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 164 50" width="164" height="50" aria-label="EcchoDeck">
    <rect x="1" y="6" width="38" height="38" rx="9" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
    <rect x="0" y="5" width="38" height="38" rx="9" fill="#ff5c1a"/>
    <line x1="9" y1="17" x2="29" y2="17" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"/>
    <line x1="9" y1="24" x2="24" y2="24" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" opacity="0.75"/>
    <line x1="9" y1="31" x2="19" y2="31" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" opacity="0.45"/>
    <text x="48" y="30" fontFamily="Syne,sans-serif" fontWeight="800" fontSize="18" fill="#f0f0f0" letterSpacing="0.5">eccho</text>
    <text x="49" y="45" fontFamily="Syne,sans-serif" fontWeight="700" fontSize="11" fill="#ff5c1a" letterSpacing="3">DECK</text>
  </svg>
);

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" width="38" height="38" aria-label="ED">
    <rect x="1" y="1" width="36" height="36" rx="8" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
    <rect x="0" y="0" width="36" height="36" rx="8" fill="#ff5c1a"/>
    <line x1="8" y1="12" x2="28" y2="12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/>
    <line x1="8" y1="19" x2="23" y2="19" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.75"/>
    <line x1="8" y1="26" x2="18" y2="26" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.45"/>
  </svg>
);

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  cardCount: number;
  studiedCount: number;
  avgMastery: string;
  masteryPct: number;
  activeNav: string;
  onNavChange: (tab: 'flashcards' | 'explorar' | 'criar' | 'sobre' | 'config') => void;
  user: { name: string; initials: string } | null;
  streak: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed, onToggle, cardCount, studiedCount, avgMastery, masteryPct,
  activeNav, onNavChange, user, streak,
}) => {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} id="sidebar">
      <button className="sb-toggle" onClick={onToggle} title={collapsed ? 'Expandir' : 'Recolher'}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Full brand */}
      <div className="sb-brand">
        <LogoFull />
      </div>

      {/* Collapsed brand */}
      <div className="sb-collapsed-brand" id="sbCollapsedBrand">
        <LogoIcon />
      </div>

      {/* User */}
      <div className="sb-user">
        {user ? (
          <div className="user-row">
            <div className="user-av">{user.initials}</div>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-streak">
                {streak > 0
                  ? <><span>{streak}</span> {streak === 1 ? 'dia de ofensiva' : 'dias de ofensiva'}</>
                  : <span className="streak-zero">Comece sua ofensiva hoje!</span>
                }
              </div>
            </div>
          </div>
        ) : (
          <div className="user-guest">
            <p className="user-guest-msg">Olá, <span>Desconhecido</span></p>
            <div className="user-guest-btns">
              <button
                className="user-guest-btn"
                onClick={() => onNavChange('config')}
                aria-label="Criar uma conta"
              >
                Criar conta
              </button>
              <button
                className="user-guest-btn ghost"
                onClick={() => onNavChange('config')}
                aria-label="Entrar na conta"
              >
                Entrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="sb-stats">
        <div className="sb-stat">
          <span className="sb-stat-val">{cardCount}</span>
          <span className="sb-stat-lbl">Cards</span>
        </div>
        <div className="sb-stat">
          <span className="sb-stat-val">{studiedCount}</span>
          <span className="sb-stat-lbl">Estudados</span>
        </div>
        <div className="sb-stat">
          <span className="sb-stat-val">{avgMastery}</span>
          <span className="sb-stat-lbl">Domínio</span>
        </div>
      </div>

      <h2 className="sb-sec-lbl">Meus Decks</h2>

      {/* Deck list */}
      <ul className="deck-list">
        <li className="deck-item active">
          <div className="deck-emoji">🧠</div>
          <div className="deck-info">
            <div className="deck-title">Eccho Deck</div>
            <div className="deck-prog">
              <div className="deck-prog-fill" style={{ width: `${masteryPct}%` }} />
            </div>
          </div>
          <span className="deck-pct">{Math.round(masteryPct)}%</span>
        </li>
      </ul>

      {/* Nav */}
      <nav className="sb-nav" aria-label="Navegação principal">
        <button
          className={`nav-btn${activeNav === 'flashcards' ? ' active' : ''}`}
          aria-label="Home"
          aria-current={activeNav === 'flashcards' ? 'page' : undefined}
          onClick={() => onNavChange('flashcards')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="nav-label">Home</span>
        </button>
        <button
          className={`nav-btn${activeNav === 'explorar' ? ' active' : ''}`}
          aria-label="Explorar"
          aria-current={activeNav === 'explorar' ? 'page' : undefined}
          onClick={() => onNavChange('explorar')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <span className="nav-label">Explorar</span>
        </button>
        <button
          className={`nav-btn${activeNav === 'config' ? ' active' : ''}`}
          aria-label="Configurações"
          aria-current={activeNav === 'config' ? 'page' : undefined}
          onClick={() => onNavChange('config')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.07a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.07a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="nav-label">Config</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
