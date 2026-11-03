import { VERBS, BY_ID } from './data/verbs.js';
import { TENSES } from './data/tenses.js';
import { EXAMPLES } from './data/examples.js';
export const PRONOUNS = ['je', 'tu', 'il / elle / on', 'nous', 'vous', 'ils / elles'];
const endings = {
  er: ['e','es','e','ons','ez','ent'], ir: ['is','is','it','issons','issez','issent'], re: ['s','s','','ons','ez','ent'],
  imperfect: ['ais','ais','ait','ions','iez','aient'], future: ['ai','as','a','ons','ez','ont'], subjunctive: ['e','es','e','ions','iez','ent'],
};
const part = (stem, ending = '') => ({stem, ending, text: stem + ending});
export function conjugate(id, tense) {
  const v = BY_ID[id];
  if (!Object.hasOwn(BY_ID,id) || !Object.hasOwn(TENSES,tense)) throw new Error('Unsupported verb or tense');
  if (v.overrides?.[tense]) return v.overrides[tense].map(s => part(s));
  const root = id.slice(0,-2);
  if (tense === 'present') return v.present ? v.present.map(s => part(s)) : endings[v.pattern].map(e => part(root,e));
  if (tense === 'passe') {
    const auxiliary = conjugate(v.auxiliary,'present');
    const pp = v.participle ?? root + ({er:'é',ir:'i',re:'u'}[v.pattern]);
    return auxiliary.map((a,i) => {
      const agreement = v.auxiliary === 'être' ? ['(e)','(e)','(e)','(e)s','(e)(s)','(e)s'][i] : '';
      return part(a.text + ' ', pp + agreement);
    });
  }
  if (tense === 'imperfect') {
    const stem = v.imperfectStem ?? conjugate(id,'present')[3].text.slice(0,-3);
    return endings.imperfect.map(e => part(stem,e));
  }
  if (tense === 'future' || tense === 'conditional') {
    const stem = v.futureStem ?? (v.pattern === 're' ? id.slice(0,-1) : id);
    return endings[tense === 'future' ? 'future' : 'imperfect'].map(e => part(stem,e));
  }
  if (v.subjunctive) return v.subjunctive.map(s => part(s));
  const present = conjugate(id,'present');
  return endings.subjunctive.map((e,i) => part(present[i === 3 || i === 4 ? 3 : 5].text.slice(0,-3),e));
}
export function subject(index, form) {
  return index === 0 && /^[aeiouyàâéèêëîïôùûüœ]/i.test(form) ? 'j’' : PRONOUNS[index];
}
export function phrase(index, form) { const p = subject(index, form); return p + (p === 'j’' ? '' : ' ') + form; }
export const normalize = s => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,"'").replace(/\s+/g,' ').replace(/\s*'\s*/g,"'");
export const PERSONS = [
  {id:'1s', label:'first-person singular', person:1, number:'singular'},
  {id:'2s', label:'second-person singular', person:2, number:'singular'},
  {id:'3s', label:'third-person singular', person:3, number:'singular'},
  {id:'1p', label:'first-person plural', person:1, number:'plural'},
  {id:'2p', label:'second-person plural', person:2, number:'plural'},
  {id:'3p', label:'third-person plural', person:3, number:'plural'},
];
const index = new Map();
const add = (key, match) => {
  const n = normalize(key); if (!index.has(n)) index.set(n, new Map());
  index.get(n).set([match.infinitive,match.tense,match.personIndex,match.form].join('|'),match);
};
for (const v of VERBS) for (const tense of Object.keys(TENSES)) {
  conjugate(v.infinitive,tense).forEach((f,i) => {
    for (const e of ['', 'e']) for (const s of ['', 's']) {
      const form = f.text.replace(/\(e\)/g,e).replace(/\(s\)/g,s);
      const match = {infinitive:v.infinitive,tense,mood:TENSES[tense].mood,personIndex:i,...PERSONS[i],form};
      add(form,match); add(phrase(i,form),match);
      // Natural individual pronouns as well as the compact table labels.
      for (const pronoun of i === 2 ? ['il','elle','on'] : i === 5 ? ['ils','elles'] : []) add(pronoun+' '+form,match);
    }
  });
}
export function lookup(query) {
  const n = normalize(query); if (!n) return [];
  const matches = [...(index.get(n)?.values() ?? [])];
  const prefixes = VERBS.filter(v => normalize(v.infinitive).startsWith(n)).map(v => ({infinitive:v.infinitive,tense:null}));
  return [...prefixes,...matches];
}
// Compatibility helper for callers that only need verb identities.
export function search(query) { return [...new Set(lookup(query).map(m => m.infinitive))]; }
export function example(id, tense) {
  if (!Object.hasOwn(EXAMPLES,id) || !Object.hasOwn(TENSES,tense)) throw new Error('Unsupported example');
  return EXAMPLES[id][tense];
}
export function formation(id, tense) {
  const v = BY_ID[id], f = conjugate(id,tense)[0];
  let rule;
  if (tense === 'passe') rule = `Present of ${v.auxiliary} + past participle ${v.participle ?? f.ending}. With être, agree with the subject. With avoir, agreement requires a preceding direct object; these tables have none.`;
  else if (v.overrides?.[tense]) rule = 'Explicit spelling-sensitive forms: compare all six persons rather than using one unchanging stem.';
  else if (tense === 'imperfect') rule = v.imperfectStem ? `Exceptional stem ${v.imperfectStem}- + imparfait endings.` : `Remove -ons from ${conjugate(id,'present')[3].text}; add the imparfait endings.`;
  else if (tense === 'future' || tense === 'conditional') rule = `Use ${f.stem}- (${v.futureStem ? 'stored future stem' : v.pattern === 're' ? 'infinitive minus final e' : 'infinitive'}) + ${tense === 'future' ? 'future' : 'imparfait'} endings.`;
  else if (tense === 'subjunctive' && f.ending) rule = `Remove -ent from ${conjugate(id,'present')[5].text}; add -e, -es, -e, -ions, -iez, -ent. For nous and vous, remove -ons from ${conjugate(id,'present')[3].text} instead.`;
  else if (f.ending) rule = `Remove -${id.slice(-2)} from the infinitive; add the ${v.pattern} pattern endings: ${f.stem}- + -${f.ending}.`;
  else rule = 'These forms are explicitly stored. Compare the six persons; a single regular stem does not explain this whole paradigm.';
  return rule + (v.notes ? ' '+v.notes : '');
}

// Preserve the chosen interpretation across the UI/storage boundary.
export function selectionForMatch(match, currentTense = 'present') {
  const tense = match?.tense ?? currentTense;
  if (!Object.hasOwn(BY_ID,match?.infinitive) || !Object.hasOwn(TENSES,tense)) throw new Error('Unsupported selection');
  return {selected:match.infinitive,tense};
}
