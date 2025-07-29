"""Universal Controller Integration for Home Assistant."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType
from homeassistant.helpers import storage

from .frontend import async_register_frontend
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}_configs"


async def _ensure_frontend_registered(hass: HomeAssistant) -> None:
    """Ensure frontend is registered, handling updates gracefully."""
    try:
        _LOGGER.info("🚀 FORCING frontend registration...")
        await async_register_frontend(hass)
        _LOGGER.info("✅ Frontend registration completed")
    except Exception as e:
        _LOGGER.error(f"❌ Frontend registration failed: {e}")
        # Don't raise - let the integration continue to work


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Universal Controller integration."""
    _LOGGER.info("🔧 async_setup called - Setting up Universal Controller integration")
    
    # Ensure frontend is registered
    await _ensure_frontend_registered(hass)
    
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Universal Controller from a config entry."""
    _LOGGER.info(f"🔧 async_setup_entry called - Setting up Universal Controller entry: {entry.entry_id}")
    
    # Ensure frontend is registered (critical for updates!)
    await _ensure_frontend_registered(hass)
    
    # Initialize storage
    store = storage.Store(hass, STORAGE_VERSION, STORAGE_KEY)
    
    # Store minimal config entry data and storage reference
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "name": entry.data.get("name", "Universal Controller"),
        "store": store,
    }
    
    # Register services
    await _async_register_services(hass, store)
    
    return True


async def _async_register_services(hass: HomeAssistant, store: storage.Store) -> None:
    """Register Universal Controller services."""
    
    async def save_config(call: ServiceCall) -> None:
        """Save configuration for a Universal Controller card."""
        card_id = call.data.get("card_id")
        user_code = call.data.get("user_code", "")
        html_template = call.data.get("html_template", "")
        css_styles = call.data.get("css_styles", "")
        
        if not card_id:
            _LOGGER.error("No card_id provided for save_config service")
            return
            
        # Load existing data
        data = await store.async_load() or {}
        
        # Save new config
        data[card_id] = {
            "user_code": user_code,
            "html_template": html_template,
            "css_styles": css_styles,
            "timestamp": hass.loop.time(),
        }
        
        await store.async_save(data)
        _LOGGER.info(f"Saved configuration for card: {card_id}")
    
    async def load_config(call: ServiceCall) -> None:
        """Load configuration for a Universal Controller card."""
        card_id = call.data.get("card_id")
        
        if not card_id:
            _LOGGER.error("No card_id provided for load_config service")
            return
            
        data = await store.async_load() or {}
        config = data.get(card_id, {})
        
        _LOGGER.info(f"Loaded configuration for card: {card_id}")
        
        # Fire event with the loaded configuration
        hass.bus.async_fire("universal_controller_config_loaded", {
            "card_id": card_id,
            "config": config
        })
    
    async def get_all_configs(call: ServiceCall) -> None:
        """Get all stored configurations."""
        data = await store.async_load() or {}
        
        _LOGGER.info(f"Retrieved {len(data)} stored configurations")
        
        # Fire event with all configurations
        hass.bus.async_fire("universal_controller_all_configs", {
            "configs": data
        })
    
    async def register_frontend(call: ServiceCall) -> None:
        """Manually register the frontend (useful for updates)."""
        _LOGGER.info("🔧 Manual frontend registration requested")
        await _ensure_frontend_registered(hass)
    
    # Register services
    hass.services.async_register(DOMAIN, "save_config", save_config)
    hass.services.async_register(DOMAIN, "load_config", load_config)
    hass.services.async_register(DOMAIN, "get_all_configs", get_all_configs)
    hass.services.async_register(DOMAIN, "register_frontend", register_frontend)
    
    _LOGGER.info("Universal Controller services registered")


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.info(f"Unloading Universal Controller entry: {entry.entry_id}")
    
    # Remove services when last entry is unloaded
    if DOMAIN in hass.data:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        
        # If no more entries, remove services
        if not hass.data[DOMAIN]:
            hass.services.async_remove(DOMAIN, "save_config")
            hass.services.async_remove(DOMAIN, "load_config") 
            hass.services.async_remove(DOMAIN, "get_all_configs")
            hass.services.async_remove(DOMAIN, "register_frontend")
            _LOGGER.info("Universal Controller services removed")
    
    return True
