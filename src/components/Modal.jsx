import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, children, onClose, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-open');
    return () => { document.removeEventListener('keydown', onKey); document.body.classList.remove('modal-open'); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header"><div><span className="eyebrow">Expense Tracker</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button></header>
        {children}
      </section>
    </div>
  );
}
