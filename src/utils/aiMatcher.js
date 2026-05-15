import { OpenRouter } from '@openrouter/sdk';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SPECIALTIES = [
  { name: "Médecine Générale", aliases: ["médecine générale", "généraliste", "generaliste", "general practice", "general medicine"] },
  { name: "Dentaire", aliases: ["dentaire", "dentiste", "dentist", "dentisterie", "dental"] },
  { name: "Gynécologie – Obstétrique", aliases: ["gynécologie", "gynécologie – obstétrique", "gynecologie", "gynécologue", "obstétrique", "gynecology", "obstetrics", "gynéco", "gyneco"] },
  { name: "Pédiatrie", aliases: ["pédiatrie", "pediatrie", "pédiatre", "pediatre", "pediatrics", "pediatric"] },
  { name: "Cardiologie", aliases: ["cardiologie", "cardiologue", "cardiology", "cardiologist", "cœur", "coeur"] },
  { name: "Ophtalmologie", aliases: ["ophtalmologie", "ophtalmologue", "opthalmologie", "opthalmology", "ophthalmology", "ophtalmo", "eye"] },
  { name: "Dermatologie", aliases: ["dermatologie", "dermatologue", "dermatology", "dermatologist", "skin"] },
  { name: "ORL – Oto-Rhino-Laryngologie", aliases: ["orl", "oto-rhino-laryngologie", "oto rhino", "ent", "ear", "nose", "throat"] },
  { name: "Orthopédie – Traumatologie", aliases: ["orthopédie", "orthopedie", "orthopédiste", "orthopediste", "traumatologie", "orthopedics", "orthopedic", "bone"] },
  { name: "Psychiatrie – Psychologie", aliases: ["psychiatrie", "psychiatre", "psychologie", "psychologue", "psychiatry", "psychology", "mental"] },
];

const client = new OpenRouter({
  apiKey: API_KEY,
  httpReferer: typeof window !== 'undefined' ? window.location.origin : '',
});

function extractSpecialty(text) {
  if (!text) return null;
  const lower = text.replace(/[.\s]+$/, '').trim().toLowerCase();
  for (const entry of SPECIALTIES) {
    for (const alias of entry.aliases) {
      if (lower.includes(alias)) return entry.name;
    }
  }
  return null;
}

export async function matchSpecialtyWithAI(symptoms) {
  if (!API_KEY) {
    console.warn('OpenRouter: VITE_OPENROUTER_API_KEY is not set');
    return null;
  }

  console.log('[OpenRouter] analyzing symptoms:', symptoms);

  try {
    const response = await client.chat.send({
      httpReferer: typeof window !== 'undefined' ? window.location.origin : '',
      chatRequest: {
        model: 'openrouter/free',
        messages: [
          { role: 'user', content: `Réponds uniquement par le nom d'une spécialité médicale parmi cette liste : ${SPECIALTIES.map(s => s.name).join(', ')}. Pas de phrase, pas d'explication. Symptômes : "${symptoms}"` },
        ],
        maxTokens: 20,
        temperature: 0,
        stream: false,
      },
    });

    console.log('[OpenRouter] raw response:', JSON.stringify(response));

    const content = response?.choices?.[0]?.message?.content;
    console.log('[OpenRouter] extracted content:', content);

    if (!content) {
      console.warn('[OpenRouter] no content in response');
      return null;
    }

    const specialty = extractSpecialty(content);
    if (specialty) {
      console.log('[OpenRouter] matched:', specialty);
      return specialty;
    }

    console.warn('[OpenRouter] no match from:', content);
    return null;
  } catch (err) {
    console.error('[OpenRouter] request failed:', err);
    return null;
  }
}
