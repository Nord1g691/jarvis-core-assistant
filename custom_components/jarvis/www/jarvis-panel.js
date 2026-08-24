(() => {
  "use strict";
  const HUD = "https://nord1g691.github.io/jarvis-core-assistant/native.html?v=9.3.9";
  const HUD_ORIGIN = "https://nord1g691.github.io";

  class JarvisPanel extends HTMLElement {
    set hass(value) { this._hass = value; this._sync(); }
    set narrow(value) { this._narrow = value; }
    set panel(value) { this._panel = value; }
    connectedCallback() {
      this.style.cssText = "display:block;width:100%;height:100dvh;min-height:100dvh;margin:0;padding:0;overflow:hidden;position:relative";
      if (!this._frame) this.render();
    }
    render() {
      if (this._frame) return;
      this.innerHTML = `<iframe title="JARVIS" style="position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#01050c" allow="microphone;camera;autoplay" referrerpolicy="no-referrer"></iframe>`;
      this._frame = this.querySelector("iframe");
      this._onMessage = async (ev) => {
        if (ev.origin !== HUD_ORIGIN || ev.source !== this._frame?.contentWindow || ev.data?.source !== "jarvis-v9") return;
        const m = ev.data;
        if (m.type === "hello") { this._sync(); return; }
        if (m.type !== "request" || !this._hass) return;
        try {
          const msg = m.message || {}; let result;
          if (msg.type === "get_states") result = Object.values(this._hass.states || {});
          else if (msg.type === "get_config") result = await this._hass.callWS({ type: "get_config" });
          else if (msg.type === "get_services") result = await this._hass.callWS({ type: "get_services" });
          else if (msg.type === "call_service") result = await this._hass.callService(msg.domain, msg.service, msg.service_data || {});
          else if (msg.type === "http_request") result = await this._httpRequest(msg);
          else throw new Error(`Commande HA non supportée: ${msg.type}`);
          this._reply(m.id, { result });
        } catch (e) { this._reply(m.id, { error: e?.message || String(e) }); }
      };
      window.addEventListener("message", this._onMessage);
      this._frame.addEventListener("load", () => this._sync());
      this._frame.src = HUD;
    }
    async _httpRequest(msg) {
      const path = String(msg.path || ""), method = String(msg.method || "GET").toUpperCase();
      if (method === "GET" && path === "/api/") return { status: 200, body: await this._hass.callWS({ type: "get_config" }) };
      if (method === "GET" && path === "/api/config") return { status: 200, body: await this._hass.callWS({ type: "get_config" }) };
      if (method === "GET" && path === "/api/states") return { status: 200, body: Object.values(this._hass.states || {}) };
      if (method === "GET" && path.startsWith("/api/states/")) {
        const entityId = decodeURIComponent(path.slice("/api/states/".length)), state = this._hass.states?.[entityId];
        return state ? { status: 200, body: state } : { status: 404, body: { message: "Entity not found", entity_id: entityId } };
      }
      if (method === "GET" && path === "/api/services") return { status: 200, body: await this._hass.callWS({ type: "get_services" }) };
      const match = path.match(/^\/api\/services\/([^/]+)\/([^/?]+)(?:\?.*)?$/);
      if (match && method === "POST") {
        let data = {}; try { data = msg.body ? JSON.parse(msg.body) : {}; } catch (_) {}
        return { status: 200, body: await this._hass.callService(decodeURIComponent(match[1]), decodeURIComponent(match[2]), data.service_data || data.data || data) };
      }
      return { status: 404, body: { message: "API Home Assistant non supportée", path, method } };
    }
    _reply(id, payload) { this._frame?.contentWindow?.postMessage({ source: "jarvis-ha", type: "result", id, ...payload }, HUD_ORIGIN); }
    async _sync() {
      if (!this._frame?.contentWindow || !this._hass) return;
      let payload;
      try { payload = await this._hass.callWS({ type: "jarvis/get_panel_data" }); }
      catch (_) { const states = this._hass.states || {}; payload = { entity_count: Object.keys(states).length, states }; }
      const states = payload?.states || this._hass.states || {}, list = Array.isArray(states) ? states : Object.values(states);
      this._frame.contentWindow.postMessage({ source: "jarvis-ha", type: "ready", entity_count: payload?.entity_count ?? list.length, states: list }, HUD_ORIGIN);
    }
    disconnectedCallback() { if (this._onMessage) window.removeEventListener("message", this._onMessage); }
  }
  customElements.define("jarvis-panel", JarvisPanel);
})();
