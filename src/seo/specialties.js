export const SPECIALTIES_DATA = [
  { name: "Médecine Générale", slug: "medecine-generale", description: "Médecine générale pour les soins courants et le suivi médical.", keywords: "médecin généraliste, consultation, soins courants" },
  { name: "Dentaire", slug: "dentaire", description: "Soins dentaires et chirurgie bucco-dentaire.", keywords: "dentiste, chirurgien dentiste, soins dentaires" },
  { name: "Gynécologie – Obstétrique", slug: "gynecologie-obstetrique", description: "Santé de la femme, grossesse et accouchement.", keywords: "gynécologue, obstétricien, femme enceinte" },
  { name: "Pédiatrie", slug: "pediatrie", description: "Santé de l'enfant et de l'adolescent.", keywords: "pédiatre, médecin enfant, bébé" },
  { name: "Cardiologie", slug: "cardiologie", description: "Santé du coeur et du système cardiovasculaire.", keywords: "cardiologue, cœur, tension" },
  { name: "Ophtalmologie", slug: "ophtalmologie", description: "Santé des yeux et de la vision.", keywords: "ophtalmologue, yeux, vision, lunettes" },
  { name: "Dermatologie", slug: "dermatologie", description: "Santé de la peau, des ongles et des cheveux.", keywords: "dermatologue, peau, acné" },
  { name: "ORL – Oto-Rhino-Laryngologie", slug: "orl", description: "Santé des oreilles, du nez et de la gorge.", keywords: "ORL, oreille, nez, gorge, audition" },
  { name: "Orthopédie – Traumatologie", slug: "orthopedie-traumatologie", description: "Santé des os, articulations et muscles.", keywords: "orthopédiste, traumatologue, os, fracture" },
  { name: "Psychiatrie – Psychologie", slug: "psychiatrie-psychologie", description: "Santé mentale et bien-être psychologique.", keywords: "psychiatre, psychologue, dépression, anxiété" },
];

export function specialtyBySlug(slug) {
  return SPECIALTIES_DATA.find(s => s.slug === slug) || null;
}

export function slugifySpecialty(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const DEFAULT_SPECIALTY_SLUG = "medecine-generale";
