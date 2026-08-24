from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, PLATFORMS
from .websocket import async_register as async_register_websocket

STATIC_URL = "/jarvis_static"
JARVIS_VERSION = "9.5.2"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the JARVIS integration."""
    hass.data.setdefault(DOMAIN, {})
    async_register_websocket(hass)

    static_path = Path(__file__).parent / "www"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, str(static_path), cache_headers=False)]
    )

    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="JARVIS",
        sidebar_icon="mdi:robot-outline",
        frontend_url_path=DOMAIN,
        config={
            "name": "jarvis-panel",
            "embed_iframe": False,
            "trust_external": False,
            "js_url": f"{STATIC_URL}/jarvis-panel.js?v={JARVIS_VERSION}",
        },
        require_admin=False,
    )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up JARVIS from a config entry."""
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = entry.data
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a JARVIS config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unloaded
