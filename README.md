# Pixel Rounds

A daily Step 1 case puzzle with a retro pixel-art doctor. Each day there's one new case. You start with one clue, and each wrong guess reveals the next. Solve it to earn XP and RVUs, level up through the career ladder from Pre-Med to Department Chair, and collect cosmetics in the Supply Closet.

Plain HTML, CSS, and JavaScript. No build step, no dependencies, no backend.

## Before you launch

Open `js/config.js` and set:

| Setting | What it does |
|---|---|
| `launchDate` | The date of Case #1 (`YYYY-MM-DD`). Set it to your public launch day so the first public case is #1. |
| `reportFormUrl` or `reportEmail` | Where "Report a problem" sends case reports. A Google Form link is easiest. If both are blank, the report is copied to the player's clipboard. |

Then open `index.html` and, after your first deploy, replace `/og.png` in the two image tags (`og:image` and `twitter:image`) with the full URL, like `https://your-domain.com/og.png`. Some apps only show link previews with a full URL.

## Project layout

```
index.html              Page shell, link-preview tags, analytics tag
css/style.css           All styles
js/config.js            Launch settings (edit this)
js/cases.js             Case bank, diagnosis list, daily schedule
js/cosmetics.js         Cosmetics, rarities, Supply Closet odds
js/avatar.js            Pixel doctor renderer
js/state.js             Save data, XP curve, titles, perks
js/main.js              Screens and game flow
sw.js                   Offline support for the installed app
manifest.webmanifest    Install-to-home-screen settings
icons/, og.png          App icons and link-preview image
fonts/                  Press Start 2P and VT323 (SIL Open Font License)
CASES_REVIEW.md         All cases in a readable checklist for review
tools/export-cases.js   Regenerates CASES_REVIEW.md from js/cases.js
```

## Editing cases

Cases live in `js/cases.js`. Each one has an answer, an organ system, optional aliases, 6 clues from vague to specific, and a pearl.

- After editing, run `node tools/export-cases.js` to refresh `CASES_REVIEW.md`.
- The daily order is shuffled from the full list. **Adding or removing cases changes the schedule for every future day.** Do it before launch, or add cases in batches and accept that upcoming days reshuffle. Editing the wording of an existing case is always safe.
- Wrong-answer options that aren't cases are in `PR.DECOYS`, grouped by system. A guess in the right system turns yellow.

## Running it locally

Use a local server, since the service worker and absolute paths need one:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Analytics

`index.html` includes the Vercel Web Analytics script. Turn it on in your Vercel project under **Analytics → Enable**. Page views start showing after the next deploy. Locally the script returns a 404, which is expected.

## Ads

There's a hidden placeholder in `index.html` (`<aside id="ad-slot">`). When you're approved by an ad network, paste their snippet there and remove `hidden`. Most networks require a privacy policy page first.

## Saves

Progress is stored in the player's browser (`localStorage`). Clearing site data or switching devices starts over. Cloud saves would need a backend such as Supabase.

## Disclaimer

Pixel Rounds is an independent study game. It is not affiliated with or endorsed by the USMLE®, the NBME®, or the FSMB®. Content is for education only and is not medical advice.
