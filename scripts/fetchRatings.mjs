import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchRating, extractPlaceId, API_KEY } from './placesApi.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, '../public/cabinets_resolved.json');

async function main() {
  if (!API_KEY) {
    console.log('No GOOGLE_PLACES_API_KEY set. Skipping rating fetch.');
    console.log('');
    console.log('To enable ratings:');
    console.log('  1. Go to https://console.cloud.google.com/apis/credentials');
    console.log('  2. Create an API key');
    console.log('  3. Enable "Places API" (new) at https://console.cloud.google.com/apis/library');
    console.log('  4. Set GOOGLE_PLACES_API_KEY in your environment');
    console.log('     (export for local, env var for Vercel)');
    console.log('  Free tier: $200/mo credit covers ~11,764 lookups.');
    return;
  }

  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const doctors = JSON.parse(raw);
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < doctors.length; i++) {
    const doc = doctors[i];
    const placeId = extractPlaceId(doc.mapsUrl);

    if (doc.rating && doc.rating > 0) {
      skipped++;
      continue;
    }

    if (!placeId) {
      console.log(`[${i + 1}/${doctors.length}] ${doc.Nom.slice(0, 40).padEnd(42)} no place_id`);
      continue;
    }

    process.stdout.write(`[${i + 1}/${doctors.length}] ${doc.Nom.slice(0, 40).padEnd(42)}`);
    const result = await fetchRating(placeId);
    if (result) {
      doc.rating = result.rating;
      doc.ratingCount = result.count;
      updated++;
      console.log(` ★ ${result.rating} (${result.count} avis)`);
    } else {
      console.log('  no rating');
    }

    if (i < doctors.length - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (updated > 0) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(doctors, null, 2), 'utf-8');
    console.log(`\n✓ Updated ${updated} doctors with Google ratings (${skipped} already had ratings).`);
  } else {
    console.log(`\nNo new ratings fetched (${skipped} already had ratings).`);
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
