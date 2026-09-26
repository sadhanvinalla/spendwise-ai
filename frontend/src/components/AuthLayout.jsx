import '../styles/auth.css';

export default function AuthLayout({ headline, subheadline, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-top">
          <span className="auth-wordmark">SpendWise</span>
        </div>

        <div className="auth-brand-copy">
          <h1>{headline}</h1>
          <p>{subheadline}</p>
        </div>

        <div className="auth-stat-card" aria-hidden="true">
          <span className="auth-stat-label">This month's saving rate</span>
          <span className="auth-stat-value">+18%</span>
          <div className="auth-stat-bars">
            <span style={{ height: '35%' }} />
            <span style={{ height: '52%' }} />
            <span style={{ height: '40%' }} />
            <span style={{ height: '68%' }} />
            <span style={{ height: '58%' }} />
            <span style={{ height: '82%' }} />
          </div>
        </div>

        <p className="auth-brand-footnote">
          Built for students. Explainable AI, not a black box.
        </p>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">{children}</div>
      </div>
    </div>
  );
}
