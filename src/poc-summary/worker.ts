import { env, pipeline } from '@huggingface/transformers';
env.allowLocalModels = false;
env.backends.onnx.wasm!.numThreads = 1;
env.backends.onnx.wasm!.wasmPaths = import.meta.env.BASE_URL + 'runtime/';
type Generate = (messages: {role:string;content:string}[], options: Record<string,unknown>) => Promise<unknown>;
const createPipeline = pipeline as unknown as (task:string,model:string,options:Record<string,unknown>)=>Promise<Generate>;
let generator: Generate | undefined;
self.onmessage = async ({data}) => {
 const start=performance.now();
 try {
  if(data.type==='load') {
   generator=await createPipeline('text-generation','onnx-community/Qwen2.5-0.5B-Instruct',{
    revision:'22942cb7d7ba4cc81bb4673549ca4d4614469b5e',dtype:'q8',device:'wasm',
    progress_callback:(progress:unknown)=>self.postMessage({type:'progress',progress}),
   });
   self.postMessage({type:'ready',ms:performance.now()-start});
  } else if(data.type==='generate') {
   if(!generator)throw new Error('Modèle non chargé.');
   if(typeof data.source!=='string'||data.source.length>4000)throw new Error('Source absente ou supérieure à 4 000 caractères.');
   const result=await generator([
    {role:'system',content:'Rédige en français un brouillon de compte rendu fondé UNIQUEMENT sur la source. Quatre rubriques : Points abordés ; Décisions confirmées ; Actions avec responsable et échéance ; À confirmer. Cite les repères [P1], [P2] fournis. Une proposition n’est jamais une décision. N’invente aucun nom, montant, accord ou date. Si une échéance ou un responsable manque, écris À confirmer. Réponds directement, sans analyse cachée.'},
    {role:'user',content:'Source autorisée fictive :\n'+data.source},
   ],{max_new_tokens:220,do_sample:false,return_full_text:false});
   self.postMessage({type:'result',result,ms:performance.now()-start});
  }
 } catch(error) { self.postMessage({type:'error',message:error instanceof Error?error.message:String(error),ms:performance.now()-start}); }
};
