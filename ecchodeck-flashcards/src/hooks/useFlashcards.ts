import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { Flashcard, FlashcardInput } from '../types';

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    return 'Não foi possível conectar à API. Verifique se o servidor está rodando na porta 3001.';
  }
  return err instanceof Error ? err.message : fallback;
};

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFlashcards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchFlashcards();
      setFlashcards(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao carregar flashcards'));
    } finally {
      setLoading(false);
    }
  }, []);

  const addFlashcard = useCallback(async (data: FlashcardInput) => {
    setError(null);
    try {
      const newCard = await api.createFlashcard(data);
      setFlashcards(prev => [...prev, newCard]);
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao criar flashcard'));
      throw err;
    }
  }, []);

  const updateMastery = useCallback(async (id: string, newLevel: number) => {
    setError(null);
    try {
      const updated = await api.updateFlashcard(id, { masteryLevel: newLevel });
      setFlashcards(prev =>
        prev.map(card => (card.id === id ? updated : card))
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao atualizar domínio'));
    }
  }, []);

  const removeFlashcard = useCallback(async (id: string) => {
    setError(null);
    try {
      await api.deleteFlashcard(id);
      setFlashcards(prev => prev.filter(card => card.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao remover flashcard'));
    }
  }, []);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  return {
    flashcards,
    loading,
    error,
    addFlashcard,
    updateMastery,
    removeFlashcard,
  };
};
