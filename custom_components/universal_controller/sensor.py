"""Sensor platform for Universal Controller."""
from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import DOMAIN, UniversalControllerCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Universal Controller sensor."""
    coordinator = hass.data[DOMAIN][config_entry.entry_id]["coordinator"]
    
    async_add_entities([
        UniversalControllerSensor(coordinator, config_entry)
    ])


class UniversalControllerSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Universal Controller sensor."""

    def __init__(
        self,
        coordinator: UniversalControllerCoordinator,
        config_entry: ConfigEntry,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._config_entry = config_entry
        self._attr_name = f"Universal Controller {config_entry.data.get('name', '')}"
        self._attr_unique_id = f"{DOMAIN}_{config_entry.entry_id}"
        self._attr_icon = "mdi:code-tags"

    @property
    def native_value(self) -> str | None:
        """Return the state of the sensor."""
        if self.coordinator.data:
            return self.coordinator.data.get("status", "unknown")
        return None

    @property
    def extra_state_attributes(self) -> Dict[str, Any]:
        """Return the state attributes."""
        attributes = {
            "integration": DOMAIN,
            "entry_id": self._config_entry.entry_id,
            "user_code": self._config_entry.data.get("user_code", ""),
            "html_template": self._config_entry.data.get("html_template", ""),
            "css_styles": self._config_entry.data.get("css_styles", ""),
        }
        
        if self.coordinator.data:
            attributes.update({
                "last_update": self.coordinator.last_update_success_time,
                "result": self.coordinator.data.get("result"),
                "error": self.coordinator.data.get("error"),
            })
        
        return attributes

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self.coordinator.last_update_success
