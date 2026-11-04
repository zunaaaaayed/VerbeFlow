<p align="center">
  <img src="assets/brand/verbeflow-128.png" alt="VerbeFlow logo: a book-shaped V with an orange flowing stroke" width="112" height="112">
</p>

<h1 align="center">VerbeFlow</h1>
<p align="center"><strong>A little French, every day.</strong></p>

French verbs have a lot of outfits. VerbeFlow helps you recognise them.

Keep it beside your favourite webpage, look up a verb, and explore its conjugations, clear explanations, and French–English examples. The endings stand out in orange, so the little changes are easier to spot.

You get **7,776 verbs offline**: **110 learning entries** with six tenses and **660 bilingual examples**, plus **7,666 reference entries** with five simple tenses. Save up to **10 favourites**, listen to French pronunciation with an available French voice, and switch between a cosy light theme and a charcoal dark theme.

Enjoying your little French companion? [Give VerbeFlow a star on GitHub](https://github.com/zunaaaaayed/VerbeFlow) ⭐ It helps other learners find it!

## Find your way around

New here? Start with installation. Already settled in? Jump straight to the verbs.

- [Install VerbeFlow](#install-it-one-click-at-a-time)
- [Check browser compatibility](#which-browsers-can-join-the-party)
- [Install with the terminal — macOS, Windows or Linux](#feeling-techie-take-the-terminal-route)
- [Find a verb](#find-a-verb)
- [Save your favourites](#keep-your-favourites)
- [Switch light and dark mode](#choose-your-lighting)
- [Listen to French pronunciation](#hear-a-little-french)
- [Update VerbeFlow or get help](#updates-and-little-hiccups)
- [Explore the sources and artwork](#where-the-words-and-artwork-come-from)
- [Read about privacy](#privacy)
- [Read the legal details](#legal)

## Install it, one click at a time

You’ll need a **desktop browser with extension side panels**, on **Windows, macOS, or Linux**. These steps are for the downloadable version, which you add to your browser yourself.

### Which browsers can join the party?

**Chrome** is the browser used for VerbeFlow’s hands-on checks so far. Use an up-to-date version; this release needs Chrome 116 or newer.

**Microsoft Edge, Brave, Vivaldi, and desktop Chromium** are also candidates, provided their current version supports extension side panels. [Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/sidebar) and [Vivaldi](https://help.vivaldi.com/developers/web/vivaldi-web-panels-for-web-developers/) document that support; [Brave’s extension side-panel work](https://github.com/brave/brave-browser/issues/31328) is recorded in its browser project. VerbeFlow has not yet been tested end to end in those browsers, and French voices or automatic appearance detection may behave differently.

Sharing the Chromium family tree does not guarantee every browser has the same features. **Opera and other Chromium browsers are not confirmed for this release.** A regular browser sidebar is not always the same as an extension side panel. This version is not intended for Firefox, Safari, or mobile browsers.

In the installation steps, use the Extensions page for your browser:

- **Chrome or Chromium:** type **chrome://extensions** in the address bar.
- **Microsoft Edge:** type **edge://extensions**.
- **Brave:** type **brave://extensions**.
- **Vivaldi:** type **vivaldi://extensions**.

The steps below use Chrome’s button names. Other browsers may word things slightly differently.

### 1. Download VerbeFlow

1. Open the [latest VerbeFlow release](https://github.com/zunaaaaayed/VerbeFlow/releases/latest).
2. Scroll to **Assets** at the bottom of the release notes. Click **Assets** if the list is folded shut.
3. Click **VerbeFlow-0.2.0.zip**. This is the ready-to-install download.
4. Open your computer’s **Downloads** folder.

Choose the ZIP named **VerbeFlow**, followed by its version number. The files named **source** or **Source code** are the bigger project downloads for people who want to explore or change the code. You don’t need those to install the extension.

### 2. Unpack it and give it a home

1. Find **VerbeFlow-0.2.0.zip** in **Downloads**.
2. On a **Mac**, double-click it. A folder named **VerbeFlow-0.2.0** should appear beside it.
3. On **Windows**, right-click the ZIP, choose **Extract All**, keep the suggested new folder, then click **Extract**.
4. On **Linux**, right-click the ZIP, choose **Extract To** or **Extract**, and create a new folder named **VerbeFlow** as the destination. Avoid extracting loose files into Downloads.
5. Move the unpacked folder somewhere you’ll keep it, such as **Documents** or your **Home** folder. You can rename it **VerbeFlow** to keep things tidy.
6. Open that folder. You should see **README.md**, **manifest.json**, and an **assets** folder. If you see another folder instead, open it until you find **manifest.json**.
7. Keep this folder in its new home after installation. Your browser will continue using the files inside it.

### 3. Add it to your browser

1. Open your chosen browser.
2. Click the address bar, enter your browser’s **Extensions page** from the list above, and press **Enter**.
3. Turn on **Developer mode** in the top-right corner. That’s just Chrome’s name for this setting; you won’t need to write any code.
4. Click **Load unpacked**, which appears near the top-left corner.
5. Choose the unpacked **VerbeFlow** folder from step 2. Choose the folder that contains **manifest.json**, rather than the ZIP file or the assets folder.
6. Click **Select Folder**, **Select**, or **Open**, depending on your computer.
7. Look for a **VerbeFlow** card in the Extensions page. Keep its on/off switch turned on.

### 4. Put it within easy reach

1. Click your browser’s **Extensions** button near the address bar. In Chrome, it looks like a puzzle piece.
2. Find **VerbeFlow** in the list.
3. Click the **pin** beside it, or choose your browser’s **Show in toolbar** option. The VerbeFlow logo should now stay beside the address bar.
4. Click that logo. VerbeFlow opens in a **side panel**, beside your webpage. Bonjour, verbs!

## Feeling techie? Take the terminal route

Prefer a few commands to a ZIP file? This route downloads VerbeFlow with Git on all three operating systems. Start with a compatible browser already installed. Your browser will ask you to approve the extension after the download. We’ll finish with a few clicks.

If `git --version` already works, skip the Git installation step for your system. These commands assume you don’t already have a folder named **VerbeFlow** in your home folder. If you do, use the update command below instead, or choose a different folder name.

### macOS — Terminal

1. Open **Terminal** from Applications → Utilities.
2. If Git is missing, run this command, complete Apple’s installation window, then reopen Terminal:

   ```sh
   xcode-select --install
   ```

3. Download VerbeFlow and show the folder you’ll select in your browser:

   ```sh
   git clone https://github.com/zunaaaaayed/VerbeFlow.git "$HOME/VerbeFlow"
   cd "$HOME/VerbeFlow"
   pwd
   ```

### Windows — PowerShell

1. Open **PowerShell** from the Start menu.
2. If Git is missing, run:

   ```powershell
   winget install --id Git.Git -e --source winget
   ```

   Follow the installer, then close and reopen PowerShell. If `winget` is unavailable, use the [Git for Windows installer](https://git-scm.com/install/windows).

3. Download VerbeFlow and show its folder:

   ```powershell
   git clone https://github.com/zunaaaaayed/VerbeFlow.git "$HOME\VerbeFlow"
   Set-Location "$HOME\VerbeFlow"
   (Get-Location).Path
   ```

### Linux — Terminal

1. Open your desktop’s **Terminal**.
2. If Git is missing, use **one** installation command that matches your distribution:

   **Ubuntu / Debian:**

   ```sh
   sudo apt-get update
   sudo apt-get install git
   ```

   **Fedora:**

   ```sh
   sudo dnf install git
   ```

   **Arch Linux:**

   ```sh
   sudo pacman -S git
   ```

   For another distribution, follow [Git’s Linux installation guide](https://git-scm.com/install/linux).

3. Download VerbeFlow and show its folder:

   ```sh
   git clone https://github.com/zunaaaaayed/VerbeFlow.git "$HOME/VerbeFlow"
   cd "$HOME/VerbeFlow"
   pwd
   ```

### Finish in your browser — same idea on all three systems

1. Open your browser’s **Extensions page**, using the address listed above.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the **VerbeFlow** folder printed by your terminal. It lives in your home folder and contains **manifest.json**. Use this Git folder, rather than a folder from a separate ZIP download.
5. Pin the extension and click its logo to open the side panel.

That’s the whole setup: no extra build or package installation is needed for VerbeFlow itself. Git installation options come from the [official Git guide](https://git-scm.com/install/).

To update a copy installed this way, close the side panel and run the following in Terminal or PowerShell:

```sh
git -C "$HOME/VerbeFlow" pull --ff-only
```

Then open your browser’s Extensions page and click VerbeFlow’s **reload arrow**. If Git reports local changes or a conflict, stop and keep your edits; the ZIP-update steps are intended for an unmodified download.

## Make yourself at home

### Find a verb

1. Click the search box.
2. Type an infinitive, such as **parler**, or a form you’ve spotted, such as **j’avais**.
3. Click the result you want. If several meanings, people, or tenses fit, choose the one you need.
4. Open **Explore a tense** and choose a tense.
5. Read the six forms, then scroll down for the explanation and a bilingual example.

The six tenses are présent, passé composé, imparfait, futur simple, conditionnel présent, and subjonctif présent. The learning collection includes regular verbs, irregular verbs, common reflexive verbs, and **falloir** and **pleuvoir**.

Results marked **reference** open a larger dictionary of conjugation tables. These entries have five simple tenses, with their source and review status shown. Their English meanings, teaching explanations and bilingual examples are still waiting for review. Choose passé composé and you’ll see why it is unavailable: we haven’t checked which auxiliary fits the verb’s meaning, so VerbeFlow won’t guess. The reference collection may omit valid alternative spellings and is not a promise to cover every French verb. For an h-initial reference form, **je / j’** means you should check whether that verb allows elision.

### Keep your favourites

1. Open a verb you’d like to practise again.
2. Click its **star**. It appears under **Saved verbs**.
3. Click a saved verb whenever you want to revisit it.
4. To remove one, open it and click its star again.

There’s room for **10 saved verbs**. When your shelf is full, remove one to make room for another.

### Choose your lighting

1. Click the **sun or moon** at the top of VerbeFlow to switch between light and dark mode.
2. Your choice stays selected when you change pages or reopen your browser.
3. Click **Auto**, beside the switch, to let VerbeFlow follow whether the current page is light or dark.
4. For this to work automatically across different websites, click **Enable automatic page detection** at the bottom of the panel and review Chrome’s permission request.
5. You can decline that request and keep using the manual switch. Where page detection is unavailable, Auto follows your browser’s light or dark preference.

Both modes use VerbeFlow’s own colours. Your webpage only helps choose which mode to show.

### Hear a little French

1. Open a verb and scroll down to **In a sentence**.
2. Click **Listen** to hear the French example.
3. If you see **French voice unavailable**, add a French voice in your computer’s speech settings, then close and reopen the panel.
4. On a **Mac**, open **System Settings**, go to **Accessibility**, and look for **Read & Speak**, **Spoken Content**, or the speech/voice settings. Use the voice list to add a French voice. The wording varies with your macOS version. [Apple’s voice guide](https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac) can help you find it.
5. On **Windows**, open **Settings**, go to **Time & language**, then **Speech**. Look for **Manage voices** or **Add voices**, and add French. If Windows asks you to download a speech pack, let it finish. [Microsoft’s voice guide](https://support.microsoft.com/en-us/accessibility/windows/narrator/appendix-a-supported-languages-and-voices) has more help.

On **Linux**, voice support depends on your browser build and distribution; there isn’t one voice-installation menu that works everywhere. Check your distribution’s speech/accessibility options for a French voice, restart your browser, and try Listen again. Some builds may not expose a French voice even when another app can speak French. Reading, searching, and saved verbs still work when Listen is unavailable.

VerbeFlow uses an available French voice. Pronunciation and offline playback depend on the voices your browser can access.

## Updates and little hiccups

### Install an update

1. Download and unpack a fresh copy using the steps above.
2. Close the VerbeFlow side panel.
3. Copy the contents of the new unpacked folder into the **same VerbeFlow folder you originally installed**. If your computer asks, replace the old files.
4. Open your browser’s **Extensions page** from the list above.
5. Find the VerbeFlow card and click its **circular reload arrow**.
6. Click the VerbeFlow toolbar logo to reopen it.

Keeping the same folder helps keep the same extension and its saved choices. Removing the extension from your browser can remove those saved choices too.

### Can’t find it?

- **No toolbar logo?** Click the puzzle-piece icon and pin VerbeFlow.
- **Your browser says a file is missing?** Unpack the ZIP first, then choose the folder containing **manifest.json**.
- **The panel won’t open?** Visit a regular webpage, check that VerbeFlow is turned on in your browser’s **Extensions page**, then click its toolbar logo again.
- **Two VerbeFlow entries?** Keep the copy you want to use. Each copy may have its own saved verbs; removing a copy can delete its saved choices.
- **A verb is missing?** Try a shorter search, such as **parl**, or a common infinitive. VerbeFlow won’t make up forms for a verb outside its collection.

## Where the words and artwork come from

The 110 learning entries’ verb forms and explanations were written for VerbeFlow and checked against [Le Conjugueur](https://leconjugueur.lefigaro.fr/), with additional checks using [Larousse](https://www.larousse.fr/conjugaison/) and the [Dictionnaire de l’Académie française](https://www.dictionnaire-academie.fr/). Their recorded reference-check date is **3 November 2026**.

The French–English examples were written for this project and reviewed with help from Codex. A separate human language review is still pending. VerbeFlow is a learning companion; a trusted dictionary or teacher remains useful for tricky meanings and agreement.

Search also recognises checked alternatives such as **je paye** and **je puis**. These variants come from the openly licensed **Lefff** language resource, packaged by **Ludan Stoecklé / RosaeNLG**, and were checked against the linked dictionary references. The main tables keep their usual spellings and explain the alternatives. The larger reference collection also comes from Lefff. It has been checked for complete tables and imported without changing its spellings; it has not had an independent human language review. Reference entries are clearly marked so you can tell them apart from the fuller learning entries.

The book-shaped V logo was created with OpenAI’s image-generation tool. The typefaces are **Cormorant Garamond**, **Instrument Serif**, and **Lora**, supplied through [Google Fonts](https://fonts.google.com/). Their original license and credit notices are included with the project. The Z in the footer is the creator’s own supplied logo.

## Privacy

Your selected verb, tense, theme, and saved verbs stay in Chrome on your computer. VerbeFlow has no account system or analytics service.

When automatic page detection is active, VerbeFlow briefly processes a small screenshot of the visible page on your computer to decide whether it is light or dark. Those screenshots are not saved or sent anywhere. Manual light/dark mode does not sample the page. Chrome asks for additional website access before automatic detection can follow you across sites. You can review or revoke that access through Chrome’s extension settings.

French speech is provided by the voices available on your computer or in Chrome. A voice provider’s own connectivity and privacy behaviour may vary.

You can read the [full privacy policy](https://github.com/zunaaaaayed/VerbeFlow/blob/main/docs/PRIVACY.md) for more detail.

## Legal

Copyright © 2026 Md Zunayedul Islam.

VerbeFlow’s original source code and documentation are licensed under the **GNU Affero General Public License, version 3 only (AGPL-3.0-only)**. Any copyright interests held by the contributors in the original project artwork are offered under the same license. The complete terms are in [LICENSE](LICENSE); attribution and third-party notices are in [NOTICE](NOTICE).

The license permits use, modification, and redistribution, including commercial use, subject to its terms. Distribution of covered works requires compliance with its corresponding-source and license obligations. If a modified version supports remote interaction over a computer network, section 13 requires an appropriate offer of its Corresponding Source to those users. This summary does not replace the license text.

The bundled fonts remain under the **SIL Open Font License 1.1**, with their own copyright and reserved-name notices: [Cormorant Garamond](assets/fonts/CormorantGaramond-OFL.txt), [Instrument Serif](assets/fonts/InstrumentSerif-OFL.txt), and [Lora](assets/fonts/Lora-OFL.txt). They are not relicensed under the project’s AGPL license.

The bundled Lefff linguistic resource and derived variant data retain the **Lesser General Public License for Linguistic Resources (LGPLLR)**. Their [full license](vendor/lefff/LICENSE-LGPLLR.txt), [attribution and modification notice](docs/LEFFF_SOURCE.md), and original source archive accompany this repository. They are not relicensed under AGPL.

References to dictionaries, Chrome, Google Fonts, and other third parties do not imply affiliation, sponsorship, or endorsement. Third-party material and marks remain subject to their applicable rights. No trademark or endorsement rights are granted by this project’s license notice.

VerbeFlow is provided **without warranty**, including without any warranty of linguistic accuracy, merchantability, or fitness for a particular purpose, to the extent permitted by applicable law. The limitations of liability in the license apply to the extent permitted by applicable law. See sections 15 and 16 of [LICENSE](LICENSE).

---

<p align="center">Built with ♡ by <a href="https://zunaaaaayed.github.io">Zunayed</a></p>
