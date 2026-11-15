# Public Agent Field Guide Implementation Plan

> **REQUIRED SUB-SKILL:** Use the executing-plans skill to implement this plan task-by-task.

**Goal:** Publish an accessible Russian-language introduction to Andrei's agent setup for a non-developer IT-company leader and other interested readers.

**Architecture:** A standalone static article, served directly by GitHub Pages from the main branch. Native HTML details, responsive CSS diagrams and anchor navigation; no application backend, tracking, third-party runtime requests, or client-side JavaScript. Only this repository's reviewed public content is published.

**Tech Stack:** HTML5, CSS, self-hosted Golos Text (OFL), Python static server, Playwright and axe for development tests, GitHub Pages.

---

## Approved scope and editorial constraints

Audience already asks ChatGPT to build CRM pages. Explain model vs harness vs web UI without claiming browsers cannot be agentic. Cover local projects, provider portability, subscriptions with eligibility caveats, Pi extensions and mobile-device testing, experimental DeepSeek Harness, skills vs executable tools, SDD via Superpowers, interview-first prompting inspired by Karpathy (not a fabricated quotation), Herdr, Hermes/OpenClaw, persistent memory vs retraining, Telegram and custom MAX connectors, home computer vs VPS network risks, internal company assistants, everyday use and safe damaged-disk handling. No private hostnames, addresses, identities, credentials, customer examples, or operational configs. Independent model hosting and local agent execution must remain distinct.

## Design

Palette: paper #ffffff, mist #edf3fa, ink #192d45, blue #2457c5, muted #52647a, teal #12645b. Golos Text for Cyrillic readability; locally hosted. Left-aligned reading column with a desktop sticky contents rail; compact native disclosure navigation on phones. A single memorable visual is an editorial route from chat to a company assistant, with stages matching the actual learning progression. No gradients, autoplay motion, generic SaaS card grid, external fonts or analytics. Aim for readable line lengths and keyboard-visible controls. Review mobile and desktop screenshots before publishing.

### Task 1: Write failing acceptance tests

**TDD scenario:** New feature — full TDD cycle.

**Files:** Create `package.json`, `playwright.config.js`, `tests/site.spec.js`, `.gitignore`.

1. Install dev-only `@playwright/test` and `@axe-core/playwright`; pin resolved versions with `package-lock.json`.
2. Tests: Russian document and metadata; required article sections and source links; unique IDs and valid fragment targets; no private-data patterns; accessible disclosures; no horizontal overflow at 360, 390, 768, 1440 pixels; zero critical/serious axe findings; no runtime third-party requests.
3. Run `npm test` against absent `index.html`; confirm expected missing-page failures before implementation.

### Task 2: Build the static article

**TDD scenario:** Implement the tested new page.

**Files:** Create `index.html`, `styles.css`, `assets/favicon.svg`, `assets/fonts/*`, `.nojekyll`, `README.md`.

1. Write the approved public article with accurate source links, caveats, semantic section headings, and visible examples.
2. Build responsive diagrams and route navigation with HTML/CSS, using native details for optional depth.
3. Self-host font files and include upstream license. Ensure there are no external runtime requests.
4. Run `npm test`; inspect screenshots from the mobile and desktop acceptance tests.
5. Fix only observed issues; back up existing files before targeted edits.

### Task 3: Verify and prepare publication

**Files:** `.gitignore`, `README.md`, all public assets.

1. Run `npm test`, `git diff --check`, and an explicit source/privacy review.
2. Check external URLs with GET requests; report challenges/rate limits separately instead of treating those as proof of broken links.
3. Confirm only intended source, tests, public documentation and fonts enter Git. Ignore backups and test artifacts.
4. Commit verified files on `feat/public-guide`, create `main` at the verified commit for publication.

### Task 4: Publish and verify GitHub Pages

1. Create public repository `Rival/agent-field-guide` with the reviewed standalone project only. Never copy or publish the surrounding agents-system directory.
2. Push `main`, enable GitHub Pages from branch `main`, root `/`.
3. Poll the Pages build; then GET the public URL and check the title and stylesheet/font paths using the project subpath.
4. Run browser acceptance checks against the deployed URL.
5. Report the page URL, repository URL, local directory and actual verification result. If publication is blocked, report the precise blocker and do not claim a public URL works.
