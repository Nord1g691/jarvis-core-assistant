from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import EntityCategory

from . import DOMAIN


class JarvisMemorySensor(SensorEntity):
    _attr_name = "JARVIS Memory"
    _attr_unique_id = "jarvis_memory"
    _attr_icon = "mdi:brain"
    _attr_entity_category = EntityCategory.DIAGNOSTIC

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._attr_native_value = 0

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.hass.data[DOMAIN]["sensor.jarvis_memory"] = self
        self.async_write_ha_state()

    @property
    def native_value(self):
        return len(self.hass.data[DOMAIN]["memories"])

    @property
    def extra_state_attributes(self):
        memories = self.hass.data[DOMAIN]["memories"]
        return {
            "memories": memories,
            "categories": sorted({m.get("category", "general") for m in memories}),
        }
