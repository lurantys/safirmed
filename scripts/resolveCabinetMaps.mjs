import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const INPUT_XLSX = fileURLToPath(new URL('../public/cabinets_eljadida.xlsx', import.meta.url));
const OUTPUT_JSON = fileURLToPath(new URL('../public/cabinets_resolved.json', import.meta.url));

function getCellString(cell) {
  if (!cell || cell.v == null) return '';
  return String(cell.v).trim();
}

function getHyperlinkTarget(cell) {
  if (!cell) return '';
  if (cell.l && cell.l.Target) return String(cell.l.Target).trim();
  if (typeof cell.v === 'string' && cell.v.includes('http')) return cell.v.trim();
  return '';
}

function decodeMapsSegment(value) {
  return decodeURIComponent(String(value).replace(/\+/g, ' ')).trim();
}

function extractPlaceId(source) {
  const text = String(source || '');
  try {
    const parsed = new URL(text);
    const q = parsed.searchParams.get('q');
    if (q && q.startsWith('place_id:')) return q;
  } catch {
    // ignore
  }

  const match = text.match(/place_id:([A-Za-z0-9_-]+)/i);
  if (match?.[1]) return `place_id:${match[1]}`;
  return '';
}

function extractCoordinates(source) {
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

function tryDecodeTwice(text) {
  let current = String(text || '');
  for (let i = 0; i < 2; i += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
    } catch {
      break;
    }
  }
  return current;
}

function unescapeGoogleHtml(text) {
  return String(text || '')
    .replace(/\\u003d/g, '=')
    .replace(/\\u0026/g, '&')
    .replace(/\\u003c/g, '<')
    .replace(/\\u003e/g, '>')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');
}

function extractPlaceName(source) {
  const text = String(source || '');

  const placeMatch = text.match(/\/maps\/place\/([^/@?]+)/i);
  if (placeMatch?.[1]) return decodeMapsSegment(placeMatch[1]);

  try {
    const parsed = new URL(text);
    const q = parsed.searchParams.get('q');
    if (q && !q.startsWith('place_id:')) return decodeMapsSegment(q);
  } catch {
    // ignore
  }

  return '';
}

function toEmbedUrlFromCoords({ lat, lng, zoom }) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
}

function toEmbedUrlFromPlaceName(name) {
  return `https://www.google.com/maps?q=${encodeURIComponent(name)}&output=embed`;
}

async function fetchGoogleMapsPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0',
        'accept-language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) return '';
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveEmbedUrl(mapsUrl, fallbackName) {
  if (!mapsUrl) return fallbackName ? toEmbedUrlFromPlaceName(fallbackName) : '';

  const placeId = extractPlaceId(mapsUrl);
  if (placeId) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeId)}&output=embed`;
  }

  const directCoords = extractCoordinates(mapsUrl);
  if (directCoords) return toEmbedUrlFromCoords(directCoords);

  const pageHtml = await fetchGoogleMapsPage(mapsUrl).catch(() => '');
  if (pageHtml) {
    const decodedPageHtml = tryDecodeTwice(pageHtml);
    const unescapedPageHtml = unescapeGoogleHtml(decodedPageHtml);

    const pageCoords = extractCoordinates(pageHtml)
      || extractCoordinates(decodedPageHtml)
      || extractCoordinates(unescapedPageHtml);
    if (pageCoords) return toEmbedUrlFromCoords(pageCoords);

    const canonicalPlaceUrlMatch = unescapedPageHtml.match(/https:\/\/www\.google\.com\/maps\/place\/[^"'\s]+/i);
    if (canonicalPlaceUrlMatch?.[0]) {
      const canonicalCoords = extractCoordinates(canonicalPlaceUrlMatch[0]);
      if (canonicalCoords) return toEmbedUrlFromCoords(canonicalCoords);
    }

    if (fallbackName) return toEmbedUrlFromPlaceName(fallbackName);
  }

  const fallbackPlaceName = extractPlaceName(mapsUrl) || fallbackName;
  if (fallbackPlaceName) return toEmbedUrlFromPlaceName(fallbackPlaceName);

  return '';
}

async function main() {
  const workbook = XLSX.readFile(INPUT_XLSX);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const expectedHeaders = ['Spécialité', 'Nom du Cabinet / Médecin', 'Téléphone', 'Adresse', 'Lien Google Maps'];
  let headerRow = range.s.r;
  const headers = {};

  for (let R = range.s.r; R <= Math.min(range.s.r + 5, range.e.r); ++R) {
    const rowHeaders = {};
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) rowHeaders[String(cell.v).trim()] = C;
    }

    const foundCount = expectedHeaders.filter((h) => rowHeaders[h] !== undefined).length;
    if (foundCount >= 3) {
      headerRow = R;
      Object.assign(headers, rowHeaders);
      break;
    }
  }

  if (!Object.keys(headers).length) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: headerRow });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) headers[String(cell.v).trim()] = C;
    }
  }

  const cabinets = [];
  for (let R = headerRow + 1; R <= range.e.r; ++R) {
    const nameCell = worksheet[XLSX.utils.encode_cell({ c: headers['Nom du Cabinet / Médecin'] ?? 1, r: R })];
    if (!nameCell || !nameCell.v) continue;

    const specialtyCell = worksheet[XLSX.utils.encode_cell({ c: headers['Spécialité'] ?? 0, r: R })];
    const phoneCell = worksheet[XLSX.utils.encode_cell({ c: headers['Téléphone'] ?? 2, r: R })];
    const addressCell = worksheet[XLSX.utils.encode_cell({ c: headers['Adresse'] ?? 3, r: R })];
    const linkCell = worksheet[XLSX.utils.encode_cell({ c: headers['Lien Google Maps'] ?? 4, r: R })];

    const specialty = getCellString(specialtyCell);
    if (specialty.startsWith('▶')) continue;

    const name = getCellString(nameCell);
    const phone = getCellString(phoneCell);
    const address = getCellString(addressCell);
    const mapsUrl = getHyperlinkTarget(linkCell);
    const embedUrl = await resolveEmbedUrl(mapsUrl, name || address);

    cabinets.push({
      ID: String(cabinets.length + 1),
      Nom: name,
      Spécialité: specialty,
      Téléphone: phone,
      Adresse: address,
      Ville: 'El Jadida',
      Horaire: 'Horaires non spécifiés',
      mapsUrl,
      embedUrl,
    });
  }

  await fs.writeFile(OUTPUT_JSON, `${JSON.stringify(cabinets, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${cabinets.length} cabinets to ${OUTPUT_JSON}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
