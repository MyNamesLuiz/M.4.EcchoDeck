import React, { useEffect, useRef } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen, onClose, onConfirm, title, message,
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) confirmRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-box">
        <div className="modal-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          </svg>
        </div>
        <div className="modal-title" id="modal-title">{title}</div>
        <div className="modal-msg">{message}</div>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-confirm" ref={confirmRef} onClick={onConfirm}>Remover</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
