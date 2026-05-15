import { OpenRouter } from '@openrouter/sdk';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SPECIALTIES_LIST = [
  "Médecine Générale", "Dentaire", "Gynécologie – Obstétrique",
  "Pédiatrie", "Cardiologie", "Ophtalmologie", "Dermatologie",
  "ORL – Oto-Rhino-Laryngologie", "Orthopédie – Traumatologie",
  "Psychiatrie – Psychologie"
];

const client = new OpenRouter({
  apiKey: API_KEY,
});

export async function matchSpecialtyWithAI(symptoms) {
  if (!API_KEY) return null;

  const prompt = `Tu es un assistant médical. Un patient décrit ses symptômes.
Choisis UNE seule spécialité parmi la liste suivante qui correspond le mieux à ses symptômes :
${SPECIALTIES_LIST.map(s => `- ${s}`).join('\n')}

Réponds UNIQUEMENT avec le nom exact de la spécialité, rien d'autre.

Symptômes du patient : "${symptoms}"`;

  try {
    const response = await client.chat.send({
      httpReferer: window.location.origin,
      chatRequest: {
        model: 'openrouter/free',
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 100,
        temperature: 0,
        stream: false,
      },
    });

    if ('choices' in response && response.choices?.[0]?.message?.content) {
      const specialty = response.choices[0].message.content.replace(/[.\s]+$/, '').trim();
      if (SPECIALTIES_LIST.includes(specialty)) {
        return specialty;
      }
      console.warn('AI returned invalid specialty:', specialty);
    }
    return null;
  } catch (err) {
    console.error('OpenRouter API call failed:', err);
    return null;
  }
}
