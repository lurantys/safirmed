const SPECIALTY_KEYWORDS = [
  {
    specialty: "Médecine Générale",
    keywords: [
      "fievre", "fatigue", "courbature", "malaise", "grippe", "rhume",
      "toux", "maux de tete", "mal de tete", "migraine", "douleur general",
      "faiblesse", "frisson", "sueur nocturne", "infection", "virus",
      "bilan de sante", "vaccination", "vaccin", "allergie saisonniere",
      "consultation", "generaliste", "blessure legere", "petit bobo",
      "suivi medical", "renouvellement ordonnance", "certificat medical",
      "prise de sang", "analyse"
    ]
  },
  {
    specialty: "Dentaire",
    keywords: [
      "dent", "dentiste", "carie", "gencive", "machoire", "mal aux dents",
      "aphte", "dent de sagesse", "plombage", "couronne dentaire",
      "implant dentaire", "blanchiment", "detartrage", "parodontite",
      "abces dentaire", "rage de dent", "molaire", "incisive", "canine",
      "orthodontie", "appareil dentaire", "bagues", "prothese dentaire",
      "chirurgie dentaire", "extraction dent", "dentiste urgence",
      "brossage", "dent sensible", "gingivite", "dent cassée"
    ]
  },
  {
    specialty: "Gynécologie – Obstétrique",
    keywords: [
      "grossesse", "gynecologie", "regles", "menstruation", "contraception",
      "ovaire", "uterus", "sein", "femme enceinte", "frottis",
      "mamographie", "pillule", "sterilet", "menopause", "endometriose",
      "douleur regles", "cycle irregulier", "infection urinaire",
      "perte vaginale", "accouchement", "allaitement", "post-partum",
      "soulier", "sage-femme", "IVG", "fibrome", "kyste ovaire",
      "depistage cancer col", "cancer du sein", "auto-examen sein",
      "trompe", "vagin", "vulve", "clitoris"
    ]
  },
  {
    specialty: "Pédiatrie",
    keywords: [
      "enfant", "bebe", "nourrisson", "pediatre", "croissance",
      "vaccination enfant", "fievre enfant", "toux enfant",
      "douleur ventre enfant", "poussee dentaire", "colique bebe",
      "regurgitation", "diversification alimentaire", "curbe poids",
      "bronchiolite", "otite enfant", "varicelle", "rougeole",
      "scarlatine", "infections enfant", "trouble sommeil enfant",
      "alimentation bebe", "eveil bebe", "developpement enfant",
      "pediatrie general", "bebe premature", "neonatologie"
    ]
  },
  {
    specialty: "Cardiologie",
    keywords: [
      "coeur", "tension", "hypertension", "palpitation", "cardiaque",
      "artere", "cholesterol", "souffle au coeur", "infarctus",
      "crise cardiaque", "rythme cardiaque", "electrocardiogramme",
      "ECA", "echo coeur", "insuffisance cardiaque", "angine poitrine",
      "douleur poitrine", "essoufflement", "prise de tension",
      "hypotension", "arteriosclerose", "veine", "circulation sanguine",
      "phlebite", "varice", "battement coeur", "tachycardie",
      "bradycardie", "valvulopathie"
    ]
  },
  {
    specialty: "Ophtalmologie",
    keywords: [
      "oeil", "yeux", "vue", "lunette", "vision", "cataracte",
      "glaucome", "conjonctivite", "myopie", "presbytie", "astigmatisme",
      "hypermetropie", "lentille", "corne", "retine", "paupiere",
      "oeil rouge", "oeil sec", "larme", "clarte visuelle", "baisse vision",
      "tache noire oeil", "eclair oeil", "vision floue", "double vision",
      "examen vue", "fond oeil", "pression oculaire", "operation oeil",
      "laser oeil", "cristallin", "daltonien",
      "ophtalmologue", "opticien", "ordeille"
    ]
  },
  {
    specialty: "Dermatologie",
    keywords: [
      "peau", "acne", "eczema", "psoriasis", "grain beaute", "eruption",
      "bouton", "rougeur", "demangeaison", "allergie cutanee",
      "mycose peau", "urticaire", "herpes", "zona", "vitiligo",
      "coup soleil", "tache peau", "cicatrice", "verrue", "cors",
      "cal", "ongle", "chute cheveux", "calvitie", "pellicule",
      "cuir chevelu", "dermatite", "creme", "masque visage",
      "naevus", "cancer peau", "depistage cancer peau",
      "dermatologue", "allergologue", "anti-age"
    ]
  },
  {
    specialty: "ORL – Oto-Rhino-Laryngologie",
    keywords: [
      "oreille", "nez", "gorge", "audition", "sinus", "otite",
      "angine", "amygdale", "rhinopharyngite", "laryngite",
      "ecoulement nasal", "congestion", "mal gorge", "mal oreille",
      "vertige", "bourdonnement oreille", "acouphene", "surdite",
      "perte audition", "prothese auditive", "appareil auditif",
      "voix enrouee", "extinction voix", "corde vocale",
      "polype nasal", "vegetation", "douleur sinus", "sinusite",
      "nez bouche", "eoulement", "otalgie"
    ]
  },
  {
    specialty: "Orthopédie – Traumatologie",
    keywords: [
      "os", "fracture", "entorse", "articulation", "dos", "genou",
      "epaule", "hanche", "colonne", "vertebre", "douleur articulaire",
      "lombalgie", "sciatique", "hernie discale", "arthrose",
      "arthrite", "osteoporose", "tendinite", "dechirure musculaire",
      "dechirure ligament", "luxation", "foulure", "cervicale",
      "nuque raide", "mal au dos", "mal au genou", "douleur jambe",
      "cheville gonflee", "poignet casse", "attelle", "platre",
      "reducation", "kinésithérapeute", "chirurgie orthopedique",
      "prothese hanche", "prothese genou", "scoliose", "tassement"
    ]
  },
  {
    specialty: "Psychiatrie – Psychologie",
    keywords: [
      "anxiete", "depression", "stress", "insomnie", "psychologue",
      "psychiatre", "moral", "burn-out", "e-puisement", "angoiss",
      "sommeil", "humeur", "tristesse", "pleur", "nerveux", "nerveuse",
      "crise angoisse", "attaque panique", "phobie", "traumatisme",
      "dependance", "addiction", "alcool", "tabac",
      "trouble alimentaire", "boulimie", "anorexie",
      "trouble comportement", "tdah", "hyperactif",
      "saut humeur", "bipolaire", "schizophrenie",
      "therapie", "psychotherapie", "soutien psychologique",
      "consultation psychologue", "bien etre mental", "sante mentale",
      "concentration", "memoire", "obsession", "compulsion",
      "isolement", "solitude", "manque confiance", "estime soi"
    ]
  }
];

