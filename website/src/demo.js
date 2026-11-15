import { conjugate, lookup, selectionForMatch, example, formation } from '../shared/engine.js';
import { CATALOG_BY_ID } from '../shared/data/catalog.js';
import { TENSES } from '../shared/data/tenses.js';
export { TENSES };
export function choices(query) { return query.trim() ? lookup(query).slice(0,30) : []; }
export function view(id,tense) {
  if(!Object.hasOwn(CATALOG_BY_ID,id)||!Object.hasOwn(TENSES,tense)) throw Error('Choose a supported verb and tense.');
  return {id,tense,reference:CATALOG_BY_ID[id].coverage==='reference',forms:conjugate(id,tense),example:example(id,tense),explanation:formation(id,tense)};
}
export { selectionForMatch };
