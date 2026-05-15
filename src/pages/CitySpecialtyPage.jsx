import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone } from "lucide-react";
import SEOHead from '@/components/seo/SEOHead';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import FAQSection from '@/components/seo/FAQSection';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { cityBySlug } from '@/seo/cities';
import { SPECIALTIES_DATA, specialtyBySlug } from '@/seo/specialties';
import * as XLSX from 'xlsx';

export default function CitySpecialtyPage() {
  const { city: citySlug, specialty: specialtySlug } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const city = cityBySlug(citySlug);
  const specialty = specialtyBySlug(specialtySlug);
  const cityName = city?.name || citySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'El Jadida';
  const specialtyName = specialty?.name || specialtySlug?.replace(/-/g, ' ') || 'Médecine Générale';

  const metaTitle = `${specialtyName} à ${cityName} – Trouvez un médecin`;
  const metaDesc = `Trouvez les meilleurs médecins en ${specialtyName.toLowerCase()} à ${cityName}. Consultez les disponibilités, adresses et prenez rendez-vous en ligne.`;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/cabinets_resolved.json');
        const data = await response.json();
        setDoctors(data.filter(d => {
          const matchesSpecialty = d.Spécialité?.toLowerCase().includes(specialtyName.toLowerCase());
          const matchesCity = d.Ville?.toLowerCase() === cityName.toLowerCase();
          return matchesSpecialty && matchesCity;
        }));
      } catch (e) {
        console.error('Failed to load doctors:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [cityName, specialtyName]);

  const relatedSpecialties = SPECIALTIES_DATA.filter(s => s.slug !== specialtySlug);

  const faqItems = [
    { question: `Comment prendre rendez-vous avec un ${specialtyName.toLowerCase()} à ${cityName} ?`, answer: `Vous pouvez consulter la liste des médecins ${specialtyName.toLowerCase()} à ${cityName} ci-dessus, puis les contacter directement par téléphone ou WhatsApp pour prendre rendez-vous.` },
    { question: `Quels sont les honoraires d'un ${specialtyName.toLowerCase()} à ${cityName} ?`, answer: `Les honoraires varient selon le praticien. Nous vous recommandons de contacter directement le cabinet pour connaître les tarifs. Le paiement se fait sur place.` },
    { question: `Y a-t-il des urgences ${specialtyName.toLowerCase()} à ${cityName} ?`, answer: `En cas d'urgence, contactez directement le cabinet médical ou appelez les urgences (15). Certains médecins proposent des créneaux d'urgence.` },
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto pt-24">
        <SEOHead title={metaTitle} description={metaDesc} canonical={`/${citySlug}/${specialtySlug}`} />
        <div className="flex items-center justify-center min-h-[40vh] text-slate-500 font-medium">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pt-24">
      <SEOHead title={metaTitle} description={metaDesc} canonical={`/${citySlug}/${specialtySlug}`} />

      <div className="px-6">
        <Breadcrumbs items={[
          { name: 'Accueil', path: '/' },
          { name: `${specialtyName} à ${cityName}`, path: `/${citySlug}/${specialtySlug}` },
        ]} />

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {specialtyName} à {cityName}
        </h1>
        <p className="text-slate-500 text-base sm:text-lg mb-8 max-w-2xl">
          {metaDesc}
        </p>

        {doctors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200/60 shadow-sm mb-8">
            <div className="h-20 w-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 opacity-50" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Aucun médecin trouvé</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-8 text-base">
              Nous n'avons pas encore répertorié de médecins {specialtyName.toLowerCase()} à {cityName}.
            </p>
            <Button onClick={() => navigate('/')} className="rounded-full font-semibold">
              Retour à l'accueil
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              {doctors.length} médecin{doctors.length > 1 ? 's' : ''} trouvé{doctors.length > 1 ? 's' : ''}
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {doctors.map((doc) => (
                <div key={doc.ID} className="bg-white p-6 rounded-[1.5rem] shadow-sm shadow-slate-200/50 border border-slate-100 hover:shadow-lg hover:shadow-blue-200/20 hover:border-blue-100 transition-all group flex flex-col h-full">
                  <div className="flex gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 group-hover:scale-110 transition-all duration-300 border-2 border-slate-100 group-hover:border-blue-200 shadow-sm bg-white p-1">
                      <img src="/doctor-avatar.png" alt={doc.Nom} className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        onClick={() => navigate(`/doctor/${doc.ID}`)}
                        className="font-bold text-lg text-slate-900 mb-1 tracking-tight transition-colors cursor-pointer hover:text-blue-600 hover:underline decoration-blue-200 underline-offset-4 line-clamp-2"
                      >
                        {doc.Nom}
                      </h2>
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
                  <Button
                    onClick={() => navigate(`/doctor/${doc.ID}`)}
                    className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md focus:ring-4 focus:ring-blue-100 hover:scale-105 active:scale-95"
                  >
                    Prendre RDV
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="space-y-6 mb-12">
          <RelatedLinks
            title={`Autres spécialités à ${cityName}`}
            links={relatedSpecialties.map(s => ({
              name: `${s.name} à ${cityName}`,
              path: `/${citySlug}/${s.slug}`,
            }))}
          />

          <FAQSection items={faqItems} />
        </div>
      </div>
    </div>
  );
}
