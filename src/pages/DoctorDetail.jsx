import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, Phone, CalendarCheck, Heart } from "lucide-react";
import * as XLSX from 'xlsx';

export default function DoctorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await fetch('/SafirMed.xlsx');
                if (!response.ok) throw new Error('Network response was not ok');
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { range: 1 });

                // Give everyone an ID matching the index logic from search page
                const doctorsWithIds = json.map((doc, idx) => ({ ...doc, ID: (idx + 1).toString() }));
                const found = doctorsWithIds.find(doc => String(doc.ID) === String(id));
                setDoctor(found || null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-medium text-slate-500">Chargement...</div>;

    if (!doctor) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Médecin introuvable</h1>
            <p className="text-slate-500 mb-8 max-w-sm">Le profil de ce médecin n'existe pas ou a été retiré de l'annuaire.</p>
            <Button onClick={() => navigate('/search')} className="rounded-full px-8">Retour à la recherche</Button>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 pb-0">
            {/* Dynamic Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-6 sticky top-0 z-40 shadow-sm/50">
                <div className="max-w-4xl mx-auto flex items-center cursor-pointer group w-fit" onClick={() => navigate(-1)}>
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-100 transition-colors mr-4">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </div>
                    <span className="font-semibold text-slate-600 tracking-tight">Retour</span>
                </div>
            </div>

            <div className="flex-1 max-w-4xl mx-auto px-6 pt-12">
                {/* Main Info Card */}
                <div className="bg-white rounded-[2rem] p-5 sm:p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start relative overflow-hidden text-center sm:text-left">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                    <div className="h-32 w-32 md:h-40 md:w-40 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center font-bold text-6xl shrink-0 shadow-xl shadow-blue-200/50 z-10 mx-auto sm:mx-0">
                        {doctor.Nom ? String(doctor.Nom).replace("Dr. ", "").charAt(0) : "D"}
                    </div>

                    <div className="flex-1 w-full z-10 flex flex-col items-center sm:items-start">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">{doctor.Nom}</h1>
                        <p className="text-blue-600 font-semibold text-base sm:text-lg md:text-xl mb-6 sm:mb-8 bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100 shadow-sm mx-auto sm:mx-0">{doctor.Spécialité}</p>

                        <div className="grid sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-4 sm:gap-x-8 text-slate-600 font-medium text-sm sm:text-base bg-slate-50 p-4 sm:p-6 rounded-[1.5rem] border border-slate-200/60 w-full">
                            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                                    <Phone className="h-4 w-4 text-blue-600" />
                                </div>
                                <span>{doctor.Téléphone || "Non spécifié"}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-2 sm:gap-3 text-center sm:text-left">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                </div>
                                <span>{doctor.Adresse ? `${doctor.Adresse}, ` : ""}{doctor.Ville}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 sm:col-span-2 mt-2 text-center sm:text-left">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100 mt-1">
                                    <Clock className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-900 font-bold mb-1">Horaires d'ouverture</span>
                                    <span className="text-slate-500 leading-relaxed max-w-sm">{doctor.Horaire || "Horaires non spécifiés"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 sm:mt-10 flex flex-col lg:flex-row flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 w-full">
                            <Button
                                size="lg"
                                onClick={() => { if (doctor.Téléphone) window.location.href = `tel:${doctor.Téléphone.replace(/[\s-]/g, '')}`; }}
                                className="rounded-2xl sm:rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200/50 gap-2 h-auto min-h-[56px] py-3 sm:py-0 px-4 sm:px-8 text-sm sm:text-base md:text-lg w-full lg:w-auto overflow-hidden whitespace-normal"
                            >
                                <CalendarCheck className="h-5 w-5 shrink-0 hidden sm:block" /> Prendre RDV par téléphone
                            </Button>

                            {(() => {
                                const rawPhone = String(doctor.Téléphone || "");
                                const cleanPhone = rawPhone.replace(/[\s-]/g, "");
                                const isMobile = /^0[678]/.test(cleanPhone) || /^\+212[678]/.test(cleanPhone);

                                const WhatsappIcon = () => (
                                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current shrink-0 hidden sm:block" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.482-1.459-1.656-1.757-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                );

                                if (isMobile) {
                                    const waNumber = cleanPhone.startsWith('0') ? '212' + cleanPhone.substring(1) : cleanPhone.replace('+', '');
                                    return (
                                        <Button
                                            size="lg"
                                            onClick={() => { window.open(`https://wa.me/${waNumber}`, '_blank'); }}
                                            className="rounded-2xl sm:rounded-full bg-[#25D366] hover:bg-[#20BE5C] text-white shadow-xl shadow-[#25D366]/30 gap-2 h-auto min-h-[56px] py-3 sm:py-0 px-4 sm:px-8 text-sm sm:text-base md:text-lg w-full lg:w-auto overflow-hidden whitespace-normal"
                                        >
                                            <WhatsappIcon /> Prendre RDV par WhatsApp
                                        </Button>
                                    );
                                } else {
                                    return (
                                        <Button
                                            size="lg"
                                            disabled
                                            className="rounded-2xl sm:rounded-full bg-slate-200 text-slate-400 cursor-not-allowed gap-2 h-auto min-h-[56px] py-3 sm:py-0 px-4 sm:px-8 text-sm sm:text-base md:text-lg w-full lg:w-auto overflow-hidden whitespace-normal"
                                        >
                                            <WhatsappIcon /> WhatsApp non disponible
                                        </Button>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <MapPin className="h-6 w-6 text-slate-400" /> Emplacement du cabinet
                    </h2>
                    <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 h-[400px] shadow-inner relative z-10">
                        <iframe
                            src={doctor.MapEmbed || "https://maps.google.com/maps?q=El%20Jadida&t=&z=13&ie=UTF8&iwloc=&output=embed"}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-white border-t border-slate-100 mt-auto pt-16 pb-8 relative z-10 shrink-0 w-full">
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
