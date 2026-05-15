export const CITIES = [
  { name: "El Jadida", slug: "el-jadida", region: "Casablanca-Settat" },
  { name: "Casablanca", slug: "casablanca", region: "Casablanca-Settat" },
  { name: "Rabat", slug: "rabat", region: "Rabat-Salé-Kénitra" },
  { name: "Marrakech", slug: "marrakech", region: "Marrakech-Safi" },
  { name: "Fès", slug: "fes", region: "Fès-Meknès" },
  { name: "Tanger", slug: "tanger", region: "Tanger-Tétouan-Al Hoceïma" },
  { name: "Agadir", slug: "agadir", region: "Souss-Massa" },
  { name: "Meknès", slug: "meknes", region: "Fès-Meknès" },
  { name: "Oujda", slug: "oujda", region: "Oriental" },
  { name: "Kénitra", slug: "kenitra", region: "Rabat-Salé-Kénitra" },
  { name: "Salé", slug: "sale", region: "Rabat-Salé-Kénitra" },
  { name: "Mohammédia", slug: "mohammadia", region: "Casablanca-Settat" },
  { name: "Tétouan", slug: "tetouan", region: "Tanger-Tétouan-Al Hoceïma" },
  { name: "Safi", slug: "safi", region: "Marrakech-Safi" },
  { name: "Beni Mellal", slug: "beni-mellal", region: "Béni Mellal-Khénifra" },
  { name: "Laâyoune", slug: "laayoune", region: "Laâyoune-Sakia El Hamra" },
  { name: "Nador", slug: "nador", region: "Oriental" },
  { name: "Settat", slug: "settat", region: "Casablanca-Settat" },
  { name: "Khouribga", slug: "khouribga", region: "Béni Mellal-Khénifra" },
  { name: "El Kelâa des Sraghna", slug: "el-kelaa-des-sraghna", region: "Marrakech-Safi" },
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
