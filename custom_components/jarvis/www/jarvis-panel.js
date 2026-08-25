(() => {
  "use strict";

  const HUD_URL = "/jarvis_static/v5-original.html?v=9.5.3";
  const HA_ORIGIN = window.location.origin;

  class JarvisPanel extends HTMLElement {
    set hass(hass) {
      this._hass = hass;
      this._sync();
    }
    set narrow(v) { this._narrow = v; }
    set panel(v) { this._panel = v; }

    connectedCallback() {
      if (this._frame) return;
      this.style.cssText = "display:block;width:100%;height:100%;margin:0;padding:0;overflow:hidden;position:relative";
      this._onMessage = e => this._handleMessage(e);
      window.addEventListener("message", this._onMessage);
      this._frame = document.createElement("iframe");
      this._frame.title = "JARVIS V5";
      this._frame.allow = "microphone; camera; autoplay";
      this._frame.setAttribute("frameborder", "0");
      this._frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#01050c";
      this._frame.src = HUD_URL;
      this.appendChild(this._frame);
      this._frame.addEventListener("load", () => this._sync());
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
        config: this._hass.config || {}
      }, HA_ORIGIN);
    }

    async _handleMessage(event) {
      if (event.source !== this._frame?.contentWindow) return;
      const m = event.data;
      if (!m || m.source !== "jarvis-v9") return;

      if (m.type === "hello") {
        this._sync();
        return;
      }

      if (m.type !== "request" || !this._hass) return;

      try {
        const r = m.message || {};
        let result;

        if (r.type === "get_states") {
          result = this._states();
        } else if (r.type === "get_panel_data") {
          result = await this._hass.callWS({ type: "jarvis/get_panel_data" });
        } else if (r.type === "get_config") {
          result = await this._hass.callWS({ type: "get_config" });
        } else if (r.type === "get_services") {
          result = await this._hass.callWS({ type: "get_services" });
        } else if (r.type === "call_service") {
          result = await this._hass.callService(r.domain, r.service, r.service_data || {});
        } else {
          throw new Error("Commande HA non supportée: " + r.type);
        }

        this._reply(m.id, { result, success: true });
      } catch (error) {
        this._reply(m.id, { error: error?.message || String(error), success: false });
      }
    }

    _reply(id, payload) {
      if (id == null) return;
      this._frame?.contentWindow?.postMessage({
        source: "jarvis-ha",
        type: "result",
        id,
        ...payload
      }, HA_ORIGIN);
    }

    disconnectedCallback() {
      if (this._onMessage) window.removeEventListener("message", this._onMessage);
      this._frame?.remove();
      this._frame = null;
    }
  }

  if (!customElements.get("jarvis-panel")) {
    customElements.define("jarvis-panel", JarvisPanel);
  }
})();
