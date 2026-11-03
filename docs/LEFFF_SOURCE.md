# Lefff source, attribution and modification notice

`vendor/lefff/` contains the complete, unmodified published archive of
`french-verbs-lefff` **3.4.0**, obtained from npm on **2026-11-03**. The original
npm metadata and a source/integrity manifest accompany it. No upstream
executable code is run or installed.

The linguistic resource originates in the **Lefff (Lexique des Formes Fléchies
du Français)**, by Benoît Sagot, Lionel Clément and collaborators, and was
extracted and packaged for RosaeNLG by **Ludan Stoecklé**. See the original
README inside the archive and the [pinned upstream directory](https://github.com/RosaeNLG/rosaenlg/tree/745dc50c54690936fba332ca465308c607053e46/packages/french-verbs-lefff).

The **linguistic data is LGPLLR**, the Lesser General Public License for
Linguistic Resources. Its complete original license is reproduced in
[LICENSE-LGPLLR.txt](../vendor/lefff/LICENSE-LGPLLR.txt), byte-for-byte identical to the archive's
`package/dist/LICENSE`. Do not confuse the package wrapper's Apache-2.0 label
with the data license. This project does not relicense the resource as AGPL.
The archived README retains its CC-BY-4.0 notice; the archive preserves all
upstream notices and files verbatim.

## Modifications by VerbeFlow — 2026-11-03

These derived linguistic resources remain under **LGPLLR**:

- `data/lefff/pilot.json`: filtered five-tense forms, losslessly encoded as
  explicit verb-to-template assignments. Source `NA` values become null.
- `data/lefff/audit.json`: comparisons, source forms, rejected records and gaps.
- `data/lefff/review.json`: explicit editorial decisions about variants.
- `src/data/lefff-variants.js`: approved variant forms and usage notes.
- `src/data/lefff-reference.js`: generated runtime reference resource.

No auxiliary, grammatical group, translation or example is inferred. Template
boundaries are compression, not a linguistic stem or ending analysis. A
rejected record is not a claim that the verb does not exist.

Original VerbeFlow tooling is AGPL-3.0-only. Complete machine-readable source is
supplied in the archive; transformation scripts and editable review decisions
are supplied in this repository. `npm run import:lefff` reproduces the derived
files offline with Node.js, without installing dependencies.
`npm run check:lefff` checks integrity, exact reconstruction and reproducibility.

Redistribution must retain the resource license, notices and access to the
corresponding resource source and modifications as the license requires. This
repository supplies these together: archive, editable review inputs and scripts.

The upstream package is deprecated and RosaeNLG is archived. A checksum pins
the release; it does not guarantee linguistic quality. Only complete simple paradigms enter a clearly labeled reference view; partial
paradigms stay quarantined. Independent human review remains pending. Twenty-one
cross-checked variants also extend search for two existing learning entries.
