import { OpenRouter } from '@openrouter/sdk';
import { matchSpecialty } from './symptomMatcher';

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

export async function matchSpecialtyWithAI(symptoms) {
  if (!API_KEY) {
    console.warn('OpenRouter: VITE_OPENROUTER_API_KEY is not set');
    return null;
  }

  const keywordResult = matchSpecialty(symptoms);
  if (keywordResult) {
    console.log('[SymptomChat] keyword match:', keywordResult);
    return keywordResult;
  }

  console.log('[SymptomChat] no keyword match, trying AI for:', symptoms);

  try {
    const response = await client.chat.send({
      httpReferer: typeof window !== 'undefined' ? window.location.origin : '',
      chatRequest: {
        model: 'openrouter/free',
        messages: [
          { role: 'user', content: `Réponds uniquement par le nom exact d'une spécialité médicale parmi cette liste : ${SPECIALTIES.join(', ')}. Un seul mot, pas de phrase. Symptômes : "${symptoms}"` },
        ],
        maxTokens: 20,
        temperature: 0,
        stream: false,
      },
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) return null;

    const cleaned = content.replace(/[.\s]+$/, '').trim();
    if (SPECIALTIES.includes(cleaned)) return cleaned;

    for (const s of SPECIALTIES) {
      if (cleaned.toLowerCase().includes(s.toLowerCase())) return s;
    }

    return null;
  } catch (err) {
    console.error('[SymptomChat] AI request failed:', err);
    return null;
  }
}
