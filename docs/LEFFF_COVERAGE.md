# Offline coverage pilot

This is the first import gate for broader coverage. The panel now offers 7,776 distinct verbs:
110 learning entries with 660 bilingual examples, plus 7,666 reference entries
with five simple tenses. Reference entries do not claim full learning coverage.

The pinned Lefff package has 7,826 records. The importer admits 7,790
structurally valid records for présent, imparfait, futur simple, conditionnel
présent and subjonctif présent. Of these, 7,766 have all 30 simple-tense slots;
another 24 have explicit nulls. Thirty-six records are quarantined for identity
or shape issues, including legitimate defective verbs needing individual review.

## Verification

- Every imported form reconstructs exactly, including accents and missing slots.
- 95 shared compression templates reduce the 6,277,936-byte source JSON to a
  332,268-byte pilot resource. Templates never apply to an unlisted infinitive.
- 3,010 comparable person/tense slots from the current learning library were
  compared exactly. 2,989 match. All 21 differences are documented variants:
  `puis/peux` and `payer` spellings with y/i. Nothing overwrites current tables.
- Eight reflexive entries are excluded: the source does not encode their
  supported senses or agreement. Weather-only `pleuvoir` retains VerbeFlow's
  narrower person restrictions.
- Reviewed variants extend curated reverse lookup, with actual tense and
  person. Reference reverse lookup inverts explicit family assignments instead
  of allocating a large per-form index. Main curated tables keep canonical forms.

## Boundaries

Structural validation does not prove linguistic correctness. The source does
not supply sense-specific auxiliary choice, English glosses, bilingual examples,
frequency rankings, h-elision metadata, or an independent human review. It does
not directly provide passé composé. Past participles alone cannot establish
auxiliary selection and agreement.

`audit.json` lists rejected records, missing slots, comparison details, source
pin and promotion requirements. `pilot.json` is the editable resource snapshot; the generated
`src/data/lefff-reference.js` supplies runtime reference data. Only complete
paradigms enter the catalog, and curated entries always take priority.
`review.json` is the editable list of explicit review decisions. No blanket
regex allowance or automatic approval of future differences is used.

## Promotion to the learning library

1. Select frequent learner verbs, not the first 500 alphabetically. A separately
   licensed frequency source is needed; Lefff is not a frequency list.
2. Document a supported sense, verified auxiliary, meaning, group and elision.
3. Verify six-tense forms and variants against independent references. Two
   resources derived from the same lexicon are not independent evidence.
4. Add natural bilingual examples and explanations, preserving complete
   six-tense learning coverage. Until then, the reference interface shows source
   attribution, review status, whole forms and no fabricated examples. Passé
   composé explicitly says the auxiliary has not been reviewed.
5. Add independent fixtures and review metadata before admitting each record.

Run `npm run import:lefff` to reproduce or `npm run check:lefff` to verify.
Neither command needs network access or dependency installation. Replacing the
source requires deliberately updating its manifest, archive, license and
metadata, then reviewing the resulting diff. Unresolved comparisons fail checks.

Data here remains **LGPLLR**. Read [the attribution and modification
notice](LEFFF_SOURCE.md) and [full license](../vendor/lefff/LICENSE-LGPLLR.txt).

Reference search includes known infinitives/prefixes and conjugated forms, with
accent/apostrophe normalization and ambiguity preserved. Search results show at
most 40 choices initially, with a keyboard-accessible Show more button. All
reference entries can be saved under the existing ten-verb limit. H-initial
reference forms show je / j’ because h-elision metadata is not supplied. The
source can omit valid spelling variants, and complete tables may still contain
errors; this is reference coverage, not independent linguistic certification.
