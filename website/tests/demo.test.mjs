import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
execFileSync(process.execPath,['build.mjs'],{cwd:new URL('../',import.meta.url)});
const {view,choices,selectionForMatch}=await import('../dist/VerbeFlow/site/demo.js');
test('shared demo preserves forms, ambiguity, accents and exact tense selection',()=>{assert.equal(view('être','imperfect').forms[0].text,'étais');const m=choices(' J ’ AVAIS ')[0];assert.deepEqual(selectionForMatch(m),{selected:'avoir',tense:'imperfect'});assert.ok(choices('parle').length>1);assert.throws(()=>view('__proto__','present'));assert.deepEqual(choices('<script>'),[]);assert.deepEqual(choices(''),[]);});
test('reference restrictions and learning examples stay truthful',()=>{assert.equal(view('abaisser','present').example,null);assert.ok(view('abaisser','passe').forms.every(f=>f.available===false));assert.ok(view('parler','present').example.french);});
test('production page has valid fragment links, local assets and honest interest state',async()=>{const html=await readFile(new URL('../dist/VerbeFlow/index.html',import.meta.url),'utf8');for(const [,id]of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`),id);for(const [,asset]of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) await readFile(new URL('../dist/VerbeFlow/'+asset,import.meta.url));assert.match(html,/No email address is collected/);const config=await readFile(new URL('../src/config.js',import.meta.url),'utf8');assert.match(config,/WAITLIST_URL = null/);});
