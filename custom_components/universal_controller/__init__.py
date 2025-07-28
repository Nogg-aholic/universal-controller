"""Universal Controller Integration for Home Assistant."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .frontend import async_register_frontend

_LOGGER = logging.getLogger(__name__)

DOMAIN = "universal_controller"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Universal Controller integration."""
    _LOGGER.info("Setting up Universal Controller integration")
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Universal Controller from a config entry."""
    _LOGGER.info(f"Setting up Universal Controller entry: {entry.entry_id}")
    
    # Register frontend components
    await async_register_frontend(hass)
    
    # Store the config entry data
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "user_code": entry.data.get("user_code", ""),
        "html_template": entry.data.get("html_template", ""),
        "css_styles": entry.data.get("css_styles", ""),
    }
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.info(f"Unloading Universal Controller entry: {entry.entry_id}")
    
    if DOMAIN in hass.data:
        hass.data[DOMAIN].pop(entry.entry_id, None)
    
    return True
