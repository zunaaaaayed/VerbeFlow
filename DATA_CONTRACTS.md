# Linguistic data contracts

The engine is a pure ES module: it imports packaged data, never DOM, storage, speech or Chrome APIs. No suffix-based discovery of unsupported verbs is permitted.

## Verb record (`src/data/verbs.js`)

- `infinitive`: unique French identity, also the storage key. `meaning`: English gloss.
- `group`: grammatical group 1, 2 or 3. Independent of `pattern`, the computational strategy (`er`, finir-type `ir`, vendre-type `re`, or `irregular`). Only explicitly admitted records use these strategies. A first-group spelling-change verb can use explicit irregular forms.
- `auxiliary`: avoir or être **for the supported sense**. `notes` documents exceptions/sense restrictions, especially sortir and entrer.
- `present`, `subjunctive`: optional complete arrays of explicitly stored forms, never a claimed stem decomposition.
- `futureStem`, `imperfectStem`, `participle`: explicit exceptional lexical forms. Otherwise the admitted pattern supplies them.
- `overrides`: tense ID → six explicit person forms, applied before any productive rule. Use this for spelling-sensitive exceptions; e.g. manger/commencer imparfait. Full paradigms avoid unclear sparse-array behavior.
- `personOrder`: exactly `1s,2s,3s,1p,2p,3p`. All six-form arrays follow that order. Swapping the declared order is invalid; structural validation cannot detect two grammatically valid strings accidentally swapped within an array—reference tests are required.
- `review`: source URLs, review status, date and method. `reference-cross-checked` does not mean independently reviewed by a human.
- `complement` and `translation`: legacy authoring context, no longer used to compose runtime examples.

## Tenses, explanations and examples

`TENSES` keys are `present`, `passe`, `imperfect`, `future`, `conditional`, `subjunctive`. Each contains `label`, `english` usage hint, `mood`, `formula` and `explanation`. Conditionnel is labeled separately for learners; grammatical classifications vary.

`formation(id, tense)` combines the actual rule/stem with verb-specific `notes`. Explicit irregular forms are presented whole. Passé composé explains auxiliary and agreement. Table `(e)` means optional feminine e; `(s)` means optional plural s for vous. The compact on row assumes singular agreement; plural referents may require plural agreement.

`EXAMPLES[infinitive][tense]` contains explicit `french` and `english` strings. No runtime substitutions or AI calls. `EXAMPLE_REVIEW` records editorial scope and review status. Compound examples choose a masculine singular speaker, avoiding parenthetical speech. Edit the bilingual pair together and review aspect, meaning and naturalness, not only morphology.

## Search and storage

`lookup(query)` returns infinitive/prefix entries (`tense: null`) and/or form matches with `infinitive`, `tense`, `mood`, `personIndex`, `person`, `number`, `id`, `label`, and `form`. Accent-insensitive matching may intentionally add ambiguity. Choose a match's infinitive and tense together; never silently select among several interpretations. `search` is the legacy unique-infinitive helper.

Storage retains the starter's four keys so existing installations migrate without losing valid selections/bookmarks. Unknown IDs, invalid types and duplicate list entries are sanitized; unknown extra fields are ignored. Save individual key patches, not snapshots. Chrome storage change events synchronize surfaces. Concurrent edits to the same bookmark list are last-write-wins; this is not a collaborative database.

## Validation and provenance

Run `npm run check` before expanding coverage. Validation checks identity, duplicate verbs, declared person order, override tense IDs/shape, complete forms, source metadata, and bilingual coverage. Tests check independent high-risk forms and deliberately invalid data.

The 50 reference pages were consulted on 2026-11-03 through Le Conjugueur (Figaro), with Larousse spelling rules and the Académie's sortir auxiliary guidance as additional checks. An automated normalized presence comparison checked generated forms against reference page text; this does not itself prove tense/person alignment or accent correctness. Targeted independent assertions cover these risks. Tables, rules, explanations and bilingual examples were authored in this repository; no third-party dataset, reference prose or reference-page archive is bundled. The references are copyrighted publications, not a licensed dataset for redistribution. Independent human linguistic review remains desirable.
