/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import dayjs from 'dayjs';

/**
 * PUBLIC_INTERFACE
 * SearchForm collects source, destination, and date; invokes onSearch(params)
 */
export default function SearchForm({ initial = {}, onSearch, loading }) {
  const [source, setSource] = useState(initial.source || '');
  const [destination, setDestination] = useState(initial.destination || '');
  const [date, setDate] = useState(initial.date || dayjs().format('YYYY-MM-DD'));

  const canSubmit = source && destination && date;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSearch?.({ source, destination, date });
  };

  return (
    <form className="form" onSubmit={submit} aria-label="Search trains">
      <div className="row">
        <div className="field">
          <label htmlFor="source">Source</label>
          <input className="input" id="source" placeholder="e.g. New York"
                 value={source} onChange={(e)=>setSource(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="destination">Destination</label>
          <input className="input" id="destination" placeholder="e.g. Boston"
                 value={destination} onChange={(e)=>setDestination(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="date">Date</label>
          <input className="input" type="date" id="date"
                 value={date} onChange={(e)=>setDate(e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn ghost" type="button" onClick={()=>{
          setSource(''); setDestination(''); setDate(dayjs().format('YYYY-MM-DD'));
        }}>Reset</button>
        <button className="btn" disabled={!canSubmit || loading} type="submit">
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  );
}
