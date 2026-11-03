# Publishing VerbeFlow to the Chrome Web Store

The GitHub release is a manual installation download. A store listing would
make installation and future updates easier for ordinary Chrome users.
Start with a small unlisted test before making the listing public.

## Before submission

- Test the published extension ZIP in a clean Chrome profile. Check search,
  saved verbs, six-tense learning entries, five-tense reference entries,
  French voice availability, manual themes and permission-denied Auto behavior.
- Keep listing claims precise: 7,776 offline verbs does not mean that every
  entry has six tenses, English meanings or bilingual examples. The imported
  reference library still needs independent human linguistic review.
- Prepare screenshots of the actual panel, a 128×128 PNG icon, a short
  description, support link and public privacy policy. Follow Google's current
  [image requirements](https://developer.chrome.com/docs/webstore/images).
- Review [the privacy policy](PRIVACY.md) against the final submitted version.
  A public URL is available after pushing it:
  https://github.com/zunaaaaayed/VerbeFlow/blob/main/docs/PRIVACY.md

## Submit, step by step

1. Choose the Google account that will own the listing. Enable two-step
   verification and complete [developer registration](https://developer.chrome.com/docs/webstore/register/),
   including the one-time fee and any account verification Google requests.
2. Open the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
3. Choose **Add new item**, select **VerbeFlow-0.2.0.zip** from the GitHub
   release, and upload it. Use the extension ZIP, not the source ZIP. Its manifest
   is already at the ZIP root, as Google requires.
4. Complete the store listing: name, description, language, category, icon,
   screenshots and support details. Use the 110 learning / 7,666 reference split.
5. Complete **Privacy practices**, including the single purpose, every permission
   justification, remote-code declaration and data-use disclosures. Disclose
   local screenshot processing accurately; do not assume that no server upload
   means that no website content is accessed or processed.
6. Add the privacy policy URL. Confirm that the disclosures match both the
   policy and extension behavior.
7. Complete distribution and account/trader fields requested by the dashboard.
   Choose **Unlisted** for a small initial test, if appropriate.
8. Submit for review. Address Google's feedback. Once approved, publish according
   to your dashboard's chosen publication setting. Review time varies.
9. For subsequent updates, increment the manifest version, create the new ZIP,
   upload it to the same store item and submit that update for review.

## Permission explanations to adapt

- `sidePanel`: displays the French verb learning/reference interface beside the page.
- `storage`: saves the chosen verb, tense, theme and at most ten bookmarked verbs locally.
- `tts`: reads the displayed French learning example with a French voice.
- `activeTab`: enables temporary access for local light/dark classification after
  the user clicks the toolbar action.
- Optional `<all_urls>`: lets the explicitly enabled Auto appearance feature
  classify the visible active tab across websites. Screenshots stay local and
  are discarded. Manual appearance requires no screenshot sampling.
- Remote code: none. All JavaScript, fonts and conjugation data are packaged.

Keep explanations factual. Google decides whether permissions are justified;
its approval is not guaranteed. Consider simplifying automatic appearance if
this permission proves disproportionate to the learning purpose during review.

Official guides: [prepare the ZIP](https://developer.chrome.com/docs/webstore/prepare),
[publish](https://developer.chrome.com/docs/webstore/publish/), and
[privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).

No Chrome Web Store account registration, payment, agreement acceptance or store
submission is performed by the GitHub release workflow.
