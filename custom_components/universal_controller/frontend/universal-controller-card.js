// Universal Controller Card for Home Assistant
class UniversalControllerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._activeTab = 'code';
    this._userCode = '';
    this._htmlTemplate = '';
    this._cssStyles = '';
    this._executionResult = null;
    this._isExecuting = false;
  }

  static getConfigElement() {
    return document.createElement('universal-controller-card-editor');
  }

  static getStubConfig() {
    return {
      entity: '',
      name: 'Universal Controller',
      show_header_toggle: false,
      user_code: '',
      html_template: '',
      css_styles: ''
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this._config = config;
    
    // Load persistent configuration from config
    this._userCode = config.user_code || '';
    this._htmlTemplate = config.html_template || '';
    this._cssStyles = config.css_styles || '';
    
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this._config || !this._hass) {
      return;
    }

    const entity = this._config.entity ? this._hass.states[this._config.entity] : null;
    const name = this._config.name || 'Universal Controller';

    // Render HTML template if available
    let renderedHtml = '';
    if (this._htmlTemplate && this._executionResult && this._executionResult.success && this._executionResult.data) {
      renderedHtml = this.renderTemplate(this._htmlTemplate, this._executionResult.data);
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          background: var(--card-background-color);
          border-radius: var(--ha-card-border-radius);
          box-shadow: var(--ha-card-box-shadow);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          font-size: 16px;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        
        .tabs {
          display: flex;
          border-bottom: 1px solid var(--divider-color);
          margin-bottom: 16px;
        }
        
        .tab {
          flex: 1;
          padding: 12px;
          text-align: center;
          cursor: pointer;
          border: none;
          background: none;
          color: var(--secondary-text-color);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        
        .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }
        
        .tab:hover {
          background: var(--paper-listbox-background-color);
        }
        
        .tab-content {
          display: none;
        }
        
        .tab-content.active {
          display: block;
        }
        
        .editor {
          width: 100%;
          min-height: 200px;
          padding: 12px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--code-editor-background-color, var(--primary-background-color));
          color: var(--primary-text-color);
          font-family: 'Roboto Mono', monospace;
          font-size: 14px;
          resize: vertical;
        }
        
        .actions {
          margin-top: 16px;
          display: flex;
          gap: 8px;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .btn-primary {
          background: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover {
          background: var(--primary-color-dark);
        }
        
        .btn-secondary {
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color);
        }
        
        .btn-secondary:hover {
          background: var(--divider-color);
        }
        
        .result {
          margin-top: 16px;
          padding: 12px;
          border-radius: 4px;
          background: var(--secondary-background-color);
          border-left: 4px solid var(--primary-color);
        }
        
        .result.error {
          border-left-color: var(--error-color);
          background: var(--error-color-background, #fef2f2);
        }
        
        .result.success {
          border-left-color: var(--success-color);
          background: var(--success-color-background, #f0fdf4);
        }
        
        .entity-info {
          margin-bottom: 16px;
          padding: 12px;
          background: var(--secondary-background-color);
          border-radius: 4px;
          font-size: 14px;
        }
        
        .loading {
          opacity: 0.6;
          pointer-events: none;
        }
        
        .rendered-output {
          margin-top: 16px;
          padding: 16px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          background: var(--card-background-color);
        }
        
        /* Apply user CSS styles to rendered output */
        ${this._cssStyles}
      </style>

      <div class="card-header">
        <div>${name}</div>
        ${entity ? `<div class="entity-info">Entity: ${entity.entity_id} (${entity.state})</div>` : ''}
      </div>

      ${renderedHtml ? `
        <div class="rendered-output">
          ${renderedHtml}
        </div>
      ` : ''}

      <div class="tabs">
        <button class="tab ${this._activeTab === 'code' ? 'active' : ''}" onclick="this.getRootNode().host.setActiveTab('code')">
          TypeScript/JavaScript
        </button>
        <button class="tab ${this._activeTab === 'html' ? 'active' : ''}" onclick="this.getRootNode().host.setActiveTab('html')">
          HTML Template
        </button>
        <button class="tab ${this._activeTab === 'css' ? 'active' : ''}" onclick="this.getRootNode().host.setActiveTab('css')">
          CSS Styles
        </button>
      </div>

      <div class="tab-content ${this._activeTab === 'code' ? 'active' : ''}">
        <textarea 
          class="editor" 
          placeholder="Enter your TypeScript/JavaScript code here...
// Access Home Assistant:
// - hass.states for entity states
// - hass.services for calling services
// - console.log() for debugging

// Example:
const temperature = hass.states['sensor.temperature'];
console.log('Temperature:', temperature.state);

// Call a service:
hass.services.call('light', 'turn_on', {
  entity_id: 'light.living_room'
});"
          oninput="this.getRootNode().host.updateCode(this.value)"
        >${this._userCode}</textarea>
      </div>

      <div class="tab-content ${this._activeTab === 'html' ? 'active' : ''}">
        <textarea 
          class="editor" 
          placeholder="Enter your HTML template here...
<!-- Use template variables -->
<div class=&quot;sensor-display&quot;>
  <h3>{{sensor_name}}</h3>
  <div class=&quot;value&quot;>{{sensor_value}} {{unit}}</div>
  <div class=&quot;timestamp&quot;>{{timestamp}}</div>
</div>"
          oninput="this.getRootNode().host.updateHtml(this.value)"
        >${this._htmlTemplate}</textarea>
      </div>

      <div class="tab-content ${this._activeTab === 'css' ? 'active' : ''}">
        <textarea 
          class="editor" 
          placeholder="Enter your CSS styles here...
.sensor-display {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.value {
  font-size: 2em;
  font-weight: bold;
  margin: 10px 0;
}"
          oninput="this.getRootNode().host.updateCss(this.value)"
        >${this._cssStyles}</textarea>
      </div>

      <div class="actions">
        <button class="btn btn-primary" onclick="this.getRootNode().host.executeCode()" ${this._isExecuting ? 'disabled' : ''}>
          ${this._isExecuting ? 'Executing...' : 'Execute Code'}
        </button>
        <button class="btn btn-secondary" onclick="this.getRootNode().host.saveConfiguration()">
          Save Configuration
        </button>
        <button class="btn btn-secondary" onclick="this.getRootNode().host.clearResults()">
          Clear Results
        </button>
      </div>

      ${this._executionResult ? `
        <div class="result ${this._executionResult.success ? 'success' : 'error'}">
          <strong>${this._executionResult.success ? 'Success' : 'Error'}:</strong>
          <pre>${this._executionResult.message}</pre>
        </div>
      ` : ''}
    `;
  }

  setActiveTab(tab) {
    this._activeTab = tab;
    this.render();
  }

  updateCode(code) {
    this._userCode = code;
    this.updateConfig();
  }

  updateHtml(html) {
    this._htmlTemplate = html;
    this.updateConfig();
  }

  updateCss(css) {
    this._cssStyles = css;
    this.updateConfig();
    this.render(); // Re-render to apply new CSS
  }

  updateConfig() {
    // Update the card config to persist changes
    if (this._config) {
      this._config.user_code = this._userCode;
      this._config.html_template = this._htmlTemplate;
      this._config.css_styles = this._cssStyles;
    }
  }

  async executeCode() {
    if (!this._hass || this._isExecuting) return;

    this._isExecuting = true;
    this.render();

    try {
      const context = {
        hass: this._hass,
        entity: this._config.entity ? this._hass.states[this._config.entity] : null,
        console: {
          log: (...args) => {
            console.log('[Universal Controller]', ...args);
          }
        }
      };

      const result = await this.safeExecuteCode(this._userCode, context);
      
      this._executionResult = {
        success: true,
        message: `Code executed successfully.`,
        data: result // Store the result data for template rendering
      };

    } catch (error) {
      console.error('Code execution error:', error);
      this._executionResult = {
        success: false,
        message: error.message,
        data: null
      };
    } finally {
      this._isExecuting = false;
      this.render(); // Re-render to show results and HTML template
    }
  }

  async safeExecuteCode(code, context) {
    const func = new Function('hass', 'entity', 'console', `
      return (async () => {
        ${code}
      })();
    `);

    return await func(context.hass, context.entity, context.console);
  }

  renderTemplate(template, data) {
    if (!template || !data) return '';
    
    let rendered = template;
    
    // Simple template variable replacement
    // Replace {{variable}} with data.variable
    rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
    
    return rendered;
  }

  async saveConfiguration() {
    if (!this._hass) return;

    try {
      // Update the card configuration
      this.updateConfig();
      
      // Fire a custom event to save the card configuration
      const event = new CustomEvent('config-changed', {
        detail: { config: this._config },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);

      // Also save to the integration if entity is specified
      if (this._config.entity) {
        await this._hass.callService('universal_controller', 'execute_code', {
          entity_id: this._config.entity,
          code: this._userCode
        });

        await this._hass.callService('universal_controller', 'update_html', {
          entity_id: this._config.entity,
          html: this._htmlTemplate
        });

        await this._hass.callService('universal_controller', 'update_css', {
          entity_id: this._config.entity,
          css: this._cssStyles
        });
      }

      this._executionResult = {
        success: true,
        message: 'Configuration saved successfully!',
        data: null
      };
      this.render();

    } catch (error) {
      console.error('Save error:', error);
      this._executionResult = {
        success: false,
        message: `Failed to save configuration: ${error.message}`,
        data: null
      };
      this.render();
    }
  }

  clearResults() {
    this._executionResult = null;
    this.render();
  }

  getCardSize() {
    return 6;
  }
}

// Register the custom element
customElements.define('universal-controller-card', UniversalControllerCard);

// Register with Home Assistant card registry
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'universal-controller-card',
  name: 'Universal Controller Card',
  description: 'A universal controller with TypeScript/JavaScript code execution, HTML templates, and CSS styling.',
  preview: false,
  documentationURL: 'https://github.com/Nogg-aholic/universal-controller',
});

console.log('Universal Controller Card loaded successfully!');
