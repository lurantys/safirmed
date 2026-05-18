const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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

async function callGemini(symptoms) {
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Symptômes : "${symptoms}"` }] }],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: { maxOutputTokens: 20, temperature: 0 },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    if (res.status === 429) {
      console.warn('[SymptomChat] Gemini rate-limited (429)');
      return null;
    }
    console.warn(`[SymptomChat] Gemini error ${res.status}:`, text.slice(0, 150));
    return null;
  }

  const data = await res.json();
  return extractSpecialty(data?.candidates?.[0]?.content?.parts?.[0]?.text);
}

export async function matchSpecialtyWithAI(symptoms) {
  if (!GEMINI_KEY) {
    console.warn('[SymptomChat] VITE_GEMINI_API_KEY is not set');
    return null;
  }
  return callGemini(symptoms);
}
