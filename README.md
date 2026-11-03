# VerbeFlow

A lightweight offline Chrome Manifest V3 extension for French conjugation. The lavender toolbar popup and persistent side panel share one vanilla JavaScript interface. No build step, accounts, analytics, remote code or host permissions.

## Install or reload

Requires Chrome 116 or later.

1. Open `chrome://extensions` and enable **Developer mode**.
2. Choose **Load unpacked** and select this repository root (the directory containing `manifest.json`).
3. If VerbeFlow was loaded from the starter's other directory, remove that old entry first to avoid two separate extensions and stores. Loading this repository creates a separate store; existing starter bookmarks are not automatically transferred across extension IDs.
4. After subsequent edits, close its popup and side panel, click **Reload** on the VerbeFlow card, then reopen via the toolbar icon.
5. Click **Keep learning in the side panel** from the popup. Opening is called directly within the click handler to retain Chrome's required user gesture.

## Development

Use Node.js 22+: `npm run check` runs data validation, app syntax and Node tests. `npm test` runs tests alone. No npm install is needed. GitHub Actions runs the checks on pushes and pull requests.

`npm run preview` serves `http://127.0.0.1:8765/popup.html` and `/sidepanel.html`. A web preview uses localStorage, not Chrome APIs; it cannot verify extension storage, panel opening or extension CSP integration.

## Architecture and data

- `src/engine.js`: pure conjugation, formation explanations, normalized reverse lookup and explicit example retrieval.
- `src/data/verbs.js`: 50 admitted non-reflexive verbs, grammatical groups, productive patterns, explicit stems/forms/overrides, sense-specific auxiliaries and provenance.
- `src/data/tenses.js`: six tenses and their mood, usage and formation metadata.
- `src/data/examples.js`: 300 explicit bilingual examples, one per verb/tense, and editorial review metadata.
- `src/validate.js`: dataset completeness and contract validation.
- `src/storage.js`: sanitization, key-level persistence and cross-surface subscriptions.
- `src/app.js`, `src/styles.css`: shared accessible interface, pronunciation and direct-click panel opening.

See [DATA_CONTRACTS.md](DATA_CONTRACTS.md) for field definitions, override priority, review scope and extension instructions for contributors.

## Coverage

Présent de l’indicatif, passé composé, imparfait, futur simple, conditionnel présent and subjonctif présent; six person rows each. All supported verbs are available through **All verbs**.

parler, aimer, travailler, finir, choisir, vendre, attendre, être, avoir, aller, faire, prendre, venir, pouvoir, vouloir, devoir, voir, savoir, dire, donner, porter, trouver, regarder, écouter, demander, chercher, rester, arriver, entrer, réussir, répondre, perdre, rendre, oublier, jouer, manger, commencer, acheter, appeler, jeter, partir, dormir, sortir, lire, écrire, boire, mettre, recevoir, tenir, connaître.

Search infinitives, prefixes or forms: `j’avais`, `ECRIS`, `elles sont sorties`. Results retain tense, mood, person, number and the actual matched form. Several interpretations remain separate; selecting one opens that verb and tense. Unsupported verbs never receive guessed forms.

## Provenance and limitations

Forms were authored and cross-checked on 2026-11-03 against per-verb [Le Conjugueur](https://leconjugueur.lefigaro.fr/) references, supplemented by [Larousse's acheter rule](https://www.larousse.fr/fr/conjugaison/francais/acheter/125) and [Académie guidance for sortir](https://www.dictionnaire-academie.fr/conjuguer/A9S2177). Source links and review status accompany every verb. No third-party dataset or copyrighted explanatory prose is bundled. Original bilingual examples were editorially reviewed by Codex; independent human linguistic review is still pending.

Only the listed verbs and six tenses are supported. No reflexive, passive, imperative, literary tenses or object-pronoun parsing. Entrer and sortir use the intransitive sense with être; their transitive avoir usage is explained but not conjugated. Traditional connaître spelling is used. Accent-insensitive lookup intentionally preserves additional matches.

Tables show optional feminine/plural agreement; examples use a masculine singular speaker. Avoir tables assume no preceding direct object. The on row is compact and assumes singular agreement. French pronunciation requires an installed French browser/system voice; unavailability is shown visibly. Speech availability/offline behavior depends on the chosen system voice. No external speech service is configured.

State is shared through chrome.storage.local. Invalid/older data falls back to valid defaults. Read/write failures are reported. Concurrent changes to the same list are last-write-wins; writes to different keys are preserved.

## Verification and Chrome smoke test

Automated checks cover all 1,800 forms structurally, all 300 examples, spelling and irregular families, auxiliary agreement, normalized and ambiguous lookups, validation failures, malformed/older state, storage failures and synchronization notifications. Browser automation was unavailable in the implementation environment, so neither visual preview nor actual loaded-extension integration was verified.

After reloading:

1. Search `j’avais`: choose **avoir → Imparfait → first-person singular**; confirm `avais` appears.
2. Search `parle`: confirm distinct present/subjunctive and person choices. Use Tab and Enter to select a subjunctive result; confirm the tense changes and heading receives focus.
3. Check manger imparfait (`mangeais`, `mangions`), commencer (`commençais`, `commencions`), acheter future (`achèterai`) and connaître present (`connaît`).
4. Check sortir passé composé: `je suis sorti(e)`, auxiliary explanation and agreement legend. Listen: the example must contain no spoken parentheses.
5. Save a verb, open the side panel by clicking the popup button, then change tense/bookmarks. Reopen the popup and confirm shared state. Check again after restarting Chrome.
6. Resize the panel to about 320 px, zoom to 125%, navigate by keyboard, and inspect focus/labels. Try blank search and an unsupported verb.
7. Confirm **Errors** on `chrome://extensions` is empty. If no French voice is installed, confirm the visible unavailable label and disabled Listen button.
