import {chromium} from '@playwright/test';import fs from 'node:fs';
const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});const r={date:'2026-11-25',checks:[]};
try{
const ctx=await b.newContext();const p=await ctx.newPage();await p.goto('http://127.0.0.1:4175/');await p.evaluate(()=>navigator.serviceWorker.ready);await p.reload();await p.waitForFunction(()=>navigator.serviceWorker?.controller,{},{timeout:30000});await p.waitForTimeout(1000);await ctx.setOffline(true);
for(const [route,selector] of [['/guides','.content-card'],['/prompts','.prompt-card'],['/atelier','textarea'],['/videos','.video-card']]){await p.goto('http://127.0.0.1:4175'+route);await p.locator('h1').waitFor();r.checks.push({route,count:await p.locator(selector).count(),offline:await p.evaluate(()=>!navigator.onLine)});}
await p.screenshot({path:'docs/v2/videos-hors-ligne.png'});r.documentStatus=await p.evaluate(async()=>{try{return(await fetch('/assets/exercices/courrier-fictif.docx')).status}catch{return 'unavailable'}});await ctx.setOffline(false);await ctx.close();
const cold=await b.newContext({serviceWorkers:'block'});const cp=await cold.newPage();await cp.goto('http://127.0.0.1:4175/studio');await cp.locator('#audio-file').waitFor();await cold.setOffline(true);await cp.getByRole('checkbox').check();await cp.getByRole('button',{name:'Charger le moteur local',exact:true}).click();await cp.getByRole('alert').last().waitFor({timeout:45000});r.coldModel={error:await cp.getByRole('alert').last().innerText(),transcriptionCount:await cp.getByLabel('Transcription à relire et corriger').count()};await cold.setOffline(false);await cold.close();
}catch(e){r.failure=e.message}finally{await b.close();fs.writeFileSync('docs/v2/offline-tests.json',JSON.stringify(r,null,2))}
console.log(JSON.stringify(r,null,2));

if(r.failure||r.coldModel?.transcriptionCount!==0)process.exitCode=1;
