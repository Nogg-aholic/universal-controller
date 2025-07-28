"""Config flow for Universal Controller integration."""
from __future__ import annotations

import logging
from typing import Any, Dict, Optional

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.exceptions import HomeAssistantError

from . import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Default templates
DEFAULT_USER_CODE = """
// TypeScript/JavaScript code that runs periodically
// Full access to Home Assistant API

// Example: Get all lights and log their states
const lights = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('light.')
);

console.log(`Found ${lights.length} lights`);

// Example: Control a light based on time
const now = new Date();
const isEvening = now.getHours() >= 18;

if (isEvening) {
    // Turn on evening lights
    hass.services.call('light', 'turn_on', {
        entity_id: 'light.living_room',
        brightness: 128
    });
}

// Return data for the card
return {
    lights_count: lights.length,
    current_time: now.toISOString(),
    is_evening: isEvening
};
"""

DEFAULT_HTML_TEMPLATE = """
<div class="universal-controller-card">
    <div class="header">
        <h2>Universal Controller</h2>
        <div class="status-indicator" :class="{ active: data.is_evening }"></div>
    </div>
    
    <div class="content">
        <div class="metric">
            <span class="label">Lights Found:</span>
            <span class="value">{{ data.lights_count }}</span>
        </div>
        
        <div class="metric">
            <span class="label">Current Time:</span>
            <span class="value">{{ data.current_time }}</span>
        </div>
        
        <div class="actions">
            <button @click="executeAction('toggle_lights')" class="action-btn">
                Toggle Lights
            </button>
            <button @click="executeAction('refresh')" class="action-btn secondary">
                Refresh
            </button>
        </div>
        
        <div class="code-section">
            <h3>Live Code Editor</h3>
            <textarea v-model="userCode" class="code-editor" placeholder="Enter TypeScript/JavaScript code..."></textarea>
            <button @click="executeCode" class="execute-btn">Execute Code</button>
        </div>
    </div>
</div>
"""

DEFAULT_CSS_STYLES = """
.universal-controller-card {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    font-family: var(--paper-font-body1_-_font-family);
    max-width: 600px;
    margin: 0 auto;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--divider-color, #e0e0e0);
    padding-bottom: 15px;
}

.header h2 {
    margin: 0;
    color: var(--primary-text-color, #333);
    font-size: 1.5rem;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--disabled-text-color, #ccc);
    transition: background 0.3s ease;
}

.status-indicator.active {
    background: var(--success-color, #4caf50);
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.content {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--divider-color, #f0f0f0);
}

.metric .label {
    font-weight: 500;
    color: var(--secondary-text-color, #666);
}

.metric .value {
    font-weight: 600;
    color: var(--primary-text-color, #333);
}

.actions {
    display: flex;
    gap: 10px;
    margin: 15px 0;
}

.action-btn {
    flex: 1;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    background: var(--primary-color, #2196f3);
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-btn:hover {
    background: var(--primary-color-dark, #1976d2);
    transform: translateY(-1px);
}

.action-btn.secondary {
    background: var(--secondary-color, #757575);
}

.action-btn.secondary:hover {
    background: var(--secondary-color-dark, #424242);
}

.code-section {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 8px;
    background: var(--code-editor-background, #f8f9fa);
}

.code-section h3 {
    margin: 0 0 10px 0;
    font-size: 1.1rem;
    color: var(--primary-text-color, #333);
}

.code-editor {
    width: 100%;
    min-height: 150px;
    padding: 12px;
    border: 1px solid var(--border-color, #ddd);
    border-radius: 6px;
    font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.4;
    background: white;
    resize: vertical;
}

.execute-btn {
    margin-top: 10px;
    padding: 8px 16px;
    background: var(--success-color, #4caf50);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.execute-btn:hover {
    background: var(--success-color-dark, #388e3c);
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
    .universal-controller-card {
        background: var(--card-background-color, #1e1e1e);
    }
    
    .code-editor {
        background: var(--code-editor-background, #2d2d2d);
        color: var(--primary-text-color, #fff);
        border-color: var(--border-color, #444);
    }
}
"""

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required("name", default="Universal Controller"): str,
        vol.Optional("user_code", default=DEFAULT_USER_CODE): str,
        vol.Optional("html_template", default=DEFAULT_HTML_TEMPLATE): str,
        vol.Optional("css_styles", default=DEFAULT_CSS_STYLES): str,
    }
)


class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Universal Controller."""

    VERSION = 1

    async def async_step_user(
        self, user_input: Optional[Dict[str, Any]] = None
    ) -> FlowResult:
        """Handle the initial step."""
        if user_input is None:
            return self.async_show_form(
                step_id="user", data_schema=STEP_USER_DATA_SCHEMA
            )

        errors = {}

        try:
            # Validate the user input
            await self._test_user_code(user_input["user_code"])
        except CannotConnect:
            errors["base"] = "cannot_connect"
        except InvalidCode:
            errors["user_code"] = "invalid_code"
        except Exception:  # pylint: disable=broad-except
            _LOGGER.exception("Unexpected exception")
            errors["base"] = "unknown"
        else:
            return self.async_create_entry(title=user_input["name"], data=user_input)

        return self.async_show_form(
            step_id="user", data_schema=STEP_USER_DATA_SCHEMA, errors=errors
        )

    async def _test_user_code(self, user_code: str) -> None:
        """Validate the user code."""
        # Basic validation - check if code is not empty and has some structure
        if not user_code.strip():
            raise InvalidCode("Code cannot be empty")
        
        # Additional validation could be added here
        # For example, syntax checking with a JavaScript parser


class CannotConnect(HomeAssistantError):
    """Error to indicate we cannot connect."""


class InvalidCode(HomeAssistantError):
    """Error to indicate there is invalid user code."""
