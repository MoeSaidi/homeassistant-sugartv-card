import { LitElement, html } from 'lit';
import { fireEvent } from 'custom-card-helpers';

import { editorStyles } from './sugartv-card-styles.js';
import { getLocalizer } from './localize.js';

class SugarTvCardEditor extends LitElement {
    static get properties() {
        return {
            hass: { attribute: false },
            config: { type: Object },
        };
    }

    setConfig(config) {
        this.config = config;
    }

    get _glucose_value() {
        return this.config.glucose_value || '';
    }

    get _glucose_trend() {
        return this.config.glucose_trend || '';
    }

    get _show_prediction() {
        return this.config.show_prediction !== false;
    }

    get _unit_override() {
        return this.config.unit_override || 'auto';
    }

    render() {
        if (!this.hass || !this.config) {
            return html``;
        }

        const entities = Object.keys(this.hass.states).filter((eid) =>
            eid.startsWith('sensor.'),
        );
        const localize = getLocalizer(this.config, this.hass);

        return html`
            <div class="card-config">
                <ha-select
                    naturalMenuWidth
                    fixedMenuPosition
                    label="${localize('editor.glucose_value')}"
                    .configValue=${'glucose_value'}
                    .value=${this._glucose_value}
                    @selected=${this._valueChanged}
                    @closed=${(ev) => ev.stopPropagation()}
                >
                    ${entities.map(
                        (entity) =>
                            html`<ha-list-item .value=${entity}
                                >${entity}</ha-list-item
                            >`,
                    )}
                </ha-select>

                <ha-select
                    naturalMenuWidth
                    fixedMenuPosition
                    label="${localize('editor.glucose_trend')}"
                    .configValue=${'glucose_trend'}
                    .value=${this._glucose_trend}
                    @selected=${this._valueChanged}
                    @closed=${(ev) => ev.stopPropagation()}
                >
                    ${entities.map(
                        (entity) =>
                            html`<ha-list-item .value=${entity}
                                >${entity}</ha-list-item
                            >`,
                    )}
                </ha-select>

                <ha-formfield .label=${localize('editor.show_prediction')}>
                    <ha-switch
                        .checked=${this._show_prediction}
                        .configValue=${'show_prediction'}
                        @change=${this._valueChanged}
                    ></ha-switch>
                </ha-formfield>

                <div class="values">
                    <h4>${localize('editor.thresholds')}</h4>
                    <ha-textfield
                        type="number"
                        label="${localize('editor.high_warn')}"
                        .value=${String((this.config.thresholds && this.config.thresholds.high_warn) ?? 11)}
                        .configValue=${'thresholds.high_warn'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                    <ha-textfield
                        type="number"
                        label="${localize('editor.high_crit')}"
                        .value=${String((this.config.thresholds && this.config.thresholds.high_crit) ?? 18)}
                        .configValue=${'thresholds.high_crit'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                    <ha-textfield
                        type="number"
                        label="${localize('editor.low_warn')}"
                        .value=${String((this.config.thresholds && this.config.thresholds.low_warn) ?? 4.9)}
                        .configValue=${'thresholds.low_warn'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                    <ha-textfield
                        type="number"
                        label="${localize('editor.low_crit')}"
                        .value=${String((this.config.thresholds && this.config.thresholds.low_crit) ?? 3.0)}
                        .configValue=${'thresholds.low_crit'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                </div>

                <div class="values">
                    <h4>${localize('editor.colors')}</h4>
                    <ha-textfield
                        label="${localize('editor.normal_bg')}"
                        .value=${(this.config.colors && this.config.colors.normal_bg) || ''}
                        .configValue=${'colors.normal_bg'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                    <ha-textfield
                        label="${localize('editor.normal_text')}"
                        .value=${(this.config.colors && this.config.colors.normal_text) || ''}
                        .configValue=${'colors.normal_text'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                    <ha-textfield
                        label="${localize('editor.warn_bg')}"
                        .value=${(this.config.colors && this.config.colors.warn_bg) || ''}
                        .configValue=${'colors.warn_bg'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                    <ha-textfield
                        label="${localize('editor.warn_text')}"
                        .value=${(this.config.colors && this.config.colors.warn_text) || ''}
                        .configValue=${'colors.warn_text'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                    <ha-textfield
                        label="${localize('editor.crit_bg')}"
                        .value=${(this.config.colors && this.config.colors.crit_bg) || ''}
                        .configValue=${'colors.crit_bg'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                    <ha-textfield
                        label="${localize('editor.crit_text')}"
                        .value=${(this.config.colors && this.config.colors.crit_text) || ''}
                        .configValue=${'colors.crit_text'}
                        @input=${this._valueChanged}
                    ></ha-textfield>
                </div>

                <ha-select
                    naturalMenuWidth
                    fixedMenuPosition
                    label="${localize('editor.unit_override')}"
                    .configValue=${'unit_override'}
                    .value=${this._unit_override}
                    @selected=${this._valueChanged}
                    @closed=${(ev) => ev.stopPropagation()}
                >
                    <ha-list-item value="auto">${localize('units.auto')}</ha-list-item>
                    <ha-list-item value="mg/dL">${localize('units.mgdl')}</ha-list-item>
                    <ha-list-item value="mmol/L">${localize('units.mmoll')}</ha-list-item>
                </ha-select>
            </div>
        `;
    }

    _valueChanged(ev) {
        if (!this.config || !this.hass) {
            return;
        }

        const { target } = ev;

        const path = (target.configValue || '').split('.');
        const newConfig = { ...this.config };
        if (path.length === 1) {
            newConfig[path[0]] =
                target.configValue === 'show_prediction' ? target.checked : target.value;
        } else if (path.length === 2) {
            const [group, key] = path;
            newConfig[group] = { ...(this.config[group] || {}) };
            const v = target.type === 'number' || target.inputMode === 'numeric'
                ? Number(target.value)
                : target.value;
            newConfig[group][key] = v;
        }

        fireEvent(this, 'config-changed', { config: newConfig });
    }

    static get styles() {
        return editorStyles;
    }
}

customElements.define('sugartv-card-editor', SugarTvCardEditor);
