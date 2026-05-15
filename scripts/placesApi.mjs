const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY || '';

function extractPlaceId(mapsUrl) {
  if (!mapsUrl) return null;
  const m = mapsUrl.match(/place_id:([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

async function fetchRating(placeId) {
  if (!API_KEY) return null;
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&key=${API_KEY}&language=fr&fields=rating,user_ratings_total`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.warn(`  Places API error ${res.status}: ${text.slice(0, 100)}`);
      return null;
    }
    const data = await res.json();
    if (data.status !== 'OK') {
      if (data.status !== 'NOT_FOUND' && data.status !== 'ZERO_RESULTS') {
        console.warn(`  Places API status ${data.status}: ${data.error_message || ''}`);
      }
      return null;
    }
    if (data.result?.rating && data.result.rating >= 1 && data.result.rating <= 5) {
      return { rating: data.result.rating, count: data.result.user_ratings_total || 0 };
    }
    return null;
  } catch (err) {
    console.warn(`  Fetch failed for ${placeId}:`, err.message);
    return null;
  }
}

export { fetchRating, extractPlaceId, API_KEY };
