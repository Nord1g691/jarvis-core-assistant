from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import DOMAIN


async def async_setup_entry(
    hass: HomeAssistant, entry, async_add_entities: AddEntitiesCallback
) -> None:
    async_add_entities([JarvisMemorySensor(hass)])


class JarvisMemorySensor(SensorEntity):
    _attr_name = "JARVIS Memory"
    _attr_unique_id = "jarvis_memory"
    _attr_icon = "mdi:brain"

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.hass.data[DOMAIN]["sensor.jarvis_memory"] = self

    @property
    def native_value(self):
        return len(self.hass.data[DOMAIN]["memories"])

    @property
    def extra_state_attributes(self):
        return {
            "memories": self.hass.data[DOMAIN]["memories"],
            "categories": sorted({m.get("category", "general") for m in self.hass.data[DOMAIN]["memories"]}),
        }
