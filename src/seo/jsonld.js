import { SITE_URL, SITE_NAME } from './metadata';

export function buildBreadcrumbJsonld(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildPhysicianJsonld({ name, specialty, city, address, phone, description }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: `Dr. ${name}`,
    description: description || `${specialty} à ${city}`,
    medicalSpecialty: `https://schema.org/${mapSpecialty(specialty)}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address || '',
      addressLocality: city,
      addressCountry: 'MA',
    },
    telephone: phone || '',
    url: SITE_URL,
  };
}

export function buildMedicalClinicJsonld({ name, specialty, city, address, phone }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: name,
    description: `Cabinet de ${specialty} à ${city}`,
    medicalSpecialty: `https://schema.org/${mapSpecialty(specialty)}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address || '',
      addressLocality: city,
      addressCountry: 'MA',
    },
    telephone: phone || '',
    url: SITE_URL,
  };
}

export function buildLocalBusinessJsonld({ name, city, address, phone }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name,
    description: `Cabinet médical à ${city}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address || '',
      addressLocality: city,
      addressCountry: 'MA',
    },
    telephone: phone || '',
    url: SITE_URL,
  };
}

export function buildFAQJsonld(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildWebSiteJsonld() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

function mapSpecialty(specialty) {
  const map = {
    'Médecine Générale': 'GeneralPractice',
    'Dentaire': 'Dentistry',
    'Gynécologie – Obstétrique': 'Gynecologic',
    'Pédiatrie': 'Pediatric',
    'Cardiologie': 'Cardiovascular',
    'Ophtalmologie': 'Ophthalmologic',
    'Dermatologie': 'Dermatologic',
    'ORL – Oto-Rhino-Laryngologie': 'Otolaryngologic',
    'Orthopédie – Traumatologie': 'Orthopedic',
    'Psychiatrie – Psychologie': 'Psychiatric',
  };
  return map[specialty] || 'GeneralPractice';
}

export function injectJsonld(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
  return script;
}
