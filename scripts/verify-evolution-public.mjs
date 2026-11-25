import {chromium,expect} from '@playwright/test';
import fs from 'node:fs';
const base=process.env.BUREAUCLAIR_PUBLIC_URL||'https://minlangrayan-ship-i.github.io/bureauclair/';
const report={date:new Date().toISOString(),base,routes:[],assets:[],errors:[],consoleErrors:[],failedRequests:[],mobile:[]};
const cases=JSON.parse(fs.readFileSync('src/content/businessCases.json','utf8'));
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{
 for(const mode of ['desktop','mobile']){
  const context=await browser.newContext({viewport:mode==='mobile'?{width:390,height:844}:{width:1440,height:1000},isMobile:mode==='mobile',hasTouch:mode==='mobile',serviceWorkers:'block'});
  if(mode==='mobile')await context.addInitScript(()=>localStorage.setItem('bureauclair-theme','dark'));
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text())});page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)report.failedRequests.push({url:r.url(),status:r.status()})});
  for(const route of ['/videos','/guides/factures-formules','/guides/tcd-factures','/guides/rapport-word-complexe','/guides/bilan-powerpoint','/guides/outlook-tri-avance','/blog','/blog/compte-rendu-local-limites','/studio']){
   await page.goto(base+'#'+route);const response=await page.reload();await expect(page.locator('h1')).toBeVisible();
   await expect(page.locator('html')).toHaveAttribute('data-theme',mode==='mobile'?'dark':'light');
   if(route==='/videos'){await expect(page.locator('.video-card')).toHaveCount(5);await page.getByLabel('Durée des vidéos').selectOption('all');await page.getByLabel('Langue vidéo').selectOption('all');await expect(page.locator('.video-card')).toHaveCount(9);}
   if(route==='/blog')await expect(page.locator('.content-card')).toHaveCount(14);
   if(route.startsWith('/guides/')){
    await expect(page.locator('.business-lab')).toBeVisible();
    const lesson=cases.find(item=>route==='/guides/'+item.slug);
    for(const [file] of lesson.files)await expect(page.locator(`.resource-actions a[download][href$="/${file}"]`)).toHaveAttribute('href',new URL('assets/metier/'+file,base).pathname);
    if(lesson.capture)await expect(page.locator(`.resource-actions a[href$="/${lesson.capture}"]`)).toHaveAttribute('target','_blank');
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   report.routes.push({mode,route,status:response.status(),heading:await page.locator('h1').innerText()});
  }
  await page.goto(base+'#/guides/tcd-factures');await expect(page.locator('.business-lab')).toBeVisible();await page.locator('.business-lab').scrollIntoViewIfNeeded();
  await page.screenshot({path:`docs/evolution-2026-11-25/public-tcd-${mode}.png`});
  if(mode==='mobile'){await page.getByRole('button',{name:'Ouvrir le menu'}).click();await page.getByRole('navigation',{name:'Navigation principale'}).getByRole('link',{name:'Vidéos',exact:true}).click();await expect(page.locator('.video-card')).toHaveCount(5);report.mobile.push({menuToVideos:true,width:390});}
  for(const lesson of cases)for(const file of [...lesson.files.map(([file])=>file),...(lesson.capture?[lesson.capture]:[])]){
   const response=await context.request.get(base+'assets/metier/'+file);const buffer=await response.body();expect(response.ok()).toBe(true);expect(buffer.length).toBeGreaterThan(100);report.assets.push({mode,file,status:response.status(),bytes:buffer.length,header:buffer.subarray(0,4).toString('hex')});
  }
  await context.close();
 }
}catch(e){report.errors.push(e.message);process.exitCode=1}finally{await browser.close();fs.writeFileSync('docs/evolution-2026-11-25/public-smoke.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({routes:report.routes.length,assets:report.assets.length,errors:report.errors,failedRequests:report.failedRequests,mobile:report.mobile},null,2));
if(report.errors.length||report.consoleErrors.length||report.failedRequests.length)process.exitCode=1;
