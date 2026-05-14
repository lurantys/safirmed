const url = 'https://www.google.com/maps/place/?q=place_id:ChIJWaQEd-IfqQ0Rln3ZGB-5GoE';
const c = new AbortController();
setTimeout(() => c.abort(), 10000);
const res = await fetch(url, {
  signal: c.signal,
  headers: {
    'user-agent': 'Mozilla/5.0',
    'accept-language': 'en-US,en;q=0.9',
  },
});
const text = await res.text();
const unescaped = text
  .replace(/\+/g, ' ')
  .replace(/\\u003d/g, '=')
  .replace(/\\u0026/g, '&')
  .replace(/\\u003c/g, '<')
  .replace(/\\u003e/g, '>')
  .replace(/\\\//g, '/')
  .replace(/&amp;/g, '&');

const patterns = [
  /https:\/\/www\.google\.com\/maps\/place\/[^"'\s]+/i,
  /https:\/\/www\.google\.com\/maps\/place\/[^"'\s]+\/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)z/i,
  /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)z/i,
  /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i,
];
for (const p of patterns) {
  const m = unescaped.match(p) || text.match(p);
  console.log('pattern', p, '=>', m ? m.slice(0, 6) : null);
}
const idx = unescaped.indexOf('Cabinet de Médecine Générale Dr. Abujoma Sobheya');
console.log('name idx', idx);
if (idx >= 0) console.log(unescaped.slice(Math.max(0, idx - 500), idx + 1200));
