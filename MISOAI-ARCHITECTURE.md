# MisoAI Product Architecture

Last updated: 2026-06-24

MisoAI should become the calm companion at the centre of MisoCalm, not a generic chatbot. Its job is to help someone with misophonia feel understood, find regulation quickly, and return to the app's working tools without pressure.

## Product Shape

MisoAI has three primary modes:

1. Triggered now
   - Goal: reduce activation fast.
   - Response length: short.
   - First action: validate, then one body-based step.
   - Target start time: under 30 seconds.

2. Preparing for a sound
   - Goal: help the user enter a likely trigger situation with a simple plan.
   - Response shape: exit plan, boundary phrase, recovery plan.
   - Avoid: over-planning, clinical language, catastrophising.

3. Processing afterward
   - Goal: help the user make sense of what happened without shame.
   - Response shape: validation, pattern reflection, one gentle next step.
   - Best app action: journal, deeper processing, or return to sanctuary.

## Context Contract

Only include context that directly helps the user's current moment.

Allowed context:
- First name, if present.
- Selected triggers.
- Misophonia severity band.
- Recent high-level log patterns.
- Recent practice usage.
- Current course stage, once course context exists.
- Curated research/course snippets retrieved for the current question.

Do not include by default:
- Full raw journal history.
- Full chat history beyond the active conversation window.
- Sensitive profile details not needed for the answer.
- Any content from user-uploaded/course folders until it has been curated and chunked.

## Retrieval Direction

MisoAI context should come from a curated knowledge base, not raw folders.

Ingestion pipeline:
1. Source inventory: research, course modules, scripts, worksheets, app copy.
2. Trust rating: research, lived-experience guidance, course content, marketing copy.
3. Chunking: short chunks with source title, type, date, and safety notes.
4. Review: remove claims that sound medical, diagnostic, or unsupported.
5. Retrieval: select only the few chunks needed for the current mode.
6. Citation/debug: keep internal source IDs for review, but do not overload the user.

## Safety Boundaries

MisoAI is wellness support, not therapy, diagnosis, crisis care, or medical advice.

It must:
- Validate before suggesting.
- Avoid "calm down", "just ignore it", "failure", "lost streak", and shame language.
- Ask at most one question at a time.
- Offer one next step, not a menu of ten.
- Escalate gently when the user mentions self-harm, harm to others, immediate danger, abuse, or inability to stay safe.
- Encourage professional support when symptoms are severe, escalating, or impairing daily life.

It must not:
- Diagnose misophonia or other conditions.
- Promise cures.
- Tell users to endure unsafe situations.
- Generate exposure plans without safeguards.
- Replace crisis resources.
- Use user data to pressure engagement or upsell.

## Prompt Contract

System prompt sections should be explicit:

- Identity: warm misophonia companion named Miso.
- Mission: support regulation, reflection, and return to sanctuary.
- Modes: triggered now, preparing, processing.
- Style: short, warm, concrete, no clinical performance.
- Safety: crisis/escalation handling.
- Context use: use only relevant provided context.
- App actions: suggest existing app spaces only when helpful.

## UI Direction

The chat surface should become a guide space with mode chips, not a blank generic chat.

Initial mode choices:
- I am triggered now
- Help me prepare
- Help me process

Each mode should have one calm primary action and a visible return to sanctuary. The user should always be able to type freely, but the first screen should reduce decision load.

## First Build Slice

1. Add mode selection UI above chat.
2. Pass mode to `/api/chat`.
3. Update system prompt by mode.
4. Add safety/escalation tests for prompt assembly.
5. Add retrieval only after source inventory and curation are complete.

