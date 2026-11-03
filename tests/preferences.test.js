import test from 'node:test';
import assert from 'node:assert/strict';
import { VERBS } from '../src/data/verbs.js';
import { conjugate, phrase, lookup, formation } from '../src/engine.js';
import { sanitize, toggleBookmark, MAX_BOOKMARKS } from '../src/storage.js';
import { validateData } from '../src/validate.js';
const forms=(id,t)=>conjugate(id,t).map(f=>f.text);
test('saved list keeps at most ten distinct supported verbs, including old state', () => {
 const ids=VERBS.slice(0,12).map(v=>v.infinitive);
 assert.equal(MAX_BOOKMARKS,10);
 assert.deepEqual(sanitize({bookmarks:['unknown',...ids,...ids]}).bookmarks,ids.slice(0,10));
 assert.throws(()=>toggleBookmark(ids.slice(0,10),ids[10]),/saved 10 verbs/);
 const reduced=toggleBookmark(ids.slice(0,10),ids[0]);
 assert.equal(reduced.length,9);
 assert.equal(toggleBookmark(reduced,ids[10]).length,10);
 assert.deepEqual(toggleBookmark([ids[0],ids[0]],ids[0]),[]);
});
test('reflexive forms have correct pronouns, elision, stems, and agreement', () => {
 assert.deepEqual(forms('se lever','present'),['me lève','te lèves','se lève','nous levons','vous levez','se lèvent']);
 assert.deepEqual(forms('s’habiller','present'),['m’habille','t’habilles','s’habille','nous habillons','vous habillez','s’habillent']);
 assert.equal(forms('se promener','future')[0],'me promènerai');
 assert.equal(forms('se laver','imperfect')[3],'nous lavions');
 assert.equal(forms('s’appeler','subjunctive')[3],'nous appelions');
 assert.equal(forms('se coucher','passe')[3],'nous sommes couché(e)s');
 assert.equal(phrase(0,forms('s’habiller','passe')[0]),'je me suis habillé(e)');
 assert.equal(phrase(0,forms('habiter','present')[0]),'j’habite');
 assert.ok(lookup("ELLES S'ETAIENT LAVEES").length===0); // plus-que-parfait stays unsupported
 const match=lookup('elles se sont lavées').find(m=>m.infinitive==='se laver');
 assert.equal(match.personIndex,5);assert.equal(match.tense,'passe');
 assert.ok(lookup("s'hab").some(m=>m.infinitive==='s’habiller'));
 assert.match(formation('se laver','passe'),/following direct object/);
});
test('impersonal verbs never invent personal or plural weather forms', () => {
 for (const t of ['present','passe','imperfect','future','conditional','subjunctive']) {
  const f=conjugate('falloir',t);assert.equal(f.filter(f=>f.available!==false).length,1);assert.notEqual(f[2].text,'—');
  for (const i of [0,1,3,4,5]) assert.deepEqual([f[i].text,f[i].available],['—',false]);
 }
 assert.equal(forms('falloir','subjunctive')[2],'faille');
 assert.equal(forms('pleuvoir','conditional')[2],'pleuvrait');
 assert.equal(lookup('je faut').length,0);assert.equal(lookup('elle pleut').length,0);assert.equal(lookup('—').length,0);
 assert.ok(lookup('il a plu').some(m=>m.infinitive==='pleuvoir' && m.personIndex===2));
 const broken=structuredClone(VERBS);broken.find(v=>v.infinitive==='falloir').impersonalForms.bogus='invented';
 assert.ok(validateData(broken).some(e=>/impersonal tense/.test(e)));
});
test('new everyday irregular families and spelling patterns match reference forms', () => {
 const expected={croire:['present',3,'croyons'],vivre:['passe',0,'ai vécu'],suivre:['present',0,'suis'],rire:['imperfect',3,'riions'],ouvrir:['present',0,'ouvre'],offrir:['passe',0,'ai offert'],apprendre:['subjunctive',5,'apprennent'],comprendre:['present',3,'comprenons'],conduire:['passe',0,'ai conduit'],envoyer:['future',0,'enverrai'],payer:['future',0,'paierai'],préférer:['future',0,'préférerai'],espérer:['present',0,'espère'],mourir:['passe',2,'est mort(e)'],naître:['present',2,'naît'],devenir:['future',0,'deviendrai'],revenir:['passe',0,'suis revenu(e)'],obtenir:['present',0,'obtiens'],sentir:['present',0,'sens'],servir:['present',0,'sers'],courir:['future',0,'courrai'],valoir:['subjunctive',0,'vaille'],permettre:['passe',0,'ai permis'],battre:['present',2,'bat']};
 for(const [id,[t,i,f]] of Object.entries(expected)) assert.equal(forms(id,t)[i],f,`${id} ${t}`);
 assert.deepEqual(forms('voyager','imperfect'),['voyageais','voyageais','voyageait','voyagions','voyagiez','voyageaient']);
 assert.deepEqual(forms('voyager','subjunctive'),['voyage','voyages','voyage','voyagions','voyagiez','voyagent']);
});
