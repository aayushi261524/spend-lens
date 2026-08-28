import React, { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { currentMonthKey, formatMonthLabel, monthKey } from '../utils/finance';

export default function MonthSelect({ includeAll = false }) {
  const { transactions, selectedMonth, setSelectedMonth } = useApp();
  const months = useMemo(() => {
    const set = new Set([currentMonthKey(), ...transactions.map((tx) => monthKey(tx.date)).filter(Boolean)]);
    return [...set].sort().reverse();
  }, [transactions]);
  return <label className="month-select"><CalendarDays size={17} /><span className="sr-only">Selected month</span><select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>{includeAll && <option value="all">All Time</option>}{months.map((m) => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}</select></label>;
}
