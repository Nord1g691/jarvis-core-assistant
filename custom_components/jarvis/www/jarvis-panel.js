class JarvisPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>:host{display:block;width:100%;height:100%;min-height:100dvh;overflow:hidden;background:#01050c}iframe{display:block;width:100%;height:100%;border:0;background:#01050c}</style>
      <iframe title="JARVIS" allow="microphone;camera;autoplay"></iframe>`;
    this._frame = this.shadowRoot.querySelector("iframe");
    this._hudOrigin = "https://nord1g691.github.io";
    this._onMessage = (event) => this._handleMessage(event);
  }

  set hass(value) {
    this._hass = value;
    this._sync();
  }
  set narrow(value) { this._narrow = value; }
  set route(value) { this._route = value; }
  set panel(value) { this._panel = value; }

  connectedCallback() {
    window.addEventListener("message", this._onMessage);
    this._frame.src = `https://nord1g691.github.io/jarvis-core-assistant/index.html?v=9.5.4`;
    this._frame.addEventListener("load", () => this._sync(), { once: true });
  }

  disconnectedCallback() {
    window.removeEventListener("message", this._onMessage);
  }

  _states() {
    return Object.values(this._hass?.states || {});
  }

  _sync() {
    if (!this._hass || !this._frame?.contentWindow) return;
    this._frame.contentWindow.postMessage({
      source: "jarvis-ha",
      type: "ready",
      entity_count: this._states().length,
      states: this._states(),
      config: this._hass.config || {},
    }, this._hudOrigin);
  }

  async _handleMessage(event) {
    if (event.origin !== this._hudOrigin || event.source !== this._frame?.contentWindow) return;
    const message = event.data;
    if (!message || message.source !== "jarvis-v9" || message.type !== "request" || !this._hass) return;

    try {
      const request = message.message || {};
      let result;
      switch (request.type) {
        case "get_states":
          result = this._states();
          break;
        case "get_config":
          result = await this._hass.callWS({ type: "get_config" });
          break;
        case "get_services":
          result = await this._hass.callWS({ type: "get_services" });
          break;
        case "call_service":
          result = await this._hass.callService(request.domain, request.service, request.service_data || {});
          break;
        default:
          throw new Error(`Commande HA non supportée: ${request.type}`);
      }
      this._reply(message.id, { result, success: true });
    } catch (error) {
      this._reply(message.id, { error: error?.message || String(error), success: false });
    }
  }

  _reply(id, payload) {
    if (id == null || !this._frame?.contentWindow) return;
    this._frame.contentWindow.postMessage({ source: "jarvis-ha", type: "result", id, ...payload }, this._hudOrigin);
  }
}

customElements.define("jarvis-panel", JarvisPanel);
