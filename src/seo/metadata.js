const SITE_NAME = "SafirMed";
const SITE_URL = "https://safirmed.vercel.app";
const DEFAULT_DESC = "Trouvez rapidement un médecin près de chez vous au Maroc. Consultez les disponibilités, prenez rendez-vous en ligne gratuitement.";
const DEFAULT_OG_IMAGE = "/icon.jpg";

export function buildTitle(page) {
  return page ? `${page} | ${SITE_NAME}` : SITE_NAME;
}

export function buildCitySpecialtyTitle(specialty, city) {
  return `${specialty} à ${city} – Trouvez un médecin | ${SITE_NAME}`;
}

export function buildCityTitle(city) {
  return `Médecins à ${city} – Annuaire médical | ${SITE_NAME}`;
}

export function buildDoctorTitle(name, specialty) {
  return `Dr. ${name} – ${specialty} | ${SITE_NAME}`;
}

export function buildMeta({ title, description, path, ogImage, noIndex }) {
  const url = `${SITE_URL}${path || ''}`;
  return {
    title,
    description,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    canonical: url,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: ogImage || DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || DEFAULT_OG_IMAGE],
    },
  };
}

export function buildCitySpecialtyMeta(specialty, city, path) {
  const title = buildCitySpecialtyTitle(specialty, city);
  const description = `Trouvez les meilleurs médecins ${specialty.toLowerCase()} à ${city}. Consultez les avis, horaires et prenez rendez-vous en ligne gratuitement sur ${SITE_NAME}.`;
  return buildMeta({ title, description, path });
}

export function buildDoctorMeta(name, specialty, city, path) {
  const title = buildDoctorTitle(name, specialty);
  const description = `Prenez rendez-vous avec le Dr. ${name}, ${specialty.toLowerCase()} à ${city}. Téléphone, adresse, horaires et prise de rendez-vous en ligne.`;
  return buildMeta({ title, description, path });
}

export { SITE_NAME, SITE_URL, DEFAULT_DESC };
