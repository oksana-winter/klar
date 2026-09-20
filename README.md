# KLAR.

**Understand the rules before you apply.**

KLAR. is a concept MVP for the Swiss rental market. It focuses on what happens after a renter has found a property: understanding published eligibility criteria, preparing the right dossier, tracking application status and keeping a visible record of personal-document disclosure.

## Product principle

The product separates three questions that are often blurred together:

1. **Eligibility** — does the household meet the known, published criteria?
2. **Dossier readiness** — are the required documents complete and current?
3. **Provider selection** — the landlord or housing provider makes the final decision. KLAR. does not predict it.

## MVP flow

`Add property → Check eligibility → Resolve unknowns → Prepare dossier → Review sharing → Submit → Track`

The demo includes:

- property case creation
- transparent eligibility criteria
- explicit `Unknown / Needs input` states
- reusable household dossier
- property-specific document requirements
- privacy-aware disclosure review
- application status tracking
- responsive desktop and mobile layouts

## Tech

- React
- TypeScript
- Vite
- responsive CSS

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

Calm Technology: high legibility, restrained controls, quiet status language and progressive disclosure. The UI is based on the KLAR. portfolio concept developed in Figma.

## Important note

This is an independent **concept / portfolio MVP**, not a legal eligibility service and not a production rental platform. Demo criteria and provider names are illustrative. Eligibility is shown only as a result of known criteria in the concept; final eligibility and tenant selection remain with the relevant provider.
