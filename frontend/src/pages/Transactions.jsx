import { useEffect, useState, useCallback } from 'react';
import {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactionService';
import { formatCurrency, formatDate, titleCase } from '../utils/format';
import { ArrowUpIcon, ArrowDownIcon, PlusIcon, EditIcon, TrashIcon } from '../components/icons';
import TransactionModal from '../components/TransactionModal';
import '../styles/dashboard.css';
import '../styles/transactions.css';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load your transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const openAddModal = () => {
    setEditingTx(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (editingTx) {
        await updateTransaction(editingTx.id, payload);
      } else {
        await createTransaction(payload);
      }
      setModalOpen(false);
      await fetchTransactions();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Could not save this transaction. Please check the details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tx) => {
    const confirmed = window.confirm(
      `Delete this ${tx.type === 'INCOME' ? 'income' : 'expense'} of ${formatCurrency(tx.amount)}? This can't be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteTransaction(tx.id);
      await fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete this transaction. Please try again.');
    }
  };

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h2>Transactions</h2>
          <p>Every income and expense you've logged, most recent first.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <PlusIcon /> Add transaction
        </button>
      </div>

      {error && (
        <div className="dash-error">
          <span>{error}</span>
          <button onClick={fetchTransactions}>Retry</button>
        </div>
      )}

      {loading && !error && (
        <div className="tx-card">
          <div className="skeleton skeleton-card" style={{ marginBottom: 12 }} />
          <div className="skeleton skeleton-card" style={{ marginBottom: 12 }} />
          <div className="skeleton skeleton-card" />
        </div>
      )}

      {!loading && !error && (
        <div className="tx-card">
          {transactions.length === 0 ? (
            <div className="empty-state">
              No transactions yet.{' '}
              <button className="btn-primary" style={{ marginTop: 12 }} onClick={openAddModal}>
                <PlusIcon /> Add your first transaction
              </button>
            </div>
          ) : (
            transactions.map((t) => (
              <div className="tx-row" key={t.id}>
                <div className={`tx-icon ${t.type === 'INCOME' ? 'income' : 'expense'}`}>
                  {t.type === 'INCOME' ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </div>
                <div className="tx-details">
                  <div className="tx-category">{titleCase(t.category)}</div>
                  <div className="tx-meta">
                    {t.description || 'No description'} · {formatDate(t.transactionDate)}
                  </div>
                </div>
                <div className={`tx-amount ${t.type === 'INCOME' ? 'income' : 'expense'} amount`}>
                  {t.type === 'INCOME' ? '+' : '−'}{formatCurrency(t.amount)}
                </div>
                <div className="tx-actions">
                  <button className="icon-btn" onClick={() => openEditModal(t)} aria-label="Edit">
                    <EditIcon />
                  </button>
                  <button className="icon-btn danger" onClick={() => handleDelete(t)} aria-label="Delete">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <TransactionModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editingTx}
        submitting={submitting}
        error={formError}
      />
    </div>
  );
}
