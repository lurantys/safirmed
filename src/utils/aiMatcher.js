import { OpenRouter } from '@openrouter/sdk';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SPECIALTIES = [
  { name: "Médecine Générale", aliases: ["médecine générale", "généraliste", "generaliste", "general practice"] },
  { name: "Dentaire", aliases: ["dentaire", "dentiste", "dentist", "dentisterie"] },
  { name: "Gynécologie – Obstétrique", aliases: ["gynécologie", "gynécologie – obstétrique", "gynecologie", "gynécologue", "obstétrique", "gynecology", "obstetrics"] },
  { name: "Pédiatrie", aliases: ["pédiatrie", "pediatrie", "pédiatre", "pediatre", "pediatrics"] },
  { name: "Cardiologie", aliases: ["cardiologie", "cardiologue", "cardiology", "cardiologist", "cœur", "coeur"] },
  { name: "Ophtalmologie", aliases: ["ophtalmologie", "ophtalmologue", "opthalmologie", "opthalmology", "ophthalmology", "ophtalmo"] },
  { name: "Dermatologie", aliases: ["dermatologie", "dermatologue", "dermatology", "dermatologist"] },
  { name: "ORL – Oto-Rhino-Laryngologie", aliases: ["orl", "oto-rhino-laryngologie", "oto rhino", "ent"] },
  { name: "Orthopédie – Traumatologie", aliases: ["orthopédie", "orthopedie", "orthopédiste", "orthopediste", "traumatologie", "orthopedics", "orthopedic"] },
  { name: "Psychiatrie – Psychologie", aliases: ["psychiatrie", "psychiatre", "psychologie", "psychologue", "psychiatry", "psychology"] },
];

const client = new OpenRouter({
  apiKey: API_KEY,
});

function extractSpecialty(text) {
  const lower = text.replace(/[.\s]+$/, '').trim().toLowerCase();
  for (const entry of SPECIALTIES) {
    for (const alias of entry.aliases) {
      if (lower.includes(alias)) return entry.name;
    }
  }
  return null;
}

export async function matchSpecialtyWithAI(symptoms) {
  if (!API_KEY) return null;

  const prompt = `Tu es un assistant médical. Quel spécialiste consulter pour ces symptômes ?

Liste des spécialités :
${SPECIALTIES.map(s => `- ${s.name}`).join('\n')}

Réponds UNIQUEMENT par le nom exact de la spécialité, sans phrase, sans explication.

Symptômes : "${symptoms}"`;

  try {
    const response = await client.chat.send({
      httpReferer: window.location.origin,
      chatRequest: {
        model: 'openrouter/free',
        messages: [
          { role: 'system', content: 'Réponds uniquement par le nom d\'une spécialité médicale. Pas de phrase. Pas d\'explication. Un seul mot ou groupe de mots.' },
          { role: 'user', content: prompt },
        ],
        maxTokens: 30,
        temperature: 0,
        stream: false,
      },
    });

    if ('choices' in response && response.choices?.[0]?.message?.content) {
      const specialty = extractSpecialty(response.choices[0].message.content);
      if (specialty) return specialty;
      console.warn('AI returned invalid specialty:', response.choices[0].message.content);
    }
    return null;
  } catch (err) {
    console.error('OpenRouter API call failed:', err);
    return null;
  }
}
