import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/client';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Notifications page shows latest alerts and updates
 */
export default function Notifications() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  // Always declare hooks; guard logic inside
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const data = await api.get('/notifications');
        setItems(Array.isArray(data) ? data : data?.notifications || []);
      } catch (e) {
        setErr(e.message || 'Failed to load notifications');
      }
    })();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="container">
      <div className="header">
        <div className="title">Notifications</div>
        <div className="subtitle">Recent updates and alerts</div>
      </div>

      {err ? <div style={{ color: 'var(--error)' }}>{err}</div> : null}

      <div className="list">
        {items.map((n) => (
          <div key={n.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="title" style={{ fontSize: 16 }}>{n.title || 'Notification'}</div>
              <div className="subtitle">{n.time || n.created_at}</div>
            </div>
            <div>{n.message || n.body}</div>
          </div>
        ))}
        {items.length === 0 ? <div className="subtitle">No notifications.</div> : null}
      </div>
    </div>
  );
}
