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
- AI-generated house images are presentation-only and must never become geometry.

## UI flow target

1. Property overview (satellite/drone registered site view)
2. Ground-floor master plan
3. Clickable room/zone views
4. Foldable Home Assistant controls per zone
5. Plan-derived 2.5D technical preview
6. Later: replace static views with glTF/WebGL while keeping the same zone IDs and entity bindings

## V0.3 progress

- Three-level navigation contract: `property -> rdc -> room`.
- Property technical view now uses the confirmed north-up site relationship and only grounded exterior relations.
- Ground-floor view remains the untouched architectural plan with semantic hotspots only.
- Room views expose real photo evidence and Home Assistant entity bindings.
- HA action buttons are prepared to use `hass.callService` once embedded in the JARVIS panel.
- Children bathroom renovation is stored as an explicit as-built delta from the former dressing, supported by the real photo IMG_4245.
- Split level, cathedral ceiling, fireplace/posts, terrace/porch, garage/cellar relations and exterior semantics remain in the spatial contract.
- A plan-derived 2.5D preview is now part of the production pipeline. It extrudes detected architectural wall strokes rather than generating geometry from semantic room polygons.
- `house-spatial-v03.json` is the current UI/spatial contract for the next panel integration pass.

## Blocked gates

- Precise georeferenced site transform still needs the raw `IMG_0735.jpeg` satellite raster and real drone raster in the runtime pipeline.
- Dreame remains topology-only until a genuine map raster is recovered.
- Exact metric 3D still needs a second independent dimension control.
- Thin interior partitions and exact opening cuts must pass QA before final glTF/WebGL export.
