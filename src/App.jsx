import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PhoneOff,
  Clock,
  SearchX,
  UserX,
  Search,
  CalendarCheck,
  MessageSquare,
  Activity,
  Bell,
  UserCheck,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Heart,
  Menu
} from "lucide-react";

export default function SafirMedLanding() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Floating Navbar */}
      <div className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-6 px-4' : 'pt-0 px-0'}`}>
        <nav
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled
            ? 'max-w-4xl bg-white/90 backdrop-blur-md shadow-lg rounded-full px-5 h-16 border border-slate-200/60'
            : 'max-w-5xl bg-slate-50 px-6 h-24 border-b border-transparent'
            }`}
        >
          <div className="flex items-center gap-3">
            <Heart className={`text-blue-600 transition-all ${isScrolled ? 'h-6 w-6' : 'h-8 w-8'} fill-blue-600`} />
            <span className={`font-bold tracking-tight text-slate-900 transition-all ${isScrolled ? 'text-lg' : 'text-2xl'}`}>
              Safir<span className="text-blue-600">Med</span>
            </span>
          </div>

          <div className={`hidden md:flex items-center gap-8 font-medium text-slate-500 transition-all ${isScrolled ? 'text-sm' : 'text-base'}`}>
            <a href="#comment-ca-marche" className="hover:text-slate-900 transition-colors">Processus</a>
            <a href="#avantages" className="hover:text-slate-900 transition-colors">Avantages</a>
            <a href="#problemes" className="hover:text-slate-900 transition-colors">Cas d'usage</a>
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

      <main className="max-w-5xl mx-auto px-6 pt-16">
        {/* HERO SECTION */}
        <section className="py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-8 border border-emerald-100 shadow-sm cursor-default hover:bg-emerald-100 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Trouvez votre médecin à El Jadida - Simplement.
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-[1.15] mb-6">
            Prenez rendez-vous médical en <span className="text-blue-600">quelques secondes</span>.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
            Fini les appels téléphoniques sans fin. Trouvez les meilleurs médecins de votre région et réservez votre consultation instantanément.
          </p>

          <div className="w-full max-w-4xl mx-auto mt-4 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center bg-white rounded-3xl sm:rounded-full p-2 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 gap-2 sm:gap-0">

              <div className="flex items-center flex-1 sm:border-none border-b border-slate-100">
                <div className="w-full flex items-center hover:bg-slate-50 sm:rounded-full px-4 py-2 transition-colors duration-200 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-slate-200 cursor-text">
                  <Search className="h-6 w-6 sm:h-5 sm:w-5 text-slate-400 mr-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Spécialité, médecin..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-base sm:text-lg w-full min-w-0"
                  />
                </div>
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

        {/* PROBLEM SECTION */}
        <section className="py-20 border-t border-slate-100" id="problemes">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Pourquoi utiliser SafirMed ?</h2>
            <p className="text-slate-500 text-lg">Matb9ach tsena f téléphone. Le système actuel est frustrant.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: PhoneOff, title: "Lignes occupées", desc: "Des heures d'attente au téléphone juste pour un rendez-vous.", color: "bg-red-50 text-red-600" },
              { icon: Clock, title: "Longue attente", desc: "Temps perdu dans la salle d'attente sans visibilité.", color: "bg-orange-50 text-orange-600" },
              { icon: SearchX, title: "Pas d'annuaire", desc: "Difficile de trouver le bon spécialiste à côté de chez vous.", color: "bg-slate-100 text-slate-600" },
              { icon: UserX, title: "Disponibilité floue", desc: "Vous ne savez jamais quand votre médecin est libre.", color: "bg-purple-50 text-purple-600" }
            ].map((item, i) => (
              <Card key={i} className="border-none shadow-sm bg-white rounded-2xl hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20" id="comment-ca-marche">
          <div className="bg-white rounded-[2rem] p-8 md:p-16 shadow-sm border border-slate-100 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            <div className="text-center mb-16 relative z-10">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Comment ça marche ?</h2>
              <p className="text-slate-500 text-lg">En 3 étapes simples, votre consultation est confirmée.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {[
                { icon: Search, title: "1. Rechercher", desc: "Trouvez un médecin ou spécialiste local selon vos besoins." },
                { icon: CalendarCheck, title: "2. Choisir un créneau", desc: "Sélectionnez l'heure qui vous convient le mieux, 24/7." },
                { icon: MessageSquare, title: "3. Confirmer", desc: "Recevez une confirmation par SMS. C'est tout !" }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="h-20 w-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-300">
                    <step.icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20" id="avantages">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Conçu pour votre confort</h2>
            <p className="text-slate-500 text-lg">Rapide, transparent pour les patients et sans friction.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-slate-100 shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
              <CardContent className="p-8 flex gap-6 items-start">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Disponibilité en temps réel</h3>
                  <p className="text-slate-500 leading-relaxed">Les agendas de nos docteurs sont synchronisés. Vous ne voyez que les créneaux réellement disponibles.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm hover:border-emerald-100 hover:shadow-md transition-all">
              <CardContent className="p-8 flex gap-6 items-start">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Bell className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Rappels par SMS</h3>
                  <p className="text-slate-500 leading-relaxed">Fini les oublis. Vous recevez un SMS de rappel la veille de votre consultation avec les détails du cabinet.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm hover:border-purple-100 hover:shadow-md transition-all">
              <CardContent className="p-8 flex gap-6 items-start">
                <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Sans création de compte</h3>
                  <p className="text-slate-500 leading-relaxed">Prenez rendez-vous en entrant juste votre nom et numéro de téléphone. Pas de mots de passe à mémoriser.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm hover:border-amber-100 hover:shadow-md transition-all">
              <CardContent className="p-8 flex gap-6 items-start">
                <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Médecins locaux uniquement</h3>
                  <p className="text-slate-500 leading-relaxed">Un annuaire strictement dédié à El Jadida et sa périphérie pour une meilleure proximité et pertinence.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>



        {/* CTA SECTION */}
        <section className="py-24 relative overflow-hidden bg-blue-600 rounded-[2rem] text-center px-6 shadow-2xl shadow-blue-200/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400 rounded-full blur-3xl opacity-30 -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Trouvez votre médecin aujourd'hui
            </h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 leading-relaxed">
              N'attendez plus. Rejoignez les patients qui ont simplifié leur accès aux soins dans la région prés de vous.
            </p>
            <Button size="lg" className="rounded-full h-14 px-10 bg-white text-blue-600 hover:bg-slate-50 hover:text-blue-700 text-lg font-bold shadow-xl transition-transform hover:scale-105">
              Réserver maintenant
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 mt-20 pt-16 pb-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-2">
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

          <div className="text-center text-slate-400 text-sm border-t border-slate-100 pt-8">
            © {new Date().getFullYear()} SafirMed. Une plateforme dédiée à El Jadida, Maroc.
          </div>
        </div>
      </footer>
    </div>
  );
}
