# JARVIS House Spatial Model

This folder is the safe spatial contract for the house UI and future JARVIS reasoning.

## Rules

- Architectural plan = geometry authority.
- Hotspots are semantic anchors only; they do not redraw walls.
- Satellite/drone = site orientation and exterior implantation once raw rasters are available.
- Real photos = as-built appearance/context evidence, not direct metric geometry.
- Current-use corrections are stored as explicit deltas from the plan.
- Home Assistant entity IDs are bound to stable spatial zone IDs.
- UI navigation must remain usable even before the final 3D scene exists.

## UI flow target

1. Property overview (satellite/drone registered site view)
2. Ground-floor master plan
3. Clickable room/zone views
4. Foldable Home Assistant controls per zone
5. Later: replace static views with glTF/WebGL while keeping the same zone IDs and entity bindings

## V0.2 progress

- Three-level navigation contract added: `property -> rdc -> room`.
- Property view can temporarily use real exterior photo evidence while the raw satellite/drone rasters are unavailable to the runtime.
- Ground-floor view remains the untouched architectural plan with semantic hotspots only.
- Room views can expose real photo evidence and Home Assistant entity bindings.
- HA action buttons are prepared to use `hass.callService` once the prototype is embedded into the JARVIS panel.
- Children bathroom renovation remains stored as an explicit as-built delta from the former dressing.
- Split level, cathedral ceiling, fireplace/posts, terrace/porch and key exterior semantics remain in the spatial contract.

## Blocked gates

- Precise site view requires the raw `IMG_0735.jpeg` satellite raster and the real drone raster in the runtime pipeline.
- Dreame remains topology-only until a genuine map raster is recovered.
- No AI-generated house rendering is accepted as geometry.
