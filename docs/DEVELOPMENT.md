# VerbeFlow maintainer guide

User-facing installation and setup are in README.md. This file contains development, architecture, validation and browser-test notes. See docs/DATA_CONTRACTS.md for the linguistic contracts.

## Development

Use Node.js 22+: `npm run check` runs data validation, app syntax and Node tests. `npm test` runs tests alone. No npm install is needed. GitHub Actions runs the checks on pushes and pull requests.

`npm run preview` serves `http://127.0.0.1:8765/sidepanel.html`. A web preview uses localStorage, not Chrome APIs; it cannot verify extension storage, panel opening or extension CSP integration.

## Architecture and data

### Broad offline coverage pilot

`npm run import:lefff` rebuilds the pinned Lefff import without network access or
dependency installation. `npm run check:lefff` verifies archive integrity,
round-trip reconstruction of all 233,700 person/tense slots, explicit review
decisions and byte-for-byte generated output. This runs in `npm run check`, so
the existing GitHub Actions workflow covers it too.

Read `docs/LEFFF_COVERAGE.md` for scope and promotion gates and
`docs/LEFFF_SOURCE.md` for LGPLLR/source obligations. The generated resource supplies
7,666 complete reference entries alongside 110 curated learning entries.
`src/reference.js` admits only complete simple paradigms, decodes whole forms
and inverts 95 templates for conjugated-form lookup without a large expanded
index. `src/data/catalog.js` gives curated entries priority. Twenty-one reviewed
alternate forms also extend payer/pouvoir search. The curated six-tense learning
and explicit-example contracts remain intact. No API calls, extra
permissions or build step were added to the installed extension.

To smoke-test the change after reloading the actual extension: search `je paye`,
`payerai`, and `je puis`. Each result should name its tense/person and identify
an accepted variant. Select it: the matching tense opens, with the canonical
form and a variation explanation. Check that `paye` offers both present and
subjunctive first/third-person choices, saved verbs still synchronize, and a
reference verb such as `abaisser` opens its source-labeled table without invented
examples; its passé composé is explicitly unavailable. Check `j’acquiers` resolves
to acquérir/present/first-person singular, broad prefixes expose Show more,
reference bookmarks persist, and quarantined `clore` stays unsupported.

### Existing runtime

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

See [docs/DATA_CONTRACTS.md](DATA_CONTRACTS.md) for field definitions, override priority, review scope and extension instructions for contributors.

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

The generated book/V brand mark in `assets/brand` is shared by the UI, toolbar and extension manager. PNG exports are provided at 16, 32, 48 and 128 pixels alongside the full-resolution master; generation details are in `docs/BRANDING.md`. Your personal Z logo remains in the creator footer.

Node checks cover the new reference catalog and search. The dated browser smoke
checks above describe the earlier release; they do not establish cross-browser
validation of the expanded reference collection.

Actual loaded Chrome checks on 2026-11-04 verified toolbar opening, reverse
lookup for `j’acquiers`, source attribution and correct present forms, explicit
unavailable passé composé, reference bookmarking across an extension reload,
and `je paye` ambiguity with selection of subjonctif while restoring the curated
example and French Listen control. Broad prefix `a` showed 40 of 594 results;
Show more increased this to 80 and focused the first newly added result. The
temporary test bookmark was removed and the prior verb/tense restored.
Other browsers and platforms have not been retested for this change.

## Release packaging and publication

`npm run package` creates `dist/VerbeFlow-0.2.0.zip` and `dist/SHA256SUMS`.
The packager follows runtime module, HTML, CSS and asset dependencies rather
than archiving the repository. It includes the main user README, licenses,
font notices and a release-specific corresponding-source link. Tests, import
scripts, audit data, metadata, full-resolution artwork and supporting docs stay
out of the extension ZIP. Generated release files are ignored by Git.

After committing, `python3 scripts/package-release.py --source` also creates a
complete source ZIP from committed HEAD. Both assets must be distributed
together, so the resource source, review inputs, notices and transformations
remain available under the applicable licenses. The installer ZIP alone does
not replace the corresponding-source distribution obligations.

The tag workflow `.github/workflows/release.yml` checks the tag against the
manifest version, runs all checks, builds both archives and publishes a GitHub
release with SHA-256 checksums and `docs/RELEASE_NOTES.md`. Push a version tag
only when the release is intended to be public. This workflow does not upload
to the Chrome Web Store. Increment both manifest and package versions for the
next release and update the user download filename and release notes.
