# Universal Controller - Home Assistant Custom Integration

Eine universelle Home Assistant Integration, die **drei konfigurierbare Eingabebereiche** bietet:

1. **TypeScript/JavaScript Code** - Periodisch ausgeführt mit vollständigem Zugriff auf alle Home Assistant Geräte und Entitäten
2. **HTML Template** - Für die visuelle Darstellung der Karte
3. **CSS Styling** - Für die Gestaltung der Karte

## 🌟 Features

- **Live Code-Ausführung**: TypeScript/JavaScript Code der periodisch läuft
- **Vollständiger HA-Zugriff**: Zugriff auf alle `hass.states`, `hass.services` und mehr
- **Visuelle Gestaltung**: HTML und CSS direkt im Interface editierbar
- **Tab-Interface**: Wechsel zwischen Preview, Code, HTML und CSS
- **Live Preview**: Sofortige Vorschau der Änderungen
- **Fehlerbehandlung**: Ausführungsfehler werden angezeigt
- **Persistierung**: Konfiguration wird in Home Assistant gespeichert

## 📁 Installation

### 🏪 HACS Installation (Empfohlen)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Nogg-aholic&repository=universal-controller&category=integration)

1. **HACS öffnen** in Home Assistant
2. **Integrationen** > **Custom repositories**
3. **Repository URL** hinzufügen: `https://github.com/Nogg-aholic/universal-controller`
4. **Kategorie**: Integration
5. **Universal Controller** suchen und installieren
6. **Home Assistant neu starten**

### ⚠️ **WICHTIG: Frontend-Karte registrieren**

Nach der HACS-Installation müssen Sie die Karte manuell registrieren:

#### **Option 1: Über Einstellungen (UI)**
1. **Einstellungen** > **Dashboards** > **Ressourcen**
2. **"Ressource hinzufügen"**
3. **URL:** `/local/universal-controller-card.js`
4. **Ressourcentyp:** `JavaScript Module`

#### **Option 2: Über configuration.yaml**
```yaml
lovelace:
  resources:
    - url: /local/universal-controller-card.js
      type: module
```

**Nach dem Hinzufügen der Ressource können Sie die Karte verwenden!**

### 🔧 Manuelle Installation

#### 1. Custom Integration kopieren

Kopieren Sie den `custom_components/universal_controller` Ordner in Ihr Home Assistant `custom_components` Verzeichnis:

```
homeassistant/
├── custom_components/
│   └── universal_controller/
│       ├── __init__.py
│       ├── manifest.json
│       ├── config_flow.py
│       ├── sensor.py
│       ├── const.py
│       └── services.yaml
```

#### 2. Frontend-Karte installieren

Kopieren Sie den `www/universal-controller` Ordner in Ihr Home Assistant `www` Verzeichnis und bauen Sie die Karte:

```bash
cd www/universal-controller
npm install
npm run build
```

#### 3. Automatische Installation

Verwenden Sie das PowerShell-Installationsskript:

```powershell
.\install.ps1
```

#### 4. Karte ist automatisch verfügbar

Die Universal Controller Karte wird automatisch von der Python-Integration bereitgestellt. Keine manuelle Ressourcenregistrierung erforderlich!

**Sie können die Karte sofort in Ihrem Dashboard verwenden:**

1. **Dashboard bearbeiten** und auf "Karte hinzufügen" klicken
2. **"Universal Controller Card"** suchen und auswählen  
3. **Karte konfigurieren** mit:
   - Entity (optional): Verknüpfung zu einem Universal Controller Sensor
   - Name: Anzeigename für die Karte
4. **Die drei Tabs verwenden**:
   - **Code-Tab**: TypeScript/JavaScript-Code mit Zugriff auf Home Assistant
   - **HTML-Tab**: Benutzerdefinierte HTML-Templates mit Datenbindung
   - **CSS-Tab**: Styling für Ihre benutzerdefinierten Elemente

