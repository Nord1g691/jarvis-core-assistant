(() => {
  "use strict";
  const HUD_URL = "https://nord1g691.github.io/jarvis-core-assistant/index.html?v=9.5.6";
  const HUD_ORIGIN = "https://nord1g691.github.io";
  class JarvisPanel extends HTMLElement {
    set hass(hass) { this._hass = hass; this._sync(); }
    set narrow(value) { this._narrow = value; }
    set panel(value) { this._panel = value; }
    connectedCallback() {
      if (this._frame) return;
      this.style.cssText = "display:block;width:100%;height:100%;margin:0;padding:0;overflow:hidden";
      this._onMessage = (event) => this._handleMessage(event);
      window.addEventListener("message", this._onMessage);
      this._frame = document.createElement("iframe");
      this._frame.title = "JARVIS V5";
      this._frame.allow = "microphone; camera; autoplay";
      this._frame.style.cssText = "width:100%;height:100%;border:0;display:block;background:#01050c";
      this._frame.src = HUD_URL;
      this.appendChild(this._frame);
      this._frame.addEventListener("load", () => this._sync());
    }
    _states() { return Object.values(this._hass?.states || {}); }
    _sync() {
      if (!this._hass || !this._frame?.contentWindow) return;
      this._frame.contentWindow.postMessage({source:"jarvis-ha",type:"ready",entity_count:this._states().length,states:this._states(),config:this._hass.config||{}},HUD_ORIGIN);
    }
    async _handleMessage(event) {
      if (event.origin !== HUD_ORIGIN || event.source !== this._frame?.contentWindow) return;
      const m = event.data;
      if (!m || m.source !== "jarvis-v9") return;
      if (m.type === "hello") { this._sync(); return; }
      if (m.type !== "request" || !this._hass) return;
      try {
        const req=m.message||{}; let result;
        if(req.type==="get_states") result=this._states();
        else if(req.type==="get_config") result=await this._hass.callWS({type:"get_config"});
        else if(req.type==="get_services") result=await this._hass.callWS({type:"get_services"});
        else if(req.type==="call_service") result=await this._hass.callService(req.domain,req.service,req.service_data||{});
        else if(req.type==="http_request") result=await this._httpRequest(req);
        else throw new Error(`Commande HA non supportée: ${req.type}`);
        this._reply(m.id,{result,success:true});
      } catch(error) { this._reply(m.id,{error:error?.message||String(error),success:false}); }
    }
    async _httpRequest(req) {
      const path=String(req.path||""), method=String(req.method||"GET").toUpperCase();
      if(method==="GET"&&(path==="/api/"||path==="/api")) return {status:200,body:{message:"API running."}};
      if(method==="GET"&&path==="/api/states") return {status:200,body:this._states()};
      if(method==="GET"&&path.startsWith("/api/states/")) {
        const id=decodeURIComponent(path.slice("/api/states/".length)); const state=this._hass.states?.[id];
        return state?{status:200,body:state}:{status:404,body:{message:"Entity not found",entity_id:id}};
      }
      if(method==="GET"&&path==="/api/services") return {status:200,body:await this._hass.callWS({type:"get_services"})};
      const match=path.match(/^\/api\/services\/([^/]+)\/([^/?]+)(?:\?.*)?$/);
      if(match&&method==="POST") {
        let data={}; try{data=req.body?JSON.parse(req.body):{};}catch(_){ }
        return {status:200,body:await this._hass.callService(decodeURIComponent(match[1]),decodeURIComponent(match[2]),data.service_data||data.data||data)||{}};
      }
      return {status:404,body:{message:"API Home Assistant non supportée",path,method}};
    }
    _reply(id,payload) { if(id==null||!this._frame?.contentWindow)return; this._frame.contentWindow.postMessage({source:"jarvis-ha",type:"result",id,...payload},HUD_ORIGIN); }
    disconnectedCallback() { if(this._onMessage)window.removeEventListener("message",this._onMessage); this._frame?.remove(); this._frame=null; }
  }
  if(!customElements.get("jarvis-panel"))customElements.define("jarvis-panel",JarvisPanel);
})();
