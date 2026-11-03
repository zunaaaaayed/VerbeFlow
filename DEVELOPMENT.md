# VerbeFlow maintainer guide

User-facing installation and setup are in README.md. This file contains development, architecture, validation and browser-test notes. See DATA_CONTRACTS.md for the linguistic contracts.

## Development

Use Node.js 22+: `npm run check` runs data validation, app syntax and Node tests. `npm test` runs tests alone. No npm install is needed. GitHub Actions runs the checks on pushes and pull requests.

`npm run preview` serves `http://127.0.0.1:8765/sidepanel.html`. A web preview uses localStorage, not Chrome APIs; it cannot verify extension storage, panel opening or extension CSP integration.

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

Cormorant Garamond is used for the VerbeFlow wordmark; Instrument Serif is used for verb headings and French example text; Lora is used for the interface and conjugation table. The regular/italic Instrument Serif and variable regular/italic Lora fonts are bundled in `assets/fonts` for offline use, from the official Google Fonts repository. All three families are distributed under the SIL Open Font License 1.1; their full licenses are included as `CormorantGaramond-OFL.txt`, `InstrumentSerif-OFL.txt` and `Lora-OFL.txt`. No runtime Google Fonts connection is made.

The generated book/V brand mark in `assets/brand` is shared by the UI, toolbar and extension manager. PNG exports are provided at 16, 32, 48 and 128 pixels alongside the full-resolution master; generation details are in `assets/brand/README.md`. Your personal Z logo remains in the creator footer.
