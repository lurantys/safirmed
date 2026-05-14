import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto pt-16 pb-8 shrink-0 w-full">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="SafirMed Logo" className="h-20 object-contain" />
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">À propos</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Médecins</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <div className="text-sm font-semibold text-slate-600 bg-slate-100/80 px-4 py-2 rounded-lg border border-slate-200">
            Paiement sur place uniquement
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children, showNavbar = true, showFooter = true }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {showNavbar && <Navbar isScrolled={isScrolled} />}
      <main className="flex-1 w-full mx-auto px-6">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
