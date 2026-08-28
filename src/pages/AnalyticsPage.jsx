import React, { useMemo } from 'react';
import { Award, BarChart3, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateCategoryTotals, filterByMonth, formatCurrency, formatMonthLabel, groupTransactionsByMonth } from '../utils/finance';
import { CategoryChart, IncomeExpenseChart, TrendChart } from '../components/Charts';

export default function AnalyticsPage() {
  const { transactions, selectedMonth, settings } = useApp();
  const period = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const categories = useMemo(() => calculateCategoryTotals(period), [period]);
  const trend = useMemo(() => groupTransactionsByMonth(transactions, 10), [transactions]);
  const topExpenses = useMemo(() => period.filter((t) => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5), [period]);

  return <div className="page-stack">
    <section className="page-heading"><div><span className="eyebrow">Financial analytics</span><h2>{formatMonthLabel(selectedMonth)} Analysis</h2><p>Charts are calculated from actual stored transactions—no hard-coded financial values.</p></div></section>
    <section className="analytics-grid"><article className="panel panel-wide"><div className="panel-heading"><div><span className="eyebrow">Cash flow</span><h3>Income vs Expense</h3></div><BarChart3 size={20} /></div><IncomeExpenseChart data={trend} /></article><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Distribution</span><h3>Expenses by Category</h3></div><Target size={20} /></div><CategoryChart data={categories} /></article><article className="panel panel-wide"><div className="panel-heading"><div><span className="eyebrow">Trend</span><h3>Monthly Spending Trend</h3></div></div><TrendChart data={trend} /></article><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Ranking</span><h3>Top Categories</h3></div><Award size={20} /></div><div className="rank-list">{categories.slice(0, 6).map((c, i) => <div key={c.category}><span className="rank-index">{i + 1}</span><span><strong>{c.category}</strong><small>{c.percentage.toFixed(1)}% of expenses</small></span><b>{formatCurrency(c.value, settings.currency)}</b></div>)}{!categories.length && <p className="muted">No expense categories in this period.</p>}</div></article><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Biggest outflows</span><h3>Top 5 Expenses</h3></div></div><div className="rank-list">{topExpenses.map((tx, i) => <div key={tx.id}><span className="rank-index">{i + 1}</span><span><strong>{tx.title}</strong><small>{tx.category} • {tx.date}</small></span><b>{formatCurrency(tx.amount, settings.currency)}</b></div>)}{!topExpenses.length && <p className="muted">No expenses in this period.</p>}</div></article></section>
  </div>;
}
