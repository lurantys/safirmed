import { OpenRouter } from '@openrouter/sdk';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const client = new OpenRouter({
  apiKey: API_KEY,
  httpReferer: typeof window !== 'undefined' ? window.location.origin : '',
});

const SPECIALTIES = [
  "Médecine Générale", "Dentaire", "Gynécologie – Obstétrique",
  "Pédiatrie", "Cardiologie", "Ophtalmologie", "Dermatologie",
  "ORL – Oto-Rhino-Laryngologie", "Orthopédie – Traumatologie",
  "Psychiatrie – Psychologie"
];

const NAMES_MAP = {
  "general medicine": "Médecine Générale", "general practice": "Médecine Générale", "generalist": "Médecine Générale",
  "dentist": "Dentaire", "dental": "Dentaire",
  "gynecology": "Gynécologie – Obstétrique", "obstetrics": "Gynécologie – Obstétrique",
  "pediatrics": "Pédiatrie", "pediatric": "Pédiatrie",
  "cardiology": "Cardiologie", "cardiologist": "Cardiologie",
  "ophthalmology": "Ophtalmologie", "eye": "Ophtalmologie",
  "dermatology": "Dermatologie", "skin": "Dermatologie",
  "ent": "ORL – Oto-Rhino-Laryngologie", "ear": "ORL – Oto-Rhino-Laryngologie", "nose": "ORL – Oto-Rhino-Laryngologie", "throat": "ORL – Oto-Rhino-Laryngologie",
  "orthopedics": "Orthopédie – Traumatologie", "orthopedic": "Orthopédie – Traumatologie", "bone": "Orthopédie – Traumatologie",
  "psychiatry": "Psychiatrie – Psychologie", "psychology": "Psychiatrie – Psychologie", "mental": "Psychiatrie – Psychologie",
};

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
Réponse : Orthopedie – Traumatologie

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

export async function matchSpecialtyWithAI(symptoms) {
  if (!API_KEY) {
    console.warn('[SymptomChat] VITE_OPENROUTER_API_KEY is not set');
    return null;
  }

  try {
    const response = await client.chat.send({
      httpReferer: typeof window !== 'undefined' ? window.location.origin : '',
      chatRequest: {
        model: 'openrouter/free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Symptômes : "${symptoms}"` },
        ],
        maxTokens: 30,
        temperature: 0,
        stream: false,
      },
    });

    const content = response?.choices?.[0]?.message?.content?.trim();
    if (!content || content === 'N/A') return null;
    if (SPECIALTIES.includes(content)) return content;

    const lower = content.toLowerCase();
    for (const s of SPECIALTIES) {
      if (lower.includes(s.toLowerCase())) return s;
    }

    for (const [en, fr] of Object.entries(NAMES_MAP)) {
      if (lower.includes(en)) return fr;
    }

    return null;
  } catch (err) {
    console.error('[SymptomChat] AI request failed:', err);
    return null;
  }
}
