import { Routes, Route } from 'react-router-dom';
import Layout from "@/components/Layout";
import Landing from './pages/Landing';
import SearchPage from './pages/Search';
import DoctorDetail from './pages/DoctorDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/search" element={<Layout><SearchPage /></Layout>} />
      <Route path="/doctor/:id" element={<Layout showNavbar={false}><DoctorDetail /></Layout>} />
    </Routes>
  );
}
