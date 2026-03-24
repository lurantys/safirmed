import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import SearchPage from './pages/Search';
import DoctorDetail from './pages/DoctorDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/doctor/:id" element={<DoctorDetail />} />
    </Routes>
  );
}
