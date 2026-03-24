import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Search,
  CalendarCheck,
  MapPin,
  ArrowUpRight,
  Heart,
  Menu,
  ChevronDown,
  Check,
  Phone
} from "lucide-react";
import * as XLSX from 'xlsx';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "El Jadida");

  useEffect(() => {
    setSearchParams({ q: searchQuery, city: selectedCity }, { replace: true });
  }, [searchQuery, selectedCity, setSearchParams]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/SafirMed.xlsx');
        if (!response.ok) throw new Error('Network response was not ok');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Ensure every doctor has an ID based on row index since real excel lacks it
        const doctorsWithIds = json.map((doc, idx) => ({ ...doc, ID: (idx + 1).toString() }));
        setDoctors(doctorsWithIds);
      } catch (error) {
        console.error("Error loading doctors from Excel:", error);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const searchString = searchQuery.toLowerCase();
    const docName = doc.Nom ? String(doc.Nom).toLowerCase() : "";
    const docSpecialty = doc.Spécialité ? String(doc.Spécialité).toLowerCase() : "";
    const matchesSearch = docName.includes(searchString) || docSpecialty.includes(searchString);
    const matchesCity = selectedCity === 'Toutes' || (doc.Ville && String(doc.Ville).toLowerCase() === selectedCity.toLowerCase());
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Floating Navbar */}
      <div className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-6 px-4' : 'pt-0 px-0'}`}>
        <nav
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled
            ? 'max-w-4xl bg-white/90 backdrop-blur-md shadow-lg rounded-full px-5 h-16 border border-slate-200/60'
            : 'max-w-5xl bg-slate-50 px-6 h-24 border-b border-transparent'
            }`}
        >
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <Heart className={`text-blue-600 transition-all ${isScrolled ? 'h-6 w-6' : 'h-8 w-8'} fill-blue-600`} />
            <span className={`font-bold tracking-tight text-slate-900 transition-all ${isScrolled ? 'text-lg' : 'text-2xl'}`}>
              Safir<span className="text-blue-600">Med</span>
            </span>
          </div>



          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" className={`hidden sm:flex rounded-full font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all ${isScrolled ? 'h-10 px-4 text-sm' : 'h-11 px-5 text-base'}`}>
              Patients
            </Button>
            <Button className={`hidden sm:flex rounded-full bg-[#18181A] hover:bg-black text-white shadow-sm transition-all focus:ring-slate-900 items-center gap-2 border border-transparent hover:scale-105 active:scale-95 ${isScrolled ? 'h-10 px-5 text-sm' : 'h-11 px-6 text-base'}`}>
              Docteurs / Soignants <ArrowUpRight className={isScrolled ? 'h-4 w-4' : 'h-4 w-4 text-white/80'} />
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden -mr-2 hover:bg-slate-100/50">
              <Menu className="h-6 w-6 text-slate-700" />
            </Button>
          </div>
        </nav>
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-16">
        {/* SEARCH BAR SECTION */}
        <section className="pt-24 pb-8 flex flex-col items-center text-center">
          <div className="w-full max-w-4xl mx-auto mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center bg-white rounded-3xl sm:rounded-full p-2 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 gap-2 sm:gap-0">

              <div className="flex items-center flex-1 sm:border-none border-b border-slate-100">
                <div className="w-full flex items-center hover:bg-slate-50 sm:rounded-full px-4 py-2 transition-colors duration-200 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-slate-200 cursor-text">
                  <Search className="h-6 w-6 sm:h-5 sm:w-5 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Spécialité, médecin..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-base sm:text-lg w-full min-w-0"
                  />
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

              <div className="hidden sm:block w-px h-8 bg-slate-200 shrink-0 mx-1"></div>

              <div className="flex items-center sm:flex-[0.6] px-2 sm:px-1 py-3 sm:py-0">
                <div className="w-full flex items-center hover:bg-slate-50 rounded-2xl sm:rounded-full px-4 py-2 transition-colors duration-200 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-slate-200">
                  <CalendarCheck className="h-6 w-6 sm:h-5 sm:w-5 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="bg-transparent border-none outline-none text-slate-800 font-medium text-base w-full min-w-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 transition-opacity"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>

              <Button size="lg" className="rounded-full h-12 px-6 sm:px-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
                <span className="sm:hidden lg:inline text-lg sm:text-base">Rechercher</span>
                <Search className="h-5 w-5 hidden sm:inline lg:hidden" />
              </Button>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-400 font-medium flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            Disponible Exclusivement à El Jadida.
          </p>
        </section>

        {/* DOCTORS RESULTS SECTION */}
        <section className="py-12 border-t border-slate-100 bg-slate-50/50">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {searchQuery ? `Résultats pour "${searchQuery}"` : "Médecins recommandés"}
            </h2>
            <span className="text-slate-500 font-medium bg-slate-100 px-4 py-1.5 rounded-full text-sm">
              {filteredDoctors.length} {filteredDoctors.length > 1 ? 'résultats correspondants' : 'résultat correspondant'}
            </span>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredDoctors.map((doc, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[1.5rem] shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-lg hover:shadow-blue-200/20 hover:border-blue-100 transition-all group flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                  <div className="h-20 w-20 sm:h-16 sm:w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl sm:text-xl shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {doc.Nom ? String(doc.Nom).replace("Dr. ", "").charAt(0) : "D"}
                  </div>
                  <div className="flex-1 flex flex-col items-center sm:items-start w-full">
                    <h3
                      onClick={() => navigate(`/doctor/${doc.ID}`)}
                      className="font-bold text-lg text-slate-900 mb-1 tracking-tight transition-colors cursor-pointer hover:text-blue-600 hover:underline decoration-blue-200 underline-offset-4"
                    >
                      {doc.Nom}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm mb-3 bg-blue-50 w-fit px-2 py-0.5 rounded-full">{doc.Spécialité}</p>

                    <div className="space-y-2 text-sm text-slate-500 font-medium">
                      <div className="flex items-center justify-center sm:justify-start gap-2.5">
                        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="truncate">{doc.Adresse ? `${doc.Adresse}, ` : ""}{doc.Ville}</span>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2.5">
                        <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>{doc.Téléphone}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => navigate(`/doctor/${doc.ID}`)} className="w-full sm:w-auto rounded-2xl sm:rounded-full bg-slate-900 hover:bg-blue-600 text-white font-semibold transition-all shadow-md shrink-0 focus:ring-4 focus:ring-blue-100 hover:scale-105 active:scale-95 whitespace-normal h-auto py-3 min-h-[48px]">
                    Prendre RDV
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200/60 shadow-sm">
              <div className="h-20 w-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Aucun médecin trouvé</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 text-lg">
                Nous n'avons trouvé aucun médecin correspondant à "<span className="font-medium text-slate-700">{searchQuery}</span>".
              </p>
              <Button size="lg" className="rounded-full font-semibold shadow-sm hover:scale-105 transition-transform" onClick={() => setSearchQuery("")}>
                Effacer la recherche
              </Button>
            </div>
          )}
        </section>


      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 mt-auto pt-16 pb-8 shrink-0 w-full">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
              <Heart className="h-6 w-6 text-blue-600 fill-blue-600" />
              <span className="font-bold text-2xl tracking-tight text-slate-900">Safir<span className="text-blue-600">Med</span></span>
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
    </div>
  );
}
