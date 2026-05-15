export const CITIES = [
  { name: "El Jadida", slug: "el-jadida", region: "Casablanca-Settat" },
];

export function cityBySlug(slug) {
  return CITIES.find(c => c.slug === slug) || null;
}

export function slugifyCity(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const DEFAULT_CITY_SLUG = "el-jadida";
