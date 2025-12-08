import React, { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/client';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Payment page initiates payment, polls status, and finalizes
 */
export default function Payment() {
  const { bookingId } = useParams();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('pending'); // pending | paid | failed
  const [payment, setPayment] = useState(null);
  const [err, setErr] = useState('');
  const [creating, setCreating] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const createPayment = async () => {
    setCreating(true);
    setErr('');
    try {
      const data = await api.post('/payments/create', { bookingId });
      setPayment(data);
    } catch (e) {
      setErr(e.message || 'Failed to initiate payment');
    } finally {
      setCreating(false);
    }
  };

  const checkStatus = async () => {
    try {
      const id = payment?.id || bookingId;
      if (!id) return;
      const resp = await api.get(`/payments/${id}/status`);
      const s = resp?.status || resp;
      setStatus(s);
      if (s === 'paid' || s === 'failed') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (e) {
      setErr(e.message || 'Failed to check payment status');
    }
  };

  // Always declare hooks; guard logic within
  useEffect(() => {
    if (!isAuthenticated) return;
    // Auto-initiate payment on mount or when bookingId changes
    createPayment();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (payment && !intervalRef.current) {
      intervalRef.current = setInterval(checkStatus, 2000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Payment</div>
          <div className="subtitle">Complete your booking payment</div>
        </div>
      </div>

      {err ? <div style={{ color: 'var(--error)', marginBottom: 8 }}>{err}</div> : null}

      <div className="card">
        <div><strong>Booking:</strong> {bookingId}</div>
        <div><strong>Status:</strong> {status}</div>
        {payment?.amount ? <div><strong>Amount:</strong> ${Number(payment.amount).toFixed(2)}</div> : null}
        {payment?.provider ? <div><strong>Provider:</strong> {payment.provider}</div> : null}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
          <button className="btn ghost" onClick={() => navigate('/history')}>Go to History</button>
          <button className="btn" disabled={creating || status === 'paid'} onClick={createPayment}>
            {creating ? 'Re-initializing…' : 'Re-initiate'}
          </button>
        </div>
      </div>
    </div>
  );
}
