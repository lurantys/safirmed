import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  ChevronDown,
  Check,
  Phone,
} from "lucide-react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DEFAULT_CITY, SPECIALTIES } from "@/constants";
import { convertToEmbedUrl } from "@/lib/mapsConverter";
import * as XLSX from 'xlsx';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const selectedCity = searchParams.get("city") || DEFAULT_CITY;
  const [isSearching, setIsSearching] = useState(false);

  const filteredSpecialties = searchQuery.trim().length > 0
    ? SPECIALTIES.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    setSearchParams({ q: searchQuery, city: selectedCity }, { replace: true });

    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCity, setSearchParams]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/cabinets_eljadida.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        let headerRow = 0;
        let headers = {};
        const range = XLSX.utils.decode_range(worksheet['!ref']);

        for (let R = 0; R <= Math.min(5, range.e.r); R++) {
          const rowHeaders = {};
          for (let C = 0; C <= range.e.c; C++) {
            const cell = worksheet[XLSX.utils.encode_cell({ c: C, r: R })];
            if (cell?.v) {
              rowHeaders[String(cell.v).trim()] = C;
            }
          }
          if (Object.keys(rowHeaders).length > 3) {
            headerRow = R;
            headers = rowHeaders;
            break;
          }
        }

        const mappedDoctors = [];
        for (let R = headerRow + 1; R <= range.e.r; R++) {
          const nameCell = worksheet[XLSX.utils.encode_cell({ c: headers['Nom du Cabinet / Médecin'] ?? 1, r: R })];
          if (!nameCell?.v) continue;

          const specCell = worksheet[XLSX.utils.encode_cell({ c: headers['Spécialité'] ?? 0, r: R })];
          const phoneCell = worksheet[XLSX.utils.encode_cell({ c: headers['Téléphone'] ?? 2, r: R })];
          const addrCell = worksheet[XLSX.utils.encode_cell({ c: headers['Adresse'] ?? 3, r: R })];
          const linkCell = worksheet[XLSX.utils.encode_cell({ c: headers['Lien Google Maps'] ?? 4, r: R })];

          const nameVal = nameCell?.v ? String(nameCell.v).trim() : '';
          const addrVal = addrCell?.v ? String(addrCell.v).trim() : '';
          const mapsUrl = (linkCell?.l?.Target || linkCell?.v || '').toString().trim();
          const embedUrl = convertToEmbedUrl(mapsUrl, nameVal, addrVal);

          mappedDoctors.push({
            ID: String(mappedDoctors.length + 1),
            Nom: nameVal,
            Spécialité: specCell?.v ? String(specCell.v).trim() : '',
            Téléphone: phoneCell?.v ? String(phoneCell.v).trim() : '',
            Adresse: addrVal,
            Ville: 'El Jadida',
            mapsUrl,
            embedUrl
          });
        }

        setDoctors(mappedDoctors);
      } catch (error) {
        console.error("Error loading doctors from XLSX:", error);
      }
    };
    fetchDoctors();
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
    <div className="max-w-5xl mx-auto pt-16">
      <section className="pt-24 pb-8 flex flex-col items-center text-center">
        <div className="w-full max-w-4xl mx-auto mb-2">
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                    <div className="p-1 max-h-60 overflow-y-auto">
                      {filteredSpecialties.map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl cursor-pointer transition-colors"
                          onClick={() => {
                            setSearchQuery(spec);
                            setShowSuggestions(false);
                          }}
                        >
                          <Search className="h-4 w-4 text-slate-400" />
                          <span className="font-medium flex-1">{spec}</span>
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
                <span className="flex-1 text-slate-800 font-medium text-base truncate">{DEFAULT_CITY}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[140px]">
                  <div className="p-1">
                    <div
                      className="flex items-center justify-between px-4 py-3 bg-blue-50/50 text-blue-900 rounded-xl cursor-default transition-colors"
                      onClick={() => setIsCityDropdownOpen(false)}
                    >
                      <span className="font-medium text-base">{DEFAULT_CITY}</span>
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="px-4 py-3 text-slate-400 text-sm cursor-not-allowed border-t border-slate-50 mt-1">
                      D'autres villes bientôt...
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button size="lg" onClick={() => setSearchParams({ q: searchQuery, city: selectedCity }, { replace: true })} className="rounded-full h-12 px-6 sm:px-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
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

      <section className="py-12 border-t border-slate-100 bg-slate-50/50">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {searchQuery ? `Résultats pour "${searchQuery}"` : "Médecins recommandés"}
          </h2>
          <span className="text-slate-500 font-medium bg-slate-100 px-4 py-1.5 rounded-full text-sm">
            {isSearching ? "Recherche..." : `${filteredDoctors.length} ${filteredDoctors.length > 1 ? 'résultats correspondants' : 'résultat correspondant'}`}
          </span>
        </div>

        {isSearching ? (
          <div className="grid md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 h-40 flex items-center gap-6">
                <div className="h-16 w-16 bg-slate-100 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-1/2"></div>
                  <div className="h-3 bg-slate-100 rounded-full w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredDoctors.map((doc, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[1.5rem] shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-lg hover:shadow-blue-200/20 hover:border-blue-100 transition-all group flex flex-col h-full">
                <div className="flex gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 group-hover:scale-110 transition-all duration-300 border-2 border-slate-100 group-hover:border-blue-200 shadow-sm bg-white p-1">
                    <img src="/doctor-avatar.png" alt="Profile" className="w-full h-full object-contain drop-shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => navigate(`/doctor/${doc.ID}`)}
                      className="font-bold text-lg text-slate-900 mb-1 tracking-tight transition-colors cursor-pointer hover:text-blue-600 hover:underline decoration-blue-200 underline-offset-4 line-clamp-2"
                    >
                      {doc.Nom}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm bg-blue-50 w-fit px-2 py-0.5 rounded-full">{doc.Spécialité}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-500 font-medium mb-4 flex-1">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                    <span className="break-words">{doc.Adresse ? `${doc.Adresse}, ` : ""}{doc.Ville}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>{doc.Téléphone}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={doc.mapsUrl || `https://maps.google.com/maps?q=${encodeURIComponent(doc.Nom + ', ' + doc.Adresse)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-white border border-slate-100 text-slate-700 hover:bg-slate-50 shadow-sm"
                  >
                    Voir sur Maps
                  </a>

                  <Button onClick={() => navigate(`/doctor/${doc.ID}`)} className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md focus:ring-4 focus:ring-blue-100 hover:scale-105 active:scale-95">
                    Prendre RDV
                  </Button>
                </div>
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
    </div>
  );
}
