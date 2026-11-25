import {defineConfig} from 'vite';
import path from 'node:path';
// Isolated static bench: no HMR, no production route, no automatic model load.
export default defineConfig({
 root:path.resolve('src/poc-summary'),
 publicDir:path.resolve('public'),
 build:{outDir:path.resolve('.runtime/summary-dist'),emptyOutDir:true},
 worker:{format:'es'},
});
