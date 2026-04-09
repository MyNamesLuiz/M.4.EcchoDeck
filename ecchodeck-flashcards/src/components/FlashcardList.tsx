import React, { useState, useMemo } from 'react';
import { Flashcard } from '../types';
import FlashcardItem from './FlashcardItem';

interface FlashcardListProps {
  flashcards: Flashcard[];
  onUpdateMastery: (id: string, level: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  defaultSort?: SortMode;
}

type SortMode = 'recent' | 'mastery_asc' | 'random';

const FlashcardList: React.FC<FlashcardListProps> = ({
  flashcards, onUpdateMastery, onDelete, defaultSort = 'recent',
}) => {
  const [sortMode, setSortMode] = useState<SortMode>(defaultSort);

  const sorted = useMemo(() => {
    const copy = [...flashcards];
    if (sortMode === 'mastery_asc') return copy.sort((a, b) => a.masteryLevel - b.masteryLevel);
    if (sortMode === 'random')      return copy.sort(() => Math.random() - 0.5);
    return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [flashcards, sortMode]);

  const avg = useMemo(
    () => flashcards.length > 0
      ? (flashcards.reduce((s, c) => s + c.masteryLevel, 0) / flashcards.length).toFixed(1)
      : '0.0',
    [flashcards]
  );

  if (flashcards.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🗂</div>
        <h3>Nenhum flashcard ainda</h3>
        <p>Crie seu primeiro card na aba <span>Criar Novo</span></p>
      </div>
    );
  }

  return (
    <section aria-label="Lista de flashcards">
      <div className="list-controls">
        <p className="list-meta">
          <b>{flashcards.length}</b> cards · domínio médio <b>{avg}/5</b>
        </p>
        <div className="sort-pills" role="group" aria-label="Ordenação dos cards">
          {(['recent', 'mastery_asc', 'random'] as SortMode[]).map(mode => (
            <button
              key={mode}
              className={`sort-pill${sortMode === mode ? ' active' : ''}`}
              onClick={() => setSortMode(mode)}
              aria-pressed={sortMode === mode}
            >
              {mode === 'recent' ? 'Recentes' : mode === 'mastery_asc' ? 'Domínio' : 'Embaralhar'}
            </button>
          ))}
        </div>
      </div>

      <ul className="cards-list" aria-label="Flashcards">
        {sorted.map((card, idx) => (
          <FlashcardItem
            key={card.id}
            flashcard={card}
            index={idx}
            onUpdateMastery={onUpdateMastery}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
};

export default FlashcardList;
