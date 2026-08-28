import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { validateTransaction } from '../utils/validation';

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function TransactionForm() {
  const { transactionModal, categories, paymentMethods, saveTransaction, closeTransaction } = useApp();
  const editing = transactionModal.editing;
  const [form, setForm] = useState({ type: transactionModal.initialType, amount: '', category: '', date: today(), title: '', note: '', paymentMethod: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const typeCategories = useMemo(() => categories[form.type] || [], [categories, form.type]);

  useEffect(() => {
    if (editing) setForm({ ...editing, amount: String(editing.amount ?? '') });
    else setForm({ type: transactionModal.initialType, amount: '', category: '', date: today(), title: '', note: '', paymentMethod: '' });
    setErrors({});
  }, [editing, transactionModal.initialType, transactionModal.open]);

  useEffect(() => {
    if (!typeCategories.includes(form.category)) setForm((prev) => ({ ...prev, category: typeCategories[0] || '' }));
  }, [form.category, typeCategories]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (e) => {
    e.preventDefault();
    if (saving) return;
    const nextErrors = validateTransaction(form, typeCategories);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    saveTransaction({ ...form, id: editing?.id });
    window.setTimeout(() => setSaving(false), 250);
  };

  return <form onSubmit={submit} className="form-stack">
    <div className="type-toggle" role="group" aria-label="Transaction type">
      <button type="button" className={form.type === 'expense' ? 'active expense-choice' : ''} onClick={() => set('type', 'expense')}><ArrowUpRight size={17} /> Expense</button>
      <button type="button" className={form.type === 'income' ? 'active income-choice' : ''} onClick={() => set('type', 'income')}><ArrowDownLeft size={17} /> Income</button>
    </div>
    <div className="form-grid">
      <label className="field"><span>Amount</span><input inputMode="decimal" type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="0.00" />{errors.amount && <small className="field-error">{errors.amount}</small>}</label>
      <label className="field"><span>Date</span><input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />{errors.date && <small className="field-error">{errors.date}</small>}</label>
      <label className="field field-span"><span>Title / Description</span><input maxLength="80" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Grocery shopping" />{errors.title && <small className="field-error">{errors.title}</small>}</label>
      <label className="field"><span>Category</span><select value={form.category} onChange={(e) => set('category', e.target.value)}>{typeCategories.map((c) => <option key={c}>{c}</option>)}</select>{errors.category && <small className="field-error">{errors.category}</small>}</label>
      <label className="field"><span>Payment Method <em>Optional</em></span><select value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)}><option value="">Not specified</option>{paymentMethods.map((p) => <option key={p}>{p}</option>)}</select></label>
      <label className="field field-span"><span>Note <em>Optional</em></span><textarea rows="3" value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Add a short note..." /></label>
    </div>
    <div className="modal-actions"><button type="button" className="button button-ghost" onClick={closeTransaction}>Cancel</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? <Loader2 className="spin" size={17} /> : null}{editing ? 'Save Changes' : 'Save Transaction'}</button></div>
  </form>;
}
