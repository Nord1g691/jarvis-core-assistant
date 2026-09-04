# JARVIS House — Spatial Twin Architecture

## Goal

Build a progressive digital twin that starts as a reliable clickable 2D/2.5D house board and evolves into a true 3D WebGL/glTF scene without throwing away spatial IDs, Home Assistant bindings or source provenance.

## Non-negotiable design decisions

1. Geometry and appearance are separate layers.
2. The architectural plan is the geometry authority for the RDC.
3. Satellite/drone sources register the house inside the property/site frame.
4. Real photos describe as-built appearance, structure and current use.
5. Current-user corrections are explicit deltas from the architectural design.
6. Home Assistant entities bind to stable spatial IDs, not to pixel positions directly.
7. AI-generated visuals are presentation experiments only and never authoritative geometry.
8. A later glTF/WebGL scene must reuse the same stable IDs already used by the 2D UI.

## Coordinate systems

### PLAN frame

- master raster: `07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png`
- dimensions: 1160 × 930 px
- origin: top-left
- north: top
- role: internal architectural geometry

### SITE frame

- reference: satellite `IMG_0735.jpeg`
- north: top
- role: property orientation / exterior implantation
- current status: orientation locked, exact metric transform pending

### WORLD frame

Future metric 3D frame in metres.

Promotion into WORLD requires:

- reliable PLAN geometry
- opening cuts
- vertical profile
- at least two independent metric controls

## Model layers

- `L00_SOURCE_RASTERS` — plan, satellite, drone, photos, Dreame
- `L10_ARCHITECTURAL_WALLS` — plan-derived walls only
- `L20_OPENINGS` — doors, bays, windows, open passages
- `L30_AS_BUILT_DELTAS` — remodels/current-use changes
- `L40_LEVELS_AND_VERTICAL_PROFILE` — -17 cm split level, ceilings, cathedral
- `L50_FIXED_STRUCTURE` — fireplace, posts, beams, stair anchors
- `L60_EXTERIOR_SITE` — terrace, pool, garden, cabane, access, paving
- `L70_HA_FUNCTIONAL_ANCHORS` — Home Assistant entities / cameras / controls
- `L80_CONFIDENCE_AND_CONFLICTS` — evidence state, unresolved mismatches

## Stable spatial IDs

Examples currently used:

- `garage`
- `living`
- `dining`
- `kitchen`
- `cellier`
- `stairs`
- `children`
- `children_bath`
- `parent_bath`
- `parent`
- `terrace`

These IDs are the contract between:

- spatial data
- JARVIS WebSocket model
- dashboard hotspots
- live HA controls
- future 3D mesh nodes

## UI progression

### V0 — static evidence

Plan + photo references.

### V0.3 — current prototype

`Property -> RDC -> Room`

- property technical overview
- architectural plan with semantic hotspots
- room photo/evidence view
- Home Assistant entity list and prepared actions

### V1 — Home Assistant panel integration

- runtime read through `jarvis/get_spatial_model`
- live states per zone
- foldable control groups
- cameras linked to the relevant spatial zones

### V2 — plan-derived 2.5D

- validated wall extrusion
- opening cuts
- 2.40 m standard walls
- cathedral profile over living/dining

### V3 — glTF/WebGL twin

- orbit / zoom / room focus
- hide roof / hide wall groups
- click equipment nodes
- same stable IDs and HA bindings as V0.3

## Home Assistant runtime contract

Read path:

- JARVIS Core WebSocket returns spatial model + HA entity IDs
- frontend resolves live HA states for the bound entities

Write path:

- UI action calls the relevant HA service, normally through `hass.callService`
- state changes stay authoritative in Home Assistant

The spatial layer never duplicates Home Assistant device state as a second source of truth.

## Photo indexing strategy

Each useful photo should eventually have metadata such as:

- source filename
- zone ID
- viewpoint / direction
- visible objects
- date if useful
- confidence
- whether it is metric or non-metric evidence

JARVIS should retrieve only spatially relevant images instead of loading the full photo library into every prompt.

## 3D export rule

A mesh node should never be created just because a semantic zone exists.

Mesh creation must come from:

1. validated plan geometry
2. validated openings
3. validated vertical profile
4. explicit as-built deltas

Semantic zones can then reference mesh groups, but never define them.
