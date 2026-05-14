export function extractCoordinates(source) {
  const text = String(source || '');

  const patterns = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),(\d+(?:\.\d+)?)z/i,
    /@(-?\d+(?:\.\d+)?)%2C(-?\d+(?:\.\d+)?)%2C(\d+(?:\.\d+)?)z/i,
    /%40(-?\d+(?:\.\d+)?)%2C(-?\d+(?:\.\d+)?)%2C(\d+(?:\.\d+)?)z/i,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;

    if (pattern.source.includes('!3d')) {
      return { lat: match[1], lng: match[2], zoom: '17' };
    }

    return { lat: match[1], lng: match[2], zoom: match[3] || '17' };
  }

  return null;
}

export function extractPlaceName(source) {
  const text = String(source || '');

  const placeMatch = text.match(/\/maps\/place\/([^/@?]+)/i);
  if (placeMatch?.[1]) {
    return decodeURIComponent(String(placeMatch[1]).replace(/\+/g, ' ')).trim();
  }

  try {
    const parsed = new URL(text);
    const q = parsed.searchParams.get('q');
    if (q && !q.startsWith('place_id:')) {
      return decodeURIComponent(String(q).replace(/\+/g, ' ')).trim();
    }
  } catch {
    // ignore
  }

  return '';
}

export function toEmbedUrlFromCoords({ lat, lng, zoom }) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
}

export function toEmbedUrlFromPlaceName(name) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(name)}&output=embed`;
}

export function convertToEmbedUrl(mapsUrl, fallbackName = '', fallbackAddress = '') {
  if (!mapsUrl) {
      const searchQuery = [fallbackName, fallbackAddress].filter(Boolean).join(', ');
      if (searchQuery) return toEmbedUrlFromPlaceName(searchQuery);
      return '';
  }

  // Try to extract coordinates directly from the maps URL
  const directCoords = extractCoordinates(mapsUrl);
  if (directCoords) {
    return toEmbedUrlFromCoords(directCoords);
  }

  // Fall back to place name (if present in URL path)
  const fallbackPlaceName = extractPlaceName(mapsUrl);
  if (fallbackPlaceName) {
    return toEmbedUrlFromPlaceName(fallbackPlaceName);
  }
  
  // If the url is just a place_id search, or we couldn't extract anything useful,
  // we must use the actual address or name because basic maps iframe doesn't support place_id.
  const searchQuery = [fallbackName, fallbackAddress].filter(Boolean).join(', ');
  if (searchQuery) return toEmbedUrlFromPlaceName(searchQuery);

  return '';
}
