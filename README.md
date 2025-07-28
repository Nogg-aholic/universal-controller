# Universal Controller - Home Assistant Custom Integration

A powerful Home Assistant custom integration that provides a universal control card with three configurable areas:

1. **TypeScript/JavaScript Code** - Runs with full access to Home Assistant API
2. **HTML Template** - For visual card representation  
3. **CSS Styling** - For card presentation

## 🌟 Features

- **Live Code Editor** with TypeScript/JavaScript execution
- **Full HA Access**: Access to all `hass.states`, `hass.services` and more
- **Visual Design**: HTML and CSS directly editable in the interface
- **Tab Interface**: Switch between Preview, Code, HTML and CSS tabs
- **Live Preview**: Immediate preview of changes
- **Error Handling**: Execution errors are displayed
- **Local Storage**: Configuration persisted locally in browser

## 📁 Installation

### 🏪 HACS Installation (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Nogg-aholic&repository=universal-controller&category=integration)

1. **Open HACS** in Home Assistant
2. **Integrations** > **Custom repositories**
3. **Add Repository URL**: `https://github.com/Nogg-aholic/universal-controller`
4. **Category**: Integration
5. **Search for "Universal Controller"** and install
6. **Restart Home Assistant**
7. **Add Integration**: Go to Settings > Integrations > Add Integration > Universal Controller

**The card is automatically served by the integration - no manual resource registration needed!**

### 🔧 Manual Installation

1. Copy the `custom_components/universal_controller` folder to your Home Assistant `custom_components` directory
2. Restart Home Assistant  
3. Add the integration via Settings > Integrations

**The frontend card is automatically served at `/universal_controller/universal-controller-card.js`**
## � Usage

### 1. Add Integration

1. Go to **Settings** > **Integrations**
2. Click **Add Integration**
3. Search for "Universal Controller"
4. Follow the configuration wizard

### 2. Add Card to Dashboard

1. Edit your dashboard
2. Click **Add Card**
3. Search for "Universal Controller Card"
4. Configure the card

The card will be available immediately - no manual resource registration required!

## 💻 Code Examples

### TypeScript/JavaScript Code

```typescript
// Access all Home Assistant entities
const lights = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('light.')
);

const sensors = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('sensor.')
);

// Call services
if (new Date().getHours() >= 18) {
    await hass.callService('light', 'turn_on', {
        entity_id: 'light.living_room',
        brightness: 128,
        color_name: 'warm_white'
    });
}

// Temperature-based climate control
const temperature = parseFloat(hass.states['sensor.temperature']?.state);
if (temperature > 25) {
    await hass.callService('climate', 'set_temperature', {
        entity_id: 'climate.living_room',
        temperature: 22
    });
}

// Return data for the template
return {
    lights_count: lights.length,
    sensors_count: sensors.length,
    current_temp: temperature,
    is_evening: new Date().getHours() >= 18,
    timestamp: new Date().toISOString()
};
```

### HTML Template

```html
<div class="controller-dashboard">
    <div class="header">
        <h2>Smart Home Status</h2>
        <div class="time">{{ data.timestamp }}</div>
    </div>
    
    <div class="metrics">
        <div class="metric-card">
            <span class="label">Lights</span>
            <span class="value">{{ data.lights_count }}</span>
        </div>
        
        <div class="metric-card">
            <span class="label">Sensors</span>
            <span class="value">{{ data.sensors_count }}</span>
        </div>
        
        <div class="metric-card">
            <span class="label">Temperature</span>
            <span class="value">{{ data.current_temp }}°C</span>
        </div>
    </div>
    
    <div class="actions">
        <button onclick="toggleLights()" class="action-btn">
            🌟 Toggle Lights
        </button>
        <button onclick="setComfortMode()" class="action-btn">
            🏠 Comfort Mode
        </button>
    </div>
</div>
```

### CSS Styling

```css
.controller-dashboard {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 16px;
}

.metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.metric-card {
    background: rgba(255,255,255,0.1);
    padding: 16px;
    border-radius: 12px;
    text-align: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
}

.metric-card .label {
    display: block;
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 8px;
}

.metric-card .value {
    display: block;
    font-size: 1.8rem;
    font-weight: 600;
}

.actions {
    display: flex;
    gap: 12px;
}

.action-btn {
    flex: 1;
    padding: 12px 20px;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 8px;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.action-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}
```

## 🛠 Technical Details

Since v1.2.0, Universal Controller is a **frontend-only integration**:

- **No Services**: The integration no longer provides Home Assistant services
- **No Entities**: No sensor entities are created 
- **Self-Contained**: The card works standalone with localStorage persistence
- **Frontend Card**: Served directly from the integration at `/universal_controller/universal-controller-card.js`
- **Auto-Registration**: Automatically appears in Home Assistant's card picker

### Card Configuration

The card accepts these configuration options:

```yaml
type: custom:universal-controller-card
name: "My Controller"           # Optional: Display name
user_code: "..."               # Optional: Default TypeScript code
html_template: "..."           # Optional: Default HTML template  
css_styles: "..."              # Optional: Default CSS styles
show_code_editor: true         # Optional: Show code editor tabs
update_interval: 30000         # Optional: Code execution interval (ms)
```

## 🎯 Use Cases

### Climate Control

```typescript
const temp = parseFloat(hass.states['sensor.outside_temperature'].state);
const humidity = parseFloat(hass.states['sensor.humidity'].state);

// Smart climate control
if (temp > 26 && humidity > 70) {
    await hass.callService('climate', 'set_hvac_mode', {
        entity_id: 'climate.living_room',
        hvac_mode: 'cool'
    });
}

return { temp, humidity, ac_active: temp > 26 };
```

### Light Automation

```typescript
const motion = hass.states['binary_sensor.motion'].state === 'on';
const lux = parseFloat(hass.states['sensor.illuminance'].state);

if (motion && lux < 100) {
    await hass.callService('light', 'turn_on', {
        entity_id: 'light.hallway',
        brightness_pct: Math.max(20, 100 - lux)
    });
}

return { motion, lux, auto_light: motion && lux < 100 };
```

### Energy Management

```typescript
const power = parseFloat(hass.states['sensor.power_consumption'].state);
const price = parseFloat(hass.states['sensor.electricity_price'].state);

// Energy-saving devices during high prices
if (price > 0.30) {
    await hass.callService('switch', 'turn_off', {
        entity_id: 'switch.water_heater'
    });
}

return { 
    power_usage: power,
    current_price: price,
    saving_mode: price > 0.30
};
```

## 🔧 Development

### Build

```bash
cd www/universal-controller
npm run build
```

### Development Server

```bash
npm run dev
```

### Watch Mode

```bash
npm run serve
```

## 📝 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📞 Support

- GitHub Issues: [Repository Issues](https://github.com/Nogg-aholic/universal-controller)
- Home Assistant Community: [Forum Thread](https://community.home-assistant.io/)

---

**Universal Controller** - The ultimate Home Assistant integration for custom TypeScript code, HTML templates, and CSS styling! 🚀
