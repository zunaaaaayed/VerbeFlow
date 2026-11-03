import { VERBS } from './data/verbs.js';
import { TENSES } from './data/tenses.js';
import { EXAMPLES } from './data/examples.js';
import { conjugate, PERSONS } from './engine.js';
// Return every defect so editors can repair a dataset in one pass.
export function validateData(verbs = VERBS, examples = EXAMPLES, generate = conjugate) {
  const errors = [], ids = new Set();
  const fail = (id, message) => errors.push(`${id}: ${message}`);
  for (const [id,t] of Object.entries(TENSES)) if (!t.mood || !t.label || !t.formula || !t.explanation) fail(id,'incomplete tense metadata');
  for (const v of verbs) {
    const id = v.infinitive;
    if (ids.has(id)) fail(id,'duplicate verb'); ids.add(id);
    if (!id || !v.meaning || ![1,2,3].includes(v.group) || !['er','ir','re','irregular'].includes(v.pattern) || !['avoir','être'].includes(v.auxiliary)) fail(id,'invalid identity or pattern');
    if (JSON.stringify(v.personOrder) !== JSON.stringify(PERSONS.map(p => p.id))) fail(id,'invalid person ordering');
    if (!v.review?.sources?.length || !v.review.status) fail(id,'missing provenance');
    for (const [tense, forms] of Object.entries(v.overrides ?? {})) {
      if (!Object.hasOwn(TENSES,tense)) fail(id,`unknown tense ${tense}`);
      if (!Array.isArray(forms) || forms.length !== 6 || forms.some(f => typeof f !== 'string' || !f.trim())) fail(id,`incomplete override ${tense}`);
    }
    for (const field of ['present','subjunctive']) if (v[field] && (v[field].length !== 6 || v[field].some(f => typeof f !== 'string' || !f.trim()))) fail(id,`incomplete ${field}`);
    for (const tense of Object.keys(examples[id] ?? {})) if (!Object.hasOwn(TENSES,tense)) fail(id,`unknown example tense ${tense}`);
    for (const tense of Object.keys(TENSES)) {
      try {
        const forms = generate(id,tense);
        if (forms.length !== 6 || forms.some(f => !f.text || /undefined|null/.test(f.text))) fail(id,`missing forms ${tense}`);
      } catch { fail(id,`cannot generate ${tense}`); }
      const e = examples[id]?.[tense];
      if (!e || !['french','english'].every(k => typeof e[k] === 'string' && e[k].trim() && !/undefined|null/.test(e[k]))) fail(id,`incomplete example ${tense}`);
    }
  }
  return errors;
}
