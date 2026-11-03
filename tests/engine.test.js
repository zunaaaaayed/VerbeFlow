import test from 'node:test';
import assert from 'node:assert/strict';
import { conjugate, search, phrase, example } from '../src/engine.js';
import { VERBS } from '../src/data/verbs.js';
import { TENSES } from '../src/data/tenses.js';
import { sanitize } from '../src/storage.js';
const forms = (verb, tense) => conjugate(verb,tense).map(f => f.text);
test('regular families produce independent reference forms', () => {
  assert.deepEqual(forms('parler','present'), ['parle','parles','parle','parlons','parlez','parlent']);
  assert.deepEqual(forms('finir','present'), ['finis','finis','finit','finissons','finissez','finissent']);
  assert.deepEqual(forms('vendre','present'), ['vends','vends','vend','vendons','vendez','vendent']);
  assert.deepEqual(forms('choisir','subjunctive'), ['choisisse','choisisses','choisisse','choisissions','choisissiez','choisissent']);
  assert.deepEqual(forms('vendre','future'), ['vendrai','vendras','vendra','vendrons','vendrez','vendront']);
  assert.deepEqual(forms('travailler','imperfect'), ['travaillais','travaillais','travaillait','travaillions','travailliez','travaillaient']);
});
test('high-risk irregular stems, accents, and two-stem subjunctives', () => {
  assert.deepEqual(forms('être','imperfect'), ['étais','étais','était','étions','étiez','étaient']);
  assert.deepEqual(forms('avoir','subjunctive'), ['aie','aies','ait','ayons','ayez','aient']);
  assert.deepEqual(forms('aller','subjunctive'), ['aille','ailles','aille','allions','alliez','aillent']);
  assert.deepEqual(forms('prendre','subjunctive'), ['prenne','prennes','prenne','prenions','preniez','prennent']);
  assert.deepEqual(forms('venir','subjunctive'), ['vienne','viennes','vienne','venions','veniez','viennent']);
  assert.deepEqual(forms('savoir','subjunctive'), ['sache','saches','sache','sachions','sachiez','sachent']);
  assert.deepEqual(forms('dire','present'), ['dis','dis','dit','disons','dites','disent']);
  assert.equal(forms('voir','imperfect')[3], 'voyions');
  assert.equal(forms('faire','imperfect')[0], 'faisais');
  const expected = {être:'serai',avoir:'aurai',aller:'irai',faire:'ferai',prendre:'prendrai',venir:'viendrai',pouvoir:'pourrai',vouloir:'voudrai',devoir:'devrai',voir:'verrai',savoir:'saurai',dire:'dirai'};
  for (const [verb,form] of Object.entries(expected)) assert.equal(forms(verb,'future')[0],form);
  assert.equal(forms('pouvoir','conditional')[0],'pourrais');
});
test('compound tenses use the correct auxiliary and agreement', () => {
  assert.equal(forms('être','passe')[0],'ai été');
  assert.equal(forms('avoir','passe')[0],'ai eu');
  assert.equal(forms('devoir','passe')[0],'ai dû');
  assert.equal(forms('aller','passe')[3],'sommes allé(e)s');
  assert.equal(forms('venir','passe')[4],'êtes venu(e)(s)');
  assert.equal(forms('prendre','passe')[5],'ont pris');
  assert.equal(phrase(0,'ai parlé'),'j’ai parlé');
  assert.equal(phrase(0,'suis allé(e)'),'je suis allé(e)');
});
test('reverse lookup handles accents, apostrophes, agreement, and ambiguity', () => {
  assert.deepEqual(search(' AVONS '),['avoir']);
  assert.equal(search('etre')[0],'être'); // exact curated identity precedes broader prefixes
  assert.deepEqual(search("j'ai parlé"),['parler']);
  assert.deepEqual(search('j’ai parlé'),['parler']);
  assert.deepEqual(search('sommes venues'),['venir']);
  assert.deepEqual(search('suis'),['être','suivre']);
  assert.ok(search('parl').includes('parler'));
  assert.ok(search('aime').includes('aimer'));
  assert.deepEqual(search('unsupported'),[]);
  assert.deepEqual(search('<script>'),[]);
  assert.deepEqual(search(''),[]);
});
test('all curated entries yield complete forms and bilingual examples', () => {
  assert.equal(new Set(VERBS.map(v => v.infinitive)).size,VERBS.length);
  for (const v of VERBS) for (const tense of Object.keys(TENSES)) {
    const actual = conjugate(v.infinitive,tense);
    assert.equal(actual.length,6);
    actual.forEach(f => { assert.ok(f.text); assert.equal(f.text,f.stem+f.ending); assert.doesNotMatch(f.text,/undefined|null/); });
    const e = example(v.infinitive,tense);
    assert.ok(e.french.endsWith('.')); assert.ok(e.english.endsWith('.'));
    assert.doesNotMatch(e.french+e.english,/undefined|null/);
  }
  assert.equal(example('avoir','present').french,'En général, j’ai du temps.');
  assert.equal(example('savoir','passe').english,'Yesterday, I learned the answer.');
});
test('unsupported verbs and invalid saved data do not invent conjugations', () => {
  assert.throws(() => conjugate('unsupported','present'));
  assert.throws(() => conjugate('__proto__','present'));
  assert.throws(() => conjugate('parler','toString'));
  assert.deepEqual(sanitize({selected:'toString',tense:'__proto__',bookmarks:['être','être','unknown'],recent:'invalid'}),{theme:'auto',selected:'parler',tense:'present',bookmarks:['être'],recent:[]});
});
