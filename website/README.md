# VerbeFlow website

Static HTML/CSS/ES modules, no dependencies or backend. Existing extension modules
are copied unchanged during build; no Chrome APIs are imported by the website.
The extension and release packager remain independent.

## Local development and production-path preview

From the repository root, run `npm --prefix website test`, then
`npm --prefix website run build` and `npm --prefix website run preview`.
Open http://127.0.0.1:4173/VerbeFlow/ . Edit website source and rebuild to refresh.
Output lives in ignored `website/dist/`. Relative links work at /VerbeFlow/;
privacy uses a real privacy.html file, so refresh does not require SPA fallback.

## Deployment (requires owner approval)

No deployment has been run. In GitHub Settings → Pages, select GitHub Actions as
the source. After reviewing and explicitly authorizing a commit/push, run the
manual Deploy website to Pages workflow on the intended branch. It uploads the
contents of website/dist/VerbeFlow, so the project site root is /VerbeFlow/.
Ensure no other Pages workflow is publishing a competing site. The workflow
needs Pages enabled and approval of its github-pages environment if configured.

## Interest signup

The interest section currently collects nothing. To configure it, choose an HTTPS
hosted signup provider and review its terms, consent, unsubscribe and deletion
options. Put its public signup-page URL (never an API secret) in src/config.js as
WAITLIST_URL. Update privacy.html with provider identity, purpose, retention and
its privacy link. Rebuild, test external signup and deletion, and confirm provider
storage actually works before advertising signup as open. The site redirects to
the provider; it never handles email itself. No provider has been selected.

## Provenance and quality

Logo, fonts and pure engine are reused from the extension. Lefff-derived data
retains LGPLLR; font licenses and project source notices are copied into the
site. Corresponding source remains in the public repository once approved and
pushed. The hero is an illustrative HTML rendering of actual parler forms,
not a screenshot or a testimonial. No Chrome Web Store listing is documented;
installation CTAs point to the real GitHub instructions.

Run existing root checks as well as website tests before release. Tests validate
demo forms, ambiguity, restrictions, fragment links and built asset paths.
Lighthouse and cross-device screenshots need browser QA; no score is assumed.
See PRODUCT_STRATEGY.md for the proposed business validation gates.
