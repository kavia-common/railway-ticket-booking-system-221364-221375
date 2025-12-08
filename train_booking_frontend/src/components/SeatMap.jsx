/* eslint-disable react/prop-types */
import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SeatMap renders a clickable seat grid; reserved seats disabled; emits onChange(selectedSeats)
 */
export default function SeatMap({ layout = [], selected = [], onChange }) {
  const toggle = (seat) => {
    if (seat.reserved) return;
    const exists = selected.includes(seat.code);
    const next = exists ? selected.filter(s => s !== seat.code) : [...selected, seat.code];
    onChange?.(next);
  };

  return (
    <div className="seat-map" role="grid" aria-label="Seat map">
      {layout.map((seat) => (
        <div
          role="gridcell"
          key={seat.code}
          className={[
            'seat',
            seat.reserved ? 'reserved' : '',
            selected.includes(seat.code) ? 'selected' : '',
          ].join(' ')}
          onClick={() => toggle(seat)}
          aria-disabled={seat.reserved}
          aria-pressed={selected.includes(seat.code)}
        >
          {seat.code}
        </div>
      ))}
    </div>
  );
}
