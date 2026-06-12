# Amplitude API & Integration Ecosystem — Cheat Sheet

An interactive, Amplitude-branded reference for how data moves **in and out** of Amplitude — built for Product Managers and Engineers. Created by Yi Shiean as a quick reference for internal teams in technical conversations with PMs and Engineers.

**Live view:** open `index.html` in a browser, or enable GitHub Pages (see below).

## What's inside

- **Hub overview** — the "data in → Amplitude → data out" mental model
- **Live search + direction filters** (↓ In / ↑ Out / ⇄ Both) across every API and partner
- **Quick Reference** + Sections 1–6 and **3b (bidirectional partners)**
- **5 API drill-downs** with syntax-highlighted request/response samples
- Comparison + decision tables, sticky section nav, scroll-to-top button, print-friendly layout
- **Mobile responsive** — card-style tables, stacked toolbar, works on phones and tablets

## File structure

```
index.html                              # ✅ MAIN entry point — use this one
cheatsheet-data.js                      # quick-reference card data
cheatsheet-sections.js                  # all section content
cheatsheet-app.js                       # rendering, search/filter, syntax highlighting
assets/
  colors_and_type.css                   # Amplitude design tokens
  fonts/                                # Gellix (brand typeface)
  logo_amplitude_*.svg                  # brand logos
chats/                                  # original Claude Design chat transcripts (handoff context)
project/
  index.html                            # ⚠️ original Claude Design prototype — DO NOT edit
  Amplitude Integrations Cheat Sheet.html  # same prototype, descriptive filename
  cheatsheet-*.js                       # prototype JS (not in sync with root versions)
  assets/                               # prototype assets
```

### Root vs. `project/` — what's the difference?

The `project/` folder is the **original design handoff** exported from Claude Design (claude.ai/design). It was the starting point and is kept for reference only.

The **root-level `index.html`** is the live, developed version. It adds everything built after the handoff:
- Full mobile responsive layout (tablet ≤980px and mobile ≤640px breakpoints)
- Card-style table layout on mobile with hidden low-value columns
- Scroll-to-top button (fixed, animated)
- "Created by Yi Shiean" byline in the topbar
- Updated hub description text and P/S note
- Various bug fixes and QA polish

**Always work on and serve the root `index.html`.** The `project/` folder is frozen and should not be edited.

## Run locally

No build step. Open `index.html` directly, or serve the repo root:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Publish with GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. Your site goes live at `https://<username>.github.io/<repo>/`.

## Notes

- Does not currently include Statsig documentation.
- Usage rankings and example data are point-in-time, sourced from Amp-on-Amp data.
- Brand styling follows the Amplitude design system.
