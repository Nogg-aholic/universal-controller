"""Ticker Manager for Universal Controller."""
from __future__ import annotations

import logging
from typing import Dict, Any, Optional, List

from homeassistant.core import HomeAssistant
from homeassistant.helpers import storage

from .ticker import UniversalControllerTicker
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

TICKER_STORAGE_VERSION = 1
TICKER_STORAGE_KEY = f"{DOMAIN}_tickers"


class TickerManager:
    """Manages Universal Controller ticker instances."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the ticker manager."""
        self.hass = hass
        self._tickers: Dict[str, UniversalControllerTicker] = {}
        self._store = storage.Store(hass, TICKER_STORAGE_VERSION, TICKER_STORAGE_KEY)

    async def async_setup(self) -> None:
        """Set up the ticker manager."""
        # Load existing tickers from storage
        await self._load_tickers()

    async def _load_tickers(self) -> None:
        """Load tickers from storage."""
        try:
            data = await self._store.async_load() or {}
            
            for ticker_id, config in data.items():
                ticker = UniversalControllerTicker(
                    self.hass,
                    ticker_id=ticker_id,
                    name=config.get("name", "Unknown Ticker"),
                    user_code=config.get("user_code", ""),
                    html_template=config.get("html_template", ""),
                    css_styles=config.get("css_styles", ""),
                    update_interval=config.get("update_interval", 30),
                    enabled=config.get("enabled", True),
                )
                
                self._tickers[ticker_id] = ticker
                
                # Add entity to Home Assistant
                entity_id = f"sensor.{DOMAIN}_ticker_{ticker_id}"
                self.hass.states.async_set(entity_id, ticker.state, ticker.extra_state_attributes)
                
                # Start the ticker if enabled
                if ticker._enabled:
                    await ticker._start_ticker()
                
                _LOGGER.info(f"Loaded ticker: {ticker_id}")
                
        except Exception as e:
            _LOGGER.error(f"Error loading tickers: {e}")

    async def _save_tickers(self) -> None:
        """Save tickers to storage."""
        try:
            data = {}
            for ticker_id, ticker in self._tickers.items():
                data[ticker_id] = ticker.get_config()
            
            await self._store.async_save(data)
            _LOGGER.debug("Tickers saved to storage")
            
        except Exception as e:
            _LOGGER.error(f"Error saving tickers: {e}")

    async def create_ticker(
        self,
        ticker_id: str,
        name: str,
        user_code: str = "",
        html_template: str = "",
        css_styles: str = "",
        update_interval: int = 30,
        enabled: bool = True,
    ) -> bool:
        """Create a new ticker."""
        if ticker_id in self._tickers:
            _LOGGER.error(f"Ticker {ticker_id} already exists")
            return False

        ticker = UniversalControllerTicker(
            self.hass,
            ticker_id=ticker_id,
            name=name,
            user_code=user_code,
            html_template=html_template,
            css_styles=css_styles,
            update_interval=update_interval,
            enabled=enabled,
        )

        self._tickers[ticker_id] = ticker
        
        # Add entity to Home Assistant
        entity_id = f"sensor.{DOMAIN}_ticker_{ticker_id}"
        self.hass.states.async_set(entity_id, ticker.state, ticker.extra_state_attributes)

        # Start the ticker if enabled
        if enabled:
            await ticker._start_ticker()

        # Save to storage
        await self._save_tickers()

        _LOGGER.info(f"Created ticker: {ticker_id}")
        return True

    async def update_ticker(
        self,
        ticker_id: str,
        name: Optional[str] = None,
        user_code: Optional[str] = None,
        html_template: Optional[str] = None,
        css_styles: Optional[str] = None,
        update_interval: Optional[int] = None,
        enabled: Optional[bool] = None,
    ) -> bool:
        """Update an existing ticker."""
        if ticker_id not in self._tickers:
            _LOGGER.error(f"Ticker {ticker_id} does not exist")
            return False

        ticker = self._tickers[ticker_id]
        await ticker.update_config(
            name=name,
            user_code=user_code,
            html_template=html_template,
            css_styles=css_styles,
            update_interval=update_interval,
            enabled=enabled,
        )

        # Update entity state
        entity_id = f"sensor.{DOMAIN}_ticker_{ticker_id}"
        self.hass.states.async_set(entity_id, ticker.state, ticker.extra_state_attributes)

        # Save to storage
        await self._save_tickers()

        _LOGGER.info(f"Updated ticker: {ticker_id}")
        return True

    async def delete_ticker(self, ticker_id: str) -> bool:
        """Delete a ticker."""
        if ticker_id not in self._tickers:
            _LOGGER.error(f"Ticker {ticker_id} does not exist")
            return False

        ticker = self._tickers[ticker_id]
        
        # Stop the ticker
        await ticker._stop_ticker()

        # Remove from tickers
        del self._tickers[ticker_id]

        # Remove entity from Home Assistant
        entity_id = f"sensor.{DOMAIN}_ticker_{ticker_id}"
        self.hass.states.async_remove(entity_id)

        # Save to storage
        await self._save_tickers()

        _LOGGER.info(f"Deleted ticker: {ticker_id}")
        return True

    async def execute_ticker(self, ticker_id: str) -> Dict[str, Any]:
        """Manually execute a ticker."""
        if ticker_id not in self._tickers:
            _LOGGER.error(f"Ticker {ticker_id} does not exist")
            return {"error": "Ticker not found"}

        ticker = self._tickers[ticker_id]
        result = await ticker._execute_code()

        # Update entity state
        entity_id = f"sensor.{DOMAIN}_ticker_{ticker_id}"
        self.hass.states.async_set(entity_id, ticker.state, ticker.extra_state_attributes)

        return result

    def get_ticker(self, ticker_id: str) -> Optional[Dict[str, Any]]:
        """Get ticker configuration and status."""
        if ticker_id not in self._tickers:
            return None

        return self._tickers[ticker_id].get_config()

    def list_tickers(self) -> Dict[str, Dict[str, Any]]:
        """List all tickers."""
        return {
            ticker_id: ticker.get_config()
            for ticker_id, ticker in self._tickers.items()
        }

    async def async_unload(self) -> None:
        """Unload all tickers."""
        for ticker in self._tickers.values():
            await ticker._stop_ticker()
        
        self._tickers.clear()
        _LOGGER.info("All tickers unloaded")
