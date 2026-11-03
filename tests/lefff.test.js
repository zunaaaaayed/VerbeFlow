import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readArchive } from '../scripts/lib/lefff-archive.mjs';
import { normalizeSource, packRecords, referenceForms, validatePacked, compareCurated, SOURCE_TENSES } from '../scripts/lib/lefff.mjs';
import { conjugate, lookup, formation, selectionForMatch } from '../src/engine.js';
import { VERBS } from '../src/data/verbs.js';
import { validateVariants } from '../src/validate.js';
import { sanitize } from '../src/storage.js';
const read = path => readFileSync(new URL('../'+path,import.meta.url));
const json = path => JSON.parse(read(path));
const source = json('vendor/lefff/source.json');
const archive = read('vendor/lefff/'+source.archive);
const raw = readArchive(archive,source.integrity);
const imported = normalizeSource(raw.data);
const packed = json('data/lefff/pilot.json');
const audit = json('data/lefff/audit.json');

test('pinned source integrity and original LGPLLR license are retained offline', () => {
  assert.equal(raw.license,read('vendor/lefff/LICENSE-LGPLLR.txt').toString());
  const damaged = Buffer.from(archive); damaged[100] ^= 1;
  assert.throws(() => readArchive(damaged,source.integrity),/integrity mismatch/);
  assert.throws(() => readArchive(archive,'sha512-invalid'),/integrity mismatch/);
  assert.equal(audit.resourceSha256,createHash('sha256').update(read('data/lefff/pilot.json')).digest('hex'));
});

test('every imported person/tense slot round-trips exactly through shared templates', () => {
  assert.deepEqual(validatePacked(packed),[]);
  assert.equal(Object.keys(raw.data).length,7826);
  assert.equal(imported.records.length,7790);
  assert.equal(packed.families.length,95);
  assert.deepEqual(packRecords(imported.records).entries,packed.entries);
  for (const record of imported.records) for (const tense of Object.keys(SOURCE_TENSES)) {
    assert.deepEqual(referenceForms(packed,record.infinitive,tense),record.forms[tense],record.infinitive+'/'+tense);
  }
  assert.ok(read('data/lefff/pilot.json').length < 400_000);
});

test('import rejects placeholders, missing arrays, new tense codes and malformed identities', () => {
  const sourceRecord = raw.data.parler;
  const sample = structuredClone({parler:sourceRecord,uw:raw.data.uw,manger:raw.data.manger,finir:raw.data.finir,vendre:raw.data.vendre});
  sample.manger.P = ['mange'];
  sample.finir.UNRECOGNIZED = ['finis'];
  sample.vendre.W = ['attendre'];
  const result = normalizeSource(sample);
  assert.deepEqual(result.records.map(v => v.infinitive),['parler']);
  assert.equal(result.rejected.length,4);
  assert.ok(audit.rejected.some(v => v.infinitive === 'uw'));
  assert.ok(audit.rejected.some(v => v.infinitive === 'clore'));
});

test('missing source slots stay unavailable; no guessed auxiliaries or unseen verbs', () => {
  assert.deepEqual(referenceForms(packed,'falloir','present'),[null,null,'faut',null,null,null]);
  assert.throws(() => referenceForms(packed,'invented-er','present'),/Unlisted verb/);
  assert.throws(() => referenceForms(packed,'parler','passe'),/Unsupported source tense/);
  assert.throws(() => referenceForms(packed,'parler','toString'),/Unsupported source tense/);
  assert.equal(audit.partial.length,24);
  assert.equal(audit.summary.completeSimpleParadigms,7766);
  assert.ok(audit.unavailableCapabilities.includes('sense-specific auxiliary choice'));
  assert.throws(() => conjugate('clore','present'),/Unsupported verb/);
  assert.deepEqual(lookup('clore'),[]);
  assert.equal(sanitize({selected:'clore',bookmarks:['clore','être']}).selected,'parler');
  assert.deepEqual(sanitize({bookmarks:['clore','être']}).bookmarks,['être']);
});

test('template validation catches duplicate identities, invalid persons and unknown tenses', () => {
  assert.deepEqual(validatePacked(null),['invalid resource structure']);
  const sample = packRecords(imported.records.slice(0,1));
  sample.entries.push(sample.entries[0]);
  sample.personOrder.reverse();
  sample.families[0].forms.wrong = ['wrong'];
  sample.families[0].forms.present = ['wrong'];
  const errors = validatePacked(sample);
  for (const pattern of [/duplicate/,/person ordering/,/unknown or missing family tense/,/person slots/]) assert.ok(errors.some(e => pattern.test(e)));
});

test('curated comparison preserves accents, tense/person alignment, and explicit review decisions', () => {
  assert.equal(audit.comparison.compared,3010);
  assert.equal(audit.comparison.equal,2989);
  assert.equal(audit.comparison.differences.length,21);
  assert.ok(audit.comparison.differences.every(d => d.resolution === 'accepted-variant' && d.sources.length));
  assert.deepEqual(audit.comparison.missing,[]);
  const changed = structuredClone(imported.records);
  changed.find(v => v.infinitive === 'être').forms.imperfect[0] = 'etais';
  const comparison = compareCurated(changed,VERBS,conjugate,json('data/lefff/review.json').decisions);
  assert.ok(comparison.differences.some(d => d.curated === 'étais' && d.source === 'etais' && d.resolution === 'unresolved'));
});

test('reviewed variants resolve to the correct person and tense without changing canonical tables', () => {
  for (const [query,id,tense,index] of [
    ['  JE   PAYE  ','payer','present',0],['quarantined','none','present',0],
    ['payerai','payer','future',0],['PAYAIENT','payer','imperfect',5],
    ['je puis','pouvoir','present',0],['paierais','payer','conditional',0],
  ]) {
    if (id === 'none') { assert.deepEqual(lookup(query),[]); continue; }
    const match = lookup(query).find(m => m.infinitive === id && m.tense === tense && m.personIndex === index);
    assert.ok(match,query);
    assert.deepEqual(selectionForMatch(match),{selected:id,tense});
  }
  const choices = lookup('paye').filter(m => m.infinitive === 'payer' && m.tense !== null);
  assert.equal(choices.length,4); // present/subjunctive, first/third singular
  assert.ok(choices.every(m => m.variant));
  assert.equal(conjugate('payer','present')[0].text,'paie');
  assert.equal(conjugate('pouvoir','present')[0].text,'peux');
  assert.match(formation('payer','future'),/Both paie\/paye/);
  assert.match(formation('pouvoir','present'),/puis-je/);
});

test('runtime variant validation rejects unreviewed identities and malformed source metadata', () => {
  assert.deepEqual(validateVariants(),[]);
  const bad = {infinitive:'abaisser',tense:'wrong',personIndex:6,form:'<script>',sources:[]};
  const errors = validateVariants([bad,bad]);
  for (const pattern of [/duplicate/,/unknown variant verb/,/unknown variant tense/,/invalid variant person/,/invalid variant form/,/missing variant provenance/]) assert.ok(errors.some(e => pattern.test(e)));
});
