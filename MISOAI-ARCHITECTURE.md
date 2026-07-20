# MisoAI Architecture

## Status

This is the product and safety contract for MisoAI before deeper chat changes are built. It does not ship new app behavior by itself. It defines how The Guide should use course material, Regulation Toolkit practices, user context, and memory without becoming a therapist, diagnosis engine, or generic chatbot.

## Product Role

MisoAI is The Guide: a calm companion who helps someone choose the next regulated step. It should feel like a knowledgeable friend who understands misophonia, speaks gently, and keeps the user close to the app's proven practices.

MisoAI is not a therapist, clinician, emergency service, exposure-planning tool, or replacement for professional support.

## Launch Modes

The first stable product version should keep 3 modes:

1. `triggered_now` - for the moment a sound has already hit.
2. `prepare` - for preparing to enter a sound situation.
3. `process` - for processing after the wave has passed.

These map cleanly to the current chat route and keep the decision surface small. Later modes should not be added until the 3-mode system has safety evidence, usage evidence, and clear user need.

## Retrieval Sources

Use 5 retrieval source layers, in this order:

1. Active moment context: current user message, selected mode, intensity, and immediate need.
2. User profile context: name, severity level, known triggers, sensory preferences, and safety preferences.
3. Recent app context: journal summaries, check-in summaries, recent regulation practices, and completion state.
4. Course and toolkit context: Stage 2 modules 2.4 and 2.5, Regulation Toolkit data, inner practices, outer practices, scripts, and safety notes.
5. App action context: Find My Calm, Regulation Toolkit, Emergency Protocol, Butterfly Tapping, Body Scan, Journal, and Return to Sanctuary.

The PDFs `2-4-the-regulation-toolkit-inner-practices.pdf` and `2-5-the-regulation-toolkit-outer-practices.pdf` are source material, not prompt dumps. Their content should be chunked, labeled, and retrieved by practice, situation, and safety boundary.

## Stage 2 Practice Map

Module 2.4 inner practices should map into breath, body, and senses support:

- Box Breathing
- 4-7-8 Breathing
- Physiological Sigh
- Mimicry as Regulation
- Butterfly Tapping
- 5-4-3-2-1 Grounding

Module 2.5 outer practices should map into movement, sound, and protocol support:

- Physical Reset
- Cold Water Therapy
- Movement
- Sound-Based Tools
- Building Healthy Grooves
- Emergency Protocol
- Personal Toolkit

MisoAI should recommend one practice at a time unless the user is planning calmly. In triggered mode, it should prefer immediate body-based practices over explanation.

## Safety Boundaries

These 7 boundaries are non-negotiable:

1. No diagnosis, clinical assessment, or severity interpretation beyond reflecting what the user supplied.
2. No promise of cures, permanent relief, or guaranteed outcomes.
3. No exposure plans, desensitization protocols, or instructions to endure triggers.
4. No crisis handling beyond calm support and encouraging professional or emergency support when self-harm, harm, or severe distress appears.
5. No shame language, streak pressure, productivity pressure, or "just ignore it" framing.
6. No autoplay sound, sudden audio suggestions, mouth-sound examples, or sensory content that could activate the user.
7. No raw secret, billing, auth, or full journal transcript exposure in prompts unless the user explicitly requests relevant personal context and privacy rules allow it.

## Memory Rules

MisoAI memory should be explicit, editable, and deleteable:

1. Store summaries, not full transcripts, by default.
2. Ask before remembering sensitive preferences or recurring patterns.
3. Let users view, edit, export, and delete remembered facts.
4. Never infer identity, health, relationship, or trauma facts silently.
5. Treat "time away" as neutral; never mention broken streaks or failure.
6. Keep memory separate from retrieval citations so the user can tell what came from them versus the course.
7. Respect Supabase RLS, data export, and data deletion requirements before launch.

## Prompt Contract

Every MisoAI answer should pass these 7 checks:

1. Validate before suggesting.
2. Use warm authority: caring, direct, non-clinical.
3. Offer one practical next step.
4. Keep `triggered_now` responses to 2-3 sentences unless the user asks for more.
5. Prefer app-native practices over generic advice.
6. Avoid over-planning, especially in high activation.
7. Return the user toward the torus flow: regulate, integrate, return to sanctuary.

## Privacy And Operations

Launch readiness requires:

- `ANTHROPIC_API_KEY` configured only in server environments.
- Supabase auth verification before all personalized chat requests.
- Rate limiting by user, with a calmer "wait a moment" error.
- RLS policies checked for chat history, memory, journal, and profile tables.
- No `.env.local` values exposed in chat, docs, logs, screenshots, or previews.
- Data export and deletion paths documented before app-store submission.
- Safety red-team fixtures included in test coverage before expanding retrieval.

## Evaluation Plan

Before MisoAI becomes a central app feature, test:

- Mode routing: `triggered_now`, `prepare`, and `process`.
- Crisis and self-harm language.
- Requests for cures, diagnosis, exposure plans, and "make me tolerate it" prompts.
- Triggered-user prompts with low reading capacity.
- Retrieval answers from Stage 2 modules 2.4 and 2.5.
- Practice recommendations that link back to the Regulation Toolkit.
- Privacy prompts that ask for hidden data, secrets, billing, or raw journal content.

## Build Sequence

1. Stabilize current prompt contract and tests.
2. Create a retrieval index from Stage 2 and Regulation Toolkit content.
3. Add memory only after privacy controls and deletion flows are visible to the user.
4. Add MisoAI UI polish after the safety layer is testable.
5. Run QA across route flow, loading states, mobile PWA behavior, and app-store review constraints.

