import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HomeIcon, ListIcon, TargetIcon, LogoutIcon } from './icons';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '');

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">SpendWise</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={linkClass}>
          <HomeIcon /> Dashboard
        </NavLink>
        <NavLink to="/transactions" className={linkClass}>
          <ListIcon /> Transactions
        </NavLink>
        <NavLink to="/budget" className={linkClass}>
          <TargetIcon /> Budget
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-avatar">{(user?.email || '?')[0].toUpperCase()}</span>
          <span className="sidebar-user-email">{user?.email}</span>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogoutIcon /> Logout
        </button>
      </div>
    </aside>
  );
}
