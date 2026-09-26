import { useEffect, useState } from 'react';
import { XIcon } from './icons';
import { titleCase } from '../utils/format';

const CATEGORIES = ['FOOD', 'TRAVEL', 'SHOPPING', 'BOOKS', 'ENTERTAINMENT', 'BILLS', 'OTHER'];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TransactionModal({ isOpen, onClose, onSubmit, initialData, submitting, error }) {
  const [type, setType] = useState('EXPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayISO());
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setType(initialData.type);
        setAmount(String(initialData.amount));
        setCategory(initialData.category);
        setDescription(initialData.description || '');
        setDate(initialData.transactionDate);
      } else {
        setType('EXPENSE');
        setAmount('');
        setCategory('FOOD');
        setDescription('');
        setDate(todayISO());
      }
      setValidationError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setValidationError('Enter an amount greater than 0.');
      return;
    }
    if (!date) {
      setValidationError('Pick a date for this transaction.');
      return;
    }

    onSubmit({
      type,
      category,
      amount: numericAmount,
      description: description.trim(),
      transactionDate: date,
    });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <div className="modal-header">
          <h3>{initialData ? 'Edit transaction' : 'Add transaction'}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <XIcon />
          </button>
        </div>

        {(error || validationError) && (
          <div className="auth-banner-error">{error || validationError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label>Type</label>
            <div className="segmented">
              <button
                type="button"
                className={type === 'EXPENSE' ? 'active expense' : ''}
                onClick={() => setType('EXPENSE')}
              >
                Expense
              </button>
              <button
                type="button"
                className={type === 'INCOME' ? 'active income' : ''}
                onClick={() => setType('INCOME')}
              >
                Income
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{titleCase(c)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="description">Description (optional)</label>
            <input
              id="description"
              type="text"
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Groceries, bus pass, textbook"
            />
          </div>

          <div className="form-field">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayISO()}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : initialData ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
