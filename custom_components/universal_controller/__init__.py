"""Universal Controller Integration for Home Assistant."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType
from homeassistant.helpers import storage

from .frontend import async_register_frontend
from .ticker_manager import TickerManager
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
    
    # Initialize ticker manager
    ticker_manager = TickerManager(hass)
    await ticker_manager.async_setup()
    
    # Store config entry data and services
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "name": entry.data.get("name", "Universal Controller"),
        "store": store,
        "ticker_manager": ticker_manager,
    }
    
    # Forward entry setup to sensor platform
    await hass.config_entries.async_forward_entry_setups(entry, ["sensor"])
    
    # Register services
    await _async_register_services(hass, store, ticker_manager)
    
    return True


async def _async_register_services(hass: HomeAssistant, store: storage.Store, ticker_manager: TickerManager) -> None:
    """Register Universal Controller services."""
    
    # New ticker-based services
    async def create_ticker(call: ServiceCall) -> None:
        """Create a new Universal Controller ticker."""
        ticker_id = call.data.get("ticker_id")
        name = call.data.get("name")
        user_code = call.data.get("user_code", "")
        html_template = call.data.get("html_template", "")
        css_styles = call.data.get("css_styles", "")
        update_interval = call.data.get("update_interval", 30)
        enabled = call.data.get("enabled", True)
        
        if not ticker_id or not name:
            _LOGGER.error("ticker_id and name are required for create_ticker service")
            return
        
        success = await ticker_manager.create_ticker(
            ticker_id=ticker_id,
            name=name,
            user_code=user_code,
            html_template=html_template,
            css_styles=css_styles,
            update_interval=update_interval,
            enabled=enabled,
        )
        
        if success:
            _LOGGER.info(f"Created ticker: {ticker_id}")
        else:
            _LOGGER.error(f"Failed to create ticker: {ticker_id}")
    
    async def update_ticker(call: ServiceCall) -> None:
        """Update a Universal Controller ticker."""
        ticker_id = call.data.get("ticker_id")
        
        if not ticker_id:
            _LOGGER.error("ticker_id is required for update_ticker service")
            return
        
        success = await ticker_manager.update_ticker(
            ticker_id=ticker_id,
            name=call.data.get("name"),
            user_code=call.data.get("user_code"),
            html_template=call.data.get("html_template"),
            css_styles=call.data.get("css_styles"),
            update_interval=call.data.get("update_interval"),
            enabled=call.data.get("enabled"),
        )
        
        if success:
            _LOGGER.info(f"Updated ticker: {ticker_id}")
        else:
            _LOGGER.error(f"Failed to update ticker: {ticker_id}")
    
    async def delete_ticker(call: ServiceCall) -> None:
        """Delete a Universal Controller ticker."""
        ticker_id = call.data.get("ticker_id")
        
        if not ticker_id:
            _LOGGER.error("ticker_id is required for delete_ticker service")
            return
        
        success = await ticker_manager.delete_ticker(ticker_id)
        
        if success:
            _LOGGER.info(f"Deleted ticker: {ticker_id}")
        else:
            _LOGGER.error(f"Failed to delete ticker: {ticker_id}")
    
    async def get_ticker(call: ServiceCall) -> None:
        """Get a Universal Controller ticker configuration."""
        ticker_id = call.data.get("ticker_id")
        
        if not ticker_id:
            _LOGGER.error("ticker_id is required for get_ticker service")
            return
        
        config = ticker_manager.get_ticker(ticker_id)
        
        if config:
            _LOGGER.info(f"Retrieved ticker config: {ticker_id}")
            # Fire event with ticker configuration
            hass.bus.async_fire(f"universal_controller_ticker_config", {
                "ticker_id": ticker_id,
                "config": config
            })
        else:
            _LOGGER.error(f"Ticker not found: {ticker_id}")
    
    async def list_tickers(call: ServiceCall) -> None:
        """List all Universal Controller tickers."""
        tickers = ticker_manager.list_tickers()
        
        _LOGGER.info(f"Retrieved {len(tickers)} tickers")
        
        # Fire event with all tickers
        hass.bus.async_fire("universal_controller_tickers_list", {
            "tickers": tickers
        })
    
    async def execute_ticker(call: ServiceCall) -> None:
        """Execute a Universal Controller ticker manually."""
        ticker_id = call.data.get("ticker_id")
        
        if not ticker_id:
            _LOGGER.error("ticker_id is required for execute_ticker service")
            return
        
        result = await ticker_manager.execute_ticker(ticker_id)
        
        _LOGGER.info(f"Executed ticker {ticker_id}: {result}")
        
        # Fire event with execution result
        hass.bus.async_fire(f"universal_controller_ticker_manual_execution", {
            "ticker_id": ticker_id,
            "result": result
        })
    
    # Legacy card-based services (deprecated but maintained for compatibility)
    async def save_config(call: ServiceCall) -> None:
        """Save configuration for a Universal Controller card (LEGACY)."""
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
        """Load configuration for a Universal Controller card (LEGACY)."""
        card_id = call.data.get("card_id")
        
        if not card_id:
            _LOGGER.error("No card_id provided for load_config service")
            return
            
        data = await store.async_load() or {}
        config = data.get(card_id, {})
        
        _LOGGER.info(f"Loaded configuration for card: {card_id}, config: {config}")
        
        # Fire event with the loaded configuration
        hass.bus.async_fire(f"universal_controller_config_loaded_{card_id}", {
            "card_id": card_id,
            "config": config
        })
        
        # Also fire a general event
        hass.bus.async_fire("universal_controller_config_loaded", {
            "card_id": card_id,
            "config": config
        })
    
    async def get_all_configs(call: ServiceCall) -> None:
        """Get all stored configurations (LEGACY)."""
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
    
    # Register new ticker services
    hass.services.async_register(DOMAIN, "create_ticker", create_ticker)
    hass.services.async_register(DOMAIN, "update_ticker", update_ticker)
    hass.services.async_register(DOMAIN, "delete_ticker", delete_ticker)
    hass.services.async_register(DOMAIN, "get_ticker", get_ticker)
    hass.services.async_register(DOMAIN, "list_tickers", list_tickers)
    hass.services.async_register(DOMAIN, "execute_ticker", execute_ticker)
    
    # Register legacy services
    hass.services.async_register(DOMAIN, "save_config", save_config)
    hass.services.async_register(DOMAIN, "load_config", load_config)
    hass.services.async_register(DOMAIN, "get_all_configs", get_all_configs)
    hass.services.async_register(DOMAIN, "register_frontend", register_frontend)
    
    _LOGGER.info("Universal Controller services registered (including new ticker services)")


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.info(f"Unloading Universal Controller entry: {entry.entry_id}")
    
    # Unload platforms
    unload_ok = await hass.config_entries.async_unload_platforms(entry, ["sensor"])
    
    # Unload ticker manager
    if DOMAIN in hass.data and entry.entry_id in hass.data[DOMAIN]:
        entry_data = hass.data[DOMAIN][entry.entry_id]
        if "ticker_manager" in entry_data:
            await entry_data["ticker_manager"].async_unload()
    
    # Remove services when last entry is unloaded
    if DOMAIN in hass.data:
        hass.data[DOMAIN].pop(entry.entry_id, None)
        
        # If no more entries, remove services
        if not hass.data[DOMAIN]:
            # Remove ticker services
            hass.services.async_remove(DOMAIN, "create_ticker")
            hass.services.async_remove(DOMAIN, "update_ticker")
            hass.services.async_remove(DOMAIN, "delete_ticker")
            hass.services.async_remove(DOMAIN, "get_ticker")
            hass.services.async_remove(DOMAIN, "list_tickers")
            hass.services.async_remove(DOMAIN, "execute_ticker")
            
            # Remove legacy services
            hass.services.async_remove(DOMAIN, "save_config")
            hass.services.async_remove(DOMAIN, "load_config") 
            hass.services.async_remove(DOMAIN, "get_all_configs")
            hass.services.async_remove(DOMAIN, "register_frontend")
            _LOGGER.info("Universal Controller services removed")
    
    return unload_ok
