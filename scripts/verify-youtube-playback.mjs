import { chromium, devices } from '@playwright/test';
import fs from 'node:fs';
const base=process.env.BUREAUCLAIR_TEST_URL||'http://127.0.0.1:4175/videos';
const cleanMessage=text=>text.replace(/https?:\/\/[^\s\"'<>]+/g,value=>{try{const u=new URL(value);return u.origin+u.pathname}catch{return '[adresse externe]'}});
const mode=process.env.BUREAUCLAIR_TEST_MOBILE==='true'?'mobile-emulation':'desktop';
const report={mode,date:new Date().toISOString(),url:base,videos:[],requests:[],errors:[],console:[]};
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try {
 const context=await browser.newContext({...(mode==='mobile-emulation'?devices['Pixel 7']:{viewport:{width:1440,height:1000}}),locale:'fr-FR',serviceWorkers:'block'});
 const page=await context.newPage();page.setDefaultTimeout(12000);page.setDefaultNavigationTimeout(30000);
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.console.push(cleanMessage(m.text()).slice(0,400))});
 page.on('request',r=>{if(r.url().includes('youtube-nocookie.com/embed/'))report.requests.push({url:r.url(),referer:r.headers()['referer']||null})});
 await page.goto(base,{waitUntil:'networkidle'});
 report.initialYoutubeRequests=report.requests.length;
 const count=Math.min(await page.locator('.video-card').count(),Number(process.env.BUREAUCLAIR_TEST_LIMIT||99));
 for(let i=0;i<count;i++){
  const card=page.locator('.video-card').nth(i);
  const entry={title:await card.locator('h2').innerText(),played:false};
  try{
   console.log('Checking video',i+1,entry.title);await card.getByRole('button',{name:'Autoriser l’aperçu YouTube'}).click();
   await card.getByRole('button',{name:'Lire ici · contenu à valider'}).click();
   await card.locator('iframe').waitFor({timeout:30000});
   const iframe=await card.locator('iframe').elementHandle();
   const frame=await iframe.contentFrame();
   await frame.locator('video').waitFor({state:'attached',timeout:20000});
   await frame.locator('.ytp-large-play-button, .ytmCuedOverlayPlayButton').first().click({timeout:8000});await frame.locator('video').evaluate(async v=>{v.muted=true;await Promise.race([v.play().catch(()=>{}),new Promise(r=>setTimeout(r,3000))]);});
   await page.waitForTimeout(5000);
   entry.playback=await frame.locator('video').evaluate(v=>({currentTime:v.currentTime,paused:v.paused,readyState:v.readyState}));
   entry.played=entry.playback.currentTime>1&&!entry.playback.paused&&entry.playback.readyState>=2;
   entry.playerError=await frame.locator('.ytp-error-content-wrap').allTextContents();
   await frame.locator('video').evaluate(v=>v.pause());
  }catch(error){entry.checkError=error.message.slice(0,450)}
  entry.notices=await card.locator('[role="status"],[role="alert"]').allTextContents();
  report.videos.push(entry);
  console.log(JSON.stringify(entry));
  fs.writeFileSync(process.env.BUREAUCLAIR_REPORT||'docs/v2/youtube-playback-local.json',JSON.stringify(report,null,2));
 }
 await context.close();
}finally{await browser.close();report.consoleMessageCount=report.console.length;report.console=[...new Set(report.console)];fs.writeFileSync(process.env.BUREAUCLAIR_REPORT||'docs/v2/youtube-playback-local.json',JSON.stringify(report,null,2))}
