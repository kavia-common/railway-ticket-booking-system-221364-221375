import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Navbar component with navigation links, login/logout buttons, and theme toggle
 */
export default function Navbar({ theme, onToggleTheme }) {
  const auth = useAuth();
  const navigate = useNavigate();

  const activeClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <nav className="navbar">
      <div className="brand" role="heading" aria-level={1}>RailLite</div>
      <div className="nav-links">
        <NavLink to="/search" className={activeClass}>Search</NavLink>
        <NavLink to="/schedules" className={activeClass}>Schedules</NavLink>
        <NavLink to="/history" className={activeClass}>History</NavLink>
        <NavLink to="/notifications" className={activeClass}>Notifications</NavLink>
      </div>
      <div className="spacer" />
      <button className="btn ghost" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {auth?.isAuthenticated ? (
        <>
          <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>
            {auth?.user?.name || auth?.user?.email}
          </span>
          <button className="btn" onClick={() => { auth.logout(); navigate('/login'); }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button className="btn ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="btn" onClick={() => navigate('/register')}>Register</button>
        </>
      )}
    </nav>
  );
}
