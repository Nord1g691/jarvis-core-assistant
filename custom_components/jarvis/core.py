"""Structured Home Assistant snapshot for JARVIS.

This module turns raw Home Assistant states into a compact, stable view that can
be consumed by the JARVIS HUD and, later, by specialized agents and the 2D/3D
house view.
"""
from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

from homeassistant.core import HomeAssistant, State, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

TRACKED_DOMAINS = {
    "binary_sensor",
    "camera",
    "climate",
    "cover",
    "fan",
    "light",
    "lock",
    "media_player",
    "sensor",
    "switch",
}


def _safe_name(state: State) -> str:
    return str(state.attributes.get("friendly_name") or state.name or state.entity_id)


def _compact_state(state: State, area_id: str | None, area_name: str | None) -> dict[str, Any]:
    attrs = state.attributes
    return {
        "entity_id": state.entity_id,
        "domain": state.domain,
        "name": _safe_name(state),
        "state": state.state,
        "area_id": area_id,
        "area_name": area_name,
        "device_class": attrs.get("device_class"),
        "unit": attrs.get("unit_of_measurement"),
        "icon": attrs.get("icon"),
    }


@callback
def build_core_snapshot(hass: HomeAssistant) -> dict[str, Any]:
    """Build the structured JARVIS Home Assistant snapshot."""
    area_registry = ar.async_get(hass)
    device_registry = dr.async_get(hass)
    entity_registry = er.async_get(hass)

    domain_counts: Counter[str] = Counter()
    area_entities: dict[str, list[dict[str, Any]]] = defaultdict(list)
    unassigned: list[dict[str, Any]] = []

    unavailable_count = 0
    lights_on = 0
    covers_open = 0
    climate_active = 0
    media_playing = 0

    for state in hass.states.async_all():
        if state.domain not in TRACKED_DOMAINS:
            continue

        domain_counts[state.domain] += 1
        if state.state in {"unknown", "unavailable"}:
            unavailable_count += 1

        if state.domain == "light" and state.state == "on":
            lights_on += 1
        elif state.domain == "cover" and state.state not in {"closed", "unknown", "unavailable"}:
            covers_open += 1
        elif state.domain == "climate" and state.state not in {"off", "unknown", "unavailable"}:
            climate_active += 1
        elif state.domain == "media_player" and state.state == "playing":
            media_playing += 1

        area_id: str | None = None
        area_name: str | None = None

        entity_entry = entity_registry.async_get(state.entity_id)
        if entity_entry is not None:
            area_id = entity_entry.area_id
            if area_id is None and entity_entry.device_id:
                device_entry = device_registry.async_get(entity_entry.device_id)
                if device_entry is not None:
                    area_id = device_entry.area_id

        if area_id:
            area_entry = area_registry.async_get_area(area_id)
            if area_entry is not None:
                area_name = area_entry.name

        compact = _compact_state(state, area_id, area_name)
        if area_id:
            area_entities[area_id].append(compact)
        else:
            unassigned.append(compact)

    areas: list[dict[str, Any]] = []
    for area in sorted(area_registry.async_list_areas(), key=lambda item: item.name.lower()):
        entities = sorted(area_entities.get(area.id, []), key=lambda item: item["name"].lower())
        areas.append(
            {
                "area_id": area.id,
                "name": area.name,
                "icon": area.icon,
                "floor_id": area.floor_id,
                "entity_count": len(entities),
                "entities": entities,
            }
        )

    return {
        "summary": {
            "tracked_entity_count": sum(domain_counts.values()),
            "unavailable_count": unavailable_count,
            "lights_on": lights_on,
            "covers_open": covers_open,
            "climate_active": climate_active,
            "media_playing": media_playing,
            "area_count": len(areas),
            "unassigned_entity_count": len(unassigned),
        },
        "domains": dict(sorted(domain_counts.items())),
        "areas": areas,
        "unassigned": sorted(unassigned, key=lambda item: item["name"].lower()),
    }
