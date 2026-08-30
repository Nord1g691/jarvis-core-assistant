from __future__ import annotations

from datetime import datetime, timezone

from homeassistant.components.text import TextEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import DOMAIN


async def async_setup_entry(
    hass: HomeAssistant, entry, async_add_entities: AddEntitiesCallback
) -> None:
    async_add_entities([JarvisMemoryInput(hass)])


class JarvisMemoryInput(TextEntity):
    _attr_name = "JARVIS Memory Input"
    _attr_unique_id = "jarvis_memory_input"
    _attr_icon = "mdi:brain"
    _attr_native_max = 500
    _attr_mode = "text"

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.hass.data[DOMAIN]["text.jarvis_memory_input"] = self

    @property
    def native_value(self):
        return ""

    async def async_set_value(self, value: str) -> None:
        text = value.strip()
        if not text:
            return
        memories = self.hass.data[DOMAIN]["memories"]
        memories.append({
            "text": text,
            "category": "general",
            "created": datetime.now(timezone.utc).isoformat(),
        })
        await self.hass.data[DOMAIN]["store"].async_save({"memories": memories})
        sensor = self.hass.data[DOMAIN].get("sensor.jarvis_memory")
        if sensor:
            sensor.async_write_ha_state()
        self.async_write_ha_state()
