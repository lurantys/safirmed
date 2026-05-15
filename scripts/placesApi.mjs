const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.VITE_GOOGLE_PLACES_API_KEY || '';

function extractPlaceId(mapsUrl) {
  if (!mapsUrl) return null;
  const m = mapsUrl.match(/place_id:([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

async function fetchRating(placeId) {
  if (!API_KEY) return null;
  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?fields=rating,userRatingCount&languageCode=fr&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.warn(`  Places API error ${res.status}: ${text.slice(0, 150)}`);
      return null;
    }
    const data = await res.json();
    if (data.error) {
      console.warn(`  Places API error: ${data.error.message || JSON.stringify(data.error)}`);
      return null;
    }
    if (data.rating && data.rating >= 1 && data.rating <= 5) {
      return { rating: data.rating, count: data.userRatingCount || 0 };
    }
    return null;
  } catch (err) {
    console.warn(`  Fetch failed for ${placeId}:`, err.message);
    return null;
  }
}

export { fetchRating, extractPlaceId, API_KEY };
