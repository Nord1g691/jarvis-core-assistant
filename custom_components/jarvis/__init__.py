from __future__ import annotations

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN, PLATFORMS
from .websocket import async_register as async_register_websocket

STATIC_URL = "/jarvis_static"
JARVIS_VERSION = "9.5.3"
PANEL_NAME = "jarvis-panel"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the JARVIS integration and native Home Assistant panel."""
    hass.data.setdefault(DOMAIN, {})
    async_register_websocket(hass)

    www_path = Path(__file__).parent / "www"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, str(www_path), cache_headers=False)]
    )

    # Remove a previous registration before registering the panel again.
    frontend.async_remove_panel(hass, DOMAIN)

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_NAME,
        frontend_url_path=DOMAIN,
        module_url=f"{STATIC_URL}/jarvis-panel.js?v={JARVIS_VERSION}",
        sidebar_title="JARVIS",
        sidebar_icon="mdi:robot-outline",
        require_admin=False,
        config={},
        config_panel_domain=DOMAIN,
    )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = entry.data
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    return unloaded
