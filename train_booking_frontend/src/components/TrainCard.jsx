/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * TrainCard shows train info and CTA to view schedules or book
 */
export default function TrainCard({ train, onViewSchedules }) {
  const navigate = useNavigate();
  const { id, name, from, to, duration, price } = train;

  return (
    <div className="card train-card" aria-label={`Train ${name}`}>
      <div>
        <div className="title">{name}</div>
        <div className="train-meta">
          <div>From: <strong>{from}</strong></div>
          <div>To: <strong>{to}</strong></div>
          {duration ? <div>Duration: {duration}</div> : null}
          {price != null ? <div>From ${Number(price).toFixed(2)}</div> : null}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn ghost" onClick={() => onViewSchedules?.(id)}>View Schedules</button>
        <button className="btn" onClick={() => navigate(`/booking/${id}`)}>Book</button>
      </div>
    </div>
  );
}
