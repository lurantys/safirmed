import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto pt-12 sm:pt-16 pb-8 shrink-0 w-full">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-left">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">SafirMed</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Accueil</button></li>
              <li><button onClick={() => navigate('/search')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Rechercher un médecin</button></li>
              <li><button onClick={() => navigate('/signin')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Connexion</button></li>
              <li><button onClick={() => navigate('/signup')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Inscription</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Spécialités à El Jadida</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/el-jadida/medecine-generale')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Médecin généraliste</button></li>
              <li><button onClick={() => navigate('/el-jadida/cardiologie')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Cardiologue</button></li>
              <li><button onClick={() => navigate('/el-jadida/dentaire')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Dentiste</button></li>
              <li><button onClick={() => navigate('/el-jadida/orl')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">ORL</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Spécialités</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/el-jadida/ophtalmologie')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Ophtalmologue</button></li>
              <li><button onClick={() => navigate('/el-jadida/pediatrie')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Pédiatre</button></li>
              <li><button onClick={() => navigate('/el-jadida/gynecologie-obstetrique')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Gynécologue</button></li>
              <li><button onClick={() => navigate('/el-jadida/dermatologie')} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Dermatologue</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Légal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-slate-500">Paiement sur place uniquement</span></li>
              <li><span className="text-sm text-slate-500">Maroc</span></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="SafirMed Logo" className="h-16 sm:h-20 object-contain" />
          </div>
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} SafirMed. Tous droits réservés.</p>
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
