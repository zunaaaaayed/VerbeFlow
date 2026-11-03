# VerbeFlow

A lightweight offline Chrome Manifest V3 side-panel extension for French conjugation. Clicking the toolbar icon opens the panel directly; there is no popup. Conjugations use 22 px type with 16 px pronouns. No build step, accounts, analytics or remote code.

## Install or reload

Requires Chrome 116 or later.

1. Open `chrome://extensions` and enable **Developer mode**.
2. Choose **Load unpacked** and select this repository root (the directory containing `manifest.json`).
3. If VerbeFlow was loaded from the starter's other directory, remove that old entry first to avoid two separate extensions and stores. Loading this repository creates a separate store; existing starter bookmarks are not automatically transferred across extension IDs.
4. After subsequent edits, close its side panel, click **Reload** on the VerbeFlow card, then reopen via the toolbar icon.
5. Click the VerbeFlow toolbar icon. The service worker calls `sidePanel.open()` directly from the click handler, before any asynchronous color work.

## Development

Use Node.js 22+: `npm run check` runs data validation, app syntax and Node tests. `npm test` runs tests alone. No npm install is needed. GitHub Actions runs the checks on pushes and pull requests.

`npm run preview` serves `http://127.0.0.1:8765/sidepanel.html`. A web preview uses localStorage, not Chrome APIs; it cannot verify extension storage, panel opening or extension CSP integration.

## Appearance and saved verbs

Both themes use the supplied five-color palette: **#244855** (deep blue), **#E64833** (orange), **#874F41** (brown), **#90AEAD** (teal), and **#FBE9D0** (cream). Light mode has a cream background with blue/brown text; dark mode has a deep-blue background with cream text. Surface tints and muted text shades preserve readable contrast. Conjugation endings use **#E64833**, at a bold 22 px size; other orange accents are decorative. The footer logo is black in light mode and white in dark mode.

Use the sun/moon switch in the header to choose light or dark mode. This manual choice is saved across tabs and browser restarts. **Auto** appears beside the switch when a manual override is active; click it to follow the active page again. In Auto, the extension only classifies the page as light or dark—it never copies webpage colors into the interface. If detection is unavailable, Auto follows the browser/system color preference. Manual mode does not capture or sample webpages.

Clicking the toolbar grants temporary `activeTab` access to that page. To follow light/dark appearance automatically across tab switches and sites, click **Enable automatic page detection** in the footer and accept Chrome’s optional website-access prompt. This requests `<all_urls>` only at that explicit click; it is not a required install-time host permission. You can revoke it through Chrome’s extension site-access controls. In Auto, small screenshot samples are processed locally about every 3.5 seconds and on tab/navigation changes. Only a light/dark classification leaves the worker; screenshots are not saved, logged or transmitted. Image-heavy or evenly mixed pages may be classified imperfectly; the manual switch always takes priority.

Required permissions: `storage` for saved state, `sidePanel` for the interface, `activeTab` for light/dark classification on a toolbar click, and `tts` for native French speech. No scripting/content-script permission is needed.

Search is the entry point to the full offline library. **Saved verbs** appears beneath it when nonempty; Recent and All verbs tabs have been removed. Save up to **10 distinct verbs** with the star. At the limit, unsave a verb before adding another; existing saves can always be removed. Older lists display their first 10 valid, distinct entries, and every subsequent bookmark write enforces the same limit. Legacy recent data is tolerated but no longer tracked or shown.

## Architecture and data

- `src/engine.js`: pure conjugation, formation explanations, normalized reverse lookup and explicit example retrieval.
- `src/data/verbs.js`: 110 admitted verb entries, grammatical groups, productive patterns, explicit stems/forms/overrides, sense-specific auxiliaries and provenance.
- `src/data/core-verbs.js`: additional student vocabulary, explicit reflexive base relationships and impersonal paradigms.
- `src/data/verb-record.js`: shared constructors for admitted regular and irregular records.
- `src/data/tenses.js`: six tenses and their mood, usage and formation metadata.
- `src/data/examples.js`: 660 explicit bilingual examples, one per verb/tense, and editorial review metadata.
- `src/validate.js`: dataset completeness and contract validation.
- `src/storage.js`: sanitization, key-level persistence and cross-surface subscriptions.
- `src/app.js`, `src/styles.css`: accessible side-panel interface and large conjugation rows.
- `src/background.js`: direct toolbar opening and local light/dark screenshot classification.
- `src/colors.js`, `src/page-theme.js`: fixed theme selection, optional automatic detection and active-tab refresh.
- `src/speech.js`: strict French voice selection through native Chrome TTS, with Web Speech for previews.

See [DATA_CONTRACTS.md](DATA_CONTRACTS.md) for field definitions, override priority, review scope and extension instructions for contributors.

## Coverage

Présent de l’indicatif, passé composé, imparfait, futur simple, conditionnel présent and subjonctif présent; six person slots each (unused impersonal persons are explicit dashes). Search accesses every entry without a network connection. The library covers 100 ordinary verbs across all three grammatical groups, spelling changes and major irregular families, eight common reflexive verbs, and two impersonal verbs. It is a curated core library, not a complete dictionary of French verbs.

The original 50 verbs are supplemented by everyday vocabulary such as étudier, penser, passer, marcher, aider, utiliser, raconter, montrer, apporter, habiter, visiter, voyager, déjeuner, dîner, préparer, fermer, garder, quitter, croire, vivre, suivre, rire, ouvrir, offrir, apprendre, comprendre, conduire, traduire, envoyer, payer, préférer, espérer, lever, promener, mourir, naître, devenir, revenir, obtenir, sentir, servir, courir, valoir, permettre and battre, plus the base verbs for daily routines.

