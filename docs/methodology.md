# Anagnosis Methodology

> v0 working memo for the western-comparative prototype
> Last updated: 2026-05-07

## One-sentence claim

Anagnosis uses an anchor-extended companion AI as a humanistic mediation device for studying how interpretation happens while looking at paintings.

## What this prototype is for

Anagnosis does not aim to produce specialist art-historical interpretations.

It is a research apparatus that turns a recognizable art-historical reading practice into a guided conversational structure, so we can inspect:

- how explanations are staged
- which evidence gets foregrounded
- how users are led from seeing to recognizing to contextualizing
- where AI overreaches beyond available evidence

## Primary anchor

Patrick de Rynck, *How to Read a Painting: Lessons from the Old Masters* (2004)

The key reason for choosing de Rynck is operational clarity: across many paintings, he repeatedly performs a compact set of interpretive moves that can be translated into reusable lenses.

## Supplementary anchors

### Panofsky

Used for vertical depth:

- pre-iconographical: what is visibly there
- iconographical: what story / figure / motif is being identified
- iconological: what broader worldview, ideology, or cultural pattern is being expressed

### Baxandall

Used for horizontal context:

- period eye
- social training of seeing
- patronage / commission
- material and display conditions

## Operational lenses

The current `de_rynck_lenses.json` encodes 12 recurring moves:

1. Source Text
2. Iconographic ID
3. Composition & Hierarchy
4. Patron & Commission
5. Departure from Source
6. Stylistic Genealogy
7. Material & Scale
8. Symbolic Detail
9. Cultural Framing Box
10. Painter's Innovation
11. Close Detail Observation
12. Political / Historical Subtext

These are not mutually exclusive categories. They are prompts for mediated looking.

## Output logic

The interpretation prompt currently organizes responses in seven layers:

1. First glance
2. Viewing path
3. Form and technique
4. Iconographic recognition
5. Symbol and cultural context
6. Historical / commissioned situation
7. Follow-up questions

This structure is meant to slow down premature interpretation and keep the AI tied to inspectable evidence.

## Boundaries

The prototype must not:

- invent provenance, attribution, or symbolism without support
- turn paintings into psychological or divinatory advice
- erase uncertainty when metadata is incomplete
- present itself as an art-historical authority

The prototype should:

- distinguish observation from inference
- point back to visible evidence
- admit when extra documentation would be needed
- help users understand how interpretation is assembled

## Current limitation

The repository still contains inherited corpus data from the earlier Chinese-painting prototype. That is acceptable for scaffold testing, but the next meaningful step is to replace it with a small western seed corpus aligned with the de Rynck anchor.
