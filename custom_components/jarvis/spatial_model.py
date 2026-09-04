"""Read-only spatial model exposed by JARVIS Core.

This module intentionally contains semantic/navigation data plus source
provenance. Architectural geometry remains external and authoritative.
"""
from __future__ import annotations

SPATIAL_MODEL: dict = {
    "schema": "jarvis_house_spatial_runtime",
    "version": "0.3",
    "north": "top",
    "geometry_authority": "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
    "navigation": ["property", "rdc", "room"],
    "rules": [
        "Architectural plan remains the geometry authority.",
        "Hotspots are semantic anchors only.",
        "Photos are as-built evidence, not direct metric geometry.",
        "Panoramas are never used as metric scale.",
        "Satellite/drone control exterior orientation and implantation only.",
        "Dreame is topology/proportion QA only and never redraws walls.",
        "Missing evidence stays missing; conflicts are recorded, never guessed.",
    ],
    "source_inventory": {
        "registry": "spatial/SOURCE_INVENTORY_V01.json",
        "coverage": "spatial/SOURCE_COVERAGE_V01.md",
        "zone_matrix": "spatial/ZONE_EVIDENCE_MATRIX_V01.json",
        "photo_atlas": "28_ATLAS_PHOTO_SPATIAL_V1.html",
        "satellite": "IMG_0735.jpeg",
        "drone": "dji_fly_20250203_170128_172_1738657534084_photo_optimized.jpeg",
        "pool_photos": [
            "IMG_1753.jpeg",
            "BF7ADE09-F3CC-4D0D-870E-7B4DA770FB80.jpeg",
            "3E5E5C0B-99BF-429D-89AC-CDFBE597C77C.jpeg",
        ],
    },
    "zones": {
        "garage": {
            "label": "Garage",
            "entities": [
                "cover.smart_garage_door_2011121892665436100848e1e93b38f4_garage",
                "binary_sensor.porte_acces_garage",
                "binary_sensor.porte_cave",
                "binary_sensor.porte_jardin",
            ],
            "evidence": {
                "visual": [
                    "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
                    "IMG_0755_entree_garage_jardin.jpeg",
                    "garage_local_technique_escalier.jpeg",
                    "IMG_99E09EF7-F2A4-4E7D-9ECC-68F362380939.jpeg",
                ],
                "documents": [
                    "26_GARAGE_ZONE_TECHNIQUE_INFRASTRUCTURE.json",
                    "33_GARAGE_CHAINE_COTES_ARCHITECTURALE.json",
                    "38_BASE_DOCUMENTAIRE_MAITRE_V3.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "living": {
            "label": "Salon / Séjour",
            "level_m": -0.17,
            "entities": [
                "light.eclairage_plafond_2",
                "light.eclairage_couleur_salon",
                "switch.smart_switch_2103188752458451855248e1e96523aa_outlet",
                "light.lsc_smart_10m_ledstrip_rgbic_cct_2",
                "light.lsc_smart_10m_ledstrip_rgbic_cct",
                "cover.volet3",
                "cover.shelly2pmg4_7c2c677b399c",
                "cover.volet1",
            ],
            "evidence": {
                "visual": [
                    "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
                    "IMG_0751_piece_de_vie.jpeg",
                    "IMG_0753_piece_de_vie.jpeg",
                    "IMG_0754_charpente_cheminee_poteaux.jpeg",
                ],
                "documents": [
                    "23_MODELE_CANONIQUE_3D_HA.json",
                    "32_PROFIL_VERTICAL_3D_REFERENCE.json",
                    "38_BASE_DOCUMENTAIRE_MAITRE_V3.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "dining": {
            "label": "Salle à manger",
            "level_m": 0.0,
            "entities": [
                "cover.voletsalleamanger",
                "cover.voletporte_volet_terrasse",
            ],
            "evidence": {
                "visual": [
                    "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
                    "IMG_0751_piece_de_vie.jpeg",
                    "IMG_0753_piece_de_vie.jpeg",
                    "IMG_0754_charpente_cheminee_poteaux.jpeg",
                    "IMG_0762_facade_terrasse_porche.jpeg",
                ],
                "documents": [
                    "32_PROFIL_VERTICAL_3D_REFERENCE.json",
                    "38_BASE_DOCUMENTAIRE_MAITRE_V3.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "kitchen": {
            "label": "Cuisine",
            "open_to": ["dining"],
            "door_to": ["cellier"],
            "entities": ["cover.voletcuisine"],
            "evidence": {
                "visual": [
                    "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
                    "IMG_0751_piece_de_vie.jpeg",
                    "IMG_0753_piece_de_vie.jpeg",
                    "IMG_0754_charpente_cheminee_poteaux.jpeg",
                ],
                "documents": [
                    "34_CUISINE_CELLIER_GEOMETRIE.json",
                    "38_BASE_DOCUMENTAIRE_MAITRE_V3.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "cellier": {
            "label": "Cellier",
            "note": "Keep the exact irregular architectural footprint.",
            "evidence": {
                "visual": ["07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png"],
                "documents": [
                    "34_CUISINE_CELLIER_GEOMETRIE.json",
                    "38_BASE_DOCUMENTAIRE_MAITRE_V3.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "stairs_laundry": {
            "label": "Escalier / Buanderie",
            "note": "Architectural placard under stairs = compact laundry on right side.",
            "evidence": {
                "visual": [
                    "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
                    "IMG_0751_piece_de_vie.jpeg",
                    "IMG_0754_charpente_cheminee_poteaux.jpeg",
                ],
                "documents": [
                    "38_BASE_DOCUMENTAIRE_MAITRE_V3.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "children_bedroom": {
            "label": "Chambre enfants",
            "architectural_label": "Chambre 2",
            "entities": ["binary_sensor.ewelink_snzb_04p"],
            "dreame_room": 3,
            "evidence": {
                "visual": [
                    "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
                    "IMG_4245.jpeg",
                ],
                "documents": [
                    "10_ETAPE_4_DREAME_RECALAGE.json",
                    "24_DREAME_CARTES_HA_REFERENCE.json",
                    "93_PREUVE_PHOTO_SDB_ENFANTS_IMG_4245_V1.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "children_bathroom": {
            "label": "SDB enfants actuelle",
            "architectural_label": "Ancien dressing Chambre 2",
            "as_built_sequence": [
                "shower_at_far_end",
                "door_to_children_bedroom",
                "vanity_sink_in_continuation",
                "corridor_access",
            ],
            "additional_fixture": "WC_left",
            "dreame_room": 1,
            "evidence": {
                "visual": [
                    "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
                    "IMG_4245.jpeg",
                ],
                "documents": [
                    "10_ETAPE_4_DREAME_RECALAGE.json",
                    "24_DREAME_CARTES_HA_REFERENCE.json",
                    "93_PREUVE_PHOTO_SDB_ENFANTS_IMG_4245_V1.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "parent_bathroom": {
            "label": "SDB parentale",
            "architectural_label": "Salle d'eau",
            "dreame_room": 8,
            "evidence": {
                "visual": ["07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png"],
                "documents": [
                    "10_ETAPE_4_DREAME_RECALAGE.json",
                    "24_DREAME_CARTES_HA_REFERENCE.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "parent_bedroom": {
            "label": "Chambre parentale",
            "architectural_label": "Chambre 1",
            "dreame_room": 2,
            "evidence": {
                "visual": ["07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png"],
                "documents": [
                    "10_ETAPE_4_DREAME_RECALAGE.json",
                    "24_DREAME_CARTES_HA_REFERENCE.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "night_corridor": {
            "label": "Dégagement nuit",
            "dreame_room": 7,
            "evidence": {
                "visual": ["07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png"],
                "documents": [
                    "10_ETAPE_4_DREAME_RECALAGE.json",
                    "24_DREAME_CARTES_HA_REFERENCE.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "terrace_porch": {
            "label": "Terrasse / Porche",
            "entities": ["binary_sensor.ewelink_snzb_04p_3"],
            "evidence": {
                "visual": [
                    "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
                    "IMG_0757_facade_porche_jardin.jpeg",
                    "IMG_0762_facade_terrasse_porche.jpeg",
                    "IMG_1979.jpeg",
                ],
                "documents": [
                    "38_BASE_DOCUMENTAIRE_MAITRE_V3.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
        "garden_pool": {
            "label": "Jardin / Piscine",
            "entities": [
                "switch.filtration_piscine",
                "climate.pac_piscine",
                "light.eclairage_piscine",
                "switch.exterieur_programmateur_eau_programmateur_eau",
                "switch.sonoff_swv_zfe",
            ],
            "evidence": {
                "visual": [
                    "IMG_0735.jpeg",
                    "dji_fly_20250203_170128_172_1738657534084_photo_optimized.jpeg",
                    "IMG_1753.jpeg",
                    "BF7ADE09-F3CC-4D0D-870E-7B4DA770FB80.jpeg",
                    "3E5E5C0B-99BF-429D-89AC-CDFBE597C77C.jpeg",
                    "IMG_0755_entree_garage_jardin.jpeg",
                    "IMG_0756_jardin_vue_large.jpeg",
                    "IMG_0757_facade_porche_jardin.jpeg",
                    "IMG_0759_jardin_vegetation.jpeg",
                    "IMG_0762_facade_terrasse_porche.jpeg",
                    "IMG_1979.jpeg",
                ],
                "documents": [
                    "38_BASE_DOCUMENTAIRE_MAITRE_V3.json",
                    "44_MATRICE_COUVERTURE_SOURCES.json",
                    "94_MASTER_FUSION_SPATIALE_MAISON_V22.json",
                ],
            },
        },
    },
    "vertical": {
        "living_split_level_m": 0.17,
        "living_cathedral_peak_m_approx": 5.0,
        "standard_ceiling_m_approx": 2.4,
        "fireplace_relation": "between_two_posts_at_living_kitchen_transition",
    },
    "exterior": {
        "pool_volume_m3_approx": 35,
        "main_paving": "grey_60x60",
        "rear_surface": "wood_look_40x120",
        "rainwater_tank_l": 4000,
        "north_reference": "satellite_IMG_0735_top",
    },
}
