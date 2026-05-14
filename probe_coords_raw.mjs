const c = new AbortController();
setTimeout(() => c.abort(), 10000);
const res = await fetch('https://www.google.com/maps/place/?q=place_id:ChIJWaQEd-IfqQ0Rln3ZGB-5GoE', {
  signal: c.signal,
  headers: {
    'user-agent': 'Mozilla/5.0',
    'accept-language': 'en-US,en;q=0.9',
  },
});
const text = await res.text();
const patterns = [
  /33\.(?:2|23|231|2315|23158|231584)\d*/g,
  /-8\.(?:5|50|500|5006|50062|500629)\d*/g,
  /\d{2}\.\d{4,},-?\d{1,2}\.\d{4,}/g,
  /@-?\d{2}\.\d+,-?\d{1,2}\.\d+,\d+z/g,
  /!3d-?\d{2}\.\d+!4d-?\d{1,2}\.\d+/g,
];
for (const p of patterns) {
  const matches = text.match(p) || [];
  console.log('pattern', p, 'count', matches.length, 'sample', matches.slice(0, 10));
}
