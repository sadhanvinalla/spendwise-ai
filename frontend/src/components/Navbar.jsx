import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">SpendWise</div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/budget">Budget</Link>
      </div>
      <div className="navbar-user">
        <span>{user?.email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
