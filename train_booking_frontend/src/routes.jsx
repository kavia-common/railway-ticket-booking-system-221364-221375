import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Schedules from './pages/Schedules';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import History from './pages/History';
import Notifications from './pages/Notifications';

/**
 * PUBLIC_INTERFACE
 * Centralized routes definition for SPA
 */
export default function RoutesContainer() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/search" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<Search />} />
      <Route path="/schedules" element={<Schedules />} />
      <Route path="/booking/:trainId" element={<Booking />} />
      <Route path="/payment/:bookingId" element={<Payment />} />
      <Route path="/history" element={<History />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="*" element={<div className="container"><div className="title">404</div><div className="subtitle">Page not found</div></div>} />
    </Routes>
  );
}
