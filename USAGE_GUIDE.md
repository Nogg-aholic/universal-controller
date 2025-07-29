# Universal Controller Usage Guide

## Problem Resolution

If your Universal Controller card only shows the name and doesn't display code editors or save configurations, you have two options:

## Option 1: Use Without Ticker (Standalone Mode)

Add the card to your dashboard with minimal configuration:

```yaml
type: custom:universal-controller-card
name: My Controller
show_code_editor: true
```

This will:
- Show default TypeScript/HTML/CSS code
- Allow editing and saving configurations
- Work independently without requiring a ticker service

## Option 2: Use With Ticker (Recommended)

### Step 1: Create a Ticker Service
Use Home Assistant's Developer Tools > Services to create a ticker:

**Service:** `universal_controller.create_ticker`
**Data:**
```yaml
ticker_id: my_first_ticker
name: My First Ticker
```

### Step 2: Connect Card to Ticker
Add the card to your dashboard:

```yaml
type: custom:universal-controller-card
name: My Controller
ticker_id: my_first_ticker
show_code_editor: true
```

## Default Example Code

When properly configured, you'll see:

**TypeScript Code:**
```typescript
// TypeScript/JavaScript code that runs periodically
// Full access to Home Assistant API

const lights = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('light.')
);

console.log(`Found ${lights.length} lights`);

return {
    lights_count: lights.length,
    current_time: new Date().toISOString()
};
```

**HTML Template:**
```html
<div class="universal-controller">
  <h3>Universal Controller</h3>
  <p>Lights found: {{lights_count}}</p>
  <p>Current time: {{current_time}}</p>
</div>
```

**CSS Styles:**
```css
.universal-controller {
  background: var(--card-background-color);
  border-radius: 8px;
  padding: 16px;
  color: var(--primary-text-color);
}

.universal-controller h3 {
  margin-top: 0;
  color: var(--primary-color);
}
```

## Troubleshooting

1. **Card shows only name:** Make sure you have `show_code_editor: true` in your card config
2. **No save button:** The code editors should appear with tabs for TypeScript, HTML, and CSS
3. **Save doesn't work:** Check browser console for errors and make sure the Universal Controller integration is properly installed

## Service Commands

- `universal_controller.create_ticker` - Create a new ticker
- `universal_controller.update_ticker` - Update ticker configuration
- `universal_controller.get_ticker` - Get ticker details
- `universal_controller.list_tickers` - List all tickers
- `universal_controller.delete_ticker` - Delete a ticker
