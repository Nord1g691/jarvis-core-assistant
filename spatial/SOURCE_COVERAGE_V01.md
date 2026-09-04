# JARVIS Maison — Source Coverage V0.1

The house model must use the full known source corpus, not only the few images embedded in early UI prototypes.

## Geometry
- Architectural plan original + north-oriented working master are the geometry authority.
- Vector SVG/framework files are production aids only.
- Approximate areas and known dimensions are QA controls, never shape-forcing inputs.

## Real interior evidence
- `IMG_0751_piece_de_vie.jpeg`
- `IMG_0753_piece_de_vie.jpeg`
- `IMG_0754_charpente_cheminee_poteaux.jpeg`
- garage technical-zone / cellar-stair references
- `IMG_4245.jpeg` for the as-built children bathroom / former dressing

## Real exterior evidence
- `IMG_0755_entree_garage_jardin.jpeg`
- `IMG_0756_jardin_vue_large.jpeg`
- `IMG_0757_facade_porche_jardin.jpeg`
- `IMG_0759_jardin_vegetation.jpeg`
- `IMG_0762_facade_terrasse_porche.jpeg`
- `IMG_1979.jpeg` rear exterior
- pool sources: `IMG_1753.jpeg`, `BF7ADE09-F3CC-4D0D-870E-7B4DA770FB80.jpeg`, `3E5E5C0B-99BF-429D-89AC-CDFBE597C77C.jpeg`
- drone global property reference
- satellite `IMG_0735.jpeg`, north at image top

## Robot / topology
The four Dreame camera entities are known and their room semantics are documented. Their rasters must be harvested directly from Home Assistant before any geometric registration. Room 9 remains excluded as a mirror artifact.

## Home Assistant sources still to harvest
- room/climate card photos
- house photos in HA media
- four Dreame map rasters

These sources are known to exist and should be harvested when connector/media access is available instead of asking the user to resend them.

## Production rule
1. Build geometry from plan.
2. Cross-check every zone against all relevant photos.
3. Apply confirmed as-built deltas.
4. Bind HA entities through stable spatial IDs.
5. Use satellite + drone for site/exterior.
6. Use Dreame as topology/proportion QA.
7. Record conflicts instead of guessing.
8. Promote to glTF/WebGL only after wall, opening and vertical-profile gates pass.

Historical AI-generated house images are explicitly excluded from geometry authority.
