import test from 'node:test';
import assert from 'node:assert/strict';
import { conjugate, lookup, selectionForMatch, formation, example } from '../src/engine.js';
import { VERBS } from '../src/data/verbs.js';
import { EXAMPLES } from '../src/data/examples.js';
import { validateData } from '../src/validate.js';
import { sanitize } from '../src/storage.js';
const forms = (id,t) => conjugate(id,t).map(f=>f.text);
test('spelling-sensitive families keep the right sound and future stem', () => {
 assert.deepEqual(forms('manger','imperfect'),['mangeais','mangeais','mangeait','mangions','mangiez','mangeaient']);
 assert.deepEqual(forms('commencer','imperfect'),['commençais','commençais','commençait','commencions','commenciez','commençaient']);
 assert.equal(forms('commencer','present')[3],'commençons');
 for (const [id,p,f] of [['acheter','achète','achèterai'],['appeler','appelle','appellerai'],['jeter','jette','jetterai']]) {
  assert.equal(forms(id,'present')[0],p); assert.equal(forms(id,'future')[0],f);
 }
 assert.equal(forms('appeler','subjunctive')[3],'appelions');
 assert.equal(forms('oublier','imperfect')[3],'oubliions');
});
test('irregular families and sense-specific auxiliaries', () => {
 const cases={partir:'pars',dormir:'dors',sortir:'sors',lire:'lis',écrire:'écris',boire:'bois',mettre:'mets',recevoir:'reçois',tenir:'tiens',connaître:'connais'};
 for (const [id,f] of Object.entries(cases)) assert.equal(forms(id,'present')[0],f);
 assert.deepEqual(forms('boire','subjunctive'),['boive','boives','boive','buvions','buviez','boivent']);
 assert.equal(forms('recevoir','imperfect')[0],'recevais');
 assert.equal(forms('tenir','future')[0],'tiendrai');
 assert.equal(forms('connaître','present')[2],'connaît');
 assert.equal(forms('sortir','passe')[3],'sommes sorti(e)s');
 assert.match(formation('sortir','passe'),/Transitive.*avoir/);
 assert.equal(forms('entrer','passe')[0],'suis entré(e)');
 assert.equal(forms('écrire','passe')[0],'ai écrit');
 assert.ok(lookup('elles sont sorties').some(m=>m.infinitive==='sortir' && m.personIndex===5));
});
test('lookup preserves ambiguity and returns selectable tense/person metadata', () => {
 const m=lookup('  J ’ AVAIS  ');
 assert.equal(m.length,1);
 assert.deepEqual([m[0].infinitive,m[0].tense,m[0].mood,m[0].person,m[0].number,m[0].form],['avoir','imperfect','indicatif',1,'singular','avais']);
 const ambiguous=lookup('parle');
 assert.ok(ambiguous.some(m=>m.tense==='present' && m.personIndex===0));
 assert.ok(ambiguous.some(m=>m.tense==='subjunctive' && m.personIndex===2));
 assert.ok(lookup('ECRIS').some(m=>m.infinitive==='écrire'));
 assert.ok(lookup('j\'ecris').some(m=>m.personIndex===0));
 assert.ok(lookup('connaî').some(m=>m.tense===null));
});
test('dataset validation rejects editor mistakes', () => {
 assert.equal(VERBS.length,110); assert.deepEqual(validateData(),[]);
 const v=structuredClone(VERBS[0]);
 v.personOrder.reverse();v.overrides.wrong=[''];v.present=[''];
 const errors=validateData([v,v],{parler:{present:{french:'Bonjour.'}}});
 for (const pattern of [/duplicate/,/person ordering/,/unknown tense/,/incomplete override/,/incomplete present/,/incomplete example/]) assert.ok(errors.some(e=>pattern.test(e)));
 assert.ok(validateData([VERBS[0]],EXAMPLES,()=>[]).some(e=>/missing forms/.test(e)));
});
test('old and malformed state is safely migrated; examples contain no optional notation', () => {
 for (const state of [null,[],42,'old',{selected:'inconnu',tense:'old',recent:[null,{},'être','être'],bookmarks:false}]) {
  const clean=sanitize(state);assert.equal(clean.selected,'parler');assert.equal(clean.tense,'present');
 }
 for(const v of VERBS) for(const tense of ['present','passe','imperfect','future','conditional','subjunctive']) assert.doesNotMatch(example(v.infinitive,tense).french,/[()]/);
});

test('choosing a tense/person interpretation opens that precise tense', () => {
 const choices = lookup('parle');
 const selected = choices.find(m=>m.tense==='subjunctive' && m.personIndex===2);
 assert.deepEqual(selectionForMatch(selected,'future'),{selected:'parler',tense:'subjunctive'});
 assert.deepEqual(selectionForMatch(lookup('mang')[0],'imperfect'),{selected:'manger',tense:'imperfect'});
 assert.throws(()=>selectionForMatch({infinitive:'verbe-inventé',tense:'present'}));
});
