// Import tooling only. No Chrome APIs, network calls, prediction or suffix guessing.
export const PERSON_ORDER = ['1s','2s','3s','1p','2p','3p'];
export const SOURCE_TENSES = {present:'P', imperfect:'I', future:'F', conditional:'C', subjunctive:'S'};
const SOURCE_KEYS = new Set(['P','S','Y','I','G','K','J','T','F','C','W']);
const word = value => typeof value === 'string' && /^[\p{L}’-]+$/u.test(value) && value === value.normalize('NFC');
const ordered = entries => entries.sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0);

export function normalizeSource(source) {
  const records = [], rejected = [];
  for (const [infinitive, raw] of ordered(Object.entries(source))) {
    const reasons = [];
    // A lexical admission filter, NOT a rule assigning conjugation families.
    if (!word(infinitive) || !/(?:er|ir|ïr|re|oir)$/.test(infinitive)) reasons.push('not an admitted infinitive identity');
    if (!raw || !Array.isArray(raw.W) || raw.W.length !== 1 || raw.W[0] !== infinitive) reasons.push('infinitive identity mismatch');
    if (Object.keys(raw ?? {}).some(key => !SOURCE_KEYS.has(key))) reasons.push('unknown source tense code');
    const forms = {};
    for (const [tense, code] of Object.entries(SOURCE_TENSES)) {
      const values = raw?.[code];
      if (!Array.isArray(values) || values.length !== 6 || values.some(f => f !== null && f !== 'NA' && !word(f))) {
        reasons.push(`invalid six-person array: ${code}`);
      } else forms[tense] = values.map(f => f === 'NA' ? null : f);
    }
    if (reasons.length) { rejected.push({infinitive,reasons}); continue; }
    const unavailable = Object.entries(forms).flatMap(([tense, values]) => values.flatMap((form,i) => form === null ? [{tense,person:PERSON_ORDER[i]}] : []));
    records.push({infinitive,forms,unavailable});
  }
  return {records,rejected};
}

// Lossless shared paradigms. These are compression templates, not grammatical
// groups or pedagogical stem/ending analyses. Never apply one to an unlisted verb.
export function packRecords(records) {
  const families = [], familyIds = new Map(), entries = [];
  for (const record of records) {
    const {infinitive,forms} = record;
    const existing = Object.values(forms).flat().filter(f => f !== null);
    let length = infinitive.length;
    while (length && existing.some(form => !form.startsWith(infinitive.slice(0,length)))) length--;
    const stem = infinitive.slice(0,length);
    const family = {remove:infinitive.length-length, forms:Object.fromEntries(Object.entries(forms).map(([tense,values]) => [tense,values.map(form => form === null ? null : form.slice(stem.length))]))};
    const key = JSON.stringify(family);
    if (!familyIds.has(key)) { familyIds.set(key,families.length); families.push(family); }
    entries.push({infinitive,family:familyIds.get(key)});
  }
  return {schemaVersion:1,personOrder:[...PERSON_ORDER],tenseOrder:Object.keys(SOURCE_TENSES),reviewStatus:'source-imported-not-human-reviewed',families,entries};
}

export function referenceForms(packed, infinitive, tense) {
  if (!Object.hasOwn(SOURCE_TENSES,tense)) throw new Error('Unsupported source tense; compound auxiliaries are not supplied');
  const entry = packed.entries.find(entry => entry.infinitive === infinitive);
  if (!entry) throw new Error('Unlisted verb; prediction is disabled');
  const family = packed.families[entry.family];
  const stem = infinitive.slice(0,infinitive.length-family.remove);
  return family.forms[tense].map(suffix => suffix === null ? null : stem+suffix);
}

export function validatePacked(packed) {
  const errors = [], ids = new Set();
  if (!packed || !Array.isArray(packed.families) || !Array.isArray(packed.entries)) return ['invalid resource structure'];
  if (packed.schemaVersion !== 1) errors.push('unsupported schema version');
  if (packed.reviewStatus !== 'source-imported-not-human-reviewed') errors.push('missing source review status');
  if (JSON.stringify(packed.personOrder) !== JSON.stringify(PERSON_ORDER)) errors.push('invalid person ordering');
  if (JSON.stringify(packed.tenseOrder) !== JSON.stringify(Object.keys(SOURCE_TENSES))) errors.push('unknown or missing tense identifiers');
  for (const family of packed.families) {
    if (!family || !family.forms || typeof family.forms !== 'object') { errors.push('invalid family structure'); continue; }
    if (!Number.isInteger(family.remove) || family.remove < 0) errors.push('invalid template removal');
    if (Object.keys(family.forms).length !== 5 || Object.keys(family.forms).some(t => !Object.hasOwn(SOURCE_TENSES,t))) errors.push('unknown or missing family tense');
    for (const tense of Object.keys(SOURCE_TENSES)) if (!Array.isArray(family.forms[tense]) || family.forms[tense].length !== 6 || family.forms[tense].some(f => f !== null && typeof f !== 'string')) errors.push('invalid family person slots');
  }
  for (const entry of packed.entries) {
    if (!entry || typeof entry !== 'object') { errors.push('invalid verb entry'); continue; }
    if (ids.has(entry.infinitive)) errors.push('duplicate verb');
    ids.add(entry.infinitive);
    if (!word(entry.infinitive) || !Number.isInteger(entry.family) || !packed.families[entry.family] || packed.families[entry.family].remove > entry.infinitive.length) errors.push('invalid verb or family reference');
  }
  return errors;
}

export function compareCurated(records, verbs, generate, decisions) {
  const byId = new Map(records.map(record => [record.infinitive,record]));
  const differences = [], missing = [], excluded = [];
  let compared = 0, equal = 0;
  for (const verb of verbs) {
    if (verb.pattern === 'reflexive') { excluded.push({infinitive:verb.infinitive,reason:'source does not encode reflexive sense or agreement'}); continue; }
    const source = byId.get(verb.infinitive);
    if (!source) { missing.push(verb.infinitive); continue; }
    for (const tense of Object.keys(SOURCE_TENSES)) generate(verb.infinitive,tense).forEach((form,i) => {
      // Weather-only restrictions are deliberately narrower than the lexicon.
      if (form.available === false) return;
      compared++;
      const imported = source.forms[tense][i];
      if (form.text === imported) { equal++; return; }
      const decision = decisions.find(d => d.infinitive === verb.infinitive && d.tense === tense && d.personIndex === i && d.curated === form.text && d.source === imported);
      differences.push({infinitive:verb.infinitive,tense,person:PERSON_ORDER[i],personIndex:i,curated:form.text,source:imported,resolution:decision?.resolution ?? 'unresolved',sources:decision?.sources ?? []});
    });
  }
  return {compared,equal,differences,missing,excluded};
}
