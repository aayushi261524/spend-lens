import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, CircleDollarSign, FileText, LayoutDashboard, Moon, Plus, ReceiptText, Settings, Sun, WalletCards } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MonthSelect from './MonthSelect';

const nav = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/transactions', 'Transactions', ReceiptText],
  ['/analytics', 'Analytics', BarChart3],
  ['/budget', 'Budget', WalletCards],
  ['/reports', 'Reports', FileText],
];

export default function Layout({ children }) {
  const { settings, setSettings, openTransaction } = useApp();
  useEffect(() => {
    document.title = "Spend Lens — Open-source finance demo";
    const handler = (e) => {
      const target = e.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable;
      if (!typing && e.key.toLowerCase() === 'n') openTransaction('expense');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openTransaction]);

  const toggleTheme = () => setSettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><CircleDollarSign size={24} /></span><div><strong>Spend Lens</strong><small>Personal finance</small></div></div>
      <nav className="side-nav" aria-label="Primary navigation">{nav.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
      <div className="side-note"><strong>Your data stays here.</strong><span>Stored only in this browser using localStorage.</span></div>
      <NavLink className="settings-link" to="/settings"><Settings size={18} /> Settings</NavLink>
    </aside>

    <div className="main-column">
      <header className="topbar">
        <div className="topbar-title"><span className="eyebrow">Open-source adaptation · Personal finance</span><h1>Spend Lens</h1><p>Understand spending. Set a monthly plan.</p></div>
        <div className="topbar-actions"><MonthSelect /><button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}>{settings.theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button><NavLink className="icon-button settings-top" to="/settings" aria-label="Settings"><Settings size={19} /></NavLink><button className="button button-primary quick-add" onClick={() => openTransaction('expense')}><Plus size={17} /> <span>Quick Add</span><kbd>N</kbd></button></div>
      </header>
      <main className="content"><div className="side-note" style={{marginBottom:20}}><strong>About this adaptation</strong><span>Configured and deployed for Aayushi’s portfolio. Original dashboard by Mohammad Mrinmoy, reused under the MIT licence. Transactions, budgets, charts and exports originate in the base project.</span><a href="https://github.com/mrinamoto/expense-tracker-localstorage" target="_blank" rel="noreferrer">Original source ↗</a></div>{children}</main>
    </div>

    <nav className="mobile-nav" aria-label="Mobile navigation">{nav.slice(0, 4).map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'}><Icon size={19} /><span>{label}</span></NavLink>)}<NavLink to="/settings"><Settings size={19} /><span>Settings</span></NavLink></nav>
    <button className="mobile-fab" onClick={() => openTransaction('expense')} aria-label="Add transaction"><Plus size={23} /></button>
  </div>;
}
