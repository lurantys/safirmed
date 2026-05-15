const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SPECIALTIES = [
  "Médecine Générale", "Dentaire", "Gynécologie – Obstétrique",
  "Pédiatrie", "Cardiologie", "Ophtalmologie", "Dermatologie",
  "ORL – Oto-Rhino-Laryngologie", "Orthopédie – Traumatologie",
  "Psychiatrie – Psychologie"
];

const SYSTEM_PROMPT = `Tu es un assistant de triage médical. Tu dois associer des symptômes à une spécialité médicale.

Spécialités disponibles :
${SPECIALTIES.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Règles :
- Réponds UNIQUEMENT par le nom exact de la spécialité.
- Si les symptômes ne correspondent à aucune spécialité, réponds "N/A".
- Ne donne jamais d'explications, jamais de phrases. Juste le nom de la spécialité ou "N/A".

Exemples :
Symptômes : "j'ai mal aux dents"
Réponse : Dentaire

Symptômes : "je tousse et j'ai de la fièvre"
Réponse : Médecine Générale

Symptômes : "j'ai du sang dans mes oreilles"
Réponse : ORL – Oto-Rhino-Laryngologie

Symptômes : "j'ai mal au genou après une chute"
Réponse : Orthopédie – Traumatologie

Symptômes : "j'ai des boutons sur la peau qui grattent"
Réponse : Dermatologie

Symptômes : "j'ai perdu connaissance"
Réponse : Médecine Générale

Symptômes : "mon enfant a de la fièvre"
Réponse : Pédiatrie

Symptômes : "j'ai des douleurs en urinant"
Réponse : Médecine Générale

Symptômes : "je suis triste et je n'ai plus d'énergie"
Réponse : Psychiatrie – Psychologie

Symptômes : "j'ai une tache sur l'oeil"
Réponse : Ophtalmologie`;

function extractSpecialty(content) {
  if (!content) return null;
  const trimmed = content.trim();
  if (trimmed === 'N/A') return null;
  if (SPECIALTIES.includes(trimmed)) return trimmed;

  const lower = trimmed.toLowerCase();
  for (const s of SPECIALTIES) {
    if (lower.includes(s.toLowerCase())) return s;
  }

  const map = {
    dentistry: "Dentaire", dentist: "Dentaire", dental: "Dentaire",
    gynecology: "Gynécologie – Obstétrique", obstetrics: "Gynécologie – Obstétrique",
    pediatrics: "Pédiatrie", pediatric: "Pédiatrie",
    cardiology: "Cardiologie", cardiologist: "Cardiologie",
    ophthalmology: "Ophtalmologie", ophtalmologie: "Ophtalmologie",
    dermatology: "Dermatologie", dermatologist: "Dermatologie",
    otolaryngology: "ORL – Oto-Rhino-Laryngologie",
    orthopedics: "Orthopédie – Traumatologie", orthopedic: "Orthopédie – Traumatologie",
    psychiatry: "Psychiatrie – Psychologie", psychology: "Psychiatrie – Psychologie",
    psychologist: "Psychiatrie – Psychologie", psychiatrist: "Psychiatrie – Psychologie",
  };

  for (const [en, fr] of Object.entries(map)) {
    if (lower.includes(en)) return fr;
  }

  return null;
}

async function fetchWithRetry(body, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      },
      body: JSON.stringify(body),
    });

    if (res.ok) return res.json();

    if (res.status === 429 && i < retries - 1) {
      const delay = (i + 1) * 2000;
      console.warn(`[SymptomChat] rate limited, retrying in ${delay}ms (attempt ${i + 2}/${retries})`);
      await new Promise(r => setTimeout(r, delay));
      continue;
    }

    const text = await res.text().catch(() => '');
    console.warn(`[SymptomChat] API error ${res.status}:`, text.slice(0, 200));
    return null;
  }
  return null;
}

export async function matchSpecialtyWithAI(symptoms) {
  if (!API_KEY) {
    console.warn('[SymptomChat] VITE_OPENROUTER_API_KEY is not set');
    return null;
  }

  const data = await fetchWithRetry({
    model: 'openrouter/free',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Symptômes : "${symptoms}"` },
    ],
    max_tokens: 30,
    temperature: 0,
  });

  return extractSpecialty(data?.choices?.[0]?.message?.content);
}
