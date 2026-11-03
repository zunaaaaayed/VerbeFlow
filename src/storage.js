import { BY_ID } from './data/verbs.js';
import { sanitizeTheme } from './colors.js';
import { TENSES } from './data/tenses.js';
export const MAX_BOOKMARKS = 10;
const defaults = {selected:'parler', tense:'present', bookmarks:[], recent:[], theme:'auto'};
export const sanitize = value => ({
  theme: sanitizeTheme(value?.theme),
  selected: Object.hasOwn(BY_ID,value?.selected) ? value.selected : defaults.selected,
  tense: Object.hasOwn(TENSES,value?.tense) ? value.tense : defaults.tense,
  bookmarks: [...new Set(Array.isArray(value?.bookmarks) ? value.bookmarks.filter(v => Object.hasOwn(BY_ID,v)) : [])].slice(0,MAX_BOOKMARKS),
  recent: [...new Set(Array.isArray(value?.recent) ? value.recent.filter(v => Object.hasOwn(BY_ID,v)) : [])].slice(0,6),
});
const extension = !!globalThis.chrome?.storage?.local;
export async function readState() {
  if (extension) return sanitize(await chrome.storage.local.get(Object.keys(defaults)));
  try { return sanitize(JSON.parse(localStorage.getItem('verbeflow') ?? '{}')); } catch { return sanitize({}); }
}
// Patch individual keys so open panel sessions do not overwrite unrelated changes.
export async function saveState(patch) {
  if (Object.hasOwn(patch,'theme')) patch = {...patch,theme:sanitizeTheme(patch.theme)};
  if (Object.hasOwn(patch,'bookmarks')) patch = {...patch,bookmarks:sanitize({bookmarks:patch.bookmarks}).bookmarks};
  if (extension) return chrome.storage.local.set(patch);
  const next = {...await readState(),...patch};
  localStorage.setItem('verbeflow',JSON.stringify(next));
}
export function subscribe(callback) {
  if (extension) chrome.storage.onChanged.addListener((changes,area) => { if (area === 'local') callback(); });
  else window.addEventListener('storage',e => { if (e.key === 'verbeflow') callback(); });
}

export function toggleBookmark(bookmarks, id) {
  if (!Object.hasOwn(BY_ID,id)) throw new Error('This verb is not in the offline library.');
  const current = sanitize({bookmarks}).bookmarks;
  if (current.includes(id)) return current.filter(v => v !== id);
  if (current.length >= MAX_BOOKMARKS) throw new Error('You have saved 10 verbs. Remove a saved verb to make room for another.');
  return [...current,id];
}
