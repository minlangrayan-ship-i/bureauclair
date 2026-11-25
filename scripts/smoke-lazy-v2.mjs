import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
const report = { checks: [], errors: [] };
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.goto('http://127.0.0.1:4175/');
  for (const [label, route, heading] of [
    ['Atelier IA', '/atelier', 'Une consigne claire. Un résultat à contrôler.'],
    ['Raccourcis et commandes', '/raccourcis', 'Le bon geste, au bon moment.'],
    ['Couverture des compétences', '/competences', 'Ce qui est abordé. Ce qui reste à construire.'],
    ['Vidéos YouTube', '/videos', 'Voir les gestes. Connaître la source.'],
    ['Parcours', '/parcours', 'Une tâche de bout en bout.'],
  ]) {
    await page.getByRole('link', { name: label, exact: true }).filter({ visible: true }).first().click();
    await expect(page).toHaveURL('http://127.0.0.1:4175' + route);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page).toHaveTitle(heading + ' — BureauClair');
    report.checks.push({ label, url: page.url(), heading, documentTitle: await page.title() });
  }
  await page.goto('http://127.0.0.1:4175/raccourcis');
  const keyboard = page.locator('#clavier-exercice');
  await keyboard.getByRole('button', { name: 'Vérifier la combinaison', exact: true }).click();
  await expect(keyboard.getByRole('status')).toContainText('À revoir');
  await keyboard.getByRole('button', { name: 'Windows', exact: true }).click();
  await keyboard.getByRole('button', { name: 'E', exact: true }).click();
  await keyboard.getByRole('button', { name: 'Vérifier la combinaison', exact: true }).click();
  await expect(keyboard.getByRole('status')).toContainText('Réussi : Windows + E');
  report.checks.push({ route: '/raccourcis', simulation: 'combinaison incorrecte puis correcte' });
  await page.goto('http://127.0.0.1:4175/annuaire');
  await page.getByRole('checkbox').check();
  await expect(page.locator('.tool-card')).toHaveCount(5);
  await expect(page.getByText('Hybride · selon la fonction')).toBeVisible();
  await context.close();
} catch (error) {
  report.errors.push(error.message);
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync('docs/v2/smoke-lazy.json', JSON.stringify(report, null, 2));
}
console.log(JSON.stringify(report, null, 2));
if (report.errors.length) process.exitCode = 1;
