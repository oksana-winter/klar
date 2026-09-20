# KLAR.

**Understand the rules before you apply.**

KLAR. is an independent concept MVP for the Swiss rental market. It focuses on what happens after a renter has found a property: understanding known eligibility criteria, preparing the right dossier, tracking application status and keeping a visible record of personal-document disclosure.

**Live demo:** https://oksana-winter.github.io/klar/

## Product principle

The product separates three questions that are often blurred together:

1. **Eligibility** — does the household meet the known, published or verified criteria?
2. **Dossier readiness** — are the required documents complete and current?
3. **Provider selection** — the landlord or housing provider makes the final decision. KLAR. does not predict it.

## MVP flow

`Add property → Check eligibility → Resolve unknowns → Prepare dossier → Review sharing → Submit → Track`

The demo includes:

- property case creation
- transparent criteria with explicit provenance language
- `Unknown / Needs input / Not eligible` states
- reusable household dossier
- property-specific document requirements
- privacy-aware disclosure confirmation
- application status tracking
- archived decision history
- responsive desktop and mobile layouts
- keyboard focus states and non-color status cues

## Tech

- React 18
- TypeScript
- Vite
- responsive CSS
- GitHub Pages deployment via GitHub Actions

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Design direction

The visual language follows a **Calm Technology** principle: high legibility, restrained controls, quiet status language, progressive disclosure and low visual noise. The implementation is based on the KLAR. desktop and mobile hi-fi portfolio concept developed in Figma.

## Product boundary

KLAR. is deliberately **not**:

- a property marketplace
- a landlord scoring engine
- an acceptance-probability tool
- a source of unverified legal advice

It is a decision and application workspace that keeps eligibility, readiness and provider selection separate.

## Important note

This is an independent **concept / portfolio MVP**, not a legal eligibility service and not a production rental platform. Demo criteria and provider names are illustrative. Final eligibility and tenant selection remain with the relevant provider.
