import { speechController } from './speech.js';
import { startPageTheme } from './page-theme.js';
import { BY_ID } from './data/verbs.js';
import { TENSES } from './data/tenses.js';
import { conjugate, subject, lookup, selectionForMatch, formation, example } from './engine.js';
import { readState, saveState, subscribe, MAX_BOOKMARKS, toggleBookmark } from './storage.js';

// All HTML fragments below contain only packaged, trusted data. Search text is
// inserted through textContent, never interpolated into HTML.
const app = document.querySelector('#app');
app.innerHTML = `
  <header><div class="brand"><img class="brand-mark" src="assets/brand/verbeflow-128.png" srcset="assets/brand/verbeflow-48.png 1x, assets/brand/verbeflow-128.png 2x" alt="" width="42" height="42"><div>VerbeFlow<small>A little French, every day.</small></div></div><div class="appearance-controls"><button id="theme-auto" type="button" class="text-button" title="Follow the active page’s light or dark appearance" hidden>Auto</button><button id="theme-toggle" type="button" role="switch" aria-checked="false" aria-label="Dark mode" title="Switch theme">☾</button></div></header>
  <section class="search-section"><label class="sr-only" for="verb-search">Search French verbs</label><form id="search-form"><div class="search-box"><span aria-hidden="true">⌕</span><input id="verb-search" autocomplete="off" spellcheck="false" placeholder="Try parler, être, or avons…"><button type="submit" aria-label="Search verbs">→</button></div></form><div id="results" role="region" aria-live="polite" aria-label="Search results"></div></section>
  <section class="collection" aria-labelledby="saved-label"><div class="collection-heading"><h2 id="saved-label">Saved verbs</h2><span id="saved-count" aria-live="polite"></span></div><div id="collection-list" class="chips"></div></section>
  <article><div class="verb-heading"><div><p class="eyebrow">YOUR VERB, UNPACKED</p><h1 id="verb-title" lang="fr" tabindex="-1"></h1><p id="meaning"></p></div><button id="bookmark" class="icon-button" aria-label="Save verb" aria-pressed="false">☆</button></div><div id="metadata" class="metadata"></div>
  <label class="select-label" for="tense">Explore a tense</label><div class="tense-select"><select id="tense"></select><span id="tense-subtitle"></span></div>
  <section class="conjugation"><div class="section-title"><h2>Conjugation</h2><span id="ending-key">Highlighted endings</span></div><div id="forms"></div></section>
  <section class="formation"><div class="section-title"><h2>How it’s formed</h2></div><p id="formula" class="formula"></p><p id="specific-rule"></p><details><summary>Usage & grammar notes</summary><p id="explanation"></p></details></section>
  <section class="example"><div class="section-title"><h2>In a sentence</h2><button id="speak" class="text-button" type="button">Listen ♫</button></div><p id="example-fr" lang="fr"></p><p id="example-en"></p></section>
  <p id="agreement" class="hint"></p></article>
  <footer><button id="page-detection" type="button" class="text-button" title="Allow automatic light/dark detection across tabs. Screenshots are processed locally, never saved or sent." hidden>Enable automatic page detection</button><p class="credit">Built with <span aria-label="love">♡</span> by <a class="creator-link" href="https://zunaaaaayed.github.io" target="_blank" rel="noopener noreferrer" aria-label="Z — visit the creator’s website"><img class="creator-logo creator-logo-black" src="assets/logo_black.png" alt="Z" width="18" height="20"><img class="creator-logo creator-logo-white" src="assets/logo_white.png" alt="" aria-hidden="true" width="18" height="20"></a></p></footer><p id="status" role="status" aria-live="polite"></p>`;
