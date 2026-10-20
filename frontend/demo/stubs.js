// Minimal stand-ins for Home Assistant's built-in elements, used by the demo pages.

const ICONS = {
  'mdi:flash': 'M7,2V13H10V22L17,10H13L17,2H7Z',
  'mdi:thermometer': 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z',
  'mdi:server-network': 'M13,18H14A1,1 0 0,1 15,19H22V21H15A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21H2V19H9A1,1 0 0,1 10,18H11V16H4A1,1 0 0,1 3,15V11A1,1 0 0,1 4,10H20A1,1 0 0,1 21,11V15A1,1 0 0,1 20,16H13V18M4,2H20A1,1 0 0,1 21,3V7A1,1 0 0,1 20,8H4A1,1 0 0,1 3,7V3A1,1 0 0,1 4,2M9,6H10V4H9V6M9,14H10V12H9V14M5,4V6H7V4H5M5,12V14H7V12H5Z'
};

export function installStubs() {
  if (customElements.get('ha-card')) return;

  customElements.define('ha-card', class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML =
        '<style>:host{display:block;border:1px solid var(--divider-color);border-radius:var(--ha-card-border-radius);}</style><slot></slot>';
    }
  });

  customElements.define('ha-icon', class extends HTMLElement {
    static get observedAttributes() { return ['icon']; }
    set icon(v) { this._icon = v; this._render(); }
    get icon() { return this._icon; }
    attributeChangedCallback(_n, _o, v) { this.icon = v; }
    connectedCallback() { this._render(); }
    _render() {
      const d = ICONS[this._icon || this.getAttribute('icon')] || '';
      this.style.display = 'inline-flex';
      this.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="${d}"/></svg>`;
    }
  });

  // HA provides this for layout cards (used by the grid card)
  window.loadCardHelpers = async () => ({
    createCardElement: (cfg) => {
      const el = document.createElement(cfg.type.replace('custom:', ''));
      el.setConfig(cfg);
      return el;
    }
  });
}

/** Fake `hass`: cards never reach it in demo mode, so callWS just fails loudly. */
export const createHass = (language = 'en') => ({
  language,
  locale: { language, number_format: 'language' },
  themes: { darkMode: true },
  states: {},
  config: { unit_system: {} },
  callWS: async (msg) => { throw new Error(`backend called in demo: ${msg.type}`); }
});
