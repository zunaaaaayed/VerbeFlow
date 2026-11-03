import { VERBS, BY_ID } from './verbs.js';
import { REFERENCE_VERBS } from '../reference.js';
// Curated entries always take priority over imported reference coverage.
export const CATALOG = [...VERBS,...REFERENCE_VERBS];
export const CATALOG_BY_ID = {...Object.fromEntries(REFERENCE_VERBS.map(v => [v.infinitive,v])),...BY_ID};
