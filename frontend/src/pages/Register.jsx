import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

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

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Fill in every field to create your account.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/login', { state: { registered: true, prefillEmail: email } });
    } catch (err) {
      const message = err.response?.data?.error || 'Could not create your account. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Start building better spending habits."
      subheadline="A few details and you're set — no spreadsheets, no guesswork."
    >
      <h2>Create your account</h2>
      <p className="auth-subtitle">It takes less than a minute.</p>

      {error && <div className="auth-banner-error">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="name">Full name</label>
          <div className="auth-input-wrap">
            <UserIcon />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Sharma"
              autoComplete="name"
            />
          </div>
        </div>

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <div className="auth-input-wrap">
            <LockIcon />
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
