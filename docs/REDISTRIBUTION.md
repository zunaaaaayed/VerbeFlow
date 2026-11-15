# Redistribution review — 15 November 2026

This review reads the bundled license texts and distribution scripts. It is not
an assurance about every possible future packaging or business arrangement.

## Project code: AGPL-3.0-only

Redistribution and charging for distribution are permitted. Preserve notices and
license text and provide Corresponding Source using a method the license permits
when conveying covered works. Modified network-interactive versions must comply
with section 13 where applicable. Charging for Pro does not make existing
AGPL-covered code proprietary or remove recipients' redistribution rights.
Do not assume paid access permits withholding covered source.

Reviewed: root LICENSE, especially sections 4–6 and 13, and NOTICE.
Official text: https://www.gnu.org/licenses/agpl-3.0.html

## Linguistic data: LGPLLR, not the wrapper's Apache label

The bundled french-verbs-lefff 3.4.0 README explicitly keeps the derived
conjugation JSON under LGPLLR. The original archive and license are retained.
Sections 1–2 permit verbatim and modified resource redistribution with notices,
license, modification notices/dates and resource share-alike obligations.
Section 4 permits combining it with an application under chosen terms subject
to its conditions, including appropriate access to corresponding resource
materials. It does not grant permission to relicense Lefff data as proprietary.

Reviewed: vendor/lefff/LICENSE-LGPLLR.txt, the pinned upstream archive README,
source.json, docs/LEFFF_SOURCE.md and scripts/package-release.py. The release
process provides an installer and separate full source ZIP with checksums;
keep both available together. The source includes the original archive,
editable review decisions, normalized resource and transformations.

The generated website includes the LGPLLR license, credit and source notices.
It should also provide a direct, prominent link to the corresponding source
repository containing the original resource and modifications. Do not strip
resource metadata or notices when optimizing assets or selling a future product.

## Bundled fonts: SIL OFL 1.1

The three font families have separate bundled OFL texts and copyright notices.
Unmodified fonts may be bundled and redistributed with this application,
including commercial bundles. Keep their licenses/notices and do not sell fonts
by themselves. Modified versions must respect Reserved Font Name conditions.
No font modifications are made here.

Reviewed: assets/fonts/*-OFL.txt.
Official FAQ: https://openfontlicense.org/ofl-faq/

## Artwork and limits

NOTICE offers any held copyright interests in original artwork under AGPL and
does not claim protection where none exists. Generated-logo copyright eligibility
and trademark rights are separate questions; this review does not establish
exclusive rights. Dictionary links are references, not permission to redistribute
those publishers' prose or datasets. No such reference-page archives are bundled.

## Distribution checks

Keep LICENSE, NOTICE, all font licenses, the Lefff license, attribution and access
to complete corresponding source. The existing packaging tests verify legal
files are retained; importer checks verify the original resource license and
archive integrity. Historical published releases keep their original code and
privacy behavior. New behavior requires a new release rather than silently
replacing a tagged archive.
