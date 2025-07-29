"""Universal Controller Ticker Entity."""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional
import json

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.util import dt as dt_util

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


class UniversalControllerTicker(Entity):
    """Universal Controller Ticker that runs code periodically in the background."""

    def __init__(
        self,
        hass: HomeAssistant,
        ticker_id: str,
        name: str,
        user_code: str = "",
        html_template: str = "",
        css_styles: str = "",
        update_interval: int = 30,
        enabled: bool = True,
    ) -> None:
        """Initialize the ticker."""
        self.hass = hass
        self._ticker_id = ticker_id
        self._name = name
        self._user_code = user_code
        self._html_template = html_template
        self._css_styles = css_styles
        self._update_interval = update_interval
        self._enabled = enabled
        
        # State management
        self._state = "idle"
        self._last_execution = None
        self._execution_count = 0
        self._last_result = None
        self._last_error = None
        self._cancel_interval = None
        
        # Entity attributes
        self._attr_unique_id = f"{DOMAIN}_ticker_{ticker_id}"
        self._attr_name = f"Universal Controller Ticker: {name}"
        self._attr_icon = "mdi:timer-cog"
        
    @property
    def state(self) -> str:
        """Return the state of the ticker."""
        return self._state
    
    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """Return the state attributes."""
        return {
            "ticker_id": self._ticker_id,
            "user_code": self._user_code,
            "html_template": self._html_template,
            "css_styles": self._css_styles,
            "update_interval": self._update_interval,
            "enabled": self._enabled,
            "last_execution": self._last_execution.isoformat() if self._last_execution else None,
            "execution_count": self._execution_count,
            "last_result": self._last_result,
            "last_error": self._last_error,
        }
    
    async def async_added_to_hass(self) -> None:
        """When entity is added to hass."""
        await super().async_added_to_hass()
        if self._enabled:
            await self._start_ticker()
    
    async def async_will_remove_from_hass(self) -> None:
        """When entity will be removed from hass."""
        await self._stop_ticker()
        await super().async_will_remove_from_hass()
    
    async def _start_ticker(self) -> None:
        """Start the periodic execution."""
        if self._cancel_interval:
            self._cancel_interval()
        
        if not self._enabled or self._update_interval <= 0:
            return
            
        _LOGGER.info(f"Starting ticker {self._ticker_id} with {self._update_interval}s interval")
        
        # Execute immediately on start
        await self._execute_code()
        
        # Schedule periodic execution
        self._cancel_interval = async_track_time_interval(
            self.hass,
            self._periodic_execution,
            timedelta(seconds=self._update_interval)
        )
        
        self._state = "running"
        self.async_write_ha_state()
    
    async def _stop_ticker(self) -> None:
        """Stop the periodic execution."""
        if self._cancel_interval:
            self._cancel_interval()
            self._cancel_interval = None
        
        self._state = "stopped"
        self.async_write_ha_state()
    
    @callback
    async def _periodic_execution(self, now) -> None:
        """Periodic execution callback."""
        await self._execute_code()
    
    async def _execute_code(self) -> Dict[str, Any]:
        """Execute the user code."""
        if not self._user_code.strip():
            return {"error": "No code to execute"}
        
        self._state = "executing"
        self.async_write_ha_state()
        
        try:
            _LOGGER.debug(f"Executing code for ticker {self._ticker_id}")
            
            # Create execution context with Home Assistant access
            context = {
                "hass": self.hass,
                "states": self.hass.states,
                "services": self.hass.services,
                "console": {
                    "log": lambda *args: _LOGGER.info(f"Ticker {self._ticker_id}: {' '.join(str(arg) for arg in args)}"),
                    "error": lambda *args: _LOGGER.error(f"Ticker {self._ticker_id}: {' '.join(str(arg) for arg in args)}"),
                    "warn": lambda *args: _LOGGER.warning(f"Ticker {self._ticker_id}: {' '.join(str(arg) for arg in args)}"),
                },
                "Date": datetime,
                "JSON": json,
            }
            
            # Execute the code
            result = await self.hass.async_add_executor_job(
                self._execute_javascript, self._user_code, context
            )
            
            self._last_result = result
            self._last_error = None
            self._execution_count += 1
            self._last_execution = dt_util.utcnow()
            self._state = "running"
            
            # Fire event with execution result
            self.hass.bus.async_fire(f"universal_controller_ticker_executed", {
                "ticker_id": self._ticker_id,
                "result": result,
                "timestamp": self._last_execution.isoformat(),
                "execution_count": self._execution_count,
            })
            
            _LOGGER.debug(f"Ticker {self._ticker_id} executed successfully: {result}")
            
        except Exception as e:
            self._last_error = str(e)
            self._last_result = None
            self._state = "error"
            _LOGGER.error(f"Error executing ticker {self._ticker_id}: {e}")
            
            # Fire error event
            self.hass.bus.async_fire(f"universal_controller_ticker_error", {
                "ticker_id": self._ticker_id,
                "error": str(e),
                "timestamp": dt_util.utcnow().isoformat(),
            })
        
        finally:
            self.async_write_ha_state()
        
        return self._last_result or {"error": self._last_error}
    
    def _execute_javascript(self, code: str, context: Dict[str, Any]) -> Any:
        """Execute JavaScript/TypeScript code in a controlled environment."""
        # For now, we'll use a simple eval approach
        # In production, you might want to use a more secure sandbox
        try:
            # Simple JavaScript-like execution
            # This is a basic implementation - you might want to use a proper JS engine
            exec_globals = context.copy()
            exec_locals = {}
            
            # Execute the code
            exec(f"result = {code}", exec_globals, exec_locals)
            return exec_locals.get("result", None)
            
        except Exception as e:
            raise Exception(f"Code execution error: {e}")
    
    async def update_config(
        self,
        name: Optional[str] = None,
        user_code: Optional[str] = None,
        html_template: Optional[str] = None,
        css_styles: Optional[str] = None,
        update_interval: Optional[int] = None,
        enabled: Optional[bool] = None,
    ) -> None:
        """Update ticker configuration."""
        restart_needed = False
        
        if name is not None:
            self._name = name
            self._attr_name = f"Universal Controller Ticker: {name}"
        
        if user_code is not None:
            self._user_code = user_code
        
        if html_template is not None:
            self._html_template = html_template
        
        if css_styles is not None:
            self._css_styles = css_styles
        
        if update_interval is not None and update_interval != self._update_interval:
            self._update_interval = update_interval
            restart_needed = True
        
        if enabled is not None and enabled != self._enabled:
            self._enabled = enabled
            restart_needed = True
        
        # Restart ticker if needed
        if restart_needed:
            await self._stop_ticker()
            if self._enabled:
                await self._start_ticker()
        
        self.async_write_ha_state()
    
    def get_config(self) -> Dict[str, Any]:
        """Get ticker configuration."""
        return {
            "ticker_id": self._ticker_id,
            "name": self._name,
            "user_code": self._user_code,
            "html_template": self._html_template,
            "css_styles": self._css_styles,
            "update_interval": self._update_interval,
            "enabled": self._enabled,
            "state": self._state,
            "last_execution": self._last_execution.isoformat() if self._last_execution else None,
            "execution_count": self._execution_count,
            "last_result": self._last_result,
            "last_error": self._last_error,
        }
