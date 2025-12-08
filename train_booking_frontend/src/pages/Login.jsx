import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Login form page
 */
export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/search" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      navigate('/search');
    } catch (error) {
      setErr(error?.message || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Welcome back</div>
          <div className="subtitle">Login to continue booking</div>
        </div>
      </div>
      <form className="form" onSubmit={submit}>
        {err ? <div style={{ color: 'var(--error)' }}>{err}</div> : null}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input className="input" id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input className="input" id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Link to="/register" className="btn ghost" role="button">Create account</Link>
          <button className="btn" type="submit" disabled={loading || !email || !password}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}
