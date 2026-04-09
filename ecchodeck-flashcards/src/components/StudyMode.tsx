import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard } from '../types';

interface StudyModeProps {
  flashcards: Flashcard[];
  onUpdateMastery: (id: string, level: number) => Promise<void>;
  onExit: () => void;
}

const confidenceOptions = [
  { level: 1, label: 'Não sei',   cls: 'c1' },
  { level: 2, label: 'Pouco',     cls: 'c2' },
  { level: 3, label: 'Razoável',  cls: 'c3' },
  { level: 4, label: 'Bom',       cls: 'c4' },
  { level: 5, label: 'Excelente', cls: 'c5' },
] as const;

const StudyMode: React.FC<StudyModeProps> = ({ flashcards, onUpdateMastery, onExit }) => {
  const [index, setIndex]           = useState(0);
  const [flipped, setFlipped]       = useState(false);
  const [animating, setAnimating]   = useState(false);
  const [studiedCount, setStudied]  = useState(0);

  const isComplete = index >= flashcards.length;
  const current    = flashcards[index];
  const progress   = flashcards.length > 0 ? (index / flashcards.length) * 100 : 0;

  const flip = useCallback(() => {
    if (!animating && !isComplete) setFlipped(f => !f);
  }, [animating, isComplete]);

  const handleRating = useCallback(async (level: number) => {
    if (!current || animating) return;
    await onUpdateMastery(current.id, level);
    setStudied(c => c + 1);
    setAnimating(true);
    setFlipped(false);
    setTimeout(() => { setIndex(i => i + 1); setAnimating(false); }, 320);
  }, [current, animating, onUpdateMastery]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); flip(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flip]);

  return (
    <main className="study-overlay" aria-label="Modo de estudo">
      <header className="study-topbar" aria-label="Progresso da sessão">
        <button className="study-exit" onClick={onExit}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Sair
        </button>

        <div className="study-progress">
          <span className="study-count">
            {Math.min(index + 1, flashcards.length)} / {flashcards.length}
          </span>
          <div className="study-bar-wrap">
            <div className="study-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <span className="study-done-count" aria-live="polite">{studiedCount} estudados</span>
      </header>

      <section className="study-body" id="studyBody" aria-live="polite" aria-atomic="false">
        {isComplete ? (
          <section className="study-complete" aria-labelledby="complete-title">
            <div className="complete-icon" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--ora)">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h2 className="complete-title" id="complete-title">Sessão concluída!</h2>
            <p className="complete-sub">{studiedCount} cards estudados nesta sessão</p>
            <button className="btn-ora" style={{ margin: 'auto' }} onClick={onExit}>
              Voltar ao Deck
            </button>
          </section>
        ) : (
          <>
            {/* Flip card */}
            <div
              className="study-card-wrap"
              onClick={flip}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={flipped ? 'Mostrar pergunta' : 'Revelar resposta'}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } }}
            >
              <div className={`study-card-inner${flipped ? ' flipped' : ''}`}>
                <div className="study-face">
                  <p className="study-face-tag q">Pergunta</p>
                  <p className="study-face-text">{current?.question}</p>
                  <p className="study-face-hint">
                    Clique ou pressione <kbd>Espaço</kbd> para revelar
                  </p>
                </div>
                <div className="study-face study-face-back">
                  <p className="study-face-tag a">Resposta</p>
                  <p className="study-face-text">{current?.answer}</p>
                  <p className="study-face-hint">Clique para voltar à pergunta</p>
                </div>
              </div>
            </div>

            {/* Confidence rating */}
            <div className={`study-rating${flipped ? '' : ' hidden'}`}>
              <p className="study-rating-label" id="conf-label">Como foi seu desempenho?</p>
              <div
                className="study-rating-btns"
                role="group"
                aria-labelledby="conf-label"
              >
                {confidenceOptions.map(({ level, label, cls }) => (
                  <button
                    key={level}
                    className={`conf-btn ${cls}`}
                    onClick={() => handleRating(level)}
                    disabled={animating}
                    aria-label={`${level} – ${label}`}
                  >
                    {level} – {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default StudyMode;
