import { VERBS, BY_ID } from './data/verbs.js';
import { TENSES } from './data/tenses.js';
import { conjugate, subject, lookup, selectionForMatch, formation, example } from './engine.js';
import { readState, saveState, subscribe } from './storage.js';

// All HTML fragments below contain only packaged, trusted data. Search text is
// inserted through textContent, never interpolated into HTML.
const app = document.querySelector('#app');
app.innerHTML = `
  <header><div class="brand"><span class="logo" aria-hidden="true">vf<span>·</span></span><div>VerbeFlow<small>A little French, every day.</small></div></div><span class="offline"><i></i> Offline</span></header>
  <section class="search-section"><label for="verb-search">Find your next word.</label><form id="search-form"><div class="search-box"><span aria-hidden="true">⌕</span><input id="verb-search" autocomplete="off" spellcheck="false" placeholder="Try parler, être, or avons…"><button type="submit" aria-label="Search verbs">→</button></div></form><p class="hint">Infinitives or conjugated forms · ${VERBS.length} curated verbs</p><div id="results" role="region" aria-live="polite" aria-label="Search results"></div></section>
  <div class="collection"><div class="collection-tabs"><button id="recent-tab" type="button" aria-pressed="true">Recent</button><button id="saved-tab" type="button" aria-pressed="false">Saved <span id="saved-count">0</span></button><button id="all-tab" type="button" aria-pressed="false">All verbs</button></div><div id="collection-list" class="chips"></div></div>
  <article><div class="verb-heading"><div><p class="eyebrow">YOUR VERB, UNPACKED</p><h1 id="verb-title" lang="fr" tabindex="-1"></h1><p id="meaning"></p></div><button id="bookmark" class="icon-button" aria-label="Save verb" aria-pressed="false">☆</button></div><div id="metadata" class="metadata"></div>
  <label class="select-label" for="tense">Explore a tense</label><div class="tense-select"><select id="tense"></select><span id="tense-subtitle"></span></div>
  <section class="conjugation"><div class="section-title"><h2>Conjugation</h2><span id="ending-key">Endings in purple</span></div><div id="forms"></div></section>
  <section class="formation"><div class="section-title"><h2><span aria-hidden="true">✧</span> How it’s formed</h2></div><p id="formula" class="formula"></p><p id="specific-rule"></p><details><summary>Usage & grammar notes</summary><p id="explanation"></p></details></section>
  <section class="example"><div class="section-title"><h2>In a sentence</h2><button id="speak" class="text-button" type="button">Listen ♫</button></div><p id="example-fr" lang="fr"></p><p id="example-en"></p></section>
  <p id="agreement" class="hint"></p></article>
  <footer><button id="open-panel" type="button">Keep learning in the side panel <span aria-hidden="true">↗</span></button><p>Small steps. More fluent French.</p></footer><p id="status" role="status" aria-live="polite"></p>`;
