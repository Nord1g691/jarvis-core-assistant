(() => {
  "use strict";

  // Single runtime owner: the V5 HUD iframe owns the complete V9 UI/runtime.
  // The HA panel only transports HA state/messages to that iframe.
  const ASSET_VERSION = "9.6.5";
  const HUD_URL = `/jarvis_static/v5-original.html?v=${ASSET_VERSION}`;
  const ORIGIN = window.location.origin;

  const V9_SCRIPTS = [
    `/jarvis_static/v9/loader.js?v=${ASSET_VERSION}`,
    `/jarvis_static/v9/v9-v5-ui.js?v=${ASSET_VERSION}`,
  ];

  class JarvisPanel extends HTMLElement {
    set hass(value) {
      this._hass = value;
      this._sync();
    }

    connectedCallback() {
      if (this._iframe) return;

      this.style.cssText = [
        "display:block",
        "width:100%",
        "height:100%",
        "margin:0",
        "padding:0",
        "overflow:hidden",
        "position:relative",
        "background:#01050c",
      ].join(";");

      this._onMessage = (event) => this._handleMessage(event);
      window.addEventListener("message", this._onMessage);

      const frame = document.createElement("iframe");
      frame.title = "JARVIS";
      frame.setAttribute("allow", "microphone; camera; autoplay");
      frame.setAttribute("frameborder", "0");
      frame.style.cssText = [
        "position:absolute",
        "inset:0",
        "width:100%",
        "height:100%",
        "border:0",
        "display:block",
        "background:#01050c",
      ].join(";");
      frame.src = HUD_URL;

      this._iframe = frame;
      this.appendChild(frame);

      frame.addEventListener("load", () => this._bootHud(), { once: true });
    }

    disconnectedCallback() {
      if (this._onMessage) {
        window.removeEventListener("message", this._onMessage);
      }
      if (this._iframe) this._iframe.remove();
      this._iframe = null;
    }

    _states() {
      return this._hass?.states ? Object.values(this._hass.states) : [];
    }

    _sync() {
      if (!this._hass || !this._iframe?.contentWindow) return;

      this._iframe.contentWindow.postMessage(
        {
          source: "jarvis-ha",
          type: "ready",
          entity_count: this._states().length,
          states: this._states(),
          config: this._hass.config || {},
        },
        ORIGIN,
      );
    }

    _bootHud() {
      const frame = this._iframe;
      const win = frame?.contentWindow;
      const doc = frame?.contentDocument;
      if (!win || !doc?.head) return;

      // The previous implementation loaded V9 beside the iframe, while the
      // actual HUD remained V5. That made the new UI invisible in HACS.
      // V9 must execute INSIDE the HUD iframe so it can mount its controls.
      const inject = (src, id) => new Promise((resolve) => {
        if (doc.getElementById(id)) {
          resolve(true);
          return;
        }

        const script = doc.createElement("script");
        script.id = id;
        script.src = src;
        script.async = false;
        script.onload = () => resolve(true);
        script.onerror = () => {
          console.error("JARVIS: failed to load HUD asset", src);
          resolve(false);
        };
        doc.head.appendChild(script);
      });

      (async () => {
        for (let i = 0; i < V9_SCRIPTS.length; i += 1) {
          await inject(V9_SCRIPTS[i], `jarvis-v9-panel-${i}`);
        }

        // Native HA bridge belongs to the same iframe/runtime owner.
        await inject(
          `/jarvis_static/v9/native-bridge.js?v=${ASSET_VERSION}`,
          "jarvis-native-bridge",
        );

        win.dispatchEvent(
          new CustomEvent("jarvis:ha-panel-ready", {
            detail: { version: ASSET_VERSION },
          }),
        );

        this._sync();
      })().catch((error) => {
        console.error("JARVIS HUD bootstrap failed", error);
        this._sync();
      });
    }

    async _handleMessage(event) {
      if (!this._iframe || event.source !== this._iframe.contentWindow) return;

      const message = event.data;
      if (!message || message.source !== "jarvis-v9") return;

      if (message.type === "hello") {
        this._sync();
        return;
      }

      if (message.type !== "request" || !this._hass) return;

      try {
        const request = message.message || {};
        let result;

        switch (request.type) {
          case "get_states":
            result = this._states();
            break;

          case "get_panel_data":
            result = await this._hass.callWS({ type: "jarvis/get_panel_data" });
            break;

          case "get_config":
            result = await this._hass.callWS({ type: "get_config" });
            break;

          case "get_services":
            result = await this._hass.callWS({ type: "get_services" });
            break;

          case "call_service":
            result = await this._hass.callService(
              request.domain,
              request.service,
              request.service_data || {},
            );
            break;

          case "http_request":
            result = await this._httpRequest(request);
            break;

          default:
            throw new Error(`Commande HA non supportée: ${request.type}`);
        }

        this._reply(message.id, true, result, null);
      } catch (error) {
        this._reply(
          message.id,
          false,
          null,
          error?.message ? error.message : String(error),
        );
      }
    }

    async _httpRequest(request) {
      const path = String(request.path || "");
      const method = String(request.method || "GET").toUpperCase();

      if (method === "GET" && (path === "/api" || path === "/api/")) {
        return { status: 200, body: { message: "API running." } };
      }

      if (method === "GET" && path === "/api/states") {
        return { status: 200, body: this._states() };
      }

      if (method === "GET" && path.startsWith("/api/states/")) {
        const entityId = decodeURIComponent(path.slice("/api/states/".length));
        const state = this._hass.states?.[entityId];
        return state
          ? { status: 200, body: state }
          : {
              status: 404,
              body: { message: "Entity not found", entity_id: entityId },
            };
      }

      if (method === "GET" && path === "/api/services") {
        return {
          status: 200,
          body: await this._hass.callWS({ type: "get_services" }),
        };
      }

      const match = path.match(/^\/api\/services\/([^/]+)\/([^/?]+)/);
      if (match && method === "POST") {
        let data = {};
        try {
          data = request.body ? JSON.parse(request.body) : {};
        } catch (_) {
          data = {};
        }

        const serviceData = data.service_data || data.data || data;
        const result = await this._hass.callService(
          decodeURIComponent(match[1]),
          decodeURIComponent(match[2]),
          serviceData,
        );

        return { status: 200, body: result || {} };
      }

      return {
        status: 404,
        body: {
          message: "API Home Assistant non supportée",
          path,
          method,
        },
      };
    }

    _reply(id, success, result, error) {
      if (id == null || !this._iframe?.contentWindow) return;

      this._iframe.contentWindow.postMessage(
        {
          source: "jarvis-ha",
          type: "result",
          id,
          success,
          result,
          error,
        },
        ORIGIN,
      );
    }
  }

  if (!customElements.get("jarvis-panel")) {
    customElements.define("jarvis-panel", JarvisPanel);
  }
})();
