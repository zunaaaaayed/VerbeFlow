# Website audit and verification — 15 November 2026

Baseline: clean main branch, vanilla Manifest V3 side-panel extension, no popup,
no framework or npm dependencies. Existing Node data/behavior tests and Python
release tests passed (42 + 3). The pure engine imports no Chrome APIs; UI,
storage, speech and page-theme modules are deliberately not reused on the site.
Existing logo/fonts and licensing notices are reused. There is no documented
Chrome Web Store listing, so installation links point to GitHub instructions.
GitHub public repository metadata reports has_pages=false. No Pages setting,
remote branch, commit or deployment was changed.

Implementation: dedicated feature/website-verbe-flow-pro branch. Static HTML,
CSS and ES modules avoid an unnecessary framework/build dependency. Build copies
pure engine dependencies into the independent website output. Production paths
are exercised by serving dist with a VerbeFlow subdirectory; the Pages workflow
uploads that directory's contents to the project site root. The workflow is
manual-only. Extension modules, manifest, package scripts and existing release
workflow are unchanged.

Automated: three website tests cover accents, ambiguity, exact tense selection,
unsupported input, reference compound restrictions, learning examples, built
asset paths, fragment navigation and unconfigured signup. All 45 existing tests
still pass. Production build succeeds without installing dependencies.

Native Chrome local preview: visually inspected desktop, iPhone 16 emulation
(393×852), and iPad Mini emulation (768×1024). The demo resolved j’avais to avoir
in imparfait with the matching example. Screenshot files are stored locally in
ignored website/screenshots/; they include browser chrome and are not publication
assets. No website JS errors were observed; the installed browser profile emitted
a Datadog warning from another extension's content script. This is not a clean
profile test. No Lighthouse score, automated overflow measurement, complete
keyboard audit, real mobile-device or cross-browser verification is claimed.
DevTools console pasting was blocked by its safety prompt; that protection was
left intact. Further automated layout measurements were not performed.

Manual release gates: review text/design, inspect mobile navigation and all demo
states in a clean profile, run Lighthouse, select/review a signup provider if
wanted, then explicitly authorize commit/push and enable Pages. Pro is only a
proposal. No payments, accounts, premium restrictions, analytics or email
collection are implemented. Do not describe the site as deployed yet.
