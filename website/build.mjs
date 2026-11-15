import {mkdir,cp,readFile,writeFile,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url), out=new URL('./dist/VerbeFlow/',import.meta.url);
await rm(new URL('./dist/',import.meta.url),{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const name of ['index.html','privacy.html']) await cp(new URL(name,import.meta.url),new URL(name,out));
await cp(new URL('src/',import.meta.url),new URL('site/',out),{recursive:true});
await cp(new URL('public/',import.meta.url),out,{recursive:true});
// Reuse the pure engine and its data; never copy Chrome UI/background modules.
await mkdir(new URL('shared/data/',out),{recursive:true});
for(const name of ['engine.js','reference.js','normalize.js']) await cp(new URL('src/'+name,root),new URL('shared/'+name,out));
await cp(new URL('src/data/',root),new URL('shared/data/',out),{recursive:true});
await mkdir(new URL('assets/',out),{recursive:true});
for(const dir of ['fonts','brand']) await cp(new URL('assets/'+dir+'/',root),new URL('assets/'+dir+'/',out),{recursive:true,filter:p=>!p.endsWith('verbeflow-master.png')});
await mkdir(new URL('legal/',out),{recursive:true});
for(const [from,to] of [['LICENSE','LICENSE.txt'],['NOTICE','NOTICE.txt'],['vendor/lefff/LICENSE-LGPLLR.txt','LGPLLR.txt']]) await cp(new URL(from,root),new URL('legal/'+to,out));
console.log('Built website/dist/VerbeFlow (serve website/dist to test the production base path).');
