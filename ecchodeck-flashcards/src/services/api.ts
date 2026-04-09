import { Flashcard, FlashcardInput } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/flashcards';

export const fetchFlashcards = async (): Promise<Flashcard[]> => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`Erro ao buscar flashcards: ${response.statusText}`);
  }
  return response.json();
};

export const createFlashcard = async (data: FlashcardInput): Promise<Flashcard> => {
  const newCard = {
    ...data,
    masteryLevel: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCard),
  });
  if (!response.ok) {
    throw new Error(`Erro ao criar flashcard: ${response.statusText}`);
  }
  return response.json();
};

export const updateFlashcard = async (
  id: string,
  updates: Partial<Flashcard>
): Promise<Flashcard> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...updates, updatedAt: new Date().toISOString() }),
  });
  if (!response.ok) {
    throw new Error(`Erro ao atualizar flashcard: ${response.statusText}`);
  }
  return response.json();
};

export const deleteFlashcard = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Erro ao deletar flashcard: ${response.statusText}`);
  }
};
