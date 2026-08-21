# JARVIS V9

V9 is built as an additive layer over the existing JARVIS visual interface.

## Principles

- Preserve the existing visual identity, title and Core.
- Home Assistant is the source of truth for entities and live state.
- Discover entities dynamically; do not hard-code a user's entity IDs.
- Categories are the silent/manual control surface. Voice remains the primary interaction model.
- Settings contains connection/account, JARVIS/voice, system and general configuration.
- The update control is fixed at the bottom-right of the dashboard.
- Only state attributes actually exposed by Home Assistant are rendered.
- The runtime is event-driven so the existing HUD can consume V9 data without replacing its visual layer.

## Categories

1. Lumière
2. Climatisation / Chauffage
3. Accès
4. Piscine
5. Voiture
6. Énergie
7. Média
8. Caméra
9. Volets
10. Intérieur / Extérieur
11. News / Actualité
12. Sport

## Runtime contract

`v9/v9-runtime.js` discovers `/api/states`, classifies entities dynamically and exposes `window.JARVIS_V9_RUNTIME` with category/entity lookup, capability-based state summaries and guarded Home Assistant service calls. It also emits `jarvis:v9:entities` and `jarvis:v9:error` events.

The UI wiring loads this runtime from the existing HUD and binds the existing navigation/cards to these events. The visual layer itself is not replaced.

## Test gate

Run `v9/v9-test.html` first. It is an offline smoke test: Home Assistant requests are mocked and no secret is required. The page reports whether the V9 modules, state flow, action policy, selection, dashboard, bridge and HUD bootstrap are coherent.

Then follow `v9/TEST-CHECKLIST.md` against a real Home Assistant instance. Do not commit HA credentials or tokens. V9 should only be considered ready for broader rollout after both the offline smoke test and the real HA checks pass.

## Reserved for later phases

The V9 contract leaves room for contextual cards, persistent memory, history/logbook, diagnostics, automation suggestions, vision, and future orbital cards around the Core without requiring a second visual system.