Reflexive entries: se lever, s’habiller, se laver, se coucher, se réveiller, se promener, s’appeler and se préparer. Impersonal entries: falloir and pleuvoir (weather sense).

Search infinitives, prefixes or forms: `j’avais`, `ECRIS`, `elles sont sorties`. Results retain tense, mood, person, number and the actual matched form. Several interpretations remain separate; selecting one opens that verb and tense. Unsupported verbs never receive guessed forms.

## Provenance and limitations

Forms were authored and cross-checked on 2026-11-03 against per-verb [Le Conjugueur](https://leconjugueur.lefigaro.fr/) references, supplemented by [Larousse's acheter rule](https://www.larousse.fr/fr/conjugaison/francais/acheter/125) and [Académie guidance for sortir](https://www.dictionnaire-academie.fr/conjuguer/A9S2177). Source links and review status accompany every verb. No third-party dataset or copyrighted explanatory prose is bundled. Original bilingual examples were editorially reviewed by Codex; independent human linguistic review is still pending.

Only the bundled entries and six tenses are supported. No passive, imperative, literary tenses or arbitrary object-pronoun parsing. Reflexive entries support the documented sense with subject agreement; constructions with a following direct object, such as elle s’est lavé les mains, need different agreement and are outside these tables. Pleuvoir covers weather, not figurative plurals. Entrer and sortir use the intransitive sense with être; their transitive avoir usage is explained but not conjugated. Passer represents transitive “spend time” with avoir. Traditional connaître spelling and the documented payer/préférer/espérer variants are used. Accent-insensitive lookup intentionally preserves additional matches.

Tables show optional feminine/plural agreement; examples use a masculine singular speaker. Avoir tables assume no preceding direct object. The on row is compact and assumes singular agreement. French pronunciation explicitly selects a French-language voice and matching language through Chrome’s native TTS API, preferring local voices. If none is available, Listen is disabled instead of using English. Hover Listen to see the chosen voice and language. Install a French voice in your operating system speech settings if necessary. Page previews use Web Speech with the same strict language filtering. Offline availability depends on the installed voice; no external speech service is configured.

State is shared through chrome.storage.local. Invalid/older data falls back to valid defaults. Read/write failures are reported. Concurrent changes to the same list are last-write-wins; writes to different keys are preserved.

## Verification and Chrome smoke test

Automated checks cover all 3,900 available person/tense forms and 60 explicit impersonal gaps structurally, all 660 examples, spelling and irregular families, auxiliary agreement, normalized and ambiguous lookups, validation failures, malformed/older state, storage failures and synchronization notifications. The actual loaded Chrome extension was checked for direct toolbar-to-panel opening, removal of the extra copy, larger conjugation rows, both fixed palettes and the live header toggle, including a manual light override while a dark webpage remains active. The native Listen action selected Eddy (French (France)), `fr-FR`, with no playback error; the automation cannot verify the audible accent. New automated checks cover the fixed palettes’ text contrast, light/dark page classification, saved manual overrides, suspension of sampling in manual mode, Auto restoration, French-only voice selection, native TTS language binding, and service-worker capture failure/race handling. Storage and Chrome API tests use mocks. Full all-site permission behavior and the 10-save interaction checklist remain manual checks.

After reloading:

1. Search `j’avais`: choose **avoir → Imparfait → first-person singular**; confirm `avais` appears.
2. Search `parle`: confirm distinct present/subjunctive and person choices. Use Tab and Enter to select a subjunctive result; confirm the tense changes and heading receives focus.
3. Check manger imparfait (`mangeais`, `mangions`), commencer (`commençais`, `commencions`), acheter future (`achèterai`) and connaître present (`connaît`).
4. Check sortir passé composé: `je suis sorti(e)`, auxiliary explanation and agreement legend. Listen: the example must contain no spoken parentheses.
5. Save a verb, close/reopen the side panel through the toolbar, and confirm the selection, tense and saved list persist. Check again after restarting Chrome.
6. Resize the panel to about 320 px, zoom to 125%, navigate by keyboard, and inspect focus/labels. Try blank search and an unsupported verb.
7. Confirm **Errors** on `chrome://extensions` is empty. If no French voice is installed, confirm the visible unavailable label and disabled Listen button.

Additional checks for this update:

- In Auto, visit a dark page and click the toolbar: verify the fixed charcoal theme and white Z logo. Visit a light page and click again: verify the cream theme and black logo. Enable **automatic page detection** for cross-tab following. Toggle manually, switch tabs, and restart Chrome: the manual theme must stay selected. Click **Auto** to resume detection. Deny/revoke permission and verify the browser-preference fallback. Click Z to open the creator’s website in a separate tab.
- `npm run preview` also serves `/tests/fixtures/colors-light.html` and `/tests/fixtures/colors-dark.html` as controlled color pages. Test these with the loaded extension, not a preview of its interface.
- Save 10 different verbs, attempt an eleventh, and confirm the count stays at 10 with a helpful message. Unsave one, then save another.
- Search `s’habiller`, `elles se sont lavées`, `il faut`, and `il pleuvra`. Confirm correct elision/agreement and dashes for unused impersonal persons.

## Typography

Instrument Serif is used for the brand, verb headings and French example text; Lora is used for the interface and conjugation table. The regular/italic Instrument Serif and variable regular/italic Lora fonts are bundled in `assets/fonts` for offline use, from the official Google Fonts repository. Both families are distributed under the SIL Open Font License 1.1; their full licenses are included as `InstrumentSerif-OFL.txt` and `Lora-OFL.txt`. No runtime Google Fonts connection is made.
