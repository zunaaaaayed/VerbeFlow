import { LEFFF_REFERENCE as data } from './data/lefff-reference.js';
import { BY_ID as curated } from './data/verbs.js';
import { normalize } from './normalize.js';

// Explicit lexical assignments only. Compression suffixes never imply that an
// unlisted infinitive is regular, or that the split is a grammatical ending.
export const REFERENCE_VERBS = data.entries.filter(entry =>
  !Object.hasOwn(curated,entry.infinitive) && Object.values(data.families[entry.family].forms).every(forms => forms.every(form => form !== null))
).map(entry => ({...entry,coverage:'reference',review:{status:data.reviewStatus,sources:['https://github.com/RosaeNLG/rosaenlg/tree/745dc50c54690936fba332ca465308c607053e46/packages/french-verbs-lefff'],license:'LGPLLR'}}));
const byId = new Map(REFERENCE_VERBS.map(v => [v.infinitive,v]));
export function referenceForms(id, tense) {
  const entry = byId.get(id);
  if (!entry) throw new Error('Unsupported reference verb');
  if (tense === 'passe') return Array.from({length:6},() => ({stem:'—',ending:'',text:'—',available:false}));
  const family = data.families[entry.family];
  if (!Object.hasOwn(family.forms,tense)) throw new Error('Unsupported reference tense');
  const stem = id.slice(0,id.length-family.remove);
  return family.forms[tense].map(suffix => ({stem:stem+suffix,ending:'',text:stem+suffix}));
}

// Invert 95 explicit templates rather than allocating a large per-form index.
// A candidate must resolve to an admitted lexical entry in that exact family.
const families = new Map();
for (const v of REFERENCE_VERBS) {
  if (!families.has(v.family)) families.set(v.family,{stems:new Map(),slots:[]});
  const index = families.get(v.family), family = data.families[v.family];
  const stem = normalize(v.infinitive.slice(0,v.infinitive.length-family.remove));
  if (!index.stems.has(stem)) index.stems.set(stem,[]);
  index.stems.get(stem).push(v.infinitive);
}
for (const [id,index] of families) for (const [tense,forms] of Object.entries(data.families[id].forms)) forms.forEach((suffix,personIndex) => {
  if (suffix !== null) index.slots.push({suffix:normalize(suffix),tense,personIndex});
});
const pronouns = {je:0,tu:1,il:2,elle:2,on:2,nous:3,vous:4,ils:5,elles:5};
export function referenceLookup(query) {
  let form = normalize(query), person = null;
  const elided = /^j'(.+)$/.exec(form);
  const spaced = /^(je|tu|il|elle|on|nous|vous|ils|elles) (.+)$/.exec(form);
  if (elided) {
    form = elided[1]; person = 0;
    if (!/^[aeiouyhœ]/.test(form)) return [];
  } else if (spaced) { person = pronouns[spaced[1]]; form = spaced[2]; }
  if (!form) return [];
  const results = [];
  for (const index of families.values()) for (const slot of index.slots) {
    if (person !== null && person !== slot.personIndex || !form.endsWith(slot.suffix)) continue;
    const stem = slot.suffix ? form.slice(0,-slot.suffix.length) : form;
    for (const infinitive of index.stems.get(stem) ?? []) {
      const actual = referenceForms(infinitive,slot.tense)[slot.personIndex].text;
      if (normalize(actual) === form) results.push({infinitive,tense:slot.tense,personIndex:slot.personIndex,form:actual,coverage:'reference'});
    }
  }
  return results;
}
