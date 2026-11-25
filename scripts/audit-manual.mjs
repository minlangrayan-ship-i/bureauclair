import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { prompts } from '../src/content/prompts.ts';
import { tools } from '../src/content/tools.ts';
const dir='docs/audit-guide-2026-11-24'; fs.mkdirSync(`${dir}/captures`,{recursive:true});
const inventory={guides:[],articles:[],prompts,tools};
for(const [kind,folder] of [['guides','guides'],['articles','articles']]) for(const f of fs.readdirSync(`src/content/${folder}`)) {
 const raw=fs.readFileSync(`src/content/${folder}/${f}`,'utf8'); const nl=raw.indexOf('\n');
 inventory[kind].push({...JSON.parse(raw.slice(0,nl)),slug:f.replace(/\.md$/,''),body:raw.slice(nl).trim()});
}
fs.writeFileSync(`${dir}/inventaire.json`,JSON.stringify(inventory,null,2));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const report={capturedAt:new Date().toISOString(),base:'http://127.0.0.1:4175',routes:[],tests:[],errors:[],requests:[],screens:[]};
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('request',r=>report.requests.push({url:r.url(),method:r.method(),type:r.resourceType()}));
 async function snap(name){await page.screenshot({path:`${dir}/captures/${name}.png`});report.screens.push({name,url:page.url()});}
 async function go(route,name){await page.goto(report.base+route);await page.locator('h1').waitFor();await page.waitForTimeout(350);const dom=await page.locator('body').ariaSnapshot();fs.writeFileSync(`${dir}/captures/${name}.txt`,dom);if(name)await snap(name);}
 const samples=[['/','01-accueil'],['/guides','02-tutoriels'],['/guides/copier-un-fichier','03-guide'],['/prompts','04-prompts'],['/outils','05-outils'],['/studio','06-studio'],['/blog','07-blog'],['/annuaire','08-annuaire'],['/confidentialite','09-confidentialite'],['/accessibilite','10-accessibilite'],['/editorial','11-editorial'],['/a-propos','12-a-propos']];
 for(const [route,name] of samples)await go(route,name);
 await go('/recherche?q=copier+un+fichier','13-recherche');
 report.tests.push({id:'recherche-singulier',result:await page.getByRole('status').allTextContents()});
 await go('/recherche?q=copier+des+fichiers','14-recherche-pluriel');
 report.tests.push({id:'recherche-pluriel',result:await page.getByRole('status').allTextContents()});
 await go('/guides?categorie=Excel','15-filtre-excel');
 const first=page.locator('.content-card a').first();const next=await first.getAttribute('href');
 await first.click();await page.locator('.prose').waitFor();await page.locator('body').ariaSnapshot();
 await page.getByRole('link',{name:/Retour aux tutoriels/}).click();
 report.tests.push({id:'retour-filtres',before:'/guides?categorie=Excel',opened:next,after:page.url(),result:await page.getByRole('status').allTextContents()});
 await snap('16-retour-filtres');
 await go('/guides/copier-un-fichier','17-guide-actions');
 await page.getByRole('checkbox').first().check();await page.getByRole('button',{name:'Marquer comme lu',exact:true}).click();
 await page.getByRole('button',{name:'Copier les étapes',exact:true}).click();
 report.tests.push({id:'guide-copie',clipboard:(await page.evaluate(()=>navigator.clipboard.readText())).slice(0,180),video:await page.locator('video').count(),youtube:await page.locator('iframe[src*="youtube"]').count()});
 await page.locator('.step-checklist').screenshot({path:`${dir}/captures/18-progression.png`});
 const video=page.locator('video');await video.scrollIntoViewIfNeeded();await video.evaluate(v=>v.load());await page.waitForTimeout(500);
 report.tests.push({id:'video-locale',value:await video.evaluate(v=>({ready:v.readyState,duration:v.duration,error:v.error?.message,tracks:v.textTracks.length}))});await snap('19-video');
 await go('/prompts','20-prompts-action');await page.getByRole('button',{name:/Adapter ce prompt/}).first().click();await page.getByRole('dialog').waitFor();await page.locator('body').ariaSnapshot();
 await page.getByLabel('Votre objectif et contexte non sensible').fill('Préparer une réunion de suivi de 30 minutes.');await page.getByLabel('Ton',{exact:true}).selectOption('simple et direct');
 await page.getByRole('button',{name:'Copier mon prompt',exact:true}).click();
 report.tests.push({id:'prompt-personnalise',clipboard:await page.evaluate(()=>navigator.clipboard.readText())});await snap('21-prompt-dialogue');await page.getByRole('button',{name:'Fermer',exact:true}).click();
 await go('/studio','22-studio-notes');await page.getByRole('tab',{name:'Notes manuelles'}).click();await page.locator('body').ariaSnapshot();
 await page.getByLabel('Votre compte rendu de travail').fill('ESSAI AUDIT NON SENSIBLE — réunion de démonstration.');await snap('23-notes');
 for(const type of ['TXT','DOCX']){const downloadEvent=page.waitForEvent('download');await page.getByRole('button',{name:`Exporter ${type}`,exact:true}).click();const download=await downloadEvent;await download.saveAs(`${dir}/audit-notes.${type.toLowerCase()}`);report.tests.push({id:`export-${type}`,filename:download.suggestedFilename()});}
 let dialogs=0;page.on('dialog',async d=>{dialogs++;await d.dismiss();});
 await page.locator('header').getByRole('link',{name:'Blog',exact:true}).click();await page.locator('h1').waitFor();
 await page.goto(report.base+'/studio');await page.getByRole('tab',{name:'Notes manuelles'}).click();
 report.tests.push({id:'perte-notes-navigation',dialogs,notesAfter:await page.getByLabel('Votre compte rendu de travail').inputValue()});
 await page.locator('input[type=file]').setInputFiles({name:'essai.txt',mimeType:'text/plain',buffer:Buffer.from('faux fichier volontaire pour test de rejet')});
 report.tests.push({id:'format-invalide',alert:await page.getByRole('alert').allTextContents()});await snap('24-format-refuse');
 await go('/annuaire','25-annuaire-local');await page.getByRole('checkbox',{name:'Options avec usage local'}).check();
 report.tests.push({id:'annuaire-local',names:await page.locator('.tool-card h2').allTextContents()});await snap('26-annuaire-filtre');
 await go('/blog/ia-confidentialite','27-article');
 await go('/introuvable-audit','28-introuvable');
 await go('/','29-installation');await page.getByRole('button',{name:/Installer/}).first().click();await snap('30-dialogue-installation');
 const routeList=['/','/guides','/recherche','/prompts','/blog','/annuaire','/outils','/studio','/confidentialite','/accessibilite','/editorial','/a-propos',...inventory.guides.map(g=>'/guides/'+g.slug),...inventory.articles.map(g=>'/blog/'+g.slug)];
 for(const route of routeList){await page.goto(report.base+route);await page.locator('h1').waitFor();await page.waitForTimeout(80);report.routes.push({route,h1:await page.locator('h1').textContent(),horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),brokenImages:await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src))});}
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1,hasTouch:true});const mp=await mobile.newPage();
 for(const [route,name] of [['/','31-mobile-accueil'],['/guides','32-mobile-guides'],['/studio','33-mobile-studio'],['/guides/copier-un-fichier','34-mobile-guide']]) {await mp.goto(report.base+route);await mp.locator('h1').waitFor();await mp.waitForTimeout(250);await mp.screenshot({path:`${dir}/captures/${name}.png`});report.tests.push({id:name,overflow:await mp.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});}
 await mp.goto(report.base+'/');await mp.locator('body').ariaSnapshot();const menu=mp.getByRole('button',{name:/menu/i});if(await menu.count()){await menu.click();await mp.screenshot({path:`${dir}/captures/35-mobile-menu.png`});report.tests.push({id:'menu-mobile',expanded:await menu.getAttribute('aria-expanded')});}
 await context.close();await mobile.close();
} finally {fs.writeFileSync(`${dir}/audit-captures.json`,JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({routes:report.routes.length,tests:report.tests,errors:report.errors,screens:report.screens.length},null,2));