const $ = id => document.getElementById(id);
let state;
try { state = await readState(); } catch { state = (await import('./storage.js')).sanitize({}); status('Saved data could not be read. Using defaults; try reopening the extension.'); }
let collection = 'recent';
let windowId;
let shownExample;
let speechReady = false;
if (globalThis.chrome?.windows) chrome.windows.getCurrent().then(w => { windowId = w.id; }).catch(() => status('Could not identify the browser window. Reopen the popup to retry.'));
for (const [id,t] of Object.entries(TENSES)) { const option = new Option(t.label,id); option.lang = 'fr'; $('tense').add(option); }
function status(message) { $('status').textContent = message; }
async function persist(patch) {
  state = {...state,...patch}; render();
  try { await saveState(patch); } catch { status('Your change is visible, but could not be saved. Please try again.'); }
}
async function selectMatch(match) {
  const {selected,tense} = selectionForMatch(match,state.tense);
  await selectVerb(selected,tense);
}
async function selectVerb(id, tense = state.tense) {
  $('results').replaceChildren(); $('verb-search').value = ''; status('');
  await persist({selected:id, tense, recent:[id,...state.recent.filter(v => v !== id)].slice(0,6)});
}
function chip(id, parent) {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = id; b.lang = 'fr';
  b.className = 'chip'; b.setAttribute('aria-pressed',String(state.selected === id));
  b.addEventListener('click',() => selectVerb(id)); parent.append(b);
}
function renderCollection() {
  for (const tab of ['recent','saved','all']) $(tab+'-tab').setAttribute('aria-pressed',String(tab === collection));
  const ids = collection === 'all' ? VERBS.map(v => v.infinitive) : collection === 'saved' ? state.bookmarks : state.recent.length ? state.recent : ['parler','être','avoir','aller'];
  $('collection-list').replaceChildren();
  ids.forEach(id => chip(id,$('collection-list')));
  if (!ids.length) $('collection-list').textContent = 'Save a verb with the star to find it here.';
  $('saved-count').textContent = state.bookmarks.length;
}
function render() {
  const v = BY_ID[state.selected], tense = TENSES[state.tense];
  $('verb-title').textContent = v.infinitive;
  $('meaning').textContent = v.meaning;
  $('metadata').textContent = `Group ${v.group} · Pattern: ${v.pattern} / Auxiliary: ${v.auxiliary}`;
  const saved = state.bookmarks.includes(v.infinitive);
  $('bookmark').textContent = saved ? '★' : '☆'; $('bookmark').setAttribute('aria-pressed',String(saved)); $('bookmark').setAttribute('aria-label',saved ? 'Unsave verb' : 'Save verb');
  $('tense').value = state.tense; $('tense-subtitle').textContent = tense.english;
  const forms = conjugate(v.infinitive,state.tense);
  $('forms').replaceChildren();
  forms.forEach((f,i) => {
    const row = document.createElement('div'); row.className = 'form-row'; row.lang = 'fr';
    const pronoun = document.createElement('span'); pronoun.textContent = subject(i,f.text);
    const word = document.createElement('strong'); word.append(document.createTextNode(f.stem));
    const ending = document.createElement('span'); ending.className = 'ending'; ending.textContent = f.ending; word.append(ending);
    row.append(pronoun,word); $('forms').append(row);
  });
  $('ending-key').textContent = state.tense === 'passe' ? 'Participle in purple' : forms.some(f => f.ending) ? 'Endings in purple' : 'Irregular forms';
  $('formula').textContent = tense.formula;
  $('specific-rule').textContent = formation(v.infinitive,state.tense);
  $('explanation').textContent = tense.explanation;
  shownExample = example(v.infinitive,state.tense);
  $('example-fr').textContent = shownExample.french; $('example-en').textContent = shownExample.english;
  $('agreement').textContent = state.tense === 'passe' && v.auxiliary === 'être' ? '(e) adds feminine agreement; s adds plural agreement. Vous can be singular or plural. Examples use a masculine singular speaker. (s) marks optional plural vous; on may refer to several people and can take plural agreement in context.' : '';
  renderCollection();
}
function showResults() {
  const query = $('verb-search').value; const matches = lookup(query);
  $('results').replaceChildren();
  if (!query.trim()) return;
  if (!matches.length) { const p = document.createElement('p'); p.className = 'no-results'; p.textContent = 'Not in this collection yet. Browse All verbs for supported infinitives. Reflexive verbs are not included yet.'; $('results').append(p); return; }
  matches.forEach(match => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip result';
    b.textContent = match.tense ? `${match.infinitive} → ${TENSES[match.tense].label} (${match.mood}) · ${match.label} · ${match.form}` : `${match.infinitive} · infinitive`;
    b.addEventListener('click', async () => { await selectMatch(match); $('verb-title').focus(); });
    $('results').append(b);
  });
}
$('verb-search').addEventListener('input',showResults);
$('verb-search').addEventListener('keydown',e => { if (e.key === 'Escape') { $('verb-search').value = ''; showResults(); } });
$('search-form').addEventListener('submit',e => {
  e.preventDefault(); const matches = lookup($('verb-search').value);
  if (matches.length === 1) selectMatch(matches[0]);
  else { showResults(); if (matches.length > 1) status('Several interpretations match. Choose a result below the search box.'); }
});
for (const tab of ['recent','saved','all']) $(tab+'-tab').addEventListener('click',() => { collection = tab; renderCollection(); });
$('tense').addEventListener('change',() => persist({tense:$('tense').value}));
$('bookmark').addEventListener('click',() => persist({bookmarks: state.bookmarks.includes(state.selected) ? state.bookmarks.filter(v => v !== state.selected) : [...state.bookmarks,state.selected]}));
$('open-panel').addEventListener('click',() => {
  if (!globalThis.chrome?.sidePanel || windowId === undefined) { status('Load VerbeFlow as a Chrome extension to use the side panel.'); return; }
  // Call directly inside the click handler, preserving Chrome's user gesture.
  chrome.sidePanel.open({windowId}).then(() => window.close()).catch(() => status('Could not open the side panel. Try again from a regular browser tab.'));
});
if (document.body.dataset.surface === 'panel') $('open-panel').hidden = true;
if (!globalThis.chrome?.sidePanel) $('open-panel').textContent = 'Browser preview · Load extension for side panel';
function updateVoices() {
  speechReady = !!globalThis.speechSynthesis?.getVoices().some(v => v.lang.startsWith('fr'));
  $('speak').textContent = speechReady ? 'Listen ♫' : 'French voice unavailable'; $('speak').disabled = !speechReady; $('speak').title = speechReady ? 'Read the French example aloud' : 'No French voice is installed in this browser';
}
updateVoices();
globalThis.speechSynthesis?.addEventListener('voiceschanged',updateVoices);
$('speak').addEventListener('click',() => {
  if (!speechReady) return;
  speechSynthesis.cancel(); const text = shownExample.french.replace(/\(e\)/g,'').replace(/\(s\)/g,'');
  const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'fr-FR'; utterance.rate = 0.85;
  utterance.voice = speechSynthesis.getVoices().find(v => v.lang.startsWith('fr'));
  utterance.onerror = () => status('Pronunciation is unavailable. Please try again.'); speechSynthesis.speak(utterance);
});
window.addEventListener('pagehide',() => globalThis.speechSynthesis?.cancel());
subscribe(async () => { try { state = await readState(); render(); } catch { status('Could not synchronize saved data. Reopen to retry.'); } });
render();
