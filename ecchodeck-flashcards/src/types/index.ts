export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  masteryLevel: number; // 1 a 5, onde 5 é domínio completo
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardInput {
  question: string;
  answer: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface UserProfile {
  name: string;
  initials: string;
}

export interface StudyPreferences {
  defaultSort: 'recent' | 'mastery_asc' | 'random';
  cardsPerSession: number; // 0 = todos
}

export type Theme = 'dark' | 'light';
