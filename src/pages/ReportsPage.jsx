import React, { useMemo } from 'react';
import { Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateCategoryTotals, calculateMonthlySummary, filterByMonth, formatCurrency, formatDate, formatMonthLabel, sortedTransactions } from '../utils/finance';

export default function ReportsPage() {
  const { transactions, selectedMonth, settings, budgets } = useApp();
  const period = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const summary = useMemo(() => calculateMonthlySummary(period), [period]);
  const categories = useMemo(() => calculateCategoryTotals(period), [period]);
  const budget = Number(budgets.overall?.[selectedMonth] || 0);
  const rows = sortedTransactions(period, 'oldest');

  return <div className="page-stack report-page">
    <section className="page-heading no-print"><div><span className="eyebrow">Printable statement</span><h2>Monthly Financial Report</h2><p>Use your browser's print dialog and choose “Save as PDF” for an A4 report.</p></div><button className="button button-primary" onClick={() => window.print()}><Printer size={17} /> Print Report</button></section>
    <section className="report-sheet"><header className="report-header"><div><span>PERSONAL FINANCE</span><h2>Expense Tracker</h2><p>Monthly Financial Report</p></div><div className="report-meta"><strong>{formatMonthLabel(selectedMonth)}</strong><span>Generated {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date())}</span><span>Currency: {settings.currency}</span></div></header>
      <div className="report-summary"><div><span>Total Income</span><strong>{formatCurrency(summary.income, settings.currency)}</strong></div><div><span>Total Expenses</span><strong>{formatCurrency(summary.expense, settings.currency)}</strong></div><div><span>Net Savings</span><strong>{formatCurrency(summary.savings, settings.currency)}</strong></div><div><span>Savings Rate</span><strong>{summary.savingsRate === null ? 'N/A' : `${summary.savingsRate.toFixed(1)}%`}</strong></div><div><span>Budget</span><strong>{budget > 0 ? formatCurrency(budget, settings.currency) : 'Not set'}</strong></div><div><span>Top Category</span><strong>{summary.topCategory}</strong></div></div>
      <div className="report-section"><h3>Top Expense Categories</h3><div className="report-category-grid">{categories.slice(0, 5).map((c) => <div key={c.category}><span>{c.category}</span><strong>{formatCurrency(c.value, settings.currency)}</strong><small>{c.percentage.toFixed(1)}%</small></div>)}{!categories.length && <p>No expense data for this period.</p>}</div></div>
      <div className="report-section"><h3>Transactions</h3><div className="table-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Payment</th><th className="align-right">Amount</th></tr></thead><tbody>{rows.map((tx) => <tr key={tx.id}><td>{formatDate(tx.date)}</td><td>{tx.title}</td><td>{tx.category}</td><td>{tx.type}</td><td>{tx.paymentMethod || '—'}</td><td className="align-right">{formatCurrency(tx.amount, settings.currency)}</td></tr>)}{!rows.length && <tr><td colSpan="6">No transactions in this period.</td></tr>}</tbody></table></div></div>
      <footer className="report-footer">This report is generated locally in your browser. It is a personal tracking document, not professional financial advice.</footer>
    </section>
  </div>;
}
