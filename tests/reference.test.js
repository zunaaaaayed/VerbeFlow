import test from 'node:test';
import assert from 'node:assert/strict';
import { REFERENCE_VERBS, referenceLookup } from '../src/reference.js';
import { CATALOG, CATALOG_BY_ID } from '../src/data/catalog.js';
import { VERBS } from '../src/data/verbs.js';
import { conjugate, lookup, selectionForMatch, example, formation } from '../src/engine.js';
import { sanitize, toggleBookmark } from '../src/storage.js';

test('reference admission requires complete simple paradigms and keeps curated entries authoritative', () => {
  assert.equal(REFERENCE_VERBS.length,7666);
  assert.equal(CATALOG.length,7776);
  assert.equal(new Set(CATALOG.map(v => v.infinitive)).size,CATALOG.length);
  for (const v of VERBS) assert.equal(CATALOG_BY_ID[v.infinitive],v);
  for (const v of REFERENCE_VERBS) {
    assert.equal(v.review.status,'source-imported-not-human-reviewed');
    assert.equal(v.review.license,'LGPLLR');
    assert.equal(v.auxiliary,undefined);
    for (const tense of ['present','imperfect','future','conditional','subjunctive']) {
      const forms = conjugate(v.infinitive,tense);
      assert.equal(forms.length,6);
      assert.ok(forms.every(f => f.text && f.available !== false && f.ending === ''));
    }
  }
  assert.equal(CATALOG_BY_ID.clore,undefined); // missing whole source tense
  assert.equal(CATALOG_BY_ID.neiger,undefined); // partial source paradigm
  assert.equal(CATALOG_BY_ID.uw,undefined);
});

test('reference irregular and spelling-sensitive fixtures keep their exact accents', () => {
  // Independent fixtures, consulted 2026-11-04 (not derived from Lefff):
  // https://www.larousse.fr/fr/conjugaison/francais/acquérir/135
  // https://www.larousse.fr/fr/conjugaison/francais/abattre/9
  // https://www.larousse.fr/fr/conjugaison/francais/protéger/7141
  // https://www.dictionnaire-academie.fr/conjuguer/A9B0193
  assert.deepEqual(conjugate('acquérir','present').map(f => f.text),['acquiers','acquiers','acquiert','acquérons','acquérez','acquièrent']);
  assert.equal(conjugate('acquérir','future')[0].text,'acquerrai');
  assert.equal(conjugate('abattre','present')[3].text,'abattons');
  assert.equal(conjugate('protéger','present')[0].text,'protège');
  assert.equal(conjugate('protéger','imperfect')[0].text,'protégeais');
  assert.equal(conjugate('balayer','present')[0].text,'balaye');
});

test('reference reverse lookup preserves ambiguity, pronouns, accents and exact tense selection', () => {
  const result = lookup('  J ’ ACQUIERS  ').find(m => m.infinitive === 'acquérir');
  assert.ok(result);
  assert.deepEqual([result.tense,result.personIndex,result.person,result.number,result.coverage],['present',0,1,'singular','reference']);
  assert.deepEqual(selectionForMatch(result),{selected:'acquérir',tense:'present'});
  assert.ok(lookup('acquerrai').some(m => m.infinitive === 'acquérir' && m.tense === 'future'));
  assert.equal(referenceLookup('abaisse').filter(m => m.infinitive === 'abaisser').length,4);
  assert.ok(lookup('ABAISS').some(m => m.infinitive === 'abaisser' && m.tense === null));
  assert.deepEqual(referenceLookup("j'parlemente"),[]);
  assert.deepEqual(referenceLookup('verbe-inventé'),[]);
  assert.deepEqual(referenceLookup('__proto__'),[]);
});

test('each admitted template reverses representative forms for all five tenses and six persons', () => {
  const representatives = new Map(REFERENCE_VERBS.map(v => [v.family,v]));
  for (const v of representatives.values()) for (const tense of ['present','imperfect','future','conditional','subjunctive']) {
    conjugate(v.infinitive,tense).forEach((form,personIndex) => {
      assert.ok(referenceLookup(form.text).some(m => m.infinitive === v.infinitive && m.tense === tense && m.personIndex === personIndex),`${v.infinitive}/${tense}/${personIndex}`);
    });
  }
});

test('reference coverage never invents compound auxiliaries, teaching examples or stem decompositions', () => {
  assert.ok(conjugate('abaisser','passe').every(f => f.available === false && f.text === '—'));
  assert.equal(example('abaisser','present'),null);
  assert.match(formation('abaisser','passe'),/will not guess avoir or être/);
  assert.match(formation('abaisser','present'),/whole forms/);
  assert.equal(conjugate('sortir','passe')[0].text,'suis sorti(e)');
  assert.ok(example('sortir','passe').french);
});

test('reference selections and bookmarks persist under existing limits and safely recover older state', () => {
  assert.equal(sanitize({selected:'abaisser',tense:'future'}).selected,'abaisser');
  assert.deepEqual(sanitize({bookmarks:['abaisser','abaisser','clore','être']}).bookmarks,['abaisser','être']);
  assert.deepEqual(toggleBookmark(['être'],'abaisser'),['être','abaisser']);
  const ten = REFERENCE_VERBS.slice(0,10).map(v => v.infinitive);
  assert.throws(() => toggleBookmark(ten,'être'),/10 verbs/);
  assert.equal(sanitize({selected:'neiger',tense:'future'}).selected,'parler');
});
