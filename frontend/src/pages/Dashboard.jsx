import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getDashboard } from '../services/dashboardService';
import '../styles/dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function titleCase(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function ArrowUpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M19 12l-7 7-7-7" />
    </svg>
  );
}

function Dashboard() {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const response = await getDashboard(month);

        if (mounted) {
          setData(response);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.error ||
              'Could not load your dashboard. Please try again.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [month]);

  const chartData = useMemo(() => {
    const categories = [
      'FOOD',
      'TRAVEL',
      'SHOPPING',
      'BOOKS',
      'ENTERTAINMENT',
      'BILLS',
      'OTHER',
    ];

    const categoryTotals = {};

    categories.forEach((category) => {
      categoryTotals[category] = 0;
    });

    if (data?.recentTransactions) {
      data.recentTransactions.forEach((transaction) => {
        if (transaction.type === 'EXPENSE') {
          const category = transaction.category || 'OTHER';

          if (categoryTotals[category] !== undefined) {
            categoryTotals[category] += Number(transaction.amount || 0);
          }
        }
      });
    }

    return {
      labels: categories.map(titleCase),
      datasets: [
        {
          label: 'Expenses',
          data: categories.map((category) => categoryTotals[category]),
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const income = Number(data.totalIncome || 0);
  const expense = Number(data.totalExpense || 0);
  const balance = Number(data.balance || income - expense);
  const budgetLimit = data.budgetLimit
    ? Number(data.budgetLimit)
    : null;
  const budgetRemaining =
    data.budgetRemaining !== null &&
    data.budgetRemaining !== undefined
      ? Number(data.budgetRemaining)
      : null;

  const budgetUsed =
    budgetLimit && budgetLimit > 0
      ? Math.min((expense / budgetLimit) * 100, 100)
      : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Your finances at a glance</h1>
          <p className="dashboard-subtitle">
            Keep track of your income, expenses and monthly budget.
          </p>
        </div>

        <div className="month-picker">
          <label htmlFor="dashboard-month">Month</label>
          <input
            id="dashboard-month"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          />
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card income-card">
          <div className="summary-card-top">
            <span>Income</span>
            <div className="summary-icon">
              <ArrowUpIcon />
            </div>
          </div>
          <strong>{formatCurrency(income)}</strong>
          <p>Total income this month</p>
        </div>

        <div className="summary-card expense-card">
          <div className="summary-card-top">
            <span>Expenses</span>
            <div className="summary-icon">
              <ArrowDownIcon />
            </div>
          </div>
          <strong>{formatCurrency(expense)}</strong>
          <p>Total spending this month</p>
        </div>

        <div className="summary-card balance-card">
          <div className="summary-card-top">
            <span>Balance</span>
          </div>
          <strong>{formatCurrency(balance)}</strong>
          <p>Income minus expenses</p>
        </div>

        <div className="summary-card budget-card">
          <div className="summary-card-top">
            <span>Budget</span>
          </div>
          <strong>
            {budgetLimit !== null
              ? formatCurrency(budgetLimit)
              : 'Not set'}
          </strong>
          <p>
            {budgetRemaining !== null
              ? `${formatCurrency(budgetRemaining)} remaining`
              : 'Set a monthly budget'}
          </p>
        </div>
      </div>

      <div className="budget-status-card">
        <div className="budget-status-header">
          <div>
            <p className="eyebrow">MONTHLY BUDGET</p>
            <h3>
              {budgetLimit !== null
                ? `${formatCurrency(expense)} of ${formatCurrency(
                    budgetLimit
                  )} used`
                : 'No monthly budget set'}
            </h3>
          </div>

          {data.budgetStatus && (
            <span
              className={`budget-status ${String(
                data.budgetStatus
              ).toLowerCase()}`}
            >
              {titleCase(data.budgetStatus)}
            </span>
          )}
        </div>

        {budgetLimit !== null ? (
          <>
            <div className="budget-progress">
              <div
                className="budget-progress-fill"
                style={{ width: `${budgetUsed}%` }}
              />
            </div>

            <div className="budget-status-message">
              {data.budgetStatus === 'EXCEEDED' && (
                <>
                  <strong>Budget exceeded.</strong> You have spent{' '}
                  {formatCurrency(expense - budgetLimit)} over your
                  monthly limit.
                </>
              )}

              {data.budgetStatus === 'WARNING' && (
                <>
                  <strong>You're approaching your limit.</strong>{' '}
                  {formatCurrency(budgetRemaining)} left for the month.
                </>
              )}

              {data.budgetStatus === 'OK' && (
                <>
                  <strong>You're within budget.</strong> Keep it up —{' '}
                  {formatCurrency(budgetRemaining)} left for the month.
                </>
              )}

              {data.budgetStatus === 'NOT_SET' && (
                <>
                  <strong>No budget set for {month}.</strong> Set one
                  to get spending warnings and remaining-balance
                  tracking.
                </>
              )}
            </div>
          </>
        ) : (
          <div className="budget-status-message">
            <strong>No budget set for {month}.</strong>{' '}
            <Link to="/budget">Set your monthly budget</Link>.
          </div>
        )}
      </div>

      <div className="content-grid">
        <div className="chart-card">
          <h3>Spending overview</h3>

          <div className="chart-wrap">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="tx-card">
          <h3>Recent transactions</h3>

          {data.recentTransactions &&
          data.recentTransactions.length > 0 ? (
            data.recentTransactions.map((t) => (
              <div className="tx-row" key={t.id}>
                <div
                  className={`tx-icon ${
                    t.type === 'INCOME' ? 'income' : 'expense'
                  }`}
                >
                  {t.type === 'INCOME' ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowDownIcon />
                  )}
                </div>

                <div className="tx-details">
                  <div className="tx-category">
                    {titleCase(t.category)}
                  </div>

                  <div className="tx-meta">
                    {t.description || 'No description'} ·{' '}
                    {formatDate(t.transactionDate)}
                  </div>
                </div>

                <div
                  className={`tx-amount ${
                    t.type === 'INCOME' ? 'income' : 'expense'
                  } amount`}
                >
                  {t.type === 'INCOME' ? '+' : '−'}
                  {formatCurrency(t.amount)}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              No transactions yet for {month}.{' '}
              <Link to="/transactions">
                Add your first one →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;