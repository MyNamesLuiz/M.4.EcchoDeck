import React, { useState, useMemo, useCallback } from 'react';
import { useFlashcards } from './hooks/useFlashcards';
import { usePreferences } from './hooks/usePreferences';
import Sidebar from './components/Sidebar';
import DeckHeader from './components/DeckHeader';
import FlashcardList from './components/FlashcardList';
import FlashcardForm from './components/FlashcardForm';
import StudyMode from './components/StudyMode';
import ExplorePanel from './components/ExplorePanel';
import ConfigPanel from './components/ConfigPanel';

type Tab = 'flashcards' | 'explorar' | 'criar' | 'sobre' | 'config';

const masteryLegend = [
  { level: 1, color: 'var(--red)',  cls: '',   label: 'Não sei',   desc: 'Precisa revisar urgentemente' },
  { level: 2, color: 'var(--yel)',  cls: 'l2', label: 'Pouco',     desc: 'Lembrei vagamente' },
  { level: 3, color: 'var(--yel2)', cls: '',   label: 'Razoável',  desc: 'Lembrei com esforço' },
  { level: 4, color: 'var(--grn)', cls: '',    label: 'Bom',       desc: 'Lembrei com facilidade' },
  { level: 5, color: 'var(--ora)', cls: '',    label: 'Excelente', desc: 'Domínio completo' },
];

function App() {
  const { flashcards, loading, error, addFlashcard, updateMastery, removeFlashcard } = useFlashcards();
  const { user, saveUser, logout, studyPrefs, saveStudyPrefs, theme, toggleTheme, streak, recordActivity } = usePreferences();

  const [activeTab, setActiveTab]        = useState<Tab>('flashcards');
  const [isStudying, setIsStudying]      = useState(false);
  const [sidebarCollapsed, setCollapsed] = useState(() => window.innerWidth < 640);

  const masteryPct = useMemo(() =>
    flashcards.length > 0
      ? (flashcards.reduce((s, c) => s + c.masteryLevel, 0) / (flashcards.length * 5)) * 100
      : 0,
    [flashcards]
  );

  const avgMastery = useMemo(() =>
    flashcards.length > 0
      ? (flashcards.reduce((s, c) => s + c.masteryLevel, 0) / flashcards.length).toFixed(1)
      : '0.0',
    [flashcards]
  );

  const studiedCount = useMemo(
    () => flashcards.filter(c => c.masteryLevel > 1).length,
    [flashcards]
  );

  // Envolve updateMastery para registrar atividade no streak a cada avaliação
  const updateMasteryWithStreak = useCallback(async (id: string, level: number) => {
    await updateMastery(id, level);
    recordActivity();
  }, [updateMastery, recordActivity]);

  // Respeita o limite de cards por sessão (ordena por menor domínio)
  const sessionCards = useMemo(() => {
    const sorted = [...flashcards].sort((a, b) => a.masteryLevel - b.masteryLevel);
    return studyPrefs.cardsPerSession > 0 ? sorted.slice(0, studyPrefs.cardsPerSession) : flashcards;
  }, [flashcards, studyPrefs.cardsPerSession]);

  if (isStudying && flashcards.length > 0) {
    return (
      <StudyMode
        flashcards={sessionCards}
        onUpdateMastery={updateMasteryWithStreak}
        onExit={() => setIsStudying(false)}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setCollapsed(v => !v)}
        cardCount={flashcards.length}
        studiedCount={studiedCount}
        avgMastery={avgMastery}
        masteryPct={masteryPct}
        activeNav={activeTab}
        onNavChange={setActiveTab}
        user={user}
        streak={streak}
      />

      <main className="main">
        <DeckHeader
          cardCount={flashcards.length}
          studiedCount={studiedCount}
          masteryPercentage={masteryPct}
          avgMastery={avgMastery}
          onStudy={() => setIsStudying(true)}
        />

        {/* Tab bar */}
        <nav className="tab-bar" aria-label="Abas de conteúdo">
          {([
            { id: 'flashcards' as Tab, label: `Flashcards (${flashcards.length})` },
            { id: 'explorar'   as Tab, label: 'Explorar' },
            { id: 'criar'      as Tab, label: 'Criar Novo' },
            { id: 'sobre'      as Tab, label: 'Sobre' },
          ]).map(({ id, label }) => (
            <button
              key={id}
              className={`tab${activeTab === id ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="content">
          {error && (
            <div className="error-banner" role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              Carregando flashcards...
            </div>
          ) : activeTab === 'flashcards' ? (
            <FlashcardList
              flashcards={flashcards}
              onUpdateMastery={updateMasteryWithStreak}
              onDelete={removeFlashcard}
              defaultSort={studyPrefs.defaultSort}
            />
          ) : activeTab === 'explorar' ? (
            <ExplorePanel
              flashcards={flashcards}
              onUpdateMastery={updateMasteryWithStreak}
              onDelete={removeFlashcard}
            />
          ) : activeTab === 'criar' ? (
            <FlashcardForm onSubmit={addFlashcard} />
          ) : activeTab === 'config' ? (
            <ConfigPanel
              user={user}
              onSaveUser={saveUser}
              onLogout={logout}
              studyPrefs={studyPrefs}
              onSavePrefs={saveStudyPrefs}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          ) : (
            /* Sobre */
            <article className="about-panel" aria-label="Sobre o Eccho Deck">
              <div className="about-header">
                <div className="about-icon" aria-hidden="true">ED</div>
                <div>
                  <h2 className="about-title">Eccho Deck</h2>
                  <p className="about-subtitle">Repetição Espaçada Inteligente</p>
                </div>
              </div>
              <p className="about-desc">
                O <b>Eccho Deck</b> usa o método de repetição espaçada para ajudá-lo a memorizar
                conteúdo de forma eficiente. Avalie seu nível de domínio em cada card de 1 a 5
                para que o sistema registre seu progresso.
              </p>
              <ul className="about-legend" aria-label="Legenda dos níveis de domínio">
                {masteryLegend.map(({ level, color, cls, label, desc }) => (
                  <li key={level} className="about-legend-item">
                    <div
                      className={`about-legend-dot${cls ? ' ' + cls : ''}`}
                      style={{ background: color }}
                      aria-hidden="true"
                    >
                      {level}
                    </div>
                    <div>
                      <p className="about-legend-name">{label}</p>
                      <p className="about-legend-desc">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
