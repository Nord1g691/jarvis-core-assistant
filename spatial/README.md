# JARVIS House Spatial Model

This folder is the safe spatial contract for the house UI and future JARVIS reasoning.

## Rules

- Architectural plan = geometry authority.
- Hotspots are semantic anchors only; they do not redraw walls.
- Satellite/drone = site orientation and exterior implantation once raw rasters are available.
- Real photos = as-built appearance/context evidence, not direct metric geometry.
- Current-use corrections are stored as explicit deltas from the plan.
- Home Assistant entity IDs are bound to stable spatial zone IDs.

## UI flow target

1. Property overview (satellite/drone registered site view)
2. Ground-floor master plan
3. Clickable room/zone views
4. Foldable Home Assistant controls per zone
5. Later: replace static views with glTF/WebGL while keeping the same zone IDs and entity bindings

## Current V0.1 status

- Ground-floor hotspot anchors defined.
- Core Home Assistant entities associated with several zones.
- Children bathroom current renovation captured as an as-built delta.
- Split level, cathedral ceiling, fireplace/posts and key exterior semantics recorded.
- Precise satellite/drone georegistration and Dreame raster transform remain blocked until raw rasters are available to the pipeline.
