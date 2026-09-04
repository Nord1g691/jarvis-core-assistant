# JARVIS House — QA Gates

The spatial/3D pipeline is intentionally gated. A downstream step cannot become authoritative until the upstream geometry/evidence gate is good enough.

## Gate G0 — Source integrity

Status: PASS

- Architectural plan identified and locked
- Current-use corrections stored separately
- Real photo evidence registry started
- Satellite/drone/Dreame roles explicitly separated
- AI-generated visualizations excluded from geometry authority

## Gate G1 — Coordinate frame / orientation

Status: PASS for orientation, PARTIAL for metric site registration

- Plan frame: 1160 × 930 px, origin top-left
- North = top
- Satellite orientation reference = `IMG_0735.jpeg`
- V2 plan already uses the corrected orientation

Remaining:

- exact satellite/drone raster transform into the same property coordinate frame

## Gate G2 — Architectural wall geometry

Status: IN PROGRESS

Current safe method:

- preserve the original plan raster
- extract architectural wall candidates from the plan itself
- do not reconstruct walls from room semantics
- visually QA wall candidates against the original plan

Remaining:

- thin interior partitions
- exact diagonal/night-corridor edges
- complete stair/core wall network
- wall thickness cleanup where symbols/text contaminate the scan

## Gate G3 — Openings

Status: PARTIAL

Topology already locked:

- entry door
- garage → house access
- cave door
- garage → garden door
- children bedroom → night corridor door
- parent bathroom → night corridor door from plan
- terrace door
- kitchen → dining = open passage, no door
- kitchen ↔ cellier = real interior door

Remaining:

- exact opening endpoints/widths on the vector wall network
- exact children exterior garden opening subtype/width
- complete exterior bay/window binding

## Gate G4 — As-built deltas

Status: PARTIAL / SAFE

Locked current-use changes:

- Chambre 2 = children bedroom
- former children dressing = current children bathroom/sanitary zone
- placard under stair = compact laundry
- living/dining split level = 0.17 m
- split-level line returns at wall corner, not the glazed bay
- kitchen worktop return ≈ 1.50 m from terrace-door side

Children bathroom photo evidence confirms:

- shower at far end
- WC left
- vanity/sink right
- door relationship described by the user

Remaining:

- exact internal remodeled partition geometry

## Gate G5 — Vertical model

Status: PARTIAL

Locked/usable:

- living low level = -0.17 m
- dining/kitchen/night core = 0.00 m reference
- cathedral over salon + dining
- cathedral peak ≈ 5.0 m
- standard false ceiling elsewhere ≈ 2.40 m
- ceiling fan remains at high central location
- fireplace between two posts
- two transverse living-area beams

Remaining:

- exact roof slopes and ridge lines
- exact floor-to-floor offsets for cave / garage / RDC / upper floor
- second metric control before final world-space scale

## Gate G6 — Exterior/site model

Status: PARTIAL

Grounded relations:

- north-up site orientation
- road / access / field relationships
- house / garage / terrace / pool / garden / cabane relationships
- large pine as a strong exterior landmark
- grey 60 × 60 main paving
- rear wood-look 40 × 120 surface
- buried 4000 L rainwater tank at hedge / Rue de la Madone corner

Remaining:

- exact plan-to-satellite transform
- exact pool/cabane/terrace metric footprints from raster registration

## Gate G7 — Metric calibration

Status: PARTIAL

Current preview control:

- garage architectural dimension chain: 4.60 + 5.40 = 10.00 m
- other garage axis ≈ 6.50 m
- overall QA areas: habitation ≈ 170 m², garage ≈ 70 m², cave ≈ 40 m²

Rule:

- areas are QA checks only and must never reshape the plan

Required before final metric 3D:

- one second independent reliable dimension control, ideally laser-measured or unambiguous architectural dimension

## Gate G8 — Home Assistant spatial binding

Status: READY FOR PROTOTYPE

Already supported conceptually:

- stable zone IDs
- zone → entity bindings
- future runtime actions through `hass.callService`
- read-only spatial model exposure through JARVIS Core

Next:

- bind live state cards by zone
- bind cameras by spatial relevance
- add per-zone foldable control groups

## Gate G9 — Interactive 3D export

Status: NOT READY FOR FINAL, READY FOR TECHNICAL PROTOTYPE

Allowed now:

- plan-derived 2.5D technical previews
- non-authoritative glTF/WebGL prototype using validated wall candidates

Not allowed yet:

- claim a final metric 3D twin
- use AI-generated geometry as the house model

Final 3D readiness requires G2 + G3 + G5 + G7 to be sufficiently closed.
