import React, { useState, useCallback } from 'react';
import { Flashcard } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface FlashcardItemProps {
  flashcard: Flashcard;
  index: number;
  onUpdateMastery: (id: string, level: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const masteryLabels = ['Não sei', 'Pouco', 'Razoável', 'Bom', 'Excelente'];
const masteryColors = ['var(--red)', 'var(--yel)', 'var(--yel2)', 'var(--grn)', 'var(--ora)'];

const MM = [
  null,
  { label: 'Não sei',   cls: 'm1', bar: 'b1', btn: 'ml1', color: 'var(--red)' },
  { label: 'Pouco',     cls: 'm2', bar: 'b2', btn: 'ml2', color: 'var(--yel)' },
  { label: 'Razoável',  cls: 'm3', bar: 'b3', btn: 'ml3', color: 'var(--yel2)' },
  { label: 'Bom',       cls: 'm4', bar: 'b4', btn: 'ml4', color: 'var(--grn)' },
  { label: 'Excelente', cls: 'm5', bar: 'b5', btn: 'ml5', color: 'var(--ora)' },
] as const;

const FlashcardItem: React.FC<FlashcardItemProps> = ({
  flashcard, index, onUpdateMastery, onDelete,
}) => {
  const [expanded, setExpanded]       = useState(false);
  const [flipped, setFlipped]         = useState(false);
  const [updating, setUpdating]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const m       = MM[flashcard.masteryLevel]!;
  const pct     = ((flashcard.masteryLevel - 1) / 4) * 100;

  const handleExpand = () => {
    setExpanded(v => !v);
    setFlipped(false);
  };

  const handleMastery = useCallback(async (level: number) => {
    if (updating) return;
    setUpdating(true);
    try { await onUpdateMastery(flashcard.id, level); }
    finally { setUpdating(false); }
  }, [flashcard.id, onUpdateMastery, updating]);

  const handleDelete = useCallback(async () => {
    try { await onDelete(flashcard.id); }
    finally { setShowConfirm(false); }
  }, [flashcard.id, onDelete]);

  return (
    <>
      <li className="card-row" data-id={flashcard.id}>
        {/* Summary row */}
        <div className="card-summary">
          <span className="card-idx" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <div className={`m-dot ${m.cls}`} aria-hidden="true" />
          <div className="card-mid">
            <p className="card-q-text">{flashcard.question}</p>
            <div
              className="card-prog"
              role="progressbar"
              aria-valuenow={flashcard.masteryLevel}
              aria-valuemin={1}
              aria-valuemax={5}
              aria-label={`Domínio: ${m.label}`}
            >
              <div className={`card-prog-fill ${m.bar}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <span className="card-label" style={{ color: m.color }}>{m.label}</span>
          <div className="card-actions">
            <button
              className={`card-action-btn${expanded ? ' active' : ''}`}
              onClick={handleExpand}
              aria-expanded={expanded}
              aria-label={expanded ? 'Recolher card' : 'Expandir card'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                {expanded
                  ? <path d="M19 13H5v-2h14v2z"/>
                  : <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>}
              </svg>
            </button>
            <button
              className="card-action-btn del"
              onClick={() => setShowConfirm(true)}
              aria-label={`Remover flashcard: ${flashcard.question}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded */}
        {expanded && (
          <div className="card-expanded">
            {/* Flip card */}
            <div
              className="flip-wrap"
              onClick={() => setFlipped(f => !f)}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={flipped ? 'Mostrar pergunta' : 'Revelar resposta'}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(f => !f); } }}
            >
              <div className={`flip-inner${flipped ? ' flipped' : ''}`} style={{ minHeight: 90 }}>
                <div className="flip-face">
                  <p className="flip-face-label q">Pergunta</p>
                  <p className="flip-face-text">{flashcard.question}</p>
                </div>
                <div className="flip-face flip-back">
                  <p className="flip-face-label a">Resposta</p>
                  <p className="flip-face-text">{flashcard.answer}</p>
                </div>
              </div>
              <p className="flip-hint" aria-live="polite">
                {flipped ? 'Clique para ver a pergunta' : 'Clique para revelar a resposta'}
              </p>
            </div>

            {/* Mastery rating */}
            <div className="mastery-rating">
              <span className="mastery-rating-label" id={`mastery-lbl-${flashcard.id}`}>Domínio:</span>
              <div
                className="mastery-btns"
                role="group"
                aria-labelledby={`mastery-lbl-${flashcard.id}`}
              >
                {([1, 2, 3, 4, 5] as const).map(lv => (
                  <button
                    key={lv}
                    className={`mastery-btn ${flashcard.masteryLevel >= lv ? MM[lv]!.btn : ''}`}
                    onClick={() => handleMastery(lv)}
                    disabled={updating}
                    aria-label={`Avaliar domínio como ${masteryLabels[lv - 1]}`}
                    aria-pressed={flashcard.masteryLevel === lv}
                  >
                    {lv}
                  </button>
                ))}
              </div>
              <span className="mastery-current" aria-live="polite">
                {masteryLabels[flashcard.masteryLevel - 1]}
              </span>
            </div>
          </div>
        )}
      </li>

      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Remover Flashcard"
        message="Tem certeza que deseja remover este flashcard? Esta ação não pode ser desfeita."
      />
    </>
  );
};

export default FlashcardItem;
