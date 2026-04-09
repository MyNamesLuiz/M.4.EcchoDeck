import React, { useState, useMemo, useCallback } from 'react';
import { Flashcard } from '../types';
import FlashcardItem from './FlashcardItem';

interface ExplorePanelProps {
  flashcards: Flashcard[];
  onUpdateMastery: (id: string, level: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const MASTERY_LABELS: Record<number, string> = {
  1: 'Não sei',
  2: 'Pouco',
  3: 'Razoável',
  4: 'Bom',
  5: 'Excelente',
};

const MASTERY_COLORS: Record<number, string> = {
  1: 'var(--red)',
  2: 'var(--yel)',
  3: 'var(--yel2)',
  4: 'var(--grn)',
  5: 'var(--ora)',
};

const ExplorePanel: React.FC<ExplorePanelProps> = ({
  flashcards, onUpdateMastery, onDelete,
}) => {
  const [query, setQuery]               = useState('');
  const [selectedLevels, setSelected]  = useState<Set<number>>(new Set());

  const toggleLevel = useCallback((level: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setQuery('');
    setSelected(new Set());
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flashcards.filter(card => {
      const matchQuery = q === '' ||
        card.question.toLowerCase().includes(q) ||
        card.answer.toLowerCase().includes(q);
      const matchLevel = selectedLevels.size === 0 ||
        selectedLevels.has(card.masteryLevel);
      return matchQuery && matchLevel;
    });
  }, [flashcards, query, selectedLevels]);

  const hasFilters = query.trim() !== '' || selectedLevels.size > 0;

  return (
    <section aria-label="Explorar flashcards">

      {/* Barra de busca + filtro */}
      <div className="explore-controls">

        {/* Busca */}
        <div className="explore-search-wrap">
          <svg
            className="explore-search-icon"
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            id="explore-search"
            type="search"
            className="explore-search"
            placeholder="Buscar por palavra-chave..."
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            aria-label="Buscar flashcards por palavra-chave"
          />
          {query && (
            <button
              className="explore-search-clear"
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filtro por domínio */}
        <div
          className="explore-filter"
          role="group"
          aria-label="Filtrar por nível de domínio"
        >
          {([1, 2, 3, 4, 5] as const).map(level => (
            <button
              key={level}
              className={`explore-filter-btn${selectedLevels.has(level) ? ' active' : ''}`}
              style={selectedLevels.has(level)
                ? { background: MASTERY_COLORS[level], borderColor: MASTERY_COLORS[level], color: level === 2 ? '#111' : '#fff' }
                : { borderColor: MASTERY_COLORS[level], color: MASTERY_COLORS[level] }
              }
              onClick={() => toggleLevel(level)}
              aria-pressed={selectedLevels.has(level)}
              aria-label={`Filtrar por domínio ${level} — ${MASTERY_LABELS[level]}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Meta de resultados + limpar */}
      <div className="explore-meta">
        <p className="list-meta">
          {hasFilters
            ? <><b>{results.length}</b> de <b>{flashcards.length}</b> cards encontrados</>
            : <><b>{flashcards.length}</b> cards no deck</>
          }
        </p>
        {hasFilters && (
          <button className="explore-clear-all" onClick={clearAll} aria-label="Limpar todos os filtros">
            Limpar filtros
          </button>
        )}
      </div>

      {/* Resultados */}
      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Nenhum card encontrado</h3>
          <p>Tente outros termos ou ajuste os filtros de domínio</p>
        </div>
      ) : (
        <ul className="cards-list" aria-label="Resultados da busca">
          {results.map((card, idx) => (
            <FlashcardItem
              key={card.id}
              flashcard={card}
              index={idx}
              onUpdateMastery={onUpdateMastery}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default ExplorePanel;
