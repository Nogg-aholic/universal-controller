import { LitElement, css, html } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

let UniversalControllerCard = class UniversalControllerCard extends LitElement {
    constructor() {
        super(...arguments);
        this._userCode = '';
        this._htmlTemplate = '';
        this._cssStyles = '';
        this._executionResult = null;
        this._isExecuting = false;
        this._showCodeEditor = false;
        this._entityData = null;
    }
    static get styles() {
        return css `
      :host {
        display: block;
        padding: 16px;
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
    setConfig(config) {
        this.config = config;
        this._showCodeEditor = config.show_code_editor ?? true;
        // Initialize with entity data if available
        this._updateFromEntity();
    }
    firstUpdated() {
        this._updateFromEntity();
        // Set up periodic updates
        const interval = this.config.update_interval || 30000;
        setInterval(() => {
            if (this._userCode.trim()) {
                this._executeCode();
            }
        }, interval);
    }
    updated(changedProps) {
        if (changedProps.has('hass')) {
            this._updateFromEntity();
        }
    }
    _updateFromEntity() {
        if (!this.hass || !this.config.entity)
            return;
        const entity = this.hass.states[this.config.entity];
        if (entity) {
            this._entityData = entity;
            // Load templates from entity attributes
            if (entity.attributes.user_code && !this._userCode) {
                this._userCode = entity.attributes.user_code;
            }
            if (entity.attributes.html_template && !this._htmlTemplate) {
                this._htmlTemplate = entity.attributes.html_template;
            }
            if (entity.attributes.css_styles && !this._cssStyles) {
                this._cssStyles = entity.attributes.css_styles;
            }
        }
    }
    async _executeCode() {
        if (!this._userCode.trim() || this._isExecuting)
            return;
        this._isExecuting = true;
        try {
            // Create execution context
            const context = {
                hass: this.hass,
                states: this.hass.states,
                entity: this._entityData,
                console: {
                    log: (...args) => console.log('[Universal Controller]', ...args),
                    error: (...args) => console.error('[Universal Controller]', ...args),
                }
            };
            // Execute the TypeScript/JavaScript code
            const result = await this._executeUserCode(this._userCode, context);
            this._executionResult = {
                success: true,
                result,
                timestamp: Date.now()
            };
        }
        catch (error) {
            this._executionResult = {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                timestamp: Date.now()
            };
        }
        finally {
            this._isExecuting = false;
        }
    }
    async _executeUserCode(code, context) {
        // Create a safe execution environment
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
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
    async _saveConfiguration() {
        if (!this.config.entity)
            return;
        try {
            await this.hass.callService('universal_controller', 'update_html', {
                entity_id: this.config.entity,
                html: this._htmlTemplate
            });
            await this.hass.callService('universal_controller', 'update_css', {
                entity_id: this.config.entity,
                css: this._cssStyles
            });
            await this.hass.callService('universal_controller', 'execute_code', {
                entity_id: this.config.entity,
                code: this._userCode
            });
        }
        catch (error) {
            console.error('Failed to save configuration:', error);
        }
    }
    _resetToDefaults() {
        this._userCode = this.config.user_code || '';
        this._htmlTemplate = this.config.html_template || '';
        this._cssStyles = this.config.css_styles || '';
        this._executionResult = null;
    }
    _renderCustomContent() {
        if (!this._htmlTemplate || !this._executionResult?.success) {
            return html `<div class="rendered-content">No content to display</div>`;
        }
        try {
            // Simple template rendering (in production, you'd use a proper template engine)
            let renderedHtml = this._htmlTemplate;
            // Replace simple template variables
            if (this._executionResult.result) {
                renderedHtml = renderedHtml.replace(/\{\{\s*data\.(\w+)\s*\}\}/g, (match, key) => this._executionResult?.result?.[key] || '');
            }
            return html `
        <div class="rendered-content">
          <style>${this._cssStyles}</style>
          <div .innerHTML="${renderedHtml}"></div>
        </div>
      `;
        }
        catch (error) {
            return html `<div class="rendered-content error">Template rendering error: ${error}</div>`;
        }
    }
    render() {
        return html `
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
        
        ${this._executionResult ? html `
          <div class="execution-result ${this._executionResult.success ? 'success' : 'error'}">
            ${this._executionResult.success
            ? html `<strong>Execution successful:</strong><br>${JSON.stringify(this._executionResult.result, null, 2)}`
            : html `<strong>Error:</strong> ${this._executionResult.error}`}
          </div>
        ` : ''}
      </div>

      <div class="content-section hidden" id="code-section">
        <h3>TypeScript/JavaScript Code</h3>
        <textarea 
          class="code-editor" 
          .value="${this._userCode}"
          @input="${(e) => this._userCode = e.target.value}"
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
            ${this._isExecuting ? html `<span class="loading"><span class="spinner"></span>Executing...</span>` : 'Execute'}
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
          @input="${(e) => this._htmlTemplate = e.target.value}"
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
          @input="${(e) => this._cssStyles = e.target.value}"
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
    _setActiveTab(tab) {
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
        const tabEl = this.shadowRoot?.querySelectorAll('.tab')[['preview', 'code', 'html', 'css'].indexOf(tab)];
        if (section)
            section.classList.remove('hidden');
        if (tabEl)
            tabEl.classList.add('active');
    }
    getCardSize() {
        return 6;
    }
};
__decorate([
    property({ attribute: false })
], UniversalControllerCard.prototype, "hass", void 0);
__decorate([
    property({ attribute: false })
], UniversalControllerCard.prototype, "config", void 0);
__decorate([
    state()
], UniversalControllerCard.prototype, "_userCode", void 0);
__decorate([
    state()
], UniversalControllerCard.prototype, "_htmlTemplate", void 0);
__decorate([
    state()
], UniversalControllerCard.prototype, "_cssStyles", void 0);
__decorate([
    state()
], UniversalControllerCard.prototype, "_executionResult", void 0);
__decorate([
    state()
], UniversalControllerCard.prototype, "_isExecuting", void 0);
__decorate([
    state()
], UniversalControllerCard.prototype, "_showCodeEditor", void 0);
__decorate([
    state()
], UniversalControllerCard.prototype, "_entityData", void 0);
UniversalControllerCard = __decorate([
    customElement('universal-controller-card')
], UniversalControllerCard);
// Register for the card picker
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'universal-controller-card',
    name: 'Universal Controller Card',
    description: 'A customizable card with TypeScript code execution, HTML templates, and CSS styling',
});

export { UniversalControllerCard };
//# sourceMappingURL=universal-controller-card.js.map
