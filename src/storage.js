import { BY_ID } from './data/verbs.js';
import { TENSES } from './data/tenses.js';
const defaults = {selected:'parler', tense:'present', bookmarks:[], recent:[]};
export const sanitize = value => ({
  selected: Object.hasOwn(BY_ID,value?.selected) ? value.selected : defaults.selected,
  tense: Object.hasOwn(TENSES,value?.tense) ? value.tense : defaults.tense,
  bookmarks: [...new Set(Array.isArray(value?.bookmarks) ? value.bookmarks.filter(v => Object.hasOwn(BY_ID,v)) : [])],
  recent: [...new Set(Array.isArray(value?.recent) ? value.recent.filter(v => Object.hasOwn(BY_ID,v)) : [])].slice(0,6),
});
const extension = !!globalThis.chrome?.storage?.local;
export async function readState() {
  if (extension) return sanitize(await chrome.storage.local.get(Object.keys(defaults)));
  try { return sanitize(JSON.parse(localStorage.getItem('verbeflow') ?? '{}')); } catch { return sanitize({}); }
}
// Patch individual keys so popup and panel do not overwrite unrelated changes.
export async function saveState(patch) {
  if (extension) return chrome.storage.local.set(patch);
  const next = {...await readState(),...patch};
  localStorage.setItem('verbeflow',JSON.stringify(next));
}
export function subscribe(callback) {
  if (extension) chrome.storage.onChanged.addListener((changes,area) => { if (area === 'local') callback(); });
  else window.addEventListener('storage',e => { if (e.key === 'verbeflow') callback(); });
}
