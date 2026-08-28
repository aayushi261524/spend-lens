import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Modal from './components/Modal';
import TransactionForm from './components/TransactionForm';
import { ConfirmDialog, ToastStack } from './components/Feedback';
import { useApp } from './context/AppContext';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BudgetPage from './pages/BudgetPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { transactionModal, closeTransaction } = useApp();
  return <>
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
    <Modal open={transactionModal.open} title={transactionModal.editing ? 'Edit Transaction' : 'Add Transaction'} onClose={closeTransaction}><TransactionForm /></Modal>
    <ConfirmDialog />
    <ToastStack />
  </>;
}
