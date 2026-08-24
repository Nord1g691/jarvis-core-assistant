(() => {
  "use strict";
  const HUD_URL = "/local/jarvis-v5.html?v=9.5.5";
  class JarvisPanel extends HTMLElement {
    set hass(hass) { this._hass = hass; this._sync(); }
    set narrow(value) { this._narrow = value; }
    set panel(value) { this._panel = value; }
    connectedCallback() {
      if (this._frame) return;
      this.style.cssText = "display:block;width:100%;height:100%;margin:0;padding:0;overflow:hidden";
      this._frame = document.createElement("iframe");
      this._frame.title = "JARVIS V5";
      this._frame.allow = "microphone; camera; autoplay";
      this._frame.style.cssText = "width:100%;height:100%;border:0;display:block;background:#01050c";
      this._frame.src = HUD_URL;
      this.appendChild(this._frame);
      this._frame.addEventListener("load", () => this._sync());
    }
    _sync() {
      if (!this._hass || !this._frame?.contentWindow) return;
      this._frame.contentWindow.postMessage({ source:"jarvis-ha", type:"hass", states:Object.values(this._hass.states || {}), config:this._hass.config || {} }, "*");
    }
    disconnectedCallback() { this._frame?.remove(); this._frame = null; }
  }
  if (!customElements.get("jarvis-panel")) customElements.define("jarvis-panel", JarvisPanel);
})();
