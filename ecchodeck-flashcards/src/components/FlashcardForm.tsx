import React, { useState } from 'react';
import { FlashcardInput } from '../types';

interface FlashcardFormProps {
  onSubmit: (data: FlashcardInput) => Promise<void>;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ onSubmit }) => {
  const [question, setQuestion]     = useState('');
  const [answer, setAnswer]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback]     = useState<{ msg: string; type: 'err' | 'ok' } | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setFeedback({ msg: 'Pergunta e resposta são obrigatórias', type: 'err' });
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      await onSubmit({ question: question.trim(), answer: answer.trim() });
      setQuestion(''); setAnswer('');
      setFeedback({ msg: 'Flashcard criado com sucesso!', type: 'ok' });
      setTimeout(() => setFeedback(null), 2800);
    } catch {
      setFeedback({ msg: 'Falha ao criar flashcard. Tente novamente.', type: 'err' });
    } finally {
      setSubmitting(false);
    }
  };

  const checkIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );
  const warnIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  );

  return (
    <form className="form-panel" onSubmit={handleSubmit} noValidate aria-label="Criar novo flashcard">
      <div className="form-panel-header">
        <span className="form-panel-dot" />
        <div>
          <h2>Novo Flashcard</h2>
          <p>Preencha a pergunta e a resposta abaixo</p>
        </div>
      </div>

      <div className="form-body">
        {feedback && (
          <div className={`form-feedback ${feedback.type}`}>
            {feedback.type === 'ok' ? checkIcon : warnIcon}
            {feedback.msg}
          </div>
        )}

        <div className="form-field">
          <label htmlFor="fq">Pergunta</label>
          <textarea
            id="fq" className="form-ta" rows={3}
            placeholder="O que você quer memorizar? Ex: O que é repetição espaçada?"
            value={question} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-field">
          <label htmlFor="fa">Resposta</label>
          <textarea
            id="fa" className="form-ta" rows={3}
            placeholder="A resposta correta ou explicação..."
            value={answer} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button type="submit" className="form-submit" disabled={submitting}>
          {submitting
            ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Criando...</>
            : '+ Criar Flashcard'}
        </button>
      </div>
    </form>
  );
};

export default FlashcardForm;
