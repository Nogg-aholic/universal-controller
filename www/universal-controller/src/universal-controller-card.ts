import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface HomeAssistant {
  callService: (domain: string, service: string, data?: any) => Promise<any>;
  states: { [key: string]: any };
  config: any;
  connection: any;
}

interface UniversalControllerConfig {
  type: string;
  name?: string;
  ticker_id?: string; // NEW: Connect to a ticker service
  user_code?: string;
  html_template?: string;
  css_styles?: string;
  show_code_editor?: boolean;
  update_interval?: number;
  card_width?: '1/4' | '2/4' | '3/4' | '4/4' | 'auto';
  card_height?: number; // Grid rows (1-10)
}

interface ExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  timestamp: number;
}

// Card registration constants
const CARD_NAME = 'universal-controller-card';

@customElement(CARD_NAME)
export class UniversalControllerCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: UniversalControllerConfig;
  
  @state() private _userCode: string = '';
  @state() private _htmlTemplate: string = '';
  @state() private _cssStyles: string = '';
  @state() private _executionResult: ExecutionResult | null = null;
  @state() private _isExecuting: boolean = false;
  @state() private _showCodeEditor: boolean = false;
  @state() private _cardId: string = '';

  constructor() {
    super();
    // Generate unique ID for this card instance
    this._cardId = `uc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Universal Controller Card created with ID: ${this._cardId}`);
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        /* Dynamic width based on configuration */
        width: var(--card-width, auto);
      }

      :host([data-width="1/4"]) {
        width: 25%;
      }

      :host([data-width="2/4"]) {
        width: 50%;
      }

      :host([data-width="3/4"]) {
        width: 75%;
      }

      :host([data-width="4/4"]) {
        width: 100%;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--divider-color);
      }

      .card-title {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--disabled-text-color);
        transition: background 0.3s ease;
      }

      .status-indicator.success {
        background: var(--success-color);
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
      }

      .status-indicator.error {
        background: var(--error-color);
        box-shadow: 0 0 8px rgba(244, 67, 54, 0.4);
      }

      .tabs {
        display: flex;
        border-bottom: 1px solid var(--divider-color);
        margin-bottom: 16px;
      }

      .tab {
        flex: 1;
        padding: 8px 16px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: var(--secondary-text-color);
        transition: all 0.3s ease;
      }

      .tab.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }

      .tab:hover {
        background: var(--hover-color);
      }

      .content-section {
        margin-bottom: 16px;
      }

      .content-section.hidden {
        display: none;
      }

      .code-editor {
        width: 100%;
        min-height: 200px;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
        background: var(--code-editor-background, #f8f9fa);
        color: var(--primary-text-color);
        resize: vertical;
      }

      .html-editor {
        width: 100%;
        min-height: 150px;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
        background: var(--code-editor-background, #f8f9fa);
        color: var(--primary-text-color);
        resize: vertical;
      }

      .css-editor {
        width: 100%;
        min-height: 120px;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
        background: var(--code-editor-background, #f8f9fa);
        color: var(--primary-text-color);
        resize: vertical;
      }

      .button-group {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .execute-btn {
        padding: 8px 16px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .execute-btn:hover:not(:disabled) {
        background: var(--primary-color-dark);
        transform: translateY(-1px);
      }

      .execute-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .save-btn {
        padding: 8px 16px;
        background: var(--success-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }

      .save-btn:hover {
        background: var(--success-color-dark);
      }

      .reset-btn {
        padding: 8px 16px;
        background: var(--warning-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }

      .execution-result {
        margin-top: 16px;
        padding: 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 14px;
      }

      .execution-result.success {
        background: var(--success-color-light);
        color: var(--success-color-dark);
        border: 1px solid var(--success-color);
      }

      .execution-result.error {
        background: var(--error-color-light);
        color: var(--error-color-dark);
        border: 1px solid var(--error-color);
      }

      .rendered-content {
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 16px;
        margin-top: 12px;
      }

      .loading {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid var(--disabled-text-color);
        border-top: 2px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Dark theme support */
      @media (prefers-color-scheme: dark) {
        .code-editor,
        .html-editor,
        .css-editor {
          background: var(--code-editor-background, #2d2d2d);
          border-color: var(--border-color, #444);
        }
      }
    `;
  }

  public setConfig(config: UniversalControllerConfig): void {
    this.config = config;
    this._showCodeEditor = config.show_code_editor ?? true;
    
    // DON'T initialize with config defaults yet - wait for saved config first
    // Load saved configuration immediately
    this._loadConfiguration();
  }

  protected firstUpdated(): void {
    // Set up periodic updates
    const interval = this.config.update_interval || 30000;
    setInterval(() => {
      if (this._userCode.trim()) {
        this._executeCode();
      }
    }, interval);
  }

  protected updated(changedProps: PropertyValues): void {
    // Card is self-contained, no entity updates needed
    
    if (changedProps.has('config')) {
      // Update width attribute for CSS styling
      if (this.config?.card_width) {
        this.setAttribute('data-width', this.config.card_width);
      }
    }
  }

  private _loadConfiguration(): void {
    console.log(`Loading configuration for card: ${this._cardId}`);
    
    // Set up event listener for service response
    const handleConfigLoaded = (event: any) => {
      if (event.detail.card_id === this._cardId) {
        const config = event.detail.config;
        console.log('Received saved config:', config);
        
        if (config && Object.keys(config).length > 0) {
          // Use saved configuration
          this._userCode = config.user_code || '';
          this._htmlTemplate = config.html_template || '';
          this._cssStyles = config.css_styles || '';
          console.log(`✅ Loaded SAVED configuration for card: ${this._cardId}`);
        } else {
          // Use defaults from config
          this._applyDefaults();
        }
        
        this.requestUpdate();
        
        // Remove event listener after handling
        this.hass.connection?.removeEventListener('universal_controller_config_loaded', handleConfigLoaded);
      }
    };
    
    try {
      // Try to load via service first
      if (this.hass && this.hass.callService) {
        // Add event listener for the service response
        this.hass.connection?.addEventListener('universal_controller_config_loaded', handleConfigLoaded);
        
        // Add timeout fallback
        setTimeout(() => {
          console.warn('Config load timeout, applying defaults');
          this._applyDefaults();
          this.requestUpdate();
        }, 5000);
        
        this.hass.callService('universal_controller', 'load_config', {
          card_id: this._cardId
        }).catch((error: any) => {
          console.warn('Service load failed, trying localStorage:', error);
          this._loadFromLocalStorage();
        });
      } else {
        this._loadFromLocalStorage();
      }
    } catch (error) {
      console.warn('Failed to load via service, trying localStorage:', error);
      this._loadFromLocalStorage();
    }
  }
  
  private _applyDefaults(): void {
    console.log('Applying default configuration values');
    this._userCode = this.config.user_code || '';
    this._htmlTemplate = this.config.html_template || '';
    this._cssStyles = this.config.css_styles || '';
  }
  
  private _loadFromLocalStorage(): void {
    // Fallback to localStorage
    try {
      const storageKey = `universal_controller_${this._cardId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        this._userCode = data.userCode || '';
        this._htmlTemplate = data.htmlTemplate || '';
        this._cssStyles = data.cssStyles || '';
        console.log(`✅ Loaded configuration from localStorage for card: ${this._cardId}`);
      } else {
        // No saved data, use defaults
        this._applyDefaults();
      }
      this.requestUpdate();
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      this._applyDefaults();
      this.requestUpdate();
    }
  }

  private async _executeCode(): Promise<void> {
    if (!this._userCode.trim() || this._isExecuting) return;
    
    this._isExecuting = true;
    
    try {
      // Create execution context
      const context = {
        hass: this.hass,
        states: this.hass.states,
        console: {
          log: (...args: any[]) => console.log('[Universal Controller]', ...args),
          error: (...args: any[]) => console.error('[Universal Controller]', ...args),
        }
      };
      
      // Execute the TypeScript/JavaScript code
      const result = await this._executeUserCode(this._userCode, context);
      
      this._executionResult = {
        success: true,
        result,
        timestamp: Date.now()
      };
      
    } catch (error) {
      this._executionResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now()
      };
    } finally {
      this._isExecuting = false;
    }
  }

  private async _executeUserCode(code: string, context: any): Promise<any> {
    // Create a safe execution environment
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    
    // Prepare the code with context variables
    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);
    
    const wrappedCode = `
      "use strict";
      ${code}
    `;
    
    // Execute the code with the provided context
    const func = new AsyncFunction(...contextKeys, wrappedCode);
    return await func(...contextValues);
  }

  private async _saveConfiguration(): Promise<void> {
    // Use Universal Controller service for persistence
    try {
      await this.hass.callService('universal_controller', 'save_config', {
        card_id: this._cardId,
        user_code: this._userCode,
        html_template: this._htmlTemplate,
        css_styles: this._cssStyles
      });
      
      console.log(`Configuration saved via service for card: ${this._cardId}`);
      
      // Show success notification
      if (this.hass.connection) {
        await this.hass.connection.sendMessagePromise({
          type: 'persistent_notification/create',
          notification_id: `universal_controller_save_${this._cardId}`,
          title: 'Universal Controller',
          message: 'Configuration saved successfully!'
        });
      }
      
    } catch (error) {
      console.error('Failed to save configuration via service:', error);
      
      // Fallback to localStorage
      try {
        const data = {
          userCode: this._userCode,
          htmlTemplate: this._htmlTemplate,
          cssStyles: this._cssStyles,
          timestamp: Date.now()
        };
        const storageKey = `universal_controller_${this._cardId}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
        console.log(`Configuration saved to localStorage for card: ${this._cardId}`);
      } catch (fallbackError) {
        console.error('Failed to save to localStorage:', fallbackError);
        
        // Show error notification
        if (this.hass.connection) {
          await this.hass.connection.sendMessagePromise({
            type: 'persistent_notification/create',
            notification_id: `universal_controller_error_${this._cardId}`,
            title: 'Universal Controller Error',
            message: `Failed to save: ${error}`
          });
        }
      }
    }
  }

  private _resetToDefaults(): void {
    this._userCode = this.config.user_code || '';
    this._htmlTemplate = this.config.html_template || '';
    this._cssStyles = this.config.css_styles || '';
    this._executionResult = null;
  }

  private _renderCustomContent(): any {
    if (!this._htmlTemplate || !this._executionResult?.success) {
      return html`<div class="rendered-content">No content to display</div>`;
    }
    
    try {
      // Simple template rendering (in production, you'd use a proper template engine)
      let renderedHtml = this._htmlTemplate;
      
      // Replace simple template variables
      if (this._executionResult.result) {
        renderedHtml = renderedHtml.replace(
          /\{\{\s*data\.(\w+)\s*\}\}/g,
          (match, key) => this._executionResult?.result?.[key] || ''
        );
      }
      
      return html`
        <div class="rendered-content">
          <style>${this._cssStyles}</style>
          <div .innerHTML="${renderedHtml}"></div>
        </div>
      `;
    } catch (error) {
      return html`<div class="rendered-content error">Template rendering error: ${error}</div>`;
    }
  }

  render() {
    return html`
      <div class="card-header">
        <h2 class="card-title">${this.config.name || 'Universal Controller'}</h2>
        <div class="status-indicator ${this._executionResult?.success ? 'success' : this._executionResult ? 'error' : ''}"></div>
      </div>

      <div class="tabs">
        <button class="tab active" @click="${() => this._setActiveTab('preview')}">Preview</button>
        <button class="tab" @click="${() => this._setActiveTab('code')}">TypeScript</button>
        <button class="tab" @click="${() => this._setActiveTab('html')}">HTML</button>
        <button class="tab" @click="${() => this._setActiveTab('css')}">CSS</button>
      </div>

      <div class="content-section" id="preview-section">
        ${this._renderCustomContent()}
        
        ${this._executionResult ? html`
          <div class="execution-result ${this._executionResult.success ? 'success' : 'error'}">
            ${this._executionResult.success 
              ? html`<strong>Execution successful:</strong><br>${JSON.stringify(this._executionResult.result, null, 2)}`
              : html`<strong>Error:</strong> ${this._executionResult.error}`
            }
          </div>
        ` : ''}
      </div>

      <div class="content-section hidden" id="code-section">
        <h3>TypeScript/JavaScript Code</h3>
        <textarea 
          class="code-editor" 
          .value="${this._userCode}"
          @input="${(e: any) => this._userCode = e.target.value}"
          placeholder="// TypeScript/JavaScript code that runs periodically
// Full access to Home Assistant API

const lights = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('light.')
);

console.log(\`Found \${lights.length} lights\`);

return {
    lights_count: lights.length,
    current_time: new Date().toISOString()
};"
        ></textarea>
        
        <div class="button-group">
          <button class="execute-btn" @click="${this._executeCode}" ?disabled="${this._isExecuting}">
            ${this._isExecuting ? html`<span class="loading"><span class="spinner"></span>Executing...</span>` : 'Execute'}
          </button>
          <button class="save-btn" @click="${this._saveConfiguration}">Save</button>
          <button class="reset-btn" @click="${this._resetToDefaults}">Reset</button>
        </div>
      </div>

      <div class="content-section hidden" id="html-section">
        <h3>HTML Template</h3>
        <textarea 
          class="html-editor" 
          .value="${this._htmlTemplate}"
          @input="${(e: any) => this._htmlTemplate = e.target.value}"
          placeholder="<div class='custom-content'>
  <h3>{{ data.title }}</h3>
  <p>Lights: {{ data.lights_count }}</p>
</div>"
        ></textarea>
      </div>

      <div class="content-section hidden" id="css-section">
        <h3>CSS Styles</h3>
        <textarea 
          class="css-editor" 
          .value="${this._cssStyles}"
          @input="${(e: any) => this._cssStyles = e.target.value}"
          placeholder=".custom-content {
  padding: 16px;
  background: var(--card-background-color);
  border-radius: 8px;
}

.custom-content h3 {
  margin: 0 0 8px 0;
  color: var(--primary-text-color);
}"
        ></textarea>
      </div>
    `;
  }

  private _setActiveTab(tab: string): void {
    // Hide all sections
    this.shadowRoot?.querySelectorAll('.content-section').forEach(section => {
      section.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    this.shadowRoot?.querySelectorAll('.tab').forEach(tabEl => {
      tabEl.classList.remove('active');
    });
    
    // Show selected section and activate tab
    const section = this.shadowRoot?.querySelector(`#${tab}-section`);
    const tabEl = this.shadowRoot?.querySelectorAll('.tab')[
      ['preview', 'code', 'html', 'css'].indexOf(tab)
    ];
    
    if (section) section.classList.remove('hidden');
    if (tabEl) tabEl.classList.add('active');
  }

  getCardSize(): number {
    // Return configurable height (default to 6 if not specified)
    return this.config?.card_height || 6;
  }

  // Required for Home Assistant card picker
  static getConfigElement() {
    return document.createElement('universal-controller-card-editor');
  }

  static getStubConfig() {
    return {
      type: `custom:${CARD_NAME}`,
      name: 'Universal Controller',
      user_code: `// TypeScript/JavaScript code that runs periodically
// Full access to Home Assistant API

const lights = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('light.')
);

console.log(\`Found \${lights.length} lights\`);

return {
    lights_count: lights.length,
    current_time: new Date().toISOString()
};`,
      html_template: `<div class='custom-content'>
  <h3>Universal Controller</h3>
  <p>Lights: {{ data.lights_count }}</p>
  <p>Time: {{ data.current_time }}</p>
</div>`,
      css_styles: `.custom-content {
  padding: 16px;
  background: var(--card-background-color);
  border-radius: 8px;
}

.custom-content h3 {
  margin: 0 0 8px 0;
  color: var(--primary-text-color);
}`
    };
  }
}

// Register the card
declare global {
  interface HTMLElementTagNameMap {
    [CARD_NAME]: UniversalControllerCard;
  }
}

// Register for the card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_NAME,
  name: 'Universal Controller Card',
  preview: false,
  description: 'A customizable card with TypeScript code execution, HTML templates, and CSS styling',
});

// Configuration editor for the card
@customElement('universal-controller-card-editor')
class UniversalControllerCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() private _config!: UniversalControllerConfig;

  public setConfig(config: UniversalControllerConfig): void {
    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="option">
          <ha-textfield
            label="Card Name"
            .value=${this._config.name || ''}
            .configValue=${'name'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="option">
          <label>Card Width:</label>
          <ha-select
            .value=${this._config.card_width || '2/4'}
            .configValue=${'card_width'}
            @selected=${this._valueChanged}
          >
            <mwc-list-item value="1/4">Quarter (25%)</mwc-list-item>
            <mwc-list-item value="2/4">Half (50%)</mwc-list-item>
            <mwc-list-item value="3/4">Three Quarters (75%)</mwc-list-item>
            <mwc-list-item value="4/4">Full Width (100%)</mwc-list-item>
          </ha-select>
        </div>

        <div class="option">
          <ha-textfield
            label="Card Height (grid rows)"
            type="number"
            min="1"
            max="10"
            .value=${this._config.card_height || 3}
            .configValue=${'card_height'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="option">
          <ha-textfield
            label="Update Interval (seconds)"
            type="number"
            min="1"
            max="300"
            .value=${(this._config.update_interval || 30000) / 1000}
            .configValue=${'update_interval_seconds'}
            @input=${this._valueChanged}
          ></ha-textfield>
        </div>

        <div class="option">
          <ha-formfield label="Show Code Editor">
            <ha-checkbox
              .checked=${this._config.show_code_editor !== false}
              .configValue=${'show_code_editor'}
              @change=${this._valueChanged}
            ></ha-checkbox>
          </ha-formfield>
        </div>
      </div>
    `;
  }

  private _valueChanged(ev: any): void {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target;
    const configValue = target.configValue;
    let value = target.type === 'checkbox' ? target.checked : target.value;

    // Convert update interval from seconds to milliseconds
    if (configValue === 'update_interval_seconds') {
      value = parseInt(value) * 1000;
      this._config = {
        ...this._config,
        update_interval: value,
      };
    } else if (configValue === 'card_height') {
      value = parseInt(value);
      this._config = {
        ...this._config,
        [configValue]: value,
      };
    } else {
      this._config = {
        ...this._config,
        [configValue]: value,
      };
    }

    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .option {
        display: flex;
        flex-direction: column;
      }

      .option label {
        margin-bottom: 4px;
        font-weight: 500;
      }
    `;
  }
}

console.info(
  `%c  UNIVERSAL-CONTROLLER-CARD  \n%c Version 1.4.1 `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);
console.log('Universal Controller Card registered:', CARD_NAME);
console.log('customCards:', (window as any).customCards);
