import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ToastStack() {
  const { toasts } = useApp();
  return <div className="toast-stack" aria-live="polite">{toasts.map((toast) => (
    <div className={`toast toast-${toast.tone}`} key={toast.id}>
      {toast.tone === 'warning' ? <AlertTriangle size={18} /> : toast.tone === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}
      <span>{toast.message}</span>
    </div>
  ))}</div>;
}

export function ConfirmDialog() {
  const { confirmState, closeConfirm } = useApp();
  if (!confirmState) return null;
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className={`confirm-icon ${confirmState.danger ? 'danger-soft' : ''}`}>{confirmState.danger ? <Trash2 size={22} /> : <AlertTriangle size={22} />}</div>
        <h3 id="confirm-title">{confirmState.title}</h3>
        <p>{confirmState.message}</p>
        <div className="confirm-actions"><button className="button button-ghost" onClick={() => closeConfirm(false)}>Cancel</button><button className={confirmState.danger ? 'button button-danger' : 'button button-primary'} onClick={() => closeConfirm(true)}>{confirmState.confirmText || 'Confirm'}</button></div>
      </section>
    </div>
  );
}
