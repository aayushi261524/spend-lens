import React, { useMemo, useRef, useState } from 'react';
import { Download, FilterX, Search, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportCSV, parseCSV } from '../utils/exportUtils';
import { sortedTransactions } from '../utils/finance';
import TransactionList from '../components/TransactionList';

export default function TransactionsPage() {
  const { transactions, setTransactions, categories, paymentMethods, notify } = useApp();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [method, setMethod] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [sort, setSort] = useState('newest');
  const fileRef = useRef(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const data = transactions.filter((tx) => {
      const matchesQ = !q || [tx.title, tx.category, tx.note, tx.paymentMethod].some((v) => String(v || '').toLowerCase().includes(q));
      const matchesType = type === 'all' || tx.type === type;
      const matchesCategory = category === 'all' || tx.category === category;
      const matchesMethod = method === 'all' || tx.paymentMethod === method;
      const matchesFrom = !from || tx.date >= from;
      const matchesTo = !to || tx.date <= to;
      return matchesQ && matchesType && matchesCategory && matchesMethod && matchesFrom && matchesTo;
    });
    return sortedTransactions(data, sort);
  }, [transactions, search, type, category, method, from, to, sort]);

  const clear = () => { setSearch(''); setType('all'); setCategory('all'); setMethod('all'); setFrom(''); setTo(''); setSort('newest'); };
  const allCategories = [...new Set([...categories.income, ...categories.expense])].sort();

  const importCsv = async (file) => {
    if (!file) return;
    try {
      const rows = parseCSV(await file.text());
      const now = new Date().toISOString();
      const imported = rows.map((row, index) => ({
        id: `csv-${Date.now()}-${index}`,
        date: row.date,
        type: String(row.type || '').toLowerCase(),
        title: row.title || 'Imported transaction',
        category: row.category || 'Other',
        amount: Number(row.amount),
        paymentMethod: row['payment method'] || '',
        note: row.note || '',
        createdAt: now,
        updatedAt: now,
      })).filter((tx) => /^\d{4}-\d{2}-\d{2}$/.test(tx.date) && ['income', 'expense'].includes(tx.type) && Number.isFinite(tx.amount) && tx.amount > 0);
      if (!imported.length) throw new Error('No valid rows found.');
      setTransactions((prev) => [...imported, ...prev]);
      notify(`${imported.length} transaction${imported.length > 1 ? 's' : ''} imported`);
    } catch (err) { notify(err.message || 'CSV import failed', 'warning'); }
    if (fileRef.current) fileRef.current.value = '';
  };

  return <div className="page-stack">
    <section className="page-heading"><div><span className="eyebrow">Transaction history</span><h2>All Transactions</h2><p>Search, filter, sort, edit, delete, export, or restore compatible CSV data.</p></div><div className="page-actions"><input ref={fileRef} className="hidden-input" type="file" accept=".csv,text/csv" onChange={(e) => importCsv(e.target.files?.[0])} /><button className="button button-ghost" onClick={() => fileRef.current?.click()}><Upload size={17} /> Import CSV</button><button className="button button-secondary" onClick={() => exportCSV(filtered)}><Download size={17} /> Export CSV</button></div></section>

    <section className="panel filters-panel"><div className="search-field"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, category, note, payment method..." /></div><div className="filter-grid"><label><span>Type</span><select value={type} onChange={(e) => setType(e.target.value)}><option value="all">All Types</option><option value="income">Income</option><option value="expense">Expense</option></select></label><label><span>Category</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All Categories</option>{allCategories.map((c) => <option key={c}>{c}</option>)}</select></label><label><span>Payment</span><select value={method} onChange={(e) => setMethod(e.target.value)}><option value="all">All Methods</option>{paymentMethods.map((p) => <option key={p}>{p}</option>)}</select></label><label><span>Sort</span><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest">Highest Amount</option><option value="lowest">Lowest Amount</option><option value="category">Category A-Z</option></select></label><label><span>From Date</span><input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label><label><span>To Date</span><input type="date" min={from || undefined} value={to} onChange={(e) => setTo(e.target.value)} /></label></div><div className="filter-footer"><span><strong>{filtered.length}</strong> transaction{filtered.length !== 1 ? 's' : ''} found</span><button className="text-button" onClick={clear}><FilterX size={15} /> Clear Filters</button></div></section>

    <section className="panel"><TransactionList transactions={filtered} /></section>
  </div>;
}
