import React from 'react';
import MasteryCircle from './MasteryCircle';

interface DeckHeaderProps {
  cardCount: number;
  studiedCount: number;
  masteryPercentage: number;
  avgMastery: string;
  onStudy: () => void;
}

const DeckHeader: React.FC<DeckHeaderProps> = ({
  cardCount, studiedCount, masteryPercentage, avgMastery, onStudy,
}) => (
  <header className="deck-header">
    <div className="dh-row">
      <div className="dh-thumb">🧠</div>

      <div className="dh-info">
        <h1 className="dh-title">
          Eccho Deck
        </h1>

        <div className="dh-kpis">
          <div className="dh-kpi">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
            </svg>
            <b>{cardCount}</b>&nbsp;cards
          </div>
          <div className="dh-kpi">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <b>{studiedCount}</b>&nbsp;estudados
          </div>
          <div className="dh-kpi">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Domínio médio&nbsp;<b>{avgMastery}/5</b>
          </div>
        </div>

        <div className="dh-actions">
          <button className="btn-ora" onClick={onStudy} disabled={cardCount === 0}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Estudar
          </button>
        </div>
      </div>

      <MasteryCircle percentage={masteryPercentage} size={84} />
    </div>
  </header>
);

export default DeckHeader;
