const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SPECIALTIES_LIST = [
  "Médecine Générale", "Dentaire", "Gynécologie – Obstétrique",
  "Pédiatrie", "Cardiologie", "Ophtalmologie", "Dermatologie",
  "ORL – Oto-Rhino-Laryngologie", "Orthopédie – Traumatologie",
  "Psychiatrie – Psychologie"
];

export async function matchSpecialtyWithAI(symptoms) {
  if (!API_KEY) return null;

  const prompt = `Tu es un assistant médical. Un patient décrit ses symptômes.
Choisis UNE seule spécialité parmi la liste suivante qui correspond le mieux à ses symptômes :
${SPECIALTIES_LIST.map(s => `- ${s}`).join('\n')}

Réponds UNIQUEMENT avec le nom exact de la spécialité, rien d'autre.

Symptômes du patient : "${symptoms}"`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 50,
        temperature: 0,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const specialty = data.choices?.[0]?.message?.content?.trim();

    if (SPECIALTIES_LIST.includes(specialty)) {
      return specialty;
    }

    console.warn('AI returned invalid specialty:', specialty);
    return null;
  } catch (err) {
    if (err.name === 'TimeoutError') {
      console.warn('OpenRouter API timeout');
    } else {
      console.error('OpenRouter API call failed:', err);
    }
    return null;
  }
}
