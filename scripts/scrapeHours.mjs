import fs from 'fs';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import { chromium } from 'playwright';

const INPUT_XLSX = fileURLToPath(new URL('../public/cabinets_eljadida.xlsx', import.meta.url));
const OUTPUT_JSON = fileURLToPath(new URL('../public/hours.json', import.meta.url));

async function main() {
  const workbook = XLSX.readFile(INPUT_XLSX);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  
  let headerRow = 0;
  let headers = {};
  for (let R = 0; R <= Math.min(5, range.e.r); R++) {
    const rowHeaders = {};
    for (let C = 0; C <= range.e.c; C++) {
      const cell = worksheet[XLSX.utils.encode_cell({ c: C, r: R })];
      if (cell?.v) rowHeaders[String(cell.v).trim()] = C;
    }
    if (Object.keys(rowHeaders).length > 3) {
      headerRow = R;
      headers = rowHeaders;
      break;
    }
  }

  const targets = [];
  for (let R = headerRow + 1; R <= range.e.r; R++) {
    const nameCell = worksheet[XLSX.utils.encode_cell({ c: headers['Nom du Cabinet / Médecin'] ?? 1, r: R })];
    if (!nameCell?.v) continue;
    
    const linkCell = worksheet[XLSX.utils.encode_cell({ c: headers['Lien Google Maps'] ?? 4, r: R })];
    const mapsUrl = (linkCell?.l?.Target || linkCell?.v || '').toString().trim();
    
    if (mapsUrl && mapsUrl.startsWith('http')) {
      targets.push({ id: targets.length + 1, mapsUrl, name: String(nameCell.v).trim() });
    } else {
      targets.push({ id: targets.length + 1, mapsUrl: null, name: String(nameCell.v).trim() });
    }
  }

  console.log(`Found ${targets.length} valid cabinets to process.`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: 'fr-FR' });
  const page = await context.newPage();

  const hoursData = {};

  if (fs.existsSync(OUTPUT_JSON)) {
    try {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf-8'));
      Object.assign(hoursData, existing);
    } catch (e) {}
  }

  for (const target of targets) {
    if (!target.mapsUrl) continue;
    if (hoursData[target.id] && hoursData[target.id] !== 'Non spécifié' && hoursData[target.id] !== 'Erreur') {
      console.log(`Skipping [${target.id}] (already scraped)`);
      continue;
    }

    console.log(`Scraping [${target.id}] ${target.name}...`);
    try {
      await page.goto(target.mapsUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(3000); 
      
      const hoursLabel = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('[aria-label]'));
        const hoursEl = els.find(el => {
            const label = el.getAttribute('aria-label').toLowerCase();
            return label.includes('lundi') && label.includes('mardi') && (label.includes('fermé') || /\d{1,2}/.test(label));
        });
        
        if (hoursEl) return hoursEl.getAttribute('aria-label');

        const tds = Array.from(document.querySelectorAll('td'));
        const dayTds = tds.filter(td => {
            const txt = td.textContent.toLowerCase();
            return txt.includes('lundi') || txt.includes('mardi') || txt.includes('mercredi');
        });
        if (dayTds.length > 0) {
            const table = dayTds[0].closest('table');
            if (table) {
                return Array.from(table.querySelectorAll('tr')).map(tr => tr.textContent.trim().replace(/\u202f/g, ' ')).join(' | ');
            }
        }
        
        return null;
      });

      if (hoursLabel) {
        let cleanText = hoursLabel;
        if (cleanText.includes('. Masquer les horaires')) {
            cleanText = cleanText.split('. Masquer')[0];
        }
        hoursData[target.id] = cleanText.substring(0, 500);
        console.log(` -> Found: ${hoursData[target.id].substring(0, 50)}...`);
      } else {
        hoursData[target.id] = 'Non spécifié';
        console.log(` -> No hours found.`);
      }

    } catch (err) {
      console.log(` -> Error: ${err.message}`);
      hoursData[target.id] = 'Erreur';
    }

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(hoursData, null, 2));
    await page.waitForTimeout(1000);
  }

  await browser.close();
  console.log('Scraping completed!');
}

main().catch(console.error);
