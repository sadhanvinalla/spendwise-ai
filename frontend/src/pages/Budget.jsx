import { useEffect, useState, useCallback } from 'react';
import { getBudgetStatus, setBudget } from '../services/budgetService';
import { formatCurrency, getCurrentMonth, getMonthOptions } from '../utils/format';
import { ArrowDownIcon, TargetIcon, AlertIcon, CheckCircleIcon } from '../components/icons';
import '../styles/dashboard.css';
import '../styles/transactions.css';
import '../styles/budget.css';

const STATUS_LABEL = {
  OK: 'On track',
  WARNING: 'Approaching limit',
  EXCEEDED: 'Over budget',
};

const STATUS_MESSAGE = {
  OK: "You're within budget. Keep it up.",
  WARNING: "You're getting close to your limit — worth keeping an eye on spending for the rest of the month.",
  EXCEEDED: "You've gone over budget for this month. Consider adjusting your limit or reviewing recent spending.",
};

export default function Budget() {
  const monthOptions = getMonthOptions(6);
  const [month, setMonth] = useState(getCurrentMonth());

  const [status, setStatus] = useState(null);
  const [notSet, setNotSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formAmount, setFormAmount] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchStatus = useCallback(async (m) => {
    setLoading(true);
    setError('');
    setNotSet(false);
    try {
      const data = await getBudgetStatus(m);
      setStatus(data);
      setFormAmount(String(data.limitAmount));
    } catch (err) {
      if (err.response?.status === 404) {
        setNotSet(true);
        setStatus(null);
        setFormAmount('');
      } else {
        setError(err.response?.data?.error || 'Could not load your budget. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus(month);
    setFormSuccess('');
  }, [month, fetchStatus]);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const numericAmount = parseFloat(formAmount);
    if (!formAmount || isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Enter a budget amount greater than 0.');
      return;
    }

    setFormSubmitting(true);
    try {
      await setBudget(month, numericAmount);
      setFormSuccess('Budget saved.');
      await fetchStatus(month);
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Could not save your budget. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const statusKey = status ? status.status.toLowerCase() : null;
  const monthLabel = monthOptions.find((o) => o.value === month)?.label || month;

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h2>Budget</h2>
          <p>Set a monthly limit and track how you're spending against it.</p>
        </div>
        <select className="month-select" value={month} onChange={(e) => setMonth(e.target.value)}>
          {monthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="dash-error">
          <span>{error}</span>
          <button onClick={() => fetchStatus(month)}>Retry</button>
        </div>
      )}

      {loading && !error && (
        <>
          <div className="summary-grid" style={{ marginBottom: 22 }}>
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-card" />
          </div>
          <div className="skeleton" style={{ height: 140, marginBottom: 22 }} />
        </>
      )}

      {!loading && !error && notSet && (
        <div className="tx-card" style={{ marginBottom: 22 }}>
          <div className="empty-state">
            <TargetIcon />
            <div style={{ marginTop: 10 }}>
              No budget set for <strong>{monthLabel}</strong> yet. Set one below to start tracking usage and get warnings.
            </div>
          </div>
        </div>
      )}

      {!loading && !error && status && (
        <>
          <div className="summary-grid" style={{ marginBottom: 22 }}>
            <div className="summary-card">
              <span className="card-label">Budget limit</span>
              <div className="card-value amount">{formatCurrency(status.limitAmount)}</div>
              <div className="card-sub">for {monthLabel}</div>
            </div>

            <div className="summary-card">
              <div className="card-icon-badge expense"><ArrowDownIcon /></div>
              <span className="card-label">Total spent</span>
              <div className="card-value amount">{formatCurrency(status.totalExpense)}</div>
            </div>

            <div className="summary-card">
              <span className="card-label">Remaining</span>
              <div className="card-value amount">{formatCurrency(status.remaining)}</div>
              <div className="card-sub">
                <span className={`status-pill ${statusKey}`}>{STATUS_LABEL[status.status]}</span>
              </div>
            </div>
          </div>

          <div className="tx-card" style={{ marginBottom: 22 }}>
            <div className="usage-row">
              <span>Usage this month</span>
              <span className="usage-percent">{status.usagePercent.toFixed(0)}%</span>
            </div>
            <div className="budget-progress-track-lg">
              <div
                className={`budget-progress-fill-lg ${statusKey}`}
                style={{ width: `${Math.min(100, status.usagePercent)}%` }}
              />
            </div>
            <div className="usage-row">
              <span>{formatCurrency(status.totalExpense)} spent</span>
              <span>{formatCurrency(status.limitAmount)} limit</span>
            </div>
          </div>

          <div className={`status-banner ${statusKey}`} style={{ marginBottom: 22 }}>
            {status.status === 'OK' ? <CheckCircleIcon /> : <AlertIcon />}
            <div>
              <strong>{STATUS_LABEL[status.status]}</strong>
              <div>{STATUS_MESSAGE[status.status]}</div>
            </div>
          </div>
        </>
      )}

      <div className="tx-card budget-form-card">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginTop: 0, marginBottom: 14 }}>
          {notSet ? 'Set your budget' : 'Update your budget'} for {monthLabel}
        </h3>

        {formError && <div className="auth-banner-error">{formError}</div>}
        {formSuccess && <div className="auth-banner-success">{formSuccess}</div>}

        <form onSubmit={handleSetBudget} noValidate>
          <div className="form-field">
            <label htmlFor="budgetAmount">Monthly limit (₹)</label>
            <input
              id="budgetAmount"
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              placeholder="e.g. 8000"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={formSubmitting}>
            {formSubmitting ? 'Saving…' : notSet ? 'Set budget' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
