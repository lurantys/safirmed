import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public');
const SITE_URL = 'https://safirmed.vercel.app';

const CITIES = [
  'el-jadida', 'casablanca', 'rabat', 'marrakech', 'fes', 'tanger',
  'agadir', 'meknes', 'oujda', 'kenitra', 'sale', 'mohammadia',
  'tetouan', 'safi', 'beni-mellal', 'laayoune', 'nador', 'settat',
  'khouribga', 'el-kelaa-des-sraghna',
];

const SPECIALTIES = [
  'medecine-generale', 'dentaire', 'gynecologie-obstetrique',
  'pediatrie', 'cardiologie', 'ophtalmologie', 'dermatologie',
  'orl', 'orthopedie-traumatologie', 'psychiatrie-psychologie',
];

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/search', priority: '0.8', changefreq: 'weekly' },
  { path: '/signin', priority: '0.3', changefreq: 'monthly' },
  { path: '/signup', priority: '0.3', changefreq: 'monthly' },
];

function generateSitemap() {
  const urls = [];

  staticRoutes.forEach(route => {
    urls.push(`
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <priority>${route.priority}</priority>
    <changefreq>${route.changefreq}</changefreq>
  </url>`);
  });

  CITIES.forEach(city => {
    SPECIALTIES.forEach(specialty => {
      urls.push(`
  <url>
    <loc>${SITE_URL}/${city}/${specialty}</loc>
    <priority>0.6</priority>
    <changefreq>weekly</changefreq>
  </url>`);
    });
  });

  try {
    const doctorsPath = path.resolve(__dirname, '../public/cabinets_resolved.json');
    if (fs.existsSync(doctorsPath)) {
      const doctors = JSON.parse(fs.readFileSync(doctorsPath, 'utf-8'));
      doctors.forEach(doc => {
        if (doc.ID) {
          urls.push(`
  <url>
    <loc>${SITE_URL}/doctor/${doc.ID}</loc>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>`);
        }
      });
    }
  } catch (e) {
    console.warn('Could not load doctors for sitemap:', e.message);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.04">
  ${urls.join('')}
</urlset>`;

  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`Sitemap generated: ${urls.length} URLs`);
}

generateSitemap();
