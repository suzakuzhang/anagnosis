# Anagnosis

> A research prototype for AI-mediated seeing of Western Old-Master painting.

**Live demo:** https://anagnosis.onrender.com *(English interface)*

Anagnosis (Greek ἀνάγνωσις, *recognition*) is the Western-comparative member of a family of prototypes on AI-mediated interpretation:

| Project | Domain |
|---|---|
| [`tarot_local_test`](https://github.com/suzakuzhang/tarot_local_test) | oracular mediation (tarot) |
| [`zhouyi`](https://github.com/suzakuzhang/zhouyi) | textual-divinatory mediation (*Yijing*) |
| [`rupainting`](https://github.com/suzakuzhang/rupainting) | companional visual mediation (Chinese painting) |
| **`anagnosis`** | companional visual mediation (Western Old-Master painting) |

Its job is not to act like an art historian handing down final answers. It turns Patrick de Rynck's twelve recurring reading moves into a companion workflow, so we can study how interpretation is *mediated* rather than simply delivered.

## What it does

- Operationalizes **twelve reading lenses (L01–L12)** derived from De Rynck (primary), with Panofsky and Baxandall as supplementary frames, defined in `src/data/de_rynck_lenses.json`.
- Reads against a seed corpus of **12 Western Old-Master paintings (c. 1310 – 1814)** drawn from De Rynck's book, each with English-language commentary.
- Produces a structured interpretation and an optional multi-turn companion dialogue, mirroring the structured-reading + guide-dialogue pattern of its sibling `rupainting`.

The painting schema is built for Western works: per-painting `artist`, a `corpus_meta` + `anchor` corpus structure, and fields covering `source_text`, `iconographic_ids`, `cultural_framing_box`, `departure_from_source`, `patron_commission`, `painter_innovation`, and `political_subtext`. Painting images are public-domain reproductions from Wikimedia Commons (1280-px width, in `public/paintings/anagnosis/`).

## Tech stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS**
- **DeepSeek** — structured interpretation (English output)
- **Gemini** — multi-turn companion-guide dialogue
- Forked from `rupainting`; package, branding, and prompts switched for the Western corpus.

## Key files

- `src/data/de_rynck_lenses.json` — the 12 operational reading lenses
- `src/data/paintings_data.json` — the 12-painting seed corpus
- `src/lib/llm/prompts.ts` — structured interpretation prompt (Anagnosis methodology)
- `src/lib/spirit/prompts.ts` — multi-turn companion-guide prompt
- `docs/methodology.md` — methodology memo

## Local development

Requires Node 18+.

```bash
npm install
npm run dev
```

Environment variables (read from the environment, never committed):

```bash
DEEPSEEK_API_KEY=...
GEMINI_API_KEY=...
PILOT_ADMIN_CODE=...
PILOT_ADMIN_BIRTH_DATE=...
```

`access_data.json` / `spirit_data.json` are runtime-local files listed in `.gitignore`.

## Reference

- Patrick de Rynck, *How to Read a Painting: Decoding, Understanding and Enjoying the Old Masters*.
- Erwin Panofsky; Michael Baxandall (supplementary frames).
- Sibling projects: [`tarot_local_test`](https://github.com/suzakuzhang/tarot_local_test), [`zhouyi`](https://github.com/suzakuzhang/zhouyi), [`rupainting`](https://github.com/suzakuzhang/rupainting).

## Author

Created by Shumin Zhang, as part of a research program on how AI systems mediate symbolic and visual interpretation. For citation or reuse, please credit the original repository and author.
