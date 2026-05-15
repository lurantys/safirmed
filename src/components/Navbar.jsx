import { Button } from "@/components/ui/button";
import { Menu, ArrowUpRight, LogOut, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar({ isScrolled = false }) {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-4 px-4' : 'pt-0 px-0'}`}>
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled
          ? 'max-w-5xl bg-white/90 backdrop-blur-md shadow-lg rounded-full px-5 h-14 border border-slate-200/60'
          : 'max-w-6xl bg-slate-50 px-8 h-24 border-b border-transparent'
        }`}
      >
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img src="/logo.png" alt="SafirMed Logo" className={`transition-all ${isScrolled ? 'h-14' : 'h-20'} object-contain`} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                <User className="h-4 w-4" />
                <span className="truncate max-w-[120px]">{profile?.name || user.email}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="rounded-full text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/signin')} className={`hidden sm:flex rounded-full font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all ${isScrolled ? 'h-9 px-4 text-sm' : 'h-11 px-5 text-base'}`}>
                Se connecter
              </Button>
              <Button onClick={() => navigate('/signup')} className={`rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all focus:ring-slate-900 items-center gap-2 border border-transparent hover:scale-105 active:scale-95 ${isScrolled ? 'h-9 px-5 text-sm' : 'h-11 px-6 text-base'}`}>
                S'inscrire
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="sm:hidden -mr-2 hover:bg-slate-100/50">
            <Menu className="h-6 w-6 text-slate-700" />
          </Button>
        </div>
      </nav>
    </div>
  );
}
