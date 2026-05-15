import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  ChevronDown,
  Check,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { DEFAULT_CITY, SPECIALTIES } from "@/constants";
import SymptomChat from '@/components/SymptomChat';

export default function Landing() {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mode, setMode] = useState('search');
  const selectedCity = DEFAULT_CITY;
  const navigate = useNavigate();

  const filteredSpecialties = searchQuery.trim().length > 0
    ? SPECIALTIES.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`);
  };

  return (
    <div className="max-w-5xl mx-auto pt-16">
      <section className="py-20 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-8 border border-emerald-100 shadow-sm cursor-default hover:bg-emerald-100 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Trouvez votre médecin à El Jadida - Simplement.
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.15] mb-10">
          Prenez rendez-vous médical en <span className="text-blue-600">quelques secondes</span>.
        </h1>

        <div className="w-full max-w-4xl mx-auto mt-4 mb-2">
          <div className="flex items-center justify-center gap-1 bg-slate-100 rounded-full p-1 mb-4 w-fit mx-auto">
            <button
              onClick={() => setMode('search')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'search' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Search className="h-4 w-4" />
              Rechercher
            </button>
            <button
              onClick={() => setMode('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Sparkles className="h-4 w-4" />
              Analyser mes symptômes
            </button>
          </div>

          {mode === 'search' ? (
            <div className="flex flex-col sm:flex-row sm:items-center bg-white rounded-3xl sm:rounded-full p-2 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 gap-2 sm:gap-0">

              <div className="flex items-center flex-1 sm:border-none border-b border-slate-100">
                <div className="w-full flex items-center hover:bg-slate-50 sm:rounded-full px-4 py-2 transition-colors duration-200 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-slate-200 cursor-text relative">
                  <Search className="h-6 w-6 sm:h-5 sm:w-5 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Spécialité, médecin..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-base sm:text-lg w-full min-w-0"
                  />
                  {showSuggestions && filteredSpecialties.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-1 max-h-60 overflow-y-auto">
                        {filteredSpecialties.map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl cursor-pointer transition-colors"
                            onClick={() => {
                              setSearchQuery(spec);
                              setShowSuggestions(false);
                              navigate(`/search?q=${encodeURIComponent(spec)}&city=${encodeURIComponent(selectedCity)}`);
                            }}
                          >
                            <Search className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-slate-200 shrink-0 mx-1"></div>

              <div className="flex items-center sm:flex-[0.7] px-2 sm:px-1 py-3 sm:py-0 sm:border-none border-b border-slate-100 relative">
                <div
                  className={`w-full flex items-center hover:bg-slate-50 rounded-2xl sm:rounded-full px-4 py-2 transition-colors duration-200 cursor-pointer select-none ${isCityDropdownOpen ? 'bg-white shadow-sm ring-1 ring-slate-200' : ''}`}
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                >
                  <MapPin className="h-6 w-6 sm:h-5 sm:w-5 text-slate-400 mr-3 shrink-0" />
                  <span className="flex-1 text-slate-800 font-medium text-base truncate">El Jadida</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {isCityDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[140px]">
                    <div className="p-1">
                      <div
                        className="flex items-center justify-between px-4 py-3 bg-blue-50/50 text-blue-900 rounded-xl cursor-default transition-colors"
                        onClick={() => setIsCityDropdownOpen(false)}
                      >
                        <span className="font-medium text-base">El Jadida</span>
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="px-4 py-3 text-slate-400 text-sm cursor-not-allowed border-t border-slate-50 mt-1">
                        D'autres villes bientôt...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button size="lg" onClick={handleSearch} className="rounded-full h-12 px-6 sm:px-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
                <span className="sm:hidden lg:inline text-lg sm:text-base">Rechercher</span>
                <Search className="h-5 w-5 hidden sm:inline lg:hidden" />
              </Button>
            </div>
          ) : (
            <SymptomChat onBack={() => setMode('search')} />
          )}
        </div>

        <p className="mt-8 text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
          <MapPin className="h-4 w-4" />
          Disponible Exclusivement à El Jadida.
        </p>
      </section>
    </div>
  );
}
