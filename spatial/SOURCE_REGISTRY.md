# JARVIS House — Source Registry

This file records which sources are allowed to drive geometry, orientation, as-built changes, visual appearance, topology and Home Assistant bindings.

## Authority order

1. Explicit user corrections about current reality
2. Architectural plan for walls, visible openings and dimensions
3. Real photos for as-built confirmation, structure, appearance and furniture context
4. Satellite + drone for site orientation, exterior implantation and roof/context QA
5. Dreame for adjacency / circulation / room-use cross-checks
6. Home Assistant for functional object identity and live state
7. Estimates only as QA controls, never as final geometry

## Core geometry source

- `07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png`
  - Role: authoritative RDC wall/opening geometry
  - Coordinate frame: 1160 × 930 px, origin top-left
  - North: top
  - Status: LOCKED
  - Rule: never replace architectural walls with semantic room polygons

## Orientation / exterior sources

- `IMG_0735.jpeg`
  - Role: north-up satellite/site reference
  - North: image top
  - Status: ORIENTATION LOCKED
  - Limitation: exact raster transform is not yet promoted in the runtime pipeline

- `dji_fly_20250203_170128_172_1738657534084_photo_optimized.jpeg`
  - Role: drone QA for roof massing, house/site relation, garden/pool context
  - Status: DOCUMENTED / VISUAL QA

## Interior photo evidence

- `IMG_0751_piece_de_vie.jpeg`
  - Open living / dining / kitchen / stair relationship
- `IMG_0753_piece_de_vie.jpeg`
  - Open living volume and furniture-context reference
- `IMG_0754_charpente_cheminee_poteaux.jpeg`
  - Cathedral structure, fireplace, posts, beams, stair control
- Garage technical-zone reference photo
  - Garage/cellar stair/technical infrastructure topology
- `IMG_4245.jpeg`
  - Current children bathroom, formerly the architectural dressing attached to Chambre 2
  - Confirms shower at rear, WC left, vanity/sink right, door relationship described by the user

All panoramic/wide-angle photos are non-metric evidence. They can confirm relationships and appearance but must not directly define wall coordinates.

## Exterior photo evidence

- `IMG_0755_entree_garage_jardin.jpeg`
  - Entry / garage / access relationship
- `IMG_0756_jardin_vue_large.jpeg`
  - Broad garden context
- `IMG_0757_facade_porche_jardin.jpeg`
  - Facade / covered porch / garden relation
- `IMG_0759...`
  - Garden / horizon complementary reference
- `IMG_0762_facade_terrasse_porche.jpeg`
  - Facade / terrace / porch relationship

## Dreame topology source

Known map entities:

- `camera.l40s_pro_ultra_map_1` — main ground floor
- `camera.l40s_pro_ultra_map_2` — RDC salon / bureau
- `camera.l40s_pro_ultra_map_3` — guest room upstairs
- `camera.l40s_pro_ultra_map_4` — secondary map of the same dwelling

Room semantics currently retained:

- room 1 — bathroom / current shower-former children dressing
- room 2 — parent bedroom
- room 3 — children bedroom
- room 4 — séjour + dining
- room 5 — kitchen
- room 6 — parent dressing
- room 7 — night corridor
- room 8 — bathroom 2
- room 9 — excluded mirror/artifact
- room 10 — salon + bureau

Rule: Dreame never overrides architectural wall geometry. It is a topology/proportion cross-check only until a raw map raster is registered.

## Home Assistant spatial bindings

Representative bindings already used in the spatial model:

- Garage door: `cover.smart_garage_door_2011121892665436100848e1e93b38f4_garage`
- Garage-house access: `binary_sensor.porte_acces_garage`
- Cellar door: `binary_sensor.porte_cave`
- Garage-garden door: `binary_sensor.porte_jardin`
- Children bedroom door: `binary_sensor.ewelink_snzb_04p`
- Terrace door: `binary_sensor.ewelink_snzb_04p_3`
- Dining shutters: `cover.voletsalleamanger`, `cover.voletporte_volet_terrasse`
- Kitchen shutter: `cover.voletcuisine`
- Pool: `switch.filtration_piscine`, `climate.pac_piscine`, `light.eclairage_piscine`
- Irrigation: `switch.exterieur_programmateur_eau_programmateur_eau`, `switch.sonoff_swv_zfe`

## Current confirmed as-built deltas

- Chambre 2 = current children bedroom
- Architectural dressing attached to Chambre 2 = current children sanitary/bath zone
- Placard under stair = compact current laundry, same original footprint
- Kitchen → dining = open passage, no door
- Kitchen ↔ cellier = real door
- Living/dining split level = 0.17 m
- Split-level line returns to the wall corner, not the glazed bay
- Kitchen worktop return starts next to terrace door, approx. 1.50 m

## Prohibited source use

- AI-generated house images must never become geometry
- Semantic room labels must never create walls
- Panoramas must never set metric scale
- Dreame must never redraw architectural walls
- Approximate areas must never be used to force the plan into a different shape
