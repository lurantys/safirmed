const PLACES_API = 'https://places.googleapis.com/v1/places';
const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY || '';

function extractPlaceId(mapsUrl) {
  if (!mapsUrl) return null;
  const m = mapsUrl.match(/place_id:([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

export async function fetchRating(placeId) {
  if (!API_KEY) return null;
  try {
    const url = `${PLACES_API}/${encodeURIComponent(placeId)}?fields=rating,userRatingCount&language=fr&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) return null;
      const text = await res.text();
      console.warn(`  Places API error ${res.status}: ${text.slice(0, 100)}`);
      return null;
    }
    const data = await res.json();
    if (data.rating && data.rating >= 1 && data.rating <= 5) {
      return { rating: data.rating, count: data.userRatingCount || 0 };
    }
    return null;
  } catch (err) {
    console.warn(`  Fetch failed for ${placeId}:`, err.message);
    return null;
  }
}

export { extractPlaceId, API_KEY };
