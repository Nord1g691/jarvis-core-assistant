(() => {
  "use strict";
  const HUD_URL = "/jarvis_static/jarvis-v5-shell.html?v=9.5.7";
  const HA_ORIGIN = window.location.origin;
  class JarvisPanel extends HTMLElement {
    set hass(hass) { this._hass=hass; this._sync(); }
    set narrow(v) { this._narrow=v; }
    set panel(v) { this._panel=v; }
    connectedCallback() {
      if(this._frame) return;
      this.style.cssText="display:block;width:100%;height:100%;margin:0;padding:0;overflow:hidden";
      this._onMessage=e=>this._handleMessage(e);
      window.addEventListener("message",this._onMessage);
      this._frame=document.createElement("iframe");
      this._frame.title="JARVIS V5";
      this._frame.allow="microphone;camera;autoplay";
      this._frame.style.cssText="width:100%;height:100%;border:0;display:block;background:#01050c";
      this._frame.src=HUD_URL;
      this.appendChild(this._frame);
      this._frame.addEventListener("load",()=>this._sync());
    }
    _states(){return Object.values(this._hass?.states||{});}
    _sync(){
      if(!this._hass||!this._frame?.contentWindow)return;
      this._frame.contentWindow.postMessage({source:"jarvis-ha",type:"ready",entity_count:this._states().length,states:this._states(),config:this._hass.config||{}},HA_ORIGIN);
    }
    async _handleMessage(e){
      if(e.source!==this._frame?.contentWindow)return;
      const m=e.data;
      if(!m||m.source!=="jarvis-v9")return;
      if(m.type==="hello"){this._sync();return;}
      if(m.type!=="request"||!this._hass)return;
      try{
        const r=m.message||{};let result;
        if(r.type==="get_states")result=this._states();
        else if(r.type==="get_config")result=await this._hass.callWS({type:"get_config"});
        else if(r.type==="get_services")result=await this._hass.callWS({type:"get_services"});
        else if(r.type==="call_service")result=await this._hass.callService(r.domain,r.service,r.service_data||{});
        else if(r.type==="http_request")result=await this._httpRequest(r);
        else throw new Error("Commande HA non supportée: "+r.type);
        this._reply(m.id,{result,success:true});
      }catch(err){this._reply(m.id,{error:err?.message||String(err),success:false});}
    }
    async _httpRequest(r){
      const p=String(r.path||""),m=String(r.method||"GET").toUpperCase();
      if(m==="GET"&&(p==="/api"||p==="/api/"))return{status:200,body:{message:"API running."}};
      if(m==="GET"&&p==="/api/states")return{status:200,body:this._states()};
      if(m==="GET"&&p.startsWith("/api/states/")){const id=decodeURIComponent(p.slice(12));const s=this._hass.states?.[id];return s?{status:200,body:s}:{status:404,body:{message:"Entity not found",entity_id:id}};}
      if(m==="GET"&&p==="/api/services")return{status:200,body:await this._hass.callWS({type:"get_services"})};
      const x=p.match(/^\/api\/services\/([^/]+)\/([^/?]+)/);
      if(x&&m==="POST"){let d={};try{d=r.body?JSON.parse(r.body):{};}catch(_){}return{status:200,body:await this._hass.callService(decodeURIComponent(x[1]),decodeURIComponent(x[2]),d.service_data||d.data||d)||{}};}
      return{status:404,body:{message:"API Home Assistant non supportée",path:p,method:m}};
    }
    _reply(id,p){if(id==null)return;this._frame?.contentWindow?.postMessage({source:"jarvis-ha",type:"result",id,...p},HA_ORIGIN);}
    disconnectedCallback(){if(this._onMessage)window.removeEventListener("message",this._onMessage);this._frame?.remove();this._frame=null;}
  }
  if(!customElements.get("jarvis-panel"))customElements.define("jarvis-panel",JarvisPanel);
})();
