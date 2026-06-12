# Amplitude API & Integration Ecosystem — Cheat Sheet

An interactive, Amplitude-branded reference for how data moves **in and out** of Amplitude — built for Product Managers and Engineers.

**Live view:** open `project/index.html` in a browser, or enable GitHub Pages (see below).

## What's inside

- **Hub overview** — the "data in → Amplitude → data out" mental model
- **Live search + direction filters** (↓ In / ↑ Out / ⇄ Both) across every API and partner
- **Quick Reference** + Sections 1–6 and **3b (bidirectional partners)**
- **5 API drill-downs** with syntax-highlighted request/response samples
- Comparison + decision tables, sticky section nav, print-friendly layout
- **Mobile responsive** — works on phones and tablets

## Project structure

```
project/
  index.html                              # entry point (GitHub Pages serves this)
  Amplitude Integrations Cheat Sheet.html # same content, descriptive filename
  cheatsheet-data.js                      # quick-reference data
  cheatsheet-sections.js                  # all section content
  cheatsheet-app.js                       # rendering, search/filter, syntax highlighting
  assets/
    colors_and_type.css                   # Amplitude design tokens
    fonts/                                # Gellix (brand typeface)
    logo_amplitude_*.svg                  # brand logos
```

## Run locally

No build step. Either open `project/index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000/project/
```

## Publish with GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. Your site goes live at `https://<username>.github.io/<repo>/project/`.

---

*Brand styling follows the Amplitude design system. Usage rankings and example data are point-in-time and sourced from the originating cheat-sheet document.*
