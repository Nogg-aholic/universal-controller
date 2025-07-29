"""Frontend handling for Universal Controller."""
from __future__ import annotations

import logging
import os
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.components.http import HomeAssistantView
from homeassistant.components.frontend import add_extra_js_url
from aiohttp import web

_LOGGER = logging.getLogger(__name__)

FRONTEND_URL_PATH = "/universal_controller"
FRONTEND_FILE_PATH = "universal-controller-card.js"


class UniversalControllerView(HomeAssistantView):
    """View to serve the Universal Controller frontend."""
    
    url = f"{FRONTEND_URL_PATH}/{FRONTEND_FILE_PATH}"
    name = "universal_controller:frontend"
    requires_auth = False
    
    def __init__(self, hass: HomeAssistant):
        """Initialize the view."""
        self.hass = hass
        
    async def get(self, request):
        """Serve the Universal Controller card JavaScript."""
        try:
            # Get the path to the JavaScript file within the integration
            integration_dir = os.path.dirname(__file__)
            js_file_path = os.path.join(integration_dir, "www", "universal-controller-card.js")
            
            if not os.path.exists(js_file_path):
                _LOGGER.error(f"Frontend file not found: {js_file_path}")
                return web.Response(text="Frontend file not found", status=404)
            
            # Read and serve the JavaScript file
            with open(js_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            return web.Response(
                text=content,
                content_type="application/javascript",
                headers={"Cache-Control": "no-cache"}
            )
            
        except Exception as e:
            _LOGGER.error(f"Error serving frontend file: {e}")
            return web.Response(text="Error serving frontend", status=500)


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Register the frontend components."""
    try:
        _LOGGER.info("🚀 STARTING FRONTEND REGISTRATION")
        
        # Check if file exists first
        integration_dir = os.path.dirname(__file__)
        js_file_path = os.path.join(integration_dir, "www", "universal-controller-card.js")
        
        if not os.path.exists(js_file_path):
            _LOGGER.error(f"❌ JAVASCRIPT FILE NOT FOUND: {js_file_path}")
            raise FileNotFoundError(f"Frontend file not found: {js_file_path}")
        
        file_size = os.path.getsize(js_file_path)
        _LOGGER.info(f"📁 Found JS file: {js_file_path} ({file_size} bytes)")
        
        # Register the view to serve the JavaScript file
        view = UniversalControllerView(hass)
        hass.http.register_view(view)
        _LOGGER.info(f"🌐 HTTP view registered: {view.url}")
        
        # Add the JavaScript URL to Home Assistant frontend
        frontend_url = f"{FRONTEND_URL_PATH}/{FRONTEND_FILE_PATH}"
        add_extra_js_url(hass, frontend_url)
        _LOGGER.info(f"🔗 JS URL added to frontend: {frontend_url}")
        
        _LOGGER.info(f"✅ FRONTEND REGISTRATION COMPLETE")
        _LOGGER.info(f"🎯 CARD TYPE: 'custom:universal-controller-card'")
        _LOGGER.info(f"🔍 CHECK BROWSER CONSOLE FOR CARD LOGS")
        
    except Exception as e:
        _LOGGER.error(f"❌ FRONTEND REGISTRATION FAILED: {e}")
        _LOGGER.error(f"🔥 Exception type: {type(e).__name__}")
        import traceback
        _LOGGER.error(f"🔥 Traceback: {traceback.format_exc()}")
        raise