export function matchSpecialty(symptoms) {
  const normalized = symptoms
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  let bestScore = 0;
  let matchedSpecialties = [];

  for (const entry of SPECIALTY_KEYWORDS) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const phraseLength = keyword.split(' ').length;
      const weight = phraseLength > 1 ? 2 : 1;
      if (normalized.includes(keyword)) {
        score += weight;
      }
    }
    if (score > 0) {
      matchedSpecialties.push({ specialty: entry.specialty, score });
      if (score > bestScore) bestScore = score;
    }
  }

  matchedSpecialties.sort((a, b) => b.score - a.score);

  if (matchedSpecialties.length === 0) {
    return null;
  }

  const top = matchedSpecialties.filter(s => s.score === bestScore);
  return top.length === 1 ? top[0].specialty : matchedSpecialties[0].specialty;
}

export function getSpecialtyDescription(specialty) {
  const descriptions = {
    "Médecine Générale": "Médecine générale pour les soins courants et le suivi médical.",
    "Dentaire": "Soins dentaires et chirurgie bucco-dentaire.",
    "Gynécologie – Obstétrique": "Santé de la femme, grossesse et accouchement.",
    "Pédiatrie": "Santé de l'enfant et de l'adolescent.",
    "Cardiologie": "Santé du coeur et du système cardiovasculaire.",
    "Ophtalmologie": "Santé des yeux et de la vision.",
    "Dermatologie": "Santé de la peau, des ongles et des cheveux.",
    "ORL – Oto-Rhino-Laryngologie": "Santé des oreilles, du nez et de la gorge.",
    "Orthopédie – Traumatologie": "Santé des os, articulations et muscles.",
    "Psychiatrie – Psychologie": "Santé mentale et bien-être psychologique."
  };
  return descriptions[specialty] || "";
}
