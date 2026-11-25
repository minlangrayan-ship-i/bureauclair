import {chromium} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';import fs from 'node:fs';
const base=process.env.BUREAU_QA_URL||'http://127.0.0.1:4175';
const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});const report={checks:[],errors:[]};
try{
 for(const width of [1536,768,390,320]){
  const ctx=await b.newContext({viewport:{width,height:1024},reducedMotion:'reduce'});const p=await ctx.newPage();p.on('pageerror',e=>report.errors.push(e.message));
  for(const route of ['/','/atelier','/studio','/raccourcis','/guides/tableau-excel','/blog/ia-confidentialite','/parcours/publipostage']){
   await p.goto(base+route);await p.locator('h1').waitFor();const name=route.replaceAll('/','-')||'home';
   if(route==='/')await p.screenshot({path:`docs/v2/apres-${width}.png`});
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);report.checks.push({width,route,theme:'light',overflow});
   if(width===1536||width===390){const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();report.checks.at(-1).violations=a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));}
  }
  await p.getByRole('button',{name:'Activer le thème sombre'}).click();for(const route of ['/','/atelier','/studio','/guides','/prompts','/annuaire','/outils','/recherche?q=introuvablexyz','/confidentialite']){await p.goto(base+route);await p.locator('h1').waitFor();await p.screenshot({path:`docs/v2/sombre-${width}-${route.replace(/[^a-zA-Z0-9-]/g,'')||'accueil'}.png`});const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();report.checks.push({width,route,theme:'dark',overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),violations:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
  await ctx.close();
 }
}finally{fs.writeFileSync('docs/v2/qa-responsive.json',JSON.stringify(report,null,2));await b.close();}
console.log(JSON.stringify({checks:report.checks.length,errors:report.errors,issues:report.checks.filter(x=>x.overflow||x.violations?.length).map(x=>({width:x.width,route:x.route,theme:x.theme,overflow:x.overflow,violations:x.violations?.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))}))},null,2));

if(report.errors.length||report.checks.some(x=>x.overflow||x.violations?.length))process.exitCode=1;
