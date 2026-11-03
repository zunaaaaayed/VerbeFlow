# Linguistic data contracts

The engine is a pure ES module: it imports packaged data, never DOM, storage, speech or Chrome APIs. No suffix-based discovery of unsupported verbs is permitted.

## Verb record (`src/data/verbs.js`)

- `infinitive`: unique French identity, also the storage key. `meaning`: English gloss.
- `group`: grammatical group 1, 2 or 3. Independent of `pattern`, the computational strategy (`er`, finir-type `ir`, vendre-type `re`, `irregular`, `reflexive`, or `impersonal`). Only explicitly admitted records use these strategies. A first-group spelling-change verb can use explicit irregular forms.
- `auxiliary`: avoir or être **for the supported sense**. `notes` documents exceptions/sense restrictions, especially sortir and entrer.
- `present`, `subjunctive`: optional complete arrays of explicitly stored forms, never a claimed stem decomposition.
- `futureStem`, `imperfectStem`, `participle`: explicit exceptional lexical forms. Otherwise the admitted pattern supplies them.
- `overrides`: tense ID → six explicit person forms, applied before any productive rule. Use this for spelling-sensitive exceptions; e.g. manger/commencer imparfait. Full paradigms avoid unclear sparse-array behavior.
- `personOrder`: exactly `1s,2s,3s,1p,2p,3p`. All six-form arrays follow that order. Swapping the declared order is invalid; structural validation cannot detect two grammatically valid strings accidentally swapped within an array—reference tests are required.
- `review`: source URLs, review status, date and method. `reference-cross-checked` does not mean independently reviewed by a human.
- `complement` and `translation`: legacy authoring context, no longer used to compose runtime examples.

## Reflexive and impersonal records

`pattern: 'reflexive'` requires a `baseVerb` referencing an admitted non-reflexive, non-impersonal record, `auxiliary: 'être'` and `agreement: 'subject'`. The engine derives simple forms from that explicit base, then prefixes person-specific reflexive pronouns with vowel/mute-h elision. The compound tense uses être, the base participle and the supported sense’s subject agreement. These entries do not claim to handle arbitrary following direct objects or indirect-reflexive verbs. Only the admitted h-initial families (habiter/habiller, both mute h) elide; a future aspirated-h verb needs lexical handling.

`pattern: 'impersonal'` requires `impersonalForms`, an explicit tense ID → third-person singular form mapping. It returns six slots: il has a real form and the other five have `available: false` and text `—`. The reverse index skips unavailable slots and does not add elle/on to impersonal matches. Dashes are not evidence of incomplete data, and must never be indexed as conjugations. Pleuvoir is deliberately restricted to weather usage.

## Tenses, explanations and examples

`TENSES` keys are `present`, `passe`, `imperfect`, `future`, `conditional`, `subjunctive`. Each contains `label`, `english` usage hint, `mood`, `formula` and `explanation`. Conditionnel is labeled separately for learners; grammatical classifications vary.

`formation(id, tense)` combines the actual rule/stem with verb-specific `notes`. Explicit irregular forms are presented whole. Passé composé explains auxiliary and agreement. Table `(e)` means optional feminine e; `(s)` means optional plural s for vous. The compact on row assumes singular agreement; plural referents may require plural agreement.

`EXAMPLES[infinitive][tense]` contains explicit `french` and `english` strings. No runtime substitutions or AI calls. `EXAMPLE_REVIEW` records editorial scope and review status. Compound examples choose a masculine singular speaker, avoiding parenthetical speech. The 660 examples may use explicit third-person subjects where a generic first-person frame would be unnatural (birth, death and impersonal weather). Edit the bilingual pair together and review aspect, meaning and naturalness, not only morphology.

## Search and storage

`lookup(query)` returns infinitive/prefix entries (`tense: null`) and/or form matches with `infinitive`, `tense`, `mood`, `personIndex`, `person`, `number`, `id`, `label`, and `form`. Accent-insensitive matching may intentionally add ambiguity. Choose a match's infinitive and tense together; never silently select among several interpretations. `search` is the legacy unique-infinitive helper.

Storage retains the starter’s four keys for compatibility and adds the validated `theme` preference. Recent is legacy data only: the UI no longer tracks or shows it. Bookmarks retain at most the first 10 valid distinct IDs, both on read and on write; a full list rejects another addition through `toggleBookmark` with a user-facing message while still allowing removal. Unknown IDs, invalid types and duplicate list entries are sanitized; unknown extra fields are ignored. Save individual key patches, not snapshots. Chrome storage change events synchronize open sessions. Concurrent edits to the same bookmark list are last-write-wins; this is not a collaborative database.

## Validation and provenance

Run `npm run check` before expanding coverage. Validation checks identity, duplicate verbs, declared person order, override tense IDs/shape, complete forms, source metadata, and bilingual coverage. Tests check independent high-risk forms and deliberately invalid data.

The 110 per-entry reference pages were consulted on 2026-11-03 through Le Conjugueur (Figaro), with Larousse spelling rules and the Académie's sortir auxiliary guidance as additional checks. An automated normalized presence comparison checked generated forms against reference page text; this does not itself prove tense/person alignment or accent correctness. The 60 added entries were also compared with accents preserved, including dedicated pronominal tables. Targeted independent assertions cover these risks. Tables, rules, explanations and bilingual examples were authored in this repository; no third-party dataset, reference prose or reference-page archive is bundled. The references are copyrighted publications, not a licensed dataset for redistribution. Independent human linguistic review remains desirable.

## Panel, color and speech boundaries

The action has no popup. `background.js` opens the side panel directly in the toolbar click handler. Page detection is separate from opening so it cannot consume the user gesture. In Auto mode, the panel requests a local visible-tab screenshot; the worker returns only `scheme: 'light' | 'dark' | null`. It classifies the majority of opaque sampled pixels by relative luminance, rather than copying colors. Pixel data is discarded, not persisted. Tab IDs are checked before/after capture and stale panel requests are ignored. Only packaged side-panel senders may request captures.

`colors.js` contains pure luminance/classification and preference resolution. `page-theme.js` sets a fixed `data-theme` and logo; all UI colors come from the supplied palette in CSS. `theme` is stored as `auto` (default), `light`, or `dark`; invalid/older values become `auto`. The header toggle chooses the opposite of the currently displayed theme and persists that manual override. The Auto button clears the override. Manual mode performs no screenshot requests and ignores any in-flight automatic result. Open sessions synchronize the preference through storage events. Temporary activeTab access needs a toolbar gesture; cross-tab automatic detection uses explicitly requested optional `<all_urls>` access. Without access, Auto follows the browser’s color preference; manual controls remain available.

`speech.js` filters voices by a strict French language tag, prefers local French voices, and passes both the exact voice name and language to Chrome TTS. It never defaults to an English voice when French is unavailable. Browser previews use an explicitly bound French Web Speech voice. This does not validate a third-party engine’s actual pronunciation or correct mislabeled OS voice data.
