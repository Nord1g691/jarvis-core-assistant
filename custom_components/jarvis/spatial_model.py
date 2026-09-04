"""Read-only spatial model exposed by JARVIS Core.

This module intentionally contains semantic/navigation data only.
Architectural geometry remains external and authoritative.
"""
from __future__ import annotations

SPATIAL_MODEL: dict = {
    "schema": "jarvis_house_spatial_runtime",
    "version": "0.2",
    "north": "top",
    "geometry_authority": "07_PLAN_MAITRE_RDC_OFFICIEL_V2_ORIENTE.png",
    "navigation": ["property", "rdc", "room"],
    "rules": [
        "Architectural plan remains the geometry authority.",
        "Hotspots are semantic anchors only.",
        "Photos are as-built evidence, not direct metric geometry.",
        "Satellite/drone become the property background only after real rasters are registered.",
    ],
    "zones": {
        "garage": {
            "label": "Garage",
            "entities": [
                "cover.smart_garage_door_2011121892665436100848e1e93b38f4_garage",
                "binary_sensor.porte_acces_garage",
                "binary_sensor.porte_cave",
                "binary_sensor.porte_jardin",
            ],
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
            ],
        },
        "dining": {
            "label": "Salle à manger",
            "level_m": 0.0,
            "entities": [
                "cover.voletsalleamanger",
                "cover.voletporte_volet_terrasse",
            ],
        },
        "kitchen": {
            "label": "Cuisine",
            "open_to": ["dining"],
            "door_to": ["cellier"],
            "entities": ["cover.voletcuisine"],
        },
        "cellier": {
            "label": "Cellier",
            "note": "Keep the exact irregular architectural footprint.",
        },
        "stairs_laundry": {
            "label": "Escalier / Buanderie",
            "note": "Architectural placard under stairs = compact laundry on right side.",
        },
        "children_bedroom": {
            "label": "Chambre enfants",
            "architectural_label": "Chambre 2",
            "entities": ["binary_sensor.ewelink_snzb_04p"],
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
        },
        "parent_bathroom": {
            "label": "SDB parentale",
            "architectural_label": "Salle d'eau",
        },
        "parent_bedroom": {
            "label": "Chambre parentale",
            "architectural_label": "Chambre 1",
        },
        "terrace_porch": {
            "label": "Terrasse / Porche",
            "entities": ["binary_sensor.ewelink_snzb_04p_3"],
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
