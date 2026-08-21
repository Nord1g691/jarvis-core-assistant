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

`v9/v9-runtime.js` discovers `/api/states`, classifies entities dynamically and exposes `window.JARVIS_V9_RUNTIME` with category/entity lookup, capability-based state summaries and Home Assistant service calls. It also emits `jarvis:v9:entities` and `jarvis:v9:error` events.

The final UI wiring must load this runtime from the existing HUD and bind the existing navigation/cards to these events. The visual layer itself should not be replaced.

## Reserved for later phases

The V9 contract leaves room for contextual cards, persistent memory, history/logbook, diagnostics, automation suggestions, vision, and future orbital cards around the Core without requiring a second visual system.
