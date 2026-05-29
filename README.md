# Anagnosis

> A research prototype for AI-mediated seeing of Western Old-Master painting.

Anagnosis (Greek ἀνάγνωσις, *recognition*) is the western-comparative branch of the locked PhD application arc:

- `tarot_local_test` → oracular mediation
- `zhouyi` → textual-divinatory mediation
- `anagnosis` → companional visual mediation

Its job is not to act like an art historian with final answers. It turns Patrick de Rynck's twelve recurring reading moves into a companion workflow so we can study how interpretation is mediated.

## Current state (v0.2)

- Forked from `rupainting`; package, branding, and prompts switched.
- Methodology anchored in De Rynck (primary) + Panofsky + Baxandall (supplementary). Twelve reading lenses (L01–L12) operationalized in `src/data/de_rynck_lenses.json`.
- Schema refactored for western painting: `artist` is inlined per-painting; the corpus has `corpus_meta` + `anchor` rather than a single top-level artist; new fields cover `source_text`, `iconographic_ids`, `cultural_framing_box`, `departure_from_source`, `patron_commission`, `painter_innovation`, `political_subtext`.
- Seed corpus of **12 Western Old-Master paintings (c.1310 – 1814)** drawn from De Rynck's book, with English-language commentary on every entry.
- Painting images downloaded from Wikimedia Commons (public domain) at 1280-px width into `public/paintings/anagnosis/`.

## Key files

- `src/data/de_rynck_lenses.json` → 12 operational reading lenses
- `src/data/paintings_data.json` → 12-painting seed corpus
- `src/lib/llm/prompts.ts` → structured interpretation prompt (Anagnosis methodology, English output)
- `src/lib/spirit/prompts.ts` → multi-turn companion guide prompt
- `docs/methodology.md` → methodology memo
- `PROGRESS.md` → cross-session handoff state

## Next step

Run `npm install` then `npm run dev` to smoke-test the new corpus and the prompt stack against DeepSeek + Gemini.
