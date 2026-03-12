# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

This is an SXSW presentation built on **reveal.js** (v5.2.1), an open-source HTML presentation framework. The presentation content lives in `index.html`.

## Commands

- `npm install` — install dependencies (requires Node >= 18)
- `npm start` — dev server with live reload at localhost:8000
- `npm test` — ESLint + QUnit tests (headless Puppeteer)
- `npm run build` — build dist artifacts (JS, CSS, plugins)

Gulp tasks are also available directly: `gulp serve`, `gulp build`, `gulp test`, `gulp eslint`, `gulp qunit`.

## Architecture

reveal.js uses a **controller-based architecture**. The main `Deck` class (`js/reveal.js`) instantiates ~18 controllers (in `js/controllers/`), each managing a specific feature (keyboard, fragments, backgrounds, auto-animate, scroll view, etc.). Controllers implement `configure()`, `bind()`, `unbind()` patterns.

- **Entry point**: `js/index.js` — exports Reveal class + singleton wrapper for backward compatibility
- **Config**: `js/config.js` — ~300 configuration options
- **Utilities**: `js/utils/` — DOM helpers, constants, device detection, color, loader
- **Plugins** (`/plugin/`): highlight, markdown, notes, search, zoom, math — each built as UMD + ESM
- **Themes** (`/css/theme/source/`): SCSS files compiled to `/dist/theme/`
- **Build**: Gulp 5 + Rollup 4 + Babel 7 + Sass; outputs UMD and ESM bundles to `/dist/`

## Code Style

- **Tabs** for indentation, **single quotes** for strings
- ESLint enforces strict equality (`===`), no `caller`, no `eq-null`
- Follow existing patterns in the codebase

## Presentation Content

The actual presentation is authored in `index.html` using reveal.js HTML slide markup. Slides are `<section>` elements inside `.slides`. Nested `<section>` elements create vertical slide stacks. Key data attributes: `data-background-*`, `data-transition`, `data-auto-animate`, `data-fragment-index`.

## reveal.js Layout Helpers

reveal.js provides built-in CSS helper classes for sizing content within slides:

- **`r-stretch`** — Makes an element expand to fill the remaining vertical space on a slide. Useful for images, videos, or containers that should use all available room after accounting for other slide content (titles, captions, etc.). Only one `r-stretch` element per slide.
- **`r-fit-text`** — Dynamically scales text to be as large as possible without overflowing the slide. Powered by the fitty library. Can be used on multiple headings per slide.

Reference: https://revealjs.com/layout/
