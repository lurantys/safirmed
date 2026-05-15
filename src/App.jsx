import { Routes, Route } from 'react-router-dom';
import Layout from "@/components/Layout";
import Landing from './pages/Landing';
import SearchPage from './pages/Search';
import DoctorDetail from './pages/DoctorDetail';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CitySpecialtyPage from './pages/CitySpecialtyPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/search" element={<Layout><SearchPage /></Layout>} />
      <Route path="/doctor/:id" element={<Layout showNavbar={false}><DoctorDetail /></Layout>} />
      <Route path="/signin" element={<Layout><SignIn /></Layout>} />
      <Route path="/signup" element={<Layout><SignUp /></Layout>} />
      <Route path="/:city/:specialty" element={<Layout><CitySpecialtyPage /></Layout>} />
    </Routes>
  );
}
