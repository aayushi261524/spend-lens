import React, { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, Landmark, PiggyBank, Plus, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateBalance, calculateBudgetProgress, calculateCategoryTotals, calculateMonthlySummary, filterByMonth, formatCurrency, formatMonthLabel, getTotals, groupTransactionsByMonth, percentChange, previousMonth, sortedTransactions } from '../utils/finance';
import { IncomeExpenseChart } from '../components/Charts';
import TransactionList from '../components/TransactionList';

function StatCard({ label, value, helper, icon: Icon, tone = '' }) {
  return <article className={`stat-card ${tone}`}><div className="stat-head"><span>{label}</span><div className="stat-icon"><Icon size={19} /></div></div><strong>{value}</strong><small>{helper}</small></article>;
}

export default function DashboardPage() {
  const { transactions, settings, selectedMonth, budgets, openTransaction, recurring, addRecurringAsTransaction, skipRecurring } = useApp();
  const periodTx = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const allTotals = useMemo(() => getTotals(transactions), [transactions]);
  const balance = allTotals.income - allTotals.expense;
  const summary = useMemo(() => calculateMonthlySummary(periodTx), [periodTx]);
  const categories = useMemo(() => calculateCategoryTotals(periodTx), [periodTx]);
  const trend = useMemo(() => groupTransactionsByMonth(transactions, 6), [transactions]);
  const prevTx = useMemo(() => selectedMonth === 'all' ? [] : filterByMonth(transactions, previousMonth(selectedMonth)), [transactions, selectedMonth]);
  const prevSummary = useMemo(() => calculateMonthlySummary(prevTx), [prevTx]);
  const expenseChange = percentChange(summary.expense, prevSummary.expense);
  const monthBudget = selectedMonth === 'all' ? 0 : Number(budgets.overall?.[selectedMonth] || 0);
  const progress = calculateBudgetProgress(summary.expense, monthBudget);
  const dueToday = recurring.filter((r) => r.nextDueDate <= new Date().toISOString().slice(0, 10));
  const insight = summary.income > 0
    ? `You saved ${Math.round(summary.savingsRate || 0)}% of your income in ${formatMonthLabel(selectedMonth)}${categories[0] ? `. ${categories[0].category} is your highest spending category.` : '.'}`
    : summary.expense > 0 ? `You recorded expenses without income in this period. Add income to calculate a savings rate.` : `Add your first transaction to generate spending insights.`;

  return <div className="page-stack">
    <section className="hero-strip"><div><span className="eyebrow">Financial snapshot</span><h2>{formatMonthLabel(selectedMonth)}</h2><p>Track your money with deterministic calculations from your locally stored transactions.</p></div><div className="hero-actions"><button className="button button-secondary" onClick={() => openTransaction('income')}><ArrowDownLeft size={17} /> Add Income</button><button className="button button-primary" onClick={() => openTransaction('expense')}><ArrowUpRight size={17} /> Add Expense</button></div></section>

    <section className="stats-grid">
      <StatCard label="Current Balance" value={formatCurrency(balance, settings.currency, settings.compactNumbers)} helper="All-time income − expenses" icon={Wallet} tone="accent-card" />
      <StatCard label="Period Income" value={formatCurrency(summary.income, settings.currency, settings.compactNumbers)} helper={`${periodTx.filter((t) => t.type === 'income').length} income entries`} icon={TrendingUp} tone="positive-card" />
      <StatCard label="Period Expenses" value={formatCurrency(summary.expense, settings.currency, settings.compactNumbers)} helper={`${periodTx.filter((t) => t.type === 'expense').length} expense entries`} icon={TrendingDown} tone="negative-card" />
      <StatCard label="Net Savings" value={formatCurrency(summary.savings, settings.currency, settings.compactNumbers)} helper={summary.savingsRate === null ? 'Savings rate: N/A' : `Savings rate: ${summary.savingsRate.toFixed(1)}%`} icon={PiggyBank} />
    </section>

    {dueToday.length > 0 && <section className="due-panel"><div><span className="eyebrow">Recurring templates</span><h3>{dueToday.length} item{dueToday.length > 1 ? 's are' : ' is'} due</h3><p>Because this is frontend-only, due items are suggested when you open the app rather than created in the background.</p></div><div className="due-list">{dueToday.slice(0, 3).map((item) => <div className="due-item" key={item.id}><span><strong>{item.title}</strong><small>{formatCurrency(item.amount, settings.currency)} • {item.frequency}</small></span><div><button className="button button-ghost button-small" onClick={() => skipRecurring(item)}>Skip</button><button className="button button-primary button-small" onClick={() => addRecurringAsTransaction(item)}>Add</button></div></div>)}</div></section>}

    <section className="dashboard-grid">
      <article className="panel panel-wide"><div className="panel-heading"><div><span className="eyebrow">Cash flow</span><h3>Income vs Expense</h3></div><span className="panel-badge">Last {trend.length || 0} months</span></div><IncomeExpenseChart data={trend} /></article>
      <article className="panel"><div className="panel-heading"><div><span className="eyebrow">Monthly plan</span><h3>Budget Progress</h3></div><Landmark size={20} /></div>{monthBudget > 0 ? <><div className="budget-figure"><strong>{formatCurrency(summary.expense, settings.currency)}</strong><span>of {formatCurrency(monthBudget, settings.currency)}</span></div><div className="progress-track"><span style={{ width: `${Math.min(progress.percentage, 100)}%` }} /></div><div className="progress-meta"><strong>{Math.round(progress.percentage)}% used</strong><span className={`status-text ${progress.status.replaceAll(' ', '-').toLowerCase()}`}>{progress.status}</span></div><p className="muted">{formatCurrency(Math.max(monthBudget - summary.expense, 0), settings.currency)} remaining</p></> : <div className="compact-empty"><p>No overall budget set for this month.</p><a href="/budget" className="text-link">Set a monthly budget →</a></div>}</article>

      <article className="panel"><div className="panel-heading"><div><span className="eyebrow">Spending insight</span><h3>Financial Health</h3></div><span className="insight-dot" /></div><p className="insight-copy">{insight}</p><div className="comparison-row"><span>Expense vs previous month</span><strong>{expenseChange === null ? 'No comparison' : `${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}%`}</strong></div><small className="muted">Informational only — not financial advice.</small></article>

      <article className="panel panel-wide"><div className="panel-heading"><div><span className="eyebrow">Activity</span><h3>Recent Transactions</h3></div><button className="button button-ghost button-small" onClick={() => openTransaction('expense')}><Plus size={15} /> New</button></div><TransactionList compact transactions={sortedTransactions(periodTx).slice(0, 6)} /></article>
    </section>
  </div>;
}
