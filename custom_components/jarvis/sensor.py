from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.const import UnitOfPower
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, CoordinatorEntity
from homeassistant.config_entries import ConfigEntry

from .const import DOMAIN

ROLE_KEYWORDS = {
    "solar_production": ("production solaire", "solar production", "production", "pv", "photovolta"),
    "house_consumption": ("consommation", "consumption", "load", "maison", "home"),
    "grid_import": ("import réseau", "grid import", "import", "achat réseau"),
    "grid_export": ("export réseau", "grid export", "export", "injection", "vente réseau"),
    "net_power": ("puissance nette", "net power", "net", "grid power", "puissance réseau"),
}

@dataclass
class SolarSnapshot:
    values: dict[str, float | None]
    source_entities: dict[str, str | None]


def _text(state) -> str:
    if not state:
        return ""
    attrs = state.attributes
    return " ".join(
        str(x).lower()
        for x in (
            state.entity_id,
            attrs.get("friendly_name", ""),
            attrs.get("device_class", ""),
            attrs.get("unit_of_measurement", ""),
        )
    )


def _number(state) -> float | None:
    if not state or state.state in ("unknown", "unavailable"):
        return None
    try:
        return float(state.state)
    except (TypeError, ValueError):
        return None


def _score(state, role: str) -> int:
    text = _text(state)
    score = 0
    for keyword in ROLE_KEYWORDS[role]:
        if keyword in text:
            score += 3
    if state and state.attributes.get("unit_of_measurement") in ("W", "kW"):
        score += 2
    if state and state.attributes.get("device_class") == "power":
        score += 2
    if role == "solar_production" and any(x in text for x in ("envoy", "enphase")):
        score += 5
    return score


class SolarCoordinator(DataUpdateCoordinator[SolarSnapshot]):
    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        super().__init__(
            hass,
            logger=__import__("logging").getLogger(__name__),
            name="JARVIS solar",
            update_interval=None,
        )
        self.data = self._build_snapshot()

    @callback
    def _build_snapshot(self) -> SolarSnapshot:
        states = [s for s in self.hass.states.async_all() if s.entity_id.startswith("sensor.")]
        selected: dict[str, tuple[int, Any]] = {}
        for role in ROLE_KEYWORDS:
            for state in states:
                value = _number(state)
                if value is None:
                    continue
                score = _score(state, role)
                if score <= 0:
                    continue
                previous = selected.get(role)
                if previous is None or score > previous[0]:
                    selected[role] = (score, state)

        values: dict[str, float | None] = {}
        sources: dict[str, str | None] = {}
        for role in ROLE_KEYWORDS:
            item = selected.get(role)
            values[role] = _number(item[1]) if item else None
            sources[role] = item[1].entity_id if item else None

        # Normalize kW → W so every JARVIS sensor uses W.
        for role, entity_id in sources.items():
            if entity_id:
                st = self.hass.states.get(entity_id)
                if st and st.attributes.get("unit_of_measurement") == "kW" and values[role] is not None:
                    values[role] *= 1000

        production = values["solar_production"]
        consumption = values["house_consumption"]
        if production is not None and consumption is not None:
            values["self_consumption"] = min(production, consumption)
        else:
            values["self_consumption"] = None

        return SolarSnapshot(values, sources)

    @callback
    def refresh_from_state_change(self, _event=None) -> None:
        self.async_set_updated_data(self._build_snapshot())


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback) -> None:
    coordinator = SolarCoordinator(hass)
    hass.data.setdefault(DOMAIN, {}).setdefault(entry.entry_id, {})["solar_coordinator"] = coordinator

    entities = [
        ("solar_production", "Production solaire", "☀️"),
        ("house_consumption", "Consommation maison", "🏠"),
        ("grid_import", "Import réseau", "↙️"),
        ("grid_export", "Export réseau", "↗️"),
        ("net_power", "Puissance réseau", "⚡"),
        ("self_consumption", "Autoconsommation solaire", "🌱"),
    ]
    async_add_entities([JarvisSolarSensor(coordinator, role, name, icon) for role, name, icon in entities])

    async def refresh(_event=None):
        coordinator.refresh_from_state_change(_event)

    unsub = async_track_state_change_event(hass, [s.entity_id for s in hass.states.async_all()], refresh)
    hass.data[DOMAIN][entry.entry_id]["solar_unsub"] = unsub


class JarvisSolarSensor(CoordinatorEntity[SolarCoordinator], SensorEntity):
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_state_class = "measurement"
    _attr_device_class = "power"

    def __init__(self, coordinator: SolarCoordinator, role: str, name: str, icon: str) -> None:
        super().__init__(coordinator)
        self.role = role
        self._attr_name = f"JARVIS {name}"
        self._attr_unique_id = f"jarvis_{role}"
        self._attr_icon = "mdi:solar-power" if "solar" in role else "mdi:flash"
        self._attr_extra_state_attributes = {"role": role, "source_entity": None, "icon_hint": icon}

    @property
    def native_value(self):
        return self.coordinator.data.values.get(self.role)

    @property
    def extra_state_attributes(self):
        return {
            "role": self.role,
            "source_entity": self.coordinator.data.source_entities.get(self.role),
        }
