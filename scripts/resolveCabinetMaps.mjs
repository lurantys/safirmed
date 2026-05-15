import fs from 'fs';
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

function extractPlaceName(source) {
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

function toEmbedUrlFromCoords({ lat, lng, zoom }) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
}

function toEmbedUrlFromPlaceName(name) {
  return `https://www.google.com/maps?q=${encodeURIComponent(name)}&output=embed`;
}

function resolveEmbedUrl(mapsUrl, fallbackName, fallbackAddress = '') {
  if (!mapsUrl) return fallbackName ? toEmbedUrlFromPlaceName(fallbackName) : '';

  // Try to extract coordinates directly from the maps URL
  const directCoords = extractCoordinates(mapsUrl);
  if (directCoords) {
    return toEmbedUrlFromCoords(directCoords);
  }

  // Try to extract place_id — NOT supported in basic iframe embed, skip to fallback
  // const placeIdMatch = mapsUrl.match(/place_id:([A-Za-z0-9_-]+)/i);
  // if (placeIdMatch?.[1]) {
  //   return `https://maps.google.com/maps?q=place_id:${placeIdMatch[1]}&output=embed`;
  // }

  // Fall back to place name or name+address
  const placeName = extractPlaceName(mapsUrl);
  if (placeName) {
    return toEmbedUrlFromPlaceName(placeName);
  }

  const searchQuery = [fallbackName, fallbackAddress].filter(Boolean).join(', ');
  if (searchQuery) {
    return toEmbedUrlFromPlaceName(searchQuery);
  }

  return '';
}

function main() {
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
    const embedUrl = resolveEmbedUrl(mapsUrl, name || address, address);

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

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(cabinets, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${cabinets.length} cabinets to ${OUTPUT_JSON}`);
}

main();
