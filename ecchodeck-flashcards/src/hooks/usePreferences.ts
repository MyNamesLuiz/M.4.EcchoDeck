import { useState, useEffect, useCallback } from 'react';
import { UserProfile, StudyPreferences, Theme } from '../types';

const computeInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const DEFAULT_PREFS: StudyPreferences = {
  defaultSort: 'recent',
  cardsPerSession: 0,
};

/** Retorna a data local no formato YYYY-MM-DD */
const toDateStr = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** Carrega o Set de datas com atividade do localStorage */
const loadActivityDates = (): Set<string> => {
  try {
    const raw = localStorage.getItem('eccho_activity');
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
};

/** Persiste o Set de datas */
const saveActivityDates = (dates: Set<string>): void => {
  localStorage.setItem('eccho_activity', JSON.stringify([...dates]));
};

/** Calcula o streak atual a partir do conjunto de datas com atividade */
const calcStreak = (dates: Set<string>): number => {
  if (dates.size === 0) return 0;
  const today = toDateStr(new Date());
  const yesterday = toDateStr(new Date(Date.now() - 86_400_000));

  // Se não houve atividade hoje nem ontem, streak quebrado
  if (!dates.has(today) && !dates.has(yesterday)) return 0;

  // Conta dias consecutivos para trás a partir de hoje
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const d = toDateStr(cursor);
    if (!dates.has(d)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const usePreferences = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('eccho_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [studyPrefs, setStudyPrefs] = useState<StudyPreferences>(() => {
    try {
      const stored = localStorage.getItem('eccho_prefs');
      return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS;
    } catch { return DEFAULT_PREFS; }
  });

  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('eccho_theme') as Theme) || 'dark'
  );

  const [activityDates, setActivityDates] = useState<Set<string>>(loadActivityDates);
  const [streak, setStreak] = useState<number>(() => calcStreak(loadActivityDates()));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eccho_theme', theme);
  }, [theme]);

  /** Chama quando o usuário faz qualquer avaliação de card */
  const recordActivity = useCallback(() => {
    const today = toDateStr(new Date());
    setActivityDates(prev => {
      if (prev.has(today)) return prev; // já registrado hoje, não recalcula
      const next = new Set(prev);
      next.add(today);
      saveActivityDates(next);
      setStreak(calcStreak(next));
      return next;
    });
  }, []);

  const saveUser = useCallback((name: string) => {
    const profile: UserProfile = { name: name.trim(), initials: computeInitials(name) };
    setUser(profile);
    localStorage.setItem('eccho_user', JSON.stringify(profile));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('eccho_user');
  }, []);

  const saveStudyPrefs = useCallback((prefs: StudyPreferences) => {
    setStudyPrefs(prefs);
    localStorage.setItem('eccho_prefs', JSON.stringify(prefs));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    user, saveUser, logout,
    studyPrefs, saveStudyPrefs,
    theme, toggleTheme,
    streak, recordActivity,
  };
};
