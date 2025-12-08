import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import TrainCard from '../components/TrainCard';
import api from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Search page to find trains and show results
 */
export default function Search() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [schedules, setSchedules] = useState({}); // trainId -> schedules

  const onSearch = async (params) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.post('/trains/search', params);
      setResults(Array.isArray(data) ? data : data?.trains || []);
    } catch (e) {
      setError(e.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const viewSchedules = async (trainId) => {
    try {
      const data = await api.get(`/trains/${trainId}/schedules`);
      setSchedules((prev) => ({ ...prev, [trainId]: data?.schedules || data || [] }));
    } catch (e) {
      setError(e.message || 'Failed to load schedules');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="title">Search Trains</div>
          <div className="subtitle">Find the best route for your date</div>
        </div>
      </div>

      <SearchForm onSearch={onSearch} loading={loading} />

      {error ? <div style={{ color: 'var(--error)', marginTop: 12 }}>{error}</div> : null}

      <div className="grid" style={{ marginTop: 16 }}>
        {results.map((t) => (
          <div key={t.id}>
            <TrainCard train={t} onViewSchedules={viewSchedules} />
            {Array.isArray(schedules[t.id]) && schedules[t.id].length > 0 ? (
              <div className="card">
                <div className="subtitle">Upcoming schedules</div>
                <div className="list">
                  {schedules[t.id].map((s, idx) => (
                    <div key={idx} className="grid cols-3">
                      <div><strong>Departure:</strong> {s.departure}</div>
                      <div><strong>Arrival:</strong> {s.arrival}</div>
                      <div><strong>Price:</strong> {s.price ? `$${Number(s.price).toFixed(2)}` : '-'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
        {results.length === 0 && !loading ? <div className="subtitle">No results yet. Try a search above.</div> : null}
      </div>
    </div>
  );
}
