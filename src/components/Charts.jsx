import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/finance';
import EmptyState from './EmptyState';

function ChartTooltip({ active, payload, label }) {
  const { settings } = useApp();
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><strong>{label || payload[0]?.payload?.category}</strong>{payload.map((p) => <span key={p.dataKey || p.name}>{p.name}: {formatCurrency(p.value, settings.currency)}</span>)}</div>;
}

export function IncomeExpenseChart({ data }) {
  if (!data.length) return <EmptyState title="No chart data" message="Add transactions across one or more months to visualize income and expenses." />;
  return <div className="chart-wrap"><ResponsiveContainer width="100%" height={280}><BarChart data={data}><CartesianGrid stroke="var(--chart-grid)" vertical={false} /><XAxis dataKey="month" tickFormatter={(v) => v.slice(5)} tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="income" name="Income" fill="var(--positive)" radius={[6,6,0,0]} /><Bar dataKey="expense" name="Expense" fill="var(--negative)" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>;
}

export function CategoryChart({ data }) {
  if (!data.length) return <EmptyState title="No expense data" message="Add expenses in the selected period to see category distribution." />;
  const fills = ['var(--accent)', 'var(--positive)', 'var(--warning)', 'var(--negative)', 'var(--purple)', 'var(--blue)', 'var(--teal)'];
  return <div className="chart-wrap"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={data.slice(0, 7)} dataKey="value" nameKey="category" innerRadius={65} outerRadius={100} paddingAngle={2}>{data.slice(0, 7).map((entry, index) => <Cell key={entry.category} fill={fills[index % fills.length]} />)}</Pie><Tooltip content={<ChartTooltip />} /></PieChart></ResponsiveContainer></div>;
}

export function TrendChart({ data }) {
  if (!data.length) return <EmptyState title="No trend data" message="Monthly trends will appear after you add dated transactions." />;
  return <div className="chart-wrap"><ResponsiveContainer width="100%" height={280}><LineChart data={data}><CartesianGrid stroke="var(--chart-grid)" vertical={false} /><XAxis dataKey="month" tickFormatter={(v) => v.slice(5)} tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Line type="monotone" dataKey="expense" name="Expense" stroke="var(--negative)" strokeWidth={3} dot={{ r: 3 }} /><Line type="monotone" dataKey="income" name="Income" stroke="var(--positive)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>;
}
