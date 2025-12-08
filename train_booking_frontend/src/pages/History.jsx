import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/client';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * History page shows user's previous bookings
 */
export default function History() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  // Always declare hooks unconditionally
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const data = await api.get('/bookings/mine');
        setItems(Array.isArray(data) ? data : data?.bookings || []);
      } catch (e) {
        setErr(e.message || 'Failed to load history');
      }
    })();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="container">
      <div className="header">
        <div className="title">Booking History</div>
        <div className="subtitle">Your past and upcoming trips</div>
      </div>

      {err ? <div style={{ color: 'var(--error)' }}>{err}</div> : null}

      <div className="list">
        {items.map((b) => (
          <div key={b.id} className="card grid cols-4">
            <div><strong>Train:</strong> {b.train_name || b.trainId}</div>
            <div><strong>Seats:</strong> {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</div>
            <div><strong>Status:</strong> {b.status}</div>
            <div><strong>Date:</strong> {b.date || b.created_at}</div>
          </div>
        ))}
        {items.length === 0 ? <div className="subtitle">No bookings yet.</div> : null}
      </div>
    </div>
  );
}
