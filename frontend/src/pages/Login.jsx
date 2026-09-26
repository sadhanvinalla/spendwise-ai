import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.prefillEmail || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.registered
    ? 'Account created. Log in to continue.'
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.error || 'Could not log in. Check your details and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="See your money clearly."
      subheadline="Track spending, set budgets, and understand your student finances with clarity."
    >
      <h2>Welcome back</h2>
      <p className="auth-subtitle">Log in to your SpendWise account.</p>

      {successMessage && <div className="auth-banner-success">{successMessage}</div>}
      {error && <div className="auth-banner-error">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <div className="auth-input-wrap">
            <MailIcon />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <div className="auth-input-wrap">
            <LockIcon />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="auth-switch">
        New to SpendWise? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
