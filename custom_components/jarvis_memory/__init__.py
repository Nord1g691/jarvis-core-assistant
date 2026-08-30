from __future__ import annotations

from datetime import datetime, timezone
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.storage import Store
from homeassistant.helpers import entity_registry as er

DOMAIN = "jarvis_memory"
STORAGE_VERSION = 1
STORAGE_KEY = "jarvis_memory.data"

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    data = await store.async_load()
    memories = data.get("memories", []) if isinstance(data, dict) else []
    hass.data[DOMAIN] = {"store": store, "memories": memories, "entities": set()}

    async def save() -> None:
        await store.async_save({"memories": hass.data[DOMAIN]["memories"]})
        for entity_id in list(hass.data[DOMAIN]["entities"]):
            state = hass.states.get(entity_id)
            if state:
                hass.states.async_set(entity_id, state.state, dict(state.attributes))

    async def remember(call: ServiceCall) -> None:
        text = str(call.data.get("text", "")).strip()
        category = str(call.data.get("category", "general")).strip() or "general"
        if not text:
            return
        memories = hass.data[DOMAIN]["memories"]
        memories.append({
            "text": text,
            "category": category,
            "created": datetime.now(timezone.utc).isoformat(),
        })
        await save()

    async def forget(call: ServiceCall) -> None:
        text = str(call.data.get("text", "")).strip().lower()
        memories = hass.data[DOMAIN]["memories"]
        if text:
            hass.data[DOMAIN]["memories"] = [m for m in memories if text not in m.get("text", "").lower()]
        await save()

    async def clear(call: ServiceCall) -> None:
        hass.data[DOMAIN]["memories"] = []
        await save()

    hass.services.async_register(DOMAIN, "remember", remember)
    hass.services.async_register(DOMAIN, "forget", forget)
    hass.services.async_register(DOMAIN, "clear", clear)

    await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "import"}, data={}
    ) if False else None

    from .sensor import JarvisMemorySensor
    from .text import JarvisMemoryInput
    hass.data[DOMAIN]["entities_obj"] = [JarvisMemorySensor(hass), JarvisMemoryInput(hass)]
    for entity in hass.data[DOMAIN]["entities_obj"]:
        await entity.async_added_to_hass()
        hass.data[DOMAIN]["entities"].add(entity.entity_id)
    return True

async def async_unload_entry(hass: HomeAssistant, entry) -> bool:
    return True
