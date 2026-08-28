import React from 'react';
import { WalletCards } from 'lucide-react';
export default function EmptyState({ title = 'No data yet', message = 'Add your first transaction to get started.', action }) {
  return <div className="empty-state"><div className="empty-icon"><WalletCards size={26} /></div><h3>{title}</h3><p>{message}</p>{action}</div>;
}
