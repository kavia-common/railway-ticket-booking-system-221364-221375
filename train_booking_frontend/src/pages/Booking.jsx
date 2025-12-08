import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import SeatMap from '../components/SeatMap';
import api from '../api/client';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Booking page loads seat availability, allows selection, and posts booking
 */
export default function Booking() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [layout, setLayout] = useState([]);
  const [selected, setSelected] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [train, setTrain] = useState(null);

  useEffect(() => {
    (async () => {
      setErr('');
      try {
        const info = await api.get(`/trains/${trainId}`);
        setTrain(info || null);
      } catch {}
      try {
        const data = await api.get(`/bookings/availability?trainId=${encodeURIComponent(trainId)}`);
        // Expect data like { seats: [{ code, reserved }, ...] }
        const seats = Array.isArray(data) ? data : (data?.seats || []);
        setLayout(seats);
      } catch (e) {
        setErr(e.message || 'Failed to load seat availability');
      }
    })();
  }, [trainId]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const book = async () => {
    setLoading(true);
    setErr('');
    try {
      const payload = await api.post('/bookings', {
        trainId,
        seats: selected
      });
      const bookingId = payload?.id || payload?.bookingId;
      if (bookingId) {
        navigate(`/payment/${bookingId}`);
      } else {
        setErr('Booking created but no booking ID returned.');
      }
    } catch (e) {
      setErr(e.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Seat Selection</div>
          <div className="subtitle">Choose your seats for Train {train?.name || trainId}</div>
        </div>
        <div>
          <span className="kbd">Selected: {selected.length}</span>
        </div>
      </div>

      {err ? <div style={{ color: 'var(--error)', marginBottom: 8 }}>{err}</div> : null}

      <div className="card">
        <div className="subtitle" style={{ marginBottom: 8 }}>Tap to select seats</div>
        <SeatMap layout={layout} selected={selected} onChange={setSelected} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
        <button className="btn ghost" onClick={() => setSelected([])}>Clear</button>
        <button className="btn" disabled={loading || selected.length === 0} onClick={book}>
          {loading ? 'Booking…' : `Book ${selected.length} seat(s)`}
        </button>
      </div>
    </div>
  );
}
