# Anagnosis — Progress State

> Cross-session handoff file for the Anagnosis prototype.
> Last updated: 2026-05-07 (v0.2 corpus build complete)

## Positioning

Anagnosis is the western-comparative prototype in the locked RP arc:

- `tarot_local_test` = oracular mediation
- `zhouyi` = textual-divinatory mediation
- `anagnosis` = companional visual mediation

Its role is not to produce specialist art-historical interpretation, but to operationalize `anchor-extended companion AI` as a research apparatus for studying interpretation / mediation / AI-mediated seeing.

## Locked contribution fit

- A-layer contribution: Anagnosis as a critical AI humanities apparatus
- B-layer contribution: architecture later scales to larger cultural collections
- Feedback loop: prototype insight -> scaled archive deployment -> prototype refinement

## Current v0.2 status

### Done

| Item | Path | Status |
|---|---|---|
| Forked scaffold from `rupainting` | `/Users/zsm/Desktop/projects/anagnosis/` | ✅ created |
| Package rename | `package.json` | ✅ `anagnosis` |
| De Rynck anchor file | `src/data/de_rynck_lenses.json` | ✅ 12 lenses + Panofsky/Baxandall supplement |
| Interpretation prompt rewrite | `src/lib/llm/prompts.ts` | ✅ Anagnosis methodology, English output, new schema |
| Companion prompt rewrite | `src/lib/spirit/prompts.ts` | ✅ companion guide, English output, new schema |
| Core branding copy | `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/gallery/page.tsx` | ✅ user-facing wording aligned |
| Loading facts | `src/components/LoadingOverlay.tsx` | ✅ replaced with de Rynck / Panofsky / Baxandall facts |
| **Schema refactor** | `src/types/painting.ts` | ✅ `artist` inlined into `Painting`; corpus-level `corpus_meta` + `anchor`; western-painting fields (`source_text`, `iconographic_ids`, `cultural_framing_box`, `departure_from_source`, `patron_commission`, `painter_innovation`, `political_subtext`); renamed `brushwork_notes` → `form_and_technique`, `inscription` → `inscriptions_and_text`; dropped `seals_visible` |
| **Loader / API refactor** | `src/lib/data/paintings.ts`, `src/app/api/paintings/route.ts`, `src/app/api/paintings/[id]/route.ts`, `src/app/api/spirit/start/route.ts`, `src/app/api/spirit/chat/route.ts`, `src/app/api/interpret/route.ts`, `src/app/painting/[id]/page.tsx` | ✅ `getArtist()` removed; `painting.artist` accessed inline; `ViewContext` field names updated |
| **Anagnosis seed corpus (12 paintings)** | `src/data/paintings_data.json` + `data/paintings_data.json` (mirror) | ✅ schema_version 2; full English content from De Rynck PDF; covers c.1310 – 1814 across IT/NL/Flemish/Dutch/ES; lens-tagged |
| **Painting images (1280px JPEG, public-domain via Wikimedia Commons)** | `public/paintings/anagnosis/*.jpg` | ✅ 12 images, ~170KB–615KB each |

### Anagnosis seed corpus (12 paintings, 1310–1814)

| ID | Painting | Painter | Date | Collection |
|---|---|---|---|---|
| `giotto-ognissanti-madonna` | Ognissanti Madonna | Giotto | c.1310 | Uffizi |
| `van-eyck-canon-van-der-paele` | Madonna with Canon van der Paele | Jan van Eyck | 1436 | Groeningemuseum, Bruges |
| `witz-miraculous-draught-of-fishes` | The Miraculous Draught of Fishes | Konrad Witz | 1444 | Geneva |
| `botticelli-birth-of-venus` | The Birth of Venus | Botticelli | c.1485 | Uffizi |
| `bosch-garden-of-earthly-delights` | The Garden of Earthly Delights | Bosch | 1480–90 | Prado |
| `raphael-transfiguration` | The Transfiguration | Raphael | 1518–20 | Vatican |
| `bruegel-netherlandish-proverbs` | Netherlandish Proverbs | Bruegel | 1559 | Berlin Gemäldegalerie |
| `caravaggio-supper-at-emmaus` | The Supper at Emmaus | Caravaggio | 1601 | NG London |
| `velazquez-surrender-of-breda` | The Surrender of Breda | Velázquez | c.1635 | Prado |
| `rembrandt-night-watch` | The Night Watch | Rembrandt | 1642 | Rijksmuseum |
| `vermeer-milkmaid` | The Milkmaid | Vermeer | c.1658–60 | Rijksmuseum |
| `goya-third-of-may` | The Third of May 1808 | Goya | 1814 | Prado |

Lens coverage check: every one of the 12 De Rynck lenses (L01–L12) is invoked by ≥ 2 paintings in the corpus.

## Method anchor

Primary anchor:
- Patrick de Rynck, *How to Read a Painting: Lessons from the Old Masters* (Abrams, 2004)

Supplementary anchors:
- Erwin Panofsky: pre-iconographical / iconographical / iconological depth
- Michael Baxandall: period eye, commission, material and social context

Operationalized reading lenses (12, encoded in `de_rynck_lenses.json`):
- L01 Source Text
- L02 Iconographic ID
- L03 Composition & Hierarchy
- L04 Patron & Commission
- L05 Departure from Source
- L06 Stylistic Genealogy
- L07 Material & Scale
- L08 Symbolic Detail
- L09 Cultural Framing Box
- L10 Painter's Innovation
- L11 Close Detail Observation
- L12 Political / Historical Subtext

## Output language

The system prompts contain Chinese methodology framing (carried over from the early scaffold) but explicitly instruct the model to output in English when the corpus is in English. The Anagnosis seed corpus is entirely in English. AI replies — both in interpretation mode and in the companion-dialogue mode — should be in English.

If the prompts need to be fully English-language at a later stage (for example, for a public-facing demo to a Western reviewer pool), translate `METHODOLOGY_CORE`, `READING_BOUNDARIES`, `KEY_LENSES`, `SEVEN_LAYER_DEFINITION`, and the four `MODE_*` blocks in `src/lib/llm/prompts.ts`, plus `STYLE_HINT`, `KNOWLEDGE_HINT`, `buildSpiritSystemPrompt` in `src/lib/spirit/prompts.ts`. The English-output directive in each user prompt is already present.

## Immediate next tasks

1. `npm install` then `npm run dev` to smoke-test the new corpus end-to-end.
2. Audit `gallery/page.tsx` and `admin/page.tsx` for any remaining Chinese-painting copy in surface labels.
3. Optional: full-English translation of system prompts (see "Output language" above) before any externally shown demo.
4. If a 13th painting is wanted, candidates that would extend lens coverage are: a Renaissance portrait (e.g., Holbein, Darmstadt Madonna p.162) for L04 patronage; a Brueghel-Rubens Garden of Eden (p.230) for L06 stylistic.

## Research note

This prototype is explicitly framed as `mediation`, not `interface`.
The operative claim is not "AI explains paintings well", but "AI can be configured as a humanistic mediation device that makes interpretive operations inspectable."
