import React, { useRef, useState } from 'react';
import { Download, Moon, RotateCcw, ShieldCheck, Sun, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCIES } from '../data/defaults';
import { exportJSON } from '../utils/exportUtils';

function CategoryManager({ type, title }) {
  const { categories, addCategory, renameCategory, deleteCategory } = useApp();
  const [name, setName] = useState('');
  return <div className="settings-card"><div className="settings-card-head"><div><span className="eyebrow">{type}</span><h3>{title}</h3></div></div><form className="add-category" onSubmit={(e) => { e.preventDefault(); if (addCategory(type, name)) setName(''); }}><input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" /><button className="button button-secondary">Add</button></form><div className="category-chip-list">{categories[type].map((category) => <div className="category-chip" key={category}><span>{category}</span><button onClick={() => { const next = window.prompt('Rename category', category); if (next && next !== category) renameCategory(type, category, next); }} aria-label={`Rename ${category}`}>Rename</button><button className="chip-delete" onClick={() => deleteCategory(type, category)} aria-label={`Delete ${category}`}>Delete</button></div>)}</div></div>;
}

export default function SettingsPage() {
  const { settings, setSettings, backupPayload, restoreData, loadDemoData, resetAllData, notify, confirm } = useApp();
  const backupInput = useRef(null);
  const restore = async (file) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const ok = await confirm({ title: 'Replace existing data?', message: 'Restoring this backup will replace the current transactions, categories, budgets, recurring templates, and settings in this browser.', confirmText: 'Restore Backup', danger: true });
      if (ok) restoreData(data);
    } catch (err) { notify(err.message || 'Invalid backup file', 'warning'); }
    if (backupInput.current) backupInput.current.value = '';
  };

  return <div className="page-stack">
    <section className="page-heading"><div><span className="eyebrow">Preferences & data</span><h2>Settings</h2><p>Control display preferences, categories, backups, demo data, and local browser storage.</p></div></section>
    <section className="settings-grid"><div className="settings-card"><div className="settings-card-head"><div><span className="eyebrow">Appearance</span><h3>Theme & Currency</h3></div>{settings.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}</div><div className="settings-row"><span><strong>Theme</strong><small>Choose a designed light or dark interface.</small></span><div className="segmented"><button className={settings.theme === 'light' ? 'active' : ''} onClick={() => setSettings((p) => ({ ...p, theme: 'light' }))}>Light</button><button className={settings.theme === 'dark' ? 'active' : ''} onClick={() => setSettings((p) => ({ ...p, theme: 'dark' }))}>Dark</button></div></div><div className="settings-row"><span><strong>Currency</strong><small>Display formatting only; no exchange-rate conversion.</small></span><select value={settings.currency} onChange={(e) => setSettings((p) => ({ ...p, currency: e.target.value }))}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></div><div className="settings-row"><span><strong>Compact numbers</strong><small>Display large values in compact form when possible.</small></span><input type="checkbox" checked={settings.compactNumbers} onChange={(e) => setSettings((p) => ({ ...p, compactNumbers: e.target.checked }))} /></div></div>

      <div className="settings-card"><div className="settings-card-head"><div><span className="eyebrow">Privacy</span><h3>Browser-Only Storage</h3></div><ShieldCheck size={20} /></div><p>Your data stays in this browser. This demo does not send transaction data to a server.</p><ul className="clean-list"><li>Clearing browser storage removes local data.</li><li>Data is not automatically synchronized between devices.</li><li>localStorage is not appropriate for sensitive production financial data.</li><li>There is no real authentication or cloud backup in this frontend-only version.</li></ul></div>

      <CategoryManager type="expense" title="Expense Categories" /><CategoryManager type="income" title="Income Categories" />

      <div className="settings-card"><div className="settings-card-head"><div><span className="eyebrow">Backup</span><h3>Export / Restore Data</h3></div></div><p>Export transactions, categories, budgets, recurring templates, and preferences as one JSON backup.</p><div className="button-row"><button className="button button-secondary" onClick={() => exportJSON(backupPayload)}><Download size={17} /> Export Backup</button><input ref={backupInput} className="hidden-input" type="file" accept="application/json,.json" onChange={(e) => restore(e.target.files?.[0])} /><button className="button button-ghost" onClick={() => backupInput.current?.click()}><Upload size={17} /> Import Backup</button></div></div>

      <div className="settings-card danger-zone"><div className="settings-card-head"><div><span className="eyebrow">Portfolio demo</span><h3>Demo & Reset</h3></div><RotateCcw size={20} /></div><p>Load realistic fictional transactions to populate charts, or permanently reset browser data.</p><div className="button-row"><button className="button button-secondary" onClick={loadDemoData}>Load Demo Data</button><button className="button button-danger" onClick={resetAllData}>Reset All Data</button></div></div>
    </section>
  </div>;
}
