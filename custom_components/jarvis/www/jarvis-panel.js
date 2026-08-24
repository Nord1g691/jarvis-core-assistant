class JarvisPanel extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: "open" });
    this._root.innerHTML = `
      <style>
        :host { display:block; width:100%; height:100%; min-height:100dvh; margin:0; padding:0; overflow:hidden; background:#01050c; }
        iframe { display:block; width:100%; height:100%; min-height:100dvh; border:0; background:#01050c; }
      </style>
      <iframe title="JARVIS" allow="microphone;camera;autoplay"></iframe>
    `;
    this._frame = this._root.querySelector("iframe");
  }

  set hass(value) {
    this._hass = value;
    this._sendHass();
  }

  set narrow(value) { this._narrow = value; }
  set route(value) { this._route = value; }
  set panel(value) { this._panel = value; }

  connectedCallback() {
    // The HUD is only the presentation layer. HA owns authentication/state.
    this._frame.src = "/local/jarvis/index.html?v=9.5.4";
  }

  _sendHass() {
    if (!this._hass || !this._frame?.contentWindow) return;
    this._frame.contentWindow.postMessage({
      source: "jarvis-ha",
      type: "hass",
      states: this._hass.states,
      config: this._hass.config,
      entity_count: Object.keys(this._hass.states || {}).length,
    }, window.location.origin);
  }
}

customElements.define("jarvis-panel", JarvisPanel);
