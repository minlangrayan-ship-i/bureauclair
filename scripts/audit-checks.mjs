import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const dir='docs/audit-guide-2026-11-24';
const first=JSON.parse(fs.readFileSync(`${dir}/audit-captures.json`,'utf8'));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const result={date:new Date().toISOString(),axe:[],errors:[],transcription:{},offline:{},video:{}};
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000}});const page=await context.newPage();page.on('pageerror',e=>result.errors.push(e.message));
  for(const {route} of first.routes){await page.goto(first.base+route);await page.locator('h1').waitFor();const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();result.axe.push({width,route,violations:audit.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length})),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});}
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const requests=[];page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
 await page.goto(first.base+'/guides/copier-un-fichier');await page.locator('video').evaluate(async v=>{v.load();await v.play()});await page.waitForTimeout(2200);result.video=await page.locator('video').evaluate(v=>({time:v.currentTime,paused:v.paused,duration:v.duration,error:v.error?.message}));await page.locator('video').pause?.();await page.locator('video').evaluate(v=>v.pause());await page.locator('video').scrollIntoViewIfNeeded();await page.screenshot({path:`dir/captures/36-video-lecture.png`.replace('dir/',dir+'/')});
 await page.goto(first.base+'/studio');await page.locator('body').ariaSnapshot();
 await page.locator('input[type=file]').setInputFiles('.runtime/test-fr.wav');
 await page.locator('.consent input').check();const start=Date.now();await page.getByRole('button',{name:'Charger le moteur local',exact:true}).click();
 await page.getByRole('button',{name:'Transcrire cet audio',exact:true}).waitFor();await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('Transcrire cet audio'))?.disabled,{},{timeout:300000});
 result.transcription.loadMs=Date.now()-start;const infer=Date.now();await page.getByRole('button',{name:'Transcrire cet audio',exact:true}).click();
 await page.getByLabel('Transcription à relire et corriger').waitFor({timeout:180000});result.transcription.inferMs=Date.now()-infer;result.transcription.text=await page.getByLabel('Transcription à relire et corriger').inputValue();
 await page.getByLabel('Transcription à relire et corriger').fill('Texte corrigé pour la recette BureauClair.');
 for(const type of ['TXT','DOCX']){const pending=page.waitForEvent('download');await page.getByRole('button',{name:`Exporter ${type}`,exact:true}).click();await (await pending).saveAs(`${dir}/transcription-corrigee.${type.toLowerCase()}`);}
 await page.locator('.studio-result').scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/captures/37-studio-transcrit.png`});
 result.transcription.posts=requests.filter(r=>r.method==='POST');result.transcription.externalHosts=[...new Set(requests.filter(r=>!r.url.startsWith(first.base)).map(r=>new URL(r.url).host))];
 page.on('dialog',d=>d.accept());await page.getByRole('button',{name:'Effacer la session',exact:true}).click();
 await page.goto(first.base+'/');await page.waitForFunction(()=>navigator.serviceWorker?.controller,{},{timeout:30000});await page.waitForTimeout(2500);await context.setOffline(true);
 await page.goto(first.base+'/guides');result.offline.guides=await page.locator('.content-card').count();await page.screenshot({path:`${dir}/captures/38-hors-ligne.png`});await page.goto(first.base+'/prompts');result.offline.prompts=await page.locator('.prompt-card').count();await context.setOffline(false);
 await context.close();
}catch(e){result.failure=e.message;}finally{fs.writeFileSync(`${dir}/audit-verifications.json`,JSON.stringify(result,null,2));await browser.close();}
console.log(JSON.stringify({...result,axe:{checks:result.axe.length,violations:result.axe.filter(x=>x.violations.length),overflow:result.axe.filter(x=>x.overflow)}},null,2));
