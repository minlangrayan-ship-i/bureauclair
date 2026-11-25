export {};
declare global { interface Window { summaryBench?: {type:string;[key:string]:unknown} } }
let worker:Worker|undefined;
const output=document.querySelector<HTMLElement>('#result')!;
const load=document.querySelector<HTMLButtonElement>('#load')!;
const run=document.querySelector<HTMLButtonElement>('#run')!;
const receive=(message:{type:string;[key:string]:unknown})=>{window.summaryBench=message;output.textContent=JSON.stringify(message,null,2);if(message.type==='ready')run.disabled=false;};
load.onclick=()=>{worker?.terminate();worker=new Worker(new URL('./worker.ts',import.meta.url),{type:'module'});worker.onmessage=e=>receive(e.data);worker.onerror=()=>receive({type:'error',message:'Le worker ne peut pas démarrer.'});receive({type:'loading'});worker.postMessage({type:'load'});};
run.onclick=()=>{receive({type:'generating'});worker?.postMessage({type:'generate',source:document.querySelector<HTMLTextAreaElement>('#source')!.value});};
document.querySelector<HTMLButtonElement>('#cancel')!.onclick=()=>{worker?.terminate();worker=undefined;run.disabled=true;receive({type:'cancelled'});};
