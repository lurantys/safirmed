import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, Phone, CalendarCheck } from "lucide-react";
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
                const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

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
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Dynamic Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-6 sticky top-0 z-40 shadow-sm/50">
                <div className="max-w-4xl mx-auto flex items-center cursor-pointer group w-fit" onClick={() => navigate(-1)}>
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-100 transition-colors mr-4">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </div>
                    <span className="font-semibold text-slate-600 tracking-tight">Retour</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-12">
                {/* Main Info Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-8 sm:gap-10 items-center sm:items-start relative overflow-hidden text-center sm:text-left">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                    <div className="h-32 w-32 md:h-40 md:w-40 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center font-bold text-6xl shrink-0 shadow-xl shadow-blue-200/50 z-10 mx-auto sm:mx-0">
                        {doctor.Nom ? String(doctor.Nom).replace("Dr. ", "").charAt(0) : "D"}
                    </div>

                    <div className="flex-1 w-full z-10 flex flex-col items-center sm:items-start">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">{doctor.Nom}</h1>
                        <p className="text-blue-600 font-semibold text-base sm:text-lg md:text-xl mb-6 sm:mb-8 bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100 shadow-sm mx-auto sm:mx-0">{doctor.Spécialité}</p>

                        <div className="grid sm:grid-cols-2 gap-y-5 gap-x-8 text-slate-600 font-medium bg-slate-50 p-6 rounded-[1.5rem] border border-slate-200/60">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                                    <Phone className="h-4 w-4 text-blue-600" />
                                </div>
                                <span>{doctor.Téléphone || "Non spécifié"}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                </div>
                                <span>{doctor.Adresse ? `${doctor.Adresse}, ` : ""}{doctor.Ville}</span>
                            </div>
                            <div className="flex items-start gap-3 sm:col-span-2 mt-2">
                                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100 mt-1">
                                    <Clock className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-900 font-bold mb-1">Horaires d'ouverture</span>
                                    <span className="text-slate-500 leading-relaxed max-w-sm">{doctor.Horaire || "Horaires non spécifiés"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-center sm:justify-start gap-4 w-full">
                            <Button size="lg" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200/50 gap-2 h-14 px-6 sm:px-8 text-base md:text-lg w-full sm:w-auto">
                                <CalendarCheck className="h-5 w-5" /> Prendre Rendez-vous par téléphone
                            </Button>
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
                        {doctor.MapEmbed ? (
                            <iframe
                                src={doctor.MapEmbed}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex flex-col gap-4 items-center justify-center text-slate-400">
                                <MapPin className="h-10 w-10 opacity-20" />
                                <span className="font-medium">Carte non disponible pour ce médecin</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
