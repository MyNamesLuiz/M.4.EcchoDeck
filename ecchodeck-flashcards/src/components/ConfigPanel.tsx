import React, { useState, useCallback } from 'react';
import { UserProfile, StudyPreferences, Theme } from '../types';

interface ConfigPanelProps {
  user: UserProfile | null;
  onSaveUser: (name: string) => void;
  onLogout: () => void;
  studyPrefs: StudyPreferences;
  onSavePrefs: (prefs: StudyPreferences) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const SORT_OPTIONS: { value: StudyPreferences['defaultSort']; label: string }[] = [
  { value: 'recent',      label: 'Mais recentes' },
  { value: 'mastery_asc', label: 'Menor domínio' },
  { value: 'random',      label: 'Aleatório' },
];

const SESSION_OPTIONS: { value: number; label: string }[] = [
  { value: 0,  label: 'Todos' },
  { value: 5,  label: '5'  },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
];

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  user, onSaveUser, onLogout,
  studyPrefs, onSavePrefs,
  theme, onToggleTheme,
}) => {
  const [authMode, setAuthMode]   = useState<'idle' | 'criar' | 'entrar'>('idle');
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');
  const [editing, setEditing]     = useState(false);
  const [editName, setEditName]   = useState('');

  const handleAuth = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) { setNameError('Insira um nome para continuar.'); return; }
    onSaveUser(nameInput.trim());
    setNameInput('');
    setNameError('');
    setAuthMode('idle');
  }, [nameInput, onSaveUser]);

  const handleEditSave = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    onSaveUser(editName.trim());
    setEditing(false);
  }, [editName, onSaveUser]);

  const handleLogout = useCallback(() => {
    onLogout();
    setEditing(false);
    setAuthMode('idle');
  }, [onLogout]);

  return (
    <article className="config-panel" aria-label="Configurações">

      {/* ── Conta ── */}
      <section className="config-section" aria-labelledby="cfg-account-title">
        <h2 className="config-section-title" id="cfg-account-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Conta
        </h2>

        {user ? (
          /* Usuário logado */
          editing ? (
            <form className="config-auth-form" onSubmit={handleEditSave} noValidate aria-label="Editar nome">
              <label className="config-label" htmlFor="edit-name">Nome</label>
              <input
                id="edit-name"
                type="text"
                className="config-input"
                value={editName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                placeholder="Seu nome"
                autoFocus
              />
              <div className="config-auth-actions">
                <button type="button" className="config-btn-ghost" onClick={() => setEditing(false)}>Cancelar</button>
                <button type="submit" className="config-btn-primary">Salvar</button>
              </div>
            </form>
          ) : (
            <div className="config-user-row">
              <div className="config-user-av">{user.initials}</div>
              <div className="config-user-info">
                <p className="config-user-name">{user.name}</p>
                <p className="config-user-sub">Conta local</p>
              </div>
              <div className="config-user-actions">
                <button
                  className="config-btn-ghost"
                  onClick={() => { setEditName(user.name); setEditing(true); }}
                  aria-label="Editar nome"
                >
                  Editar
                </button>
                <button className="config-btn-danger" onClick={handleLogout} aria-label="Sair da conta">
                  Sair
                </button>
              </div>
            </div>
          )
        ) : (
          /* Sem usuário */
          authMode === 'idle' ? (
            <div className="config-guest">
              <p className="config-guest-msg">
                Olá, <strong>Desconhecido</strong>. Crie uma conta ou entre para personalizar sua experiência.
              </p>
              <div className="config-guest-btns">
                <button
                  className="config-btn-primary"
                  onClick={() => setAuthMode('criar')}
                  aria-label="Criar uma conta"
                >
                  Criar conta
                </button>
                <button
                  className="config-btn-ghost"
                  onClick={() => setAuthMode('entrar')}
                  aria-label="Entrar com nome existente"
                >
                  Entrar
                </button>
              </div>
            </div>
          ) : (
            <form className="config-auth-form" onSubmit={handleAuth} noValidate
              aria-label={authMode === 'criar' ? 'Criar conta' : 'Entrar'}
            >
              <p className="config-auth-title">
                {authMode === 'criar' ? 'Como você quer ser chamado?' : 'Qual é o seu nome?'}
              </p>
              <label className="config-label" htmlFor="auth-name">Nome</label>
              <input
                id="auth-name"
                type="text"
                className={`config-input${nameError ? ' error' : ''}`}
                value={nameInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNameInput(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder="Ex: João Silva"
                autoFocus
              />
              {nameError && <p className="config-input-error" role="alert">{nameError}</p>}
              <div className="config-auth-actions">
                <button type="button" className="config-btn-ghost" onClick={() => { setAuthMode('idle'); setNameInput(''); setNameError(''); }}>
                  Cancelar
                </button>
                <button type="submit" className="config-btn-primary">
                  {authMode === 'criar' ? 'Criar' : 'Entrar'}
                </button>
              </div>
            </form>
          )
        )}
      </section>

      {/* ── Preferências de estudo ── */}
      <section className="config-section" aria-labelledby="cfg-prefs-title">
        <h2 className="config-section-title" id="cfg-prefs-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Preferências de estudo
        </h2>

        <div className="config-field">
          <label className="config-label" id="sort-label">Ordenação padrão dos cards</label>
          <div className="config-pills" role="group" aria-labelledby="sort-label">
            {SORT_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                className={`config-pill${studyPrefs.defaultSort === value ? ' active' : ''}`}
                onClick={() => onSavePrefs({ ...studyPrefs, defaultSort: value })}
                aria-pressed={studyPrefs.defaultSort === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="config-field">
          <label className="config-label" id="session-label">Cards por sessão de estudo</label>
          <div className="config-pills" role="group" aria-labelledby="session-label">
            {SESSION_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                className={`config-pill${studyPrefs.cardsPerSession === value ? ' active' : ''}`}
                onClick={() => onSavePrefs({ ...studyPrefs, cardsPerSession: value })}
                aria-pressed={studyPrefs.cardsPerSession === value}
              >
                {label}
              </button>
            ))}
          </div>
          {studyPrefs.cardsPerSession > 0 && (
            <p className="config-hint">
              A sessão mostrará os {studyPrefs.cardsPerSession} cards com menor domínio primeiro.
            </p>
          )}
        </div>
      </section>

      {/* ── Tema ── */}
      <section className="config-section" aria-labelledby="cfg-theme-title">
        <h2 className="config-section-title" id="cfg-theme-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          Tema visual
        </h2>

        <div className="config-theme-toggle">
          <div className="config-theme-labels">
            <p className="config-theme-current">
              {theme === 'dark' ? 'Modo escuro' : 'Modo claro'} ativo
            </p>
            <p className="config-hint">Alterna entre fundo escuro e claro</p>
          </div>
          <button
            className={`theme-toggle-btn${theme === 'light' ? ' light' : ''}`}
            onClick={onToggleTheme}
            aria-label={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
            aria-pressed={theme === 'light'}
          >
            <span className="theme-toggle-thumb" />
          </button>
        </div>
      </section>

    </article>
  );
};

export default ConfigPanel;
