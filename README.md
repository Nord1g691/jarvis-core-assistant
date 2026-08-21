# jarvis-core-assistant
JARVIS Core Assistant — An intelligent, voice-controlled web interface for Home Assistant, with dynamic cards, AI-powered actions, memory, automation, energy monitoring, cameras, media and more.

## V9
V9 is implemented as an additive runtime layer on `dev-v9` and preserves the existing visual HUD/Core. It provides dynamic Home Assistant entity discovery, category/state presentation, manual selection, settings/layout state, contextual request routing, and a guarded action gateway before Home Assistant service calls.

The final production wiring remains intentionally non-invasive: the existing visual layer is the host surface and V9 supplies data, actions and events around it.
