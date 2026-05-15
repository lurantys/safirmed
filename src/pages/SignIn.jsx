import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === 'auth/invalid-credential') setError('Email ou mot de passe incorrect');
      else setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  const handleGoogleSignIn = () => {
    setProcessing(true);
    signInWithRedirect(auth, googleProvider);
  };

  return (
    <div className="max-w-md mx-auto pt-24">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Connexion</h1>
        <p className="text-slate-500 text-center mb-8">Connectez-vous à votre compte SafirMed</p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
            <Mail className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
            <Lock className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <Button type="submit" disabled={processing} className="w-full rounded-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50">
            {processing ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white px-4 text-slate-400">ou</span></div>
        </div>

        <Button onClick={handleGoogleSignIn} disabled={processing} className="w-full rounded-full h-12 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
          <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continuer avec Google
        </Button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Pas encore de compte ? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
