import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/finance';
import EmptyState from './EmptyState';

const iconFor = (tx) => tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />;

export default function TransactionList({ transactions, compact = false }) {
  const { settings, openTransaction, deleteTransaction } = useApp();
  if (!transactions.length) return <EmptyState title="No transactions" message="Add an income or expense to start tracking your finances." action={<button className="button button-primary" onClick={() => openTransaction('expense')}>Add Transaction</button>} />;
  return <div className={`transaction-list ${compact ? 'compact' : ''}`}>{transactions.map((tx) => (
    <article className="transaction-item" key={tx.id}>
      <div className={`transaction-icon ${tx.type}`} aria-hidden="true">{iconFor(tx)}</div>
      <div className="transaction-main"><div className="transaction-title-row"><h4>{tx.title}</h4><span className={`type-pill ${tx.type}`}>{tx.type}</span></div><p>{tx.category} • {formatDate(tx.date)}{tx.paymentMethod ? ` • ${tx.paymentMethod}` : ''}</p>{!compact && tx.note && <small>{tx.note}</small>}</div>
      <div className={`transaction-amount ${tx.type}`}>{tx.type === 'expense' ? '−' : '+'}{formatCurrency(tx.amount, settings.currency, settings.compactNumbers)}</div>
      <div className="row-actions"><button className="icon-button" onClick={() => openTransaction(tx.type, tx)} aria-label={`Edit ${tx.title}`}><Pencil size={16} /></button><button className="icon-button danger-icon" onClick={() => deleteTransaction(tx.id)} aria-label={`Delete ${tx.title}`}><Trash2 size={16} /></button></div>
    </article>
  ))}</div>;
}
