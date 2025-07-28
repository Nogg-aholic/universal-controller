"""String constants for the Universal Controller integration."""

DOMAIN = "universal_controller"

# Service names
SERVICE_EXECUTE_CODE = "execute_code"
SERVICE_UPDATE_HTML = "update_html"
SERVICE_UPDATE_CSS = "update_css"

# Configuration keys
CONF_USER_CODE = "user_code"
CONF_HTML_TEMPLATE = "html_template"
CONF_CSS_STYLES = "css_styles"
CONF_UPDATE_INTERVAL = "update_interval"
CONF_NAME = "name"

# Default values
DEFAULT_NAME = "Universal Controller"
DEFAULT_UPDATE_INTERVAL = 30
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
    await hass.callService('light', 'turn_on', {
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
"""
