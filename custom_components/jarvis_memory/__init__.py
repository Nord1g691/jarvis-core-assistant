from __future__ import annotations

from datetime import datetime, timezone

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.storage import Store

DOMAIN = "jarvis_memory"
STORAGE_VERSION = 1
STORAGE_KEY = "jarvis_memory.data"
PLATFORMS = ["sensor", "text"]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    data = await store.async_load()
    hass.data[DOMAIN] = {
        "store": store,
        "memories": data.get("memories", []) if isinstance(data, dict) else [],
    }

    async def save() -> None:
        await store.async_save({"memories": hass.data[DOMAIN]["memories"]})
        for entity_id in ("sensor.jarvis_memory", "text.jarvis_memory_input"):
            entity = hass.data[DOMAIN].get(entity_id)
            if entity:
                entity.async_write_ha_state()

    async def remember(call: ServiceCall) -> None:
        text = str(call.data.get("text", "")).strip()
        category = str(call.data.get("category", "general")).strip() or "general"
        if not text:
            return
        hass.data[DOMAIN]["memories"].append({
            "text": text,
            "category": category,
            "created": datetime.now(timezone.utc).isoformat(),
        })
        await save()

    async def forget(call: ServiceCall) -> None:
        needle = str(call.data.get("text", "")).strip().lower()
        if needle:
            hass.data[DOMAIN]["memories"] = [
                m for m in hass.data[DOMAIN]["memories"]
                if needle not in m.get("text", "").lower()
            ]
            await save()

    async def clear(call: ServiceCall) -> None:
        hass.data[DOMAIN]["memories"] = []
        await save()

    hass.services.async_register(DOMAIN, "remember", remember)
    hass.services.async_register(DOMAIN, "forget", forget)
    hass.services.async_register(DOMAIN, "clear", clear)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.services.async_remove(DOMAIN, "remember")
        hass.services.async_remove(DOMAIN, "forget")
        hass.services.async_remove(DOMAIN, "clear")
        hass.data.pop(DOMAIN, None)
    return unload_ok