const $ = id => document.getElementById(id);
let state;
try { state = await readState(); } catch { state = (await import('./storage.js')).sanitize({}); status('Saved data could not be read. Using defaults; try reopening the extension.'); }
let shownExample;
let pageTheme;
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
  await persist({selected:id, tense});
}
function chip(id, parent) {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = id; b.lang = 'fr';
  b.className = 'chip'; b.setAttribute('aria-pressed',String(state.selected === id));
  b.addEventListener('click',() => selectVerb(id)); parent.append(b);
}
function renderCollection() {
  $('collection-list').replaceChildren();
  state.bookmarks.forEach(id => chip(id,$('collection-list')));
  document.querySelector('.collection').hidden = !state.bookmarks.length;
  $('saved-count').textContent = `${state.bookmarks.length} / ${MAX_BOOKMARKS}`;
}
function render() {
  pageTheme?.setPreference(state.theme);
  const v = BY_ID[state.selected], tense = TENSES[state.tense];
  $('verb-title').textContent = v.infinitive;
  $('meaning').textContent = v.meaning;
  $('metadata').textContent = `Group ${v.group} · ${v.pattern === 'reflexive' ? 'Reflexive' : v.pattern === 'impersonal' ? 'Impersonal' : v.pattern === 'irregular' ? 'Irregular / spelling change' : v.pattern === 'ir' ? 'Finir pattern' : v.pattern+' pattern'} · Auxiliary: ${v.auxiliary}`;
  const saved = state.bookmarks.includes(v.infinitive);
  $('bookmark').textContent = saved ? '★' : '☆'; $('bookmark').setAttribute('aria-pressed',String(saved)); $('bookmark').setAttribute('aria-label',saved ? 'Unsave verb' : 'Save verb'); $('bookmark').title = saved ? 'Remove from saved verbs' : state.bookmarks.length >= MAX_BOOKMARKS ? '10 verbs saved — remove one to save another' : 'Save verb';
  $('tense').value = state.tense; $('tense-subtitle').textContent = tense.english;
  const forms = conjugate(v.infinitive,state.tense);
  $('forms').replaceChildren();
  forms.forEach((f,i) => {
    const row = document.createElement('div'); row.className = f.available === false ? 'form-row unavailable' : 'form-row'; row.lang = 'fr';
    const pronoun = document.createElement('span'); pronoun.textContent = v.pattern === 'impersonal' && i === 2 ? 'il' : subject(i,f.text);
    if (f.available === false) row.setAttribute('aria-label',`${pronoun.textContent}: not used in this impersonal sense`);
    const word = document.createElement('strong'); word.append(document.createTextNode(f.stem));
    const ending = document.createElement('span'); ending.className = 'ending'; ending.textContent = f.ending; word.append(ending);
    row.append(pronoun,word); $('forms').append(row);
  });
  $('ending-key').textContent = state.tense === 'passe' ? 'Highlighted participle' : forms.some(f => f.ending) ? 'Highlighted endings' : v.pattern === 'impersonal' ? 'Impersonal il only' : 'Stored forms';
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
  if (!matches.length) { const p = document.createElement('p'); p.className = 'no-results'; p.textContent = 'This verb is not in the offline library yet. Try a shorter infinitive prefix, such as parl, or a common verb such as être.'; $('results').append(p); return; }
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
$('tense').addEventListener('change',() => persist({tense:$('tense').value}));
$('bookmark').addEventListener('click',() => {
  try { const bookmarks = toggleBookmark(state.bookmarks,state.selected); status(''); persist({bookmarks}); }
  catch (error) { status(error.message); }
});
const speech = speechController({
  onReady(ready,voice) {
    $('speak').textContent = ready ? 'Listen ♫' : 'French voice unavailable';
    $('speak').disabled = !ready;
    $('speak').title = ready ? `Read with ${voice.voiceName ?? voice.name} (${voice.lang})` : 'Install a French voice in system speech settings';
  },
  onError:status,
});
$('speak').addEventListener('click',() => speech.speak(shownExample.french));
window.addEventListener('pagehide',() => speech.dispose(),{once:true});
startPageTheme({toggle:$('theme-toggle'),auto:$('theme-auto'),access:$('page-detection'),preference:state.theme,onPreference:theme=>persist({theme}),report:status})
  .then(controller=>{pageTheme=controller;pageTheme.setPreference(state.theme);})
  .catch(()=>status('Automatic page detection is unavailable. The theme toggle still works.'));
subscribe(async () => { try { state = await readState(); render(); } catch { status('Could not synchronize saved data. Reopen to retry.'); } });
render();
