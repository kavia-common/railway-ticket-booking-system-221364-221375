import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Register form page
 */
export default function Register() {
  const { register, isAuthenticated, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/search" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(name, email, password);
      navigate('/search');
    } catch (error) {
      setErr(error?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Create account</div>
          <div className="subtitle">Join and book your next trip</div>
        </div>
      </div>
      <form className="form" onSubmit={submit}>
        {err ? <div style={{ color: 'var(--error)' }}>{err}</div> : null}
        <div className="field">
          <label htmlFor="name">Name</label>
          <input className="input" id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input className="input" id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input className="input" id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Link to="/login" className="btn ghost" role="button">Sign in</Link>
          <button className="btn" type="submit" disabled={loading || !email || !password || !name}>
            {loading ? 'Creating…' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}
