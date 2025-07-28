"""Universal Controller Integration for Home Assistant."""
from __future__ import annotations

import logging
import asyncio
from datetime import timedelta
from typing import Any, Dict, Optional

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.service import async_register_admin_service
from homeassistant.exceptions import ConfigEntryNotReady

_LOGGER = logging.getLogger(__name__)

DOMAIN = "universal_controller"
PLATFORMS = ["sensor"]

# Service names
SERVICE_EXECUTE_CODE = "execute_code"
SERVICE_UPDATE_HTML = "update_html"
SERVICE_UPDATE_CSS = "update_css"

# Default update interval
DEFAULT_UPDATE_INTERVAL = timedelta(seconds=30)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Universal Controller integration."""
    _LOGGER.info("Setting up Universal Controller integration")
    
    # Register services
    async def handle_execute_code(call: ServiceCall) -> None:
        """Handle execute code service call."""
        entity_id = call.data.get("entity_id")
        code = call.data.get("code")
        
        if entity_id and code:
            # Find the entity and execute the code
            entity = hass.states.get(entity_id)
            if entity:
                # Execute the TypeScript/JavaScript code
                await _execute_user_code(hass, entity_id, code)
    
    async def handle_update_html(call: ServiceCall) -> None:
        """Handle update HTML service call."""
        entity_id = call.data.get("entity_id")
        html = call.data.get("html")
        
        if entity_id and html:
            # Update the HTML for the entity
            await _update_entity_html(hass, entity_id, html)
    
    async def handle_update_css(call: ServiceCall) -> None:
        """Handle update CSS service call."""
        entity_id = call.data.get("entity_id")
        css = call.data.get("css")
        
        if entity_id and css:
            # Update the CSS for the entity
            await _update_entity_css(hass, entity_id, css)
    
    # Register the services
    hass.services.async_register(
        DOMAIN, SERVICE_EXECUTE_CODE, handle_execute_code
    )
    hass.services.async_register(
        DOMAIN, SERVICE_UPDATE_HTML, handle_update_html
    )
    hass.services.async_register(
        DOMAIN, SERVICE_UPDATE_CSS, handle_update_css
    )
    
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Universal Controller from a config entry."""
    _LOGGER.info(f"Setting up Universal Controller entry: {entry.entry_id}")
    
    # Store the config entry data
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {
        "coordinator": None,
        "entities": {},
        "user_code": entry.data.get("user_code", ""),
        "html_template": entry.data.get("html_template", ""),
        "css_styles": entry.data.get("css_styles", ""),
    }
    
    # Create a data update coordinator
    coordinator = UniversalControllerCoordinator(hass, entry)
    hass.data[DOMAIN][entry.entry_id]["coordinator"] = coordinator
    
    # Fetch initial data
    await coordinator.async_refresh()
    
    # Set up platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    _LOGGER.info(f"Unloading Universal Controller entry: {entry.entry_id}")
    
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    
    return unload_ok


class UniversalControllerCoordinator(DataUpdateCoordinator):
    """Class to manage fetching data from the Universal Controller."""
    
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=DEFAULT_UPDATE_INTERVAL,
        )
        self.entry = entry
        self.user_code = entry.data.get("user_code", "")
        
    async def _async_update_data(self) -> Dict[str, Any]:
        """Update data via library."""
        try:
            # Execute user-defined code periodically
            if self.user_code:
                result = await self._execute_user_code()
                return {"status": "success", "result": result}
            return {"status": "no_code"}
        except Exception as exception:
            _LOGGER.error(f"Error updating data: {exception}")
            return {"status": "error", "error": str(exception)}
    
    async def _execute_user_code(self) -> Any:
        """Execute the user-defined TypeScript/JavaScript code."""
        try:
            # Here we would execute the user's TypeScript/JavaScript code
            # For now, we'll use a simple eval-like approach
            # In production, you'd want to use a proper JS engine like PyV8 or similar
            
            # Create a context with access to Home Assistant
            context = {
                "hass": self.hass,
                "states": self.hass.states,
                "services": self.hass.services,
                "logger": _LOGGER,
                "entry_id": self.entry.entry_id,
            }
            
            # Execute the code (this is a simplified version)
            # In a real implementation, you'd use a JavaScript engine
            result = await self._simulate_js_execution(self.user_code, context)
            return result
            
        except Exception as e:
            _LOGGER.error(f"Error executing user code: {e}")
            raise


    async def _simulate_js_execution(self, code: str, context: Dict[str, Any]) -> Any:
        """Simulate JavaScript execution (placeholder for real JS engine)."""
        # This is a placeholder - in production you'd use a real JavaScript engine
        # like PyV8, PyMiniRacer, or subprocess with Node.js
        
        _LOGGER.info(f"Simulating execution of code: {code[:100]}...")
        
        # Return some mock data for now
        return {
            "timestamp": self.hass.loop.time(),
            "entities_count": len(self.hass.states.async_all()),
            "code_length": len(code)
        }


async def _execute_user_code(hass: HomeAssistant, entity_id: str, code: str) -> None:
    """Execute user code for a specific entity."""
    _LOGGER.info(f"Executing code for entity {entity_id}")
    # Implementation for executing user code
    pass


async def _update_entity_html(hass: HomeAssistant, entity_id: str, html: str) -> None:
    """Update HTML template for an entity."""
    _LOGGER.info(f"Updating HTML for entity {entity_id}")
    # Implementation for updating HTML
    pass


async def _update_entity_css(hass: HomeAssistant, entity_id: str, css: str) -> None:
    """Update CSS styles for an entity."""
    _LOGGER.info(f"Updating CSS for entity {entity_id}")
    # Implementation for updating CSS
    pass
