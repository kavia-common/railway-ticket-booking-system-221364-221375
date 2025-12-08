import React, { useEffect, useState } from 'react';
import api from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Schedules page renders list of schedules from backend
 */
export default function Schedules() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get('/trains/schedules');
        setItems(Array.isArray(data) ? data : data?.schedules || []);
      } catch (e) {
        setErr(e.message || 'Failed to fetch schedules');
      }
    })();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="title">Schedules</div>
        <div className="subtitle">All upcoming train schedules</div>
      </div>

      {err ? <div style={{ color: 'var(--error)' }}>{err}</div> : null}

      <div className="list">
        {items.map((s, idx) => (
          <div key={idx} className="card grid cols-4">
            <div><strong>Train:</strong> {s.train_name || s.trainId || s.train}</div>
            <div><strong>Departure:</strong> {s.departure}</div>
            <div><strong>Arrival:</strong> {s.arrival}</div>
            <div><strong>Price:</strong> {s.price ? `$${Number(s.price).toFixed(2)}` : '-'}</div>
          </div>
        ))}
        {items.length === 0 ? <div className="subtitle">No schedules found.</div> : null}
      </div>
    </div>
  );
}