## 🚀 Verwendung

### 1. Integration hinzufügen

1. Gehen Sie zu **Einstellungen** > **Integrationen**
2. Klicken Sie auf **Integration hinzufügen**
3. Suchen Sie nach "Universal Controller"
4. Folgen Sie dem Konfigurationsassistenten

### 2. Karte zum Dashboard hinzufügen

```yaml
type: custom:universal-controller-card
entity: sensor.universal_controller_ihre_instanz
name: Mein Universal Controller
show_code_editor: true
update_interval: 30000
```

## 💻 Code-Beispiele

### TypeScript/JavaScript Code

```typescript
// Zugriff auf alle Home Assistant Entitäten
const lights = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('light.')
);

const sensors = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('sensor.')
);

// Dienste aufrufen
if (new Date().getHours() >= 18) {
    await hass.callService('light', 'turn_on', {
        entity_id: 'light.living_room',
        brightness: 128,
        color_name: 'warm_white'
    });
}

// Temperatur-basierte Klimasteuerung
const temperature = parseFloat(hass.states['sensor.temperature']?.state);
if (temperature > 25) {
    await hass.callService('climate', 'set_temperature', {
        entity_id: 'climate.living_room',
        temperature: 22
    });
}

// Daten für das Template zurückgeben
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
            <span class="label">Lichter</span>
            <span class="value">{{ data.lights_count }}</span>
        </div>
        
        <div class="metric-card">
            <span class="label">Sensoren</span>
            <span class="value">{{ data.sensors_count }}</span>
        </div>
        
        <div class="metric-card">
            <span class="label">Temperatur</span>
            <span class="value">{{ data.current_temp }}°C</span>
        </div>
    </div>
    
    <div class="actions">
        <button onclick="toggleLights()" class="action-btn">
            🌟 Lichter umschalten
        </button>
        <button onclick="setComfortMode()" class="action-btn">
            🏠 Komfortmodus
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

## 🛠 API

### Services

Die Integration stellt folgende Services zur Verfügung:

- `universal_controller.execute_code`: Code ausführen
- `universal_controller.update_html`: HTML Template aktualisieren  
- `universal_controller.update_css`: CSS Styles aktualisieren

### Entität-Attribute

Die Sensor-Entität speichert:

- `user_code`: Der TypeScript/JavaScript Code
- `html_template`: Das HTML Template
- `css_styles`: Die CSS Styles
- `last_update`: Zeitstempel der letzten Ausführung
- `result`: Ergebnis der letzten Code-Ausführung

## 🎯 Anwendungsfälle

### Klimasteuerung

```typescript
const temp = parseFloat(hass.states['sensor.outside_temperature'].state);
const humidity = parseFloat(hass.states['sensor.humidity'].state);

// Intelligente Klimaregelung
if (temp > 26 && humidity > 70) {
    await hass.callService('climate', 'set_hvac_mode', {
        entity_id: 'climate.living_room',
        hvac_mode: 'cool'
    });
}

return { temp, humidity, ac_active: temp > 26 };
```

### Lichtautomation

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

### Energiemanagement

```typescript
const power = parseFloat(hass.states['sensor.power_consumption'].state);
const price = parseFloat(hass.states['sensor.electricity_price'].state);

// Energiesparende Geräte bei hohen Preisen
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

## 🔧 Entwicklung

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

## 📝 Lizenz

MIT License - Siehe LICENSE Datei für Details.

## 🤝 Beitragen

Pull Requests sind willkommen! Für größere Änderungen öffnen Sie bitte zuerst ein Issue.

## 📞 Support

- GitHub Issues: [Repository Issues](https://github.com/Nogg-aholic/universal-controller)
- Home Assistant Community: [Forum Thread](https://community.home-assistant.io/)

---

**Universal Controller** - Die ultimative Home Assistant Integration für individuellen TypeScript-Code, HTML-Templates und CSS-Styling! 🚀
